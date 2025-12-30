import { readFile } from "node:fs/promises";

/**
 * Parsed CSS token with light/dark values
 */
export type ParsedToken = {
  /** Token name without -- prefix (e.g., "text-color-surface") */
  name: string;
  /** Raw light mode value (may contain var() or oklch()) */
  lightValue: string;
  /** Raw dark mode value (may contain var() or oklch()) */
  darkValue: string;
};

/**
 * Extracts fallback value from var() expression
 * Handles nested parentheses in values like oklch()
 * @example "var(--color-neutral-900, oklch(21% 0.006 285.885))" → "oklch(21% 0.006 285.885)"
 */
function extractVarFallback(value: string): string {
  // If not a var() expression, return as-is
  if (!value.startsWith("var(")) {
    return value;
  }

  // Find the comma separating variable name from fallback
  let depth = 0;
  let commaIndex = -1;

  for (let i = 4; i < value.length; i++) {
    const char = value[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      commaIndex = i;
      break;
    }
  }

  if (commaIndex === -1) {
    // No fallback, return the variable reference
    return value;
  }

  // Extract fallback value (after comma, before final closing paren)
  const fallback = value.slice(commaIndex + 1, -1).trim();
  return fallback;
}

/**
 * Parses CSS content and extracts semantic tokens with light-dark() values
 * Skips primitive color definitions (block 1)
 * Extracts only blocks 2 (text colors) and 3 (semantic colors)
 */
export function parseCssTokens(cssContent: string): ParsedToken[] {
  const tokens: ParsedToken[] = [];

  // Match all @theme blocks
  const themeBlockRegex = /@theme\s*\{([^}]+)\}/gs;
  const themeBlocks = [...cssContent.matchAll(themeBlockRegex)];

  // Skip first block (primitives), process blocks 2 and 3 (semantic tokens)
  const semanticBlocks = themeBlocks.slice(1, 3);

  for (const block of semanticBlocks) {
    const blockContent = block[1];

    // Remove comments
    const withoutComments = blockContent.replace(/\/\*[^*]*\*\//g, "");

    // Match CSS variables with light-dark() values
    // Handles multi-line light-dark() declarations
    const tokenRegex = /--([\w-]+):\s*light-dark\(([\s\S]*?)\);/g;
    const matches = [...withoutComments.matchAll(tokenRegex)];

    for (const match of matches) {
      const name = match[1];
      const lightDarkContent = match[2];

      // Split by comma, but handle nested commas in var() or oklch()
      // Strategy: match balanced parentheses to find the comma between light/dark
      const parts = splitLightDark(lightDarkContent);

      if (parts.length === 2) {
        const rawLight = parts[0].trim();
        const rawDark = parts[1].trim();

        // Extract fallback values from var() expressions
        const lightValue = extractVarFallback(rawLight);
        const darkValue = extractVarFallback(rawDark);

        tokens.push({ name, lightValue, darkValue });
      }
    }
  }

  return tokens;
}

/**
 * Splits light-dark() content by the comma separating light and dark values
 * Handles nested commas in var() and oklch() expressions
 */
function splitLightDark(content: string): string[] {
  let depth = 0;
  let current = "";
  const parts: string[] = [];

  for (const char of content) {
    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth--;
      current += char;
    } else if (char === "," && depth === 0) {
      // Top-level comma - this is the light/dark separator
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  // Push remaining content
  if (current.trim()) {
    parts.push(current);
  }

  return parts;
}

/**
 * Parses CSS tokens from file path
 */
export async function parseCssTokensFromFile(
  filePath: string,
): Promise<ParsedToken[]> {
  const cssContent = await readFile(filePath, "utf-8");
  return parseCssTokens(cssContent);
}
