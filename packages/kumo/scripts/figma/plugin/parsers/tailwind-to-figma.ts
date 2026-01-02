/**
 * Tailwind to Figma Parser
 *
 * Parses Tailwind CSS classes from component variant definitions
 * and converts them to Figma-compatible values.
 *
 * This allows the Figma plugin to stay in sync with the component
 * source of truth (the KUMO_*_VARIANTS objects).
 */

/**
 * Helper to get value from scale with fallback
 * (Figma plugin runtime doesn't support ?? operator)
 */
function getOrDefault(
  scale: Record<string, number>,
  key: string,
  fallback: number,
): number {
  const value = scale[key];
  return value !== undefined ? value : fallback;
}

/**
 * Tailwind spacing scale (in pixels)
 * https://tailwindcss.com/docs/customizing-spacing
 */
const SPACING_SCALE: Record<string, number> = {
  "0": 0,
  px: 1,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "6.5": 26, // Custom Kumo size
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
};

/**
 * Tailwind font size scale (in pixels)
 */
const FONT_SIZE_SCALE: Record<string, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};

/**
 * Tailwind border radius scale (in pixels)
 */
const BORDER_RADIUS_SCALE: Record<string, number> = {
  none: 0,
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

/**
 * Tailwind font weight scale
 * https://tailwindcss.com/docs/font-weight
 */
const FONT_WEIGHT_SCALE: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

/**
 * Map Kumo semantic color classes to Figma variable names
 * These must match the kumo-colors collection in Figma
 */
const COLOR_TO_VARIABLE: Record<string, string> = {
  // Background colors
  "bg-primary": "color-primary",
  "bg-secondary": "color-secondary",
  "bg-surface": "color-surface",
  "bg-surface-inverse": "color-surface-inverse",
  "bg-error": "color-error",
  "bg-info": "color-info",
  "bg-alert": "color-alert",
  "bg-color": "color-color",
  "bg-accent": "color-accent",
  "bg-subtle": "color-subtle",
  "bg-transparent": null!, // No fill
  "bg-inherit": null!, // No fill

  // Text colors
  "text-white": null!, // Hardcoded white
  "text-surface": "text-color-surface",
  "text-surface-inverse": "text-color-surface-inverse",
  "text-error": "text-color-error",
  "text-info": "text-color-info",
  "text-alert": "text-color-alert",
  "text-muted": "text-color-muted",
  "text-label": "text-color-label",
  "!text-white": null!, // Hardcoded white (important)
  "!text-surface": "text-color-surface",
  "!text-error": "text-color-error",

  // Border colors
  "border-color": "color-color",
  "border-primary": "color-primary",
  "border-border": "color-border",
  "border-error": "color-error",
  "border-info": "color-info",
  "border-alert": "color-alert",
  "ring-border": "color-border",
  "ring-active": "color-active",
  "ring-error": "color-error",
};

/**
 * Parsed style information from Tailwind classes
 */
export type ParsedStyles = {
  // Layout
  height?: number;
  paddingX?: number;
  paddingY?: number;
  gap?: number;
  borderRadius?: number;

  // Typography
  fontSize?: number;
  fontWeight?: number;

  // Colors (Figma variable names)
  fillVariable?: string | null;
  fillOpacity?: number;
  textVariable?: string | null;
  strokeVariable?: string | null;

  // Special flags
  isWhiteText?: boolean;
  hasBorder?: boolean;
  borderStyle?: "solid" | "dashed";

  // Border properties
  strokeWeight?: number;
  dashPattern?: number[];
};

/**
 * Parse a Tailwind class string and extract Figma-compatible values
 */
export function parseTailwindClasses(classes: string): ParsedStyles {
  const result: ParsedStyles = {};
  const classList = classes.split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    // Skip state variants (hover:, disabled:, etc.)
    if (cls.includes(":") && !cls.startsWith("!")) {
      continue;
    }

    // Height: h-5, h-6.5, h-9, h-10
    const heightMatch = cls.match(/^h-(\d+\.?\d*)$/);
    if (heightMatch) {
      result.height = getOrDefault(
        SPACING_SCALE,
        heightMatch[1],
        parseFloat(heightMatch[1]) * 4,
      );
      continue;
    }

    // Padding X: px-1.5, px-2, px-3, px-4
    const pxMatch = cls.match(/^px-(\d+\.?\d*)$/);
    if (pxMatch) {
      result.paddingX = getOrDefault(
        SPACING_SCALE,
        pxMatch[1],
        parseFloat(pxMatch[1]) * 4,
      );
      continue;
    }

    // Padding Y: py-0.5, py-1, py-2
    const pyMatch = cls.match(/^py-(\d+\.?\d*)$/);
    if (pyMatch) {
      result.paddingY = getOrDefault(
        SPACING_SCALE,
        pyMatch[1],
        parseFloat(pyMatch[1]) * 4,
      );
      continue;
    }

    // Gap: gap-1, gap-1.5, gap-2
    const gapMatch = cls.match(/^gap-(\d+\.?\d*)$/);
    if (gapMatch) {
      result.gap = getOrDefault(
        SPACING_SCALE,
        gapMatch[1],
        parseFloat(gapMatch[1]) * 4,
      );
      continue;
    }

    // Border radius: rounded-sm, rounded-md, rounded-lg, rounded-full
    const radiusMatch = cls.match(/^rounded-?(\w*)$/);
    if (radiusMatch) {
      const key = radiusMatch[1] || "DEFAULT";
      result.borderRadius = getOrDefault(
        BORDER_RADIUS_SCALE,
        key,
        BORDER_RADIUS_SCALE.DEFAULT,
      );
      continue;
    }

    // Font size: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
    const fontMatch = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl)$/);
    if (fontMatch) {
      result.fontSize = FONT_SIZE_SCALE[fontMatch[1]];
      continue;
    }

    // Font weight: font-thin, font-light, font-normal, font-medium, font-semibold, font-bold
    const fontWeightMatch = cls.match(
      /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    );
    if (fontWeightMatch) {
      result.fontWeight = FONT_WEIGHT_SCALE[fontWeightMatch[1]];
      continue;
    }

    // Background colors (with optional opacity: bg-info/20)
    if (cls.startsWith("bg-")) {
      // Check for opacity modifier (e.g., bg-info/20)
      const opacityMatch = cls.match(/^(bg-[^/]+)\/([0-9]+)$/);
      if (opacityMatch) {
        const baseClass = opacityMatch[1];
        const opacityValue = opacityMatch[2];
        const varName = COLOR_TO_VARIABLE[baseClass];
        if (varName !== undefined) {
          // Use opacity variant variable directly (e.g., "color-info/20")
          // These are generated by sync-tokens-to-figma.ts
          result.fillVariable = `${varName}/${opacityValue}`;
          // No need for fillOpacity - it's baked into the variable
        }
      } else {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName !== undefined) {
          result.fillVariable = varName;
        }
      }
      continue;
    }

    // Text colors (including !important variants)
    if (cls.startsWith("text-") || cls.startsWith("!text-")) {
      const varName = COLOR_TO_VARIABLE[cls];
      if (varName !== undefined) {
        result.textVariable = varName;
        if (cls === "text-white" || cls === "!text-white") {
          result.isWhiteText = true;
        }
      }
      continue;
    }

    // Border
    if (cls === "border" || cls.startsWith("border-")) {
      result.hasBorder = true;

      // Parse border width: border (1px default), border-2, border-4, etc.
      if (cls === "border") {
        result.strokeWeight = 1;
      } else {
        const widthMatch = cls.match(/^border-(\d+)$/);
        if (widthMatch) {
          result.strokeWeight = parseInt(widthMatch[1], 10);
          continue;
        }
      }

      // Parse border style
      if (cls === "border-dashed") {
        result.borderStyle = "dashed";
        result.dashPattern = [4, 4];
      } else if (cls.startsWith("border-") && !cls.includes("dashed")) {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName) {
          result.strokeVariable = varName;
        }
      }
      continue;
    }

    // Ring (used as border in some variants)
    if (cls === "ring" || cls.startsWith("ring-")) {
      result.hasBorder = true;
      const varName = COLOR_TO_VARIABLE[cls];
      if (varName) {
        result.strokeVariable = varName;
      }
      continue;
    }
  }

  return result;
}

/**
 * Parse base styles string (like from badgeVariants or buttonVariants)
 */
export function parseBaseStyles(baseStylesString: string): ParsedStyles {
  return parseTailwindClasses(baseStylesString);
}
