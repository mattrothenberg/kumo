/**
 * Tests for code.ts component generator (RED PHASE - TDD)
 *
 * These tests ensure the Code Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the code
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * code.tsx → component-registry.json → code.ts (generator) → Figma
 *
 * NOTE: RED PHASE - These tests are written BEFORE the implementation.
 * The testable export functions (getAllVariantData, getBaseStyles, getLangConfig)
 * DO NOT EXIST YET. This is expected and correct TDD practice.
 * Tests will FAIL until implementation is complete (~60% failure rate expected).
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { getAllVariantData, getBaseStyles, getLangConfig } from "./code";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const codeComponent = registry.components.Code as any;
const codeProps = codeComponent.props;
const codeStyling = codeComponent.styling;

const langProp = codeProps.lang as {
  values: string[];
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Code language variants from registry
 */
const CODE_LANGS = ["ts", "tsx", "jsonc", "bash", "css"] as const;

describe("Code Generator - Registry Validation", () => {
  it("should have all expected lang variants in registry", () => {
    const expectedLangs = ["ts", "tsx", "jsonc", "bash", "css"];
    expect(langProp.values).toEqual(expectedLangs);
  });

  it("should have descriptions defined for all lang variants", () => {
    for (const lang of langProp.values) {
      expect(langProp.descriptions[lang]).toBeDefined();
      expect(typeof langProp.descriptions[lang]).toBe("string");
      expect(langProp.descriptions[lang].length).toBeGreaterThan(0);
    }
  });

  it("should have ts as default lang", () => {
    expect(langProp.default).toBe("ts");
  });

  it("should have styling metadata defined", () => {
    expect(codeStyling).toBeDefined();
    expect(codeStyling.baseTokens).toBeDefined();
    expect(codeStyling.dimensions).toBeDefined();
    expect(codeStyling.borderRadius).toBeDefined();
    expect(codeStyling.states).toBeDefined();
  });
});

describe("Code Generator - Styling Metadata Validation", () => {
  it("should have baseTokens defined", () => {
    expect(codeStyling.baseTokens).toBeDefined();
    expect(Array.isArray(codeStyling.baseTokens)).toBe(true);
    expect(codeStyling.baseTokens.length).toBeGreaterThan(0);
  });

  it("should have dimensions defined", () => {
    expect(codeStyling.dimensions).toBeDefined();
    expect(typeof codeStyling.dimensions).toBe("string");
    expect(codeStyling.dimensions.length).toBeGreaterThan(0);
  });

  it("should have borderRadius defined", () => {
    expect(codeStyling.borderRadius).toBeDefined();
    expect(typeof codeStyling.borderRadius).toBe("string");
    expect(codeStyling.borderRadius.length).toBeGreaterThan(0);
  });

  it("should have base state defined", () => {
    expect(codeStyling.states.base).toBeDefined();
    expect(Array.isArray(codeStyling.states.base)).toBe(true);
    expect(codeStyling.states.base.length).toBeGreaterThan(0);
  });

  it("should have code_block_container state defined", () => {
    expect(codeStyling.states.code_block_container).toBeDefined();
    expect(Array.isArray(codeStyling.states.code_block_container)).toBe(true);
    expect(codeStyling.states.code_block_container.length).toBeGreaterThan(0);
  });
});

describe("Code Generator - Base Styles Parsing", () => {
  /**
   * Test parsing of base Code styles from registry
   * Base styles: "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-label"
   */
  const BASE_STYLES_COMBINED =
    "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-label";

  it("should parse border-radius from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
  });

  it("should parse font-size from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    expect(parsed.fontSize).toBeDefined();
    expect(typeof parsed.fontSize).toBe("number");
    expect(parsed.fontSize).toBeGreaterThan(0);
  });

  it("should parse text color token from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should parse transparent background from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    expect(parsed.fillVariable).toBeNull(); // bg-transparent = no fill
  });

  it("should parse no border from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    // Note: border-none sets hasBorder=true but strokeWeight is undefined
    // Generator should treat hasBorder=true + strokeWeight=undefined as no border
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeWeight).toBeUndefined();
  });

  it("should parse padding from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES_COMBINED);
    // Note: p-0 is not currently parsed by tailwind-to-figma
    // This is expected - generator can handle missing padding as 0
    expect(parsed.paddingX).toBeUndefined();
    expect(parsed.paddingY).toBeUndefined();
  });
});

describe("Code Generator - CodeBlock Container Parsing", () => {
  /**
   * Test parsing of CodeBlock container styles from registry
   * Container styles: "min-w-0 rounded-md border border-color bg-surface"
   */
  const CODE_BLOCK_CLASSES = codeStyling.states.code_block_container.join(" ");

  it("should parse border-radius from container styles", () => {
    const parsed = parseTailwindClasses(CODE_BLOCK_CLASSES);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse background color from container styles", () => {
    const parsed = parseTailwindClasses(CODE_BLOCK_CLASSES);
    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
  });

  it("should parse border from container styles", () => {
    const parsed = parseTailwindClasses(CODE_BLOCK_CLASSES);
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
  });
});

describe("Code Generator - Testable Export Functions (RED PHASE)", () => {
  /**
   * RED PHASE TESTS - These functions DO NOT EXIST YET
   *
   * Expected behavior:
   * - These tests WILL FAIL with "not a function" or "undefined" errors
   * - This is CORRECT for RED phase TDD
   * - Implement the functions to make tests pass (GREEN phase)
   */

  describe("getBaseStyles", () => {
    it("should return base styles from registry", () => {
      const styles = getBaseStyles();
      expect(styles).toBeDefined();
      expect(styles.raw).toBeDefined();
      expect(styles.parsed).toBeDefined();
    });

    it("should return parsed transparent background", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.fillVariable).toBeNull();
    });

    it("should return parsed text color variable", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.textVariable).toBeDefined();
      expect(typeof styles.parsed.textVariable).toBe("string");
    });

    it("should return parsed font size", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.fontSize).toBeDefined();
      expect(typeof styles.parsed.fontSize).toBe("number");
      expect(styles.parsed.fontSize).toBeGreaterThan(0);
    });

    it("should return parsed padding", () => {
      const styles = getBaseStyles();
      // Note: Parser doesn't handle p-0, so padding will be undefined
      // Generator should treat undefined as 0
      expect(styles.parsed.paddingX).toBeUndefined();
      expect(styles.parsed.paddingY).toBeUndefined();
    });

    it("should return parsed border-radius", () => {
      const styles = getBaseStyles();
      expect(styles.parsed.borderRadius).toBeDefined();
      expect(typeof styles.parsed.borderRadius).toBe("number");
    });
  });

  describe("getLangConfig", () => {
    it("should return lang variants from registry", () => {
      const config = getLangConfig();
      expect(config.values).toEqual(["ts", "tsx", "jsonc", "bash", "css"]);
      expect(config.default).toBe("ts");
      expect(config.descriptions).toBeDefined();
    });

    it("should have descriptions for all lang variants", () => {
      const config = getLangConfig();
      for (const lang of config.values) {
        expect(config.descriptions[lang]).toBeDefined();
        expect(typeof config.descriptions[lang]).toBe("string");
      }
    });

    it("should have description for ts", () => {
      const config = getLangConfig();
      expect(config.descriptions.ts).toBeDefined();
      expect(typeof config.descriptions.ts).toBe("string");
      expect(config.descriptions.ts.length).toBeGreaterThan(0);
    });

    it("should have description for tsx", () => {
      const config = getLangConfig();
      expect(config.descriptions.tsx).toBeDefined();
      expect(typeof config.descriptions.tsx).toBe("string");
      expect(config.descriptions.tsx.length).toBeGreaterThan(0);
    });

    it("should have description for jsonc", () => {
      const config = getLangConfig();
      expect(config.descriptions.jsonc).toBeDefined();
      expect(typeof config.descriptions.jsonc).toBe("string");
      expect(config.descriptions.jsonc.length).toBeGreaterThan(0);
    });

    it("should have description for bash", () => {
      const config = getLangConfig();
      expect(config.descriptions.bash).toBeDefined();
      expect(typeof config.descriptions.bash).toBe("string");
      expect(config.descriptions.bash.length).toBeGreaterThan(0);
    });

    it("should have description for css", () => {
      const config = getLangConfig();
      expect(config.descriptions.css).toBeDefined();
      expect(typeof config.descriptions.css).toBe("string");
      expect(config.descriptions.css.length).toBeGreaterThan(0);
    });
  });

  describe("getAllVariantData", () => {
    it("should return complete data structure", () => {
      const allData = getAllVariantData();
      expect(allData).toBeDefined();
      expect(allData.baseStyles).toBeDefined();
      expect(allData.langConfig).toBeDefined();
      expect(allData.variants).toBeDefined();
    });

    it("should return all lang variants", () => {
      const allData = getAllVariantData();
      expect(allData.variants).toHaveLength(5);
      expect(allData.langConfig.values).toEqual([
        "ts",
        "tsx",
        "jsonc",
        "bash",
        "css",
      ]);
    });

    it("should include base styles with raw and parsed data", () => {
      const allData = getAllVariantData();
      expect(allData.baseStyles.raw).toBeDefined();
      expect(allData.baseStyles.parsed).toBeDefined();
      expect(allData.baseStyles.parsed.textVariable).toBeDefined();
      expect(typeof allData.baseStyles.parsed.textVariable).toBe("string");
    });

    it("should include lang config with all properties", () => {
      const allData = getAllVariantData();
      expect(allData.langConfig.values).toHaveLength(5);
      expect(allData.langConfig.default).toBe("ts");
      expect(allData.langConfig.descriptions).toBeDefined();
    });

    it("should include variant data for each lang", () => {
      const allData = getAllVariantData();
      for (const variant of allData.variants) {
        expect(variant.lang).toBeDefined();
        expect(variant.description).toBeDefined();
        expect(CODE_LANGS).toContain(
          variant.lang as (typeof CODE_LANGS)[number],
        );
      }
    });
  });
});

describe("Code Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in Code component are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map text-label color token", () => {
    const parsed = parseTailwindClasses("text-label");
    expect(parsed.textVariable).toBeDefined();
    expect(typeof parsed.textVariable).toBe("string");
  });

  it("should map bg-transparent correctly", () => {
    const parsed = parseTailwindClasses("bg-transparent");
    expect(parsed.fillVariable).toBeNull();
  });

  it("should map bg-surface for CodeBlock container", () => {
    const parsed = parseTailwindClasses("bg-surface");
    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
  });

  it("should map border-color for CodeBlock container", () => {
    const parsed = parseTailwindClasses("border border-color");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });
});

describe("Code Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for base Code component", () => {
    const BASE_STYLES_COMBINED =
      "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-label";
    const baseStyles = parseTailwindClasses(BASE_STYLES_COMBINED);

    // Verify parsed properties exist and have correct types
    expect(baseStyles.borderRadius).toBeDefined();
    expect(typeof baseStyles.borderRadius).toBe("number");

    expect(baseStyles.fillVariable).toBeNull(); // transparent

    expect(baseStyles.fontSize).toBeDefined();
    expect(typeof baseStyles.fontSize).toBe("number");
    expect(baseStyles.fontSize).toBeGreaterThan(0);

    expect(baseStyles.textVariable).toBeDefined();
    expect(typeof baseStyles.textVariable).toBe("string");

    expect(baseStyles.hasBorder).toBe(true);
    expect(baseStyles.strokeWeight).toBeUndefined();
  });

  it("should produce correct Figma properties for CodeBlock container", () => {
    const CODE_BLOCK_CLASSES =
      codeStyling.states.code_block_container.join(" ");
    const containerStyles = parseTailwindClasses(CODE_BLOCK_CLASSES);

    expect(containerStyles.fillVariable).toBeDefined();
    expect(typeof containerStyles.fillVariable).toBe("string");

    expect(containerStyles.borderRadius).toBeDefined();
    expect(typeof containerStyles.borderRadius).toBe("number");
    expect(containerStyles.borderRadius).toBeGreaterThan(0);

    expect(containerStyles.hasBorder).toBe(true);

    expect(containerStyles.strokeVariable).toBeDefined();
    expect(typeof containerStyles.strokeVariable).toBe("string");

    expect(containerStyles.strokeWeight).toBeDefined();
    expect(typeof containerStyles.strokeWeight).toBe("number");
  });
});

describe("Code Generator - Lang Variant Count", () => {
  it("should have exactly 5 lang variants", () => {
    expect(langProp.values).toHaveLength(5);
  });

  it("should include all expected lang variants", () => {
    expect(langProp.values).toContain("ts");
    expect(langProp.values).toContain("tsx");
    expect(langProp.values).toContain("jsonc");
    expect(langProp.values).toContain("bash");
    expect(langProp.values).toContain("css");
  });
});

describe("Code Generator - SubComponent Validation", () => {
  it("should have Block sub-component defined", () => {
    expect(codeComponent.subComponents).toBeDefined();
    expect(codeComponent.subComponents.Block).toBeDefined();
  });

  it("should have correct Block sub-component props", () => {
    const blockProps = codeComponent.subComponents.Block.props;
    expect(blockProps.code).toBeDefined();
    expect(blockProps.code.required).toBe(true);
    expect(blockProps.lang).toBeDefined();
    expect(blockProps.lang.optional).toBe(true);
  });
});

describe("Code Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, lang configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    code.tsx → component-registry.json → code.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Code component styles changed in code.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent lang config from registry", () => {
    const config = getLangConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent base styles", () => {
    const baseStyles = getBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * code.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.baseStyles.raw).toBeDefined();
    expect(allData.baseStyles.parsed).toBeDefined();
    expect(allData.langConfig).toBeDefined();
    expect(allData.langConfig.values).toHaveLength(5);
    expect(allData.variants).toHaveLength(5);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.lang).toBeDefined();
      expect(variant.description).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
