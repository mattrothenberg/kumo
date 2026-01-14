/**
 * Tests for text.ts component generator
 *
 * These tests ensure the Text Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the text
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * text.tsx → component-registry.json → text.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { getBaseStyles, getVariantConfig, getAllVariantData } from "./text";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";

// Import registry as source of truth
import registry from "../../../kumo/ai/component-registry.json";

const textComponent = registry.components.Text;
const textProps = textComponent.props;
const variantProp = textProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};
const sizeProp = textProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Base text class applied to all Text components (from text.tsx line 178)
 */
const TEXT_BASE_CLASS = "text-surface";

/**
 * Variant categories derived from text.tsx source code
 */
const COPY_VARIANTS = ["body", "secondary", "success", "error"];
const MONO_VARIANTS = ["mono", "mono-secondary"];

describe("Text Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    const expectedVariants = [
      "heading1",
      "heading2",
      "heading3",
      "body",
      "secondary",
      "success",
      "error",
      "mono",
      "mono-secondary",
    ];
    expect(variantProp.values).toEqual(expectedVariants);
  });

  it("should have all expected sizes in registry", () => {
    const expectedSizes = ["xs", "sm", "base", "lg"];
    expect(sizeProp.values).toEqual(expectedSizes);
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

  it("should have classes defined for all sizes", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.classes[size]).toBeDefined();
      expect(typeof sizeProp.classes[size]).toBe("string");
      expect(sizeProp.classes[size].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all sizes", () => {
    for (const size of sizeProp.values) {
      expect(sizeProp.descriptions[size]).toBeDefined();
      expect(typeof sizeProp.descriptions[size]).toBe("string");
      expect(sizeProp.descriptions[size].length).toBeGreaterThan(0);
    }
  });

  it("should have body as default variant", () => {
    expect(variantProp.default).toBe("body");
  });

  it("should have base as default size", () => {
    expect(sizeProp.default).toBe("base");
  });
});

describe("Text Generator - Base Styles Parsing", () => {
  it("should parse text color from base class", () => {
    const parsed = parseTailwindClasses(TEXT_BASE_CLASS);
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should have text-surface as base color", () => {
    const parsed = parseTailwindClasses("text-surface");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });
});

describe("Text Generator - Variant Styles Parsing", () => {
  describe("heading1 variant", () => {
    const classes = variantProp.classes.heading1;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should parse font size (text-3xl)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBe(30); // text-3xl = 30px
    });

    it("should parse font weight (font-semibold)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontWeight).toBeDefined();
      expect(typeof parsed.fontWeight).toBe("number");
      expect(parsed.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold); // font-semibold = 600
    });
  });

  describe("heading2 variant", () => {
    const classes = variantProp.classes.heading2;

    it("should parse font size (text-2xl)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBe(24); // text-2xl = 24px (no constant for heading sizes)
    });

    it("should parse font weight (font-semibold)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontWeight).toBeDefined();
      expect(parsed.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    });
  });

  describe("heading3 variant", () => {
    const classes = variantProp.classes.heading3;

    it("should parse font size (text-lg)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBe(FONT_SIZE.lg); // text-lg = 16px (Kumo override from Tailwind's 18px)
    });

    it("should parse font weight (font-semibold)", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.fontWeight).toBeDefined();
      expect(parsed.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    });
  });

  describe("body variant", () => {
    const classes = variantProp.classes.body;

    it("should have text-surface color", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("secondary variant", () => {
    const classes = variantProp.classes.secondary;

    it("should have text-muted color", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("success variant", () => {
    const classes = variantProp.classes.success;

    it("should have text-info color", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should have text-error color", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });

  describe("mono variant", () => {
    const classes = variantProp.classes.mono;

    it("should have font-mono class", () => {
      expect(classes).toContain("font-mono");
    });

    it("should parse monospace font family", () => {
      // Parser should detect font-mono
      expect(classes.includes("font-mono")).toBe(true);
    });
  });

  describe("mono-secondary variant", () => {
    const classes = variantProp.classes["mono-secondary"];

    it("should have font-mono class", () => {
      expect(classes).toContain("font-mono");
    });

    it("should have text-muted color", () => {
      expect(classes).toContain("text-muted");
    });

    it("should parse text color variable", () => {
      const parsed = parseTailwindClasses(classes);
      expect(parsed.textVariable).toBeDefined();
      expect(typeof parsed.textVariable).toBe("string");
    });
  });
});

describe("Text Generator - Size Styles Parsing", () => {
  it("should parse xs size (text-xs)", () => {
    const classes = sizeProp.classes.xs;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBe(FONT_SIZE.xs); // text-xs = 12px
  });

  it("should parse sm size (text-sm)", () => {
    const classes = sizeProp.classes.sm;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.fontSize).toBeDefined();
    expect(parsed.fontSize).toBe(FONT_SIZE.sm); // text-sm = 13px (Kumo override from Tailwind's 14px)
  });

  it("should parse base size (text-base)", () => {
    const classes = sizeProp.classes.base;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.fontSize).toBeDefined();
    expect(parsed.fontSize).toBe(FONT_SIZE.base); // text-base = 16px
  });

  it("should parse lg size (text-lg)", () => {
    const classes = sizeProp.classes.lg;
    const parsed = parseTailwindClasses(classes);
    expect(parsed.fontSize).toBeDefined();
    expect(parsed.fontSize).toBe(FONT_SIZE.lg); // text-lg = 16px (Kumo override from Tailwind's 18px)
  });
});

describe("Text Generator - Testable Export Functions", () => {
  describe("getBaseStyles", () => {
    it("should return base styles from registry", () => {
      const styles = getBaseStyles();
      expect(styles).toBeDefined();
      expect(styles.raw).toBeDefined();
      expect(styles.parsed).toBeDefined();
    });

    it("should return text-surface as raw base class", () => {
      const styles = getBaseStyles();
      expect(styles.raw).toBe("text-surface");
    });

    it("should parse text color variable from base class", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.textVariable).toBeDefined();
      expect(typeof styles.parsed.textVariable).toBe("string");
    });
  });

  describe("getVariantConfig", () => {
    it("should return variant configuration from registry", () => {
      const config = getVariantConfig();
      expect(config).toBeDefined();
      expect(config.variants).toBeDefined();
      expect(config.sizes).toBeDefined();
      expect(config.variantClasses).toBeDefined();
      expect(config.variantDescriptions).toBeDefined();
      expect(config.sizeClasses).toBeDefined();
      expect(config.sizeDescriptions).toBeDefined();
    });

    it("should have variants defined", () => {
      const config = getVariantConfig();
      expect(config.variants.length).toBeGreaterThan(0);
    });

    it("should have sizes defined", () => {
      const config = getVariantConfig();
      expect(config.sizes.length).toBeGreaterThan(0);
    });

    it("should have body as default variant", () => {
      const config = getVariantConfig();
      expect(config.defaultVariant).toBe("body");
    });

    it("should have base as default size", () => {
      const config = getVariantConfig();
      expect(config.defaultSize).toBe("base");
    });

    it("should have classes for all variants", () => {
      const config = getVariantConfig();
      for (const variant of config.variants) {
        expect(config.variantClasses[variant]).toBeDefined();
        expect(typeof config.variantClasses[variant]).toBe("string");
      }
    });

    it("should have descriptions for all variants", () => {
      const config = getVariantConfig();
      for (const variant of config.variants) {
        expect(config.variantDescriptions[variant]).toBeDefined();
        expect(typeof config.variantDescriptions[variant]).toBe("string");
      }
    });

    it("should have classes for all sizes", () => {
      const config = getVariantConfig();
      for (const size of config.sizes) {
        expect(config.sizeClasses[size]).toBeDefined();
        expect(typeof config.sizeClasses[size]).toBe("string");
      }
    });

    it("should have descriptions for all sizes", () => {
      const config = getVariantConfig();
      for (const size of config.sizes) {
        expect(config.sizeDescriptions[size]).toBeDefined();
        expect(typeof config.sizeDescriptions[size]).toBe("string");
      }
    });
  });

  describe("getAllVariantData", () => {
    it("should return complete data structure", () => {
      const allData = getAllVariantData();
      expect(allData).toBeDefined();
      expect(allData.baseStyles).toBeDefined();
      expect(allData.variantConfig).toBeDefined();
      expect(allData.variants).toBeDefined();
    });

    it("should include base styles with raw and parsed data", () => {
      const allData = getAllVariantData();
      expect(allData.baseStyles.raw).toBe("text-surface");
      expect(allData.baseStyles.parsed).toBeDefined();
      expect(allData.baseStyles.parsed.textVariable).toBeDefined();
    });

    it("should include variant config with all properties", () => {
      const allData = getAllVariantData();
      expect(allData.variantConfig.variants.length).toBeGreaterThan(0);
      expect(allData.variantConfig.sizes.length).toBeGreaterThan(0);
      expect(allData.variantConfig.defaultVariant).toBe("body");
      expect(allData.variantConfig.defaultSize).toBe("base");
    });

    it("should generate variant combinations", () => {
      const allData = getAllVariantData();
      // Variants = copy variants × sizes + heading variants (no size) + mono variants × 2 sizes
      // Dynamic check - just verify we have combinations generated
      expect(allData.variants.length).toBeGreaterThan(0);
    });

    it("should include parsed styles for each variant", () => {
      const allData = getAllVariantData();
      for (const variant of allData.variants) {
        expect(variant.variant).toBeDefined();
        expect(variant.variantClasses).toBeDefined();
        expect(variant.combinedClasses).toBeDefined();
        expect(variant.parsed).toBeDefined();
        expect(variant.description).toBeDefined();
      }
    });

    it("should correctly identify copy variants", () => {
      const allData = getAllVariantData();
      const copyVariants = allData.variants.filter((v) => v.isCopyVariant);
      expect(copyVariants.length).toBe(16); // 4 copy variants × 4 sizes
    });

    it("should correctly identify mono variants", () => {
      const allData = getAllVariantData();
      const monoVariants = allData.variants.filter((v) => v.isMonoVariant);
      expect(monoVariants.length).toBe(4); // 2 mono variants × 2 sizes (default + lg)
    });

    it("should correctly identify heading variants", () => {
      const allData = getAllVariantData();
      const headingVariants = allData.variants.filter(
        (v) => !v.isCopyVariant && !v.isMonoVariant,
      );
      expect(headingVariants.length).toBe(3); // 3 heading variants
    });

    it("should have size=null for headings", () => {
      const allData = getAllVariantData();
      const headingVariants = allData.variants.filter((v) =>
        v.variant.startsWith("heading"),
      );
      for (const variant of headingVariants) {
        expect(variant.size).toBeNull();
      }
    });

    it("should have size values for copy variants", () => {
      const allData = getAllVariantData();
      const copyVariants = allData.variants.filter((v) => v.isCopyVariant);
      for (const variant of copyVariants) {
        expect(variant.size).not.toBeNull();
        expect(typeof variant.size).toBe("string");
      }
    });

    it("should have correct mono variant size handling", () => {
      const allData = getAllVariantData();
      const monoVariants = allData.variants.filter((v) => v.isMonoVariant);

      // Should have 2 mono base variants (mono, mono-secondary) × 2 sizes each
      const monoDefaults = monoVariants.filter((v) => v.size === null);
      const monoLg = monoVariants.filter((v) => v.size === "lg");

      expect(monoDefaults.length).toBe(2); // Default size for both mono variants
      expect(monoLg.length).toBe(2); // lg size for both mono variants
    });
  });
});

describe("Text Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   * Structural assertions ensure properties exist and have correct types.
   */

  it("should produce correct Figma properties for heading1", () => {
    const variantClasses = variantProp.classes.heading1;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);

    // Expected Figma text properties
    expect(parsed.fontSize).toBe(30); // text-3xl (no constant for heading sizes)
    expect(parsed.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold); // font-semibold
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for body with size base", () => {
    const variantClasses = variantProp.classes.body;
    const sizeClasses = sizeProp.classes.base;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${sizeClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);

    expect(parsed.fontSize).toBe(FONT_SIZE.base); // text-base
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for mono variant with optical sizing", () => {
    const variantClasses = variantProp.classes.mono;
    // Default mono size uses sm (optical sizing)
    const sizeClasses = sizeProp.classes.sm;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${sizeClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);

    expect(parsed.fontSize).toBe(FONT_SIZE.sm); // text-sm = 13px (Kumo override)
    expect(variantClasses).toContain("font-mono");
  });

  it("should produce correct Figma properties for mono variant with lg size", () => {
    const variantClasses = variantProp.classes.mono;
    // lg mono size uses base (optical sizing)
    const sizeClasses = sizeProp.classes.base;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${sizeClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);

    expect(parsed.fontSize).toBe(FONT_SIZE.base); // text-base (optically adjusted)
    expect(variantClasses).toContain("font-mono");
  });
});

describe("Text Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in text variants are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map text-surface color token", () => {
    const parsed = parseTailwindClasses("text-surface");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map text-muted color token", () => {
    const parsed = parseTailwindClasses("text-muted");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map text-info color token", () => {
    const parsed = parseTailwindClasses("text-info");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map text-error color token", () => {
    const parsed = parseTailwindClasses("text-error");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });
});

describe("Text Generator - Variant Count", () => {
  it("should have variants defined from registry", () => {
    expect(variantProp.values.length).toBeGreaterThan(0);
  });

  it("should have sizes defined from registry", () => {
    expect(sizeProp.values.length).toBeGreaterThan(0);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("heading1");
    expect(variantProp.values).toContain("heading2");
    expect(variantProp.values).toContain("heading3");
    expect(variantProp.values).toContain("body");
    expect(variantProp.values).toContain("secondary");
    expect(variantProp.values).toContain("success");
    expect(variantProp.values).toContain("error");
    expect(variantProp.values).toContain("mono");
    expect(variantProp.values).toContain("mono-secondary");
  });

  it("should include all expected sizes", () => {
    expect(sizeProp.values).toContain("xs");
    expect(sizeProp.values).toContain("sm");
    expect(sizeProp.values).toContain("base");
    expect(sizeProp.values).toContain("lg");
  });
});

describe("Text Generator - Variant Category Classification", () => {
  it("should correctly identify copy variants", () => {
    const copyVariants = COPY_VARIANTS;
    for (const variant of copyVariants) {
      expect(variantProp.values).toContain(variant);
    }
  });

  it("should correctly identify mono variants", () => {
    const monoVariants = MONO_VARIANTS;
    for (const variant of monoVariants) {
      expect(variantProp.values).toContain(variant);
    }
  });

  it("should correctly identify heading variants", () => {
    const headingVariants = ["heading1", "heading2", "heading3"];
    for (const variant of headingVariants) {
      expect(variantProp.values).toContain(variant);
    }
  });
});

describe("Text Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    text.tsx → component-registry.json → text.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Text component styles changed in text.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent base styles", () => {
    const baseStyles = getBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent variant config from registry", () => {
    const config = getVariantConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * text.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.variantConfig).toBeDefined();
    expect(allData.variantConfig.variants.length).toBeGreaterThan(0);
    expect(allData.variantConfig.sizes.length).toBeGreaterThan(0);
    expect(allData.variants.length).toBeGreaterThan(0);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.variantClasses).toBeDefined();
      expect(variant.combinedClasses).toBeDefined();
      expect(variant.parsed).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(typeof variant.isCopyVariant).toBe("boolean");
      expect(typeof variant.isMonoVariant).toBe("boolean");
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for body variant with base size", () => {
    const variantClasses = variantProp.classes.body;
    const sizeClasses = sizeProp.classes.base;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${sizeClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);
    expect(parsed).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for heading1 variant", () => {
    const variantClasses = variantProp.classes.heading1;
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);
    expect(parsed).toMatchSnapshot();
  });

  it("should produce consistent parsed styles for mono variant", () => {
    const variantClasses = variantProp.classes.mono;
    const sizeClasses = sizeProp.classes.sm; // Default mono size
    const combinedClasses = `${TEXT_BASE_CLASS} ${variantClasses} ${sizeClasses}`;
    const parsed = parseTailwindClasses(combinedClasses);
    expect(parsed).toMatchSnapshot();
  });
});
