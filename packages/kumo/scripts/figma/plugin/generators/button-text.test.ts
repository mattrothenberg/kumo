/**
 * Tests for button-text.ts component generator
 */

import { describe, it, expect } from "vitest";
import { generateButtonTextComponents } from "./button-text";

describe("generateButtonTextComponents", () => {
  it("should export generateButtonTextComponents function", () => {
    expect(typeof generateButtonTextComponents).toBe("function");
  });

  it("should return metadata about generated components", () => {
    const result = generateButtonTextComponents();

    expect(result).toHaveProperty("sections");
    expect(result).toHaveProperty("componentSets");
    expect(result).toHaveProperty("totalComponents");
  });

  it("should generate 6 sections for 6 variants", () => {
    const result = generateButtonTextComponents();

    expect(result.sections).toHaveLength(6);
    expect(result.sections).toEqual(
      expect.arrayContaining([
        "Primary",
        "Secondary",
        "Ghost",
        "Destructive",
        "Secondary-Destructive",
        "Outline",
      ]),
    );
  });

  it("should generate 24 ComponentSets (6 variants × 4 sizes)", () => {
    const result = generateButtonTextComponents();

    expect(result.componentSets).toHaveLength(24);
    expect(result.totalComponents).toBe(24);
  });

  it("should generate ComponentSets with correct naming convention", () => {
    const result = generateButtonTextComponents();

    // Check for expected names
    expect(result.componentSets).toContain("Button Primary XS");
    expect(result.componentSets).toContain("Button Primary SM");
    expect(result.componentSets).toContain("Button Primary Base");
    expect(result.componentSets).toContain("Button Primary LG");

    expect(result.componentSets).toContain("Button Secondary XS");
    expect(result.componentSets).toContain("Button Ghost Base");
    expect(result.componentSets).toContain("Button Destructive LG");
    expect(result.componentSets).toContain("Button Outline SM");
  });

  it("should generate all size variations for each variant", () => {
    const result = generateButtonTextComponents();

    const variants = [
      "Primary",
      "Secondary",
      "Ghost",
      "Destructive",
      "Secondary-Destructive",
      "Outline",
    ];
    const sizes = ["XS", "SM", "Base", "LG"];

    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const expectedName = `Button ${variant} ${size}`;
        expect(result.componentSets).toContain(expectedName);
      });
    });
  });
});
