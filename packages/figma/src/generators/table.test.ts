/**
 * Tests for table.ts component generator
 *
 * These tests ensure the Table Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the table
 * generator, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * table.tsx → component-registry.json → table.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getTableComponentConfig,
  getTableLayoutConfig,
  getTableRowVariantConfig,
  getTableCellConfig,
  getTableHeaderConfig,
  getTableBodyCellConfig,
  getTableSelectedRowConfig,
  getTableCompleteConfig,
  getAllTableVariantData,
  TABLE_CONFIGS_EXPORT,
  TABLE_LAYOUT_VALUES,
  TABLE_VARIANT_VALUES,
} from "./table";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";
import themeData from "../generated/theme-data.json";

// Import registry as source of truth
import registry from "../../../kumo/ai/component-registry.json";

// Use type assertion for Table component
const tableComponent = (registry.components as Record<string, unknown>)
  .Table as {
  name: string;
  description: string;
  props: {
    layout: {
      type: string;
      values: string[];
      default: string;
      descriptions: Record<string, string>;
    };
    variant: {
      type: string;
      values: string[];
      default: string;
      descriptions: Record<string, string>;
    };
  };
  colors: string[];
  subComponents: Record<string, unknown>;
};

describe("Table Generator - Registry Validation", () => {
  it("should have Table component in registry", () => {
    expect(tableComponent).toBeDefined();
    expect(tableComponent.name).toBe("Table");
  });

  it("should have layout prop with expected values", () => {
    const layoutProp = tableComponent.props.layout;
    expect(layoutProp.values).toContain("auto");
    expect(layoutProp.values).toContain("fixed");
    expect(layoutProp.default).toBe("auto");
  });

  it("should have variant prop with expected values", () => {
    const variantProp = tableComponent.props.variant;
    expect(variantProp.values).toContain("default");
    expect(variantProp.values).toContain("selected");
    expect(variantProp.default).toBe("default");
  });

  it("should have expected colors in registry", () => {
    expect(tableComponent.colors).toContain("bg-accent");
    expect(tableComponent.colors).toContain("bg-surface");
    expect(tableComponent.colors).toContain("border-color");
    expect(tableComponent.colors).toContain("text-surface");
  });

  it("should have expected sub-components", () => {
    const subComponents = Object.keys(tableComponent.subComponents);
    expect(subComponents).toContain("Header");
    expect(subComponents).toContain("Head");
    expect(subComponents).toContain("Row");
    expect(subComponents).toContain("Body");
    expect(subComponents).toContain("Cell");
    expect(subComponents).toContain("Footer");
  });
});

describe("Table Generator - Component Config", () => {
  it("should return valid component config", () => {
    const config = getTableComponentConfig();

    expect(config.name).toBe("Table");
    expect(config.description).toBeDefined();
    expect(config.props).toBeDefined();
    expect(config.colors).toContain("bg-accent");
    expect(config.subComponents.length).toBeGreaterThan(0);
  });
});

describe("Table Generator - Layout Config", () => {
  it("should return valid layout config from registry", () => {
    const config = getTableLayoutConfig();

    expect(config.values).toContain("auto");
    expect(config.values).toContain("fixed");
    expect(config.default).toBe("auto");
    expect(config.descriptions.auto).toBeDefined();
    expect(config.descriptions.fixed).toBeDefined();
  });

  it("should match registry layout values", () => {
    expect(TABLE_LAYOUT_VALUES).toEqual(tableComponent.props.layout.values);
  });
});

describe("Table Generator - Row Variant Config", () => {
  it("should return valid row variant config from registry", () => {
    const config = getTableRowVariantConfig();

    expect(config.values).toContain("default");
    expect(config.values).toContain("selected");
    expect(config.default).toBe("default");
    expect(config.descriptions.default).toBeDefined();
    expect(config.descriptions.selected).toBeDefined();
  });

  it("should match registry variant values", () => {
    expect(TABLE_VARIANT_VALUES).toEqual(tableComponent.props.variant.values);
  });
});

describe("Table Generator - Cell Config", () => {
  it("should return valid cell config", () => {
    const config = getTableCellConfig();

    // p-3 = 12px
    expect(config.padding).toBe(themeData.tailwind.spacing.scale["3"]);
    expect(config.borderWidth).toBe(FALLBACK_VALUES.strokeWeight);
    expect(config.borderVariable).toBe("color-border");
  });
});

describe("Table Generator - Header Config", () => {
  it("should return valid header config", () => {
    const config = getTableHeaderConfig();

    expect(config.fontSize).toBe(FONT_SIZE.base);
    expect(config.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
    expect(config.textVariable).toBe("text-color-surface");
    expect(config.bgVariable).toBe("color-surface");
  });
});

describe("Table Generator - Body Cell Config", () => {
  it("should return valid body cell config", () => {
    const config = getTableBodyCellConfig();

    expect(config.fontSize).toBe(FONT_SIZE.base);
    expect(config.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
    expect(config.textVariable).toBe("text-color-surface");
  });
});

describe("Table Generator - Selected Row Config", () => {
  it("should return valid selected row config", () => {
    const config = getTableSelectedRowConfig();

    expect(config.bgVariable).toBe("color-accent");
  });
});

describe("Table Generator - Complete Config", () => {
  it("should return config for auto layout without selection", () => {
    const config = getTableCompleteConfig({
      layout: "auto",
      hasSelectedRow: false,
    });

    expect(config.layout).toBe("auto");
    expect(config.hasSelectedRow).toBe(false);
    expect(config.cellConfig).toBeDefined();
    expect(config.headerConfig).toBeDefined();
    expect(config.bodyCellConfig).toBeDefined();
    expect(config.selectedRowConfig).toBeNull();
    expect(config.sampleData).toBeDefined();
  });

  it("should return config for auto layout with selection", () => {
    const config = getTableCompleteConfig({
      layout: "auto",
      hasSelectedRow: true,
    });

    expect(config.layout).toBe("auto");
    expect(config.hasSelectedRow).toBe(true);
    expect(config.selectedRowConfig).not.toBeNull();
    expect(config.selectedRowConfig?.bgVariable).toBe("color-accent");
  });

  it("should return config for fixed layout without selection", () => {
    const config = getTableCompleteConfig({
      layout: "fixed",
      hasSelectedRow: false,
    });

    expect(config.layout).toBe("fixed");
    expect(config.hasSelectedRow).toBe(false);
    expect(config.selectedRowConfig).toBeNull();
  });

  it("should return config for fixed layout with selection", () => {
    const config = getTableCompleteConfig({
      layout: "fixed",
      hasSelectedRow: true,
    });

    expect(config.layout).toBe("fixed");
    expect(config.hasSelectedRow).toBe(true);
    expect(config.selectedRowConfig).not.toBeNull();
  });

  it("should include sample data with headers and rows", () => {
    const config = getTableCompleteConfig({
      layout: "auto",
      hasSelectedRow: false,
    });

    expect(config.sampleData.headers.length).toBe(3);
    expect(config.sampleData.rows.length).toBe(3);
    expect(config.sampleData.headers).toEqual(["Name", "Status", "Type"]);
  });
});

describe("Table Generator - Variant Configurations", () => {
  it("should have 4 table configurations", () => {
    expect(TABLE_CONFIGS_EXPORT.length).toBe(4);
  });

  it("should have all combinations of layout and hasSelectedRow", () => {
    const configs = TABLE_CONFIGS_EXPORT;

    // auto layout, no selection
    expect(configs).toContainEqual({ layout: "auto", hasSelectedRow: false });

    // auto layout, with selection
    expect(configs).toContainEqual({ layout: "auto", hasSelectedRow: true });

    // fixed layout, no selection
    expect(configs).toContainEqual({ layout: "fixed", hasSelectedRow: false });

    // fixed layout, with selection
    expect(configs).toContainEqual({ layout: "fixed", hasSelectedRow: true });
  });
});

describe("Table Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in layout logic
   * 3. Validating the full source of truth chain:
   *    table.tsx → component-registry.json → table.ts → Figma
   */

  it("should produce consistent component config", () => {
    const config = getTableComponentConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent layout config", () => {
    const config = getTableLayoutConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent row variant config", () => {
    const config = getTableRowVariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent cell config", () => {
    const config = getTableCellConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent header config", () => {
    const config = getTableHeaderConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent body cell config", () => {
    const config = getTableBodyCellConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent selected row config", () => {
    const config = getTableSelectedRowConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for auto layout", () => {
    const config = getTableCompleteConfig({
      layout: "auto",
      hasSelectedRow: false,
    });
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent complete config for fixed layout with selection", () => {
    const config = getTableCompleteConfig({
      layout: "fixed",
      hasSelectedRow: true,
    });
    expect(config).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * table.ts computes before making any Figma API calls.
   */
  it("should produce consistent all variant data (golden path)", () => {
    const allData = getAllTableVariantData();

    // Verify structure exists
    expect(allData.componentConfig).toBeDefined();
    expect(allData.layoutConfig).toBeDefined();
    expect(allData.rowVariantConfig).toBeDefined();
    expect(allData.cellConfig).toBeDefined();
    expect(allData.headerConfig).toBeDefined();
    expect(allData.bodyCellConfig).toBeDefined();
    expect(allData.selectedRowConfig).toBeDefined();
    expect(allData.sampleData).toBeDefined();
    expect(allData.configs.length).toBe(4);

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
