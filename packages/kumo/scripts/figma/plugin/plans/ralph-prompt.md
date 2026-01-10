# Ralph Prompt - Figma Generator Test Refactoring

You are refactoring Figma generator tests to use a flexible structural + snapshot pattern instead of brittle exact-value assertions. This enables design iteration while maintaining regression protection.

## Context

I'm refactoring Figma generator tests to use a flexible structural + snapshot pattern instead of brittle exact-value assertions. This enables design iteration while maintaining regression protection.

**Reference files:**

- @SPEC.md - Architecture specification and observations
- @PRD.json - Product requirements document
- @badge.test.ts - Example of correctly refactored test (Tier 1 complete)
- @button.test.ts - Example of complex component with multiple variants
- @input.test.ts - Example with state validation (focus, error, disabled)

## Your Task

Refactor the test file for the **[GENERATOR_NAME]** component following the structural + snapshot pattern used in badge.test.ts.

## Requirements

### 1. Read Current Implementation

First, examine:

- `[generator-name].ts` - The generator implementation
- `[generator-name].test.ts` (if exists) - Current test file
- `../../../../ai/component-registry.json` - Component metadata (source of truth)

### 2. Add Testable Exports to Generator

The generator MUST export pure functions (no Figma API calls) for testing:

```typescript
// 1. Get variant configuration from registry
export function get[Component]VariantConfig() {
  return {
    values: variantProp.values,
    classes: variantProp.classes,
    descriptions: variantProp.descriptions,
    default: variantProp.default,
  };
}

// 2. Get parsed base styles (if baseStyles exist in registry)
export function get[Component]ParsedBaseStyles() {
  return parseTailwindClasses(BASE_STYLES);
}

// 3. Get parsed styles for a specific variant
export function get[Component]ParsedVariantStyles(variant: string) {
  const classes = variantProp.classes[variant] || "";
  return {
    variant,
    classes,
    description: variantProp.descriptions[variant] || "",
    parsed: parseTailwindClasses(classes),
  };
}

// 4. Get all variant data (for snapshot testing)
export function getAll[Component]VariantData() {
  const baseStyles = get[Component]ParsedBaseStyles();
  const config = get[Component]VariantConfig();

  return {
    baseStyles: {
      raw: BASE_STYLES,
      parsed: baseStyles,
    },
    variants: config.values.map((variant) => {
      const variantData = get[Component]ParsedVariantStyles(variant);
      return {
        ...variantData,
        // Add computed layout/styling data
        layout: { ... },
        text: { ... },
      };
    }),
  };
}
```

### 3. Create Test File Structure

Follow this exact structure:

```typescript
/**
 * Tests for [component].ts generator
 *
 * These tests ensure the [Component] Figma component generation stays in sync
 * with the source of truth (component-registry.json).
 *
 * CRITICAL: These tests act as a regression guard. If you change the [component]
 * generator or parser, these tests will catch any unintended style changes.
 *
 * Source of truth chain:
 * [component].tsx → component-registry.json → [component].ts (generator) → Figma
 */

import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  get[Component]VariantConfig,
  get[Component]ParsedBaseStyles,
  get[Component]ParsedVariantStyles,
  getAll[Component]VariantData,
} from "./[component]";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";

const componentData = registry.components.[Component];
const props = componentData.props;
const variantProp = props.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

describe("[Component] Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => {
    // Don't hardcode expected variants - verify structure
    expect(Array.isArray(variantProp.values)).toBe(true);
    expect(variantProp.values.length).toBeGreaterThan(0);
  });

  it("should have classes defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.classes[variant]).toBeDefined();
      expect(typeof variantProp.classes[variant]).toBe("string");
      expect(variantProp.classes[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have descriptions defined for all variants", () => {
    for (const variant of variantProp.values) {
      expect(variantProp.descriptions[variant]).toBeDefined();
      expect(typeof variantProp.descriptions[variant]).toBe("string");
      expect(variantProp.descriptions[variant].length).toBeGreaterThan(0);
    }
  });

  it("should have a default variant", () => {
    expect(variantProp.default).toBeDefined();
    expect(typeof variantProp.default).toBe("string");
    expect(variantProp.values).toContain(variantProp.default);
  });
});

describe("[Component] Generator - Base Styles Parsing", () => {
  // Only if component has baseStyles in registry
  it("should parse border-radius from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES);
    expect(parsed.borderRadius).toBeDefined();
    expect(typeof parsed.borderRadius).toBe("number");
  });

  it("should parse padding from base styles", () => {
    const parsed = parseTailwindClasses(BASE_STYLES);
    expect(parsed.paddingX).toBeDefined();
    expect(typeof parsed.paddingX).toBe("number");
  });

  // Add more as needed for typography, spacing, etc.
});

describe("[Component] Generator - Variant Styles Parsing", () => {
  // Test each variant's parsing - structural assertions only
  for (const variant of variantProp.values) {
    describe(`${variant} variant`, () => {
      const classes = variantProp.classes[variant];

      it("should have classes defined", () => {
        expect(classes).toBeDefined();
        expect(typeof classes).toBe("string");
        expect(classes.length).toBeGreaterThan(0);
      });

      it("should parse fill or stroke variable", () => {
        const parsed = parseTailwindClasses(classes);
        // At least one should be defined
        expect(
          parsed.fillVariable !== undefined || parsed.strokeVariable !== undefined
        ).toBe(true);
      });

      it("should parse text variable or detect white text", () => {
        const parsed = parseTailwindClasses(classes);
        expect(
          parsed.textVariable !== undefined || parsed.isWhiteText === true
        ).toBe(true);
      });
    });
  }
});

describe("[Component] Generator - Snapshot Tests (Intermediate Data)", () => {
  /**
   * SNAPSHOT TESTS - Regression guards for intermediate data
   *
   * These tests capture the intermediate data (parsed styles, variant configs,
   * layout calculations) BEFORE it hits Figma APIs. This enables:
   *
   * 1. Testing without Figma plugin runtime
   * 2. Detecting unintended changes in parsing or layout logic
   * 3. Validating the full source of truth chain:
   *    [component].tsx → component-registry.json → [component].ts parser → Figma
   *
   * If these snapshots change unexpectedly, it means:
   * - [Component] component styles changed in [component].tsx (intended)
   * - Parser logic changed (review carefully)
   * - Registry generation changed (review carefully)
   */

  it("should produce consistent variant config from registry", () => {
    const config = get[Component]VariantConfig();
    expect(config).toMatchSnapshot();
  });

  it("should produce consistent parsed base styles", () => {
    const baseStyles = get[Component]ParsedBaseStyles();
    expect(baseStyles).toMatchSnapshot();
  });

  // Snapshot each variant
  for (const variant of variantProp.values) {
    it(`should produce consistent parsed styles for ${variant} variant`, () => {
      const variantData = get[Component]ParsedVariantStyles(variant);
      expect(variantData).toMatchSnapshot();
    });
  }

  /**
   * GOLDEN PATH TEST - Full intermediate data chain
   *
   * This test captures the complete intermediate data structure that
   * [component].ts computes before making any Figma API calls. It's the
   * most comprehensive regression guard.
   */
  it("should produce consistent intermediate data for all variants (golden path)", () => {
    const allData = getAll[Component]VariantData();

    // Verify structure exists
    expect(allData.baseStyles).toBeDefined();
    expect(allData.variants).toBeDefined();
    expect(Array.isArray(allData.variants)).toBe(true);

    // Each variant should have complete data
    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.classes).toBeDefined();
      expect(variant.description).toBeDefined();
      expect(variant.parsed).toBeDefined();
    }

    // Full snapshot
    expect(allData).toMatchSnapshot();
  });
});
```

### 4. Key Principles

**DO:**

- ✅ Test that properties exist and have correct types
- ✅ Use `typeof` checks for type validation
- ✅ Use `toBeDefined()` for existence checks
- ✅ Use snapshots for regression protection
- ✅ Test structural contract, not implementation

**DON'T:**

- ❌ Use exact string matches for Tailwind classes
- ❌ Hardcode expected pixel values
- ❌ Test specific color values
- ❌ Assert exact class strings with `.toBe()`
- ❌ Test design details that change during iteration

### 5. Handle Special Cases

**If component has `styling` metadata:**

```typescript
describe("[Component] Generator - Styling Metadata", () => {
  it("should parse dimensions from styling", () => {
    const styling = componentData.styling;
    expect(styling.dimensions).toBeDefined();
    const parsed = parseTailwindClasses(styling.dimensions);
    expect(typeof parsed.height).toBe("number");
    expect(typeof parsed.width).toBe("number");
  });

  it("should parse state styles from styling", () => {
    const styling = componentData.styling;
    expect(styling.states).toBeDefined();
    expect(typeof styling.states).toBe("object");
  });
});
```

**If component has size variants:**

```typescript
const sizeProp = props.size as {
  values: string[];
  classes: Record<string, string>;
  default: string;
};

export function get[Component]SizeConfig() { ... }
export function get[Component]ParsedSizeStyles(size: string) { ... }

// Add size tests following same pattern
```

**If component has sub-components:**

```typescript
describe("[Component] Generator - Sub-Components", () => {
  it("should have sub-components defined in registry", () => {
    expect(componentData.subComponents).toBeDefined();
    expect(typeof componentData.subComponents).toBe("object");
  });

  it("should have props defined for each sub-component", () => {
    const subComponents = componentData.subComponents;
    for (const [name, subComp] of Object.entries(subComponents)) {
      expect(subComp.name).toBe(name);
      expect(subComp.description).toBeDefined();
    }
  });
});
```

### 6. Run Tests and Update Snapshots

After creating the test file:

```bash
# Run tests
pnpm --filter @cloudflare/kumo test [generator-name].test.ts

# Update snapshots (first run)
pnpm --filter @cloudflare/kumo test [generator-name].test.ts -u

# Verify tests pass
pnpm --filter @cloudflare/kumo test [generator-name].test.ts --run
```

## Validation Checklist

Before marking complete, verify:

- [ ] Generator exports all required testable functions
- [ ] Test file follows 3-section structure (Registry, Structural, Snapshots)
- [ ] No exact-value assertions for Tailwind classes
- [ ] All type checks use `typeof`
- [ ] All existence checks use `toBeDefined()`
- [ ] Snapshots captured for variant config, base styles, each variant, and full data
- [ ] All tests pass
- [ ] Test file has comprehensive JSDoc comments
- [ ] Follows pattern from badge.test.ts

## Example Usage

```bash
# In the generators directory
cd packages/kumo/scripts/figma/plugin/generators

# Start OpenCode
opencode

# Paste this prompt, replacing [GENERATOR_NAME] with actual generator name
# Example: "Refactor the test file for the **dropdown** component..."

# Reference these files in the chat:
# @../plans/SPEC.md
# @../plans/PRD.json
# @badge.test.ts
# @button.test.ts
```

## Success Criteria

When complete, the test file should:

1. Import and use all testable exports from generator
2. Validate registry structure (not exact values)
3. Validate parsed output structure (types and existence)
4. Capture snapshots for regression protection
5. Pass all tests
6. Be flexible to design changes
7. Follow the exact pattern from badge.test.ts

## Common Pitfalls

1. **Don't hardcode expected variants** - Read from registry and validate structure
2. **Don't test exact class strings** - Test parsed structure instead
3. **Don't skip snapshots** - They're your regression protection
4. **Don't test implementation details** - Test the functional contract
5. **Don't forget to export testable functions** - Generator must export pure functions

## Your Task (Single Generator Per Iteration)

1. Find the NEXT incomplete generator from PRD.json (first generator where passes: false)
2. Implement the test refactoring for ONLY that generator following this guide
3. Run feedback loops before committing:
   - Tests: `pnpm --filter @cloudflare/kumo test [generator].test.ts`
   - Update snapshots: `pnpm --filter @cloudflare/kumo test [generator].test.ts -u`
   - Verify tests pass: `pnpm --filter @cloudflare/kumo test [generator].test.ts --run`
4. Do NOT commit if tests fail. Fix issues first.
5. Update PRD.json to mark the generator as passes: true
6. Append your progress to progress.txt with:
   - Generator name
   - What was done
   - Test results
   - Any issues encountered
7. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch (swarm/figma-plugin)
   - Make a git commit with clear message: "test([generator]): refactor to structural + snapshot pattern"
   - DO NOT push to remote (commits will be pushed in batch later)

ONLY WORK ON A SINGLE GENERATOR PER ITERATION.

If ALL generators in PRD.json are complete (passes: true), output <promise>COMPLETE</promise>.

## Questions?

Refer to:

- SPEC.md - Architecture decisions and technical details
- PRD.json - Requirements and acceptance criteria
- badge.test.ts - Complete example of pattern
- button.test.ts - Complex example with multiple variants
- input.test.ts - Example with state validation
