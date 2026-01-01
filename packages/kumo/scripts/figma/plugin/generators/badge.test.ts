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
    expect(parsed.borderRadius).toBe(9999); // rounded-full
  });

  it("should parse horizontal padding from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.paddingX).toBe(8); // px-2 = 8px
  });

  it("should parse vertical padding from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.paddingY).toBe(2); // py-0.5 = 2px
  });

  it("should parse font size from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.fontSize).toBe(12); // text-xs = 12px
  });

  it("should parse font weight from base styles", () => {
    const parsed = parseTailwindClasses(BADGE_BASE_STYLES);
    expect(parsed.fontWeight).toBe(500); // font-medium = 500
  });
});

describe("Badge Generator - Variant Styles Parsing", () => {
  describe("primary variant", () => {
    const classes = variantProp.classes.primary;

    it("should have correct classes", () => {
      expect(classes).toBe("bg-surface-inverse text-surface-inverse");
    });

    it("should parse fill variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-surface-inverse");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-surface-inverse");
    });

    it("should not have border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.hasBorder).toBeUndefined();
    });
  });

  describe("secondary variant", () => {
    const classes = variantProp.classes.secondary;

    it("should have correct classes", () => {
      expect(classes).toBe("bg-color text-surface");
    });

    it("should parse fill variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-color");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-surface");
    });
  });

  describe("destructive variant", () => {
    const classes = variantProp.classes.destructive;

    it("should have correct classes", () => {
      expect(classes).toBe("bg-error text-white");
    });

    it("should parse fill variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-error");
    });

    it("should detect white text", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.isWhiteText).toBe(true);
      expect(parsed.textVariable).toBeNull();
    });
  });

  describe("outline variant", () => {
    const classes = variantProp.classes.outline;

    it("should have correct classes", () => {
      expect(classes).toBe("border border-color bg-transparent text-surface");
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
      expect(parsed.strokeVariable).toBe("color-color");
    });

    it("should parse strokeWeight from border class", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeWeight).toBe(1); // "border" defaults to 1px
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-surface");
    });

    it("should not have dashPattern for solid border", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.dashPattern).toBeUndefined();
      expect(parsed.borderStyle).toBeUndefined();
    });
  });

  describe("beta variant", () => {
    const classes = variantProp.classes.beta;

    it("should have correct classes", () => {
      expect(classes).toBe(
        "border border-dashed border-primary bg-transparent text-info",
      );
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
      expect(parsed.strokeVariable).toBe("color-primary");
    });

    it("should parse strokeWeight from border class", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeWeight).toBe(1); // "border" defaults to 1px
    });

    it("should parse dashPattern from border-dashed", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.dashPattern).toEqual([4, 4]); // Default dash pattern
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-info");
    });
  });
});

describe("Badge Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for primary badge", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.primary);

    // Expected Figma component properties
    expect({
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
    }).toEqual({
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      paddingBottom: 2,
      cornerRadius: 9999,
      fillVariable: "color-surface-inverse",
      fontSize: 12,
      fontWeight: 500,
      textVariable: "text-color-surface-inverse",
    });
  });

  it("should produce correct Figma properties for outline badge (full chain)", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.outline);

    // Test full chain: registry → parser → expected Figma properties
    expect({
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
    }).toEqual({
      cornerRadius: 9999,
      paddingX: 8,
      paddingY: 2,
      fontSize: 12,
      fontWeight: 500,
      fillVariable: null, // transparent
      hasBorder: true,
      strokeVariable: "color-color",
      strokeWeight: 1, // Parsed from "border" class
      textVariable: "text-color-surface",
    });
  });

  it("should produce correct Figma properties for beta badge (full chain with dashPattern)", () => {
    const baseStyles = parseTailwindClasses(BADGE_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.beta);

    // Test full chain: registry → parser → expected Figma properties
    // This variant includes border-dashed, so dashPattern should be parsed
    expect({
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
    }).toEqual({
      cornerRadius: 9999,
      paddingX: 8,
      paddingY: 2,
      fontSize: 12,
      fontWeight: 500,
      fillVariable: null, // transparent
      hasBorder: true,
      borderStyle: "dashed",
      strokeVariable: "color-primary",
      strokeWeight: 1, // Parsed from "border" class
      dashPattern: [4, 4], // Parsed from "border-dashed" class
      textVariable: "text-color-info",
    });
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

  it("should parse strokeWeight from 'border' class (default 1px)", () => {
    const parsed = parseTailwindClasses("border");
    expect(parsed.strokeWeight).toBe(1);
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from 'border-2'", () => {
    const parsed = parseTailwindClasses("border-2");
    expect(parsed.strokeWeight).toBe(2);
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from 'border-4'", () => {
    const parsed = parseTailwindClasses("border-4");
    expect(parsed.strokeWeight).toBe(4);
    expect(parsed.hasBorder).toBe(true);
  });

  it("should parse strokeWeight from outline variant classes", () => {
    const classes = variantProp.classes.outline;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.strokeWeight).toBe(1); // "border" in classes
  });

  it("should parse strokeWeight from beta variant classes", () => {
    const classes = variantProp.classes.beta;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.strokeWeight).toBe(1); // "border" in classes
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
    expect(parsed.dashPattern).toEqual([4, 4]);
  });

  it("should parse dashPattern from beta variant classes", () => {
    const classes = variantProp.classes.beta;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.borderStyle).toBe("dashed");
    expect(parsed.dashPattern).toEqual([4, 4]);
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
