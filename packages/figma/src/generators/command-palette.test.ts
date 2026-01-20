/**
 * Tests for command-palette.ts component generator
 *
 * These tests ensure the CommandPalette Figma component generation stays in sync
 * with the source React component (command-palette.tsx).
 *
 * CRITICAL: These tests act as a regression guard. If you change the command-palette
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Note: CommandPalette is a compound component without traditional variants in the
 * registry. The tests validate that Tailwind classes from the React component are
 * properly parsed and used for Figma generation.
 *
 * Source of truth chain:
 * command-palette.tsx → command-palette.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getCommandPaletteConfig,
  getCommandPaletteClasses,
  getParsedStyles,
  getAllCommandPaletteData,
  getBaseConfig,
} from "./command-palette";
import {
  FONT_SIZE,
  FALLBACK_VALUES,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import themeData from "../generated/theme-data.json";

describe("CommandPalette Generator - Config Validation", () => {
  const config = getCommandPaletteConfig();

  it("should have valid width (max-w-2xl = 672px)", () => {
    expect(config.width).toBe(672); // 42rem * 16
  });

  it("should have valid maxHeight", () => {
    // FIGMA-SPECIFIC: max-h-[60vh] is viewport-relative, 400px is a reasonable Figma canvas height
    expect(config.maxHeight).toBe(400); // Not fontWeight - FALLBACK note for drift detection
  });

  it("should have valid inputHeight derived from spacing", () => {
    // py-3 = 12px * 2 + icon height
    expect(config.inputHeight).toBeGreaterThan(0);
  });

  it("should have valid footerHeight derived from spacing", () => {
    // py-3 = 12px * 2 + text
    expect(config.footerHeight).toBeGreaterThan(0);
  });

  it("should have valid itemHeight derived from spacing", () => {
    // py-1.5 = 6px * 2 + content
    expect(config.itemHeight).toBeGreaterThan(0);
  });

  it("should have valid groupLabelHeight derived from spacing", () => {
    expect(config.groupLabelHeight).toBeGreaterThan(0);
  });
});

describe("CommandPalette Generator - Component Classes", () => {
  const classes = getCommandPaletteClasses();

  it("should have container classes", () => {
    expect(classes.container).toBeDefined();
    expect(classes.container).toContain("rounded-lg");
    expect(classes.container).toContain("bg-surface-2");
  });

  it("should have inputHeader classes", () => {
    expect(classes.inputHeader).toBeDefined();
    expect(classes.inputHeader).toContain("gap-3");
    expect(classes.inputHeader).toContain("bg-surface-elevated");
    expect(classes.inputHeader).toContain("px-4");
    expect(classes.inputHeader).toContain("py-3");
  });

  it("should have list classes", () => {
    expect(classes.list).toBeDefined();
    expect(classes.list).toContain("bg-surface-elevated");
    expect(classes.list).toContain("px-2");
    expect(classes.list).toContain("py-2");
    expect(classes.list).toContain("ring-1");
    expect(classes.list).toContain("ring-border");
  });

  it("should have item classes", () => {
    expect(classes.item).toBeDefined();
    expect(classes.item).toContain("gap-3");
    expect(classes.item).toContain("px-2");
    expect(classes.item).toContain("py-1.5");
    expect(classes.item).toContain("rounded-lg");
  });

  it("should have itemHighlighted classes", () => {
    expect(classes.itemHighlighted).toBeDefined();
    expect(classes.itemHighlighted).toContain("bg-subtle");
  });

  it("should have groupLabel classes", () => {
    expect(classes.groupLabel).toBeDefined();
    expect(classes.groupLabel).toContain("text-xs");
    expect(classes.groupLabel).toContain("font-semibold");
    expect(classes.groupLabel).toContain("text-label");
  });

  it("should have footer classes", () => {
    expect(classes.footer).toBeDefined();
    expect(classes.footer).toContain("bg-surface-2");
    expect(classes.footer).toContain("px-4");
    expect(classes.footer).toContain("py-3");
    expect(classes.footer).toContain("text-xs");
    expect(classes.footer).toContain("text-label");
  });

  it("should have resultTitle classes", () => {
    expect(classes.resultTitle).toBeDefined();
    expect(classes.resultTitle).toContain("text-base");
    expect(classes.resultTitle).toContain("text-surface");
  });
});

describe("CommandPalette Generator - Parsed Styles", () => {
  /**
   * Note: Some Kumo-specific tokens (bg-surface-2, bg-surface-elevated) are not
   * in the tailwind-to-figma parser's COLOR_TO_VARIABLE map. The generator
   * handles these by using getVariableByName directly with hardcoded token names.
   * Tests marked with "handled by generator" document this behavior.
   */

  describe("container styles", () => {
    const styles = getParsedStyles("container");

    it("should parse borderRadius from rounded-lg", () => {
      expect(styles.borderRadius).toBe(BORDER_RADIUS.lg);
    });

    it("should not parse fillVariable (bg-surface-2 not in parser map, handled by generator)", () => {
      // bg-surface-2 is not in the parser's COLOR_TO_VARIABLE map
      // The generator uses getVariableByName("color-surface-2") directly
      expect(styles.fillVariable).toBeUndefined();
    });
  });

  describe("inputHeader styles", () => {
    const styles = getParsedStyles("inputHeader");

    it("should parse gap from gap-3", () => {
      expect(styles.gap).toBe(SPACING.lg); // gap-3 = 12px
    });

    it("should parse padding from px-4 py-3", () => {
      expect(styles.paddingX).toBe(FALLBACK_VALUES.padding.standard); // px-4 = 16px
      expect(styles.paddingY).toBe(FALLBACK_VALUES.padding.horizontal); // py-3 = 12px
    });

    it("should not parse fillVariable (bg-surface-elevated not in parser map, handled by generator)", () => {
      // bg-surface-elevated is not in the parser's COLOR_TO_VARIABLE map
      // The generator uses getVariableByName("color-surface-elevated") directly
      expect(styles.fillVariable).toBeUndefined();
    });
  });

  describe("list styles", () => {
    const styles = getParsedStyles("list");

    it("should parse padding from px-2 py-2", () => {
      expect(styles.paddingX).toBe(SPACING.base); // px-2 = 8px
      expect(styles.paddingY).toBe(SPACING.base); // py-2 = 8px
    });

    it("should not parse fillVariable (bg-surface-elevated not in parser map, handled by generator)", () => {
      // bg-surface-elevated is not in the parser's COLOR_TO_VARIABLE map
      expect(styles.fillVariable).toBeUndefined();
    });

    it("should parse strokeVariable from ring-border", () => {
      expect(styles.strokeVariable).toBe("color-border");
    });

    it("should not parse borderRadius from rounded-b-lg (partial radius not supported)", () => {
      // rounded-b-lg (only bottom corners) is not supported by the parser
      // The generator uses BORDER_RADIUS.lg directly
      expect(styles.borderRadius).toBeUndefined();
    });
  });

  describe("item styles", () => {
    const styles = getParsedStyles("item");

    it("should parse gap from gap-3", () => {
      expect(styles.gap).toBe(SPACING.lg); // gap-3 = 12px
    });

    it("should parse padding from px-2 py-1.5", () => {
      expect(styles.paddingX).toBe(SPACING.base); // px-2 = 8px
      expect(styles.paddingY).toBe(SPACING.sm); // py-1.5 = 6px
    });

    it("should parse borderRadius from rounded-lg", () => {
      expect(styles.borderRadius).toBe(BORDER_RADIUS.lg);
    });
  });

  describe("itemHighlighted styles", () => {
    const styles = getParsedStyles("itemHighlighted");

    it("should parse fillVariable from bg-subtle", () => {
      expect(styles.fillVariable).toBe("color-subtle");
    });
  });

  describe("groupLabel styles", () => {
    const styles = getParsedStyles("groupLabel");

    it("should parse fontSize from text-xs", () => {
      expect(styles.fontSize).toBe(FONT_SIZE.xs);
    });

    it("should parse fontWeight from font-semibold", () => {
      expect(styles.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    });

    it("should parse textVariable from text-label", () => {
      expect(styles.textVariable).toBe("text-color-label");
    });
  });

  describe("footer styles", () => {
    const styles = getParsedStyles("footer");

    it("should parse padding from px-4 py-3", () => {
      expect(styles.paddingX).toBe(FALLBACK_VALUES.padding.standard); // px-4 = 16px
      expect(styles.paddingY).toBe(FALLBACK_VALUES.padding.horizontal); // py-3 = 12px
    });

    it("should not parse fillVariable (bg-surface-2 not in parser map, handled by generator)", () => {
      // bg-surface-2 is not in the parser's COLOR_TO_VARIABLE map
      expect(styles.fillVariable).toBeUndefined();
    });

    it("should parse fontSize from text-xs", () => {
      expect(styles.fontSize).toBe(FONT_SIZE.xs);
    });

    it("should parse textVariable from text-label", () => {
      expect(styles.textVariable).toBe("text-color-label");
    });
  });
});

describe("CommandPalette Generator - Base Config", () => {
  const baseConfig = getBaseConfig();

  it("should have correct width", () => {
    expect(baseConfig.width).toBe(672);
  });

  it("should have correct background token", () => {
    expect(baseConfig.background).toBe("color-surface-2");
  });

  it("should have correct shadow", () => {
    expect(baseConfig.shadow).toEqual(SHADOWS.dialog);
  });

  it("should have correct borderRadius", () => {
    expect(baseConfig.borderRadius).toBe(BORDER_RADIUS.lg);
  });

  it("should have inputHeader section config", () => {
    expect(baseConfig.sections.inputHeader).toBeDefined();
    expect(baseConfig.sections.inputHeader.background).toBe(
      "color-surface-elevated",
    );
  });

  it("should have list section config", () => {
    expect(baseConfig.sections.list).toBeDefined();
    expect(baseConfig.sections.list.background).toBe("color-surface-elevated");
    expect(baseConfig.sections.list.border).toBe("color-border");
  });

  it("should have footer section config", () => {
    expect(baseConfig.sections.footer).toBeDefined();
    expect(baseConfig.sections.footer.background).toBe("color-surface-2");
    expect(baseConfig.sections.footer.textColor).toBe("text-color-label");
  });

  it("should have item config", () => {
    expect(baseConfig.item).toBeDefined();
    expect(baseConfig.item.normalBackground).toBeNull();
    expect(baseConfig.item.highlightedBackground).toBe("color-subtle");
    expect(baseConfig.item.textColor).toBe("text-color-surface");
    expect(baseConfig.item.iconColor).toBe("text-muted");
  });
});

describe("CommandPalette Generator - All Data Structure", () => {
  const allData = getAllCommandPaletteData();

  it("should have config", () => {
    expect(allData.config).toBeDefined();
    expect(allData.config.width).toBe(672);
  });

  it("should have classes", () => {
    expect(allData.classes).toBeDefined();
    expect(Object.keys(allData.classes).length).toBeGreaterThan(0);
  });

  it("should have parsedStyles for all component parts", () => {
    expect(allData.parsedStyles).toBeDefined();
    expect(allData.parsedStyles.container).toBeDefined();
    expect(allData.parsedStyles.inputHeader).toBeDefined();
    expect(allData.parsedStyles.list).toBeDefined();
    expect(allData.parsedStyles.item).toBeDefined();
    expect(allData.parsedStyles.footer).toBeDefined();
  });

  it("should have subComponents list", () => {
    expect(allData.subComponents).toBeDefined();
    expect(allData.subComponents).toContain("Dialog");
    expect(allData.subComponents).toContain("Root");
    expect(allData.subComponents).toContain("Panel");
    expect(allData.subComponents).toContain("Input");
    expect(allData.subComponents).toContain("List");
    expect(allData.subComponents).toContain("Group");
    expect(allData.subComponents).toContain("GroupLabel");
    expect(allData.subComponents).toContain("Item");
    expect(allData.subComponents).toContain("ResultItem");
    expect(allData.subComponents).toContain("HighlightedText");
    expect(allData.subComponents).toContain("Empty");
    expect(allData.subComponents).toContain("Loading");
    expect(allData.subComponents).toContain("Footer");
  });
});

describe("CommandPalette Generator - Color Token Coverage", () => {
  const baseConfig = getBaseConfig();

  it("should use semantic color tokens for container background", () => {
    expect(baseConfig.background).toBe("color-surface-2");
  });

  it("should use semantic color tokens for section backgrounds", () => {
    expect(baseConfig.sections.inputHeader.background).toBe(
      "color-surface-elevated",
    );
    expect(baseConfig.sections.list.background).toBe("color-surface-elevated");
    expect(baseConfig.sections.footer.background).toBe("color-surface-2");
  });

  it("should use semantic color tokens for borders", () => {
    expect(baseConfig.sections.list.border).toBe("color-border");
  });

  it("should use semantic color tokens for text", () => {
    expect(baseConfig.sections.footer.textColor).toBe("text-color-label");
    expect(baseConfig.item.textColor).toBe("text-color-surface");
  });

  it("should use semantic color tokens for item states", () => {
    expect(baseConfig.item.highlightedBackground).toBe("color-subtle");
    expect(baseConfig.item.iconColor).toBe("text-muted");
  });
});

describe("CommandPalette Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (config, parsed styles)
   * BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in sizing or layout logic
   * 3. Validating the source of truth chain:
   *    command-palette.tsx → command-palette.ts parser → Figma
   */

  it("should produce consistent config", () => {
    const config = getCommandPaletteConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent classes", () => {
    const classes = getCommandPaletteClasses();
    expect(classes).toMatchSnapshot();
  });

  it("should produce consistent base config", () => {
    const baseConfig = getBaseConfig();
    expect(baseConfig).toMatchSnapshot();
  });

  it("should produce consistent container styles", () => {
    const styles = getParsedStyles("container");
    expect(styles).toMatchSnapshot();
  });

  it("should produce consistent inputHeader styles", () => {
    const styles = getParsedStyles("inputHeader");
    expect(styles).toMatchSnapshot();
  });

  it("should produce consistent list styles", () => {
    const styles = getParsedStyles("list");
    expect(styles).toMatchSnapshot();
  });

  it("should produce consistent item styles", () => {
    const styles = getParsedStyles("item");
    expect(styles).toMatchSnapshot();
  });

  it("should produce consistent footer styles", () => {
    const styles = getParsedStyles("footer");
    expect(styles).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   */
  it("should produce consistent intermediate data (golden path)", () => {
    const allData = getAllCommandPaletteData();

    // Verify structure exists
    expect(allData.config).toBeDefined();
    expect(allData.classes).toBeDefined();
    expect(allData.parsedStyles).toBeDefined();
    expect(allData.subComponents.length).toBeGreaterThan(0);

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
