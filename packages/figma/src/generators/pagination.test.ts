/**
 * Tests for pagination.ts generator
 *
 * These tests ensure the Pagination Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the pagination
 * generator, these tests will catch any unintended changes.
 *
 * Source of truth chain:
 * pagination.tsx → component-registry.json → pagination.ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import {
  getPaginationDimensionsConfig,
  getPaginationStateConfig,
  getPaginationColorBindings,
  calculateShowingRange,
  getButtonStates,
  getAllPaginationData,
} from "./pagination";

// Import registry as source of truth
import registry from "../../../kumo/ai/component-registry.json";

const componentData = registry.components.Pagination;
const props = componentData.props;

describe("Pagination Generator - Registry Validation", () => {
  it("should have Pagination component in registry", () => {
    expect(componentData).toBeDefined();
    expect(componentData.name).toBe("Pagination");
    expect(componentData.category).toBe("Navigation");
  });

  it("should have required props defined", () => {
    expect(props.setPage).toBeDefined();
    expect(props.setPage.type).toBe("(page: number) => void");
    expect(props.setPage.required).toBe(true);
  });

  it("should have optional props defined", () => {
    expect(props.page).toBeDefined();
    expect(props.page.optional).toBe(true);
    expect(props.perPage).toBeDefined();
    expect(props.perPage.optional).toBe(true);
    expect(props.totalCount).toBeDefined();
    expect(props.totalCount.optional).toBe(true);
  });

  it("should have examples defined", () => {
    expect(componentData.examples).toBeDefined();
    expect(Array.isArray(componentData.examples)).toBe(true);
    expect(componentData.examples.length).toBeGreaterThan(0);
  });
});

describe("Pagination Generator - Dimensions Configuration", () => {
  const dimensions = getPaginationDimensionsConfig();

  it("should have all dimension properties defined", () => {
    expect(dimensions.paginationHeight).toBeDefined();
    expect(dimensions.buttonSize).toBeDefined();
    expect(dimensions.inputWidth).toBeDefined();
    expect(dimensions.iconSize).toBeDefined();
    expect(dimensions.gap).toBeDefined();
    expect(dimensions.borderRadius).toBeDefined();
  });

  it("should have numeric values for all dimensions", () => {
    expect(typeof dimensions.paginationHeight).toBe("number");
    expect(typeof dimensions.buttonSize).toBe("number");
    expect(typeof dimensions.inputWidth).toBe("number");
    expect(typeof dimensions.iconSize).toBe("number");
    expect(typeof dimensions.gap).toBe("number");
    expect(typeof dimensions.borderRadius).toBe("number");
  });

  it("should have positive values for non-zero dimensions", () => {
    expect(dimensions.paginationHeight).toBeGreaterThan(0);
    expect(dimensions.buttonSize).toBeGreaterThan(0);
    expect(dimensions.inputWidth).toBeGreaterThan(0);
    expect(dimensions.iconSize).toBeGreaterThan(0);
    expect(dimensions.borderRadius).toBeGreaterThan(0);
  });

  it("should have gap of 0 (buttons flush against each other)", () => {
    expect(dimensions.gap).toBe(0);
  });

  it("should have button size equal to pagination height", () => {
    expect(dimensions.buttonSize).toBe(dimensions.paginationHeight);
  });
});

describe("Pagination Generator - State Configuration", () => {
  const states = getPaginationStateConfig();

  it("should have 3 state variants", () => {
    expect(Array.isArray(states)).toBe(true);
    expect(states.length).toBe(3);
  });

  it("should have first page state", () => {
    const firstState = states.find((s) => s.label === "state=first");
    expect(firstState).toBeDefined();
    expect(firstState!.page).toBe(1);
  });

  it("should have middle page state", () => {
    const middleState = states.find((s) => s.label === "state=middle");
    expect(middleState).toBeDefined();
    expect(middleState!.page).toBeGreaterThan(1);
  });

  it("should have last page state", () => {
    const lastState = states.find((s) => s.label === "state=last");
    expect(lastState).toBeDefined();
    expect(lastState!.page).toBeGreaterThan(1);
  });

  it("should have page and label for each state", () => {
    states.forEach((state) => {
      expect(typeof state.page).toBe("number");
      expect(typeof state.label).toBe("string");
      expect(state.page).toBeGreaterThan(0);
      expect(state.label.length).toBeGreaterThan(0);
    });
  });
});

describe("Pagination Generator - Color Bindings", () => {
  const colors = getPaginationColorBindings();

  it("should have all color bindings defined", () => {
    expect(colors.buttonBackground).toBeDefined();
    expect(colors.buttonBorder).toBeDefined();
    expect(colors.iconEnabled).toBeDefined();
    expect(colors.iconDisabled).toBeDefined();
    expect(colors.inputBackground).toBeDefined();
    expect(colors.inputBorder).toBeDefined();
    expect(colors.inputText).toBeDefined();
    expect(colors.showingTextLabel).toBeDefined();
  });

  it("should use semantic tokens for all colors", () => {
    expect(typeof colors.buttonBackground).toBe("string");
    expect(typeof colors.buttonBorder).toBe("string");
    expect(typeof colors.iconEnabled).toBe("string");
    expect(typeof colors.iconDisabled).toBe("string");
    expect(typeof colors.inputBackground).toBe("string");
    expect(typeof colors.inputBorder).toBe("string");
    expect(typeof colors.inputText).toBe("string");
    expect(typeof colors.showingTextLabel).toBe("string");
  });

  it("should use correct semantic tokens for buttons", () => {
    expect(colors.buttonBackground).toBe("color-surface-2");
    expect(colors.buttonBorder).toBe("color-border");
  });

  it("should use correct semantic tokens for icons", () => {
    expect(colors.iconEnabled).toBe("text-color-surface");
    expect(colors.iconDisabled).toBe("text-color-disabled");
  });

  it("should use correct semantic tokens for input", () => {
    expect(colors.inputBackground).toBe("color-surface-2");
    expect(colors.inputBorder).toBe("color-border");
    expect(colors.inputText).toBe("text-color-surface");
  });

  it("should use correct semantic token for showing text", () => {
    expect(colors.showingTextLabel).toBe("text-color-label");
  });
});

describe("Pagination Generator - Showing Range Calculation", () => {
  it("should calculate first page range correctly", () => {
    const range = calculateShowingRange(1, 10, 100);
    expect(range.lower).toBe(1);
    expect(range.upper).toBe(10);
    expect(range.maxPage).toBe(10);
    expect(range.text).toBe("Showing 1-10 of 100");
  });

  it("should calculate middle page range correctly", () => {
    const range = calculateShowingRange(5, 10, 100);
    expect(range.lower).toBe(41);
    expect(range.upper).toBe(50);
    expect(range.maxPage).toBe(10);
    expect(range.text).toBe("Showing 41-50 of 100");
  });

  it("should calculate last page range correctly", () => {
    const range = calculateShowingRange(10, 10, 100);
    expect(range.lower).toBe(91);
    expect(range.upper).toBe(100);
    expect(range.maxPage).toBe(10);
    expect(range.text).toBe("Showing 91-100 of 100");
  });

  it("should handle partial last page correctly", () => {
    const range = calculateShowingRange(10, 10, 95);
    expect(range.lower).toBe(91);
    expect(range.upper).toBe(95);
    expect(range.maxPage).toBe(10);
    expect(range.text).toBe("Showing 91-95 of 95");
  });

  it("should have all required properties", () => {
    const range = calculateShowingRange(1, 10, 100);
    expect(typeof range.lower).toBe("number");
    expect(typeof range.upper).toBe("number");
    expect(typeof range.maxPage).toBe("number");
    expect(typeof range.text).toBe("string");
  });
});

describe("Pagination Generator - Button States", () => {
  it("should disable prev/first buttons on first page", () => {
    const states = getButtonStates(1, 10);
    expect(states.isFirstPage).toBe(true);
    expect(states.isLastPage).toBe(false);

    const firstBtn = states.buttons.find((b) => b.ariaLabel === "First page");
    const prevBtn = states.buttons.find((b) => b.ariaLabel === "Previous page");
    expect(firstBtn!.disabled).toBe(true);
    expect(prevBtn!.disabled).toBe(true);
  });

  it("should enable all buttons on middle page", () => {
    const states = getButtonStates(5, 10);
    expect(states.isFirstPage).toBe(false);
    expect(states.isLastPage).toBe(false);

    states.buttons.forEach((btn) => {
      expect(btn.disabled).toBe(false);
    });
  });

  it("should disable next/last buttons on last page", () => {
    const states = getButtonStates(10, 10);
    expect(states.isFirstPage).toBe(false);
    expect(states.isLastPage).toBe(true);

    const nextBtn = states.buttons.find((b) => b.ariaLabel === "Next page");
    const lastBtn = states.buttons.find((b) => b.ariaLabel === "Last page");
    expect(nextBtn!.disabled).toBe(true);
    expect(lastBtn!.disabled).toBe(true);
  });

  it("should have 4 navigation buttons", () => {
    const states = getButtonStates(5, 10);
    expect(states.buttons.length).toBe(4);
  });

  it("should have correct button configuration for first page", () => {
    const states = getButtonStates(1, 10);
    const firstBtn = states.buttons[0];
    expect(firstBtn.iconId).toBe("ph-caret-double-left");
    expect(firstBtn.ariaLabel).toBe("First page");
    expect(firstBtn.position).toBe("first");
  });

  it("should have correct button configuration for previous page", () => {
    const states = getButtonStates(1, 10);
    const prevBtn = states.buttons[1];
    expect(prevBtn.iconId).toBe("ph-caret-left");
    expect(prevBtn.ariaLabel).toBe("Previous page");
    expect(prevBtn.position).toBe("middle");
  });

  it("should have correct button configuration for next page", () => {
    const states = getButtonStates(1, 10);
    const nextBtn = states.buttons[2];
    expect(nextBtn.iconId).toBe("ph-caret-right");
    expect(nextBtn.ariaLabel).toBe("Next page");
    expect(nextBtn.position).toBe("middle");
  });

  it("should have correct button configuration for last page", () => {
    const states = getButtonStates(1, 10);
    const lastBtn = states.buttons[3];
    expect(lastBtn.iconId).toBe("ph-caret-double-right");
    expect(lastBtn.ariaLabel).toBe("Last page");
    expect(lastBtn.position).toBe("last");
  });

  it("should have required properties for each button", () => {
    const states = getButtonStates(5, 10);
    states.buttons.forEach((btn) => {
      expect(typeof btn.iconId).toBe("string");
      expect(typeof btn.ariaLabel).toBe("string");
      expect(typeof btn.position).toBe("string");
      expect(typeof btn.disabled).toBe("boolean");
    });
  });
});

describe("Pagination Generator - Complete Data Structure", () => {
  const allData = getAllPaginationData();

  it("should have all top-level properties defined", () => {
    expect(allData.dimensions).toBeDefined();
    expect(allData.colors).toBeDefined();
    expect(allData.states).toBeDefined();
  });

  it("should have 3 state variants with complete data", () => {
    expect(Array.isArray(allData.states)).toBe(true);
    expect(allData.states.length).toBe(3);
  });

  it("should have showing range for each state", () => {
    allData.states.forEach((state) => {
      expect(state.showingRange).toBeDefined();
      expect(typeof state.showingRange.lower).toBe("number");
      expect(typeof state.showingRange.upper).toBe("number");
      expect(typeof state.showingRange.maxPage).toBe("number");
      expect(typeof state.showingRange.text).toBe("string");
    });
  });

  it("should have button states for each state", () => {
    allData.states.forEach((state) => {
      expect(state.buttonStates).toBeDefined();
      expect(typeof state.buttonStates.isFirstPage).toBe("boolean");
      expect(typeof state.buttonStates.isLastPage).toBe("boolean");
      expect(Array.isArray(state.buttonStates.buttons)).toBe(true);
      expect(state.buttonStates.buttons.length).toBe(4);
    });
  });

  it("should have first page with prev/first buttons disabled", () => {
    const firstState = allData.states.find((s) => s.label === "state=first");
    expect(firstState).toBeDefined();
    expect(firstState!.buttonStates.isFirstPage).toBe(true);
    expect(firstState!.buttonStates.isLastPage).toBe(false);
  });

  it("should have middle page with all buttons enabled", () => {
    const middleState = allData.states.find((s) => s.label === "state=middle");
    expect(middleState).toBeDefined();
    expect(middleState!.buttonStates.isFirstPage).toBe(false);
    expect(middleState!.buttonStates.isLastPage).toBe(false);
  });

  it("should have last page with next/last buttons disabled", () => {
    const lastState = allData.states.find((s) => s.label === "state=last");
    expect(lastState).toBeDefined();
    expect(lastState!.buttonStates.isFirstPage).toBe(false);
    expect(lastState!.buttonStates.isLastPage).toBe(true);
  });
});

describe("Pagination Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (dimensions, colors, states,
   * showing range calculations, button states) BEFORE it hits Figma APIs.
   *
   * If these snapshots change unexpectedly, it means:
   * - Pagination layout constants changed (review carefully)
   * - Color bindings changed (review carefully)
   * - Calculation logic changed (review carefully)
   */

  it("should produce consistent dimensions config", () => {
    const dimensions = getPaginationDimensionsConfig();
    expect(dimensions).toMatchSnapshot();
  });

  it("should produce consistent state config", () => {
    const states = getPaginationStateConfig();
    expect(states).toMatchSnapshot();
  });

  it("should produce consistent color bindings", () => {
    const colors = getPaginationColorBindings();
    expect(colors).toMatchSnapshot();
  });

  it("should produce consistent showing range for first page", () => {
    const range = calculateShowingRange(1, 10, 100);
    expect(range).toMatchSnapshot();
  });

  it("should produce consistent showing range for middle page", () => {
    const range = calculateShowingRange(5, 10, 100);
    expect(range).toMatchSnapshot();
  });

  it("should produce consistent showing range for last page", () => {
    const range = calculateShowingRange(10, 10, 100);
    expect(range).toMatchSnapshot();
  });

  it("should produce consistent button states for first page", () => {
    const states = getButtonStates(1, 10);
    expect(states).toMatchSnapshot();
  });

  it("should produce consistent button states for middle page", () => {
    const states = getButtonStates(5, 10);
    expect(states).toMatchSnapshot();
  });

  it("should produce consistent button states for last page", () => {
    const states = getButtonStates(10, 10);
    expect(states).toMatchSnapshot();
  });

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * pagination.ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent complete data structure (golden path)", () => {
    const allData = getAllPaginationData();

    // Verify structure exists
    expect(allData.dimensions).toBeDefined();
    expect(allData.colors).toBeDefined();
    expect(allData.states).toBeDefined();
    expect(Array.isArray(allData.states)).toBe(true);

    // Each state should have complete data
    allData.states.forEach((state) => {
      expect(state.label).toBeDefined();
      expect(state.page).toBeDefined();
      expect(state.perPage).toBeDefined();
      expect(state.totalCount).toBeDefined();
      expect(state.showingRange).toBeDefined();
      expect(state.buttonStates).toBeDefined();
    });

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
