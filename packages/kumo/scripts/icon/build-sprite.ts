/**
 * Icon Build System Orchestrator
 *
 * This is the main entry point for building the icon system.
 * It coordinates the following steps:
 *
 * 1. Extract Phosphor icons from codebase (extract-phosphor-icons.ts)
 * 2. Normalize & optimize brand icons via SVGO (optimize-svg.ts)
 * 3. Generate SVG sprite (generate-sprite.ts)
 * 4. Generate TypeScript types (generate-types.ts)
 *
 * Usage:
 *   pnpm build:icons
 *   npx tsx packages/kumo/scripts/icon/build-sprite.ts
 *
 * Adding icons:
 *   pnpm add:icon path/to/icon.svg           # Add single icon
 *   pnpm add:icon path/to/folder/            # Add all SVGs in folder
 *   # Or manually drop SVGs into src/assets/icons/brand/
 *
 * Icon naming:
 *   - cf-* for Cloudflare brand icons (e.g., cf-workers-outline.svg)
 *   - ph-* for custom Phosphor-style icons (rare)
 *   - Recommend -outline or -solid suffix for variants
 */

import { extractPhosphorIcons } from "./extract-phosphor-icons.js";
// NOTE: These modules are created by another worker (task kumo-workspace--5ayiu-mju7c6obz6l)
// If they don't exist yet, this file will have TypeScript errors until that task completes
import { optimizeBrandIcons } from "./optimize-svg.js";
import { generateSprite } from "./generate-sprite.js";
import { generateTypes } from "./generate-types.js";

/**
 * Main orchestrator function
 *
 * Runs all icon build steps in sequence with progress logging
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Kumo Icon Build System");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // Step 1: Extract Phosphor icons
    console.log("Step 1/4: Extracting Phosphor icons from codebase...");
    const phosphorIcons = await extractPhosphorIcons();
    console.log(`  ✓ Found ${phosphorIcons.length} Phosphor icons\n`);

    // Step 2: Optimize brand icons
    console.log("Step 2/4: Optimizing brand SVG icons...");
    await optimizeBrandIcons();
    console.log("  ✓ Brand icons optimized\n");

    // Step 3: Generate sprite
    console.log("Step 3/4: Generating SVG sprite...");
    await generateSprite();
    console.log("  ✓ Sprite generated\n");

    // Step 4: Generate TypeScript types
    console.log("Step 4/4: Generating TypeScript types...");
    await generateTypes();
    console.log("  ✓ Types generated\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ✓ Icon build complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("  ✗ Icon build failed!");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
