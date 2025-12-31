/**
 * Optimize Brand Icons using SVGO
 *
 * This script processes all SVG files in src/assets/icons/brand/
 * and optimizes them using SVGO to reduce file size while maintaining quality.
 *
 * Run: npx tsx packages/kumo/scripts/icon/optimize-svg.ts
 *
 * @example
 * ```ts
 * import { optimizeBrandIcons } from './optimize-svg';
 *
 * await optimizeBrandIcons();
 * ```
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize, type Config } from "svgo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * SVGO configuration for brand icons
 *
 * Optimizes SVGs while preserving:
 * - viewBox attribute
 * - currentColor fills
 * - Clean paths
 */
const svgoConfig: Config = {
  plugins: ["preset-default", "convertColors"],
};

/**
 * Optimize all brand icons in src/assets/icons/brand/
 *
 * Processes each SVG file:
 * 1. Reads the original SVG
 * 2. Runs SVGO optimization
 * 3. Writes the optimized SVG back to the same location
 *
 * @returns Promise that resolves when all icons are optimized
 */
export async function optimizeBrandIcons(): Promise<void> {
  const brandIconsDir = join(__dirname, "../../src/assets/icons/brand");

  // Get all SVG files in the brand directory
  const files = readdirSync(brandIconsDir).filter(
    (file) => file.endsWith(".svg") && file !== ".gitkeep",
  );

  if (files.length === 0) {
    console.log("No brand icons to optimize");
    return;
  }

  console.log(`Optimizing ${files.length} brand icon(s)...`);

  for (const file of files) {
    const filePath = join(brandIconsDir, file);
    const svgContent = readFileSync(filePath, "utf-8");

    try {
      // Optimize the SVG
      const result = optimize(svgContent, {
        path: filePath,
        ...svgoConfig,
      });

      // Write the optimized SVG back
      writeFileSync(filePath, result.data, "utf-8");

      console.log(`  ✓ Optimized ${file}`);
    } catch (error) {
      console.error(`  ✗ Failed to optimize ${file}:`, error);
      throw error;
    }
  }

  console.log(`✓ Optimized ${files.length} brand icon(s)`);
}

// If run directly, optimize brand icons
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeBrandIcons()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error optimizing brand icons:", error);
      process.exit(1);
    });
}
