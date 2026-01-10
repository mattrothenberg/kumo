# Figma Generator Architecture Specification

## Problem Statement

The Kumo Figma plugin generates Figma components from React source code. Currently, we use an **AST-based approach** to extract component metadata, but there's a question about whether a runtime approach (like React-Grab) would be better.

## Key Observations

### 1. AST vs. React-Grab Approach

**Decision: AST approach is correct for our use case.**

**React-Grab (fant.io/react):**

- Purpose: Reverse-engineers React components from production websites WITHOUT source code
- Method: Runtime inspection of React Fiber tree
- Use case: Stealing/copying components from live websites
- **NOT suitable** because:
  - We HAVE the source code
  - Need deterministic, build-time analysis
  - Need to parse TypeScript types and exports
  - Need predictable output for Figma API

**Our AST Approach:**

- Purpose: Extract component metadata from TypeScript source
- Method: AST parsing → component-registry.json → Figma generators
- **Advantages:**
  - ✅ Source of truth chain: `component.tsx` → `component-registry.json` → `generator.ts` → Figma
  - ✅ Type-safe: Extracts TypeScript types and const exports
  - ✅ Deterministic: Same input = same output
  - ✅ Build-time: Runs during CI/CD, catches issues early
  - ✅ Cacheable: Hash-based caching (~1s incremental builds)
  - ✅ Testable: Pure functions export intermediate data

### 2. Component Alignment Status

**Coverage: 87% (26/30 components have generators)**

**✅ Aligned Components (26):**
Badge, Banner, Button, Checkbox, ClipboardText, Code, Collapsible, Combobox, DateRangePicker, Dialog, DropdownMenu, Icon, Input, LayerCard, Loader, MenuBar, Meter, Pagination, Select, Surface, Switch, Tabs, Text, Toasty, Tooltip

**❌ Missing Generators (4):**

1. **Breadcrumbs** - Block/composite component with sub-components
2. **Empty** - Display component for empty states
3. **Field** - Form wrapper component
4. **PageHeader** - Block/composite component with multiple sections

### 3. Lint Rules Enable AST Parsing

**Three custom lint rules enforce predictable structure:**

1. **`no-primitive-colors.js`** - Blocks raw Tailwind colors (e.g., `bg-blue-500`)
   - Enforces semantic tokens only (`bg-surface`, `text-primary`)

2. **`no-tailwind-dark-variant.js`** - Blocks `dark:` variants
   - Dark mode handled automatically by semantic tokens

3. **`enforce-variant-standard.js`** ⭐ **CRITICAL FOR AST**
   - Enforces `KUMO_{COMPONENT}_VARIANTS` naming convention
   - Enforces `KUMO_{COMPONENT}_DEFAULT_VARIANTS` export
   - Enforces `KUMO_{COMPONENT}_BASE_STYLES` prefix (optional)
   - **Makes AST parsing predictable and reliable**

### 4. Test Brittleness Problem

**Current Issue:** Tests are too tightly coupled to design implementation details.

**Brittle (current):**

```typescript
it("should have correct classes", () => {
  expect(classes).toBe("bg-surface-inverse text-surface-inverse");
});
```

❌ Fails when design changes even slightly
❌ Tests design implementation, not functional contract

**Flexible (target):**

```typescript
// Test structure, not exact values
it("should have fill and text variables defined", () => {
  const parsed = parseTailwindClasses(classes);
  expect(parsed.fillVariable).toBeDefined();
  expect(parsed.textVariable).toBeDefined();
});

// Snapshot catches unintended changes
it("should produce consistent parsed styles", () => {
  expect(getBadgeParsedVariantStyles("primary")).toMatchSnapshot();
});
```

✅ Tests functional contract
✅ Flexible to design changes
✅ Regression protection via snapshots

**Progress:** 13/29 generators refactored (Phase 1 complete)

## Architecture Decisions

### Source of Truth Chain

```
component.tsx
  ↓ (exports KUMO_*_VARIANTS, KUMO_*_STYLING)
component-registry.json
  ↓ (AST extraction via pnpm codegen:registry)
generator.ts
  ↓ (parseTailwindClasses)
Figma API
```

**Why this works:**

1. **Single source of truth** - React component defines all variants
2. **Type-safe** - TypeScript exports are statically analyzable
3. **Cacheable** - Hash-based caching skips unchanged components
4. **Testable** - Pure functions expose intermediate data
5. **Deterministic** - No runtime surprises

### Generator Pattern

**Ideal generator structure:**

```typescript
// 1. Import registry (source of truth)
import registry from "../../../../ai/component-registry.json";

// 2. Extract component data
const componentData = registry.components.MyComponent;
const props = componentData.props;
const styling = componentData.styling;
const baseStyles = componentData.baseStyles;

// 3. Export testable functions (pure, no Figma API)
export function getMyComponentVariantConfig() { ... }
export function getMyComponentParsedBaseStyles() { ... }
export function getMyComponentParsedVariantStyles(variant: string) { ... }
export function getAllMyComponentVariantData() { ... }

// 4. Generator function (calls Figma API)
export async function generateMyComponentComponents() { ... }
```

### Test Pattern

**Structural + Snapshot approach:**

```typescript
// 1. Registry validation
describe("Registry Validation", () => {
  it("should have all expected variants in registry", () => { ... });
  it("should have classes defined for all variants", () => { ... });
});

// 2. Structural validation (types, existence)
describe("Structural Validation", () => {
  it("should parse base styles correctly", () => {
    const parsed = getMyComponentParsedBaseStyles();
    expect(typeof parsed.paddingX).toBe("number");
    expect(typeof parsed.borderRadius).toBe("number");
  });
});

// 3. Snapshot tests (regression)
describe("Snapshots", () => {
  it("should produce consistent variant config", () => {
    expect(getMyComponentVariantConfig()).toMatchSnapshot();
  });
});
```

**What tests SHOULD verify:**

- ✅ Source of truth chain works (Registry → Parser → Figma data structure)
- ✅ Required properties exist (`fillVariable`, `strokeVariable`, `dimensions`)
- ✅ Type correctness (numbers are numbers, strings are strings)
- ✅ Snapshots catch unintended drift

**What tests should NOT verify:**

- ❌ Exact Tailwind class strings (design implementation detail)
- ❌ Specific pixel values (changes during iteration)
- ❌ Exact color values (semantic tokens handle this)
- ❌ Design details that don't affect functional contract

## Technical Constraints

### Figma Plugin Runtime

- No `??` operator support (use `|| fallback` or ternary)
- Limited ES6+ features
- Must use `var` for maximum compatibility
- All external data must be pre-bundled

### Component Registry

- Generated by `pnpm codegen:registry`
- Hash-based caching for incremental builds
- Parallel processing (8 components concurrently)
- Skips inherited props by default (use `--inherited-props` flag)

### Parser Capabilities

Current `tailwind-to-figma.ts` parser handles:

- ✅ Spacing (padding, margin, gap, height, width)
- ✅ Border radius
- ✅ Font size and weight
- ✅ Semantic color tokens → Figma variables
- ✅ Borders (stroke weight, dashed patterns)
- ✅ Opacity (white text detection)

**Known gaps:**

- ❌ Arbitrary values (`w-[350px]`, `min-w-[32rem]`)
- ❌ Opacity modifiers (`bg-primary/70`, `text-surface/50`)
- ❌ State variants (`hover:bg-subtle`, `focus:ring-active`)
- ❌ Responsive prefixes (`sm:px-4`, `lg:gap-8`)
- ❌ Ring utilities (`ring`, `ring-2`, `ring-offset-2`)
- ❌ Flex/Grid utilities (`flex-1`, `grid-cols-2`)

## Current Status

### Completion Metrics

- **13/29 generators** have rigorous tests (45%)
- **26/30 components** have generators (87%)
- **6/29 generators** fully registry-driven (21%)

### Phase Status (from PLAN.md)

- ✅ **Phase 1: Test Refactoring** - COMPLETE (Done generators refactored)
- ✅ **Phase 2.1: Cleanup** - COMPLETE (Dead code removed)
- ⏳ **Phase 2.2: Audit** - In progress (Dead code patterns)
- ⏳ **Phase 3: Parser Improvements** - Not started
- ⏳ **Phase 4: Registry Enhancement** - Partially complete (6 components)
- ⏳ **Phase 5: Generator Migration** - Tier 1 complete, Tier 2-4 remaining
- ⏳ **Phase 6: Test Coverage** - 13/29 complete
- ❌ **Phase 7: Documentation** - Not started

### Priority Order

**Tier 1 (High Usage)** - ✅ COMPLETE

- text, input, select, dialog (Done)

**Tier 2 (Medium Usage)** - ⏳ IN PROGRESS

- tabs, toast (Done)
- dropdown, combobox (Remaining)

**Tier 3 (Lower Usage)** - ❌ TODO

- tooltip, collapsible, date-range-picker, loader, meter, pagination

**Tier 4 (Specialized)** - ❌ TODO

- switch, link-button, refresh-button, input-area, sensitive-input, surface, layer-card, menubar

## Success Criteria

### Functional Requirements

1. ✅ **AST approach validated** - Confirmed as correct architecture
2. ⏳ **All generators read from registry** - 21% complete (6/29)
3. ⏳ **All generators have tests** - 45% complete (13/29)
4. ⏳ **Tests use structural + snapshot pattern** - 45% complete
5. ❌ **Parser handles all Tailwind patterns** - Known gaps exist
6. ❌ **Documentation complete** - Not started

### Quality Gates

- **No hardcoded style values in generators** - Tier 1 compliant
- **No brittle exact-value assertions in tests** - Tier 1 compliant
- **All components have `KUMO_*_VARIANTS` exports** - Enforced by lint
- **All components use semantic tokens only** - Enforced by lint
- **Incremental builds under 2s** - ✅ Achieved (~1s with caching)

## Open Questions

1. **Should we add E2E Figma API tests?**
   - Pro: Validates actual Figma component creation
   - Con: Slow, requires Figma auth, brittle
   - Alternative: Visual regression tests (screenshot comparison)

2. **How to handle missing generators (Breadcrumbs, Empty, Field, PageHeader)?**
   - Breadcrumbs: Composite component with sub-components pattern
   - Empty: Simple display component
   - Field: Form wrapper with label/description/error
   - PageHeader: Complex composite with multiple sections

3. **Parser enhancement strategy?**
   - Add opacity modifier parsing (`/70` → 0.7 opacity)
   - Add arbitrary value parsing (`[350px]` → 350)
   - Add state variant extraction (hover/focus/active)
   - Document supported patterns

4. **Test strategy for complex generators?**
   - Dialog has 5 size variants × overlay states
   - Toast has 4 positions × 3 variants = 12 combinations
   - Should we test all permutations or key examples?

## References

- **AST Extraction:** `packages/kumo/scripts/ai/extract-component-metadata.ts`
- **Parser:** `packages/kumo/scripts/figma/plugin/parsers/tailwind-to-figma.ts`
- **Lint Rules:** `packages/kumo/scripts/linting/`
- **Component Registry:** `packages/kumo/ai/component-registry.json`
- **Plan:** `packages/kumo/scripts/figma/plugin/PLAN.md`
- **Agents Guide:** `AGENTS.md`
