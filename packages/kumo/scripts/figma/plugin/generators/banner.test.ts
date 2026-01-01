/**
 * Tests for banner.ts component generator
 *
 * These tests ensure the Banner Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the banner
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * banner.tsx → component-registry.json → banner.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  getBannerVariantConfig,
  getBannerParsedBaseStyles,
  getBannerParsedVariantStyles,
  getAllBannerVariantData,
} from "./banner";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const bannerComponent = registry.components
  .Banner as typeof registry.components.Banner & {
  baseStyles?: string;
};
const bannerProps = bannerComponent.props;
const variantProp = bannerProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Base styles from component-registry.json (extracted from KUMO_BANNER_BASE_STYLES).
 * This is the canonical base style string - the source of truth chain is:
 *
 *   banner.tsx (KUMO_BANNER_BASE_STYLES) → component-registry.json → banner.ts (generator)
 *
 * If base styles change in banner.tsx, run `pnpm build:ai-metadata` to update the registry,
 * and these tests will verify the parser handles the new styles correctly.
 */
const BANNER_BASE_STYLES =
  bannerComponent.baseStyles ||
  "flex w-full items-center gap-2 rounded-lg border px-4 py-1.5 text-base";

describe("Banner Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    const expectedVariants = ["default", "alert", "error"];
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

  it("should have default as default variant", () => {
    expect(variantProp.default).toBe("default");
  });
});

describe("Banner Generator - Base Styles Parsing", () => {
  it("should parse border-radius from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.borderRadius).toBe(8); // rounded-lg
  });

  it("should parse horizontal padding from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.paddingX).toBe(16); // px-4 = 16px
  });

  it("should parse vertical padding from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.paddingY).toBe(6); // py-1.5 = 6px
  });

  it("should parse font size from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.fontSize).toBe(16); // text-base = 16px
  });

  it("should parse gap from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.gap).toBe(8); // gap-2 = 8px
  });

  it("should detect border presence from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.hasBorder).toBe(true); // border class present
  });
});

describe("Banner Generator - Variant Styles Parsing", () => {
  describe("default variant", () => {
    const classes = variantProp.classes.default;

    it("should have correct classes", () => {
      expect(classes).toBe(
        "bg-info/20 border-info text-info selection:bg-info-selection",
      );
    });

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-info/20");
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBe("color-info");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-info");
    });
  });

  describe("alert variant", () => {
    const classes = variantProp.classes.alert;

    it("should have correct classes", () => {
      expect(classes).toBe(
        "bg-alert/20 border-alert text-alert selection:bg-alert-selection",
      );
    });

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-alert/20");
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBe("color-alert");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-alert");
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should have correct classes", () => {
      expect(classes).toBe(
        "bg-error/20 border-error text-error selection:bg-error-selection",
      );
    });

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBe("color-error/20");
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBe("color-error");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBe("text-color-error");
    });
  });
});

describe("Banner Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for default banner", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.default);

    // Expected Figma component properties
    expect({
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      itemSpacing: baseStyles.gap,
      paddingLeft: baseStyles.paddingX,
      paddingRight: baseStyles.paddingX,
      paddingTop: baseStyles.paddingY,
      paddingBottom: baseStyles.paddingY,
      cornerRadius: baseStyles.borderRadius,
      // Fill
      fillVariable: variantStyles.fillVariable,
      // Border
      strokeVariable: variantStyles.strokeVariable,
      // Text
      fontSize: baseStyles.fontSize,
      fontWeight: 400, // normal
      textVariable: variantStyles.textVariable,
    }).toEqual({
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      itemSpacing: 8,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 6,
      paddingBottom: 6,
      cornerRadius: 8,
      fillVariable: "color-info/20",
      strokeVariable: "color-info",
      fontSize: 16,
      fontWeight: 400,
      textVariable: "text-color-info",
    });
  });

  it("should produce correct Figma properties for alert banner (full chain)", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.alert);

    // Test full chain: registry → parser → expected Figma properties
    expect({
      // Layout from base styles
      cornerRadius: baseStyles.borderRadius,
      paddingX: baseStyles.paddingX,
      paddingY: baseStyles.paddingY,
      itemSpacing: baseStyles.gap,
      // Typography from base styles
      fontSize: baseStyles.fontSize,
      fontWeight: 400,
      // Fill from variant styles (with opacity)
      fillVariable: variantStyles.fillVariable,
      // Border from variant styles
      strokeVariable: variantStyles.strokeVariable,
      // Text from variant styles
      textVariable: variantStyles.textVariable,
    }).toEqual({
      cornerRadius: 8,
      paddingX: 16,
      paddingY: 6,
      itemSpacing: 8,
      fontSize: 16,
      fontWeight: 400,
      fillVariable: "color-alert/20",
      strokeVariable: "color-alert",
      textVariable: "text-color-alert",
    });
  });

  it("should produce correct Figma properties for error banner (full chain)", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.error);

    // Test full chain: registry → parser → expected Figma properties
    expect({
      // Layout from base styles
      cornerRadius: baseStyles.borderRadius,
      paddingX: baseStyles.paddingX,
      paddingY: baseStyles.paddingY,
      itemSpacing: baseStyles.gap,
      // Typography from base styles
      fontSize: baseStyles.fontSize,
      fontWeight: 400,
      // Fill from variant styles (with opacity)
      fillVariable: variantStyles.fillVariable,
      // Border from variant styles
      strokeVariable: variantStyles.strokeVariable,
      // Text from variant styles
      textVariable: variantStyles.textVariable,
    }).toEqual({
      cornerRadius: 8,
      paddingX: 16,
      paddingY: 6,
      itemSpacing: 8,
      fontSize: 16,
      fontWeight: 400,
      fillVariable: "color-error/20",
      strokeVariable: "color-error",
      textVariable: "text-color-error",
    });
  });
});

describe("Banner Generator - Variant Count", () => {
  it("should have exactly 3 variants", () => {
    expect(variantProp.values).toHaveLength(3);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("default");
    expect(variantProp.values).toContain("alert");
    expect(variantProp.values).toContain("error");
  });
});

describe("Banner Generator - Icon Mapping", () => {
  /**
   * Banner uses different icons per variant:
   * - default: ph-info
   * - alert: ph-warning
   * - error: ph-warning (same icon, different color)
   */

  it("should map default variant to ph-info icon", () => {
    const allData = getAllBannerVariantData();
    const defaultVariant = allData.variants.find(
      (v) => v.variant === "default",
    );

    expect(defaultVariant?.icon.iconId).toBe("ph-info");
    expect(defaultVariant?.icon.iconSize).toBe(16);
  });

  it("should map alert variant to ph-warning icon", () => {
    const allData = getAllBannerVariantData();
    const alertVariant = allData.variants.find((v) => v.variant === "alert");

    expect(alertVariant?.icon.iconId).toBe("ph-warning");
    expect(alertVariant?.icon.iconSize).toBe(16);
  });

  it("should map error variant to ph-warning icon", () => {
    const allData = getAllBannerVariantData();
    const errorVariant = allData.variants.find((v) => v.variant === "error");

    expect(errorVariant?.icon.iconId).toBe("ph-warning");
    expect(errorVariant?.icon.iconSize).toBe(16);
  });
});

describe("Banner Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in banner variants are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map all banner background colors with opacity", () => {
    const bgColors = ["bg-info/20", "bg-alert/20", "bg-error/20"];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.fillVariable).toBeDefined();
      expect(parsed.fillVariable).toContain("/20"); // Opacity modifier
    }
  });

  it("should map all banner text colors", () => {
    const textColors = ["text-info", "text-alert", "text-error"];

    for (const color of textColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.textVariable).toBeDefined();
    }
  });

  it("should map all banner border colors", () => {
    const borderColors = ["border-info", "border-alert", "border-error"];

    for (const color of borderColors) {
      const parsed = parseTailwindClasses(`border ${color}`);
      expect(parsed.strokeVariable).toBeDefined();
    }
  });
});

describe("Banner Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    banner.tsx → component-registry.json → banner.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Banner component styles changed in banner.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent variant config from registry", () => {
    const config = getBannerVariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent parsed base styles", () => {
    const baseStyles = getBannerParsedBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for default variant", () => {
    const variantData = getBannerParsedVariantStyles("default");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for alert variant", () => {
    const variantData = getBannerParsedVariantStyles("alert");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for error variant", () => {
    const variantData = getBannerParsedVariantStyles("error");
    expect(variantData).toMatchSnapshot();
  });

  it("should produce consistent complete banner variant data", () => {
    const allData = getAllBannerVariantData();
    expect(allData).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * banner.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllBannerVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.variants).toHaveLength(3);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
      expect(variant.layout).toBeDefined();
      expect(variant.icon).toBeDefined();
      expect(variant.icon.iconId).toBeDefined();
      expect(variant.icon.iconSize).toBe(16);
      expect(variant.text).toBeDefined();
      expect(variant.text.fontSize).toBe(16);
      expect(variant.text.fontWeight).toBe(400);
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
