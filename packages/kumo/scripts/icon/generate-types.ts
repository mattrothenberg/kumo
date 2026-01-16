/**
 * Generate TypeScript types for icon glyphs
 *
 * This script generates icon.types.ts by:
 * 1. Extracting Phosphor icons from codebase (via extract-phosphor-icons.ts)
 * 2. Reading brand icon filenames from src/assets/icons/brand/
 * 3. Generating TypeScript union types for PhosphorIcon, BrandIcon, IconGlyph
 * 4. Generating ALL_ICON_GLYPHS array
 * 5. Writing to src/components/icon/icon.types.ts
 *
 * Run: npx tsx packages/kumo/scripts/icon/generate-types.ts
 *
 * @example
 * ```ts
 * import { generateTypes } from './generate-types';
 * await generateTypes();
 * ```
 */

import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { extractPhosphorIcons } from "./extract-phosphor-icons.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extract brand icon names from src/assets/icons/brand/ directory
 *
 * Reads .svg filenames and extracts names (e.g., "cf-workers.svg" -> "cf-workers")
 *
 * @returns Sorted array of brand icon names with "cf-" prefix
 */
async function extractBrandIcons(): Promise<string[]> {
  const brandDir = join(__dirname, "../../src/assets/icons/brand");

  try {
    const files = await readdir(brandDir);

    const brandIcons = files
      .filter((file) => file.endsWith(".svg"))
      .map((file) => file.replace(/\.svg$/, ""));

    return brandIcons.sort();
  } catch {
    // Directory might not exist yet or be empty
    console.warn(
      "Warning: Could not read brand icons directory. Generating with empty brand icons array.",
    );
    return [];
  }
}

/**
 * Generate TypeScript type definitions for icons
 *
 * Creates icon.types.ts with:
 * - PhosphorIcon union type (literal strings)
 * - BrandIcon union type (literal strings)
 * - IconGlyph = PhosphorIcon | BrandIcon
 * - ALL_ICON_GLYPHS array
 * - KumoIconSize type
 * - KumoIconVariantsProps interface
 * - IconProps type
 *
 * Overwrites existing icon.types.ts placeholder file.
 */
export async function generateTypes(): Promise<void> {
  console.log("Generating icon types...");

  // Extract icon names
  const phosphorIcons = await extractPhosphorIcons();
  const brandIcons = await extractBrandIcons();

  console.log(`  - Found ${phosphorIcons.length} Phosphor icons`);
  console.log(`  - Found ${brandIcons.length} brand icons`);

  // Generate PhosphorIcon type
  const phosphorIconType =
    phosphorIcons.length > 0
      ? phosphorIcons.map((icon) => `  | "${icon}"`).join("\n")
      : '  | "ph-placeholder"';

  // Generate BrandIcon type
  const brandIconType =
    brandIcons.length > 0
      ? brandIcons.map((icon) => `  | "${icon}"`).join("\n")
      : '  | "cf-placeholder"';

  // Generate ALL_ICON_GLYPHS array
  const allIconGlyphs = [...phosphorIcons, ...brandIcons];
  const allIconGlyphsArray =
    allIconGlyphs.length > 0
      ? allIconGlyphs.map((icon) => `  "${icon}",`).join("\n")
      : '  "ph-placeholder",';

  // Generate file content
  const fileContent = `import type { ComponentProps } from "react";

/**
 * Phosphor icon glyph names with ph- prefix
 * @example "ph-check", "ph-arrow-right"
 */
export type PhosphorIcon =
${phosphorIconType};

/**
 * Cloudflare brand icon glyph names with cf- prefix
 * @example "cf-workers", "cf-pages"
 */
export type BrandIcon =
${brandIconType};

/**
 * All available icon glyphs (Phosphor + Brand)
 */
export type IconGlyph = PhosphorIcon | BrandIcon;

/**
 * Array of all icon glyphs for validation and autocomplete
 */
export const ALL_ICON_GLYPHS: readonly IconGlyph[] = [
${allIconGlyphsArray}
] as const;

/**
 * Icon size variants
 */
export type KumoIconSize = "xs" | "sm" | "base" | "lg" | "xl";

/**
 * Props for icon variant configuration
 */
export interface KumoIconVariantsProps {
  size?: KumoIconSize;
}

/**
 * Props for the Icon component
 *
 * Color is controlled via className (e.g., fill-primary, fill-error).
 * Icons use fill-current by default, inheriting from parent text color.
 */
export type IconProps = ComponentProps<"svg"> &
  KumoIconVariantsProps & {
    /**
     * Icon glyph identifier (e.g., "ph-check", "cf-workers")
     */
    glyph: IconGlyph;
    /**
     * Accessible title for the icon (makes it non-decorative)
     */
    title?: string;
  };
`;

  // Write to file
  const outputPath = join(__dirname, "../../src/components/icon/icon.types.ts");
  await writeFile(outputPath, fileContent, "utf-8");

  console.log(`  ✓ Generated icon.types.ts (${allIconGlyphs.length} glyphs)`);
}

// If run directly, execute generateTypes
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypes()
    .then(() => {
      console.log("\nType generation complete!");
    })
    .catch((error) => {
      console.error("Error generating types:", error);
      process.exit(1);
    });
}
