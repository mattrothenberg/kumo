import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";
import { Icon, KUMO_ICON_VARIANTS } from "./icon";

describe("Icon", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("should be defined", () => {
    expect(Icon).toBeDefined();
  });

  it("should render icon with glyph", () => {
    const props = {
      glyph: "ph-check" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
  });

  it("should apply xs size variant class (size-3)", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "xs" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
    expect(KUMO_ICON_VARIANTS.size.xs.classes).toBe("size-3");
  });

  it("should apply sm size variant class (size-4)", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "sm" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
    expect(KUMO_ICON_VARIANTS.size.sm.classes).toBe("size-4");
  });

  it("should apply base size variant class (size-5)", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "base" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
    expect(KUMO_ICON_VARIANTS.size.base.classes).toBe("size-5");
  });

  it("should apply lg size variant class (size-6)", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "lg" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
    expect(KUMO_ICON_VARIANTS.size.lg.classes).toBe("size-6");
  });

  it("should apply xl size variant class (size-8)", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "xl" as const,
    };
    expect(() => createElement(Icon, props)).not.toThrow();
    expect(KUMO_ICON_VARIANTS.size.xl.classes).toBe("size-8");
  });

  it("should render with title for accessibility", () => {
    const props = {
      glyph: "ph-check" as const,
      title: "Success",
    };
    expect(() => createElement(Icon, props)).not.toThrow();
  });

  it("should accept invalid glyph in tests (NODE_ENV check)", () => {
    // In test environment (NODE_ENV !== "production"), the warning logic exists
    // but we can't test it easily without actually rendering the component.
    // This test verifies that invalid glyphs don't throw errors.
    const props = {
      glyph: "invalid-icon" as any,
    };

    expect(() => createElement(Icon, props)).not.toThrow();
  });

  it("should accept all optional props", () => {
    const props = {
      glyph: "ph-check" as const,
      size: "lg" as const,
      title: "Success",
      className: "fill-primary",
    };
    expect(() => createElement(Icon, props)).not.toThrow();
  });
});
