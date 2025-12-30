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
 * Parsed typography token with numeric values
 */
export type ParsedTypographyToken = {
  /** Token name without -- prefix (e.g., "text-xs") */
  name: string;
  /** Raw CSS value (e.g., "12px", "calc(1 / 0.75)") */
  rawValue: string;
  /** Resolved numeric value in pixels or unitless */
  resolvedValue: number;
  /** Unit type: 'px', 'rem', or 'unitless' */
  unit: "px" | "rem" | "unitless";
};

/**
 * Options for parsing CSS tokens
 */
export type ParseOptions = {
  /**
   * Include global tokens from @theme blocks (tokens with light-dark())
   * @default true
   */
  includeGlobalTokens?: boolean;
  /**
   * Include semantic override tokens from @layer base blocks
   * @default false
   */
  includeLayerOverrides?: boolean;
  /**
   * Filter tokens by prefix (e.g., "fedramp" to get --color-fedramp-*)
   */
  tokenPrefix?: string;
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
export function parseCssTokens(
  cssContent: string,
  options: ParseOptions = {},
): ParsedToken[] {
  const {
    includeGlobalTokens = true,
    includeLayerOverrides = false,
    tokenPrefix,
  } = options;

  const tokens: ParsedToken[] = [];

  // Parse @theme blocks for global tokens
  if (includeGlobalTokens) {
    const themeTokens = parseThemeBlocks(cssContent, tokenPrefix);
    tokens.push(...themeTokens);
  }

  // Parse @layer base blocks for semantic overrides
  if (includeLayerOverrides) {
    const layerTokens = parseLayerBaseBlocks(cssContent, tokenPrefix);
    tokens.push(...layerTokens);
  }

  return tokens;
}

/**
 * Parses @theme blocks for tokens with light-dark() values
 * For kumo theme: skips first block (primitives), processes semantic blocks
 * For other themes: processes all blocks with light-dark() tokens
 */
function parseThemeBlocks(
  cssContent: string,
  tokenPrefix?: string,
): ParsedToken[] {
  const tokens: ParsedToken[] = [];

  // Match all @theme blocks
  const themeBlockRegex = /@theme\s*\{([^}]+)\}/gs;
  const themeBlocks = [...cssContent.matchAll(themeBlockRegex)];

  // Determine which blocks to process based on content
  // If tokenPrefix is provided, process all blocks (theme-specific file)
  // Otherwise, skip first block (primitives in kumo theme)
  const blocksToProcess = tokenPrefix ? themeBlocks : themeBlocks.slice(1, 3);

  for (const block of blocksToProcess) {
    const blockContent = block[1];
    const blockTokens = extractLightDarkTokens(blockContent, tokenPrefix);
    tokens.push(...blockTokens);
  }

  return tokens;
}

/**
 * Parses @layer base blocks for semantic override tokens
 * These are tokens inside [data-theme="..."] selectors
 */
function parseLayerBaseBlocks(
  cssContent: string,
  tokenPrefix?: string,
): ParsedToken[] {
  const tokens: ParsedToken[] = [];

  // Match @layer base blocks with nested content
  const layerBlockRegex = /@layer\s+base\s*\{([\s\S]*?)\n\}/g;
  const layerBlocks = [...cssContent.matchAll(layerBlockRegex)];

  for (const block of layerBlocks) {
    const blockContent = block[1];

    // Extract tokens from the block (including commented ones if needed)
    // For now, only extract uncommented tokens
    const blockTokens = extractLightDarkTokens(blockContent, tokenPrefix);
    tokens.push(...blockTokens);
  }

  return tokens;
}

/**
 * Extracts light-dark() tokens from a CSS block
 */
function extractLightDarkTokens(
  blockContent: string,
  tokenPrefix?: string,
): ParsedToken[] {
  const tokens: ParsedToken[] = [];

  // Remove comments
  const withoutComments = blockContent.replace(/\/\*[\s\S]*?\*\//g, "");

  // Match CSS variables with light-dark() values
  // Handles multi-line light-dark() declarations
  const tokenRegex = /--([\w-]+):\s*light-dark\(([\s\S]*?)\);/g;
  const matches = [...withoutComments.matchAll(tokenRegex)];

  for (const match of matches) {
    const name = match[1];

    // Filter by prefix if specified
    if (tokenPrefix && !name.startsWith(`color-${tokenPrefix}`)) {
      continue;
    }

    const lightDarkContent = match[2];

    // Split by comma, but handle nested commas in var() or oklch()
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
  options: ParseOptions = {},
): Promise<ParsedToken[]> {
  const cssContent = await readFile(filePath, "utf-8");
  return parseCssTokens(cssContent, options);
}

/**
 * Default typography tokens (Tailwind defaults)
 * These are the base values that theme-kumo.css may override
 */
const DEFAULT_TYPOGRAPHY_TOKENS: Record<string, string> = {
  "text-xs": "0.75rem",
  "text-xs--line-height": "calc(1 / 0.75)",
  "text-sm": "0.875rem",
  "text-sm--line-height": "calc(1.25 / 0.875)",
  "text-base": "1rem",
  "text-base--line-height": "calc(1.5 / 1)",
  "text-lg": "1.125rem",
  "text-lg--line-height": "calc(1.75 / 1.125)",
  "text-xl": "1.25rem",
  "text-xl--line-height": "calc(1.75 / 1.25)",
  "text-2xl": "1.5rem",
  "text-2xl--line-height": "calc(2 / 1.5)",
  "text-3xl": "1.875rem",
  "text-3xl--line-height": "calc(2.25 / 1.875)",
  "text-4xl": "2.25rem",
  "text-4xl--line-height": "calc(2.5 / 2.25)",
  "text-5xl": "3rem",
  "text-5xl--line-height": "1",
  "text-6xl": "3.75rem",
  "text-6xl--line-height": "1",
  "text-7xl": "4.5rem",
  "text-7xl--line-height": "1",
  "text-8xl": "6rem",
  "text-8xl--line-height": "1",
  "text-9xl": "8rem",
  "text-9xl--line-height": "1",
};

/**
 * Resolves a CSS value to a numeric value
 * Handles: px values, rem values (converts to px at 16px base), calc() expressions
 */
function resolveTypographyValue(value: string): {
  resolved: number;
  unit: "px" | "rem" | "unitless";
} {
  const trimmed = value.trim();

  // Handle px values
  if (trimmed.endsWith("px")) {
    return {
      resolved: parseFloat(trimmed),
      unit: "px",
    };
  }

  // Handle rem values - convert to px (1rem = 16px)
  if (trimmed.endsWith("rem")) {
    const remValue = parseFloat(trimmed);
    return {
      resolved: remValue * 16,
      unit: "rem",
    };
  }

  // Handle calc() expressions
  if (trimmed.startsWith("calc(")) {
    // Extract the expression inside calc()
    const expr = trimmed.slice(5, -1).trim();
    try {
      // Simple evaluation for division expressions like "1 / 0.75"
      // eslint-disable-next-line no-eval
      const result = eval(expr);
      if (typeof result === "number" && !isNaN(result)) {
        return {
          resolved: result,
          unit: "unitless",
        };
      }
    } catch {
      // Fall through to default
    }
  }

  // Handle plain numbers (unitless values like line-height: 1)
  const numValue = parseFloat(trimmed);
  if (!isNaN(numValue)) {
    return {
      resolved: numValue,
      unit: "unitless",
    };
  }

  // Default fallback
  return {
    resolved: 0,
    unit: "unitless",
  };
}

/**
 * Parses typography tokens from CSS content
 * Extracts --text-* variables from @theme blocks
 */
export function parseTypographyTokens(
  cssContent: string,
): ParsedTypographyToken[] {
  const tokens: ParsedTypographyToken[] = [];
  const overrides: Record<string, string> = {};

  // Match all @theme blocks
  const themeBlockRegex = /@theme\s*\{([^}]+)\}/gs;
  const themeBlocks = [...cssContent.matchAll(themeBlockRegex)];

  // Find the typography block (contains --text-* without light-dark())
  for (const block of themeBlocks) {
    const blockContent = block[1];

    // Skip blocks that contain light-dark() - those are color blocks
    if (blockContent.includes("light-dark(")) {
      continue;
    }

    // Match typography variables: --text-* that don't use light-dark()
    const tokenRegex = /--(text-[\w-]+):\s*([^;]+);/g;
    const matches = [...blockContent.matchAll(tokenRegex)];

    for (const match of matches) {
      const name = match[1];
      const rawValue = match[2].trim();
      overrides[name] = rawValue;
    }
  }

  // Merge defaults with overrides (overrides take precedence)
  const mergedTokens = { ...DEFAULT_TYPOGRAPHY_TOKENS, ...overrides };

  // Convert to ParsedTypographyToken array
  for (const [name, rawValue] of Object.entries(mergedTokens)) {
    const { resolved, unit } = resolveTypographyValue(rawValue);
    tokens.push({
      name,
      rawValue,
      resolvedValue: resolved,
      unit,
    });
  }

  // Sort tokens by name for consistent ordering
  tokens.sort((a, b) => a.name.localeCompare(b.name));

  return tokens;
}

/**
 * Parses typography tokens from file path
 */
export async function parseTypographyTokensFromFile(
  filePath: string,
): Promise<ParsedTypographyToken[]> {
  const cssContent = await readFile(filePath, "utf-8");
  return parseTypographyTokens(cssContent);
}
