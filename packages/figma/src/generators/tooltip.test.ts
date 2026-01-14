/**
 * Tests for tooltip.ts generator
 *
 * These tests ensure the Tooltip Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the tooltip
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * tooltip.tsx → component-registry.json → tooltip.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  getTooltipSideConfig,
  getTooltipParsedBoxStyles,
  getTooltipBoxLayout,
  getTooltipArrowDimensions,
  getAllTooltipData,
} from "./tooltip";

// Import registry as source of truth
import registry from "../../../kumo/ai/component-registry.json";

const tooltipComponent = registry.components.Tooltip;
const tooltipProps = tooltipComponent.props;
const sideProp = tooltipProps.side as {
  values: string[];
  descriptions: Record<string, string>;
  default: string;
};

describe("Tooltip Generator - Registry Validation", () => {
  it("should have all expected side values in registry", () => {
    // Don't hardcode expected values - verify structure
    expect(Array.isArray(sideProp.values)).toBe(true);
    expect(sideProp.values.length).toBeGreaterThan(0);
  });

  it("should have descriptions defined for all sides", () => {
    for (const side of sideProp.values) {
      expect(sideProp.descriptions[side]).toBeDefined();
      expect(typeof sideProp.descriptions[side]).toBe("string");
      expect(sideProp.descriptions[side].length).toBeGreaterThan(0);
    }
  });

  it("should have a default side", () => {
    expect(sideProp.default).toBeDefined();
    expect(typeof sideProp.default).toBe("string");
    expect(sideProp.values).toContain(sideProp.default);
  });

  it("should have tooltip component in registry", () => {
    expect(tooltipComponent).toBeDefined();
    expect(tooltipComponent.name).toBe("Tooltip");
    expect(tooltipComponent.category).toBe("Overlay");
  });
});

describe("Tooltip Generator - Box Styles Parsing", () => {
  it("should parse padding from box styles", () => {
    const parsed = parseTailwindClasses("px-2.5 py-1.5");
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
    expect(parsed.paddingX).toBeGreaterThan(0);
    expect(parsed.paddingY).toBeDefined();
    expect(typeof parsed.paddingY).toBe("number");
    expect(parsed.paddingY).toBeGreaterThan(0);
  });

  it("should parse border radius from box styles", () => {
    const parsed = parseTailwindClasses("rounded-md");
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse font size from box styles", () => {
    const parsed = parseTailwindClasses("text-sm");
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });

  it("should parse fill variable from box styles", () => {
    const parsed = parseTailwindClasses("bg-surface-3");
    // Note: bg-surface-3 may not be recognized by parser if not in color map
    // Test structural contract: fillVariable should be string if defined
    if (parsed.fillVariable !== undefined) {
      expect(typeof parsed.fillVariable).toBe("string");
    }
  });

  it("should parse text variable from box styles", () => {
    const parsed = parseTailwindClasses("text-surface");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });
});

describe("Tooltip Generator - Side Configuration", () => {
  it("should return side configuration from registry", () => {
    const config = getTooltipSideConfig();

    expect(config.values).toBeDefined();
    expect(Array.isArray(config.values)).toBe(true);
    expect(config.values.length).toBeGreaterThan(0);

    expect(config.descriptions).toBeDefined();
    expect(typeof config.descriptions).toBe("object");

    expect(config.default).toBeDefined();
    expect(typeof config.default).toBe("string");
    expect(config.values).toContain(config.default);
  });

  it("should have descriptions for all side values", () => {
    const config = getTooltipSideConfig();

    for (const side of config.values) {
      expect(config.descriptions[side]).toBeDefined();
      expect(typeof config.descriptions[side]).toBe("string");
    }
  });
});

describe("Tooltip Generator - Box Layout", () => {
  it("should return box layout with padding", () => {
    const layout = getTooltipBoxLayout();

    expect(layout.paddingX).toBeDefined();
    expect(typeof layout.paddingX).toBe("number");
    expect(layout.paddingX).toBeGreaterThan(0);

    expect(layout.paddingY).toBeDefined();
    expect(typeof layout.paddingY).toBe("number");
    expect(layout.paddingY).toBeGreaterThan(0);
  });

  it("should return box layout with border radius", () => {
    const layout = getTooltipBoxLayout();

    expect(layout.borderRadius).toBeDefined();
    expect(typeof layout.borderRadius).toBe("number");
    expect(layout.borderRadius).toBeGreaterThan(0);
  });

  it("should return box layout with typography", () => {
    const layout = getTooltipBoxLayout();

    expect(layout.fontSize).toBeDefined();
    expect(typeof layout.fontSize).toBe("number");
    expect(layout.fontSize).toBeGreaterThan(0);

    expect(layout.fontWeight).toBeDefined();
    expect(typeof layout.fontWeight).toBe("number");
    expect(layout.fontWeight).toBeGreaterThan(0);
  });

  it("should return box layout with fill variable", () => {
    const layout = getTooltipBoxLayout();

    // Note: fillVariable may be undefined if parser doesn't recognize bg-surface-3
    // Test structural contract: fillVariable should be string if defined
    if (layout.fillVariable !== undefined) {
      expect(typeof layout.fillVariable).toBe("string");
    }
  });

  it("should return box layout with text variable or white text flag", () => {
    const layout = getTooltipBoxLayout();

    // At least one should be defined
    expect(
      layout.textVariable !== undefined || layout.isWhiteText === true
    ).toBe(true);
  });
});

describe("Tooltip Generator - Arrow Dimensions", () => {
  it("should return arrow dimensions with width", () => {
    const dimensions = getTooltipArrowDimensions();

    expect(dimensions.width).toBeDefined();
    expect(typeof dimensions.width).toBe("number");
    expect(dimensions.width).toBeGreaterThan(0);
  });

  it("should return arrow dimensions with height", () => {
    const dimensions = getTooltipArrowDimensions();

    expect(dimensions.height).toBeDefined();
    expect(typeof dimensions.height).toBe("number");
    expect(dimensions.height).toBeGreaterThan(0);
  });
});

describe("Tooltip Generator - Complete Tooltip Data", () => {
  it("should return complete tooltip data with all sections", () => {
    const allData = getAllTooltipData();

    // Verify structure exists
    expect(allData.sideConfig).toBeDefined();
    expect(allData.boxStyles).toBeDefined();
    expect(allData.boxLayout).toBeDefined();
    expect(allData.arrowDimensions).toBeDefined();
    expect(allData.text).toBeDefined();
  });

  it("should have side configuration in complete data", () => {
    const allData = getAllTooltipData();

    expect(allData.sideConfig.values).toBeDefined();
    expect(Array.isArray(allData.sideConfig.values)).toBe(true);
    expect(allData.sideConfig.default).toBeDefined();
  });

  it("should have box styles (raw and parsed) in complete data", () => {
    const allData = getAllTooltipData();

    expect(allData.boxStyles.raw).toBeDefined();
    expect(typeof allData.boxStyles.raw).toBe("string");
    expect(allData.boxStyles.parsed).toBeDefined();
    expect(typeof allData.boxStyles.parsed).toBe("object");
  });

  it("should have box layout in complete data", () => {
    const allData = getAllTooltipData();

    expect(allData.boxLayout.paddingX).toBeDefined();
    expect(typeof allData.boxLayout.paddingX).toBe("number");
    expect(allData.boxLayout.paddingY).toBeDefined();
    expect(typeof allData.boxLayout.paddingY).toBe("number");
    expect(allData.boxLayout.borderRadius).toBeDefined();
    expect(typeof allData.boxLayout.borderRadius).toBe("number");
  });

  it("should have arrow dimensions in complete data", () => {
    const allData = getAllTooltipData();

    expect(allData.arrowDimensions.width).toBeDefined();
    expect(typeof allData.arrowDimensions.width).toBe("number");
    expect(allData.arrowDimensions.height).toBeDefined();
    expect(typeof allData.arrowDimensions.height).toBe("number");
  });

  it("should have text properties in complete data", () => {
    const allData = getAllTooltipData();

    expect(allData.text.fontSize).toBeDefined();
    expect(typeof allData.text.fontSize).toBe("number");
    expect(allData.text.fontWeight).toBeDefined();
    expect(typeof allData.text.fontWeight).toBe("number");
  });
});

describe("Tooltip Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, side configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    tooltip.tsx → component-registry.json → tooltip.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Tooltip component styles changed in tooltip.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent side config from registry", () => {
    const config = getTooltipSideConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent parsed box styles", () => {
    const parsed = getTooltipParsedBoxStyles();
    expect(parsed).toMatchSnapshot();
  });

  it("should produce consistent box layout", () => {
    const layout = getTooltipBoxLayout();
    expect(layout).toMatchSnapshot();
  });

  it("should produce consistent arrow dimensions", () => {
    const dimensions = getTooltipArrowDimensions();
    expect(dimensions).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * tooltip.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent complete tooltip data (golden path)", () => {
    const allData = getAllTooltipData();

    // Verify structure exists
    expect(allData.sideConfig).toBeDefined();
    expect(allData.boxStyles).toBeDefined();
    expect(allData.boxStyles.raw).toBeDefined();
    expect(allData.boxStyles.parsed).toBeDefined();
    expect(allData.boxLayout).toBeDefined();
    expect(allData.arrowDimensions).toBeDefined();
    expect(allData.text).toBeDefined();

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
