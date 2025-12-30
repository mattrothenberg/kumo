/**
 * Main script to sync Kumo semantic tokens to Figma
 *
 * Reads CSS tokens from theme-kumo.css, resolves light-dark() values,
 * and syncs them to a Figma design token collection.
 *
 * Usage:
 *   FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
 *
 * Environment Variables:
 *   FIGMA_TOKEN (required) - Figma personal access token
 *   FIGMA_FILE_KEY (optional) - Target Figma file, defaults to kumo file
 *   FIGMA_COLLECTION_NAME (optional) - Token collection name, defaults to "kumo-semantic-tokens"
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";
import { parseCssTokensFromFile, type ParsedToken } from "./parse-css.js";
import { resolveColor } from "./color-utils.js";
import {
  syncToFigma,
  getLocalVariables,
  type ResolvedToken,
  type FigmaConfig,
} from "./figma-api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = resolve(__dirname, "../../src/styles/theme-kumo.css");
const ENV_PATH = resolve(__dirname, ".env");

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
const COLLECTION_NAME =
  process.env.FIGMA_COLLECTION_NAME || "kumo-semantic-tokens";

/**
 * Converts a ParsedToken to a ResolvedToken with Figma RGB colors
 */
function resolveToken(token: ParsedToken): ResolvedToken {
  const lightColor = resolveColor(token.lightValue);
  const darkColor = resolveColor(token.darkValue);

  return {
    name: token.name,
    light: lightColor,
    dark: darkColor,
  };
}

/**
 * Main execution
 */
async function main() {
  // Validate environment
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

  console.log("🔍 Parsing CSS tokens from theme-kumo.css...");

  // Parse tokens from CSS
  const parsedTokens = await parseCssTokensFromFile(CSS_PATH);
  console.log(`✅ Parsed ${parsedTokens.length} tokens`);

  // Resolve colors to Figma RGB format
  console.log("🎨 Resolving colors...");
  const resolvedTokens = parsedTokens.map(resolveToken);

  // Sync to Figma
  console.log(`🚀 Syncing to Figma (file: ${FIGMA_FILE_KEY})...`);
  const config: FigmaConfig = {
    fileKey: FIGMA_FILE_KEY,
    collectionName: COLLECTION_NAME,
    token: FIGMA_TOKEN,
  };

  const result = await syncToFigma(resolvedTokens, config);

  if (!result.success) {
    console.error("❌ Failed to sync tokens to Figma:");
    console.error(result.error);
    process.exit(1);
  }

  console.log(
    `✅ Successfully synced ${resolvedTokens.length} tokens to Figma!`,
  );
  console.log(`   Collection: "${COLLECTION_NAME}"`);

  if (result.tempIdToRealId) {
    const mappingCount = Object.keys(result.tempIdToRealId).length;
    console.log(`   Created ${mappingCount} new Figma IDs`);
  }

  // Verify the sync by fetching local variables
  console.log("\n🔍 Verifying sync...");
  const verification = await getLocalVariables(FIGMA_FILE_KEY, FIGMA_TOKEN);

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

main();
