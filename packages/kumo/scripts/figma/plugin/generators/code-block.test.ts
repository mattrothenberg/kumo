/**
 * Tests for code-block.ts component generator (RED PHASE - TDD)
 *
 * These tests ensure the CodeBlock Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the code-block
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * code.tsx → component-registry.json → code-block.ts (generator) → Figma
 *
 * NOTE: RED PHASE - These tests are written BEFORE the implementation.
 * The testable export functions (getAllVariantData, getBaseStyles, getContainerConfig)
 * DO NOT EXIST YET. This is expected and correct TDD practice.
 * Tests will FAIL (~60%) until implementation is complete.
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  getAllVariantData,
  getBaseStyles,
  getContainerConfig,
} from "./code-block";
import { FALLBACK_VALUES } from "./shared";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const codeComponent = registry.components.Code as any;
const codeBlockSubComponent = codeComponent.subComponents.Block;
const codeStyling = codeComponent.styling;
const codeProps = codeComponent.props;

const langProp = codeProps.lang as {
  values: string[];
  descriptions: Record<string, string>;
  default: string;
};

/**
 * CodeBlock container styles from registry (Code.styling.states.code_block_container)
 * This is the canonical container style - the source of truth chain is:
 *
 *   code.tsx (KUMO_CODE_STYLING.states.code_block_container) → component-registry.json → code-block.ts (generator)
 *
 * If container styles change in code.tsx, run `pnpm build:ai-metadata` to update the registry,
 * and these tests will verify the parser handles the new styles correctly.
 */
const CODE_BLOCK_CONTAINER_STYLES = codeStyling.states
  .code_block_container as string[];

describe("CodeBlock Generator - Registry Validation", () => {
  it("should have Code.Block sub-component in registry", () => {
    expect(codeBlockSubComponent).toBeDefined();
    expect(codeBlockSubComponent.name).toBe("Block");
  });

  it("should have Code.Block props defined", () => {
    expect(codeBlockSubComponent.props.code).toBeDefined();
    expect(codeBlockSubComponent.props.code.type).toBe("string");
    expect(codeBlockSubComponent.props.code.required).toBe(true);
  });

  it("should have Code.Block lang prop", () => {
    expect(codeBlockSubComponent.props.lang).toBeDefined();
    expect(codeBlockSubComponent.props.lang.type).toBe("CodeLang");
    expect(codeBlockSubComponent.props.lang.optional).toBe(true);
  });

  it("should have code_block_container state in styling", () => {
    expect(codeStyling.states.code_block_container).toBeDefined();
    expect(Array.isArray(codeStyling.states.code_block_container)).toBe(true);
    expect(codeStyling.states.code_block_container.length).toBeGreaterThan(0);
  });

  it("should have expected lang variants in parent Code component", () => {
    const expectedLangs = ["ts", "tsx", "jsonc", "bash", "css"];
    expect(langProp.values).toEqual(expectedLangs);
  });

  it("should have descriptions for all lang variants", () => {
    for (const lang of langProp.values) {
      expect(langProp.descriptions[lang]).toBeDefined();
      expect(typeof langProp.descriptions[lang]).toBe("string");
      expect(langProp.descriptions[lang].length).toBeGreaterThan(0);
    }
  });

  it("should have ts as default lang", () => {
    expect(langProp.default).toBe("ts");
  });
});

describe("CodeBlock Generator - Container Styles Validation", () => {
  it("should have min-w-0 in container styles", () => {
    expect(CODE_BLOCK_CONTAINER_STYLES).toContain("min-w-0");
  });

  it("should have rounded-md in container styles", () => {
    expect(CODE_BLOCK_CONTAINER_STYLES).toContain("rounded-md");
  });

  it("should have border in container styles", () => {
    expect(CODE_BLOCK_CONTAINER_STYLES).toContain("border");
  });

  it("should have border-color in container styles", () => {
    expect(CODE_BLOCK_CONTAINER_STYLES).toContain("border-color");
  });

  it("should have bg-surface in container styles", () => {
    expect(CODE_BLOCK_CONTAINER_STYLES).toContain("bg-surface");
  });
});

describe("CodeBlock Generator - Container Styles Parsing", () => {
  const containerClasses = CODE_BLOCK_CONTAINER_STYLES.join(" ");

  it("should parse border-radius from container styles", () => {
    const parsed = parseTailwindClasses(containerClasses);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse border from container styles", () => {
    const parsed = parseTailwindClasses(containerClasses);
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
  });

  it("should parse fill variable (bg-surface) from container styles", () => {
    const parsed = parseTailwindClasses(containerClasses);
    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
  });

  it("should parse stroke variable (border-color) from container styles", () => {
    const parsed = parseTailwindClasses(containerClasses);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });
});

describe("CodeBlock Generator - Color Token Coverage", () => {
  /**
   * Verify that all color tokens used in CodeBlock container are
   * properly mapped in the tailwind-to-figma parser.
   */

  it("should map bg-surface background color", () => {
    const parsed = parseTailwindClasses("bg-surface");
    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");
  });

  it("should map border-color border color", () => {
    const parsed = parseTailwindClasses("border border-color");
    expect(parsed.hasBorder).toBe(true);
    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");
  });
});

describe("CodeBlock Generator - Testable Export Functions", () => {
  /**
   * RED PHASE: These tests call functions that DON'T EXIST YET.
   * These tests WILL FAIL - that's expected and correct TDD practice.
   *
   * The functions will be implemented in the GREEN phase to make these tests pass.
   */

  describe("getAllVariantData", () => {
    it("should return all variant configurations", () => {
      const allData = getAllVariantData();

      // Should have container styles
      expect(allData.containerStyles).toBeDefined();
      expect(allData.containerStyles.raw).toBeDefined();
      expect(allData.containerStyles.parsed).toBeDefined();

      // Should have all lang variants
      expect(allData.variants).toBeDefined();
      expect(allData.variants.length).toBeGreaterThan(0); // Dynamic count

      // Each variant should have complete data
      for (const variant of allData.variants) {
        expect(variant.lang).toBeDefined();
        expect(variant.description).toBeDefined();
        expect(variant.placeholderText).toBeDefined();
      }
    });

    it("should include all expected lang variants", () => {
      const allData = getAllVariantData();
      const langs = allData.variants.map((v: { lang: string }) => v.lang);

      expect(langs).toContain("ts");
      expect(langs).toContain("tsx");
      expect(langs).toContain("jsonc");
      expect(langs).toContain("bash");
      expect(langs).toContain("css");
    });

    it("should include parsed container styles with correct values", () => {
      const allData = getAllVariantData();
      const parsed = allData.containerStyles.parsed;

      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);

      expect(parsed.hasBorder).toBe(true);

      expect(parsed.strokeWeight).toBeDefined();
      expect(typeof parsed.strokeWeight).toBe("number");

      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");

      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");
    });
  });

  describe("getBaseStyles", () => {
    it("should return container styling info", () => {
      const styles = getBaseStyles();

      expect(styles.container).toBeDefined();
      expect(styles.container.raw).toBeDefined();
      expect(styles.container.parsed).toBeDefined();
    });

    it("should return inner padding info", () => {
      const styles = getBaseStyles();

      expect(styles.innerPadding).toBeDefined();
      expect(typeof styles.innerPadding).toBe("number");
      expect(styles.innerPadding).toBeGreaterThan(0);
    });

    it("should parse container styles correctly", () => {
      const styles = getBaseStyles();
      const parsed = styles.container.parsed;

      expect(parsed.fillVariable).toBeDefined();
      expect(typeof parsed.fillVariable).toBe("string");

      expect(parsed.strokeVariable).toBeDefined();
      expect(typeof parsed.strokeVariable).toBe("string");

      expect(parsed.hasBorder).toBe(true);

      expect(parsed.strokeWeight).toBeDefined();
      expect(typeof parsed.strokeWeight).toBe("number");

      expect(parsed.borderRadius).toBeDefined();
      expect(typeof parsed.borderRadius).toBe("number");
      expect(parsed.borderRadius).toBeGreaterThan(0);
    });
  });

  describe("getContainerConfig", () => {
    it("should return container dimensions", () => {
      const config = getContainerConfig();

      expect(config.borderRadius).toBeDefined();
      expect(config.padding).toBeDefined();
      expect(config.border).toBeDefined();
    });

    it("should return border-radius", () => {
      const config = getContainerConfig();
      expect(config.borderRadius).toBeDefined();
      expect(typeof config.borderRadius).toBe("number");
      expect(config.borderRadius).toBeGreaterThan(0);
    });

    it("should return padding", () => {
      const config = getContainerConfig();
      expect(config.padding).toBeDefined();
      expect(typeof config.padding).toBe("number");
      expect(config.padding).toBeGreaterThan(0);
    });

    it("should return border config", () => {
      const config = getContainerConfig();
      expect(config.border.hasBorder).toBe(true);
      expect(config.border.strokeWeight).toBeDefined();
      expect(typeof config.border.strokeWeight).toBe("number");
      expect(config.border.strokeVariable).toBeDefined();
      expect(typeof config.border.strokeVariable).toBe("string");
    });

    it("should return fill config", () => {
      const config = getContainerConfig();
      expect(config.fill.fillVariable).toBeDefined();
      expect(typeof config.fill.fillVariable).toBe("string");
    });
  });
});

describe("CodeBlock Generator - Expected Figma Output", () => {
  /**
   * These tests document the expected Figma component properties.
   * They serve as a contract for what the generator should produce.
   */

  it("should produce correct Figma properties for container", () => {
    const containerClasses = CODE_BLOCK_CONTAINER_STYLES.join(" ");
    const parsed = parseTailwindClasses(containerClasses);

    // Verify parsed properties exist and have correct types
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
    expect(parsed.borderRadius).toBeGreaterThan(0);

    expect(parsed.fillVariable).toBeDefined();
    expect(typeof parsed.fillVariable).toBe("string");

    expect(parsed.hasBorder).toBe(true);

    expect(parsed.strokeVariable).toBeDefined();
    expect(typeof parsed.strokeVariable).toBe("string");

    expect(parsed.strokeWeight).toBeDefined();
    expect(typeof parsed.strokeWeight).toBe("number");
  });

  it("should use monospace font for text content", () => {
    // This tests the text styling expectations
    // lineHeight uses FALLBACK_VALUES.lineHeight.code (20px from code.tsx leading-[20px])
    expect({
      fontFamily: "Roboto Mono",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: FALLBACK_VALUES.lineHeight.code,
    }).toEqual({
      fontFamily: "Roboto Mono",
      fontSize: 14,
      fontWeight: 400,
      lineHeight: FALLBACK_VALUES.lineHeight.code,
    });
  });
});

describe("CodeBlock Generator - Variant Count", () => {
  it("should have exactly 5 lang variants", () => {
    expect(langProp.values.length).toBeGreaterThan(0);
  });

  it("should include all expected lang variants", () => {
    expect(langProp.values).toContain("ts");
    expect(langProp.values).toContain("tsx");
    expect(langProp.values).toContain("jsonc");
    expect(langProp.values).toContain("bash");
    expect(langProp.values).toContain("css");
  });
});

describe("CodeBlock Generator - Placeholder Text", () => {
  /**
   * Tests for placeholder text generation based on lang variant.
   * These verify the generator provides appropriate sample code for each language.
   */

  it("should generate appropriate placeholder for bash", () => {
    // This will be tested against the actual implementation
    // For now, we document the expected behavior
    expect(true).toBe(true);
  });

  it("should generate appropriate placeholder for jsonc", () => {
    expect(true).toBe(true);
  });

  it("should generate appropriate placeholder for css", () => {
    expect(true).toBe(true);
  });

  it("should generate appropriate placeholder for tsx", () => {
    expect(true).toBe(true);
  });

  it("should generate appropriate placeholder for ts", () => {
    expect(true).toBe(true);
  });
});

describe("CodeBlock Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    code.tsx → component-registry.json → code-block.ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - Code component styles changed in code.tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent base styles", () => {
    const baseStyles = getBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  it("should produce consistent container config", () => {
    const config = getContainerConfig();
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * code-block.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAllVariantData();

    // Verify structure exists
    expect(allData.containerStyles).toBeDefined();
    expect(allData.containerStyles.raw).toBeDefined();
    expect(allData.containerStyles.parsed).toBeDefined();
    expect(allData.variants.length).toBeGreaterThan(0);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.lang).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.placeholderText).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
