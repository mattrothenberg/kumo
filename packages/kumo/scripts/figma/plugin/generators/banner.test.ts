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
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";

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
    expect(parsed.paddingX).toBe(FALLBACK_VALUES.padding.standard); // px-4 = 16px
  });

  it("should parse vertical padding from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.paddingY).toBe(6); // py-1.5 = 6px
  });

  it("should parse font size from base styles", () => {
    const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
    expect(parsed.fontSize).toBe(FONT_SIZE.base); // text-base
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

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
      expect(parsed.fillVariable).toContain("/20"); // Opacity modifier
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("alert variant", () => {
    const classes = variantProp.classes.alert;

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
      expect(parsed.fillVariable).toContain("/20"); // Opacity modifier
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should parse fill variable with opacity", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
      expect(parsed.fillVariable).toContain("/20"); // Opacity modifier
    });

    it("should parse border variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });

    it("should parse text variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });
});

describe("Banner Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   * Structural tests ensure properties exist and have correct types.
   * Snapshots guard against unintended value drift.
   */

  it("should produce correct Figma properties for default banner", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.default);

    // Verify all required properties exist with correct types
    expect(baseStyles.gap).toBeDefined();
    expect(typeof baseStyles.gap).toBe("number");
    expect(baseStyles.paddingX).toBeDefined();
    expect(typeof baseStyles.paddingX).toBe("number");
    expect(baseStyles.paddingY).toBeDefined();
    expect(typeof baseStyles.paddingY).toBe("number");
    expect(baseStyles.borderRadius).toBeDefined();
    expect(typeof baseStyles.borderRadius).toBe("number");
    expect(baseStyles.fontSize).toBeDefined();
    expect(typeof baseStyles.fontSize).toBe("number");

    expect(variantStyles.fillVariable).toBeDefined();
    expect(typeof variantStyles.fillVariable).toBe("string");
    expect(variantStyles.strokeVariable).toBeDefined();
    expect(typeof variantStyles.strokeVariable).toBe("string");
    expect(variantStyles.textVariable).toBeDefined();
    expect(typeof variantStyles.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for alert banner (full chain)", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.alert);

    // Test full chain: registry → parser → expected Figma properties
    // Verify structure exists
    expect(baseStyles.borderRadius).toBeDefined();
    expect(typeof baseStyles.borderRadius).toBe("number");
    expect(baseStyles.paddingX).toBeDefined();
    expect(typeof baseStyles.paddingX).toBe("number");
    expect(baseStyles.paddingY).toBeDefined();
    expect(typeof baseStyles.paddingY).toBe("number");
    expect(baseStyles.gap).toBeDefined();
    expect(typeof baseStyles.gap).toBe("number");
    expect(baseStyles.fontSize).toBeDefined();
    expect(typeof baseStyles.fontSize).toBe("number");

    expect(variantStyles.fillVariable).toBeDefined();
    expect(typeof variantStyles.fillVariable).toBe("string");
    expect(variantStyles.fillVariable).toContain("/20"); // Opacity modifier
    expect(variantStyles.strokeVariable).toBeDefined();
    expect(typeof variantStyles.strokeVariable).toBe("string");
    expect(variantStyles.textVariable).toBeDefined();
    expect(typeof variantStyles.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for error banner (full chain)", () => {
    const baseStyles = parseTailwindClasses(BANNER_BASE_STYLES);
    const variantStyles = parseTailwindClasses(variantProp.classes.error);

    // Test full chain: registry → parser → expected Figma properties
    // Verify structure exists
    expect(baseStyles.borderRadius).toBeDefined();
    expect(typeof baseStyles.borderRadius).toBe("number");
    expect(baseStyles.paddingX).toBeDefined();
    expect(typeof baseStyles.paddingX).toBe("number");
    expect(baseStyles.paddingY).toBeDefined();
    expect(typeof baseStyles.paddingY).toBe("number");
    expect(baseStyles.gap).toBeDefined();
    expect(typeof baseStyles.gap).toBe("number");
    expect(baseStyles.fontSize).toBeDefined();
    expect(typeof baseStyles.fontSize).toBe("number");

    expect(variantStyles.fillVariable).toBeDefined();
    expect(typeof variantStyles.fillVariable).toBe("string");
    expect(variantStyles.fillVariable).toContain("/20"); // Opacity modifier
    expect(variantStyles.strokeVariable).toBeDefined();
    expect(typeof variantStyles.strokeVariable).toBe("string");
    expect(variantStyles.textVariable).toBeDefined();
    expect(typeof variantStyles.textVariable).toBe("string");
  });
});

describe("Banner Generator - Variant Count", () => {
  it("should have variants defined from registry", () => {
    expect(variantProp.values.length).toBeGreaterThan(0);
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
    expect(defaultVariant?.icon.iconSize).toBe(FONT_SIZE.lg); // 16px (slightly larger than text-base)
  });

  it("should map alert variant to ph-warning icon", () => {
    const allData = getAllBannerVariantData();
    const alertVariant = allData.variants.find((v) => v.variant === "alert");

    expect(alertVariant?.icon.iconId).toBe("ph-warning");
    expect(alertVariant?.icon.iconSize).toBe(FONT_SIZE.lg); // 16px (slightly larger than text-base)
  });

  it("should map error variant to ph-warning icon", () => {
    const allData = getAllBannerVariantData();
    const errorVariant = allData.variants.find((v) => v.variant === "error");

    expect(errorVariant?.icon.iconId).toBe("ph-warning");
    expect(errorVariant?.icon.iconSize).toBe(FONT_SIZE.lg); // 16px (slightly larger than text-base)
  });
});

describe("Banner Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in banner variants are
   * properly mapped in the tailwind-to-figma parser.
   * These tests ensure structural correctness without brittle exact values.
   */

  it("should map all banner background colors with opacity", () => {
    const bgColors = ["bg-info/20", "bg-alert/20", "bg-error/20"];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");
      expect(parsed.fillVariable).toContain("/20"); // Opacity modifier
    }
  });

  it("should map all banner text colors", () => {
    const textColors = ["text-info", "text-alert", "text-error"];

    for (const color of textColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    }
  });

  it("should map all banner border colors", () => {
    const borderColors = ["border-info", "border-alert", "border-error"];

    for (const color of borderColors) {
      const parsed = parseTailwindClasses(`border ${color}`);
      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
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
    expect(allData.variants.length).toBeGreaterThan(0);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
      expect(variant.layout).toBeDefined();
      expect(variant.icon).toBeDefined();
      expect(variant.icon.iconId).toBeDefined();
      expect(variant.icon.iconSize).toBe(FONT_SIZE.lg); // 16px (slightly larger than text-base)
      expect(variant.text).toBeDefined();
      expect(variant.text.fontSize).toBe(FONT_SIZE.base); // 14px (text-base from theme)
      expect(variant.text.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
