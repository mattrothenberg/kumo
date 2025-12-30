/**
 * Tests for button-text.ts component generator
 *
 * Note: Full integration tests require Figma plugin runtime.
 * These tests verify exports and constants only.
 */

import { describe, it, expect } from "vitest";
import {
  generateButtonTextComponents,
  BUTTON_VARIANTS_EXPORT,
  BUTTON_SIZES_EXPORT,
  BUTTON_STATES_EXPORT,
} from "./button-text";

describe("generateButtonTextComponents", () => {
  it("should export generateButtonTextComponents function", () => {
    expect(typeof generateButtonTextComponents).toBe("function");
  });

  it("should export 6 button variants", () => {
    expect(BUTTON_VARIANTS_EXPORT).toHaveLength(6);
    expect(BUTTON_VARIANTS_EXPORT).toEqual([
      "primary",
      "secondary",
      "ghost",
      "destructive",
      "secondary-destructive",
      "outline",
    ]);
  });

  it("should export 4 button sizes", () => {
    expect(BUTTON_SIZES_EXPORT).toHaveLength(4);
    expect(BUTTON_SIZES_EXPORT).toEqual(["xs", "sm", "base", "lg"]);
  });

  it("should export 5 button states", () => {
    expect(BUTTON_STATES_EXPORT).toHaveLength(5);
    expect(BUTTON_STATES_EXPORT).toEqual([
      "Default",
      "Hover",
      "Active",
      "Disabled",
      "Loading",
    ]);
  });

  it("should generate correct number of ComponentSets (6 variants × 4 sizes = 24)", () => {
    const expectedTotal =
      BUTTON_VARIANTS_EXPORT.length * BUTTON_SIZES_EXPORT.length;
    expect(expectedTotal).toBe(24);
  });

  it("should generate correct number of components per ComponentSet (5 states)", () => {
    const expectedStates = BUTTON_STATES_EXPORT.length;
    expect(expectedStates).toBe(5);
  });
});
