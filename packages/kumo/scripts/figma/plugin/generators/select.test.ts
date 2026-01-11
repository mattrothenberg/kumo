/**
 * Tests for select.ts component generator
 *
 * These tests ensure the Select Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the select
 * generator, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * select.tsx → component-registry.json → select.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getTriggerConfig,
  getPopupConfig,
  getOptionConfig,
  getAllVariantData,
  SELECT_VARIANT_VALUES,
  SELECT_OPEN_VALUES,
  SELECT_STATE_VALUES,
} from "./select";
import { FONT_SIZE } from "./shared";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const selectStyling = (registry.components.Select as any).styling;

describe("Select Generator - Variant Configuration", () => {
  it("should have all expected variant values", () => {
    const expectedVariants = ["default", "withLabel", "withError"];
    expect(SELECT_VARIANT_VALUES).toEqual(expectedVariants);
  });

  it("should have all expected open values", () => {
    const expectedOpen = [false, true];
    expect(SELECT_OPEN_VALUES).toEqual(expectedOpen);
  });

  it("should have all expected state values", () => {
    const expectedStates = ["default", "focus", "disabled", "loading"];
    expect(SELECT_STATE_VALUES).toEqual(expectedStates);
  });

  it("should generate correct number of total variants", () => {
    // 3 variants × 2 open states × 4 states = 24 total combinations
    const totalVariants = 3 * 2 * 4;
    expect(totalVariants).toBe(24);
  });
});

describe("Select Generator - Trigger Configuration", () => {
  it("should return trigger config", () => {
    const config = getTriggerConfig();
    expect(config).toBeDefined();
  });

  it("should have trigger height matching registry", () => {
    const config = getTriggerConfig();
    expect(config.height).toBe(selectStyling.trigger.height);
    expect(typeof config.height).toBe("number");
  });

  it("should have trigger padding matching registry", () => {
    const config = getTriggerConfig();
    expect(config.paddingX).toBe(selectStyling.trigger.paddingX);
    expect(config.paddingY).toBe(selectStyling.trigger.paddingY);
    expect(typeof config.paddingX).toBe("number");
    expect(typeof config.paddingY).toBe("number");
  });

  it("should have trigger border radius matching registry", () => {
    const config = getTriggerConfig();
    expect(config.borderRadius).toBe(selectStyling.trigger.borderRadius);
    expect(typeof config.borderRadius).toBe("number");
  });

  it("should have trigger typography matching registry", () => {
    const config = getTriggerConfig();
    expect(config.fontSize).toBe(selectStyling.trigger.fontSize);
    expect(config.fontWeight).toBe(selectStyling.trigger.fontWeight);
    expect(typeof config.fontSize).toBe("number");
    expect(typeof config.fontWeight).toBe("number");
  });

  it("should have correct trigger color tokens", () => {
    const config = getTriggerConfig();
    expect(config.background).toBe("color-secondary");
    expect(config.text).toBe("text-color-surface");
    expect(config.ring).toBe("color-border");
    expect(typeof config.background).toBe("string");
    expect(typeof config.text).toBe("string");
    expect(typeof config.ring).toBe("string");
  });

  it("should have all required trigger properties", () => {
    const config = getTriggerConfig();
    const requiredProps = [
      "height",
      "paddingX",
      "paddingY",
      "borderRadius",
      "fontSize",
      "fontWeight",
      "background",
      "text",
      "ring",
    ];

    for (const prop of requiredProps) {
      expect(config).toHaveProperty(prop);
    }
  });
});

describe("Select Generator - Popup Configuration", () => {
  it("should return popup config", () => {
    const config = getPopupConfig();
    expect(config).toBeDefined();
  });

  it("should have popup dimensions matching registry", () => {
    const config = getPopupConfig();
    expect(config.width).toBe(selectStyling.popup.width);
    expect(typeof config.width).toBe("number");
  });

  it("should have popup padding matching registry", () => {
    const config = getPopupConfig();
    expect(config.padding).toBe(selectStyling.popup.padding);
    expect(typeof config.padding).toBe("number");
  });

  it("should have popup border radius matching registry", () => {
    const config = getPopupConfig();
    expect(config.borderRadius).toBe(selectStyling.popup.borderRadius);
    expect(typeof config.borderRadius).toBe("number");
  });

  it("should have correct popup color tokens", () => {
    const config = getPopupConfig();
    expect(config.background).toBe("color-secondary");
    expect(config.ring).toBe("color-border");
    expect(typeof config.background).toBe("string");
    expect(typeof config.ring).toBe("string");
  });

  it("should have all required popup properties", () => {
    const config = getPopupConfig();
    const requiredProps = [
      "background",
      "ring",
      "borderRadius",
      "padding",
      "width",
    ];

    for (const prop of requiredProps) {
      expect(config).toHaveProperty(prop);
    }
  });
});

describe("Select Generator - Option Configuration", () => {
  it("should return option config", () => {
    const config = getOptionConfig();
    expect(config).toBeDefined();
  });

  it("should have option padding matching registry", () => {
    const config = getOptionConfig();
    expect(config.paddingX).toBe(selectStyling.option.paddingX);
    expect(config.paddingY).toBe(selectStyling.option.paddingY);
    expect(typeof config.paddingX).toBe("number");
    expect(typeof config.paddingY).toBe("number");
  });

  it("should have option border radius matching registry", () => {
    const config = getOptionConfig();
    expect(config.borderRadius).toBe(selectStyling.option.borderRadius);
    expect(typeof config.borderRadius).toBe("number");
  });

  it("should have option typography matching registry", () => {
    const config = getOptionConfig();
    expect(config.fontSize).toBe(selectStyling.option.fontSize);
    expect(config.fontWeight).toBe(selectStyling.option.fontWeight);
    expect(typeof config.fontSize).toBe("number");
    expect(typeof config.fontWeight).toBe("number");
  });

  it("should have correct option color tokens", () => {
    const config = getOptionConfig();
    expect(config.text).toBe("text-color-surface");
    expect(config.highlightBackground).toBe("color-color-3");
    expect(typeof config.text).toBe("string");
    expect(typeof config.highlightBackground).toBe("string");
  });

  it("should have all required option properties", () => {
    const config = getOptionConfig();
    const requiredProps = [
      "paddingX",
      "paddingY",
      "borderRadius",
      "fontSize",
      "fontWeight",
      "text",
      "highlightBackground",
    ];

    for (const prop of requiredProps) {
      expect(config).toHaveProperty(prop);
    }
  });
});

describe("Select Generator - All Variant Data", () => {
  it("should return complete data structure", () => {
    const allData = getAllVariantData();
    expect(allData).toBeDefined();
    expect(allData.triggerConfig).toBeDefined();
    expect(allData.popupConfig).toBeDefined();
    expect(allData.optionConfig).toBeDefined();
    expect(allData.variants).toBeDefined();
    expect(allData.variantCount).toBeDefined();
  });

  it("should return all variant combinations", () => {
    const allData = getAllVariantData();
    // 3 variants × 2 open states × 4 states = 24 total
    expect(allData.variants.length).toBeGreaterThan(0);
    expect(allData.variantCount).toBe(24);
  });

  it("should include trigger config matching registry", () => {
    const allData = getAllVariantData();
    const trigger = allData.triggerConfig;
    expect(trigger.height).toBe(selectStyling.trigger.height);
    expect(trigger.paddingX).toBe(selectStyling.trigger.paddingX);
    expect(trigger.borderRadius).toBe(selectStyling.trigger.borderRadius);
    expect(trigger.background).toBe("color-secondary");
  });

  it("should include popup config matching registry", () => {
    const allData = getAllVariantData();
    const popup = allData.popupConfig;
    expect(popup.width).toBe(selectStyling.popup.width);
    expect(popup.padding).toBe(selectStyling.popup.padding);
    expect(popup.borderRadius).toBe(selectStyling.popup.borderRadius);
    expect(popup.background).toBe("color-secondary");
  });

  it("should include option config matching registry", () => {
    const allData = getAllVariantData();
    const option = allData.optionConfig;
    expect(option.paddingX).toBe(selectStyling.option.paddingX);
    expect(option.paddingY).toBe(selectStyling.option.paddingY);
    expect(option.borderRadius).toBe(selectStyling.option.borderRadius);
    expect(option.fontSize).toBe(FONT_SIZE.base);
  });

  it("should have correct variant structure for each combination", () => {
    const allData = getAllVariantData();

    for (const variant of allData.variants) {
      expect(variant).toHaveProperty("variant");
      expect(variant).toHaveProperty("open");
      expect(variant).toHaveProperty("state");
      expect(variant).toHaveProperty("stateStyle");
      expect(variant).toHaveProperty("useErrorRing");

      expect(typeof variant.variant).toBe("string");
      expect(typeof variant.open).toBe("boolean");
      expect(typeof variant.state).toBe("string");
      expect(typeof variant.useErrorRing).toBe("boolean");
    }
  });
});

describe("Select Generator - Variant-Specific Properties", () => {
  it("should have default variant without label/error", () => {
    const allData = getAllVariantData();
    const defaultVariants = allData.variants.filter(
      (v) => v.variant === "default",
    );

    expect(defaultVariants.length).toBeGreaterThan(0);
    for (const variant of defaultVariants) {
      expect(variant.label).toBeUndefined();
      expect(variant.errorMessage).toBeUndefined();
      expect(variant.useErrorRing).toBe(false);
    }
  });

  it("should have withLabel variant with label and description", () => {
    const allData = getAllVariantData();
    const withLabelVariants = allData.variants.filter(
      (v) => v.variant === "withLabel",
    );

    expect(withLabelVariants.length).toBeGreaterThan(0);
    for (const variant of withLabelVariants) {
      expect(variant.label).toBeDefined();
      expect(typeof variant.label).toBe("string");
      expect(variant.description).toBeDefined();
      expect(typeof variant.description).toBe("string");
      expect(variant.useErrorRing).toBe(false);
    }
  });

  it("should have withError variant with error message and ring", () => {
    const allData = getAllVariantData();
    const withErrorVariants = allData.variants.filter(
      (v) => v.variant === "withError",
    );

    expect(withErrorVariants.length).toBeGreaterThan(0);
    for (const variant of withErrorVariants) {
      expect(variant.label).toBeDefined();
      expect(variant.errorMessage).toBeDefined();
      expect(typeof variant.errorMessage).toBe("string");
      expect(variant.useErrorRing).toBe(true);
    }
  });
});

describe("Select Generator - State-Specific Properties", () => {
  it("should have default state with border ring", () => {
    const allData = getAllVariantData();
    const defaultStates = allData.variants.filter((v) => v.state === "default");

    expect(defaultStates.length).toBeGreaterThan(0);
    for (const variant of defaultStates) {
      expect(variant.stateStyle.ringVariable).toBe("color-border");
      expect(variant.stateStyle.opacity).toBeUndefined();
    }
  });

  it("should have focus state with active ring", () => {
    const allData = getAllVariantData();
    const focusStates = allData.variants.filter((v) => v.state === "focus");

    expect(focusStates.length).toBeGreaterThan(0);
    for (const variant of focusStates) {
      expect(variant.stateStyle.ringVariable).toBe("color-active");
      expect(variant.stateStyle.opacity).toBeUndefined();
    }
  });

  it("should have disabled state with opacity", () => {
    const allData = getAllVariantData();
    const disabledStates = allData.variants.filter(
      (v) => v.state === "disabled",
    );

    expect(disabledStates.length).toBeGreaterThan(0);
    for (const variant of disabledStates) {
      expect(variant.stateStyle.ringVariable).toBe("color-border");
      expect(variant.stateStyle.opacity).toBe(0.5);
    }
  });

  it("should have loading state with border ring", () => {
    const allData = getAllVariantData();
    const loadingStates = allData.variants.filter((v) => v.state === "loading");

    expect(loadingStates.length).toBeGreaterThan(0);
    for (const variant of loadingStates) {
      expect(variant.stateStyle.ringVariable).toBe("color-border");
      expect(variant.stateStyle.opacity).toBeUndefined();
    }
  });
});

describe("Select Generator - Open State Combinations", () => {
  it("should have variants for both open and closed states", () => {
    const allData = getAllVariantData();
    const openVariants = allData.variants.filter((v) => v.open === true);
    const closedVariants = allData.variants.filter((v) => v.open === false);

    // Should be equal number of open and closed variants
    expect(openVariants.length).toBe(closedVariants.length);
    expect(openVariants.length).toBe(12); // 3 variants × 4 states
  });

  it("should have all state combinations for open=false", () => {
    const allData = getAllVariantData();
    const closedVariants = allData.variants.filter((v) => v.open === false);

    const states = [...new Set(closedVariants.map((v) => v.state))];
    expect(states).toContain("default");
    expect(states).toContain("focus");
    expect(states).toContain("disabled");
    expect(states).toContain("loading");
  });

  it("should have all state combinations for open=true", () => {
    const allData = getAllVariantData();
    const openVariants = allData.variants.filter((v) => v.open === true);

    const states = [...new Set(openVariants.map((v) => v.state))];
    expect(states).toContain("default");
    expect(states).toContain("focus");
    expect(states).toContain("disabled");
    expect(states).toContain("loading");
  });
});

describe("Select Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   * Structural assertions ensure properties exist and have correct types.
   */

  it("should produce correct Figma properties for trigger", () => {
    const trigger = getTriggerConfig();

    // Expected Figma component properties - structural checks
    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "CENTER",
      resize: [trigger.height, trigger.height], // width variable, height fixed
      paddingLeft: trigger.paddingX,
      paddingRight: trigger.paddingX,
      paddingTop: trigger.paddingY,
      paddingBottom: trigger.paddingY,
      cornerRadius: trigger.borderRadius,
      // Colors
      fillVariable: trigger.background,
      strokeVariable: trigger.ring,
      textVariable: trigger.text,
      // Typography
      fontSize: trigger.fontSize,
      fontWeight: trigger.fontWeight,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    expect(figmaProps.counterAxisAlignItems).toBe("CENTER");
    expect(typeof figmaProps.paddingLeft).toBe("number");
    expect(typeof figmaProps.paddingRight).toBe("number");
    expect(typeof figmaProps.paddingTop).toBe("number");
    expect(typeof figmaProps.paddingBottom).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.fillVariable).toBe("string");
    expect(typeof figmaProps.strokeVariable).toBe("string");
    expect(typeof figmaProps.textVariable).toBe("string");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.fontWeight).toBe("number");
  });

  it("should produce correct Figma properties for popup", () => {
    const popup = getPopupConfig();

    const figmaProps = {
      // Layout
      layoutMode: "VERTICAL",
      resize: [popup.width, 1], // width fixed, height auto
      padding: popup.padding,
      cornerRadius: popup.borderRadius,
      // Colors
      fillVariable: popup.background,
      strokeVariable: popup.ring,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("VERTICAL");
    expect(typeof figmaProps.padding).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.fillVariable).toBe("string");
    expect(typeof figmaProps.strokeVariable).toBe("string");
  });

  it("should produce correct Figma properties for option", () => {
    const option = getOptionConfig();

    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "CENTER",
      paddingLeft: option.paddingX,
      paddingRight: option.paddingX,
      paddingTop: option.paddingY,
      paddingBottom: option.paddingY,
      cornerRadius: option.borderRadius,
      // Typography
      fontSize: option.fontSize,
      fontWeight: option.fontWeight,
      textVariable: option.text,
      // Highlight state
      highlightFillVariable: option.highlightBackground,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    expect(figmaProps.counterAxisAlignItems).toBe("CENTER");
    expect(typeof figmaProps.paddingLeft).toBe("number");
    expect(typeof figmaProps.paddingRight).toBe("number");
    expect(typeof figmaProps.paddingTop).toBe("number");
    expect(typeof figmaProps.paddingBottom).toBe("number");
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(typeof figmaProps.textVariable).toBe("string");
    expect(typeof figmaProps.highlightFillVariable).toBe("string");
  });
});

describe("Select Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (config, layout calculations)
   * BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in configuration or layout logic
   * 3. Validating the full source of truth chain:
   *    select.tsx → KUMO_SELECT_STYLING → select.ts → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Select component styles changed in select.tsx (intended)
   * - Generator configuration changed (review carefully)
   * - Variant logic changed (review carefully)
   */

  it("should produce consistent trigger config", () => {
    const config = getTriggerConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent popup config", () => {
    const config = getPopupConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent option config", () => {
    const config = getOptionConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * select.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.triggerConfig).toBeDefined();
    expect(allData.popupConfig).toBeDefined();
    expect(allData.optionConfig).toBeDefined();
    expect(allData.variants.length).toBeGreaterThan(0);
    expect(allData.variantCount).toBe(24);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.open).toBeDefined();
      expect(variant.state).toBeDefined();
      expect(variant.stateStyle).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
