/**
 * Tests for toast.ts component generator
 *
 * These tests ensure the Toast Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the toast
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * toast.tsx → component-registry.json → toast.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getContainerConfig,
  getTitleConfig,
  getDescriptionConfig,
  getCloseButtonConfig,
  getAllVariantData,
} from "./toast";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const toastComponent = (registry.components as any).Toasty;
const toastStyling = toastComponent.styling;

describe("Toast Generator - Registry Validation", () => {
  it("should have Toasty component in registry", () => {
    expect(toastComponent).toBeDefined();
    expect(toastComponent.name).toBe("Toasty");
  });

  it("should have styling metadata defined", () => {
    expect(toastStyling).toBeDefined();
    expect(toastStyling.container).toBeDefined();
    expect(toastStyling.title).toBeDefined();
    expect(toastStyling.description).toBeDefined();
    expect(toastStyling.closeButton).toBeDefined();
  });
});

describe("Toast Generator - Container Styling Validation", () => {
  it("should have container width defined", () => {
    expect(toastStyling.container.width).toBeDefined();
    expect(typeof toastStyling.container.width).toBe("number");
    expect(toastStyling.container.width).toBe(300);
  });

  it("should have container padding defined", () => {
    expect(toastStyling.container.padding).toBeDefined();
    expect(typeof toastStyling.container.padding).toBe("number");
    expect(toastStyling.container.padding).toBe(16);
  });

  it("should have container borderRadius defined", () => {
    expect(toastStyling.container.borderRadius).toBeDefined();
    expect(typeof toastStyling.container.borderRadius).toBe("number");
    expect(toastStyling.container.borderRadius).toBe(8);
  });

  it("should have container background token defined", () => {
    expect(toastStyling.container.background).toBeDefined();
    expect(typeof toastStyling.container.background).toBe("string");
    expect(toastStyling.container.background).toBe("color-toast");
  });

  it("should have container border token defined", () => {
    expect(toastStyling.container.border).toBeDefined();
    expect(typeof toastStyling.container.border).toBe("string");
    expect(toastStyling.container.border).toBe("color-color");
  });

  it("should have container shadow defined", () => {
    expect(toastStyling.container.shadow).toBeDefined();
    expect(typeof toastStyling.container.shadow).toBe("string");
    expect(toastStyling.container.shadow).toBe("shadow-lg");
  });

  it("should have container gap defined", () => {
    expect(toastStyling.container.gap).toBeDefined();
    expect(typeof toastStyling.container.gap).toBe("number");
    expect(toastStyling.container.gap).toBe(4);
  });
});

describe("Toast Generator - Title Styling Validation", () => {
  it("should have title fontSize defined", () => {
    expect(toastStyling.title.fontSize).toBeDefined();
    expect(typeof toastStyling.title.fontSize).toBe("number");
    expect(toastStyling.title.fontSize).toBe(16);
  });

  it("should have title fontWeight defined", () => {
    expect(toastStyling.title.fontWeight).toBeDefined();
    expect(typeof toastStyling.title.fontWeight).toBe("number");
    expect(toastStyling.title.fontWeight).toBe(500);
  });

  it("should have title color token defined", () => {
    expect(toastStyling.title.color).toBeDefined();
    expect(typeof toastStyling.title.color).toBe("string");
    expect(toastStyling.title.color).toBe("text-color-surface");
  });
});

describe("Toast Generator - Description Styling Validation", () => {
  it("should have description fontSize defined", () => {
    expect(toastStyling.description.fontSize).toBeDefined();
    expect(typeof toastStyling.description.fontSize).toBe("number");
    expect(toastStyling.description.fontSize).toBe(15);
  });

  it("should have description fontWeight defined", () => {
    expect(toastStyling.description.fontWeight).toBeDefined();
    expect(typeof toastStyling.description.fontWeight).toBe("number");
    expect(toastStyling.description.fontWeight).toBe(400);
  });

  it("should have description color token defined", () => {
    expect(toastStyling.description.color).toBeDefined();
    expect(typeof toastStyling.description.color).toBe("string");
    expect(toastStyling.description.color).toBe("text-color-muted");
  });
});

describe("Toast Generator - Close Button Styling Validation", () => {
  it("should have closeButton size defined", () => {
    expect(toastStyling.closeButton.size).toBeDefined();
    expect(typeof toastStyling.closeButton.size).toBe("number");
    expect(toastStyling.closeButton.size).toBe(20);
  });

  it("should have closeButton iconSize defined", () => {
    expect(toastStyling.closeButton.iconSize).toBeDefined();
    expect(typeof toastStyling.closeButton.iconSize).toBe("number");
    expect(toastStyling.closeButton.iconSize).toBe(16);
  });

  it("should have closeButton iconName defined", () => {
    expect(toastStyling.closeButton.iconName).toBeDefined();
    expect(typeof toastStyling.closeButton.iconName).toBe("string");
    expect(toastStyling.closeButton.iconName).toBe("ph-x");
  });

  it("should have closeButton iconColor token defined", () => {
    expect(toastStyling.closeButton.iconColor).toBeDefined();
    expect(typeof toastStyling.closeButton.iconColor).toBe("string");
    expect(toastStyling.closeButton.iconColor).toBe("text-color-muted");
  });

  it("should have closeButton hoverBackground token defined", () => {
    expect(toastStyling.closeButton.hoverBackground).toBeDefined();
    expect(typeof toastStyling.closeButton.hoverBackground).toBe("string");
    expect(toastStyling.closeButton.hoverBackground).toBe(
      "color-toast-button-hover",
    );
  });

  it("should have closeButton hoverColor token defined", () => {
    expect(toastStyling.closeButton.hoverColor).toBeDefined();
    expect(typeof toastStyling.closeButton.hoverColor).toBe("string");
    expect(toastStyling.closeButton.hoverColor).toBe("text-color-label");
  });

  it("should have closeButton borderRadius defined", () => {
    expect(toastStyling.closeButton.borderRadius).toBeDefined();
    expect(typeof toastStyling.closeButton.borderRadius).toBe("number");
    expect(toastStyling.closeButton.borderRadius).toBe(4);
  });
});

describe("Toast Generator - Testable Export Functions", () => {
  describe("getContainerConfig", () => {
    it("should return container config from registry", () => {
      const config = getContainerConfig();
      expect(config).toBeDefined();
      expect(config.raw).toBeDefined();
      expect(config.width).toBe(300);
      expect(config.padding).toBe(FONT_SIZE.base);
      expect(config.borderRadius).toBe(8);
      expect(config.background).toBe("color-toast");
      expect(config.border).toBe("color-color");
      expect(config.shadow).toBe("shadow-lg");
      expect(config.gap).toBe(4);
    });

    it("should have all required properties", () => {
      const config = getContainerConfig();
      expect(config).toHaveProperty("raw");
      expect(config).toHaveProperty("width");
      expect(config).toHaveProperty("padding");
      expect(config).toHaveProperty("borderRadius");
      expect(config).toHaveProperty("background");
      expect(config).toHaveProperty("border");
      expect(config).toHaveProperty("shadow");
      expect(config).toHaveProperty("gap");
    });

    it("should return numeric values for dimensions", () => {
      const config = getContainerConfig();
      expect(typeof config.width).toBe("number");
      expect(typeof config.padding).toBe("number");
      expect(typeof config.borderRadius).toBe("number");
      expect(typeof config.gap).toBe("number");
    });

    it("should return string values for color tokens", () => {
      const config = getContainerConfig();
      expect(typeof config.background).toBe("string");
      expect(typeof config.border).toBe("string");
      expect(typeof config.shadow).toBe("string");
    });
  });

  describe("getTitleConfig", () => {
    it("should return title config from registry", () => {
      const config = getTitleConfig();
      expect(config).toBeDefined();
      expect(config.raw).toBeDefined();
      expect(config.fontSize).toBe(FONT_SIZE.base);
      expect(config.fontWeight).toBe(FALLBACK_VALUES.fontWeight.medium);
      expect(config.color).toBe("text-color-surface");
    });

    it("should have all required properties", () => {
      const config = getTitleConfig();
      expect(config).toHaveProperty("raw");
      expect(config).toHaveProperty("fontSize");
      expect(config).toHaveProperty("fontWeight");
      expect(config).toHaveProperty("color");
    });

    it("should return numeric values for typography", () => {
      const config = getTitleConfig();
      expect(typeof config.fontSize).toBe("number");
      expect(typeof config.fontWeight).toBe("number");
    });

    it("should return string value for color token", () => {
      const config = getTitleConfig();
      expect(typeof config.color).toBe("string");
    });
  });

  describe("getDescriptionConfig", () => {
    it("should return description config from registry", () => {
      const config = getDescriptionConfig();
      expect(config).toBeDefined();
      expect(config.raw).toBeDefined();
      expect(config.fontSize).toBe(15); // Toast description uses 15px, not a standard FONT_SIZE
      expect(config.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
      expect(config.color).toBe("text-color-muted");
    });

    it("should have all required properties", () => {
      const config = getDescriptionConfig();
      expect(config).toHaveProperty("raw");
      expect(config).toHaveProperty("fontSize");
      expect(config).toHaveProperty("fontWeight");
      expect(config).toHaveProperty("color");
    });

    it("should return numeric values for typography", () => {
      const config = getDescriptionConfig();
      expect(typeof config.fontSize).toBe("number");
      expect(typeof config.fontWeight).toBe("number");
    });

    it("should return string value for color token", () => {
      const config = getDescriptionConfig();
      expect(typeof config.color).toBe("string");
    });
  });

  describe("getCloseButtonConfig", () => {
    it("should return close button config from registry", () => {
      const config = getCloseButtonConfig();
      expect(config).toBeDefined();
      expect(config.raw).toBeDefined();
      expect(config.size).toBe(FONT_SIZE.lg);
      expect(config.iconSize).toBe(FONT_SIZE.base);
      expect(config.iconName).toBe("ph-x");
      expect(config.iconColor).toBe("text-color-muted");
      expect(config.hoverBackground).toBe("color-toast-button-hover");
      expect(config.hoverColor).toBe("text-color-label");
      expect(config.borderRadius).toBe(4);
    });

    it("should have all required properties", () => {
      const config = getCloseButtonConfig();
      expect(config).toHaveProperty("raw");
      expect(config).toHaveProperty("size");
      expect(config).toHaveProperty("iconSize");
      expect(config).toHaveProperty("iconName");
      expect(config).toHaveProperty("iconColor");
      expect(config).toHaveProperty("hoverBackground");
      expect(config).toHaveProperty("hoverColor");
      expect(config).toHaveProperty("borderRadius");
    });

    it("should return numeric values for dimensions", () => {
      const config = getCloseButtonConfig();
      expect(typeof config.size).toBe("number");
      expect(typeof config.iconSize).toBe("number");
      expect(typeof config.borderRadius).toBe("number");
    });

    it("should return string values for icon and color tokens", () => {
      const config = getCloseButtonConfig();
      expect(typeof config.iconName).toBe("string");
      expect(typeof config.iconColor).toBe("string");
      expect(typeof config.hoverBackground).toBe("string");
      expect(typeof config.hoverColor).toBe("string");
    });
  });

  describe("getAllVariantData", () => {
    it("should return complete data structure", () => {
      const allData = getAllVariantData();
      expect(allData).toBeDefined();
      expect(allData.styling).toBeDefined();
      expect(allData.container).toBeDefined();
      expect(allData.title).toBeDefined();
      expect(allData.description).toBeDefined();
      expect(allData.closeButton).toBeDefined();
    });

    it("should include all styling sections", () => {
      const allData = getAllVariantData();
      expect(allData.styling.container).toBeDefined();
      expect(allData.styling.title).toBeDefined();
      expect(allData.styling.description).toBeDefined();
      expect(allData.styling.closeButton).toBeDefined();
    });

    it("should include parsed container config", () => {
      const allData = getAllVariantData();
      expect(allData.container.width).toBe(300); // Toast-specific width
      expect(allData.container.padding).toBe(FONT_SIZE.base);
      expect(allData.container.borderRadius).toBe(8);
      expect(allData.container.background).toBe("color-toast");
      expect(allData.container.border).toBe("color-color");
    });

    it("should include parsed title config", () => {
      const allData = getAllVariantData();
      expect(allData.title.fontSize).toBe(FONT_SIZE.base);
      expect(allData.title.fontWeight).toBe(FALLBACK_VALUES.fontWeight.medium);
      expect(allData.title.color).toBe("text-color-surface");
    });

    it("should include parsed description config", () => {
      const allData = getAllVariantData();
      expect(allData.description.fontSize).toBe(15); // Toast description uses 15px, not a standard FONT_SIZE
      expect(allData.description.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
      expect(allData.description.color).toBe("text-color-muted");
    });

    it("should include parsed close button config", () => {
      const allData = getAllVariantData();
      expect(allData.closeButton.size).toBe(FONT_SIZE.lg);
      expect(allData.closeButton.iconSize).toBe(FONT_SIZE.base);
      expect(allData.closeButton.iconName).toBe("ph-x");
      expect(allData.closeButton.iconColor).toBe("text-color-muted");
    });
  });
});

describe("Toast Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in Toast component are
   * properly defined and accessible from registry.
   */

  it("should have color-toast background token", () => {
    const config = getContainerConfig();
    expect(config.background).toBe("color-toast");
  });

  it("should have color-color border token", () => {
    const config = getContainerConfig();
    expect(config.border).toBe("color-color");
  });

  it("should have text-color-surface for title", () => {
    const config = getTitleConfig();
    expect(config.color).toBe("text-color-surface");
  });

  it("should have text-color-muted for description and close button", () => {
    const titleConfig = getDescriptionConfig();
    const buttonConfig = getCloseButtonConfig();
    expect(titleConfig.color).toBe("text-color-muted");
    expect(buttonConfig.iconColor).toBe("text-color-muted");
  });

  it("should have color-toast-button-hover for hover state", () => {
    const config = getCloseButtonConfig();
    expect(config.hoverBackground).toBe("color-toast-button-hover");
  });

  it("should have text-color-label for hover text color", () => {
    const config = getCloseButtonConfig();
    expect(config.hoverColor).toBe("text-color-label");
  });
});

describe("Toast Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   * Structural assertions ensure properties exist and have correct types.
   */

  it("should produce correct Figma properties for toast container", () => {
    const containerConfig = getContainerConfig();

    // Expected Figma component properties - structural checks
    const figmaProps = {
      layoutMode: "VERTICAL",
      width: containerConfig.width,
      padding: containerConfig.padding,
      cornerRadius: containerConfig.borderRadius,
      itemSpacing: containerConfig.gap,
      backgroundVariable: containerConfig.background,
      borderVariable: containerConfig.border,
    };

    // Structural assertions
    expect(figmaProps.layoutMode).toBe("VERTICAL");
    expect(typeof figmaProps.width).toBe("number");
    expect(figmaProps.width).toBe(300); // Toast-specific width
    expect(typeof figmaProps.padding).toBe("number");
    expect(figmaProps.padding).toBe(FONT_SIZE.base);
    expect(typeof figmaProps.cornerRadius).toBe("number");
    expect(figmaProps.cornerRadius).toBe(8);
    expect(typeof figmaProps.itemSpacing).toBe("number");
    expect(figmaProps.itemSpacing).toBe(4);
    expect(typeof figmaProps.backgroundVariable).toBe("string");
    expect(typeof figmaProps.borderVariable).toBe("string");
  });

  it("should produce correct Figma properties for toast title", () => {
    const titleConfig = getTitleConfig();

    const figmaProps = {
      fontSize: titleConfig.fontSize,
      fontWeight: titleConfig.fontWeight,
      textVariable: titleConfig.color,
    };

    expect(typeof figmaProps.fontSize).toBe("number");
    expect(figmaProps.fontSize).toBe(FONT_SIZE.base);
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fontWeight).toBe(FALLBACK_VALUES.fontWeight.medium);
    expect(typeof figmaProps.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for toast description", () => {
    const descConfig = getDescriptionConfig();

    const figmaProps = {
      fontSize: descConfig.fontSize,
      fontWeight: descConfig.fontWeight,
      textVariable: descConfig.color,
    };

    expect(typeof figmaProps.fontSize).toBe("number");
    expect(figmaProps.fontSize).toBe(15); // Toast description uses 15px, not a standard FONT_SIZE
    expect(typeof figmaProps.fontWeight).toBe("number");
    expect(figmaProps.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
    expect(typeof figmaProps.textVariable).toBe("string");
  });

  it("should produce correct Figma properties for close button (full chain)", () => {
    const buttonConfig = getCloseButtonConfig();

    // Test full chain: registry → parser → expected Figma properties
    const figmaProps = {
      size: buttonConfig.size,
      iconSize: buttonConfig.iconSize,
      iconName: buttonConfig.iconName,
      iconColor: buttonConfig.iconColor,
      hoverBackground: buttonConfig.hoverBackground,
      hoverColor: buttonConfig.hoverColor,
      borderRadius: buttonConfig.borderRadius,
    };

    // Structural assertions
    expect(typeof figmaProps.size).toBe("number");
    expect(figmaProps.size).toBe(FONT_SIZE.lg);
    expect(typeof figmaProps.iconSize).toBe("number");
    expect(figmaProps.iconSize).toBe(FONT_SIZE.base);
    expect(typeof figmaProps.iconName).toBe("string");
    expect(figmaProps.iconName).toBe("ph-x");
    expect(typeof figmaProps.iconColor).toBe("string");
    expect(typeof figmaProps.hoverBackground).toBe("string");
    expect(typeof figmaProps.hoverColor).toBe("string");
    expect(typeof figmaProps.borderRadius).toBe("number");
    expect(figmaProps.borderRadius).toBe(4);
  });
});

describe("Toast Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (styling configs, layout calculations)
   * BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    toast.tsx → component-registry.json → toast.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Toast component styles changed in toast.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent container config from registry", () => {
    const config = getContainerConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent title config from registry", () => {
    const config = getTitleConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent description config from registry", () => {
    const config = getDescriptionConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent close button config from registry", () => {
    const config = getCloseButtonConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * toast.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all styling (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.styling).toBeDefined();
    expect(allData.container).toBeDefined();
    expect(allData.title).toBeDefined();
    expect(allData.description).toBeDefined();
    expect(allData.closeButton).toBeDefined();

    // Verify container has complete data
    expect(allData.container.width).toBeDefined();
    expect(allData.container.padding).toBeDefined();
    expect(allData.container.borderRadius).toBeDefined();
    expect(allData.container.background).toBeDefined();
    expect(allData.container.border).toBeDefined();
    expect(allData.container.shadow).toBeDefined();
    expect(allData.container.gap).toBeDefined();

    // Verify title has complete data
    expect(allData.title.fontSize).toBeDefined();
    expect(allData.title.fontWeight).toBeDefined();
    expect(allData.title.color).toBeDefined();

    // Verify description has complete data
    expect(allData.description.fontSize).toBeDefined();
    expect(allData.description.fontWeight).toBeDefined();
    expect(allData.description.color).toBeDefined();

    // Verify close button has complete data
    expect(allData.closeButton.size).toBeDefined();
    expect(allData.closeButton.iconSize).toBeDefined();
    expect(allData.closeButton.iconName).toBeDefined();
    expect(allData.closeButton.iconColor).toBeDefined();
    expect(allData.closeButton.hoverBackground).toBeDefined();
    expect(allData.closeButton.hoverColor).toBeDefined();
    expect(allData.closeButton.borderRadius).toBeDefined();

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
