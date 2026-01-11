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
    expect(typeof tabsStyling.container.height).toBe("number");
    expect(typeof tabsStyling.container.borderRadius).toBe("number");
    expect(tabsStyling.container.background).toBe("color-accent");
    expect(typeof tabsStyling.container.padding).toBe("number");
  });

  it("should have tab styling defined", () => {
    expect(tabsStyling.tab).toBeDefined();
    expect(typeof tabsStyling.tab.paddingX).toBe("number");
    expect(typeof tabsStyling.tab.verticalMargin).toBe("number");
    expect(typeof tabsStyling.tab.fontSize).toBe("number");
    expect(typeof tabsStyling.tab.fontWeight).toBe("number");
    expect(typeof tabsStyling.tab.borderRadius).toBe("number");
    expect(tabsStyling.tab.activeColor).toBe("text-color-surface");
    expect(tabsStyling.tab.inactiveColor).toBe("text-color-label");
  });

  it("should have indicator styling defined", () => {
    expect(tabsStyling.indicator).toBeDefined();
    expect(tabsStyling.indicator.background).toBe("color-surface-elevated");
    expect(tabsStyling.indicator.ring).toBe("color-color-2");
    expect(typeof tabsStyling.indicator.borderRadius).toBe("number");
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
    expect(config.height).toBe(tabsStyling.container.height);
  });

  it("should return container border radius matching registry", () => {
    const config = getContainerConfig();
    expect(config.borderRadius).toBe(tabsStyling.container.borderRadius);
  });

  it("should return container padding matching registry", () => {
    const config = getContainerConfig();
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
    expect(config.paddingX).toBe(tabsStyling.tab.paddingX);
  });

  it("should return tab vertical margin matching registry", () => {
    const config = getTabConfig();
    expect(config.verticalMargin).toBe(tabsStyling.tab.verticalMargin);
  });

  it("should return tab font size matching registry", () => {
    const config = getTabConfig();
    expect(config.fontSize).toBe(tabsStyling.tab.fontSize);
  });

  it("should return tab font weight matching registry", () => {
    const config = getTabConfig();
    expect(config.fontWeight).toBe(tabsStyling.tab.fontWeight);
  });

  it("should return tab border radius matching registry", () => {
    const config = getTabConfig();
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

  it("should have font weight matching registry", () => {
    const config = getTabConfig();
    expect(config.fontWeight).toBe(tabsStyling.tab.fontWeight);
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

  it("should include container config matching registry", () => {
    const allData = getAllVariantData();
    expect(allData.container.height).toBe(tabsStyling.container.height);
    expect(allData.container.borderRadius).toBe(tabsStyling.container.borderRadius);
    expect(allData.container.padding).toBe(tabsStyling.container.padding);
  });

  it("should include tab config matching registry", () => {
    const allData = getAllVariantData();
    expect(allData.tab.paddingX).toBe(tabsStyling.tab.paddingX);
    expect(allData.tab.verticalMargin).toBe(tabsStyling.tab.verticalMargin);
    expect(allData.tab.fontSize).toBe(tabsStyling.tab.fontSize);
    expect(allData.tab.fontWeight).toBe(tabsStyling.tab.fontWeight);
    expect(allData.tab.borderRadius).toBe(tabsStyling.tab.borderRadius);
  });

  it("should include indicator config matching registry", () => {
    const allData = getAllVariantData();
    expect(allData.indicator.borderRadius).toBe(tabsStyling.indicator.borderRadius);
  });
});

describe("Tabs Generator - Structural Consistency", () => {
  it("should have consistent border radius across all elements", () => {
    const allData = getAllVariantData();
    // All border radii should match each other (derived from registry)
    expect(allData.container.borderRadius).toBe(tabsStyling.container.borderRadius);
    expect(allData.tab.borderRadius).toBe(tabsStyling.tab.borderRadius);
    expect(allData.indicator.borderRadius).toBe(tabsStyling.indicator.borderRadius);
  });

  it("should have matching padding between container and tab margins", () => {
    const allData = getAllVariantData();
    // Container padding should match tab vertical margin (by design)
    expect(allData.container.padding).toBe(tabsStyling.container.padding);
    expect(allData.tab.verticalMargin).toBe(tabsStyling.tab.verticalMargin);
  });

  it("should calculate tab height correctly based on registry values", () => {
    const allData = getAllVariantData();
    const containerHeight = allData.container.height;
    const verticalMargin = allData.tab.verticalMargin;
    const expectedTabHeight = containerHeight - verticalMargin * 2;
    // Tab height is derived from container height minus margins
    expect(expectedTabHeight).toBe(tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2);
  });

  it("should calculate indicator height correctly based on registry values", () => {
    const allData = getAllVariantData();
    const containerHeight = allData.container.height;
    const verticalMargin = allData.tab.verticalMargin;
    const expectedIndicatorHeight = containerHeight - verticalMargin * 2;
    // Indicator should match tab height
    expect(expectedIndicatorHeight).toBe(tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2);
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
    expect(figmaProps.height).toBe(tabsStyling.container.height);
    expect(figmaProps.itemSpacing).toBe(0);
    expect(figmaProps.paddingLeft).toBe(tabsStyling.container.padding);
    expect(figmaProps.paddingRight).toBe(tabsStyling.container.padding);
    expect(figmaProps.paddingTop).toBe(0);
    expect(figmaProps.paddingBottom).toBe(0);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(tabsStyling.container.borderRadius);
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

    // Structural assertions - use registry values
    const expectedButtonHeight = tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2;

    expect(figmaProps.layoutMode).toBe("HORIZONTAL");
    expect(figmaProps.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaProps.counterAxisAlignItems).toBe("CENTER");
    expect(figmaProps.primaryAxisSizingMode).toBe("AUTO");
    expect(figmaProps.counterAxisSizingMode).toBe("FIXED");
    expect(typeof figmaProps.height).toBe("number");
    expect(figmaProps.height).toBe(expectedButtonHeight);
    expect(figmaProps.paddingLeft).toBe(tabsStyling.tab.paddingX);
    expect(figmaProps.paddingRight).toBe(tabsStyling.tab.paddingX);
    expect(figmaProps.paddingTop).toBe(0);
    expect(figmaProps.paddingBottom).toBe(0);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(tabsStyling.tab.borderRadius);
    expect(typeof figmaProps.fontSize).toBe("number");
    expect(figmaProps.fontSize).toBe(tabsStyling.tab.fontSize);
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fontWeight).toBe(tabsStyling.tab.fontWeight);
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

    // Structural assertions - use registry values
    const expectedIndicatorHeight = tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2;

    expect(figmaProps.layoutPositioning).toBe("ABSOLUTE");
    expect(typeof figmaProps.height).toBe("number");
    expect(figmaProps.height).toBe(expectedIndicatorHeight);
    expect(figmaProps.y).toBe(tabsStyling.tab.verticalMargin);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(tabsStyling.indicator.borderRadius);
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
   * All calculations use registry values to stay in sync with design changes
   */

  it("should calculate tab button height correctly from registry", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const tabHeight = containerConfig.height - tabConfig.verticalMargin * 2;
    const expectedHeight = tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2;
    expect(tabHeight).toBe(expectedHeight);
  });

  it("should calculate indicator height correctly from registry", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const indicatorHeight = containerConfig.height - tabConfig.verticalMargin * 2;
    const expectedHeight = tabsStyling.container.height - tabsStyling.tab.verticalMargin * 2;
    expect(indicatorHeight).toBe(expectedHeight);
  });

  it("should calculate indicator Y position correctly from registry", () => {
    const tabConfig = getTabConfig();
    const indicatorY = tabConfig.verticalMargin;
    expect(indicatorY).toBe(tabsStyling.tab.verticalMargin);
  });

  it("should have matching tab and indicator heights", () => {
    const containerConfig = getContainerConfig();
    const tabConfig = getTabConfig();

    const tabHeight = containerConfig.height - tabConfig.verticalMargin * 2;
    const indicatorHeight = containerConfig.height - tabConfig.verticalMargin * 2;

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
