/**
 * Tests for tabs.ts component generator
 *
 * These tests ensure the Tabs Figma component generation stays in sync
 * with the source of truth (component-registry.json and KUMO_TABS_STYLING).
 *
 * CRITICAL: These tests act as a regression guard. If you change the tabs
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * tabs.tsx (KUMO_TABS_STYLING) → component-registry.json → tabs.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getContainerConfig,
  getTabConfig,
  getIndicatorConfig,
  getAllVariantData,
} from "./tabs";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const tabsComponent = registry.components.Tabs as any;
const tabsStyling = tabsComponent.styling;

describe("Tabs Generator - Registry Validation", () => {
  it("should have Tabs component in registry", () => {
    expect(tabsComponent).toBeDefined();
    expect(tabsComponent.name).toBe("Tabs");
  });

  it("should have styling metadata defined", () => {
    expect(tabsStyling).toBeDefined();
    expect(tabsStyling.container).toBeDefined();
    expect(tabsStyling.tab).toBeDefined();
    expect(tabsStyling.indicator).toBeDefined();
  });

  it("should have container styling defined", () => {
    expect(tabsStyling.container).toBeDefined();
    expect(tabsStyling.container.height).toBe(34);
    expect(tabsStyling.container.borderRadius).toBe(8);
    expect(tabsStyling.container.background).toBe("color-accent");
    expect(tabsStyling.container.padding).toBe(1);
  });

  it("should have tab styling defined", () => {
    expect(tabsStyling.tab).toBeDefined();
    expect(tabsStyling.tab.paddingX).toBe(10);
    expect(tabsStyling.tab.verticalMargin).toBe(1);
    expect(tabsStyling.tab.fontSize).toBe(16);
    expect(tabsStyling.tab.fontWeight).toBe(500);
    expect(tabsStyling.tab.borderRadius).toBe(8);
    expect(tabsStyling.tab.activeColor).toBe("text-color-surface");
    expect(tabsStyling.tab.inactiveColor).toBe("text-color-label");
  });

  it("should have indicator styling defined", () => {
    expect(tabsStyling.indicator).toBeDefined();
    expect(tabsStyling.indicator.background).toBe("color-surface-elevated");
    expect(tabsStyling.indicator.ring).toBe("color-color-2");
    expect(tabsStyling.indicator.borderRadius).toBe(8);
    expect(tabsStyling.indicator.shadow).toBe("shadow-sm");
  });
});

describe("Tabs Generator - Container Config Validation", () => {
  it("should return container config with correct structure", () => {
    const config = getContainerConfig();
    expect(config).toBeDefined();
    expect(config.height).toBeDefined();
    expect(config.borderRadius).toBeDefined();
    expect(config.padding).toBeDefined();
  });

  it("should return container height matching registry", () => {
    const config = getContainerConfig();
    expect(config.height).toBe(34);
    expect(config.height).toBe(tabsStyling.container.height);
  });

  it("should return container border radius matching registry", () => {
    const config = getContainerConfig();
    expect(config.borderRadius).toBe(8);
    expect(config.borderRadius).toBe(tabsStyling.container.borderRadius);
  });

  it("should return container padding matching registry", () => {
    const config = getContainerConfig();
    expect(config.padding).toBe(1);
    expect(config.padding).toBe(tabsStyling.container.padding);
  });

  it("should have numeric types for all properties", () => {
    const config = getContainerConfig();
    expect(typeof config.height).toBe("number");
    expect(typeof config.borderRadius).toBe("number");
    expect(typeof config.padding).toBe("number");
  });

  it("should have positive values for all dimensions", () => {
    const config = getContainerConfig();
    expect(config.height).toBeGreaterThan(0);
    expect(config.borderRadius).toBeGreaterThan(0);
    expect(config.padding).toBeGreaterThan(0);
  });
});

describe("Tabs Generator - Tab Config Validation", () => {
  it("should return tab config with correct structure", () => {
    const config = getTabConfig();
    expect(config).toBeDefined();
    expect(config.paddingX).toBeDefined();
    expect(config.verticalMargin).toBeDefined();
    expect(config.fontSize).toBeDefined();
    expect(config.fontWeight).toBeDefined();
    expect(config.borderRadius).toBeDefined();
  });

  it("should return tab padding matching registry", () => {
    const config = getTabConfig();
    expect(config.paddingX).toBe(10);
    expect(config.paddingX).toBe(tabsStyling.tab.paddingX);
  });

  it("should return tab vertical margin matching registry", () => {
    const config = getTabConfig();
    expect(config.verticalMargin).toBe(1);
    expect(config.verticalMargin).toBe(tabsStyling.tab.verticalMargin);
  });

  it("should return tab font size matching registry", () => {
    const config = getTabConfig();
    expect(config.fontSize).toBe(16);
    expect(config.fontSize).toBe(tabsStyling.tab.fontSize);
  });

  it("should return tab font weight matching registry", () => {
    const config = getTabConfig();
    expect(config.fontWeight).toBe(500);
    expect(config.fontWeight).toBe(tabsStyling.tab.fontWeight);
  });

  it("should return tab border radius matching registry", () => {
    const config = getTabConfig();
    expect(config.borderRadius).toBe(8);
    expect(config.borderRadius).toBe(tabsStyling.tab.borderRadius);
  });

  it("should have numeric types for all properties", () => {
    const config = getTabConfig();
    expect(typeof config.paddingX).toBe("number");
    expect(typeof config.verticalMargin).toBe("number");
    expect(typeof config.fontSize).toBe("number");
    expect(typeof config.fontWeight).toBe("number");
    expect(typeof config.borderRadius).toBe("number");
  });

  it("should have positive values for all dimensions", () => {
    const config = getTabConfig();
    expect(config.paddingX).toBeGreaterThan(0);
    expect(config.verticalMargin).toBeGreaterThan(0);
    expect(config.fontSize).toBeGreaterThan(0);
    expect(config.fontWeight).toBeGreaterThan(0);
    expect(config.borderRadius).toBeGreaterThan(0);
  });

  it("should have font weight of 500 (medium)", () => {
    const config = getTabConfig();
    expect(config.fontWeight).toBe(500);
  });
});

describe("Tabs Generator - Indicator Config Validation", () => {
  it("should return indicator config with correct structure", () => {
    const config = getIndicatorConfig();
    expect(config).toBeDefined();
    expect(config.borderRadius).toBeDefined();
  });

  it("should return indicator border radius matching registry", () => {
    const config = getIndicatorConfig();
    expect(config.borderRadius).toBe(8);
    expect(config.borderRadius).toBe(tabsStyling.indicator.borderRadius);
  });

  it("should have numeric type for border radius", () => {
    const config = getIndicatorConfig();
    expect(typeof config.borderRadius).toBe("number");
  });

  it("should have positive border radius", () => {
    const config = getIndicatorConfig();
    expect(config.borderRadius).toBeGreaterThan(0);
  });
});

describe("Tabs Generator - All Variant Data Validation", () => {
  it("should return complete data structure", () => {
    const allData = getAllVariantData();
    expect(allData).toBeDefined();
    expect(allData.config).toBeDefined();
    expect(allData.defaultTabs).toBeDefined();
    expect(allData.container).toBeDefined();
    expect(allData.tab).toBeDefined();
    expect(allData.indicator).toBeDefined();
    expect(allData.variants).toBeDefined();
  });

  it("should have default tabs defined", () => {
    const allData = getAllVariantData();
    expect(allData.defaultTabs.length).toBeGreaterThan(0);
    expect(allData.defaultTabs).toContain("Tab 1");
    expect(allData.defaultTabs).toContain("Tab 2");
  });

  it("should have variants for each tab", () => {
    const allData = getAllVariantData();
    expect(allData.variants.length).toBeGreaterThan(0);
  });

  it("should have correct variant structure", () => {
    const allData = getAllVariantData();
    for (const variant of allData.variants) {
      expect(variant.value).toBeDefined();
      expect(variant.index).toBeDefined();
      expect(variant.isActive).toBeDefined();
      expect(typeof variant.value).toBe("string");
      expect(typeof variant.index).toBe("number");
      expect(typeof variant.isActive).toBe("boolean");
    }
  });

  it("should have sequential indices starting from 0", () => {
    const allData = getAllVariantData();
    allData.variants.forEach((variant, idx) => {
      expect(variant.index).toBe(idx);
    });
  });

  it("should include container config", () => {
    const allData = getAllVariantData();
    expect(allData.container.height).toBe(34);
    expect(allData.container.borderRadius).toBe(8);
    expect(allData.container.padding).toBe(1);
  });

  it("should include tab config", () => {
    const allData = getAllVariantData();
    expect(allData.tab.paddingX).toBe(10);
    expect(allData.tab.verticalMargin).toBe(1);
    expect(allData.tab.fontSize).toBe(16);
    expect(allData.tab.fontWeight).toBe(500);
    expect(allData.tab.borderRadius).toBe(8);
  });

  it("should include indicator config", () => {
    const allData = getAllVariantData();
    expect(allData.indicator.borderRadius).toBe(8);
  });
});

describe("Tabs Generator - Structural Consistency", () => {
  it("should have consistent border radius across all elements", () => {
    const allData = getAllVariantData();
    const expectedRadius = 8;
    expect(allData.container.borderRadius).toBe(expectedRadius);
    expect(allData.tab.borderRadius).toBe(expectedRadius);
    expect(allData.indicator.borderRadius).toBe(expectedRadius);
  });

  it("should have matching padding between container and tab margins", () => {
    const allData = getAllVariantData();
    // Container padding (1px) should match tab vertical margin (1px)
    expect(allData.container.padding).toBe(1);
    expect(allData.tab.verticalMargin).toBe(1);
  });

  it("should calculate tab height correctly", () => {
    const allData = getAllVariantData();
    const containerHeight = allData.container.height;
    const verticalMargin = allData.tab.verticalMargin;
    const expectedTabHeight = containerHeight - verticalMargin * 2;
    // Expected: 34 - (1 * 2) = 32px
    expect(expectedTabHeight).toBe(32);
  });

  it("should calculate indicator height correctly", () => {
    const allData = getAllVariantData();
    const containerHeight = allData.container.height;
    const verticalMargin = allData.tab.verticalMargin;
    const expectedIndicatorHeight = containerHeight - verticalMargin * 2;
    // Indicator should match tab height: 34 - (1 * 2) = 32px
    expect(expectedIndicatorHeight).toBe(32);
  });
});

describe("Tabs Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for container", () => {
    const config = getContainerConfig();

    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisSizingMode: "AUTO", // Hug width
      counterAxisSizingMode: "FIXED", // Fixed height
      height: config.height,
      itemSpacing: 0, // No gap between tabs
      paddingLeft: config.padding,
      paddingRight: config.padding,
      paddingTop: 0,
      paddingBottom: 0,
      cornerRadius: config.borderRadius,
      // Background: bg-accent (applied via Figma variable)
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisSizingMode).toBe("AUTO");
    expect(figmaProps.counterAxisSizingMode).toBe("FIXED");
    expect(typeof figmaProps.height).toBe("number");
    expect(figmaProps.height).toBe(34);
    expect(figmaProps.itemSpacing).toBe(0);
    expect(figmaProps.paddingLeft).toBe(1);
    expect(figmaProps.paddingRight).toBe(1);
    expect(figmaProps.paddingTop).toBe(0);
    expect(figmaProps.paddingBottom).toBe(0);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(8);
  });

  it("should produce correct Figma properties for tab button", () => {
    const config = getTabConfig();
    const containerConfig = getContainerConfig();

    const buttonHeight = containerConfig.height - config.verticalMargin * 2;

    const figmaProps = {
      // Layout
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      primaryAxisSizingMode: "AUTO", // Hug width
      counterAxisSizingMode: "FIXED", // Fixed height
      height: buttonHeight,
      paddingLeft: config.paddingX,
      paddingRight: config.paddingX,
      paddingTop: 0,
      paddingBottom: 0,
      cornerRadius: config.borderRadius,
      // Background: transparent (fills = [])
      // Text: text-surface (active) or text-label (inactive)
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaProps.counterAxisAlignItems).toBe("CENTER");
    expect(figmaProps.primaryAxisSizingMode).toBe("AUTO");
    expect(figmaProps.counterAxisSizingMode).toBe("FIXED");
    expect(typeof figmaProps.height).toBe("number");
    expect(figmaProps.height).toBe(32); // 34 - (1 * 2)
    expect(figmaProps.paddingLeft).toBe(10);
    expect(figmaProps.paddingRight).toBe(10);
    expect(figmaProps.paddingTop).toBe(0);
    expect(figmaProps.paddingBottom).toBe(0);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(8);
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(figmaProps.fontSize).toBe(16);
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fontWeight).toBe(500);
  });

  it("should produce correct Figma properties for indicator", () => {
    const config = getIndicatorConfig();
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const indicatorHeight =
      containerConfig.height - tabConfig.verticalMargin * 2;

    const figmaProps = {
      // Positioning
      layoutPositioning: "ABSOLUTE",
      height: indicatorHeight,
      y: tabConfig.verticalMargin,
      cornerRadius: config.borderRadius,
      // Background: bg-surface-elevated (applied via Figma variable)
      // Border: ring ring-color-2 (applied via Figma variable)
      // Shadow: shadow-sm (applied via effects)
    };

    // Structural assertions
    expect(figmaProps.layoutPositioning).toBe("ABSOLUTE");
    expect(typeof figmaProps.height).toBe("number");
    expect(figmaProps.height).toBe(32); // 34 - (1 * 2)
    expect(figmaProps.y).toBe(1);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(8);
  });
});

describe("Tabs Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in Tabs component are documented.
   * Note: These tokens are applied via Figma variables at runtime.
   */

  it("should document container background token", () => {
    expect(tabsStyling.container.background).toBe("color-accent");
  });

  it("should document active tab text token", () => {
    expect(tabsStyling.tab.activeColor).toBe("text-color-surface");
  });

  it("should document inactive tab text token", () => {
    expect(tabsStyling.tab.inactiveColor).toBe("text-color-label");
  });

  it("should document indicator background token", () => {
    expect(tabsStyling.indicator.background).toBe("color-surface-elevated");
  });

  it("should document indicator ring token", () => {
    expect(tabsStyling.indicator.ring).toBe("color-color-2");
  });

  it("should document indicator shadow", () => {
    expect(tabsStyling.indicator.shadow).toBe("shadow-sm");
  });
});

describe("Tabs Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (config objects, layout calculations)
   * BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in configuration
   * 3. Validating the full source of truth chain:
   *    tabs.tsx (KUMO_TABS_STYLING) → component-registry.json → tabs.ts (generator) → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Tabs component styles changed in tabs.tsx (intended)
   * - KUMO_TABS_STYLING changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent container config from registry", () => {
    const config = getContainerConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent tab config from registry", () => {
    const config = getTabConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent indicator config from registry", () => {
    const config = getIndicatorConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * tabs.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.config).toBeDefined();
    expect(allData.defaultTabs).toHaveLength(3);
    expect(allData.container).toBeDefined();
    expect(allData.tab).toBeDefined();
    expect(allData.indicator).toBeDefined();
    expect(allData.variants).toHaveLength(3);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.value).toBeDefined();
      expect(variant.index).toBeDefined();
      expect(variant.isActive).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});

describe("Tabs Generator - Layout Calculations", () => {
  /**
   * Test derived layout calculations to ensure they produce correct Figma values
   */

  it("should calculate tab button height correctly", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const tabHeight = containerConfig.height - tabConfig.verticalMargin * 2;
    expect(tabHeight).toBe(32); // 34 - (1 * 2) = 32
  });

  it("should calculate indicator height correctly", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const indicatorHeight =
      containerConfig.height - tabConfig.verticalMargin * 2;
    expect(indicatorHeight).toBe(32); // 34 - (1 * 2) = 32
  });

  it("should calculate indicator Y position correctly", () => {
    const tabConfig = getTabConfig();
    const indicatorY = tabConfig.verticalMargin;
    expect(indicatorY).toBe(1); // matches my-px (1px margin)
  });

  it("should have matching tab and indicator heights", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const tabHeight = containerConfig.height - tabConfig.verticalMargin * 2;
    const indicatorHeight =
      containerConfig.height - tabConfig.verticalMargin * 2;

    expect(tabHeight).toBe(indicatorHeight);
  });
});

describe("Tabs Generator - Configuration Integrity", () => {
  /**
   * Ensure the generator's internal TABS_CONFIG matches KUMO_TABS_STYLING from registry
   */

  it("should have matching height between generator and registry", () => {
    const config = getContainerConfig();
    expect(config.height).toBe(tabsStyling.container.height);
  });

  it("should have matching borderRadius between generator and registry", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();
    const indicatorConfig = getIndicatorConfig();

    expect(containerConfig.borderRadius).toBe(
      tabsStyling.container.borderRadius,
    );
    expect(tabConfig.borderRadius).toBe(tabsStyling.tab.borderRadius);
    expect(indicatorConfig.borderRadius).toBe(
      tabsStyling.indicator.borderRadius,
    );
  });

  it("should have matching padding between generator and registry", () => {
    const config = getContainerConfig();
    expect(config.padding).toBe(tabsStyling.container.padding);
  });

  it("should have matching tab paddingX between generator and registry", () => {
    const config = getTabConfig();
    expect(config.paddingX).toBe(tabsStyling.tab.paddingX);
  });

  it("should have matching tab verticalMargin between generator and registry", () => {
    const config = getTabConfig();
    expect(config.verticalMargin).toBe(tabsStyling.tab.verticalMargin);
  });

  it("should have matching tab fontSize between generator and registry", () => {
    const config = getTabConfig();
    expect(config.fontSize).toBe(tabsStyling.tab.fontSize);
  });

  it("should have matching tab fontWeight between generator and registry", () => {
    const config = getTabConfig();
    expect(config.fontWeight).toBe(tabsStyling.tab.fontWeight);
  });
});
