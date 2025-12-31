/**
 * Generate Icon Sprite
 *
 * This script combines Phosphor icons and brand icons into a single SVG sprite.
 * The sprite uses <symbol> elements for efficient reuse across the application.
 *
 * Process:
 * 1. Extract Phosphor icon names used in components (via extract-phosphor-icons.ts)
 * 2. Load corresponding SVGs from @phosphor-icons/core
 * 3. Load brand SVGs from src/assets/icons/brand/
 * 4. Combine into sprite.svg with <symbol> elements
 * 5. Ensure all icons use fill="currentColor" for theming
 *
 * Run: npx tsx packages/kumo/scripts/icon/generate-sprite.ts
 *
 * @example
 * ```ts
 * import { generateSprite } from './generate-sprite';
 *
 * await generateSprite();
 * ```
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { extractPhosphorIcons } from "./extract-phosphor-icons.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Convert ph-kebab-case to PascalCase for Phosphor icon filenames
 *
 * @example
 * phNameToFilename("ph-arrow-right") // "arrow-right"
 * phNameToFilename("ph-check") // "check"
 */
function phNameToFilename(phName: string): string {
  // Remove "ph-" prefix
  return phName.replace(/^ph-/, "");
}

/**
 * Extract SVG content from a file and convert to <symbol>
 *
 * Extracts:
 * - viewBox attribute
 * - Inner content (paths, etc.)
 * - Ensures fill="currentColor" on symbol for theming
 *
 * @param svgContent - Raw SVG file content
 * @param id - Symbol ID (e.g., "ph-check", "brand-cloudflare")
 * @returns Symbol element string
 */
function svgToSymbol(svgContent: string, id: string): string {
  // Extract viewBox from SVG
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 256 256";

  // Extract content between <svg> tags
  const contentMatch = svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
  const content = contentMatch ? contentMatch[1].trim() : "";

  // Add fill="currentColor" to symbol element for theming support
  return `  <symbol id="${id}" viewBox="${viewBox}" fill="currentColor">\n    ${content}\n  </symbol>`;
}

/**
 * Load Phosphor icons based on extracted icon names
 *
 * @param iconNames - Array of icon names with "ph-" prefix (e.g., ["ph-check", "ph-arrow-right"])
 * @returns Array of symbol elements
 */
function loadPhosphorIcons(iconNames: string[]): string[] {
  const phosphorIconsDir = join(
    __dirname,
    "../../node_modules/@phosphor-icons/core/assets/regular",
  );

  const symbols: string[] = [];

  for (const iconName of iconNames) {
    const filename = `${phNameToFilename(iconName)}.svg`;
    const filePath = join(phosphorIconsDir, filename);

    try {
      const svgContent = readFileSync(filePath, "utf-8");
      const symbol = svgToSymbol(svgContent, iconName);
      symbols.push(symbol);
    } catch {
      console.warn(`  ⚠ Skipping ${iconName}: file not found at ${filePath}`);
    }
  }

  return symbols;
}

/**
 * Load brand icons from src/assets/icons/brand/
 *
 * @returns Array of symbol elements with "brand-" prefix
 */
function loadBrandIcons(): string[] {
  const brandIconsDir = join(__dirname, "../../src/assets/icons/brand");

  // Get all SVG files in the brand directory
  const files = readdirSync(brandIconsDir).filter(
    (file) => file.endsWith(".svg") && file !== ".gitkeep",
  );

  const symbols: string[] = [];

  for (const file of files) {
    const filePath = join(brandIconsDir, file);
    const svgContent = readFileSync(filePath, "utf-8");

    // Use "brand-{filename}" as the ID
    const id = `brand-${file.replace(".svg", "")}`;
    const symbol = svgToSymbol(svgContent, id);
    symbols.push(symbol);
  }

  return symbols;
}

/**
 * Generate icon sprite combining Phosphor and brand icons
 *
 * Process:
 * 1. Extract Phosphor icons used in components
 * 2. Load Phosphor SVGs from @phosphor-icons/core
 * 3. Load brand SVGs from src/assets/icons/brand/
 * 4. Combine into sprite.svg
 * 5. Write to src/assets/icons/sprite.svg
 *
 * @returns Promise that resolves when sprite is generated
 */
export async function generateSprite(): Promise<void> {
  console.log("Generating icon sprite...");

  // Step 1: Extract Phosphor icon names from components
  console.log("  → Extracting Phosphor icons from components...");
  const phosphorIconNames = await extractPhosphorIcons();
  console.log(`    Found ${phosphorIconNames.length} Phosphor icon(s)`);

  // Step 2: Load Phosphor SVGs
  console.log("  → Loading Phosphor SVGs...");
  const phosphorSymbols = loadPhosphorIcons(phosphorIconNames);
  console.log(`    Loaded ${phosphorSymbols.length} Phosphor icon(s)`);

  // Step 3: Load brand SVGs
  console.log("  → Loading brand icons...");
  const brandSymbols = loadBrandIcons();
  console.log(`    Loaded ${brandSymbols.length} brand icon(s)`);

  // Step 4: Combine into sprite
  const allSymbols = [...phosphorSymbols, ...brandSymbols];

  const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
${allSymbols.join("\n")}
</svg>
`;

  // Step 5: Write to sprite.svg
  const spriteOutputPath = join(__dirname, "../../src/assets/icons/sprite.svg");
  writeFileSync(spriteOutputPath, spriteContent, "utf-8");

  console.log(
    `✓ Generated sprite with ${allSymbols.length} icon(s) → ${spriteOutputPath}`,
  );
}

// If run directly, generate the sprite
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSprite()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error generating sprite:", error);
      process.exit(1);
    });
}
