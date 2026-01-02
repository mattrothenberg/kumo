/**
 * Tests for badge.ts component generator
 *
 * These tests ensure the Badge Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the badge
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * badge.tsx → component-registry.json → badge.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  getBadgeVariantConfig,
  getBadgeParsedBaseStyles,
  getBadgeParsedVariantStyles,
  getAllBadgeVariantData,
} from "./badge";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const badgeComponent = registry.components.Badge;
const badgeProps = badgeComponent.props;
const variantProp = badgeProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Base styles from component-registry.json (extracted from KUMO_BADGE_BASE_STYLES).
 * This is the canonical base style string - the source of truth chain is:
 *
 *   badge.tsx (KUMO_BADGE_BASE_STYLES) → component-registry.json → badge.ts (generator)
 *
 * If base styles change in badge.tsx, run `pnpm build:ai-metadata` to update the registry,
 * and these tests will verify the parser handles the new styles correctly.
 */
const BADGE_BASE_STYLES = badgeComponent.baseStyles as string;

describe("Badge Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    const expectedVariants = [
      "primary",
      "secondary",
      "destructive",
      "outline",
      "beta",
    ];
    expect(variantProp.values).toEqual(expectedVariants);
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

  it("should have primary as default variant", () => {
    expect(variantProp.default).toBe("primary");
  });
});

describe("Badge Generator - Base Styles Parsing", () => {
  it("should parse border-radius from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse horizontal padding from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
    expect(parsed.paddingX).toBeGreaterThan(0);
  });

  it("should parse vertical padding from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.paddingY).toBeDefined();
    expect(typeof parsed.paddingY).toBe("number");
    expect(parsed.paddingY).toBeGreaterThan(0);
  });

  it("should parse font size from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });

  it("should parse font weight from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.fontWeight).toBeDefined();
    expect(typeof parsed.fontWeight).toBe("number");
    expect(parsed.fontWeight).toBeGreaterThan(0);
  });
});

describe("Badge Generator - Variant Styles Parsing", () => {
  describe("primary variant", () => {
    const classes = variantProp.classes.primary;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse fill variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });

    it("should not have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBeUndefined();
    });
  });

  describe("secondary variant", () => {
    const classes = variantProp.classes.secondary;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse fill variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("destructive variant", () => {
    const classes = variantProp.classes.destructive;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse fill variable", () => {
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

  describe("outline variant", () => {
    const classes = variantProp.classes.outline;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should have transparent fill", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeNull();
    });

    it("should have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBe(true);
    });

    it("should parse stroke variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse strokeWeight from border class", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeWeight).toBeDefined();
      expect(typeof parsed.strokeWeight).toBe("number");
      expect(parsed.strokeWeight).toBeGreaterThan(0);
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });

    it("should not have dashPattern for solid border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.dashPattern).toBeUndefined();
      expect(parsed.borderStyle).toBeUndefined();
    });
  });

  describe("beta variant", () => {
    const classes = variantProp.classes.beta;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should have transparent fill", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeNull();
    });

    it("should have dashed border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBe(true);
      expect(parsed.borderStyle).toBe("dashed");
    });

    it("should parse stroke variable (border-primary)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse strokeWeight from border class", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeWeight).toBeDefined();
      expect(typeof parsed.strokeWeight).toBe("number");
      expect(parsed.strokeWeight).toBeGreaterThan(0);
    });

    it("should parse dashPattern from border-dashed", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.dashPattern).toBeDefined();
      expect(Array.isArray(parsed.dashPattern)).toBe(true);
      if (parsed.dashPattern) {
        expect(parsed.dashPattern.length).toBeGreaterThan(0);
      }
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });
});

describe("Badge Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   * Structural assertions ensure properties exist and have correct types.
   */

  it("should produce correct Figma properties for primary badge", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.primary);

    // Expected Figma component properties - structural checks
    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      paddingLeft: baseStyles.paddingX,
      paddingRight: baseStyles.paddingX,
      paddingTop: baseStyles.paddingY,
      paddingBottom: baseStyles.paddingY,
      cornerRadius: baseStyles.borderRadius,
      // Fill
      fillVariable: variantStyles.fillVariable,
      // Text
      fontSize: baseStyles.fontSize,
      fontWeight: 500, // font-medium
      textVariable: variantStyles.textVariable,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaProps.counterAxisAlignItems).toBe("CENTER");
    expect(typeof figmaProps.paddingLeft).toBe("number");
    expect(typeof figmaProps.paddingRight).toBe("number");
    expect(typeof figmaProps.paddingTop).toBe("number");
    expect(typeof figmaProps.paddingBottom).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.fillVariable).toBe("string");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(typeof figmaProps.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for outline badge (full chain)", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.outline);

    // Test full chain: registry → parser → expected Figma properties
    const figmaProps = {
      // Layout from base styles
      cornerRadius: baseStyles.borderRadius,
      paddingX: baseStyles.paddingX,
      paddingY: baseStyles.paddingY,
      // Typography from base styles
      fontSize: baseStyles.fontSize,
      fontWeight: baseStyles.fontWeight,
      // Fill from variant styles
      fillVariable: variantStyles.fillVariable,
      // Border from variant styles
      hasBorder: variantStyles.hasBorder,
      strokeVariable: variantStyles.strokeVariable,
      strokeWeight: variantStyles.strokeWeight,
      // Text from variant styles
      textVariable: variantStyles.textVariable,
    };

    // Structural assertions
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.paddingX).toBe("number");
    expect(typeof figmaProps.paddingY).toBe("number");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fillVariable).toBeNull(); // transparent
    expect(figmaProps.hasBorder).toBe(true);
    expect(typeof figmaProps.strokeVariable).toBe("string");
    expect(typeof figmaProps.strokeWeight).toBe("number");
    expect(typeof figmaProps.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for beta badge (full chain with dashPattern)", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.beta);

    // Test full chain: registry → parser → expected Figma properties
    // This variant includes border-dashed, so dashPattern should be parsed
    const figmaProps = {
      // Layout from base styles
      cornerRadius: baseStyles.borderRadius,
      paddingX: baseStyles.paddingX,
      paddingY: baseStyles.paddingY,
      // Typography from base styles
      fontSize: baseStyles.fontSize,
      fontWeight: baseStyles.fontWeight,
      // Fill from variant styles
      fillVariable: variantStyles.fillVariable,
      // Border from variant styles (including dash)
      hasBorder: variantStyles.hasBorder,
      borderStyle: variantStyles.borderStyle,
      strokeVariable: variantStyles.strokeVariable,
      strokeWeight: variantStyles.strokeWeight,
      dashPattern: variantStyles.dashPattern,
      // Text from variant styles
      textVariable: variantStyles.textVariable,
    };

    // Structural assertions
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.paddingX).toBe("number");
    expect(typeof figmaProps.paddingY).toBe("number");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fillVariable).toBeNull(); // transparent
    expect(figmaProps.hasBorder).toBe(true);
    expect(figmaProps.borderStyle).toBe("dashed");
    expect(typeof figmaProps.strokeVariable).toBe("string");
    expect(typeof figmaProps.strokeWeight).toBe("number");
    expect(Array.isArray(figmaProps.dashPattern)).toBe(true);
    expect(typeof figmaProps.textVariable).toBe("string");
  });
});

describe("Badge Generator - Variant Count", () => {
  it("should have exactly 5 variants", () => {
    expect(variantProp.values).toHaveLength(5);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("primary");
    expect(variantProp.values).toContain("secondary");
    expect(variantProp.values).toContain("destructive");
    expect(variantProp.values).toContain("outline");
    expect(variantProp.values).toContain("beta");
  });
});

describe("Badge Generator - StrokeWeight Parsing", () => {
  /**
   * Test that strokeWeight is correctly parsed from border classes.
   * This ensures the parser extracts border width values for Figma.
   */

  it("should parse strokeWeight from 'border' class", () => {
    const parsed = parseTailwindClasses("border");
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from 'border-2'", () => {
    const parsed = parseTailwindClasses("border-2");
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from 'border-4'", () => {
    const parsed = parseTailwindClasses("border-4");
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from outline variant classes", () => {
    const classes = variantProp.classes.outline;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
  });

  it("should parse strokeWeight from beta variant classes", () => {
    const classes = variantProp.classes.beta;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
  });
});

describe("Badge Generator - DashPattern Parsing", () => {
  /**
   * Test that dashPattern is correctly parsed from border-dashed class.
   * This ensures the parser extracts dashed border patterns for Figma.
   */

  it("should parse dashPattern from 'border-dashed' class", () => {
    const parsed = parseTailwindClasses("border border-dashed");
    expect(parsed.borderStyle).toBe("dashed");
    expect(parsed.dashPattern).toBeDefined();
    expect(Array.isArray(parsed.dashPattern)).toBe(true);
  });

  it("should parse dashPattern from beta variant classes", () => {
    const classes = variantProp.classes.beta;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.borderStyle).toBe("dashed");
    expect(parsed.dashPattern).toBeDefined();
    expect(Array.isArray(parsed.dashPattern)).toBe(true);
  });

  it("should not parse dashPattern for solid borders", () => {
    const classes = variantProp.classes.outline;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.borderStyle).toBeUndefined();
    expect(parsed.dashPattern).toBeUndefined();
  });

  it("should not parse dashPattern for variants without borders", () => {
    const classes = variantProp.classes.primary;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.borderStyle).toBeUndefined();
    expect(parsed.dashPattern).toBeUndefined();
  });
});

describe("Badge Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in badge variants are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map all badge background colors", () => {
    const bgColors = [
      "bg-surface-inverse",
      "bg-color",
      "bg-error",
      "bg-transparent",
    ];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      // Should either have a variable or be null (for transparent)
      expect(parsed.fillVariable !== undefined).toBe(true);
    }
  });

  it("should map all badge text colors", () => {
    const textColors = [
      "text-surface-inverse",
      "text-surface",
      "text-white",
      "text-info",
    ];

    for (const color of textColors) {
      const parsed = parseTailwindClasses(color);
      // Should either have a variable or isWhiteText flag
      expect(
        parsed.textVariable !== undefined || parsed.isWhiteText === true,
      ).toBe(true);
    }
  });

  it("should map all badge border colors", () => {
    const borderColors = ["border-color", "border-primary"];

    for (const color of borderColors) {
      const parsed = parseTailwindClasses(`border ${color}`);
      expect(parsed.strokeVariable).toBeDefined();
    }
  });
});

describe("Badge Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    badge.tsx → component-registry.json → badge.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Badge component styles changed in badge.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent variant config from registry", () => {
    const config = getBadgeVariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent parsed base styles", () => {
    const baseStyles = getBadgeParsedBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for primary variant", () => {
    const variantData = getBadgeParsedVariantStyles("primary");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for secondary variant", () => {
    const variantData = getBadgeParsedVariantStyles("secondary");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for destructive variant", () => {
    const variantData = getBadgeParsedVariantStyles("destructive");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for outline variant", () => {
    const variantData = getBadgeParsedVariantStyles("outline");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for beta variant", () => {
    const variantData = getBadgeParsedVariantStyles("beta");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent complete badge variant data", () => {
    const allData = getAllBadgeVariantData();
    expect(allData).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * badge.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllBadgeVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.variants).toHaveLength(5);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
      expect(variant.layout).toBeDefined();
      expect(variant.text).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
