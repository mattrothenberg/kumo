/**
 * Tests for clipboard-text.ts component generator (RED PHASE - TDD)
 *
 * These tests ensure the ClipboardText Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the clipboard-text
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * clipboard-text.tsx → component-registry.json → clipboard-text.ts (generator) → Figma
 *
 * NOTE: RED PHASE - These tests are written BEFORE the implementation.
 * The functions being tested (getAllVariantData, getBaseStyles, etc.) DO NOT EXIST YET.
 * This is expected and correct TDD practice. Tests will FAIL until implementation is complete.
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  getClipboardTextSizeConfig,
  getBaseStyles,
  getInputSizeClasses,
  getSizeConfig,
  getAllVariantData,
} from "./clipboard-text";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const clipboardTextComponent = registry.components.ClipboardText;
const clipboardTextProps = clipboardTextComponent.props;
const clipboardTextStyling = (clipboardTextComponent as any).styling;

const sizeProp = clipboardTextProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * ClipboardText size variants from registry
 */
const CLIPBOARD_TEXT_SIZES = ["sm", "base", "lg"] as const;

describe("ClipboardText Generator - Registry Validation", () => {
  it("should have all expected sizes in registry", () => {
    const expectedSizes = ["sm", "base", "lg"];
    expect(sizeProp.values).toEqual(expectedSizes);
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

  it("should have lg as default size", () => {
    expect(sizeProp.default).toBe("lg");
  });
});

describe("ClipboardText Generator - Styling Section Validation", () => {
  it("should have inputStyles.base defined", () => {
    expect(clipboardTextStyling.inputStyles.base).toBeDefined();
    expect(typeof clipboardTextStyling.inputStyles.base).toBe("string");
    expect(clipboardTextStyling.inputStyles.base.length).toBeGreaterThan(0);
  });

  it("should have inputStyles.sizes defined for all sizes", () => {
    for (const size of CLIPBOARD_TEXT_SIZES) {
      expect(clipboardTextStyling.inputStyles.sizes[size]).toBeDefined();
      expect(typeof clipboardTextStyling.inputStyles.sizes[size]).toBe(
        "string",
      );
      expect(
        clipboardTextStyling.inputStyles.sizes[size].length,
      ).toBeGreaterThan(0);
    }
  });

  it("should have sizeVariants defined for all sizes with correct properties", () => {
    for (const size of CLIPBOARD_TEXT_SIZES) {
      const variant = clipboardTextStyling.sizeVariants[size];
      expect(variant).toBeDefined();
      expect(variant.height).toBeDefined();
      expect(typeof variant.height).toBe("number");
      expect(variant.classes).toBeDefined();
      expect(typeof variant.classes).toBe("string");
      expect(variant.buttonSize).toBeDefined();
      expect(variant.dimensions).toBeDefined();
      expect(variant.dimensions.paddingX).toBeDefined();
      expect(variant.dimensions.gap).toBeDefined();
      expect(variant.dimensions.borderRadius).toBeDefined();
      expect(variant.dimensions.fontSize).toBeDefined();
    }
  });

  it("should have states defined with correct tokens", () => {
    expect(clipboardTextStyling.states.input).toEqual([
      "bg-secondary",
      "text-surface",
      "ring-border",
    ]);
    expect(clipboardTextStyling.states.text).toEqual([
      "bg-surface",
      "font-mono",
    ]);
    expect(clipboardTextStyling.states.button).toEqual(["border-color"]);
  });

  it("should have icons defined with correct properties", () => {
    expect(clipboardTextStyling.icons).toHaveLength(2);

    const clipboardIcon = clipboardTextStyling.icons.find(
      (i: { name: string }) => i.name === "ph-clipboard",
    );
    expect(clipboardIcon).toBeDefined();
    expect(clipboardIcon?.state).toBe("default");
    expect(clipboardIcon?.size).toBe(16);

    const checkIcon = clipboardTextStyling.icons.find(
      (i: { name: string }) => i.name === "ph-check",
    );
    expect(checkIcon).toBeDefined();
    expect(checkIcon?.state).toBe("copied");
    expect(checkIcon?.size).toBe(16);
  });
});

describe("ClipboardText Generator - Size Variants Parsing", () => {
  describe("sm size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.height).toBe(26);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.buttonSize).toBe("sm");
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.dimensions.paddingX).toBe(8);
      expect(variant.dimensions.gap).toBe(1);
      expect(variant.dimensions.borderRadius).toBe(6);
      expect(variant.dimensions.fontSize).toBe(12);
    });

    it("should parse inputStyles.sizes.sm correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.sm;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBe(26); // h-6.5
      expect(parsed.gap).toBe(4); // gap-1
      expect(parsed.borderRadius).toBe(6); // rounded-md
      expect(parsed.paddingX).toBe(8); // px-2
      expect(parsed.fontSize).toBe(12); // text-xs
    });
  });

  describe("base size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.height).toBe(36);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.buttonSize).toBe("base");
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.dimensions.paddingX).toBe(12);
      expect(variant.dimensions.gap).toBe(6);
      expect(variant.dimensions.borderRadius).toBe(8);
      expect(variant.dimensions.fontSize).toBe(14);
    });

    it("should parse inputStyles.sizes.base correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.base;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBe(36); // h-9
      expect(parsed.gap).toBe(6); // gap-1.5
      expect(parsed.borderRadius).toBe(8); // rounded-lg
      expect(parsed.paddingX).toBe(12); // px-3
      expect(parsed.fontSize).toBe(16); // text-base
    });
  });

  describe("lg size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.height).toBe(40);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.buttonSize).toBe("lg");
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.dimensions.paddingX).toBe(16);
      expect(variant.dimensions.gap).toBe(8);
      expect(variant.dimensions.borderRadius).toBe(8);
      expect(variant.dimensions.fontSize).toBe(14);
    });

    it("should parse inputStyles.sizes.lg correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.lg;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBe(40); // h-10
      expect(parsed.gap).toBe(8); // gap-2
      expect(parsed.borderRadius).toBe(8); // rounded-lg
      expect(parsed.paddingX).toBe(16); // px-4
      expect(parsed.fontSize).toBe(16); // text-base
    });
  });
});

describe("ClipboardText Generator - Testable Export Functions", () => {
  describe("getBaseStyles", () => {
    it("should return input base styles from registry", () => {
      const styles = getBaseStyles();
      expect(styles.input.raw).toBeDefined();
      expect(typeof styles.input.raw).toBe("string");
      expect(styles.input.raw.length).toBeGreaterThan(0);
      expect(styles.input.parsed).toBeDefined();
      expect(styles.input.parsed.fillVariable).toBeDefined();
      expect(styles.input.parsed.textVariable).toBeDefined();
    });

    it("should return clipboard text styles from registry", () => {
      const styles = getBaseStyles();
      expect(styles.text).toBeDefined();
      expect(Array.isArray(styles.text)).toBe(true);
      expect(styles.text.length).toBeGreaterThan(0);
    });
  });

  describe("getSizeConfig", () => {
    it("should return complete config for sm size", () => {
      const config = getSizeConfig("sm");
      expect(config.height).toBe(26);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBe("sm");
      expect(config.dimensions.paddingX).toBe(8);
      expect(config.dimensions.gap).toBe(1);
      expect(config.dimensions.borderRadius).toBe(6);
      expect(config.dimensions.fontSize).toBe(12);
    });

    it("should return complete config for base size", () => {
      const config = getSizeConfig("base");
      expect(config.height).toBe(36);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBe("base");
      expect(config.dimensions.paddingX).toBe(12);
      expect(config.dimensions.gap).toBe(6);
      expect(config.dimensions.borderRadius).toBe(8);
      expect(config.dimensions.fontSize).toBe(14);
    });

    it("should return complete config for lg size", () => {
      const config = getSizeConfig("lg");
      expect(config.height).toBe(40);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBe("lg");
      expect(config.dimensions.paddingX).toBe(16);
      expect(config.dimensions.gap).toBe(8);
      expect(config.dimensions.borderRadius).toBe(8);
      expect(config.dimensions.fontSize).toBe(14);
    });
  });

  describe("getInputSizeClasses", () => {
    it("should return parsed Tailwind classes for sm size", () => {
      const parsed = getInputSizeClasses("sm");
      expect(parsed.height).toBe(26);
      expect(parsed.gap).toBe(4);
      expect(parsed.borderRadius).toBe(6);
      expect(parsed.paddingX).toBe(8);
      expect(parsed.fontSize).toBe(12);
    });

    it("should return parsed Tailwind classes for base size", () => {
      const parsed = getInputSizeClasses("base");
      expect(parsed.height).toBe(36);
      expect(parsed.gap).toBe(6);
      expect(parsed.borderRadius).toBe(8);
      expect(parsed.paddingX).toBe(12);
      expect(parsed.fontSize).toBe(16);
    });

    it("should return parsed Tailwind classes for lg size", () => {
      const parsed = getInputSizeClasses("lg");
      expect(parsed.height).toBe(40);
      expect(parsed.gap).toBe(8);
      expect(parsed.borderRadius).toBe(8);
      expect(parsed.paddingX).toBe(16);
      expect(parsed.fontSize).toBe(16);
    });
  });

  describe("getClipboardTextSizeConfig", () => {
    it("should return size variants from registry", () => {
      const config = getClipboardTextSizeConfig();
      expect(config.values).toEqual(["sm", "base", "lg"]);
      expect(config.default).toBe("lg");
      expect(config.classes).toBeDefined();
      expect(config.descriptions).toBeDefined();
    });
  });
});

describe("ClipboardText Generator - Color Token Coverage", () => {
  it("should map all clipboard-text background colors", () => {
    const bgColors = ["bg-secondary", "bg-surface"];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.fillVariable !== undefined).toBe(true);
    }
  });

  it("should map all clipboard-text text colors", () => {
    const textColors = ["text-surface"];

    for (const color of textColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.textVariable !== undefined).toBe(true);
    }
  });

  it("should map all clipboard-text border/ring colors", () => {
    const ringColors = ["ring-border", "border-color"];

    for (const color of ringColors) {
      const parsed = parseTailwindClasses(`ring ${color}`);
      expect(parsed.strokeVariable !== undefined || parsed.hasBorder).toBe(
        true,
      );
    }
  });
});

describe("ClipboardText Generator - Expected Figma Output", () => {
  it("should produce correct input styles from base", () => {
    const baseStyles = clipboardTextStyling.inputStyles.base;
    const parsed = parseTailwindClasses(baseStyles);

    expect(parsed.fillVariable).toBe("color-secondary");
    expect(parsed.textVariable).toBe("text-color-surface");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBe("color-border");
  });

  it("should produce correct dimensions for sm size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.sm;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBe(26);
    expect(parsed.paddingX).toBe(8);
    expect(parsed.gap).toBe(4);
    expect(parsed.borderRadius).toBe(6);
    expect(parsed.fontSize).toBe(12);
  });

  it("should produce correct dimensions for base size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.base;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBe(36);
    expect(parsed.paddingX).toBe(12);
    expect(parsed.gap).toBe(6);
    expect(parsed.borderRadius).toBe(8);
    expect(parsed.fontSize).toBe(16);
  });

  it("should produce correct dimensions for lg size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.lg;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBe(40);
    expect(parsed.paddingX).toBe(16);
    expect(parsed.gap).toBe(8);
    expect(parsed.borderRadius).toBe(8);
    expect(parsed.fontSize).toBe(16);
  });
});

describe("ClipboardText Generator - Size Count", () => {
  it("should have exactly 3 sizes", () => {
    expect(sizeProp.values).toHaveLength(3);
  });

  it("should include all expected sizes", () => {
    expect(sizeProp.values).toContain("sm");
    expect(sizeProp.values).toContain("base");
    expect(sizeProp.values).toContain("lg");
  });
});

describe("ClipboardText Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, size configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    clipboard-text.tsx → component-registry.json → clipboard-text.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - ClipboardText component styles changed in clipboard-text.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent size config from registry", () => {
    const config = getClipboardTextSizeConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent base styles", () => {
    const baseStyles = getBaseStyles();
    expect(baseStyles).toMatchSnapshot();
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

  it("should produce consistent parsed input size classes for sm", () => {
    const parsed = getInputSizeClasses("sm");
    expect(parsed).toMatchSnapshot();
  });

  it("should produce consistent parsed input size classes for base", () => {
    const parsed = getInputSizeClasses("base");
    expect(parsed).toMatchSnapshot();
  });

  it("should produce consistent parsed input size classes for lg", () => {
    const parsed = getInputSizeClasses("lg");
    expect(parsed).toMatchSnapshot();
  });

  /**
   * COMPREHENSIVE DATA SNAPSHOT
   *
   * This test captures ALL parsed data for ClipboardText in one snapshot.
   * It's the most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all sizes (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.sizeConfig).toBeDefined();
    expect(allData.sizeConfig.values).toHaveLength(3);
    expect(allData.baseStyles).toBeDefined();
    expect(allData.sizes).toHaveLength(3);
    expect(allData.stylingConfig).toBeDefined();

    // Each size should have complete data
    for (const sizeData of allData.sizes) {
      expect(sizeData.size).toBeDefined();
      expect(sizeData.height).toBeDefined();
      expect(sizeData.buttonSize).toBeDefined();
      expect(sizeData.dimensions).toBeDefined();
      expect(sizeData.inputClasses).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
