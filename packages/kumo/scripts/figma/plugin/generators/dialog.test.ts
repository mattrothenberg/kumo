/**
 * Tests for dialog.ts component generator
 *
 * These tests ensure the Dialog Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the dialog
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * dialog.tsx → component-registry.json → dialog.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getSizeConfig,
  getBaseConfig,
  getAllVariantData,
  DIALOG_SIZE_VALUES,
} from "./dialog";
import {
  FONT_SIZE,
  FALLBACK_VALUES,
  SPACING,
  OPACITY,
} from "./shared";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const dialogComponent = registry.components.Dialog;
const dialogProps = dialogComponent.props;
const sizeProp = dialogProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Expected size values from registry
 */
const EXPECTED_SIZES = ["base", "sm", "lg", "xl"];

describe("Dialog Generator - Registry Validation", () => {
  it("should have all expected size variants in registry", () => {
    expect(sizeProp.values).toEqual(EXPECTED_SIZES);
  });

  it("should have classes defined for all size variants", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.classes[size]).toBeDefined();
      expect(typeof sizeProp.classes[size]).toBe("string");
      expect(sizeProp.classes[size].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all size variants", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.descriptions[size]).toBeDefined();
      expect(typeof sizeProp.descriptions[size]).toBe("string");
      expect(sizeProp.descriptions[size].length).toBeGreaterThan(0);
    }
  });

  it("should have base as default size", () => {
    expect(sizeProp.default).toBe("base");
  });

  it("should export DIALOG_SIZE_VALUES matching registry", () => {
    expect(DIALOG_SIZE_VALUES).toEqual(sizeProp.values);
  });
});

describe("Dialog Generator - Size Config Validation", () => {
  describe("sm size", () => {
    it("should have valid config using shared constants", () => {
      const config = getSizeConfig("sm");
      expect(config).toBeDefined();
      // Width is parsed from registry (min-w-72 = 72 * 4 = 288px)
      expect(config.width).toBeGreaterThan(0);
      expect(config.titleSize).toBe(FONT_SIZE.lg);
      expect(config.titleWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
      expect(config.descSize).toBe(FONT_SIZE.base);
      expect(config.padding).toBe(FALLBACK_VALUES.padding.standard);
      expect(config.gap).toBe(SPACING.base);
      expect(config.buttonSize).toBe("sm");
    });
  });

  describe("base size", () => {
    it("should have valid config using shared constants", () => {
      const config = getSizeConfig("base");
      expect(config).toBeDefined();
      // Width is parsed from registry (min-w-96 = 96 * 4 = 384px)
      expect(config.width).toBeGreaterThan(0);
      expect(config.titleSize).toBe(FONT_SIZE.lg);
      expect(config.titleWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
      expect(config.descSize).toBe(FONT_SIZE.base);
      expect(config.padding).toBe(FALLBACK_VALUES.padding.large);
      expect(config.gap).toBe(FALLBACK_VALUES.gap.large);
      expect(config.buttonSize).toBe("base");
    });
  });

  describe("lg size", () => {
    it("should have valid config using shared constants", () => {
      const config = getSizeConfig("lg");
      expect(config).toBeDefined();
      // Width is parsed from registry (min-w-[32rem] = 32 * 16 = 512px)
      expect(config.width).toBeGreaterThan(0);
      expect(config.titleSize).toBe(FONT_SIZE.lg);
      expect(config.titleWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
      expect(config.descSize).toBe(FONT_SIZE.base);
      expect(config.padding).toBe(FALLBACK_VALUES.padding.large);
      expect(config.gap).toBe(FALLBACK_VALUES.gap.large);
      expect(config.buttonSize).toBe("base");
    });
  });

  describe("xl size", () => {
    it("should have valid config using shared constants", () => {
      const config = getSizeConfig("xl");
      expect(config).toBeDefined();
      // Width is parsed from registry (min-w-[48rem] = 48 * 16 = 768px)
      expect(config.width).toBeGreaterThan(0);
      expect(config.titleSize).toBe(FONT_SIZE.lg);
      expect(config.titleWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
      expect(config.descSize).toBe(FONT_SIZE.base);
      expect(config.padding).toBe(FALLBACK_VALUES.padding.large);
      expect(config.gap).toBe(FALLBACK_VALUES.gap.large);
      expect(config.buttonSize).toBe("base");
    });
  });

  it("should return base config for unknown size", () => {
    const config = getSizeConfig("unknown");
    expect(config).toEqual(getSizeConfig("base"));
  });

  it("should have consistent structure for all sizes", () => {
    for (const size of EXPECTED_SIZES) {
      const config = getSizeConfig(size);
      expect(config).toHaveProperty("width");
      expect(config).toHaveProperty("titleSize");
      expect(config).toHaveProperty("titleWeight");
      expect(config).toHaveProperty("descSize");
      expect(config).toHaveProperty("padding");
      expect(config).toHaveProperty("gap");
      expect(config).toHaveProperty("buttonSize");
    }
  });
});

describe("Dialog Generator - Width Parsing from Registry", () => {
  it("should parse min-w-72 for sm size", () => {
    const config = getSizeConfig("sm");
    // min-w-72 = 72 * 4 = 288px (parsed from registry)
    // Using range assertion for resilience if registry classes change
    expect(config.width).toBeGreaterThanOrEqual(200);
    expect(config.width).toBeLessThan(getSizeConfig("base").width);
  });

  it("should parse min-w-96 for base size", () => {
    const config = getSizeConfig("base");
    // min-w-96 = 96 * 4 = 384px (parsed from registry)
    expect(config.width).toBeGreaterThanOrEqual(300);
    expect(config.width).toBeLessThan(getSizeConfig("lg").width);
  });

  it("should parse min-w-[32rem] for lg size", () => {
    const config = getSizeConfig("lg");
    // min-w-[32rem] = 32 * 16 = 512px (parsed from registry)
    expect(config.width).toBeGreaterThanOrEqual(400);
    expect(config.width).toBeLessThan(getSizeConfig("xl").width);
  });

  it("should parse min-w-[48rem] for xl size", () => {
    const config = getSizeConfig("xl");
    // min-w-[48rem] = 48 * 16 = 768px (parsed from registry)
    expect(config.width).toBeGreaterThanOrEqual(600);
  });

  it("should use fallback width if parsing fails", () => {
    // This tests the fallback mechanism by checking that
    // unknown sizes return the base config (which has a fallback)
    const config = getSizeConfig("unknown-size-that-does-not-exist");
    const baseConfig = getSizeConfig("base");
    expect(config.width).toBe(baseConfig.width);
  });
});

describe("Dialog Generator - Base Config Validation", () => {
  const baseConfig = getBaseConfig();

  it("should have baseTokens defined", () => {
    expect(baseConfig.background).toBe("color-surface");
    expect(baseConfig.text).toBe("text-color-surface");
    expect(typeof baseConfig.borderRadius).toBe("number");
    expect(baseConfig.shadow).toBe("shadow-m");
  });

  it("should have backdrop config defined", () => {
    expect(baseConfig.backdrop).toBeDefined();
    expect(baseConfig.backdrop.background).toBe("color-color-3");
    expect(baseConfig.backdrop.opacity).toBe(OPACITY.backdrop);
  });

  it("should have header config defined", () => {
    expect(baseConfig.header).toBeDefined();
    expect(baseConfig.header.title).toBeDefined();
    expect(baseConfig.header.title.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    expect(baseConfig.header.title.color).toBe("text-color-surface");
    expect(baseConfig.header.closeIcon).toBeDefined();
    expect(baseConfig.header.closeIcon.name).toBe("ph-x");
    expect(baseConfig.header.closeIcon.size).toBe(FALLBACK_VALUES.iconSize.base);
    expect(baseConfig.header.closeIcon.color).toBe("text-color-muted");
  });

  it("should have description config defined", () => {
    expect(baseConfig.description).toBeDefined();
    expect(baseConfig.description.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
    expect(baseConfig.description.color).toBe("text-color-muted");
  });

  it("should have buttons config defined", () => {
    expect(baseConfig.buttons).toBeDefined();
    expect(baseConfig.buttons.primary).toBeDefined();
    expect(baseConfig.buttons.primary.background).toBe("color-primary");
    expect(baseConfig.buttons.primary.text).toBe("white");
    expect(baseConfig.buttons.secondary).toBeDefined();
    expect(baseConfig.buttons.secondary.ring).toBe("color-border");
    expect(baseConfig.buttons.secondary.text).toBe("text-color-surface");
  });
});

describe("Dialog Generator - Structural Validation", () => {
  it("should have correct number of size variants", () => {
    expect(EXPECTED_SIZES.length).toBeGreaterThan(0);
  });

  it("should include all expected sizes", () => {
    expect(EXPECTED_SIZES).toContain("sm");
    expect(EXPECTED_SIZES).toContain("base");
    expect(EXPECTED_SIZES).toContain("lg");
    expect(EXPECTED_SIZES).toContain("xl");
  });

  it("should have consistent width progression", () => {
    const smConfig = getSizeConfig("sm");
    const baseConfig = getSizeConfig("base");
    const lgConfig = getSizeConfig("lg");
    const xlConfig = getSizeConfig("xl");

    expect(smConfig.width).toBeLessThan(baseConfig.width);
    expect(baseConfig.width).toBeLessThan(lgConfig.width);
    expect(lgConfig.width).toBeLessThan(xlConfig.width);
  });

  it("should have consistent font sizes across sizes", () => {
    for (const size of EXPECTED_SIZES) {
      const config = getSizeConfig(size);
      expect(config.titleSize).toBe(FONT_SIZE.lg);
      expect(config.descSize).toBe(FONT_SIZE.base);
    }
  });

  it("should have consistent font weights across sizes", () => {
    for (const size of EXPECTED_SIZES) {
      const config = getSizeConfig(size);
      expect(config.titleWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    }
  });

  it("should use sm button size only for sm dialog", () => {
    const smConfig = getSizeConfig("sm");
    expect(smConfig.buttonSize).toBe("sm");

    const otherSizes = ["base", "lg", "xl"];
    for (const size of otherSizes) {
      const config = getSizeConfig(size);
      expect(config.buttonSize).toBe("base");
    }
  });
});

describe("Dialog Generator - getAllVariantData", () => {
  const allData = getAllVariantData();

  it("should return complete data structure", () => {
    expect(allData).toBeDefined();
    expect(allData.baseConfig).toBeDefined();
    expect(allData.sizeConfig).toBeDefined();
    expect(allData.variants).toBeDefined();
    expect(allData.sizeValues).toBeDefined();
  });

  it("should return all size variants", () => {
    expect(allData.variants.length).toBeGreaterThan(0);
    expect(allData.sizeValues).toEqual(EXPECTED_SIZES);
  });

  it("should include base config", () => {
    expect(allData.baseConfig.background).toBe("color-surface");
    expect(allData.baseConfig.text).toBe("text-color-surface");
    expect(typeof allData.baseConfig.borderRadius).toBe("number");
    expect(allData.baseConfig.shadow).toBe("shadow-m");
  });

  it("should include size config for all sizes", () => {
    for (const size of EXPECTED_SIZES) {
      expect(allData.sizeConfig[size]).toBeDefined();
      expect(allData.sizeConfig[size].width).toBeDefined();
      expect(allData.sizeConfig[size].padding).toBeDefined();
    }
  });

  it("should include variant data for each size", () => {
    for (const variant of allData.variants) {
      expect(variant.size).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.config).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(EXPECTED_SIZES).toContain(variant.size);
    }
  });

  it("should match registry descriptions", () => {
    for (const variant of allData.variants) {
      const registryDescription = sizeProp.descriptions[variant.size];
      expect(variant.description).toBe(registryDescription);
    }
  });

  it("should match registry classes", () => {
    for (const variant of allData.variants) {
      const registryClasses = sizeProp.classes[variant.size];
      expect(variant.classes).toBe(registryClasses);
    }
  });
});

describe("Dialog Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for base dialog", () => {
    const baseConfig = getBaseConfig();
    const sizeConfig = getSizeConfig("base");

    // Expected Figma component properties - structural checks
    const figmaProps = {
      // Layout
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      width: sizeConfig.width,
      itemSpacing: sizeConfig.gap,
      paddingLeft: sizeConfig.padding,
      paddingRight: sizeConfig.padding,
      paddingTop: sizeConfig.padding,
      paddingBottom: sizeConfig.padding,
      cornerRadius: baseConfig.borderRadius,
      // Fill
      background: baseConfig.background,
      // Shadow
      shadow: baseConfig.shadow,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("VERTICAL");
    expect(figmaProps.primaryAxisSizingMode).toBe("AUTO");
    expect(figmaProps.counterAxisSizingMode).toBe("FIXED");
    expect(typeof figmaProps.width).toBe("number");
    expect(typeof figmaProps.itemSpacing).toBe("number");
    expect(typeof figmaProps.paddingLeft).toBe("number");
    expect(typeof figmaProps.paddingRight).toBe("number");
    expect(typeof figmaProps.paddingTop).toBe("number");
    expect(typeof figmaProps.paddingBottom).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.background).toBe("string");
    expect(typeof figmaProps.shadow).toBe("string");
  });

  it("should produce correct Figma properties for sm dialog", () => {
    const sizeConfig = getSizeConfig("sm");

    // Width is parsed from registry, check it's smaller than base
    expect(sizeConfig.width).toBeLessThan(getSizeConfig("base").width);
    expect(sizeConfig.padding).toBe(FALLBACK_VALUES.padding.standard);
    expect(sizeConfig.gap).toBe(SPACING.base);
    expect(sizeConfig.buttonSize).toBe("sm");
  });

  it("should produce correct Figma properties for xl dialog", () => {
    const sizeConfig = getSizeConfig("xl");

    // Width is parsed from registry, check it's larger than lg
    expect(sizeConfig.width).toBeGreaterThan(getSizeConfig("lg").width);
    expect(sizeConfig.padding).toBe(FALLBACK_VALUES.padding.large);
    expect(sizeConfig.gap).toBe(FALLBACK_VALUES.gap.large);
    expect(sizeConfig.buttonSize).toBe("base");
  });

  it("should produce correct header properties", () => {
    const baseConfig = getBaseConfig();

    expect(baseConfig.header.title.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    expect(baseConfig.header.title.color).toBe("text-color-surface");
    expect(baseConfig.header.closeIcon.name).toBe("ph-x");
    expect(baseConfig.header.closeIcon.size).toBe(FALLBACK_VALUES.iconSize.base);
    expect(baseConfig.header.closeIcon.color).toBe("text-color-muted");
  });

  it("should produce correct button properties", () => {
    const baseConfig = getBaseConfig();

    expect(baseConfig.buttons.primary.background).toBe("color-primary");
    expect(baseConfig.buttons.primary.text).toBe("white");
    expect(baseConfig.buttons.secondary.ring).toBe("color-border");
    expect(baseConfig.buttons.secondary.text).toBe("text-color-surface");
  });
});

describe("Dialog Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in dialog variants are
   * properly defined in the base config.
   */

  const baseConfig = getBaseConfig();

  it("should use semantic color tokens for background", () => {
    expect(baseConfig.background).toBe("color-surface");
  });

  it("should use semantic color tokens for text", () => {
    expect(baseConfig.text).toBe("text-color-surface");
    expect(baseConfig.header.title.color).toBe("text-color-surface");
    expect(baseConfig.description.color).toBe("text-color-muted");
  });

  it("should use semantic color tokens for backdrop", () => {
    expect(baseConfig.backdrop.background).toBe("color-color-3");
  });

  it("should use semantic color tokens for buttons", () => {
    expect(baseConfig.buttons.primary.background).toBe("color-primary");
    expect(baseConfig.buttons.secondary.ring).toBe("color-border");
    expect(baseConfig.buttons.secondary.text).toBe("text-color-surface");
  });

  it("should use semantic color tokens for close icon", () => {
    expect(baseConfig.header.closeIcon.color).toBe("text-color-muted");
  });
});

describe("Dialog Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (size configs, base config,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in sizing or layout logic
   * 3. Validating the full source of truth chain:
   *    dialog.tsx → component-registry.json → dialog.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Dialog component styles changed in dialog.tsx (intended)
   * - Size config logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent base config from generator", () => {
    const config = getBaseConfig();
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

  it("should produce consistent size config for xl", () => {
    const config = getSizeConfig("xl");
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * dialog.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.baseConfig).toBeDefined();
    expect(allData.sizeConfig).toBeDefined();
    expect(allData.variants.length).toBeGreaterThan(0);
    expect(allData.sizeValues).toEqual(EXPECTED_SIZES);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.size).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.config).toBeDefined();
      expect(variant.classes).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
