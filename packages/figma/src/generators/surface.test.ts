/**
 * Tests for surface.ts generator
 *
 * These tests ensure the Surface Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the surface
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * surface.tsx → component-registry.json → surface.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getSurfaceDimensionsConfig,
  getSurfaceColorBindings,
  getSurfaceShadowConfig,
  getSurfaceParsedBaseStyles,
  getAllSurfaceData,
} from "./surface";

// Import registry as source of truth
import registry from "../../../kumo/ai/component-registry.json";

const surfaceComponent = registry.components.Surface;
const surfaceProps = surfaceComponent.props;
const colorProp = surfaceProps.color as {
  values: string[];
  descriptions: Record<string, string>;
  default: string;
};

describe("Surface Generator - Registry Validation", () => {
  it("should have Surface component in registry", () => {
    expect(surfaceComponent).toBeDefined();
    expect(surfaceComponent.name).toBe("Surface");
    expect(surfaceComponent.category).toBe("Layout");
  });

  it("should have color prop with values in registry", () => {
    expect(colorProp).toBeDefined();
    expect(Array.isArray(colorProp.values)).toBe(true);
    expect(colorProp.values.length).toBeGreaterThan(0);
  });

  it("should have descriptions defined for all color variants", () => {
    for (const color of colorProp.values) {
      expect(colorProp.descriptions[color]).toBeDefined();
      expect(typeof colorProp.descriptions[color]).toBe("string");
      expect(colorProp.descriptions[color].length).toBeGreaterThan(0);
    }
  });

  it("should have a default color variant", () => {
    expect(colorProp.default).toBeDefined();
    expect(typeof colorProp.default).toBe("string");
    expect(colorProp.values).toContain(colorProp.default);
  });
});

describe("Surface Generator - Dimensions Configuration", () => {
  it("should have dimensions configuration defined", () => {
    const dimensions = getSurfaceDimensionsConfig();
    expect(dimensions).toBeDefined();
    expect(typeof dimensions).toBe("object");
  });

  it("should have padding values defined", () => {
    const dimensions = getSurfaceDimensionsConfig();
    expect(typeof dimensions.paddingLeft).toBe("number");
    expect(typeof dimensions.paddingRight).toBe("number");
    expect(typeof dimensions.paddingTop).toBe("number");
    expect(typeof dimensions.paddingBottom).toBe("number");
    expect(dimensions.paddingLeft).toBeGreaterThan(0);
    expect(dimensions.paddingRight).toBeGreaterThan(0);
    expect(dimensions.paddingTop).toBeGreaterThan(0);
    expect(dimensions.paddingBottom).toBeGreaterThan(0);
  });

  it("should have item spacing defined", () => {
    const dimensions = getSurfaceDimensionsConfig();
    expect(typeof dimensions.itemSpacing).toBe("number");
    expect(dimensions.itemSpacing).toBeGreaterThanOrEqual(0);
  });

  it("should have corner radius defined", () => {
    const dimensions = getSurfaceDimensionsConfig();
    expect(typeof dimensions.cornerRadius).toBe("number");
    expect(dimensions.cornerRadius).toBeGreaterThan(0);
  });
});

describe("Surface Generator - Color Bindings", () => {
  it("should have color bindings defined", () => {
    const colorBindings = getSurfaceColorBindings();
    expect(colorBindings).toBeDefined();
    expect(typeof colorBindings).toBe("object");
  });

  it("should have background color binding", () => {
    const colorBindings = getSurfaceColorBindings();
    expect(colorBindings.background).toBeDefined();
    expect(typeof colorBindings.background).toBe("string");
    expect(colorBindings.background.length).toBeGreaterThan(0);
  });

  it("should have border color binding", () => {
    const colorBindings = getSurfaceColorBindings();
    expect(colorBindings.border).toBeDefined();
    expect(typeof colorBindings.border).toBe("string");
    expect(colorBindings.border.length).toBeGreaterThan(0);
  });

  it("should have text color binding", () => {
    const colorBindings = getSurfaceColorBindings();
    expect(colorBindings.text).toBeDefined();
    expect(typeof colorBindings.text).toBe("string");
    expect(colorBindings.text.length).toBeGreaterThan(0);
  });
});

describe("Surface Generator - Shadow Configuration", () => {
  it("should have shadow configuration defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(shadowConfig).toBeDefined();
    expect(typeof shadowConfig).toBe("object");
  });

  it("should have shadow type defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(shadowConfig.type).toBe("DROP_SHADOW");
  });

  it("should have shadow color defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(shadowConfig.color).toBeDefined();
    expect(typeof shadowConfig.color).toBe("object");
    expect(typeof shadowConfig.color.r).toBe("number");
    expect(typeof shadowConfig.color.g).toBe("number");
    expect(typeof shadowConfig.color.b).toBe("number");
    expect(typeof shadowConfig.color.a).toBe("number");
  });

  it("should have shadow offset defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(shadowConfig.offset).toBeDefined();
    expect(typeof shadowConfig.offset.x).toBe("number");
    expect(typeof shadowConfig.offset.y).toBe("number");
  });

  it("should have shadow radius defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(typeof shadowConfig.radius).toBe("number");
    expect(shadowConfig.radius).toBeGreaterThanOrEqual(0);
  });

  it("should have shadow spread defined", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(typeof shadowConfig.spread).toBe("number");
  });
});

describe("Surface Generator - Base Styles Parsing", () => {
  it("should parse base styles without errors", () => {
    const parsed = getSurfaceParsedBaseStyles();
    expect(parsed).toBeDefined();
    expect(typeof parsed).toBe("object");
  });

  it("should have stroke variable from ring border", () => {
    const parsed = getSurfaceParsedBaseStyles();
    // ring ring-border should parse to strokeVariable
    expect(parsed.strokeVariable !== undefined || parsed.strokeWeight !== undefined).toBe(true);
  });
});

describe("Surface Generator - Complete Data Structure", () => {
  it("should have complete data structure defined", () => {
    const allData = getAllSurfaceData();
    expect(allData).toBeDefined();
    expect(typeof allData).toBe("object");
  });

  it("should have base styles section", () => {
    const allData = getAllSurfaceData();
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(typeof allData.baseStyles.raw).toBe("string");
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(typeof allData.baseStyles.parsed).toBe("object");
  });

  it("should have dimensions section", () => {
    const allData = getAllSurfaceData();
    expect(allData.dimensions).toBeDefined();
    expect(typeof allData.dimensions).toBe("object");
    expect(typeof allData.dimensions.paddingLeft).toBe("number");
  });

  it("should have color bindings section", () => {
    const allData = getAllSurfaceData();
    expect(allData.colorBindings).toBeDefined();
    expect(typeof allData.colorBindings).toBe("object");
    expect(typeof allData.colorBindings.background).toBe("string");
  });

  it("should have shadow config section", () => {
    const allData = getAllSurfaceData();
    expect(allData.shadowConfig).toBeDefined();
    expect(typeof allData.shadowConfig).toBe("object");
    expect(allData.shadowConfig.type).toBe("DROP_SHADOW");
  });

  it("should have content text section", () => {
    const allData = getAllSurfaceData();
    expect(allData.contentText).toBeDefined();
    expect(typeof allData.contentText.text).toBe("string");
    expect(typeof allData.contentText.fontSize).toBe("number");
    expect(typeof allData.contentText.fontWeight).toBe("number");
  });
});

describe("Surface Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, dimensions,
   * color bindings) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    surface.tsx → component-registry.json → surface.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Surface component styles changed in surface.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent dimensions configuration", () => {
    const dimensions = getSurfaceDimensionsConfig();
    expect(dimensions).toMatchSnapshot();
  });

  it("should produce consistent color bindings", () => {
    const colorBindings = getSurfaceColorBindings();
    expect(colorBindings).toMatchSnapshot();
  });

  it("should produce consistent shadow configuration", () => {
    const shadowConfig = getSurfaceShadowConfig();
    expect(shadowConfig).toMatchSnapshot();
  });

  it("should produce consistent parsed base styles", () => {
    const parsed = getSurfaceParsedBaseStyles();
    expect(parsed).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * surface.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data (golden path)", () => {
    const allData = getAllSurfaceData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.dimensions).toBeDefined();
    expect(allData.colorBindings).toBeDefined();
    expect(allData.shadowConfig).toBeDefined();
    expect(allData.contentText).toBeDefined();

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
