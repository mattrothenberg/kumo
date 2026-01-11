/**
 * Tests for page-header.ts generator
 * Source of truth chain: page-header.tsx → component-registry.json → page-header.ts → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getPageHeaderSpacingConfig,
  getPageHeaderParsedBaseStyles,
  getPageHeaderParsedSpacingStyles,
  getPageHeaderColorBindings,
  getPageHeaderLayoutConfig,
  getAllPageHeaderData,
} from "./page-header";
import registry from "../../../../ai/component-registry.json";

describe("PageHeader Generator - Registry Validation", () => {
  it("should have PageHeader component in registry", () => {
    expect(registry.components.PageHeader).toBeDefined();
  });

  it("should have spacing prop in registry", () => {
    const pageHeaderComponent = registry.components.PageHeader;
    expect(pageHeaderComponent.props.spacing).toBeDefined();
  });

  it("should have spacing values defined", () => {
    const config = getPageHeaderSpacingConfig();
    expect(config.values.length).toBeGreaterThan(0);
  });

  it("should have classes defined for all spacings", () => {
    const config = getPageHeaderSpacingConfig();
    for (const spacing of config.values) {
      expect(config.classes[spacing]).toBeDefined();
    }
  });

  it("should include required spacing variants", () => {
    const config = getPageHeaderSpacingConfig();
    expect(config.default).toBeDefined();
    expect(config.values).toContain(config.default);
  });
});

describe("PageHeader Generator - Configuration", () => {
  it("should return spacing config from registry", () => {
    const config = getPageHeaderSpacingConfig();
    expect(config.values).toBeDefined();
    expect(config.classes).toBeDefined();
    expect(config.descriptions).toBeDefined();
    expect(config.default).toBeDefined();
  });

  it("should return color bindings", () => {
    const colors = getPageHeaderColorBindings();
    expect(colors.border).toBeDefined();
    expect(colors.titleText).toBeDefined();
    expect(colors.descriptionText).toBeDefined();
  });

  it("should return layout config with sections", () => {
    const layout = getPageHeaderLayoutConfig();
    expect(layout.breadcrumbs).toBeDefined();
    expect(layout.titleSection).toBeDefined();
    expect(layout.title).toBeDefined();
    expect(layout.description).toBeDefined();
    expect(layout.tabsSection).toBeDefined();
  });
});

describe("PageHeader Generator - Structural Validation", () => {
  it("should parse base styles", () => {
    const parsed = getPageHeaderParsedBaseStyles();
    expect(parsed).toBeDefined();
  });

  it("should parse spacing styles for each spacing", () => {
    const config = getPageHeaderSpacingConfig();
    for (const spacing of config.values) {
      const spacingData = getPageHeaderParsedSpacingStyles(spacing);
      expect(spacingData.spacing).toBe(spacing);
      expect(spacingData.classes).toBeDefined();
      expect(spacingData.parsed).toBeDefined();
    }
  });

  it("should have layout data for all spacings", () => {
    const allData = getAllPageHeaderData();
    expect(allData.spacings.length).toBeGreaterThan(0);
    for (const spacingData of allData.spacings) {
      expect(spacingData.layout).toBeDefined();
      expect(spacingData.layout.gap).toBeDefined();
    }
  });
});

describe("PageHeader Generator - Snapshots", () => {
  it("should produce consistent spacing config", () => {
    expect(getPageHeaderSpacingConfig()).toMatchSnapshot();
  });

  it("should produce consistent base styles", () => {
    expect(getPageHeaderParsedBaseStyles()).toMatchSnapshot();
  });

  it("should produce consistent color bindings", () => {
    expect(getPageHeaderColorBindings()).toMatchSnapshot();
  });

  it("should produce consistent layout config", () => {
    expect(getPageHeaderLayoutConfig()).toMatchSnapshot();
  });

  it("should produce consistent complete data", () => {
    expect(getAllPageHeaderData()).toMatchSnapshot();
  });
});
