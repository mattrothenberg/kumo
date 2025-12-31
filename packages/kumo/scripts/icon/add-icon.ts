#!/usr/bin/env node
/**
 * Add Icon CLI
 *
 * Adds SVG icons to the Kumo icon system with automatic normalization.
 *
 * Usage:
 *   pnpm add:icon path/to/icon.svg              # Add single icon
 *   pnpm add:icon path/to/folder/               # Add all SVGs in folder
 *   pnpm add:icon icon.svg --name cf-my-icon    # Add with custom name
 *
 * Options:
 *   --name, -n     Custom icon name (without .svg extension)
 *   --force, -f    Overwrite existing icons
 *   --dry-run      Show what would be done without writing files
 *
 * Naming conventions:
 *   - cf-* for Cloudflare brand icons (e.g., cf-workers-outline)
 *   - ph-* for custom Phosphor-style icons
 *   - Use -outline or -solid suffix for variants
 *
 * @example
 * ```bash
 * # Add a single icon
 * pnpm add:icon ~/Downloads/my-icon.svg --name cf-my-feature-outline
 *
 * # Add all icons from a folder
 * pnpm add:icon ~/Downloads/icons/
 *
 * # Preview without writing
 * pnpm add:icon icon.svg --dry-run
 * ```
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizeIcon,
  validateIconName,
  type IconWarning,
} from "./optimize-svg.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BRAND_ICONS_DIR = join(__dirname, "../../src/assets/icons/brand");

interface AddIconOptions {
  name?: string;
  force?: boolean;
  dryRun?: boolean;
}

/**
 * Convert filename to valid icon name
 *
 * - Converts to lowercase kebab-case
 * - Adds cf- prefix if missing
 * - Removes .svg extension
 */
function toIconName(filename: string): string {
  let name = basename(filename, ".svg")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Add cf- prefix if no valid prefix
  if (!name.startsWith("cf-") && !name.startsWith("ph-")) {
    name = `cf-${name}`;
  }

  return name;
}

/**
 * Add a single SVG icon to the brand icons directory
 */
function addIcon(
  sourcePath: string,
  options: AddIconOptions = {},
): { success: boolean; warnings: IconWarning[]; outputPath?: string } {
  const warnings: IconWarning[] = [];

  // Read source SVG
  if (!existsSync(sourcePath)) {
    console.error(`  ✗ File not found: ${sourcePath}`);
    return { success: false, warnings };
  }

  const content = readFileSync(sourcePath, "utf-8");

  // Determine output name
  const iconName = options.name || toIconName(sourcePath);
  const outputFilename = `${iconName}.svg`;
  const outputPath = join(BRAND_ICONS_DIR, outputFilename);

  // Validate name
  const nameWarnings = validateIconName(outputFilename);
  warnings.push(...nameWarnings);

  // Check if file exists
  if (existsSync(outputPath) && !options.force) {
    console.error(`  ✗ Icon already exists: ${outputFilename}`);
    console.error(`    Use --force to overwrite`);
    return { success: false, warnings };
  }

  // Normalize the icon
  const { content: normalized, warnings: normalizeWarnings } = normalizeIcon(
    content,
    outputFilename,
  );
  warnings.push(...normalizeWarnings);

  // Write or preview
  if (options.dryRun) {
    console.log(`  [dry-run] Would write: ${outputFilename}`);
  } else {
    writeFileSync(outputPath, normalized, "utf-8");
    console.log(`  ✓ Added: ${outputFilename}`);
  }

  return { success: true, warnings, outputPath };
}

/**
 * Add all SVG files from a directory
 */
function addIconsFromDirectory(
  dirPath: string,
  options: AddIconOptions = {},
): { added: number; failed: number; warnings: IconWarning[] } {
  const allWarnings: IconWarning[] = [];
  let added = 0;
  let failed = 0;

  const files = readdirSync(dirPath).filter(
    (f) => extname(f).toLowerCase() === ".svg",
  );

  if (files.length === 0) {
    console.log(`  No SVG files found in: ${dirPath}`);
    return { added: 0, failed: 0, warnings: [] };
  }

  console.log(`  Found ${files.length} SVG file(s)\n`);

  for (const file of files) {
    const sourcePath = join(dirPath, file);
    const result = addIcon(sourcePath, { ...options, name: undefined }); // Don't use custom name for batch

    if (result.success) {
      added++;
    } else {
      failed++;
    }
    allWarnings.push(...result.warnings);
  }

  return { added, failed, warnings: allWarnings };
}

/**
 * Parse CLI arguments
 */
function parseArgs(args: string[]): {
  paths: string[];
  options: AddIconOptions;
} {
  const paths: string[] = [];
  const options: AddIconOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--name" || arg === "-n") {
      options.name = args[++i];
    } else if (arg === "--force" || arg === "-f") {
      options.force = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith("-")) {
      paths.push(arg);
    }
  }

  return { paths, options };
}

function printHelp(): void {
  console.log(`
Add Icon CLI - Add SVG icons to Kumo

Usage:
  pnpm add:icon <path> [options]

Arguments:
  path              Path to SVG file or directory containing SVGs

Options:
  --name, -n        Custom icon name (without .svg extension)
  --force, -f       Overwrite existing icons
  --dry-run         Preview without writing files
  --help, -h        Show this help message

Naming conventions:
  - cf-* for Cloudflare brand icons (e.g., cf-workers-outline)
  - ph-* for custom Phosphor-style icons
  - Use -outline or -solid suffix for variants

Examples:
  pnpm add:icon ~/Downloads/my-icon.svg
  pnpm add:icon ~/Downloads/my-icon.svg --name cf-my-feature-outline
  pnpm add:icon ~/Downloads/icons/
  pnpm add:icon icon.svg --dry-run
`);
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(1);
  }

  const { paths, options } = parseArgs(args);

  if (paths.length === 0) {
    console.error("Error: No input path provided");
    printHelp();
    process.exit(1);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Kumo Add Icon");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (options.dryRun) {
    console.log("  [dry-run mode]\n");
  }

  let totalAdded = 0;
  let totalFailed = 0;
  const allWarnings: IconWarning[] = [];

  for (const inputPath of paths) {
    if (!existsSync(inputPath)) {
      console.error(`  ✗ Path not found: ${inputPath}`);
      totalFailed++;
      continue;
    }

    const stat = statSync(inputPath);

    if (stat.isDirectory()) {
      console.log(`  Processing directory: ${inputPath}\n`);
      const result = addIconsFromDirectory(inputPath, options);
      totalAdded += result.added;
      totalFailed += result.failed;
      allWarnings.push(...result.warnings);
    } else if (stat.isFile() && extname(inputPath).toLowerCase() === ".svg") {
      const result = addIcon(inputPath, options);
      if (result.success) {
        totalAdded++;
      } else {
        totalFailed++;
      }
      allWarnings.push(...result.warnings);
    } else {
      console.error(`  ✗ Not an SVG file: ${inputPath}`);
      totalFailed++;
    }
  }

  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (options.dryRun) {
    console.log(`  [dry-run] Would add: ${totalAdded} icon(s)`);
  } else {
    console.log(`  ✓ Added: ${totalAdded} icon(s)`);
  }
  if (totalFailed > 0) {
    console.log(`  ✗ Failed: ${totalFailed}`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Print warnings
  const warns = allWarnings.filter((w) => w.severity === "warn");
  if (warns.length > 0) {
    console.log(`\n⚠ ${warns.length} warning(s):`);
    for (const w of warns) {
      console.log(`  ${w.file}: ${w.message}`);
    }
  }

  // Remind to rebuild
  if (totalAdded > 0 && !options.dryRun) {
    console.log("\nRun 'pnpm build:icons' to rebuild the sprite.");
  }

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
