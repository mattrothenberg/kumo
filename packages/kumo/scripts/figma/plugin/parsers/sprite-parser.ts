/**
 * SVG Sprite Parser
 *
 * Parses sprite.svg and extracts individual icon data (id, viewBox, paths).
 * This is the data layer that other generators will consume.
 *
 * Runs at BUILD TIME (not in Figma runtime), so Node.js fs/path are available.
 * The parsed data will be inlined into the plugin bundle.
 *
 * @example
 * // At build time:
 * const icons = parseSpriteIcons();
 * // [
 * //   { id: "ph-arrow-right", viewBox: "0 0 256 256", content: "<path d='...'/>" },
 * //   { id: "cf-workers-outline", viewBox: "0 0 24 24", content: "<path d='...'/>" },
 * //   ...535 icons total
 * // ]
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Icon data extracted from sprite.svg
 */
export type IconData = {
  /** Icon ID (e.g., "ph-arrow-right", "cf-workers-outline") */
  id: string;
  /** SVG viewBox attribute (e.g., "0 0 256 256") */
  viewBox: string;
  /** Inner SVG content (paths, groups, etc.) */
  content: string;
};

/**
 * Regex pattern to match <symbol> elements in sprite.svg
 *
 * Captures:
 * - Group 1: id attribute value
 * - Group 2: viewBox attribute value
 * - Group 3: innerHTML content
 *
 * Example match:
 * <symbol id="ph-arrow-right" viewBox="0 0 256 256" fill="currentColor">
 *   <path d="..."/>
 * </symbol>
 */
const SYMBOL_PATTERN =
  /<symbol\s+id="([^"]+)"\s+viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/symbol>/g;

/**
 * Parse sprite.svg and extract all icon definitions
 *
 * Reads sprite.svg from packages/kumo/src/assets/icons/sprite.svg
 * and extracts all <symbol> elements with their id, viewBox, and content.
 *
 * @returns Array of icon data (535 icons total)
 *
 * @example
 * const icons = parseSpriteIcons();
 * console.log(icons.length); // 535
 * console.log(icons[0]);
 * // {
 * //   id: "ph-arrow-right",
 * //   viewBox: "0 0 256 256",
 * //   content: "<path d='M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,...'/>"
 * // }
 */
export function parseSpriteIcons(): IconData[] {
  // Resolve sprite path
  // When used at build time, resolve from packages/kumo root
  // This function is meant to be called from build scripts, not the plugin itself
  let spritePath: string;

  try {
    // Attempt to resolve relative to this module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // parsers/sprite-parser.ts -> packages/kumo/src/assets/icons/sprite.svg
    // Go up: parsers -> plugin -> figma -> scripts -> packages/kumo
    spritePath = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "src",
      "assets",
      "icons",
      "sprite.svg",
    );
  } catch {
    // Fallback: assume running from packages/kumo directory
    spritePath = join(process.cwd(), "src", "assets", "icons", "sprite.svg");
  }

  // Read sprite.svg as UTF-8 string
  const spriteContent = readFileSync(spritePath, "utf-8");

  // Extract all <symbol> elements
  const icons: IconData[] = [];
  let match: RegExpExecArray | null;

  while ((match = SYMBOL_PATTERN.exec(spriteContent)) !== null) {
    const [, id, viewBox, content] = match;

    // Trim whitespace from content
    const trimmedContent = content.trim();

    icons.push({
      id,
      viewBox,
      content: trimmedContent,
    });
  }

  return icons;
}

/**
 * Parse sprite.svg from a custom path
 *
 * Useful for testing or alternative sprite locations.
 *
 * @param spritePath - Absolute path to sprite.svg file
 * @returns Array of icon data
 *
 * @example
 * const icons = parseSpriteIconsFromPath("/path/to/custom-sprite.svg");
 */
export function parseSpriteIconsFromPath(spritePath: string): IconData[] {
  const spriteContent = readFileSync(spritePath, "utf-8");
  const icons: IconData[] = [];
  let match: RegExpExecArray | null;

  while ((match = SYMBOL_PATTERN.exec(spriteContent)) !== null) {
    const [, id, viewBox, content] = match;
    icons.push({
      id,
      viewBox,
      content: content.trim(),
    });
  }

  return icons;
}

/**
 * Get icon by ID
 *
 * @param icons - Array of icon data from parseSpriteIcons()
 * @param iconId - Icon ID to find (e.g., "ph-arrow-right")
 * @returns Icon data or undefined if not found
 *
 * @example
 * const icons = parseSpriteIcons();
 * const arrow = getIconById(icons, "ph-arrow-right");
 * if (arrow) {
 *   console.log(arrow.viewBox); // "0 0 256 256"
 * }
 */
export function getIconById(
  icons: IconData[],
  iconId: string,
): IconData | undefined {
  return icons.find((icon) => icon.id === iconId);
}

/**
 * Filter icons by prefix
 *
 * @param icons - Array of icon data from parseSpriteIcons()
 * @param prefix - Icon ID prefix (e.g., "ph-", "cf-")
 * @returns Filtered array of icons matching prefix
 *
 * @example
 * const icons = parseSpriteIcons();
 * const phosphorIcons = filterIconsByPrefix(icons, "ph-");
 * const cfIcons = filterIconsByPrefix(icons, "cf-");
 */
export function filterIconsByPrefix(
  icons: IconData[],
  prefix: string,
): IconData[] {
  return icons.filter((icon) => icon.id.startsWith(prefix));
}

/**
 * Get icon statistics
 *
 * @param icons - Array of icon data from parseSpriteIcons()
 * @returns Statistics object
 *
 * @example
 * const icons = parseSpriteIcons();
 * const stats = getIconStats(icons);
 * console.log(stats);
 * // {
 * //   total: 535,
 * //   byPrefix: {
 * //     "ph-": 500,
 * //     "cf-": 35
 * //   }
 * // }
 */
export function getIconStats(icons: IconData[]): {
  total: number;
  byPrefix: Record<string, number>;
} {
  const byPrefix: Record<string, number> = {};

  for (const icon of icons) {
    // Extract prefix (e.g., "ph-", "cf-")
    const prefixMatch = icon.id.match(/^([a-z]+-)/);
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      byPrefix[prefix] = (byPrefix[prefix] || 0) + 1;
    }
  }

  return {
    total: icons.length,
    byPrefix,
  };
}
