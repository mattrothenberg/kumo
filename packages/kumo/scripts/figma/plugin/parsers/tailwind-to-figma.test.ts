import { describe, it, expect } from "vitest";
import { parseTailwindClasses, parseBaseStyles } from "./tailwind-to-figma";

describe("parseTailwindClasses", () => {
  describe("Layout Properties", () => {
    it("should parse height from Tailwind scale", () => {
      expect(parseTailwindClasses("h-5")).toEqual({ height: 20 });
      expect(parseTailwindClasses("h-9")).toEqual({ height: 36 });
      expect(parseTailwindClasses("h-10")).toEqual({ height: 40 });
    });

    it("should parse custom height with decimal", () => {
      expect(parseTailwindClasses("h-6.5")).toEqual({ height: 26 });
    });

    it("should parse height with fallback calculation for unknown values", () => {
      // For values not in SPACING_SCALE, it should multiply by 4
      expect(parseTailwindClasses("h-15")).toEqual({ height: 60 }); // 15 * 4
    });

    it("should parse horizontal padding", () => {
      expect(parseTailwindClasses("px-2")).toEqual({ paddingX: 8 });
      expect(parseTailwindClasses("px-3")).toEqual({ paddingX: 12 });
      expect(parseTailwindClasses("px-4")).toEqual({ paddingX: 16 });
    });

    it("should parse horizontal padding with decimal", () => {
      expect(parseTailwindClasses("px-1.5")).toEqual({ paddingX: 6 });
    });

    it("should parse vertical padding", () => {
      expect(parseTailwindClasses("py-0.5")).toEqual({ paddingY: 2 });
      expect(parseTailwindClasses("py-1")).toEqual({ paddingY: 4 });
      expect(parseTailwindClasses("py-2")).toEqual({ paddingY: 8 });
    });

    it("should parse gap", () => {
      expect(parseTailwindClasses("gap-1")).toEqual({ gap: 4 });
      expect(parseTailwindClasses("gap-1.5")).toEqual({ gap: 6 });
      expect(parseTailwindClasses("gap-2")).toEqual({ gap: 8 });
    });

    it("should parse border radius", () => {
      expect(parseTailwindClasses("rounded-sm")).toEqual({ borderRadius: 2 });
      expect(parseTailwindClasses("rounded-md")).toEqual({ borderRadius: 6 });
      expect(parseTailwindClasses("rounded-lg")).toEqual({ borderRadius: 8 });
      expect(parseTailwindClasses("rounded-xl")).toEqual({ borderRadius: 12 });
      expect(parseTailwindClasses("rounded-2xl")).toEqual({ borderRadius: 16 });
      expect(parseTailwindClasses("rounded-3xl")).toEqual({ borderRadius: 24 });
      expect(parseTailwindClasses("rounded-full")).toEqual({
        borderRadius: 9999,
      });
    });

    it("should parse default border radius", () => {
      expect(parseTailwindClasses("rounded")).toEqual({ borderRadius: 4 });
    });

    it("should parse none border radius", () => {
      expect(parseTailwindClasses("rounded-none")).toEqual({ borderRadius: 0 });
    });
  });

  describe("Typography", () => {
    it("should parse font sizes", () => {
      expect(parseTailwindClasses("text-xs")).toEqual({ fontSize: 12 });
      expect(parseTailwindClasses("text-sm")).toEqual({ fontSize: 14 });
      expect(parseTailwindClasses("text-base")).toEqual({ fontSize: 16 });
      expect(parseTailwindClasses("text-lg")).toEqual({ fontSize: 18 });
      expect(parseTailwindClasses("text-xl")).toEqual({ fontSize: 20 });
      expect(parseTailwindClasses("text-2xl")).toEqual({ fontSize: 24 });
      expect(parseTailwindClasses("text-3xl")).toEqual({ fontSize: 30 });
    });
  });

  describe("Background Colors", () => {
    it("should parse semantic background colors", () => {
      expect(parseTailwindClasses("bg-primary")).toEqual({
        fillVariable: "color-primary",
      });
      expect(parseTailwindClasses("bg-secondary")).toEqual({
        fillVariable: "color-secondary",
      });
      expect(parseTailwindClasses("bg-surface")).toEqual({
        fillVariable: "color-surface",
      });
      expect(parseTailwindClasses("bg-error")).toEqual({
        fillVariable: "color-error",
      });
      expect(parseTailwindClasses("bg-info")).toEqual({
        fillVariable: "color-info",
      });
      expect(parseTailwindClasses("bg-alert")).toEqual({
        fillVariable: "color-alert",
      });
    });

    it("should parse transparent and inherit backgrounds", () => {
      expect(parseTailwindClasses("bg-transparent")).toEqual({
        fillVariable: null,
      });
      expect(parseTailwindClasses("bg-inherit")).toEqual({
        fillVariable: null,
      });
    });

    it("should parse background colors with opacity modifiers", () => {
      expect(parseTailwindClasses("bg-info/20")).toEqual({
        fillVariable: "color-info/20",
        fillOpacity: 0.2,
      });
      expect(parseTailwindClasses("bg-error/50")).toEqual({
        fillVariable: "color-error/50",
        fillOpacity: 0.5,
      });
      expect(parseTailwindClasses("bg-primary/80")).toEqual({
        fillVariable: "color-primary/80",
        fillOpacity: 0.8,
      });
    });

    it("should handle unknown background colors gracefully", () => {
      expect(parseTailwindClasses("bg-unknown")).toEqual({});
    });
  });

  describe("Text Colors", () => {
    it("should parse semantic text colors", () => {
      expect(parseTailwindClasses("text-surface")).toEqual({
        textVariable: "text-color-surface",
      });
      expect(parseTailwindClasses("text-surface-inverse")).toEqual({
        textVariable: "text-color-surface-inverse",
      });
      expect(parseTailwindClasses("text-error")).toEqual({
        textVariable: "text-color-error",
      });
      expect(parseTailwindClasses("text-info")).toEqual({
        textVariable: "text-color-info",
      });
      expect(parseTailwindClasses("text-muted")).toEqual({
        textVariable: "text-color-muted",
      });
      expect(parseTailwindClasses("text-label")).toEqual({
        textVariable: "text-color-label",
      });
    });

    it("should parse white text color with flag", () => {
      expect(parseTailwindClasses("text-white")).toEqual({
        textVariable: null,
        isWhiteText: true,
      });
    });

    it("should parse important text colors", () => {
      expect(parseTailwindClasses("!text-white")).toEqual({
        textVariable: null,
        isWhiteText: true,
      });
      expect(parseTailwindClasses("!text-surface")).toEqual({
        textVariable: "text-color-surface",
      });
      expect(parseTailwindClasses("!text-error")).toEqual({
        textVariable: "text-color-error",
      });
    });

    it("should handle unknown text colors gracefully", () => {
      expect(parseTailwindClasses("text-unknown")).toEqual({});
    });
  });

  describe("Borders and Rings", () => {
    it("should detect border presence", () => {
      expect(parseTailwindClasses("border")).toEqual({
        hasBorder: true,
        strokeWeight: 1,
      });
    });

    it("should parse border colors", () => {
      expect(parseTailwindClasses("border border-border")).toEqual({
        hasBorder: true,
        strokeVariable: "color-border",
        strokeWeight: 1,
      });
      expect(parseTailwindClasses("border border-error")).toEqual({
        hasBorder: true,
        strokeVariable: "color-error",
        strokeWeight: 1,
      });
    });

    it("should parse dashed border style", () => {
      expect(parseTailwindClasses("border-dashed")).toEqual({
        hasBorder: true,
        borderStyle: "dashed",
        dashPattern: [4, 4],
      });
    });

    it("should parse ring as border", () => {
      expect(parseTailwindClasses("ring")).toEqual({ hasBorder: true });
      expect(parseTailwindClasses("ring-border")).toEqual({
        hasBorder: true,
        strokeVariable: "color-border",
      });
    });

    it("should parse default border width (1px)", () => {
      expect(parseTailwindClasses("border")).toEqual({
        hasBorder: true,
        strokeWeight: 1,
      });
    });

    it("should parse border width from border-N classes", () => {
      expect(parseTailwindClasses("border-2")).toEqual({
        hasBorder: true,
        strokeWeight: 2,
      });
      expect(parseTailwindClasses("border-4")).toEqual({
        hasBorder: true,
        strokeWeight: 4,
      });
      expect(parseTailwindClasses("border-8")).toEqual({
        hasBorder: true,
        strokeWeight: 8,
      });
    });

    it("should parse dashPattern from border-dashed", () => {
      expect(parseTailwindClasses("border-dashed")).toEqual({
        hasBorder: true,
        borderStyle: "dashed",
        dashPattern: [4, 4],
      });
    });

    it("should parse border with width, style, and color together", () => {
      expect(
        parseTailwindClasses("border-2 border-dashed border-error"),
      ).toEqual({
        hasBorder: true,
        strokeWeight: 2,
        borderStyle: "dashed",
        dashPattern: [4, 4],
        strokeVariable: "color-error",
      });
    });
  });

  describe("Combined Classes", () => {
    it("should parse multiple classes together", () => {
      const result = parseTailwindClasses(
        "h-9 px-3 py-1 gap-2 rounded-lg text-base bg-primary text-white border border-border",
      );
      expect(result).toEqual({
        height: 36,
        paddingX: 12,
        paddingY: 4,
        gap: 8,
        borderRadius: 8,
        fontSize: 16,
        fillVariable: "color-primary",
        textVariable: null,
        isWhiteText: true,
        hasBorder: true,
        strokeVariable: "color-border",
        strokeWeight: 1,
      });
    });

    it("should parse button-like classes", () => {
      const result = parseTailwindClasses(
        "flex items-center h-10 px-4 rounded-md bg-secondary text-surface ring ring-border",
      );
      expect(result).toEqual({
        height: 40,
        paddingX: 16,
        borderRadius: 6,
        fillVariable: "color-secondary",
        textVariable: "text-color-surface",
        hasBorder: true,
        strokeVariable: "color-border",
      });
    });

    it("should parse badge-like classes", () => {
      const result = parseTailwindClasses(
        "h-5 px-1.5 gap-1 rounded text-xs bg-info/20 text-info border-dashed",
      );
      expect(result).toEqual({
        height: 20,
        paddingX: 6,
        gap: 4,
        borderRadius: 4,
        fontSize: 12,
        fillVariable: "color-info/20",
        fillOpacity: 0.2,
        textVariable: "text-color-info",
        hasBorder: true,
        borderStyle: "dashed",
        dashPattern: [4, 4],
      });
    });
  });

  describe("State Variants", () => {
    it("should skip hover state classes", () => {
      expect(parseTailwindClasses("hover:bg-primary")).toEqual({});
    });

    it("should skip disabled state classes", () => {
      expect(parseTailwindClasses("disabled:opacity-50")).toEqual({});
    });

    it("should skip focus state classes", () => {
      expect(parseTailwindClasses("focus:ring-2")).toEqual({});
    });

    it("should parse important classes even with colon-like syntax", () => {
      expect(parseTailwindClasses("!text-white")).toEqual({
        textVariable: null,
        isWhiteText: true,
      });
    });

    it("should skip state variants but parse base classes", () => {
      const result = parseTailwindClasses(
        "bg-primary hover:bg-secondary text-white focus:ring-2",
      );
      expect(result).toEqual({
        fillVariable: "color-primary",
        textVariable: null,
        isWhiteText: true,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      expect(parseTailwindClasses("")).toEqual({});
    });

    it("should handle only whitespace", () => {
      expect(parseTailwindClasses("   ")).toEqual({});
    });

    it("should handle single class", () => {
      expect(parseTailwindClasses("bg-primary")).toEqual({
        fillVariable: "color-primary",
      });
    });

    it("should handle extra whitespace between classes", () => {
      const result = parseTailwindClasses("h-9  px-3   py-1    gap-2");
      expect(result).toEqual({
        height: 36,
        paddingX: 12,
        paddingY: 4,
        gap: 8,
      });
    });

    it("should handle unknown classes gracefully", () => {
      const result = parseTailwindClasses(
        "unknown-class flex items-center bg-primary",
      );
      expect(result).toEqual({
        fillVariable: "color-primary",
      });
    });

    it("should handle malformed opacity syntax", () => {
      // Invalid opacity format should not match
      expect(parseTailwindClasses("bg-primary/")).toEqual({});
      expect(parseTailwindClasses("bg-primary/abc")).toEqual({});
    });

    it("should handle classes with numbers that don't match patterns", () => {
      expect(parseTailwindClasses("z-10")).toEqual({});
      expect(parseTailwindClasses("order-1")).toEqual({});
    });

    it("should not parse text color classes that are actually font sizes", () => {
      const result = parseTailwindClasses("text-lg text-surface");
      expect(result).toEqual({
        fontSize: 18,
        textVariable: "text-color-surface",
      });
    });
  });

  describe("Opacity Handling", () => {
    it("should parse opacity for various background color classes", () => {
      expect(parseTailwindClasses("bg-error/10")).toEqual({
        fillVariable: "color-error/10",
        fillOpacity: 0.1,
      });
      expect(parseTailwindClasses("bg-alert/30")).toEqual({
        fillVariable: "color-alert/30",
        fillOpacity: 0.3,
      });
      expect(parseTailwindClasses("bg-surface/90")).toEqual({
        fillVariable: "color-surface/90",
        fillOpacity: 0.9,
      });
    });

    it("should parse opacity with zero", () => {
      expect(parseTailwindClasses("bg-primary/0")).toEqual({
        fillVariable: "color-primary/0",
        fillOpacity: 0,
      });
    });

    it("should parse full opacity", () => {
      expect(parseTailwindClasses("bg-primary/100")).toEqual({
        fillVariable: "color-primary/100",
        fillOpacity: 1,
      });
    });

    it("should handle multi-digit opacity values", () => {
      expect(parseTailwindClasses("bg-secondary/75")).toEqual({
        fillVariable: "color-secondary/75",
        fillOpacity: 0.75,
      });
    });

    it("should parse common opacity values correctly", () => {
      expect(parseTailwindClasses("bg-primary/20")).toEqual({
        fillVariable: "color-primary/20",
        fillOpacity: 0.2,
      });
      expect(parseTailwindClasses("bg-primary/50")).toEqual({
        fillVariable: "color-primary/50",
        fillOpacity: 0.5,
      });
      expect(parseTailwindClasses("bg-primary/70")).toEqual({
        fillVariable: "color-primary/70",
        fillOpacity: 0.7,
      });
      expect(parseTailwindClasses("bg-primary/80")).toEqual({
        fillVariable: "color-primary/80",
        fillOpacity: 0.8,
      });
    });

    it("should parse text color opacity modifiers", () => {
      expect(parseTailwindClasses("text-surface/50")).toEqual({
        textVariable: "text-color-surface/50",
        textOpacity: 0.5,
      });
      expect(parseTailwindClasses("text-error/80")).toEqual({
        textVariable: "text-color-error/80",
        textOpacity: 0.8,
      });
      expect(parseTailwindClasses("text-info/30")).toEqual({
        textVariable: "text-color-info/30",
        textOpacity: 0.3,
      });
    });

    it("should parse important text color opacity modifiers", () => {
      expect(parseTailwindClasses("!text-surface/50")).toEqual({
        textVariable: "text-color-surface/50",
        textOpacity: 0.5,
      });
      expect(parseTailwindClasses("!text-error/70")).toEqual({
        textVariable: "text-color-error/70",
        textOpacity: 0.7,
      });
    });

    it("should parse border color opacity modifiers", () => {
      expect(parseTailwindClasses("border border-error/50")).toEqual({
        hasBorder: true,
        strokeWeight: 1,
        strokeVariable: "color-error/50",
        strokeOpacity: 0.5,
      });
      expect(parseTailwindClasses("border border-primary/30")).toEqual({
        hasBorder: true,
        strokeWeight: 1,
        strokeVariable: "color-primary/30",
        strokeOpacity: 0.3,
      });
    });

    it("should parse ring color opacity modifiers", () => {
      expect(parseTailwindClasses("ring-active/50")).toEqual({
        hasBorder: true,
        strokeVariable: "color-active/50",
        strokeOpacity: 0.5,
      });
      expect(parseTailwindClasses("ring-error/70")).toEqual({
        hasBorder: true,
        strokeVariable: "color-error/70",
        strokeOpacity: 0.7,
      });
    });

    it("should handle opacity in combined classes", () => {
      const result = parseTailwindClasses(
        "bg-primary/70 text-white/90 border border-error/50",
      );
      expect(result).toEqual({
        fillVariable: "color-primary/70",
        fillOpacity: 0.7,
        textVariable: null,
        textOpacity: 0.9,
        isWhiteText: true,
        hasBorder: true,
        strokeWeight: 1,
        strokeVariable: "color-error/50",
        strokeOpacity: 0.5,
      });
    });
  });

  describe("Color Variable Resolution", () => {
    it("should resolve background to fill variable", () => {
      expect(parseTailwindClasses("bg-color")).toEqual({
        fillVariable: "color-color",
      });
      expect(parseTailwindClasses("bg-accent")).toEqual({
        fillVariable: "color-accent",
      });
      expect(parseTailwindClasses("bg-subtle")).toEqual({
        fillVariable: "color-subtle",
      });
    });

    it("should resolve text colors to text variables", () => {
      expect(parseTailwindClasses("text-alert")).toEqual({
        textVariable: "text-color-alert",
      });
    });

    it("should resolve border colors to stroke variables", () => {
      expect(parseTailwindClasses("border border-color")).toEqual({
        hasBorder: true,
        strokeVariable: "color-color",
        strokeWeight: 1,
      });
      expect(parseTailwindClasses("border border-primary")).toEqual({
        hasBorder: true,
        strokeVariable: "color-primary",
        strokeWeight: 1,
      });
    });

    it("should handle null variable mapping for special cases", () => {
      expect(parseTailwindClasses("bg-transparent")).toEqual({
        fillVariable: null,
      });
      expect(parseTailwindClasses("text-white")).toEqual({
        textVariable: null,
        isWhiteText: true,
      });
    });
  });

  describe("Arbitrary Value Parsing", () => {
    describe("Width", () => {
      it("should parse width with px unit", () => {
        expect(parseTailwindClasses("w-[350px]")).toEqual({
          width: 350,
        });
        expect(parseTailwindClasses("w-[100px]")).toEqual({
          width: 100,
        });
      });

      it("should parse width with rem unit", () => {
        expect(parseTailwindClasses("w-[32rem]")).toEqual({
          width: 512, // 32 * 16
        });
        expect(parseTailwindClasses("w-[20rem]")).toEqual({
          width: 320, // 20 * 16
        });
      });

      it("should parse width with em unit", () => {
        expect(parseTailwindClasses("w-[16em]")).toEqual({
          width: 256, // 16 * 16
        });
      });

      it("should parse width with decimal values", () => {
        expect(parseTailwindClasses("w-[21.875rem]")).toEqual({
          width: 350, // 21.875 * 16
        });
        expect(parseTailwindClasses("w-[12.5px]")).toEqual({
          width: 12.5,
        });
      });

      it("should parse width without unit (defaults to px)", () => {
        expect(parseTailwindClasses("w-[250]")).toEqual({
          width: 250,
        });
      });
    });

    describe("Height", () => {
      it("should parse height with px unit", () => {
        expect(parseTailwindClasses("h-[100px]")).toEqual({
          height: 100,
        });
      });

      it("should parse height with rem unit", () => {
        expect(parseTailwindClasses("h-[2.5rem]")).toEqual({
          height: 40, // 2.5 * 16
        });
        expect(parseTailwindClasses("h-[10rem]")).toEqual({
          height: 160, // 10 * 16
        });
      });

      it("should parse height with em unit", () => {
        expect(parseTailwindClasses("h-[3em]")).toEqual({
          height: 48, // 3 * 16
        });
      });

      it("should parse height without unit (defaults to px)", () => {
        expect(parseTailwindClasses("h-[50]")).toEqual({
          height: 50,
        });
      });
    });

    describe("Min Width", () => {
      it("should parse min-width with px unit", () => {
        expect(parseTailwindClasses("min-w-[200px]")).toEqual({
          minWidth: 200,
        });
      });

      it("should parse min-width with rem unit", () => {
        expect(parseTailwindClasses("min-w-[32rem]")).toEqual({
          minWidth: 512, // 32 * 16
        });
      });

      it("should parse min-width with em unit", () => {
        expect(parseTailwindClasses("min-w-[10em]")).toEqual({
          minWidth: 160, // 10 * 16
        });
      });
    });

    describe("Min Height", () => {
      it("should parse min-height with px unit", () => {
        expect(parseTailwindClasses("min-h-[100px]")).toEqual({
          minHeight: 100,
        });
      });

      it("should parse min-height with rem unit", () => {
        expect(parseTailwindClasses("min-h-[5rem]")).toEqual({
          minHeight: 80, // 5 * 16
        });
      });
    });

    describe("Max Width", () => {
      it("should parse max-width with px unit", () => {
        expect(parseTailwindClasses("max-w-[800px]")).toEqual({
          maxWidth: 800,
        });
      });

      it("should parse max-width with rem unit", () => {
        expect(parseTailwindClasses("max-w-[64rem]")).toEqual({
          maxWidth: 1024, // 64 * 16
        });
      });
    });

    describe("Max Height", () => {
      it("should parse max-height with px unit", () => {
        expect(parseTailwindClasses("max-h-[500px]")).toEqual({
          maxHeight: 500,
        });
      });

      it("should parse max-height with rem unit", () => {
        expect(parseTailwindClasses("max-h-[30rem]")).toEqual({
          maxHeight: 480, // 30 * 16
        });
      });
    });

    describe("Combined with other classes", () => {
      it("should parse arbitrary values with standard classes", () => {
        const result = parseTailwindClasses(
          "w-[350px] h-[2.5rem] px-4 rounded-lg bg-primary",
        );
        expect(result).toEqual({
          width: 350,
          height: 40, // 2.5 * 16
          paddingX: 16,
          borderRadius: 8,
          fillVariable: "color-primary",
        });
      });

      it("should handle multiple arbitrary values", () => {
        const result = parseTailwindClasses("min-w-[200px] max-w-[800px] min-h-[100px] max-h-[600px]");
        expect(result).toEqual({
          minWidth: 200,
          maxWidth: 800,
          minHeight: 100,
          maxHeight: 600,
        });
      });

      it("should prioritize arbitrary height over standard height", () => {
        // If both h-9 and h-[100px] are present, the last one wins
        const result1 = parseTailwindClasses("h-9 h-[100px]");
        expect(result1).toEqual({
          height: 100,
        });

        const result2 = parseTailwindClasses("h-[100px] h-9");
        expect(result2).toEqual({
          height: 36, // h-9 wins
        });
      });
    });

    describe("Edge cases", () => {
      it("should handle invalid arbitrary value syntax gracefully", () => {
        expect(parseTailwindClasses("w-[invalid]")).toEqual({});
        expect(parseTailwindClasses("w-[]")).toEqual({});
        expect(parseTailwindClasses("w-[px]")).toEqual({});
      });

      it("should handle unsupported properties gracefully", () => {
        // These should not match the pattern
        expect(parseTailwindClasses("p-[16px]")).toEqual({});
        expect(parseTailwindClasses("m-[20px]")).toEqual({});
        expect(parseTailwindClasses("gap-[8px]")).toEqual({});
      });

      it("should handle malformed brackets", () => {
        expect(parseTailwindClasses("w-[350px")).toEqual({});
        expect(parseTailwindClasses("w-350px]")).toEqual({});
        expect(parseTailwindClasses("w-350px")).toEqual({});
      });

      it("should handle zero values", () => {
        expect(parseTailwindClasses("w-[0px]")).toEqual({
          width: 0,
        });
        expect(parseTailwindClasses("h-[0]")).toEqual({
          height: 0,
        });
      });

      it("should handle large values", () => {
        expect(parseTailwindClasses("w-[9999px]")).toEqual({
          width: 9999,
        });
        expect(parseTailwindClasses("max-w-[100rem]")).toEqual({
          maxWidth: 1600, // 100 * 16
        });
      });
    });
  });
});

describe("parseBaseStyles", () => {
  it("should be an alias for parseTailwindClasses", () => {
    const classes = "h-9 px-3 bg-primary text-white";
    expect(parseBaseStyles(classes)).toEqual(parseTailwindClasses(classes));
  });

  it("should parse complex base styles string", () => {
    const baseStyles =
      "flex items-center font-medium h-9 px-3 gap-2 rounded-lg text-base bg-secondary text-surface ring ring-border";
    const result = parseBaseStyles(baseStyles);
    expect(result).toEqual({
      height: 36,
      paddingX: 12,
      gap: 8,
      borderRadius: 8,
      fontSize: 16,
      fontWeight: 500, // font-medium
      fillVariable: "color-secondary",
      textVariable: "text-color-surface",
      hasBorder: true,
      strokeVariable: "color-border",
    });
  });

  it("should handle empty base styles", () => {
    expect(parseBaseStyles("")).toEqual({});
  });
});
