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
    expect(checkboxStyling.dimensions).toBeDefined();
    expect(typeof checkboxStyling.dimensions).toBe("string");
    expect(checkboxStyling.dimensions.length).toBeGreaterThan(0);
  });

  it("should have borderRadius defined", () => {
    expect(checkboxStyling.borderRadius).toBeDefined();
    expect(typeof checkboxStyling.borderRadius).toBe("string");
    expect(checkboxStyling.borderRadius.length).toBeGreaterThan(0);
  });

  it("should have baseTokens defined", () => {
    expect(checkboxStyling.baseTokens).toBeDefined();
    expect(Array.isArray(checkboxStyling.baseTokens)).toBe(true);
    expect(checkboxStyling.baseTokens.length).toBeGreaterThan(0);
  });

  it("should have states defined with correct tokens", () => {
    expect(checkboxStyling.states.checked).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.checked)).toBe(true);
    expect(checkboxStyling.states.checked.length).toBeGreaterThan(0);

    expect(checkboxStyling.states.indeterminate).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.indeterminate)).toBe(true);
    expect(checkboxStyling.states.indeterminate.length).toBeGreaterThan(0);

    expect(checkboxStyling.states.error).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.error)).toBe(true);
    expect(checkboxStyling.states.error.length).toBeGreaterThan(0);

    expect(checkboxStyling.states.hover).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.hover)).toBe(true);
    expect(checkboxStyling.states.hover.length).toBeGreaterThan(0);

    expect(checkboxStyling.states.focus).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.focus)).toBe(true);
    expect(checkboxStyling.states.focus.length).toBeGreaterThan(0);

    expect(checkboxStyling.states.disabled).toBeDefined();
    expect(Array.isArray(checkboxStyling.states.disabled)).toBe(true);
    expect(checkboxStyling.states.disabled.length).toBeGreaterThan(0);
  });

  it("should have icons defined with correct properties", () => {
    expect(checkboxStyling.icons).toHaveLength(2);

    const checkIcon = checkboxStyling.icons.find(
      (i: { name: string }) => i.name === "ph-check",
    );
    expect(checkIcon).toBeDefined();
    expect(checkIcon?.state).toBeDefined();
    expect(typeof checkIcon?.state).toBe("string");
    expect(checkIcon?.size).toBeDefined();
    expect(typeof checkIcon?.size).toBe("number");
    expect(checkIcon?.size).toBeGreaterThan(0);

    const minusIcon = checkboxStyling.icons.find(
      (i: { name: string }) => i.name === "ph-minus",
    );
    expect(minusIcon).toBeDefined();
    expect(minusIcon?.state).toBeDefined();
    expect(typeof minusIcon?.state).toBe("string");
    expect(minusIcon?.size).toBeDefined();
    expect(typeof minusIcon?.size).toBe("number");
    expect(minusIcon?.size).toBeGreaterThan(0);
  });
});

describe("Checkbox Generator - Variant Styles Parsing", () => {
  describe("default variant", () => {
    const classes = variantProp.classes.default;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
    });

    it("should have state classes for focus and hover", () => {
      expect(variantProp.stateClasses?.default).toBeDefined();
      expect(variantProp.stateClasses?.default.focus).toBeDefined();
      expect(typeof variantProp.stateClasses?.default.focus).toBe("string");
      expect(variantProp.stateClasses?.default.focus.length).toBeGreaterThan(0);
      expect(variantProp.stateClasses?.default.hover).toBeDefined();
      expect(typeof variantProp.stateClasses?.default.hover).toBe("string");
      expect(variantProp.stateClasses?.default.hover.length).toBeGreaterThan(0);
    });
  });

  describe("error variant", () => {
    const classes = variantProp.classes.error;

    it("should have classes defined", () => {
      expect(classes).toBeDefined();
      expect(typeof classes).toBe("string");
      expect(classes.length).toBeGreaterThan(0);
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
      expect(config.dimensions).toBeDefined();
      expect(typeof config.dimensions).toBe("string");
      expect(config.borderRadius).toBeDefined();
      expect(typeof config.borderRadius).toBe("string");
      expect(config.baseTokens).toBeDefined();
      expect(Array.isArray(config.baseTokens)).toBe(true);
      expect(config.baseTokens.length).toBeGreaterThan(0);
      expect(config.icons).toBeDefined();
      expect(Array.isArray(config.icons)).toBe(true);
      expect(config.icons.length).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxBoxSize", () => {
    it("should return a valid number", () => {
      const size = getCheckboxBoxSize();
      expect(typeof size).toBe("number");
      expect(size).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxIconSize", () => {
    it("should return a valid number", () => {
      const size = getCheckboxIconSize();
      expect(typeof size).toBe("number");
      expect(size).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxLabelGap", () => {
    it("should return a valid number", () => {
      const gap = getCheckboxLabelGap();
      expect(typeof gap).toBe("number");
      expect(gap).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxBorderRadius", () => {
    it("should return a valid number", () => {
      const radius = getCheckboxBorderRadius();
      expect(typeof radius).toBe("number");
      expect(radius).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxBgVariable", () => {
    it("should return a valid variable for unchecked", () => {
      const variable = getCheckboxBgVariable("unchecked");
      expect(variable).toBeDefined();
      expect(typeof variable).toBe("string");
      expect(variable.length).toBeGreaterThan(0);
    });

    it("should return a valid variable for checked", () => {
      const variable = getCheckboxBgVariable("checked");
      expect(variable).toBeDefined();
      expect(typeof variable).toBe("string");
      expect(variable.length).toBeGreaterThan(0);
    });

    it("should return a valid variable for indeterminate", () => {
      const variable = getCheckboxBgVariable("indeterminate");
      expect(variable).toBeDefined();
      expect(typeof variable).toBe("string");
      expect(variable.length).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxRingVariable", () => {
    it("should return a valid variable for default variant", () => {
      const variable = getCheckboxRingVariable("default");
      expect(variable).toBeDefined();
      expect(typeof variable).toBe("string");
      expect(variable.length).toBeGreaterThan(0);
    });

    it("should return a valid variable for error variant", () => {
      const variable = getCheckboxRingVariable("error");
      expect(variable).toBeDefined();
      expect(typeof variable).toBe("string");
      expect(variable.length).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxIconName", () => {
    it("should return null for unchecked", () => {
      expect(getCheckboxIconName("unchecked")).toBeNull();
    });

    it("should return a valid icon name for checked", () => {
      const iconName = getCheckboxIconName("checked");
      expect(iconName).toBeDefined();
      expect(typeof iconName).toBe("string");
      expect(iconName).not.toBeNull();
      expect(iconName!.length).toBeGreaterThan(0);
    });

    it("should return a valid icon name for indeterminate", () => {
      const iconName = getCheckboxIconName("indeterminate");
      expect(iconName).toBeDefined();
      expect(typeof iconName).toBe("string");
      expect(iconName).not.toBeNull();
      expect(iconName!.length).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxLayoutConfig", () => {
    it("should return valid layout configuration", () => {
      const config = getCheckboxLayoutConfig();
      expect(config.layoutMode).toBeDefined();
      expect(typeof config.layoutMode).toBe("string");
      expect(config.primaryAxisAlignItems).toBeDefined();
      expect(typeof config.primaryAxisAlignItems).toBe("string");
      expect(config.counterAxisAlignItems).toBeDefined();
      expect(typeof config.counterAxisAlignItems).toBe("string");
      expect(config.itemSpacing).toBeDefined();
      expect(typeof config.itemSpacing).toBe("number");
      expect(config.itemSpacing).toBeGreaterThan(0);
    });
  });

  describe("getCheckboxTextConfig", () => {
    it("should return valid text configuration", () => {
      const config = getCheckboxTextConfig();
      expect(config.fontSize).toBeDefined();
      expect(typeof config.fontSize).toBe("number");
      expect(config.fontSize).toBeGreaterThan(0);
      expect(config.fontWeight).toBeDefined();
      expect(typeof config.fontWeight).toBe("number");
      expect(config.fontWeight).toBeGreaterThan(0);
      expect(config.textVariable).toBeDefined();
      expect(typeof config.textVariable).toBe("string");
      expect(config.textVariable.length).toBeGreaterThan(0);
    });
  });
});

describe("Checkbox Generator - Box Configuration", () => {
  describe("unchecked state", () => {
    it("should have valid background variable", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.bgVariable).toBeDefined();
      expect(typeof config.bgVariable).toBe("string");
      expect(config.bgVariable.length).toBeGreaterThan(0);
    });

    it("should have no icon", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.icon).toBeNull();
    });

    it("should have valid ring variable", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.ringVariable).toBeDefined();
      expect(typeof config.ringVariable).toBe("string");
      expect(config.ringVariable.length).toBeGreaterThan(0);
    });
  });

  describe("checked state", () => {
    it("should have valid background variable", () => {
      const config = getCheckboxBoxConfig("checked", "default", false);
      expect(config.bgVariable).toBeDefined();
      expect(typeof config.bgVariable).toBe("string");
      expect(config.bgVariable.length).toBeGreaterThan(0);
    });

    it("should have check icon with valid properties", () => {
      const config = getCheckboxBoxConfig("checked", "default", false);
      expect(config.icon).toBeDefined();
      expect(typeof config.icon).toBe("string");
      expect(config.icon).not.toBeNull();
      expect(config.iconSize).toBeDefined();
      expect(typeof config.iconSize).toBe("number");
      expect(config.iconSize).toBeGreaterThan(0);
      expect(config.iconColor).toBeDefined();
      expect(typeof config.iconColor).toBe("string");
    });
  });

  describe("indeterminate state", () => {
    it("should have valid background variable", () => {
      const config = getCheckboxBoxConfig("indeterminate", "default", false);
      expect(config.bgVariable).toBeDefined();
      expect(typeof config.bgVariable).toBe("string");
      expect(config.bgVariable.length).toBeGreaterThan(0);
    });

    it("should have minus icon with valid properties", () => {
      const config = getCheckboxBoxConfig("indeterminate", "default", false);
      expect(config.icon).toBeDefined();
      expect(typeof config.icon).toBe("string");
      expect(config.icon).not.toBeNull();
      expect(config.iconSize).toBeDefined();
      expect(typeof config.iconSize).toBe("number");
      expect(config.iconSize).toBeGreaterThan(0);
      expect(config.iconColor).toBeDefined();
      expect(typeof config.iconColor).toBe("string");
    });
  });

  describe("error variant", () => {
    it("should have valid ring variable for all states", () => {
      for (const state of CHECKBOX_STATES) {
        const config = getCheckboxBoxConfig(state, "error", false);
        expect(config.ringVariable).toBeDefined();
        expect(typeof config.ringVariable).toBe("string");
        expect(config.ringVariable.length).toBeGreaterThan(0);
      }
    });
  });

  describe("disabled state", () => {
    it("should have reduced opacity when disabled", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", true);
      expect(config.opacity).toBeDefined();
      expect(typeof config.opacity).toBe("number");
      expect(config.opacity).toBeLessThan(1.0);
      expect(config.opacity).toBeGreaterThan(0);
    });

    it("should have full opacity when not disabled", () => {
      const config = getCheckboxBoxConfig("unchecked", "default", false);
      expect(config.opacity).toBeDefined();
      expect(typeof config.opacity).toBe("number");
      expect(config.opacity).toBe(1.0);
    });
  });
});

describe("Checkbox Generator - Complete Configuration", () => {
  it("should produce valid layout for checkbox with label", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.layoutConfig).toBeDefined();
    expect(config.layoutConfig.layoutMode).toBeDefined();
    expect(typeof config.layoutConfig.layoutMode).toBe("string");
    expect(config.layoutConfig.primaryAxisAlignItems).toBeDefined();
    expect(typeof config.layoutConfig.primaryAxisAlignItems).toBe("string");
    expect(config.layoutConfig.counterAxisAlignItems).toBeDefined();
    expect(typeof config.layoutConfig.counterAxisAlignItems).toBe("string");
    expect(config.layoutConfig.primaryAxisSizingMode).toBeDefined();
    expect(typeof config.layoutConfig.primaryAxisSizingMode).toBe("string");
    expect(config.layoutConfig.counterAxisSizingMode).toBeDefined();
    expect(typeof config.layoutConfig.counterAxisSizingMode).toBe("string");
    expect(config.layoutConfig.itemSpacing).toBeDefined();
    expect(typeof config.layoutConfig.itemSpacing).toBe("number");
    expect(config.layoutConfig.itemSpacing).toBeGreaterThan(0);
  });

  it("should produce valid text styling for label", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.textConfig).toBeDefined();
    expect(config.textConfig.fontSize).toBeDefined();
    expect(typeof config.textConfig.fontSize).toBe("number");
    expect(config.textConfig.fontSize).toBeGreaterThan(0);
    expect(config.textConfig.fontWeight).toBeDefined();
    expect(typeof config.textConfig.fontWeight).toBe("number");
    expect(config.textConfig.fontWeight).toBeGreaterThan(0);
    expect(config.textConfig.textVariable).toBeDefined();
    expect(typeof config.textConfig.textVariable).toBe("string");
    expect(config.textConfig.textVariable.length).toBeGreaterThan(0);
  });

  it("should include styling config from registry", () => {
    const config = getCheckboxCompleteConfig("unchecked", "default", false);

    expect(config.stylingConfig.dimensions).toBeDefined();
    expect(typeof config.stylingConfig.dimensions).toBe("string");
    expect(config.stylingConfig.borderRadius).toBeDefined();
    expect(typeof config.stylingConfig.borderRadius).toBe("string");
    expect(config.stylingConfig.icons).toBeDefined();
    expect(Array.isArray(config.stylingConfig.icons)).toBe(true);
    expect(config.stylingConfig.icons.length).toBeGreaterThan(0);
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
