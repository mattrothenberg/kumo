#!/usr/bin/env npx tsx
/**
 * CI Validation Script: Color Token Usage
 *
 * Validates that all color tokens used in code exist in the CSS theme files.
 * This catches breaking changes when tokens are renamed or removed.
 *
 * Usage:
 *   npx tsx scripts/color/validate-color-tokens.ts
 *   pnpm validate:colors
 *
 * Exit codes:
 *   0 - All tokens valid
 *   1 - Invalid tokens found (lists them with file:line locations)
 */

import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "../..");
const SRC = join(ROOT, "src");

// CSS theme files to parse for valid tokens
const THEME_FILES = [
  join(ROOT, "src/styles/theme-kumo.css"),
  join(ROOT, "src/styles/theme-fedramp.css"),
];

// Tailwind prefixes that map to --color-* tokens
const COLOR_PREFIXES = [
  "bg",
  "border",
  "ring",
  "fill",
  "outline",
  "shadow",
  "divide",
  "from",
  "via",
  "to",
] as const;

// Tailwind prefixes that map to --text-color-* tokens
const TEXT_COLOR_PREFIXES = ["text"] as const;

// Non-color utilities that look like color tokens but aren't
const NON_COLOR_TOKENS = new Set([
  // Text utilities (not colors)
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-left",
  "text-center",
  "text-right",
  "text-justify",
  "text-wrap",
  "text-nowrap",
  "text-balance",
  "text-pretty",
  "text-ellipsis",
  "text-clip",
  // Special color values
  "bg-transparent",
  "bg-current",
  "bg-inherit",
  "bg-none",
  "border-transparent",
  "border-current",
  "border-inherit",
  "ring-transparent",
  "ring-current",
  "ring-inherit",
  "text-transparent",
  "text-current",
  "text-inherit",
  "fill-transparent",
  "fill-current",
  "fill-inherit",
  "outline-transparent",
  "outline-current",
  "outline-inherit",
  // Border utilities (not colors)
  "border-0",
  "border-2",
  "border-4",
  "border-8",
  "border-t",
  "border-r",
  "border-b",
  "border-l",
  "border-x",
  "border-y",
  "border-solid",
  "border-dashed",
  "border-dotted",
  "border-double",
  "border-hidden",
  "border-none",
  "border-collapse",
  "border-separate",
  // Ring utilities (not colors)
  "ring-0",
  "ring-1",
  "ring-2",
  "ring-4",
  "ring-8",
  "ring-inset",
  "ring-offset-0",
  "ring-offset-1",
  "ring-offset-2",
  "ring-offset-4",
  "ring-offset-8",
  // Outline utilities (not colors)
  "outline-0",
  "outline-1",
  "outline-2",
  "outline-4",
  "outline-8",
  "outline-none",
  "outline-offset-0",
  "outline-offset-1",
  "outline-offset-2",
  "outline-offset-4",
  "outline-offset-8",
  // Shadow utilities (not colors)
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  "shadow-inner",
  "shadow-none",
  // Fill utilities (not colors)
  "fill-none",
  // Divide utilities (not colors)
  "divide-x",
  "divide-y",
  "divide-solid",
  "divide-dashed",
  "divide-dotted",
  "divide-double",
  "divide-none",
]);

// Tailwind's built-in color names (white, black, etc.)
const BUILTIN_COLORS = new Set(["white", "black"]);

interface TokenUsage {
  token: string;
  file: string;
  line: number;
  column: number;
}

/**
 * Recursively find all .tsx files in a directory
 */
async function findTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findTsxFiles(fullPath)));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".tsx") &&
      !entry.name.endsWith(".stories.tsx") &&
      !entry.name.endsWith(".test.tsx")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse CSS files to extract valid semantic tokens
 */
async function parseValidTokens(): Promise<{
  colorTokens: Set<string>;
  textColorTokens: Set<string>;
}> {
  const colorTokens = new Set<string>();
  const textColorTokens = new Set<string>();

  // Add built-in colors
  for (const color of BUILTIN_COLORS) {
    colorTokens.add(color);
    textColorTokens.add(color);
  }

  for (const file of THEME_FILES) {
    try {
      const css = await readFile(file, "utf-8");

      // Process line by line to skip commented lines
      const lines = css.split("\n");
      for (const line of lines) {
        // Skip commented lines (contains /* or ends with */)
        if (line.includes("/*") || line.trim().endsWith("*/")) continue;

        // Match --color-* definitions (semantic tokens only, not primitives)
        // Semantic tokens use light-dark() function
        const colorMatch = line.match(/--color-([a-z0-9-]+):\s*light-dark\(/);
        if (colorMatch) {
          colorTokens.add(colorMatch[1]);
        }

        // Match --text-color-* definitions
        const textColorMatch = line.match(
          /--text-color-([a-z0-9-]+):\s*light-dark\(/,
        );
        if (textColorMatch) {
          textColorTokens.add(textColorMatch[1]);
        }
      }
    } catch {
      // File doesn't exist, skip
    }
  }

  return { colorTokens, textColorTokens };
}

/**
 * Extract color token usage from a source file
 */
function extractTokenUsage(
  content: string,
  filePath: string,
  validColorTokens: Set<string>,
  validTextColorTokens: Set<string>,
): TokenUsage[] {
  const invalid: TokenUsage[] = [];
  const lines = content.split("\n");

  // Regex to match className attributes (handles template literals, cn(), etc.)
  const classNameRegex = /className\s*=\s*(?:{[^}]*}|"[^"]*"|'[^']*'|`[^`]*`)/g;
  // Also match cn() calls
  const cnRegex = /cn\s*\([^)]*\)/g;

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    // Find all className and cn() occurrences
    const matches = [
      ...line.matchAll(classNameRegex),
      ...line.matchAll(cnRegex),
    ];

    for (const match of matches) {
      const classString = match[0];

      // Extract individual class names (including arbitrary values like text-[14px])
      const classNames = classString.match(
        /(?:^|[\s"'`{,(])([a-z][a-z0-9-]*(?:\[[^\]]*\])?(?:\/\d+)?)/g,
      );
      if (!classNames) continue;

      for (const rawClass of classNames) {
        const className = rawClass.replace(/^[\s"'`{,(]/, "").trim();

        // Skip classes with arbitrary values (e.g., text-[14px], bg-[#fff])
        if (className.includes("[")) continue;

        // Skip non-color utilities
        if (NON_COLOR_TOKENS.has(className)) continue;

        // Check color prefixes (bg-*, border-*, ring-*, etc.)
        for (const prefix of COLOR_PREFIXES) {
          if (className.startsWith(`${prefix}-`)) {
            const tokenName = className
              .slice(prefix.length + 1)
              .replace(/\/\d+$/, ""); // Remove opacity modifier

            // Skip if it's a valid token or built-in
            if (validColorTokens.has(tokenName)) continue;

            // Skip numeric values (e.g., border-2)
            if (/^\d+$/.test(tokenName)) continue;

            // Skip arbitrary values (e.g., bg-[#fff], border-[2px])
            if (tokenName.startsWith("[")) continue;

            // Skip directional modifiers (e.g., border-t, border-x)
            if (/^[trblxy]$/.test(tokenName)) continue;

            // Skip style modifiers
            if (
              [
                "solid",
                "dashed",
                "dotted",
                "double",
                "none",
                "hidden",
              ].includes(tokenName)
            )
              continue;

            invalid.push({
              token: className,
              file: filePath,
              line: lineNum + 1,
              column: match.index ?? 0,
            });
          }
        }

        // Check text color prefix
        for (const prefix of TEXT_COLOR_PREFIXES) {
          if (className.startsWith(`${prefix}-`)) {
            const tokenName = className
              .slice(prefix.length + 1)
              .replace(/\/\d+$/, ""); // Remove opacity modifier

            // Skip if it's a valid token
            if (validTextColorTokens.has(tokenName)) continue;

            // Skip non-color text utilities (already in NON_COLOR_TOKENS, but double-check)
            if (
              [
                "xs",
                "sm",
                "base",
                "lg",
                "xl",
                "2xl",
                "3xl",
                "4xl",
                "left",
                "center",
                "right",
                "justify",
                "wrap",
                "nowrap",
                "balance",
                "pretty",
                "ellipsis",
                "clip",
              ].includes(tokenName)
            )
              continue;

            // Skip arbitrary values (e.g., text-[14px], text-[#fff])
            if (tokenName.startsWith("[")) continue;

            invalid.push({
              token: className,
              file: filePath,
              line: lineNum + 1,
              column: match.index ?? 0,
            });
          }
        }
      }
    }
  }

  return invalid;
}

async function main() {
  console.log("🔍 Validating color token usage...\n");

  // Parse valid tokens from CSS
  const { colorTokens, textColorTokens } = await parseValidTokens();
  console.log(`Found ${colorTokens.size} valid color tokens`);
  console.log(`Found ${textColorTokens.size} valid text-color tokens\n`);

  // Find all TSX files
  const files = await findTsxFiles(SRC);

  console.log(`Scanning ${files.length} source files...\n`);

  const allInvalid: TokenUsage[] = [];

  for (const filePath of files) {
    const content = await readFile(filePath, "utf-8");
    const invalid = extractTokenUsage(
      content,
      relative(ROOT, filePath),
      colorTokens,
      textColorTokens,
    );
    allInvalid.push(...invalid);
  }

  if (allInvalid.length === 0) {
    console.log("✅ All color tokens are valid!\n");
    process.exit(0);
  }

  console.log(`❌ Found ${allInvalid.length} invalid color token(s):\n`);

  // Group by file for cleaner output
  const byFile = new Map<string, TokenUsage[]>();
  for (const usage of allInvalid) {
    const existing = byFile.get(usage.file) || [];
    existing.push(usage);
    byFile.set(usage.file, existing);
  }

  for (const [file, usages] of byFile) {
    console.log(`  ${file}`);
    for (const usage of usages) {
      console.log(`    Line ${usage.line}: ${usage.token}`);
    }
    console.log();
  }

  console.log(
    "These tokens are not defined in theme-kumo.css or theme-fedramp.css.",
  );
  console.log(
    "Either add the token to the CSS or use an existing semantic token.\n",
  );

  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
