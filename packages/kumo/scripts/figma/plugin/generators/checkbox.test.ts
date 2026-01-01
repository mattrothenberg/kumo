/**
 * Tests for checkbox.ts component generator
 *
 * These tests ensure the Checkbox Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the checkbox
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * checkbox.tsx → component-registry.json → checkbox.ts (generator) → Figma
 *
 * NOTE: Unlike Button, Checkbox has a `styling` section in the registry that
 * provides Figma-specific metadata (dimensions, icons, state tokens).
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  CHECKBOX_VARIANTS_EXPORT,
  CHECKBOX_STATES_EXPORT,
  CHECKBOX_DISABLED_OPTIONS,
  getCheckboxVariantConfig,
  getCheckboxStylingConfig,
  getCheckboxBoxSize,
  getCheckboxIconSize,
  getCheckboxLabelGap,
  getCheckboxBorderRadius,
  getCheckboxBgVariable,
  getCheckboxRingVariable,
  getCheckboxIconName,
  getCheckboxBoxConfig,
  getCheckboxLayoutConfig,
  getCheckboxTextConfig,
  getCheckboxCompleteConfig,
  getAllCheckboxVariantData,
} from "./checkbox";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const checkboxComponent = registry.components.Checkbox;
const checkboxProps = checkboxComponent.props;
const checkboxStyling = checkboxComponent.styling;

const variantProp = checkboxProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  stateClasses?: Record<string, Record<string, string>>;
  default: string;
};

/**
 * Checkbox states
 */
const CHECKBOX_STATES = ["unchecked", "checked", "indeterminate"] as const;

describe("Checkbox Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    const expectedVariants = ["default", "error"];
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

describe("Checkbox Generator - Styling Section Validation", () => {
  it("should have dimensions defined", () => {
    expect(checkboxStyling.dimensions).toBe("h-4 w-4");
  });

  it("should have borderRadius defined", () => {
    expect(checkboxStyling.borderRadius).toBe("rounded-sm");
  });

  it("should have baseTokens defined", () => {
    expect(checkboxStyling.baseTokens).toEqual(["bg-surface", "ring-border"]);
  });

  it("should have states defined with correct tokens", () => {
    expect(checkboxStyling.states.checked).toEqual([
      "bg-surface-inverse",
      "text-surface-inverse",
    ]);
    expect(checkboxStyling.states.indeterminate).toEqual([
      "bg-surface-inverse",
      "text-surface-inverse",
    ]);
    expect(checkboxStyling.states.error).toEqual(["ring-error"]);
    expect(checkboxStyling.states.hover).toEqual(["ring-active"]);
    expect(checkboxStyling.states.focus).toEqual(["ring-active"]);
    expect(checkboxStyling.states.disabled).toEqual([
      "opacity-50",
      "cursor-not-allowed",
    ]);
  });

  it("should have icons defined with correct properties", () => {
    expect(checkboxStyling.icons).toHaveLength(2);

    const checkIcon = checkboxStyling.icons.find(
      (i: { name: string }) => i.name === "ph-check",
    );
    expect(checkIcon).toBeDefined();
    expect(checkIcon?.state).toBe("checked");
    expect(checkIcon?.size).toBe(12);

    const minusIcon = checkboxStyling.icons.find(
      (i: { name: string }) => i.name === "ph-minus",
    );
    expect(minusIcon).toBeDefined();
    expect(minusIcon?.state).toBe("indeterminate");
    expect(minusIcon?.size).toBe(12);
  });
});

describe("Checkbox Generator - Variant Styles Parsing", () => {
  describe("default variant", () => {
    const classes = variantProp.classes.default;

    it("should have correct classes", () => {
      expect(classes).toBe(
        "[&:focus-within>span]:ring-active [&:hover>span]:ring-active",
      );
    });

    it("should have state classes for focus and hover", () => {
      expect(variantProp.stateClasses?.default).toBeDefined();
      expect(variantProp.stateClasses?.default.focus).toBe(
        "[&:focus-within>span]:ring-active",
      );
      expect(variantProp.stateClasses?.default.hover).toBe(
        "[&:hover>span]:ring-active",
      );
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should have correct classes", () => {
      expect(classes).toBe("[&>span]:ring-error");
    });
  });
});

describe("Checkbox Generator - Testable Export Functions", () => {
  describe("getCheckboxVariantConfig", () => {
    it("should return variant configuration from registry", () => {
      const config = getCheckboxVariantConfig();
      expect(config.values).toEqual(["default", "error"]);
      expect(config.default).toBe("default");
      expect(config.classes).toBeDefined();
      expect(config.descriptions).toBeDefined();
    });
  });

  describe("getCheckboxStylingConfig", () => {
    it("should return styling configuration from registry", () => {
      const config = getCheckboxStylingConfig();
      expect(config.dimensions).toBe("h-4 w-4");
      expect(config.borderRadius).toBe("rounded-sm");
      expect(config.baseTokens).toEqual(["bg-surface", "ring-border"]);
      expect(config.icons).toHaveLength(2);
    });
  });

  describe("getCheckboxBoxSize", () => {
    it("should return 16px", () => {
      expect(getCheckboxBoxSize()).toBe(16);
    });
  });

  describe("getCheckboxIconSize", () => {
    it("should return 12px", () => {
      expect(getCheckboxIconSize()).toBe(12);
    });
  });

  describe("getCheckboxLabelGap", () => {
    it("should return 8px", () => {
      expect(getCheckboxLabelGap()).toBe(8);
    });
  });

  describe("getCheckboxBorderRadius", () => {
    it("should return 2px (rounded-sm)", () => {
      expect(getCheckboxBorderRadius()).toBe(2);
    });
  });

  describe("getCheckboxBgVariable", () => {
    it("should return color-surface for unchecked", () => {
      expect(getCheckboxBgVariable("unchecked")).toBe("color-surface");
    });

    it("should return color-surface-inverse for checked", () => {
      expect(getCheckboxBgVariable("checked")).toBe("color-surface-inverse");
    });

    it("should return color-surface-inverse for indeterminate", () => {
      expect(getCheckboxBgVariable("indeterminate")).toBe(
        "color-surface-inverse",
      );
    });
  });

  describe("getCheckboxRingVariable", () => {
    it("should return color-border for default variant", () => {
      expect(getCheckboxRingVariable("default")).toBe("color-border");
    });

    it("should return color-error for error variant", () => {
      expect(getCheckboxRingVariable("error")).toBe("color-error");
    });
  });

  describe("getCheckboxIconName", () => {
    it("should return null for unchecked", () => {
      expect(getCheckboxIconName("unchecked")).toBeNull();
    });

    it("should return ph-check for checked", () => {
      expect(getCheckboxIconName("checked")).toBe("ph-check");
    });

    it("should return ph-minus for indeterminate", () => {
      expect(getCheckboxIconName("indeterminate")).toBe("ph-minus");
    });
  });

  describe("getCheckboxLayoutConfig", () => {
    it("should return correct layout configuration", () => {
      const config = getCheckboxLayoutConfig();
      expect(config.layoutMode).toBe("HORIZONTAL");
      expect(config.primaryAxisAlignItems).toBe("MIN");
      expect(config.counterAxisAlignItems).toBe("CENTER");
      expect(config.itemSpacing).toBe(8);
    });
  });

  describe("getCheckboxTextConfig", () => {
    it("should return correct text configuration", () => {
      const config = getCheckboxTextConfig();
      expect(config.fontSize).toBe(16);
      expect(config.fontWeight).toBe(500);
      expect(config.textVariable).toBe("text-color-surface");
    });
  });
});

describe("Checkbox Generator - Box Configuration", () => {
  describe("unchecked state", () => {
    it("should have surface background", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.bgVariable).toBe("color-surface");
    });

    it("should have no icon", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.icon).toBeNull();
    });

    it("should have border ring", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.ringVariable).toBe("color-border");
    });
  });

  describe("checked state", () => {
    it("should have surface-inverse background", () => {
      const config = getCheckboxBoxConfig("checked", "default", false);
      expect(config.bgVariable).toBe("color-surface-inverse");
    });

    it("should have check icon", () => {
      const config = getCheckboxBoxConfig("checked", "default", false);
      expect(config.icon).toBe("ph-check");
      expect(config.iconSize).toBe(12);
      expect(config.iconColor).toBe("text-white");
    });
  });

  describe("indeterminate state", () => {
    it("should have surface-inverse background", () => {
      const config = getCheckboxBoxConfig("indeterminate", "default", false);
      expect(config.bgVariable).toBe("color-surface-inverse");
    });

    it("should have minus icon", () => {
      const config = getCheckboxBoxConfig("indeterminate", "default", false);
      expect(config.icon).toBe("ph-minus");
      expect(config.iconSize).toBe(12);
      expect(config.iconColor).toBe("text-white");
    });
  });

  describe("error variant", () => {
    it("should have error ring for all states", () => {
      for (const state of CHECKBOX_STATES) {
        const config = getCheckboxBoxConfig(state, "error", false);
        expect(config.ringVariable).toBe("color-error");
      }
    });
  });

  describe("disabled state", () => {
    it("should have 0.5 opacity when disabled", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", true);
      expect(config.opacity).toBe(0.5);
    });

    it("should have 1.0 opacity when not disabled", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.opacity).toBe(1.0);
    });
  });
});

describe("Checkbox Generator - Complete Configuration", () => {
  it("should produce correct layout for checkbox with label", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.layoutConfig).toEqual({
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "MIN",
      counterAxisAlignItems: "CENTER",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "AUTO",
      itemSpacing: 8,
    });
  });

  it("should produce correct text styling for label", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.textConfig).toEqual({
      fontSize: 16,
      fontWeight: 500,
      textVariable: "text-color-surface",
    });
  });

  it("should include styling config from registry", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.stylingConfig.dimensions).toBe("h-4 w-4");
    expect(config.stylingConfig.borderRadius).toBe("rounded-sm");
    expect(config.stylingConfig.icons).toHaveLength(2);
  });
});

describe("Checkbox Generator - Variant Count", () => {
  it("should have exactly 2 variants", () => {
    expect(variantProp.values).toHaveLength(2);
  });

  it("should include all expected variants", () => {
    expect(variantProp.values).toContain("default");
    expect(variantProp.values).toContain("error");
  });

  it("should have exactly 3 states", () => {
    expect(CHECKBOX_STATES).toHaveLength(3);
  });

  it("should include all expected states", () => {
    expect(CHECKBOX_STATES).toContain("unchecked");
    expect(CHECKBOX_STATES).toContain("checked");
    expect(CHECKBOX_STATES).toContain("indeterminate");
  });
});

describe("Checkbox Generator - Exports Validation", () => {
  it("should export checkbox variants matching registry", () => {
    expect(CHECKBOX_VARIANTS_EXPORT).toEqual(variantProp.values);
  });

  it("should export checkbox states", () => {
    expect(CHECKBOX_STATES_EXPORT).toEqual([
      "unchecked",
      "checked",
      "indeterminate",
    ]);
  });

  it("should export disabled options", () => {
    expect(CHECKBOX_DISABLED_OPTIONS).toEqual([false, true]);
  });
});

describe("Checkbox Generator - Color Token Coverage", () => {
  it("should map all checkbox background colors", () => {
    const bgColors = ["bg-surface", "bg-surface-inverse"];

    for (const color of bgColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.fillVariable !== undefined).toBe(true);
    }
  });

  it("should map all checkbox ring colors", () => {
    const ringColors = ["ring-border", "ring-error", "ring-active"];

    for (const color of ringColors) {
      const parsed = parseTailwindClasses(color);
      expect(parsed.strokeVariable !== undefined || parsed.hasBorder).toBe(
        true,
      );
    }
  });
});

describe("Checkbox Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * box configurations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    checkbox.tsx → component-registry.json → checkbox.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Checkbox component styles changed in checkbox.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent variant config from registry", () => {
    const config = getCheckboxVariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent styling config from registry", () => {
    const config = getCheckboxStylingConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * BOX CONFIGURATION SNAPSHOTS
   *
   * These capture the checkbox box configuration for all state/variant/disabled
   * combinations.
   */

  it("should produce consistent box config for unchecked/default/enabled", () => {
    const config = getCheckboxBoxConfig("unchecked", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for checked/default/enabled", () => {
    const config = getCheckboxBoxConfig("checked", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for indeterminate/default/enabled", () => {
    const config = getCheckboxBoxConfig("indeterminate", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for unchecked/default/disabled", () => {
    const config = getCheckboxBoxConfig("unchecked", "default", true);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for checked/default/disabled", () => {
    const config = getCheckboxBoxConfig("checked", "default", true);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for indeterminate/default/disabled", () => {
    const config = getCheckboxBoxConfig("indeterminate", "default", true);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for unchecked/error/enabled", () => {
    const config = getCheckboxBoxConfig("unchecked", "error", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for checked/error/enabled", () => {
    const config = getCheckboxBoxConfig("checked", "error", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for indeterminate/error/enabled", () => {
    const config = getCheckboxBoxConfig("indeterminate", "error", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for unchecked/error/disabled", () => {
    const config = getCheckboxBoxConfig("unchecked", "error", true);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for checked/error/disabled", () => {
    const config = getCheckboxBoxConfig("checked", "error", true);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent box config for indeterminate/error/disabled", () => {
    const config = getCheckboxBoxConfig("indeterminate", "error", true);
    expect(config).toMatchSnapshot();
  });

  /**
   * COMPLETE CONFIGURATION SNAPSHOTS
   *
   * These capture the complete configuration for key checkbox combinations.
   */

  it("should produce consistent complete config for unchecked/default/enabled", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for checked/default/enabled", () => {
    const config = getCheckboxCompleteConfig("checked", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for indeterminate/default/enabled", () => {
    const config = getCheckboxCompleteConfig("indeterminate", "default", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for unchecked/error/enabled", () => {
    const config = getCheckboxCompleteConfig("unchecked", "error", false);
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for checked/error/disabled", () => {
    const config = getCheckboxCompleteConfig("checked", "error", true);
    expect(config).toMatchSnapshot();
  });

  /**
   * COMPREHENSIVE DATA SNAPSHOT
   *
   * This test captures ALL parsed data for checkboxes in one snapshot.
   * It's the most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllCheckboxVariantData();

    // Verify structure exists
    expect(allData.variantConfig).toBeDefined();
    expect(allData.variantConfig.values).toHaveLength(2);
    expect(allData.states).toHaveLength(3);
    expect(allData.stylingConfig).toBeDefined();
    expect(allData.boxConfigs).toHaveLength(12); // 3 states × 2 variants × 2 disabled options
    expect(allData.constants).toBeDefined();

    // Each box config should have complete data
    for (const boxConfig of allData.boxConfigs) {
      expect(boxConfig.state).toBeDefined();
      expect(boxConfig.variant).toBeDefined();
      expect(boxConfig.disabled).toBeDefined();
      expect(boxConfig.bgVariable).toBeDefined();
      expect(boxConfig.ringVariable).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
