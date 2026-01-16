#!/usr/bin/env npx tsx
/**
 * Build Icon Data
 *
 * Parses sprite.svg and generates icon-data.json for the Figma plugin.
 * This runs at BUILD TIME before bundling the plugin.
 *
 * Usage:
 *   pnpm --filter @cloudflare/figma-plugin build:data
 *
 * Output:
 *   packages/figma/src/generated/icon-data.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSpriteIcons, getIconStats } from "./parsers/sprite-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse icons from sprite.svg
console.log("📖 Parsing sprite.svg...");
const icons = parseSpriteIcons();
const stats = getIconStats(icons);

console.log(`✅ Found ${stats.total} icons`);
console.log(`   - Phosphor (ph-): ${stats.byPrefix["ph-"] || 0}`);
console.log(`   - Cloudflare (cf-): ${stats.byPrefix["cf-"] || 0}`);

// Ensure generated directory exists
const generatedDir = join(__dirname, "generated");
mkdirSync(generatedDir, { recursive: true });

// Write icon data as JSON
const outputPath = join(generatedDir, "icon-data.json");
writeFileSync(outputPath, JSON.stringify(icons, null, 2));

console.log(`✅ Wrote ${outputPath}`);
