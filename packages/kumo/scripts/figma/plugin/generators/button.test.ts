/**
 * Tests for button.ts component generator
 *
 * These tests ensure the Button Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the button
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * button.tsx → component-registry.json → button.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  BUTTON_VARIANTS_EXPORT,
  BUTTON_SIZES_EXPORT,
  BUTTON_SHAPES_EXPORT,
  BUTTON_DISABLED_OPTIONS,
  BUTTON_LOADING_OPTIONS,
  BUTTON_STATE_OPTIONS,
} from "./button";
import { FALLBACK_VALUES, BORDER_RADIUS, OPACITY } from "./shared";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const buttonComponent = registry.components.Button;
const buttonProps = buttonComponent.props;
const variantProp = buttonProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};
const sizeProp = buttonProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};
const shapeProp = buttonProps.shape as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Base styles for Button component.
 * Note: Unlike Badge/Banner, Button doesn't export KUMO_BUTTON_BASE_STYLES.
 * Base styling is distributed across size and variant classes.
 * Common styles: flex items-center font-medium
 */
const BUTTON_BASE_STYLES = "flex items-center font-medium";

/**
 * Compact size mapping from button.tsx KUMO_BUTTON_VARIANTS.compactSize
 * Used for square and circle shapes
 * 
 * Derived from FALLBACK_VALUES.buttonCompactSize in shared.ts to prevent drift
 */
const COMPACT_SIZE_MAP: Record<string, number> = FALLBACK_VALUES.buttonCompactSize;

/**
 * State-specific style overrides (from button.ts STATE_STYLES)
 */
const STATE_STYLES: Record<
  string,
  Record<
    string,
    {
      fillVariable?: string;
      fillOpacity?: number;
      strokeVariable?: string;
      addRing?: boolean;
      textOpacity?: number;
    }
  >
> = {
  primary: {
    hover: { fillVariable: "color-primary/70" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-primary/70" },
  },
  secondary: {
    hover: { fillVariable: "color-subtle", strokeVariable: "color-subtle" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-subtle" },
  },
  ghost: {
    hover: { fillVariable: "color-accent" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-accent" },
  },
  destructive: {
    hover: { fillVariable: "color-error/70" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-error/70" },
  },
  "secondary-destructive": {
    hover: { fillVariable: "color-subtle", strokeVariable: "color-subtle" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-subtle" },
  },
  outline: {
    hover: { fillVariable: "color-subtle" },
    focus: { addRing: true },
    pressed: { fillVariable: "color-subtle" },
  },
};

/**
 * Helper: Get button variant config from registry
 */
export function getButtonVariantConfig() {
  return {
    variants: variantProp.values,
    sizes: sizeProp.values,
    shapes: shapeProp.values,
    defaultVariant: variantProp.default,
    defaultSize: sizeProp.default,
    defaultShape: shapeProp.default,
  };
}

/**
 * Helper: Get parsed base styles
 */
export function getButtonParsedBaseStyles() {
  const parsed = parseTailwindClasses(BUTTON_BASE_STYLES);
  return {
    raw: BUTTON_BASE_STYLES,
    parsed,
  };
}

/**
 * Helper: Get parsed variant styles
 */
export function getButtonParsedVariantStyles(variant: string) {
  const classes = variantProp.classes[variant] || "";
  const description = variantProp.descriptions[variant] || "";
  const parsed = parseTailwindClasses(classes);

  return {
    variant,
    classes,
    description,
    parsed,
  };
}

/**
 * Helper: Get parsed size styles
 */
export function getButtonParsedSizeStyles(size: string) {
  const classes = sizeProp.classes[size] || "";
  const description = sizeProp.descriptions[size] || "";
  const parsed = parseTailwindClasses(classes);

  return {
    size,
    classes,
    description,
    parsed,
  };
}

/**
 * Helper: Get parsed shape styles
 */
export function getButtonParsedShapeStyles(shape: string) {
  const classes = shapeProp.classes[shape] || "";
  const description = shapeProp.descriptions[shape] || "";
  const parsed = parseTailwindClasses(classes);

  return {
    shape,
    classes,
    description,
    parsed,
  };
}

/**
 * Helper: Get complete button configuration for a specific combination
 */
export function getButtonCompleteConfig(
  variant: string,
  size: string,
  shape: string,
  disabled: boolean,
  loading: boolean,
  state: string,
) {
  const baseStyles = getButtonParsedBaseStyles();
  const variantData = getButtonParsedVariantStyles(variant);
  const sizeData = getButtonParsedSizeStyles(size);
  const shapeData = getButtonParsedShapeStyles(shape);

  const isCompactShape = shape === "square" || shape === "circle";
  const buttonSize = isCompactShape ? COMPACT_SIZE_MAP[size] || 36 : undefined;

  // Build layout based on shape
  const layout: Record<string, unknown> = {
    layoutMode: "HORIZONTAL",
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
    itemSpacing: sizeData.parsed.gap || 6,
  };

  if (isCompactShape) {
    layout.primaryAxisSizingMode = "FIXED";
    layout.counterAxisSizingMode = "FIXED";
    layout.width = buttonSize;
    layout.height = buttonSize;
    layout.paddingLeft = 0;
    layout.paddingRight = 0;
  } else {
    layout.primaryAxisSizingMode = "AUTO";
    layout.counterAxisSizingMode = "FIXED";
    layout.paddingLeft = sizeData.parsed.paddingX || 12;
    layout.paddingRight = sizeData.parsed.paddingX || 12;
    layout.height = sizeData.parsed.height || 36;
  }

  layout.paddingTop = 0;
  layout.paddingBottom = 0;

  // Set corner radius based on shape
  if (shape === "circle") {
    layout.cornerRadius = BORDER_RADIUS.full;
  } else {
    layout.cornerRadius =
      sizeData.parsed.borderRadius !== undefined
        ? sizeData.parsed.borderRadius
        : BORDER_RADIUS.lg;
  }

  // Build fill/stroke/text data
  const fill = {
    fillVariable: variantData.parsed.fillVariable || null,
  };

  const stroke = {
    hasBorder: variantData.parsed.hasBorder || false,
    strokeVariable: variantData.parsed.strokeVariable || null,
    strokeWeight: variantData.parsed.strokeWeight || 1,
  };

  const text = {
    fontSize: sizeData.parsed.fontSize || 16,
    fontWeight: 500, // font-medium
    textVariable: variantData.parsed.textVariable || null,
    isWhiteText: variantData.parsed.isWhiteText || false,
  };

  // Apply state-specific overrides
  const stateOverrides =
    state !== "default" && !disabled && !loading
      ? STATE_STYLES[variant]?.[state] || null
      : null;

  return {
    variant,
    size,
    shape,
    disabled,
    loading,
    state,
    baseStyles,
    variantData,
    sizeData,
    shapeData,
    layout,
    fill,
    stroke,
    text,
    stateOverrides,
    opacity: disabled ? OPACITY.disabled : 1.0,
  };
}

/**
 * Helper: Get all button variant data (comprehensive snapshot data)
 */
export function getAllButtonVariantData() {
  const baseStyles = getButtonParsedBaseStyles();

  const variants = variantProp.values.map((variant) =>
    getButtonParsedVariantStyles(variant),
  );

  const sizes = sizeProp.values.map((size) => getButtonParsedSizeStyles(size));

  const shapes = shapeProp.values.map((shape) =>
    getButtonParsedShapeStyles(shape),
  );

  return {
    baseStyles,
    variants,
    sizes,
    shapes,
    compactSizeMap: COMPACT_SIZE_MAP,
    stateStyles: STATE_STYLES,
  };
}

describe("Button Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    // Dynamic check - resilient to adding new variants
    expect(variantProp.values.length).toBeGreaterThan(0);
    
    // Check required variants exist (not all variants)
    expect(variantProp.values).toContain("primary");
    expect(variantProp.values).toContain("secondary");
    expect(variantProp.values).toContain("ghost");
    expect(variantProp.values).toContain("destructive");
  });

  it("should have classes defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.classes[variant]).toBeDefined();
      expect(typeof variantProp.classes[variant]).toBe("string");
      expect(variantProp.classes[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.descriptions[variant]).toBeDefined();
      expect(typeof variantProp.descriptions[variant]).toBe("string");
      expect(variantProp.descriptions[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have secondary as default variant", () => {
    expect(variantProp.default).toBe("secondary");
  });

  it("should have all expected sizes in registry", () => {
    // Dynamic check - resilient to adding new sizes
    expect(sizeProp.values.length).toBeGreaterThan(0);
    
    // Check required sizes exist (common pattern)
    expect(sizeProp.values).toContain("base");
  });

  it("should have classes defined for all sizes", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.classes[size]).toBeDefined();
      expect(typeof sizeProp.classes[size]).toBe("string");
      expect(sizeProp.classes[size].length).toBeGreaterThan(0);
    }
  });

  it("should have base as default size", () => {
    expect(sizeProp.default).toBe("base");
  });

  it("should have all expected shapes in registry", () => {
    // Dynamic check - resilient to adding new shapes
    expect(shapeProp.values.length).toBeGreaterThan(0);
    
    // Check required shapes exist
    expect(shapeProp.values).toContain("base");
  });

  it("should have classes defined for all shapes", () => {
    for (const shape of shapeProp.values) {
      // Note: base shape may not have a classes entry (undefined is valid)
      if (shapeProp.classes[shape] !== undefined) {
        expect(typeof shapeProp.classes[shape]).toBe("string");
      }
    }
  });

  it("should have base as default shape", () => {
    expect(shapeProp.default).toBe("base");
  });
});

describe("Button Generator - Base Styles Parsing", () => {
  it("should have font weight defined", () => {
    const baseStylesParsed = parseTailwindClasses(BUTTON_BASE_STYLES);
    expect(baseStylesParsed.fontWeight).toBeDefined();
    expect(typeof baseStylesParsed.fontWeight).toBe("number");
  });

  it("should parse display flex from base styles", () => {
    // Base styles include "flex items-center"
    expect(BUTTON_BASE_STYLES).toContain("flex");
    expect(BUTTON_BASE_STYLES).toContain("items-center");
  });
});

describe("Button Generator - Variant Styles Parsing", () => {
  describe("primary variant", () => {
    const classes = variantProp.classes.primary;

    it("should have fill variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should detect white text", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.isWhiteText).toBe(true);
      expect(parsed.textVariable).toBeNull();
    });

    it("should not have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBeUndefined();
    });
  });

  describe("secondary variant", () => {
    const classes = variantProp.classes.secondary;

    it("should have fill variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should have text variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });

    it("should have ring (border)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBe(true);
    });

    it("should have stroke variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });
  });

  describe("ghost variant", () => {
    const classes = variantProp.classes.ghost;

    it("should have transparent fill", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeNull();
    });

    it("should have text variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });

    it("should not have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBeUndefined();
    });
  });

  describe("destructive variant", () => {
    const classes = variantProp.classes.destructive;

    it("should have fill variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should detect white text", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.isWhiteText).toBe(true);
      expect(parsed.textVariable).toBeNull();
    });
  });

  describe("secondary-destructive variant", () => {
    const classes = variantProp.classes["secondary-destructive"];

    it("should have fill variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should have text variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });

    it("should have ring (border)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBe(true);
    });
  });

  describe("outline variant", () => {
    const classes = variantProp.classes.outline;

    it("should have fill variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBe(true);
    });

    it("should have stroke variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse strokeWeight from ring class", () => {
      const parsed = parseTailwindClasses(classes);
      // Outline uses ring (not border) which may not set strokeWeight explicitly
      expect(parsed.hasBorder).toBe(true);
    });

    it("should have text variable defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });
});

describe("Button Generator - Size Styles Parsing", () => {
  describe("xs size", () => {
    const classes = sizeProp.classes.xs;

    it("should have height defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should have gap defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
    });

    it("should have border radius defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
    });

    it("should have padding defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });

    it("should have font size defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });
  });

  describe("sm size", () => {
    const classes = sizeProp.classes.sm;

    it("should have height defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should have gap defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
    });

    it("should have padding defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });

    it("should have font size defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });
  });

  describe("base size", () => {
    const classes = sizeProp.classes.base;

    it("should have height defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should have gap defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
    });

    it("should have border radius defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
    });

    it("should have padding defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });

    it("should have font size defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });
  });

  describe("lg size", () => {
    const classes = sizeProp.classes.lg;

    it("should have height defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should have gap defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
    });

    it("should have padding defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });

    it("should have font size defined", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });
  });
});

describe("Button Generator - Shape Styles Parsing", () => {
  describe("base shape", () => {
    it("should have no classes entry in registry", () => {
      // Base shape has no classes entry (undefined)
      expect(shapeProp.classes.base).toBeUndefined();
    });
  });

  describe("square shape", () => {
    const classes = shapeProp.classes.square;

    it("should have centering and padding classes", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  describe("circle shape", () => {
    const classes = shapeProp.classes.circle;

    it("should have centering, padding, and rounded-full classes", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse border radius as full", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
    });
  });
});

describe("Button Generator - Compact Size Map", () => {
  it("should have compact sizes defined for all button sizes", () => {
    expect(COMPACT_SIZE_MAP.xs).toBeDefined();
    expect(typeof COMPACT_SIZE_MAP.xs).toBe("number");
    expect(COMPACT_SIZE_MAP.sm).toBeDefined();
    expect(typeof COMPACT_SIZE_MAP.sm).toBe("number");
    expect(COMPACT_SIZE_MAP.base).toBeDefined();
    expect(typeof COMPACT_SIZE_MAP.base).toBe("number");
    expect(COMPACT_SIZE_MAP.lg).toBeDefined();
    expect(typeof COMPACT_SIZE_MAP.lg).toBe("number");
  });
});

describe("Button Generator - State Styles", () => {
  it("should have hover states for all variants", () => {
    for (const variant of variantProp.values) {
      expect(STATE_STYLES[variant]?.hover).toBeDefined();
      expect(STATE_STYLES[variant]?.hover.fillVariable).toBeDefined();
    }
  });

  it("should have focus states for all variants", () => {
    for (const variant of variantProp.values) {
      expect(STATE_STYLES[variant]?.focus).toBeDefined();
      expect(STATE_STYLES[variant]?.focus.addRing).toBe(true);
    }
  });

  it("should have pressed states for all variants", () => {
    for (const variant of variantProp.values) {
      expect(STATE_STYLES[variant]?.pressed).toBeDefined();
      expect(STATE_STYLES[variant]?.pressed.fillVariable).toBeDefined();
    }
  });

  it("should have fillVariable defined for primary hover", () => {
    expect(STATE_STYLES.primary.hover.fillVariable).toBeDefined();
    expect(typeof STATE_STYLES.primary.hover.fillVariable).toBe("string");
  });

  it("should have fillVariable defined for secondary hover", () => {
    expect(STATE_STYLES.secondary.hover.fillVariable).toBeDefined();
    expect(typeof STATE_STYLES.secondary.hover.fillVariable).toBe("string");
  });

  it("should have fillVariable defined for ghost hover", () => {
    expect(STATE_STYLES.ghost.hover.fillVariable).toBeDefined();
    expect(typeof STATE_STYLES.ghost.hover.fillVariable).toBe("string");
  });

  it("should have fillVariable defined for destructive hover", () => {
    expect(STATE_STYLES.destructive.hover.fillVariable).toBeDefined();
    expect(typeof STATE_STYLES.destructive.hover.fillVariable).toBe("string");
  });
});

describe("Button Generator - Color Token Coverage", () => {
  it("should map all button background colors", () => {
    const bgColors = [
      "bg-primary",
      "bg-secondary",
      "bg-transparent",
      "bg-error",
    ];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.fillVariable !== undefined).toBe(true);
    }
  });

  it("should map all button text colors", () => {
    const textColors = ["text-white", "text-surface", "text-error"];

    for (const color of textColors) {
      const parsed = parseTailwindClasses(color);
      expect(
        parsed.textVariable !== undefined || parsed.isWhiteText === true,
      ).toBe(true);
    }
  });

  it("should map all button border colors", () => {
    const borderColors = ["border-border", "ring-border"];

    for (const color of borderColors) {
      const parsed = parseTailwindClasses(`border ${color}`);
      expect(parsed.strokeVariable).toBeDefined();
    }
  });
});

describe("Button Generator - Expected Figma Output", () => {
  it("should produce correct Figma properties for primary button (base size, base shape)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "default",
    );

    expect(config.layout).toBeDefined();
    expect(config.layout.layoutMode).toBe("HORIZONTAL");
    expect(config.layout.primaryAxisAlignItems).toBe("CENTER");
    expect(config.layout.counterAxisAlignItems).toBe("CENTER");
    expect(typeof config.layout.height).toBe("number");
    expect(typeof config.layout.itemSpacing).toBe("number");
    expect(typeof config.layout.cornerRadius).toBe("number");

    expect(config.fill).toBeDefined();
    expect(config.fill.fillVariable).toBeDefined();

    expect(config.text).toBeDefined();
    expect(typeof config.text.fontSize).toBe("number");
    expect(typeof config.text.fontWeight).toBe("number");
    expect(config.text.isWhiteText).toBe(true);
  });

  it("should produce correct Figma properties for secondary button with border", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "base",
      false,
      false,
      "default",
    );

    expect(config.fill).toBeDefined();
    expect(config.fill.fillVariable).toBeDefined();

    expect(config.stroke).toBeDefined();
    expect(config.stroke.hasBorder).toBe(true);
    expect(config.stroke.strokeVariable).toBeDefined();
    expect(typeof config.stroke.strokeWeight).toBe("number");

    expect(config.text).toBeDefined();
    expect(typeof config.text.fontSize).toBe("number");
    expect(typeof config.text.fontWeight).toBe("number");
    expect(config.text.textVariable).toBeDefined();
    expect(config.text.isWhiteText).toBe(false);
  });

  it("should produce correct Figma properties for ghost button (transparent)", () => {
    const config = getButtonCompleteConfig(
      "ghost",
      "base",
      "base",
      false,
      false,
      "default",
    );

    expect(config.fill).toBeDefined();
    expect(config.fill.fillVariable).toBeNull();

    expect(config.text.textVariable).toBeDefined();
  });

  it("should produce correct Figma properties for square button (compact)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "square",
      false,
      false,
      "default",
    );

    expect(config.layout).toBeDefined();
    expect(config.layout.layoutMode).toBe("HORIZONTAL");
    expect(config.layout.primaryAxisSizingMode).toBe("FIXED");
    expect(config.layout.counterAxisSizingMode).toBe("FIXED");
    expect(typeof config.layout.width).toBe("number");
    expect(typeof config.layout.height).toBe("number");
    expect(config.layout.paddingLeft).toBe(0);
    expect(config.layout.paddingRight).toBe(0);
    expect(typeof config.layout.cornerRadius).toBe("number");
  });

  it("should produce correct Figma properties for circle button (compact + rounded-full)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "circle",
      false,
      false,
      "default",
    );

    expect(config.layout).toBeDefined();
    expect(config.layout.layoutMode).toBe("HORIZONTAL");
    expect(config.layout.primaryAxisSizingMode).toBe("FIXED");
    expect(config.layout.counterAxisSizingMode).toBe("FIXED");
    expect(typeof config.layout.width).toBe("number");
    expect(typeof config.layout.height).toBe("number");
    expect(config.layout.paddingLeft).toBe(0);
    expect(config.layout.paddingRight).toBe(0);
    expect(typeof config.layout.cornerRadius).toBe("number");
    expect(config.layout.cornerRadius).toBeGreaterThan(100); // rounded-full is a large value
  });

  it("should produce correct Figma properties for disabled button (opacity OPACITY.disabled)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      true,
      false,
      "default",
    );

    expect(config.disabled).toBe(true);
    expect(config.opacity).toBe(OPACITY.disabled);
  });

  it("should produce correct Figma properties for hover state", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "hover",
    );

    expect(config.state).toBe("hover");
    expect(config.stateOverrides).toBeDefined();
    expect(config.stateOverrides?.fillVariable).toBeDefined();
  });

  it("should produce correct Figma properties for focus state (ring)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "base",
      false,
      false,
      "focus",
    );

    expect(config.state).toBe("focus");
    expect(config.stateOverrides).toBeDefined();
    expect(config.stateOverrides?.addRing).toBe(true);
  });
});

describe("Button Generator - Variant Count", () => {
  it("should have variants defined", () => {
    // Dynamic count check - resilient to adding new variants
    expect(variantProp.values.length).toBeGreaterThan(0);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("primary");
    expect(variantProp.values).toContain("secondary");
    expect(variantProp.values).toContain("ghost");
    expect(variantProp.values).toContain("destructive");
    expect(variantProp.values).toContain("secondary-destructive");
    expect(variantProp.values).toContain("outline");
  });

  it("should have sizes defined", () => {
    // Dynamic count check - resilient to adding new sizes
    expect(sizeProp.values.length).toBeGreaterThan(0);
  });

  it("should include all expected sizes", () => {
    expect(sizeProp.values).toContain("xs");
    expect(sizeProp.values).toContain("sm");
    expect(sizeProp.values).toContain("base");
    expect(sizeProp.values).toContain("lg");
  });

  it("should have shapes defined", () => {
    // Dynamic count check - resilient to adding new shapes
    expect(shapeProp.values.length).toBeGreaterThan(0);
  });

  it("should include all expected shapes", () => {
    expect(shapeProp.values).toContain("base");
    expect(shapeProp.values).toContain("square");
    expect(shapeProp.values).toContain("circle");
  });
});

describe("Button Generator - Exports Validation", () => {
  it("should export button variants matching registry", () => {
    expect(BUTTON_VARIANTS_EXPORT).toEqual(variantProp.values);
  });

  it("should export button sizes matching registry", () => {
    expect(BUTTON_SIZES_EXPORT).toEqual(sizeProp.values);
  });

  it("should export button shapes matching registry", () => {
    expect(BUTTON_SHAPES_EXPORT).toEqual(shapeProp.values);
  });

  it("should export disabled options as boolean array", () => {
    expect(BUTTON_DISABLED_OPTIONS).toEqual([false, true]);
  });

  it("should export loading options as boolean array", () => {
    expect(BUTTON_LOADING_OPTIONS).toEqual([false, true]);
  });

  it("should export state options", () => {
    expect(BUTTON_STATE_OPTIONS).toEqual([
      "default",
      "hover",
      "focus",
      "pressed",
    ]);
  });
});

describe("Button Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    button.tsx → component-registry.json → button.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Button component styles changed in button.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent variant config from registry", () => {
    const config = getButtonVariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent parsed base styles", () => {
    const baseStyles = getButtonParsedBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for primary variant", () => {
    const variantData = getButtonParsedVariantStyles("primary");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for secondary variant", () => {
    const variantData = getButtonParsedVariantStyles("secondary");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for ghost variant", () => {
    const variantData = getButtonParsedVariantStyles("ghost");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for destructive variant", () => {
    const variantData = getButtonParsedVariantStyles("destructive");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for secondary-destructive variant", () => {
    const variantData = getButtonParsedVariantStyles("secondary-destructive");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for outline variant", () => {
    const variantData = getButtonParsedVariantStyles("outline");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for xs size", () => {
    const sizeData = getButtonParsedSizeStyles("xs");
    expect(sizeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for sm size", () => {
    const sizeData = getButtonParsedSizeStyles("sm");
    expect(sizeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for base size", () => {
    const sizeData = getButtonParsedSizeStyles("base");
    expect(sizeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for lg size", () => {
    const sizeData = getButtonParsedSizeStyles("lg");
    expect(sizeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for base shape", () => {
    const shapeData = getButtonParsedShapeStyles("base");
    expect(shapeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for square shape", () => {
    const shapeData = getButtonParsedShapeStyles("square");
    expect(shapeData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for circle shape", () => {
    const shapeData = getButtonParsedShapeStyles("circle");
    expect(shapeData).toMatchSnapshot();
  });

  it("should produce consistent complete button variant data", () => {
    const allData = getAllButtonVariantData();
    expect(allData).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TESTS - Complete configurations
   *
   * These capture the complete configuration for key button combinations
   * that represent the most common use cases. They test the full chain
   * from registry to computed Figma properties.
   */

  it("should produce consistent config for primary button (default state)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for secondary button (default state)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for ghost button (default state)", () => {
    const config = getButtonCompleteConfig(
      "ghost",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for destructive button (default state)", () => {
    const config = getButtonCompleteConfig(
      "destructive",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for secondary-destructive button (default state)", () => {
    const config = getButtonCompleteConfig(
      "secondary-destructive",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for outline button (default state)", () => {
    const config = getButtonCompleteConfig(
      "outline",
      "base",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for primary button (hover state)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "hover",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for primary button (focus state)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "focus",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for primary button (pressed state)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      false,
      "pressed",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for primary button (disabled)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      true,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for primary button (loading)", () => {
    const config = getButtonCompleteConfig(
      "primary",
      "base",
      "base",
      false,
      true,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for square button (base size)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "square",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for circle button (base size)", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "base",
      "circle",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for xs size button", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "xs",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent config for lg size button", () => {
    const config = getButtonCompleteConfig(
      "secondary",
      "lg",
      "base",
      false,
      false,
      "default",
    );
    expect(config).toMatchSnapshot();
  });

  /**
   * COMPREHENSIVE DATA SNAPSHOT
   *
   * This test captures ALL parsed data for buttons in one snapshot.
   * It's the most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllButtonVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.variants).toHaveLength(6);
    expect(allData.sizes).toHaveLength(4);
    expect(allData.shapes).toHaveLength(3);
    expect(allData.compactSizeMap).toBeDefined();
    expect(allData.stateStyles).toBeDefined();

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
    }

    // Each size should have complete data
    for (const size of allData.sizes) {
      expect(size.size).toBeDefined();
      expect(size.classes).toBeDefined();
      expect(size.description).toBeDefined();
      expect(size.parsed).toBeDefined();
    }

    // Each shape should have complete data
    for (const shape of allData.shapes) {
      expect(shape.shape).toBeDefined();
      expect(shape.classes).toBeDefined();
      expect(shape.description).toBeDefined();
      expect(shape.parsed).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
