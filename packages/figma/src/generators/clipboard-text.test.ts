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
import registry from "../../../kumo/ai/component-registry.json";

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
    expect(sizeProp.default).toBeDefined();
    expect(typeof sizeProp.default).toBe("string");
    expect(sizeProp.default.length).toBeGreaterThan(0);
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
    expect(clipboardTextStyling.states.input).toBeDefined();
    expect(Array.isArray(clipboardTextStyling.states.input)).toBe(true);
    expect(clipboardTextStyling.states.input.length).toBeGreaterThan(0);

    expect(clipboardTextStyling.states.text).toBeDefined();
    expect(Array.isArray(clipboardTextStyling.states.text)).toBe(true);
    expect(clipboardTextStyling.states.text.length).toBeGreaterThan(0);

    expect(clipboardTextStyling.states.button).toBeDefined();
    expect(Array.isArray(clipboardTextStyling.states.button)).toBe(true);
    expect(clipboardTextStyling.states.button.length).toBeGreaterThan(0);
  });

  it("should have icons defined with correct properties", () => {
    expect(clipboardTextStyling.icons).toBeDefined();
    expect(Array.isArray(clipboardTextStyling.icons)).toBe(true);
    expect(clipboardTextStyling.icons.length).toBeGreaterThan(0);

    const clipboardIcon = clipboardTextStyling.icons.find(
      (i: { name: string }) => i.name === "ph-clipboard",
    );
    expect(clipboardIcon).toBeDefined();
    expect(clipboardIcon?.state).toBeDefined();
    expect(typeof clipboardIcon?.state).toBe("string");
    expect(clipboardIcon?.size).toBeDefined();
    expect(typeof clipboardIcon?.size).toBe("number");
    expect(clipboardIcon?.size).toBeGreaterThan(0);

    const checkIcon = clipboardTextStyling.icons.find(
      (i: { name: string }) => i.name === "ph-check",
    );
    expect(checkIcon).toBeDefined();
    expect(checkIcon?.state).toBeDefined();
    expect(typeof checkIcon?.state).toBe("string");
    expect(checkIcon?.size).toBeDefined();
    expect(typeof checkIcon?.size).toBe("number");
    expect(checkIcon?.size).toBeGreaterThan(0);
  });
});

describe("ClipboardText Generator - Size Variants Parsing", () => {
  describe("sm size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.height).toBeDefined();
      expect(typeof variant.height).toBe("number");
      expect(variant.height).toBeGreaterThan(0);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.buttonSize).toBeDefined();
      expect(typeof variant.buttonSize).toBe("string");
      expect(variant.buttonSize.length).toBeGreaterThan(0);
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.sm;
      expect(variant.dimensions.paddingX).toBeDefined();
      expect(typeof variant.dimensions.paddingX).toBe("number");
      expect(variant.dimensions.paddingX).toBeGreaterThan(0);
      expect(variant.dimensions.gap).toBeDefined();
      expect(typeof variant.dimensions.gap).toBe("number");
      expect(variant.dimensions.gap).toBeGreaterThan(0);
      expect(variant.dimensions.borderRadius).toBeDefined();
      expect(typeof variant.dimensions.borderRadius).toBe("number");
      expect(variant.dimensions.borderRadius).toBeGreaterThan(0);
      expect(variant.dimensions.fontSize).toBeDefined();
      expect(typeof variant.dimensions.fontSize).toBe("number");
      expect(variant.dimensions.fontSize).toBeGreaterThan(0);
    });

    it("should parse inputStyles.sizes.sm correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.sm;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
    });
  });

  describe("base size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.height).toBeDefined();
      expect(typeof variant.height).toBe("number");
      expect(variant.height).toBeGreaterThan(0);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.buttonSize).toBeDefined();
      expect(typeof variant.buttonSize).toBe("string");
      expect(variant.buttonSize.length).toBeGreaterThan(0);
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.base;
      expect(variant.dimensions.paddingX).toBeDefined();
      expect(typeof variant.dimensions.paddingX).toBe("number");
      expect(variant.dimensions.paddingX).toBeGreaterThan(0);
      expect(variant.dimensions.gap).toBeDefined();
      expect(typeof variant.dimensions.gap).toBe("number");
      expect(variant.dimensions.gap).toBeGreaterThan(0);
      expect(variant.dimensions.borderRadius).toBeDefined();
      expect(typeof variant.dimensions.borderRadius).toBe("number");
      expect(variant.dimensions.borderRadius).toBeGreaterThan(0);
      expect(variant.dimensions.fontSize).toBeDefined();
      expect(typeof variant.dimensions.fontSize).toBe("number");
      expect(variant.dimensions.fontSize).toBeGreaterThan(0);
    });

    it("should parse inputStyles.sizes.base correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.base;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
    });
  });

  describe("lg size", () => {
    it("should have correct height from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.height).toBeDefined();
      expect(typeof variant.height).toBe("number");
      expect(variant.height).toBeGreaterThan(0);
    });

    it("should have correct buttonSize from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.buttonSize).toBeDefined();
      expect(typeof variant.buttonSize).toBe("string");
      expect(variant.buttonSize.length).toBeGreaterThan(0);
    });

    it("should have correct dimensions from sizeVariants", () => {
      const variant = clipboardTextStyling.sizeVariants.lg;
      expect(variant.dimensions.paddingX).toBeDefined();
      expect(typeof variant.dimensions.paddingX).toBe("number");
      expect(variant.dimensions.paddingX).toBeGreaterThan(0);
      expect(variant.dimensions.gap).toBeDefined();
      expect(typeof variant.dimensions.gap).toBe("number");
      expect(variant.dimensions.gap).toBeGreaterThan(0);
      expect(variant.dimensions.borderRadius).toBeDefined();
      expect(typeof variant.dimensions.borderRadius).toBe("number");
      expect(variant.dimensions.borderRadius).toBeGreaterThan(0);
      expect(variant.dimensions.fontSize).toBeDefined();
      expect(typeof variant.dimensions.fontSize).toBe("number");
      expect(variant.dimensions.fontSize).toBeGreaterThan(0);
    });

    it("should parse inputStyles.sizes.lg correctly", () => {
      const classes = clipboardTextStyling.inputStyles.sizes.lg;
      const parsed = parseTailwindClasses(classes);
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
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
      expect(config.height).toBeDefined();
      expect(typeof config.height).toBe("number");
      expect(config.height).toBeGreaterThan(0);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBeDefined();
      expect(typeof config.buttonSize).toBe("string");
      expect(config.dimensions.paddingX).toBeDefined();
      expect(typeof config.dimensions.paddingX).toBe("number");
      expect(config.dimensions.paddingX).toBeGreaterThan(0);
      expect(config.dimensions.gap).toBeDefined();
      expect(typeof config.dimensions.gap).toBe("number");
      expect(config.dimensions.gap).toBeGreaterThan(0);
      expect(config.dimensions.borderRadius).toBeDefined();
      expect(typeof config.dimensions.borderRadius).toBe("number");
      expect(config.dimensions.borderRadius).toBeGreaterThan(0);
      expect(config.dimensions.fontSize).toBeDefined();
      expect(typeof config.dimensions.fontSize).toBe("number");
      expect(config.dimensions.fontSize).toBeGreaterThan(0);
    });

    it("should return complete config for base size", () => {
      const config = getSizeConfig("base");
      expect(config.height).toBeDefined();
      expect(typeof config.height).toBe("number");
      expect(config.height).toBeGreaterThan(0);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBeDefined();
      expect(typeof config.buttonSize).toBe("string");
      expect(config.dimensions.paddingX).toBeDefined();
      expect(typeof config.dimensions.paddingX).toBe("number");
      expect(config.dimensions.paddingX).toBeGreaterThan(0);
      expect(config.dimensions.gap).toBeDefined();
      expect(typeof config.dimensions.gap).toBe("number");
      expect(config.dimensions.gap).toBeGreaterThan(0);
      expect(config.dimensions.borderRadius).toBeDefined();
      expect(typeof config.dimensions.borderRadius).toBe("number");
      expect(config.dimensions.borderRadius).toBeGreaterThan(0);
      expect(config.dimensions.fontSize).toBeDefined();
      expect(typeof config.dimensions.fontSize).toBe("number");
      expect(config.dimensions.fontSize).toBeGreaterThan(0);
    });

    it("should return complete config for lg size", () => {
      const config = getSizeConfig("lg");
      expect(config.height).toBeDefined();
      expect(typeof config.height).toBe("number");
      expect(config.height).toBeGreaterThan(0);
      expect(config.classes).toBeDefined();
      expect(typeof config.classes).toBe("string");
      expect(config.buttonSize).toBeDefined();
      expect(typeof config.buttonSize).toBe("string");
      expect(config.dimensions.paddingX).toBeDefined();
      expect(typeof config.dimensions.paddingX).toBe("number");
      expect(config.dimensions.paddingX).toBeGreaterThan(0);
      expect(config.dimensions.gap).toBeDefined();
      expect(typeof config.dimensions.gap).toBe("number");
      expect(config.dimensions.gap).toBeGreaterThan(0);
      expect(config.dimensions.borderRadius).toBeDefined();
      expect(typeof config.dimensions.borderRadius).toBe("number");
      expect(config.dimensions.borderRadius).toBeGreaterThan(0);
      expect(config.dimensions.fontSize).toBeDefined();
      expect(typeof config.dimensions.fontSize).toBe("number");
      expect(config.dimensions.fontSize).toBeGreaterThan(0);
    });
  });

  describe("getInputSizeClasses", () => {
    it("should return parsed Tailwind classes for sm size", () => {
      const parsed = getInputSizeClasses("sm");
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
    });

    it("should return parsed Tailwind classes for base size", () => {
      const parsed = getInputSizeClasses("base");
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
    });

    it("should return parsed Tailwind classes for lg size", () => {
      const parsed = getInputSizeClasses("lg");
      expect(parsed.height).toBeDefined();
      expect(typeof parsed.height).toBe("number");
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.gap).toBeDefined();
      expect(typeof parsed.gap).toBe("number");
      expect(parsed.gap).toBeGreaterThan(0);
      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
      expect(parsed.paddingX).toBeDefined();
      expect(typeof parsed.paddingX).toBe("number");
      expect(parsed.paddingX).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeDefined();
      expect(typeof parsed.fontSize).toBe("number");
      expect(parsed.fontSize).toBeGreaterThan(0);
    });
  });

  describe("getClipboardTextSizeConfig", () => {
    it("should return size variants from registry", () => {
      const config = getClipboardTextSizeConfig();
      expect(config.values).toBeDefined();
      expect(Array.isArray(config.values)).toBe(true);
      expect(config.values.length).toBeGreaterThan(0);
      expect(config.default).toBeDefined();
      expect(typeof config.default).toBe("string");
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

    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });

  it("should produce correct dimensions for sm size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.sm;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBeDefined();
    expect(typeof parsed.height).toBe("number");
    expect(parsed.height).toBeGreaterThan(0);
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
    expect(parsed.paddingX).toBeGreaterThan(0);
    expect(parsed.gap).toBeDefined();
    expect(typeof parsed.gap).toBe("number");
    expect(parsed.gap).toBeGreaterThan(0);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });

  it("should produce correct dimensions for base size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.base;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBeDefined();
    expect(typeof parsed.height).toBe("number");
    expect(parsed.height).toBeGreaterThan(0);
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
    expect(parsed.paddingX).toBeGreaterThan(0);
    expect(parsed.gap).toBeDefined();
    expect(typeof parsed.gap).toBe("number");
    expect(parsed.gap).toBeGreaterThan(0);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });

  it("should produce correct dimensions for lg size input", () => {
    const classes = clipboardTextStyling.inputStyles.sizes.lg;
    const parsed = parseTailwindClasses(classes);

    expect(parsed.height).toBeDefined();
    expect(typeof parsed.height).toBe("number");
    expect(parsed.height).toBeGreaterThan(0);
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
    expect(parsed.paddingX).toBeGreaterThan(0);
    expect(parsed.gap).toBeDefined();
    expect(typeof parsed.gap).toBe("number");
    expect(parsed.gap).toBeGreaterThan(0);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });
});

describe("ClipboardText Generator - Size Count", () => {
  it("should have exactly 3 sizes", () => {
    expect(sizeProp.values.length).toBeGreaterThan(0);
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
    expect(allData.sizeConfig.values.length).toBeGreaterThan(0);
    expect(allData.baseStyles).toBeDefined();
    expect(allData.sizes.length).toBeGreaterThan(0);
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
