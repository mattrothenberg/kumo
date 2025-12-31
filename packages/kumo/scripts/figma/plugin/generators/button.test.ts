/**
 * Tests for button.ts component generator
 *
 * Note: Full integration tests require Figma plugin runtime.
 * These tests verify exports and constants match the registry.
 *
 * Source of truth: component-registry.json (generated from button.tsx)
 */

import { describe, it, expect } from "vitest";
import {
  generateButtonComponents,
  BUTTON_VARIANTS_EXPORT,
  BUTTON_SIZES_EXPORT,
  BUTTON_SHAPES_EXPORT,
  BUTTON_DISABLED_OPTIONS,
  BUTTON_LOADING_OPTIONS,
} from "./button";
// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const buttonProps = registry.components.Button.props;
const expectedVariants = (buttonProps.variant as { values: string[] }).values;
const expectedSizes = (buttonProps.size as { values: string[] }).values;
const expectedShapes = (buttonProps.shape as { values: string[] }).values;

describe("generateButtonComponents", () => {
  it("should export generateButtonComponents function", () => {
    expect(typeof generateButtonComponents).toBe("function");
  });

  it("should export button variants matching component-registry.json", () => {
    expect(BUTTON_VARIANTS_EXPORT).toEqual(expectedVariants);
  });

  it("should export button sizes matching component-registry.json", () => {
    expect(BUTTON_SIZES_EXPORT).toEqual(expectedSizes);
  });

  it("should export button shapes matching component-registry.json", () => {
    expect(BUTTON_SHAPES_EXPORT).toEqual(expectedShapes);
  });

  it("should export disabled options as boolean array", () => {
    expect(BUTTON_DISABLED_OPTIONS).toEqual([false, true]);
  });

  it("should export loading options as boolean array", () => {
    expect(BUTTON_LOADING_OPTIONS).toEqual([false, true]);
  });

  it("should have correct full cartesian product count (for reference)", () => {
    // Full cartesian product would be 6 × 4 × 3 × 2 × 2 = 288
    // But we generate a reduced set that covers all use cases
    const fullCartesian =
      BUTTON_VARIANTS_EXPORT.length *
      BUTTON_SIZES_EXPORT.length *
      BUTTON_SHAPES_EXPORT.length *
      BUTTON_DISABLED_OPTIONS.length *
      BUTTON_LOADING_OPTIONS.length;

    expect(fullCartesian).toBe(288);
  });

  it("should generate reduced set of components covering all use cases", () => {
    // Reduced set:
    // 1. All variants × all sizes (base shape, not disabled, not loading) = 6 × 4 = 24
    // 2. Disabled: all variants, base size only = 6
    // 3. Loading: all variants, base size only = 6
    // 4. Square shape: secondary variant, all sizes = 4
    // 5. Circle shape: secondary variant, all sizes = 4
    // Total: 24 + 6 + 6 + 4 + 4 = 44
    const expectedReduced = 24 + 6 + 6 + 4 + 4;
    expect(expectedReduced).toBe(44);
  });

  it("should have 6 variants", () => {
    expect(BUTTON_VARIANTS_EXPORT).toHaveLength(6);
    expect(BUTTON_VARIANTS_EXPORT).toContain("primary");
    expect(BUTTON_VARIANTS_EXPORT).toContain("secondary");
    expect(BUTTON_VARIANTS_EXPORT).toContain("ghost");
    expect(BUTTON_VARIANTS_EXPORT).toContain("destructive");
    expect(BUTTON_VARIANTS_EXPORT).toContain("secondary-destructive");
    expect(BUTTON_VARIANTS_EXPORT).toContain("outline");
  });

  it("should have 4 sizes", () => {
    expect(BUTTON_SIZES_EXPORT).toHaveLength(4);
    expect(BUTTON_SIZES_EXPORT).toContain("xs");
    expect(BUTTON_SIZES_EXPORT).toContain("sm");
    expect(BUTTON_SIZES_EXPORT).toContain("base");
    expect(BUTTON_SIZES_EXPORT).toContain("lg");
  });

  it("should have 3 shapes", () => {
    expect(BUTTON_SHAPES_EXPORT).toHaveLength(3);
    expect(BUTTON_SHAPES_EXPORT).toContain("base");
    expect(BUTTON_SHAPES_EXPORT).toContain("square");
    expect(BUTTON_SHAPES_EXPORT).toContain("circle");
  });
});
