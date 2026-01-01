/**
 * Figma Token Sync - Unidirectional sync from code to Figma
 *
 * This script is the single source of truth for Figma design tokens.
 * It purges all existing variables and recreates them from the codebase.
 *
 * Usage:
 *   FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
 *   FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts get
 *
 * Environment Variables:
 *   FIGMA_TOKEN (required) - Figma personal access token
 *   FIGMA_FILE_KEY (optional) - Target Figma file, defaults to kumo file
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";
import {
  parseCssTokensFromFile,
  parseTypographyTokensFromFile,
  type ParsedToken,
  type ParsedTypographyToken,
} from "./parse-css.js";
import { resolveColor } from "./color-utils.js";
import {
  syncAllToFigma,
  getLocalVariables,
  type ResolvedToken,
  type ResolvedTypographyToken,
  type ExtendedMode,
  type FigmaColorInput,
} from "./figma-api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, ".env");

/**
 * Token sources for the base collection
 */
const TOKEN_SOURCES = [
  {
    name: "kumo",
    cssPath: resolve(__dirname, "../../src/styles/theme-kumo.css"),
    parseOptions: {
      includeGlobalTokens: true,
      includeLayerOverrides: false,
    },
  },
  {
    name: "fedramp-global",
    cssPath: resolve(__dirname, "../../src/styles/theme-fedramp.css"),
    parseOptions: {
      includeGlobalTokens: true,
      includeLayerOverrides: false,
      tokenPrefix: "fedramp",
    },
  },
];

/**
 * Extended modes configuration
 * Each extended mode inherits all base tokens and can override specific values
 */
const EXTENDED_MODES = [
  {
    name: "fedramp",
    overrideCssPath: resolve(__dirname, "../../src/styles/theme-fedramp.css"),
  },
];

// Load .env file if it exists
if (existsSync(ENV_PATH)) {
  const envContent = readFileSync(ENV_PATH, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// Read environment variables
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || "sKKZc6pC6W1TtzWBLxDGSU";

/**
 * Parse CLI arguments
 */
function parseArgs(): { command: "sync" | "get"; collection?: string } {
  const args = process.argv.slice(2);
  let command: "sync" | "get" = "sync";
  let collection: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "get") {
      command = "get";
    } else if (arg === "--collection" && args[i + 1]) {
      collection = args[++i];
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return { command, collection };
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Figma Token Sync - Unidirectional sync from code to Figma

This script is the SINGLE SOURCE OF TRUTH for Figma design tokens.
Running sync will PURGE all existing variables and recreate them.

Usage:
  npx tsx sync-tokens-to-figma.ts [command] [options]

Commands:
  sync (default)    Purge and recreate all tokens in Figma
  get               Fetch and display existing Figma variables

Options:
  --collection <name>  Filter get results by collection name
  --help, -h           Show this help message

Environment Variables:
  FIGMA_TOKEN (required)   Figma personal access token
  FIGMA_FILE_KEY           Target Figma file key

Examples:
  # Sync all tokens (purges existing, creates fresh)
  FIGMA_TOKEN="..." npx tsx sync-tokens-to-figma.ts

  # Get all Figma variables
  FIGMA_TOKEN="..." npx tsx sync-tokens-to-figma.ts get
`);
}

/**
 * Converts a ParsedToken to a ResolvedToken with Figma RGB colors
 */
function resolveToken(token: ParsedToken): ResolvedToken {
  return {
    name: token.name,
    light: resolveColor(token.lightValue),
    dark: resolveColor(token.darkValue),
  };
}

/**
 * Opacity modifiers used in the codebase (bg-color/opacity patterns)
 * These are scanned from component source files to generate Figma variables.
 *
 * Format: { baseColor: [opacityValues] }
 * Example: { "info": [20], "error": [20, 70, 90] }
 */
const OPACITY_MODIFIERS: Record<string, number[]> = {
  // Banner variants: bg-info/20, bg-alert/20, bg-error/20
  info: [20],
  alert: [20],
  error: [20, 70, 90],
  // Button variants: bg-primary/50, bg-primary/70, bg-secondary/50
  primary: [50, 70],
  secondary: [50],
  // DateRangePicker: bg-calendar-day-range-selected/85
  "calendar-day-range-selected": [85],
};

/**
 * Generate opacity variant tokens from base tokens
 *
 * For each base color token that has opacity modifiers defined,
 * creates additional tokens with the opacity baked into the alpha channel.
 *
 * Example: color-info + opacity 20 → color-info/20 with alpha 0.2
 */
function generateOpacityVariants(baseTokens: ResolvedToken[]): ResolvedToken[] {
  const opacityTokens: ResolvedToken[] = [];

  for (const token of baseTokens) {
    // Extract base color name from token (e.g., "color-info" → "info", "color-calendar-day-range-selected" → "calendar-day-range-selected")
    const colorMatch = token.name.match(/^color-([\w-]+)$/);
    if (!colorMatch) continue;

    const colorName = colorMatch[1];
    const opacities = OPACITY_MODIFIERS[colorName];
    if (!opacities) continue;

    // Generate a token for each opacity level
    for (const opacity of opacities) {
      const alpha = opacity / 100;
      opacityTokens.push({
        name: `${token.name}/${opacity}`,
        light: { ...token.light, a: alpha },
        dark: { ...token.dark, a: alpha },
      });
    }
  }

  return opacityTokens;
}

/**
 * Validate that FIGMA_TOKEN is set and return it
 */
function getValidatedToken(): string {
  if (!FIGMA_TOKEN) {
    console.error("❌ Error: FIGMA_TOKEN environment variable is required");
    console.error("");
    console.error("Usage:");
    console.error(
      '  FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts',
    );
    console.error("");
    console.error(
      "Get a token at: https://www.figma.com/developers/api#authentication",
    );
    process.exit(1);
  }
  return FIGMA_TOKEN;
}

/**
 * Get command - fetch and display existing Figma variables
 */
async function runGetCommand(collectionFilter?: string): Promise<void> {
  const token = getValidatedToken();

  console.log(`🔍 Fetching Figma variables from file: ${FIGMA_FILE_KEY}...`);

  const result = await getLocalVariables(FIGMA_FILE_KEY, token);

  if (!result.success) {
    console.error("❌ Failed to fetch Figma variables:");
    console.error(result.error);
    process.exit(1);
  }

  if (!result.data) {
    console.log("No variables found in file.");
    return;
  }

  const { variables, variableCollections } = result.data;
  const collections = Object.entries(variableCollections);

  console.log(`\n📦 Collections (${collections.length}):`);

  for (const [collectionId, collection] of collections) {
    if (collectionFilter && collection.name !== collectionFilter) {
      continue;
    }

    console.log(`\n  ${collection.name} (${collectionId})`);
    console.log(`    Modes: ${collection.modes.map((m) => m.name).join(", ")}`);

    const collectionVars = Object.entries(variables).filter(
      ([, v]) => v.variableCollectionId === collectionId,
    );

    console.log(`    Variables (${collectionVars.length}):`);

    for (const [, variable] of collectionVars.slice(0, 10)) {
      console.log(`      - ${variable.name}`);
    }

    if (collectionVars.length > 10) {
      console.log(`      ... and ${collectionVars.length - 10} more`);
    }
  }
}

/**
 * Converts a ParsedTypographyToken to a ResolvedTypographyToken
 */
function resolveTypographyToken(
  token: ParsedTypographyToken,
): ResolvedTypographyToken {
  return {
    name: token.name,
    value: token.resolvedValue,
  };
}

/**
 * Sync command - purge and recreate all tokens
 */
async function runSyncCommand(): Promise<void> {
  const figmaToken = getValidatedToken();
  const colorCollectionName = "kumo-colors";
  const typographyCollectionName = "kumo-typography";

  console.log("🔍 Parsing CSS tokens from all sources...\n");

  // Step 1: Parse base color tokens
  console.log("📦 Color Tokens:");
  const baseTokens: ParsedToken[] = [];
  for (const source of TOKEN_SOURCES) {
    console.log(`   📁 ${source.name}: ${source.cssPath}`);
    const tokens = await parseCssTokensFromFile(
      source.cssPath,
      source.parseOptions,
    );
    console.log(`      Found ${tokens.length} tokens`);
    baseTokens.push(...tokens);
  }

  console.log(`\n✅ Color tokens: ${baseTokens.length}`);

  // Step 2: Parse typography tokens
  console.log("\n📦 Typography Tokens:");
  const kumoThemePath = resolve(__dirname, "../../src/styles/theme-kumo.css");
  console.log(`   📁 kumo: ${kumoThemePath}`);
  const typographyTokens = await parseTypographyTokensFromFile(kumoThemePath);
  console.log(`      Found ${typographyTokens.length} tokens`);

  console.log(`\n✅ Typography tokens: ${typographyTokens.length}`);

  if (baseTokens.length === 0 && typographyTokens.length === 0) {
    console.log("⚠️  No tokens found to sync.");
    return;
  }

  // Step 3: Resolve base tokens to Figma colors
  console.log("\n🎨 Resolving colors...");
  const resolvedBaseTokens = baseTokens.map(resolveToken);

  // Step 3b: Generate opacity variant tokens
  console.log("🔲 Generating opacity variants...");
  const opacityVariants = generateOpacityVariants(resolvedBaseTokens);
  console.log(`   Found ${opacityVariants.length} opacity variants`);

  // Combine base tokens with opacity variants
  const resolvedColorTokens = [...resolvedBaseTokens, ...opacityVariants];

  // Step 4: Resolve typography tokens
  console.log("📐 Resolving typography...");
  const resolvedTypographyTokens = typographyTokens.map(resolveTypographyToken);

  // Step 5: Build extended modes with overrides
  console.log("\n📋 Building extended modes...");
  const extendedModes: ExtendedMode[] = [];

  for (const modeConfig of EXTENDED_MODES) {
    console.log(`   📁 ${modeConfig.name}: ${modeConfig.overrideCssPath}`);

    // Parse overrides from @layer base
    const overrideTokens = await parseCssTokensFromFile(
      modeConfig.overrideCssPath,
      {
        includeGlobalTokens: false,
        includeLayerOverrides: true,
      },
    );

    console.log(`      Found ${overrideTokens.length} overrides`);

    // Build override map (token name -> resolved color)
    const overrides: Record<string, FigmaColorInput> = {};
    for (const token of overrideTokens) {
      // Use light value for the extended mode (fedramp is a "light" variant)
      overrides[token.name] = resolveColor(token.lightValue);
    }

    extendedModes.push({
      name: modeConfig.name,
      overrides,
    });
  }

  // Step 6: Show what we're syncing
  console.log("\n📋 Color tokens to sync:");
  for (const token of resolvedColorTokens.slice(0, 10)) {
    console.log(`   - ${token.name}`);
  }
  if (resolvedColorTokens.length > 10) {
    console.log(`   ... and ${resolvedColorTokens.length - 10} more`);
  }

  console.log("\n📋 Typography tokens to sync:");
  for (const token of resolvedTypographyTokens.slice(0, 10)) {
    console.log(`   - ${token.name}: ${token.value}`);
  }
  if (resolvedTypographyTokens.length > 10) {
    console.log(`   ... and ${resolvedTypographyTokens.length - 10} more`);
  }

  console.log(`\n   Color modes: Light, Dark`);
  console.log(`   Typography mode: Desktop`);
  if (extendedModes.length > 0) {
    console.log(
      `   Extension collections: ${extendedModes.map((m) => m.name).join(", ")}`,
    );
  }

  // Step 7: Sync to Figma (purge + create)
  console.log(`\n🚀 Syncing to Figma (file: ${FIGMA_FILE_KEY})...`);
  console.log(
    "   ⚠️  This will PURGE all existing variables and recreate them.",
  );

  const result = await syncAllToFigma({
    fileKey: FIGMA_FILE_KEY,
    token: figmaToken,
    colors: {
      collectionName: colorCollectionName,
      tokens: resolvedColorTokens,
      extendedModes,
    },
    typography: {
      collectionName: typographyCollectionName,
      tokens: resolvedTypographyTokens,
      modeName: "Desktop",
    },
  });

  if (!result.success) {
    console.error("❌ Failed to sync tokens to Figma:");
    console.error(result.error);
    process.exit(1);
  }

  const totalTokens =
    resolvedColorTokens.length + resolvedTypographyTokens.length;
  console.log(`\n✅ Successfully synced ${totalTokens} tokens to Figma!`);
  console.log(
    `   Collection: "${colorCollectionName}" (Light, Dark) - ${resolvedColorTokens.length} color tokens`,
  );
  console.log(
    `   Collection: "${typographyCollectionName}" (Desktop) - ${resolvedTypographyTokens.length} typography tokens`,
  );
  if (extendedModes.length > 0) {
    console.log(
      `   Extensions: ${extendedModes.map((m) => m.name).join(", ")} (Light, Dark each)`,
    );
  }

  if (result.tempIdToRealId) {
    const mappingCount = Object.keys(result.tempIdToRealId).length;
    console.log(`   Created ${mappingCount} new Figma IDs`);
  }

  // Verify
  console.log("\n🔍 Verifying sync...");
  const verification = await getLocalVariables(FIGMA_FILE_KEY, figmaToken);

  if (!verification.success) {
    console.warn("⚠️  Could not verify sync:", verification.error);
  } else if (verification.data) {
    const collectionCount = Object.keys(
      verification.data.variableCollections,
    ).length;
    const variableCount = Object.keys(verification.data.variables).length;
    console.log(
      `✅ Verified: ${collectionCount} collection(s), ${variableCount} variable(s) in file`,
    );
  }
}

/**
 * Main execution
 */
async function main() {
  const { command, collection } = parseArgs();

  if (command === "get") {
    await runGetCommand(collection);
  } else {
    await runSyncCommand();
  }
}

main();
