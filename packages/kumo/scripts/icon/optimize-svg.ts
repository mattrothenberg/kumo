/**
 * Normalize and Optimize Brand Icons
 *
 * This script processes all SVG files in src/assets/icons/brand/
 * and normalizes them for consistent usage in the icon system.
 *
 * Normalization includes:
 * - Ensure viewBox attribute exists
 * - Convert hardcoded fills to currentColor for theming
 * - Remove width/height attributes (use viewBox instead)
 * - Remove inline styles
 * - SVGO optimization for file size
 *
 * Run: npx tsx packages/kumo/scripts/icon/optimize-svg.ts
 *
 * @example
 * ```ts
 * import { optimizeBrandIcons, normalizeIcon } from './optimize-svg';
 *
 * // Normalize all icons in brand folder
 * await optimizeBrandIcons();
 *
 * // Normalize a single SVG string
 * const normalized = normalizeIcon(svgContent, 'cf-my-icon.svg');
 * ```
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize, type Config } from "svgo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Validation warning for icon issues that don't prevent usage */
export interface IconWarning {
  file: string;
  message: string;
  severity: "warn" | "info";
}

/** Result of normalizing an icon */
export interface NormalizeResult {
  content: string;
  warnings: IconWarning[];
}

/**
 * SVGO configuration for brand icons
 *
 * Optimizes SVGs while:
 * - Preserving viewBox attribute
 * - Converting colors to currentColor
 * - Removing unnecessary attributes
 * - Cleaning paths
 */
const svgoConfig: Config = {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Don't remove hidden elements - some icons use them
          removeHiddenElems: false,
        },
      },
    },
    // Remove width/height - we use viewBox for sizing
    "removeDimensions",
    // Convert colors but preserve "none" fills
    {
      name: "convertColors",
      params: {
        currentColor: true,
      },
    },
    // Remove inline styles
    "removeStyleElement",
    {
      name: "removeAttrs",
      params: {
        attrs: ["style", "class"],
      },
    },
  ],
};

/**
 * Validate icon filename follows naming conventions
 *
 * @param filename - SVG filename (e.g., "cf-workers-outline.svg")
 * @returns Array of warnings (empty if valid)
 */
export function validateIconName(filename: string): IconWarning[] {
  const warnings: IconWarning[] = [];
  const name = basename(filename, ".svg");

  // Check prefix
  if (!name.startsWith("cf-") && !name.startsWith("ph-")) {
    warnings.push({
      file: filename,
      message: `Icon should start with "cf-" or "ph-" prefix. Got: "${name}"`,
      severity: "warn",
    });
  }

  // Check for variant suffix (recommend but don't require)
  if (name.startsWith("cf-")) {
    const hasVariant =
      name.endsWith("-outline") ||
      name.endsWith("-solid") ||
      name.endsWith("-fill");
    if (!hasVariant) {
      warnings.push({
        file: filename,
        message: `Consider adding -outline or -solid suffix for consistency`,
        severity: "info",
      });
    }
  }

  // Check for spaces or uppercase
  if (name !== name.toLowerCase()) {
    warnings.push({
      file: filename,
      message: `Icon name should be lowercase. Got: "${name}"`,
      severity: "warn",
    });
  }

  if (name.includes(" ") || name.includes("_")) {
    warnings.push({
      file: filename,
      message: `Icon name should use kebab-case (hyphens). Got: "${name}"`,
      severity: "warn",
    });
  }

  return warnings;
}

/**
 * Validate SVG content for potential issues
 *
 * @param content - SVG content string
 * @param filename - Filename for error messages
 * @returns Array of warnings
 */
export function validateSvgContent(
  content: string,
  filename: string,
): IconWarning[] {
  const warnings: IconWarning[] = [];

  // Check for viewBox
  if (!content.includes("viewBox")) {
    warnings.push({
      file: filename,
      message: "SVG missing viewBox attribute - icon may not scale correctly",
      severity: "warn",
    });
  }

  // Check for embedded images
  if (content.includes("<image") || content.includes("xlink:href")) {
    warnings.push({
      file: filename,
      message:
        "SVG contains embedded images - these won't work with currentColor theming",
      severity: "warn",
    });
  }

  // Check for gradients (may not work well with currentColor)
  if (
    content.includes("<linearGradient") ||
    content.includes("<radialGradient")
  ) {
    warnings.push({
      file: filename,
      message:
        "SVG contains gradients - these may not work with currentColor theming",
      severity: "info",
    });
  }

  // Check for non-square viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch) {
    const [, , , width, height] = viewBoxMatch[1].split(/\s+/);
    if (width !== height) {
      warnings.push({
        file: filename,
        message: `Non-square viewBox (${width}x${height}) - icon may appear stretched`,
        severity: "info",
      });
    }
  }

  return warnings;
}

/**
 * Normalize a single SVG icon
 *
 * Applies all normalization steps:
 * 1. Validate content
 * 2. Run SVGO optimization
 * 3. Ensure fill="currentColor" on root
 *
 * @param content - Raw SVG content
 * @param filename - Filename for warnings
 * @returns Normalized content and any warnings
 */
export function normalizeIcon(
  content: string,
  filename: string,
): NormalizeResult {
  const warnings: IconWarning[] = [];

  // Validate name
  warnings.push(...validateIconName(filename));

  // Validate content
  warnings.push(...validateSvgContent(content, filename));

  // Run SVGO optimization
  const result = optimize(content, {
    path: filename,
    ...svgoConfig,
  });

  let normalized = result.data;

  // Ensure the root SVG has fill="currentColor" if not already set
  // This allows text-* classes to control icon color
  if (!normalized.includes('fill="currentColor"')) {
    normalized = normalized.replace("<svg", '<svg fill="currentColor"');
  }

  return { content: normalized, warnings };
}

/**
 * Normalize all brand icons in src/assets/icons/brand/
 *
 * Processes each SVG file:
 * 1. Reads the original SVG
 * 2. Validates and normalizes
 * 3. Writes the normalized SVG back
 *
 * @returns Promise that resolves when all icons are processed
 */
export async function optimizeBrandIcons(): Promise<void> {
  const brandIconsDir = join(__dirname, "../../src/assets/icons/brand");

  // Get all SVG files in the brand directory
  const files = readdirSync(brandIconsDir).filter(
    (file) => file.endsWith(".svg") && file !== ".gitkeep",
  );

  if (files.length === 0) {
    console.log("No brand icons to normalize");
    return;
  }

  console.log(`Normalizing ${files.length} brand icon(s)...`);

  const allWarnings: IconWarning[] = [];

  for (const file of files) {
    const filePath = join(brandIconsDir, file);
    const svgContent = readFileSync(filePath, "utf-8");

    try {
      const { content, warnings } = normalizeIcon(svgContent, file);
      allWarnings.push(...warnings);

      // Write the normalized SVG back
      writeFileSync(filePath, content, "utf-8");
    } catch (error) {
      console.error(`  ✗ Failed to normalize ${file}:`, error);
      throw error;
    }
  }

  console.log(`  ✓ Normalized ${files.length} brand icon(s)`);

  // Print warnings grouped by severity
  const warns = allWarnings.filter((w) => w.severity === "warn");
  const infos = allWarnings.filter((w) => w.severity === "info");

  if (warns.length > 0) {
    console.log(`\n  ⚠ ${warns.length} warning(s):`);
    for (const w of warns) {
      console.log(`    ${w.file}: ${w.message}`);
    }
  }

  if (infos.length > 0 && process.env.VERBOSE) {
    console.log(`\n  ℹ ${infos.length} info(s):`);
    for (const w of infos) {
      console.log(`    ${w.file}: ${w.message}`);
    }
  }
}

// If run directly, normalize brand icons
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeBrandIcons()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error normalizing brand icons:", error);
      process.exit(1);
    });
}
