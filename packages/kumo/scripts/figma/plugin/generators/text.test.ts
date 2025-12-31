/**
 * Tests for text.ts component generator
 *
 * Note: Full integration tests require Figma plugin runtime.
 * These tests verify exports and constants only.
 *
 * Source of truth: component-registry.json (generated from text.tsx)
 */

import { describe, it, expect } from "vitest";
import {
  generateTextComponents,
  TEXT_VARIANTS_EXPORT,
  TEXT_SIZES_EXPORT,
} from "./text";
// Import registry as source of truth (same as text.ts uses)
import registry from "../../../../ai/component-registry.json";

const textProps = registry.components.Text.props;
const expectedVariants = (textProps.variant as { values: string[] }).values;
const expectedSizes = (textProps.size as { values: string[] }).values;
const variantDescriptions = (
  textProps.variant as { descriptions: Record<string, string> }
).descriptions;

describe("generateTextComponents", () => {
  it("should export generateTextComponents function", () => {
    expect(typeof generateTextComponents).toBe("function");
  });

  it("should export text variants matching component-registry.json", () => {
    // Source of truth: component-registry.json (generated from text.tsx)
    expect(TEXT_VARIANTS_EXPORT).toEqual(expectedVariants);
  });

  it("should export text sizes matching component-registry.json", () => {
    // Source of truth: component-registry.json (generated from text.tsx)
    expect(TEXT_SIZES_EXPORT).toEqual(expectedSizes);
  });

  it("should have variant count matching registry", () => {
    expect(TEXT_VARIANTS_EXPORT).toHaveLength(expectedVariants.length);
  });

  it("should have size count matching registry", () => {
    expect(TEXT_SIZES_EXPORT).toHaveLength(expectedSizes.length);
  });

  it("should have descriptions for all variants", () => {
    // Every variant in the registry should have a description
    for (const variant of expectedVariants) {
      expect(variantDescriptions[variant]).toBeDefined();
      expect(variantDescriptions[variant].length).toBeGreaterThan(0);
    }
  });

  it("should include heading variants from registry", () => {
    // Verify heading variants exist (derived from registry, not hardcoded)
    const headingVariants = expectedVariants.filter((v) =>
      v.startsWith("heading"),
    );
    expect(headingVariants.length).toBeGreaterThan(0);
  });

  it("should include monospace variants from registry", () => {
    // Verify mono variants exist (derived from registry, not hardcoded)
    const monoVariants = expectedVariants.filter((v) => v.includes("mono"));
    expect(monoVariants.length).toBeGreaterThan(0);
  });
});
