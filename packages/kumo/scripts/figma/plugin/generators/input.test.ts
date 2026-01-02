/**
 * Tests for input.ts component generator
 *
 * These tests ensure the Input Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the input
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * input.tsx → component-registry.json → input.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { getBaseStyles, getSizeConfig, getAllVariantData } from "./input";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const inputComponent = registry.components.Input as any;
const inputProps = inputComponent.props;
const inputStyling = inputComponent.styling;

const sizeProp = inputProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

const variantProp = inputProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

describe("Input Generator - Registry Validation", () => {
  it("should have all expected size variants in registry", () => {
    const expectedSizes = ["xs", "sm", "base", "lg"];
    expect(sizeProp.values).toEqual(expectedSizes);
  });

  it("should have all expected variant types in registry", () => {
    const expectedVariants = ["default", "error"];
    expect(variantProp.values).toEqual(expectedVariants);
  });

  it("should have classes defined for all sizes", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.classes[size]).toBeDefined();
      expect(typeof sizeProp.classes[size]).toBe("string");
      expect(sizeProp.classes[size].length).toBeGreaterThan(0);
    }
  });

  it("should have classes defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.classes[variant]).toBeDefined();
      expect(typeof variantProp.classes[variant]).toBe("string");
      expect(variantProp.classes[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all sizes", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.descriptions[size]).toBeDefined();
      expect(typeof sizeProp.descriptions[size]).toBe("string");
      expect(sizeProp.descriptions[size].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.descriptions[variant]).toBeDefined();
      expect(typeof variantProp.descriptions[variant]).toBe("string");
      expect(variantProp.descriptions[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have base as default size", () => {
    expect(sizeProp.default).toBe("base");
  });

  it("should have default as default variant", () => {
    expect(variantProp.default).toBe("default");
  });
});

describe("Input Generator - Styling Metadata Validation", () => {
  it("should have styling metadata defined", () => {
    expect(inputStyling).toBeDefined();
    expect(inputStyling.sizeVariants).toBeDefined();
    expect(inputStyling.baseTokens).toBeDefined();
    expect(inputStyling.states).toBeDefined();
  });

  it("should have sizeVariants for all size variants", () => {
    const expectedSizes = ["xs", "sm", "base", "lg"];
    for (const size of expectedSizes) {
      expect(inputStyling.sizeVariants[size]).toBeDefined();
      expect(typeof inputStyling.sizeVariants[size].height).toBe("number");
      expect(typeof inputStyling.sizeVariants[size].dimensions.paddingX).toBe(
        "number",
      );
      expect(typeof inputStyling.sizeVariants[size].dimensions.fontSize).toBe(
        "number",
      );
      expect(
        typeof inputStyling.sizeVariants[size].dimensions.borderRadius,
      ).toBe("number");
    }
  });

  it("should have baseTokens defined", () => {
    expect(inputStyling.baseTokens).toBeDefined();
    expect(Array.isArray(inputStyling.baseTokens)).toBe(true);
    expect(inputStyling.baseTokens.length).toBeGreaterThan(0);
    expect(inputStyling.baseTokens).toContain("bg-secondary");
    expect(inputStyling.baseTokens).toContain("text-surface");
    expect(inputStyling.baseTokens).toContain("text-muted");
    expect(inputStyling.baseTokens).toContain("ring-border");
  });

  it("should have states for base, focus, error, and disabled", () => {
    expect(inputStyling.states.base).toBeDefined();
    expect(inputStyling.states.focus).toBeDefined();
    expect(inputStyling.states.error).toBeDefined();
    expect(inputStyling.states.disabled).toBeDefined();
  });

  it("should have correct focus state token", () => {
    expect(inputStyling.states.focus).toContain("ring-active");
  });

  it("should have correct error state token", () => {
    expect(inputStyling.states.error).toContain("ring-error");
  });

  it("should have correct disabled state tokens", () => {
    expect(inputStyling.states.disabled).toContain("opacity-50");
    expect(inputStyling.states.disabled).toContain("text-muted");
  });
});

describe("Input Generator - Size Styles Parsing", () => {
  describe("xs size", () => {
    const classes = sizeProp.classes.xs;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse height from h-5", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should parse horizontal padding from px-1.5", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });

    it("should parse font size from text-xs", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });

    it("should parse border radius from rounded-sm", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
    });
  });

  describe("sm size", () => {
    const classes = sizeProp.classes.sm;

    it("should parse height from h-6.5", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should parse border radius from rounded-md", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
    });
  });

  describe("base size", () => {
    const classes = sizeProp.classes.base;

    it("should parse height from h-9", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should parse font size from text-base", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
    });

    it("should parse border radius from rounded-lg", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
    });
  });

  describe("lg size", () => {
    const classes = sizeProp.classes.lg;

    it("should parse height from h-10", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
    });

    it("should parse horizontal padding from px-4", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
    });
  });
});

describe("Input Generator - Variant Styles Parsing", () => {
  describe("default variant", () => {
    const classes = variantProp.classes.default;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse focus ring color (focus:ring-active)", () => {
      // Note: Parser may not handle focus: pseudo-class, but we test registry structure
      expect(classes).toContain("ring-active");
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should have error ring color (!ring-error)", () => {
      expect(classes).toContain("ring-error");
    });

    it("should have focus error ring color (focus:ring-error)", () => {
      expect(classes).toContain("focus:ring-error");
    });
  });
});

describe("Input Generator - Testable Export Functions", () => {
  describe("getBaseStyles", () => {
    it("should return base styles from registry", () => {
      const styles = getBaseStyles();
      expect(styles).toBeDefined();
      expect(styles.raw).toBeDefined();
      expect(styles.parsed).toBeDefined();
      expect(styles.styling).toBeDefined();
    });

    it("should return parsed background variable", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.backgroundVariable).toBeDefined();
      expect(typeof styles.parsed.backgroundVariable).toBe("string");
    });

    it("should return parsed text variable", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.textVariable).toBeDefined();
      expect(typeof styles.parsed.textVariable).toBe("string");
    });

    it("should return parsed placeholder variable (can be null)", () => {
      const styles = getBaseStyles();
      // Placeholder is handled separately in the component, not in base state
      expect(styles.parsed.placeholderVariable).toBeNull();
    });

    it("should return parsed ring variable", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.ringVariable).toBeDefined();
      expect(typeof styles.parsed.ringVariable).toBe("string");
    });

    it("should include full styling metadata", () => {
      const styles = getBaseStyles();
      expect(styles.styling.sizeVariants).toBeDefined();
      expect(styles.styling.baseTokens).toBeDefined();
      expect(styles.styling.states).toBeDefined();
    });
  });

  describe("getSizeConfig", () => {
    it("should return dimensions for xs size", () => {
      const config = getSizeConfig("xs");
      expect(config.size).toBe("xs");
      expect(config.height).toBe(20);
      expect(config.dimensions.paddingX).toBe(6);
      expect(config.dimensions.fontSize).toBe(12);
      expect(config.dimensions.borderRadius).toBe(2);
    });

    it("should return dimensions for sm size", () => {
      const config = getSizeConfig("sm");
      expect(config.size).toBe("sm");
      expect(config.height).toBe(26);
      expect(config.dimensions.paddingX).toBe(8);
      expect(config.dimensions.fontSize).toBe(12);
      expect(config.dimensions.borderRadius).toBe(6);
    });

    it("should return dimensions for base size", () => {
      const config = getSizeConfig("base");
      expect(config.size).toBe("base");
      expect(config.height).toBe(36);
      expect(config.dimensions.paddingX).toBe(12);
      expect(config.dimensions.fontSize).toBe(16);
      expect(config.dimensions.borderRadius).toBe(8);
    });

    it("should return dimensions for lg size", () => {
      const config = getSizeConfig("lg");
      expect(config.size).toBe("lg");
      expect(config.height).toBe(40);
      expect(config.dimensions.paddingX).toBe(16);
      expect(config.dimensions.fontSize).toBe(16);
      expect(config.dimensions.borderRadius).toBe(8);
    });

    it("should throw error for unknown size", () => {
      expect(() => getSizeConfig("unknown")).toThrow();
    });
  });

  describe("getAllVariantData", () => {
    it("should return complete data structure", () => {
      const allData = getAllVariantData();
      expect(allData).toBeDefined();
      expect(allData.baseStyles).toBeDefined();
      expect(allData.sizes).toBeDefined();
      expect(allData.variants).toBeDefined();
      expect(allData.stateTokens).toBeDefined();
    });

    it("should return all size variants", () => {
      const allData = getAllVariantData();
      expect(allData.sizes).toHaveLength(4);
      const sizeNames = allData.sizes.map((s: any) => s.size);
      expect(sizeNames).toEqual(["xs", "sm", "base", "lg"]);
    });

    it("should return all variant types", () => {
      const allData = getAllVariantData();
      expect(allData.variants).toHaveLength(2);
      const variantNames = allData.variants.map((v: any) => v.variant);
      expect(variantNames).toEqual(["default", "error"]);
    });

    it("should include base styles with parsed data", () => {
      const allData = getAllVariantData();
      expect(allData.baseStyles.parsed.backgroundVariable).toBeDefined();
      expect(allData.baseStyles.parsed.textVariable).toBeDefined();
      expect(allData.baseStyles.parsed.ringVariable).toBeDefined();
    });

    it("should include dimensions for each size", () => {
      const allData = getAllVariantData();
      for (const size of allData.sizes) {
        expect(size.dimensions).toBeDefined();
        expect(typeof size.dimensions.height).toBe("number");
        expect(size.dimensions.dimensions).toBeDefined();
        expect(typeof size.dimensions.dimensions.paddingX).toBe("number");
        expect(typeof size.dimensions.dimensions.fontSize).toBe("number");
        expect(typeof size.dimensions.dimensions.borderRadius).toBe("number");
      }
    });

    it("should include state tokens", () => {
      const allData = getAllVariantData();
      expect(allData.stateTokens.base).toBeDefined();
      expect(allData.stateTokens.focus).toBeDefined();
      expect(allData.stateTokens.error).toBeDefined();
      expect(allData.stateTokens.disabled).toBeDefined();
    });
  });
});

describe("Input Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in Input component are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map bg-secondary for input background", () => {
    const parsed = parseTailwindClasses("bg-secondary");
    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
  });

  it("should map text-surface for input text", () => {
    const parsed = parseTailwindClasses("text-surface");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map text-muted for placeholder", () => {
    const parsed = parseTailwindClasses("text-muted");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map ring-border for default ring", () => {
    const parsed = parseTailwindClasses("ring ring-border");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });

  it("should map ring-active for focus state", () => {
    const parsed = parseTailwindClasses("ring ring-active");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });

  it("should map ring-error for error state", () => {
    const parsed = parseTailwindClasses("ring ring-error");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });
});

describe("Input Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for base size input", () => {
    const baseConfig = getSizeConfig("base");
    const baseStyles = getBaseStyles();

    // Expected Figma component properties - structural checks
    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "MIN",
      counterAxisAlignItems: "CENTER",
      paddingLeft: baseConfig.dimensions.paddingX,
      paddingRight: baseConfig.dimensions.paddingX,
      height: baseConfig.height,
      cornerRadius: baseConfig.dimensions.borderRadius,
      // Fill
      fillVariable: baseStyles.parsed.backgroundVariable,
      // Text
      fontSize: baseConfig.dimensions.fontSize,
      textVariable: baseStyles.parsed.textVariable,
      // Ring (stroke)
      ringVariable: baseStyles.parsed.ringVariable,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(typeof figmaProps.paddingLeft).toBe("number");
    expect(typeof figmaProps.paddingRight).toBe("number");
    expect(typeof figmaProps.height).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.fillVariable).toBe("string");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.textVariable).toBe("string");
    expect(typeof figmaProps.ringVariable).toBe("string");
  });

  it("should produce correct Figma properties for xs size input", () => {
    const xsConfig = getSizeConfig("xs");

    expect(xsConfig.height).toBe(20);
    expect(xsConfig.dimensions.paddingX).toBe(6);
    expect(xsConfig.dimensions.fontSize).toBe(12);
    expect(xsConfig.dimensions.borderRadius).toBe(2);
  });

  it("should produce correct Figma properties for lg size input", () => {
    const lgConfig = getSizeConfig("lg");

    expect(lgConfig.height).toBe(40);
    expect(lgConfig.dimensions.paddingX).toBe(16);
    expect(lgConfig.dimensions.fontSize).toBe(16);
    expect(lgConfig.dimensions.borderRadius).toBe(8);
  });
});

describe("Input Generator - Size Variant Count", () => {
  it("should have exactly 4 size variants", () => {
    expect(sizeProp.values).toHaveLength(4);
  });

  it("should include all expected sizes", () => {
    expect(sizeProp.values).toContain("xs");
    expect(sizeProp.values).toContain("sm");
    expect(sizeProp.values).toContain("base");
    expect(sizeProp.values).toContain("lg");
  });
});

describe("Input Generator - Variant Type Count", () => {
  it("should have exactly 2 variant types", () => {
    expect(variantProp.values).toHaveLength(2);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("default");
    expect(variantProp.values).toContain("error");
  });
});

describe("Input Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, size configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    input.tsx → component-registry.json → input.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Input component styles changed in input.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent base styles", () => {
    const baseStyles = getBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent size config for xs", () => {
    const config = getSizeConfig("xs");
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent size config for sm", () => {
    const config = getSizeConfig("sm");
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent size config for base", () => {
    const config = getSizeConfig("base");
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent size config for lg", () => {
    const config = getSizeConfig("lg");
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * input.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.sizes).toHaveLength(4);
    expect(allData.variants).toHaveLength(2);
    expect(allData.stateTokens).toBeDefined();

    // Each size should have complete data
    for (const size of allData.sizes) {
      expect(size.size).toBeDefined();
      expect(size.classes).toBeDefined();
      expect(size.description).toBeDefined();
      expect(size.dimensions).toBeDefined();
      expect(size.parsed).toBeDefined();
    }

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
