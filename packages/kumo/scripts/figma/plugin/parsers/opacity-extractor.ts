/**
 * Opacity Extractor
 *
 * Parses component source files for Tailwind opacity modifiers.
 * Extracts patterns like `bg-primary/70`, `text-error/50` and generates
 * Figma variable definitions for `opacity-primary-70`, `opacity-error-50`, etc.
 *
 * @example
 * // Input from button.tsx:
 * // "bg-primary/70 hover:bg-primary/50"
 *
 * // Output:
 * // [
 * //   { token: "primary", opacity: 70 },
 * //   { token: "primary", opacity: 50 }
 * // ]
 */

/**
 * Opacity modifier extracted from source code
 */
export type OpacityModifier = {
  /** Base token name (e.g., "primary", "error", "secondary") */
  token: string;
  /** Opacity value as percentage (e.g., 70, 50) */
  opacity: number;
  /** Full variable name for Figma (e.g., "opacity-primary-70") */
  variableName: string;
};

/**
 * Regex pattern to match Tailwind opacity modifiers
 * Matches: (bg|text|border|ring)-(\w+)/(\d+)
 *
 * Examples:
 * - bg-primary/70 → token: "primary", opacity: 70
 * - text-error/50 → token: "error", opacity: 50
 * - border-secondary/30 → token: "secondary", opacity: 30
 */
const OPACITY_PATTERN = /(bg|text|border|ring)-(\w+)\/(\d+)/g;

/**
 * Extract opacity modifiers from source code
 *
 * @param sourceCode - Component source code (TypeScript/TSX)
 * @returns Array of unique opacity modifiers
 *
 * @example
 * const code = `
 *   primary: "bg-primary hover:bg-primary/70 disabled:bg-primary/50",
 *   error: "bg-error text-white hover:bg-error/70"
 * `;
 * const modifiers = extractOpacityModifiers(code);
 * // [
 * //   { token: "primary", opacity: 70, variableName: "opacity-primary-70" },
 * //   { token: "primary", opacity: 50, variableName: "opacity-primary-50" },
 * //   { token: "error", opacity: 70, variableName: "opacity-error-70" }
 * // ]
 */
export function extractOpacityModifiers(sourceCode: string): OpacityModifier[] {
  const matches: OpacityModifier[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = OPACITY_PATTERN.exec(sourceCode)) !== null) {
    const [, , token, opacityStr] = match;
    const opacity = parseInt(opacityStr, 10);
    const variableName = `opacity-${token}-${opacity}`;

    // Deduplicate
    if (!seen.has(variableName)) {
      seen.add(variableName);
      matches.push({ token, opacity, variableName });
    }
  }

  return matches;
}

/**
 * Extract opacity modifiers from multiple source files
 *
 * @param filePaths - Array of file paths to scan
 * @returns Array of unique opacity modifiers across all files
 *
 * @example
 * const paths = [
 *   "packages/kumo/src/components/button/button.tsx",
 *   "packages/kumo/src/components/badge/badge.tsx"
 * ];
 * const modifiers = await extractOpacityModifiersFromFiles(paths);
 */
export async function extractOpacityModifiersFromFiles(
  filePaths: string[],
): Promise<OpacityModifier[]> {
  const allModifiers: OpacityModifier[] = [];
  const seen = new Set<string>();

  for (const path of filePaths) {
    try {
      // In Figma plugin context, we'd need to fetch these files
      // This is a placeholder - actual implementation depends on how we bundle the plugin
      // Note: fetch is not available in Figma plugin context
      // Actual implementation will need to bundle source files
      const response = await globalThis.fetch(path);
      const sourceCode = await response.text();

      const modifiers = extractOpacityModifiers(sourceCode);
      for (const mod of modifiers) {
        if (!seen.has(mod.variableName)) {
          seen.add(mod.variableName);
          allModifiers.push(mod);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to parse ${path}:`, error);
    }
  }

  return allModifiers;
}

/**
 * Generate opacity variable name from token and opacity value
 *
 * @param token - Base token name (e.g., "primary")
 * @param opacity - Opacity percentage (e.g., 70)
 * @returns Variable name (e.g., "opacity-primary-70")
 */
export function generateOpacityVariableName(
  token: string,
  opacity: number,
): string {
  return `opacity-${token}-${opacity}`;
}
