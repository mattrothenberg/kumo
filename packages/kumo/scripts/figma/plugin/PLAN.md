# Figma Generator Robustness Plan

> Making generators derive all styling from `component-registry.json` - the single source of truth.

## Current State

### Source of Truth Chain

```
component.tsx (KUMO_*_VARIANTS + KUMO_*_STYLING)
    → pnpm codegen:registry
    → component-registry.json
    → generator.ts (parseTailwindClasses)
    → Figma
```

### Generator Status

| Generator           | Has Tests   | Reads Registry | Has `baseStyles` | Has `styling` | Status      |
| ------------------- | ----------- | -------------- | ---------------- | ------------- | ----------- |
| `badge`             | ✅ Rigorous | ✅             | ✅               | ❌            | **Done**    |
| `banner`            | ✅ Rigorous | ✅             | ✅               | ❌            | **Done**    |
| `button`            | ✅ Rigorous | ✅             | ❌               | ❌            | **Done**    |
| `checkbox`          | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `clipboard-text`    | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `code`              | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `code-block`        | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `text`              | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `collapsible`       | ❌          | Partial        | ❌               | ❌            | Needs work  |
| `combobox`          | ❌          | Partial        | ❌               | ❌            | Needs work  |
| `date-range-picker` | ❌          | Partial        | ❌               | ❌            | Needs work  |
| `dialog`            | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `dropdown`          | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `input`             | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `input-area`        | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `layer-card`        | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `link-button`       | ❌          | ✅             | ❌               | ❌            | Needs tests |
| `loader`            | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `menubar`           | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `meter`             | ❌          | Partial        | ❌               | ❌            | Needs work  |
| `pagination`        | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `refresh-button`    | ❌          | ✅             | ❌               | ❌            | Needs tests |
| `select`            | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `sensitive-input`   | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `surface`           | ❌          | ❌             | ❌               | ❌            | Needs work  |
| `switch`            | ❌          | ✅             | ❌               | ❌            | Needs tests |
| `tabs`              | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `toast`             | ✅ Rigorous | ✅             | ❌               | ✅            | **Done**    |
| `tooltip`           | ❌          | ❌             | ❌               | ❌            | Needs work  |

### Registry Metadata Types

Components expose metadata in `component-registry.json` in different ways:

1. **`baseStyles`** - Raw Tailwind class string (e.g., Badge, Banner)

   ```json
   "baseStyles": "rounded-full px-2 py-0.5 text-xs font-medium"
   ```

2. **`styling`** - Structured Figma-specific metadata (e.g., Checkbox, ClipboardText)

   ```json
   "styling": {
     "dimensions": "h-4 w-4",
     "borderRadius": "rounded-sm",
     "baseTokens": ["bg-surface", "ring-border"],
     "states": { "checked": ["bg-surface-inverse"], ... },
     "icons": [{ "name": "ph-check", "state": "checked", "size": 12 }]
   }
   ```

3. **`props.*.classes`** - Variant-specific classes
   ```json
   "variant": {
     "values": ["primary", "secondary"],
     "classes": { "primary": "bg-primary text-white", ... }
   }
   ```

---

## Phase 1: Test Refactoring (Done Generators) ✅ COMPLETE

**Goal:** Make tests less brittle while maintaining regression protection.

### Strategy: Structural + Snapshot

Keep structural assertions, remove exact value checks, rely on snapshots for value drift.

**Before (brittle):**

```typescript
it("should have correct classes", () => {
  expect(classes).toBe("bg-surface-inverse text-surface-inverse");
});
```

**After (structural):**

```typescript
it("should have fill and text variables defined", () => {
  const parsed = parseTailwindClasses(classes);
  expect(parsed.fillVariable).toBeDefined();
  expect(parsed.textVariable).toBeDefined();
});

it("should produce consistent parsed styles", () => {
  expect(getBadgeParsedVariantStyles("primary")).toMatchSnapshot();
});
```

### Tasks

- [x] **1.1** Refactor `badge.test.ts` - Remove exact value assertions, keep structural + snapshots
- [x] **1.2** Refactor `banner.test.ts` - Same pattern
- [x] **1.3** Refactor `button.test.ts` - Same pattern (largest file, ~1000 lines)
- [x] **1.4** Refactor `checkbox.test.ts` - Same pattern
- [x] **1.5** Refactor `clipboard-text.test.ts` - Same pattern
- [x] **1.6** Add `code.test.ts` - New tests with structural + snapshot pattern
- [x] **1.7** Add `code-block.test.ts` - New tests with structural + snapshot pattern
- [x] **1.8** Update snapshots after refactoring

---

## Phase 2: Cleanup ✅ COMPLETE

- [x] **2.1** Delete `placeholders.ts` and `placeholders.test.ts` (dead code)
- [ ] **2.2** Audit other generators for dead code patterns

---

## Phase 3: Parser Improvements

**Goal:** Enhance `tailwind-to-figma.ts` to handle more Tailwind patterns.

### Current Parser Gaps

The parser handles basic patterns but misses:

1. **Arbitrary values** - `w-[350px]`, `min-w-[32rem]`
2. **Opacity modifiers** - `bg-primary/70`, `text-surface/50`
3. **State variants** - `hover:bg-subtle`, `focus:ring-active`
4. **Responsive prefixes** - `sm:px-4`, `lg:gap-8`
5. **Ring utilities** - `ring`, `ring-2`, `ring-offset-2`
6. **Flex/Grid utilities** - `flex-1`, `grid-cols-2`

### Tasks

- [ ] **3.1** Add arbitrary value parsing (`w-[350px]` → 350)
- [ ] **3.2** Add opacity modifier extraction (`bg-primary/70` → { variable, opacity: 0.7 })
- [ ] **3.3** Add state variant parsing (extract hover/focus/active states)
- [ ] **3.4** Add ring utility parsing
- [ ] **3.5** Add comprehensive parser tests for new patterns
- [ ] **3.6** Document supported patterns in parser JSDoc

---

## Phase 4: Registry Metadata Enhancement

**Goal:** Ensure all components export sufficient metadata for generators.

### Pattern: `styling` Section

Components with complex Figma representations should export a `styling` section:

```typescript
// In component.tsx
export const KUMO_COMPONENT_STYLING = {
  dimensions: "h-10 w-full",
  borderRadius: "rounded-lg",
  baseTokens: ["bg-secondary", "ring-border"],
  states: {
    focus: ["ring-active"],
    error: ["ring-error"],
    disabled: ["opacity-50"],
  },
  icons: [{ name: "ph-caret-down", position: "right", size: 16 }],
} as const;
```

### Completed

- [x] **4.0** Add `styling` export to `code.tsx` (KUMO_CODE_STYLING, KUMO_CODEBLOCK_STYLING)
- [x] **4.7** Registry generator extracts `styling` sections via `COMPONENT_STYLING_METADATA`

### Tasks

- [x] **4.1** Add `styling` export to `text.tsx`
- [x] **4.2** Add `styling` export to `input.tsx`
- [x] **4.3** Add `styling` export to `select.tsx`
- [x] **4.4** Add `styling` export to `dialog.tsx`
- [x] **4.5** Add `styling` export to `tabs.tsx`
- [x] **4.6** Add `styling` export to `toast.tsx`
- [ ] **4.8** Document `styling` pattern in AGENTS.md

---

## Phase 5: Generator Migration

**Goal:** Migrate remaining generators to read from registry.

### Priority Order (by usage/complexity)

**Tier 1 - High Usage:**

- [x] **5.1** `text.ts` - Add rigorous tests, verify registry reading
- [x] **5.2** `input.ts` - Migrate hardcoded values to registry
- [x] **5.3** `select.ts` - Migrate hardcoded values to registry
- [x] **5.4** `dialog.ts` - Migrate SIZE_CONFIG to registry

**Tier 2 - Medium Usage:**

- [x] **5.5** `tabs.ts` - Migrate to registry
- [x] **5.6** `toast.ts` - Migrate to registry
- [ ] **5.7** `dropdown.ts` - Migrate to registry
- [ ] **5.8** `combobox.ts` - Migrate to registry

**Tier 3 - Lower Usage:**

- [ ] **5.9** `tooltip.ts` - Migrate to registry
- [ ] **5.10** `collapsible.ts` - Migrate to registry
- [ ] **5.11** `date-range-picker.ts` - Migrate to registry
- [ ] **5.12** `loader.ts` - Migrate to registry
- [ ] **5.13** `meter.ts` - Migrate to registry
- [ ] **5.14** `pagination.ts` - Migrate to registry

**Tier 4 - Specialized:**

- [ ] **5.15** `switch.ts` - Add tests (already reads registry)
- [ ] **5.16** `link-button.ts` - Add tests (already reads registry)
- [ ] **5.17** `refresh-button.ts` - Add tests (already reads registry)
- [ ] **5.18** `input-area.ts` - Migrate to registry
- [ ] **5.19** `sensitive-input.ts` - Migrate to registry
- [ ] **5.20** `surface.ts` - Migrate to registry
- [ ] **5.21** `layer-card.ts` - Migrate to registry
- [ ] **5.22** `menubar.ts` - Migrate to registry

---

## Phase 6: Test Coverage

**Goal:** Every generator has tests following the structural + snapshot pattern.

### Test Template

```typescript
/**
 * Tests for {component}.ts generator
 * Source of truth chain: {component}.tsx → component-registry.json → {component}.ts → Figma
 */

describe("{Component} Generator - Registry Validation", () => {
  it("should have all expected variants in registry", () => { ... });
  it("should have classes defined for all variants", () => { ... });
});

describe("{Component} Generator - Structural Validation", () => {
  it("should parse base styles correctly", () => {
    const parsed = get{Component}ParsedBaseStyles();
    expect(parsed.paddingX).toBeDefined();
    expect(parsed.borderRadius).toBeDefined();
  });

  it("should parse variant styles correctly", () => {
    for (const variant of variants) {
      const parsed = get{Component}ParsedVariantStyles(variant);
      expect(parsed.fillVariable || parsed.hasBorder).toBeDefined();
    }
  });
});

describe("{Component} Generator - Snapshots", () => {
  it("should produce consistent variant config", () => {
    expect(get{Component}VariantConfig()).toMatchSnapshot();
  });

  it("should produce consistent complete data", () => {
    expect(getAll{Component}VariantData()).toMatchSnapshot();
  });
});
```

### Tasks

- [ ] **6.1** Create test template file
- [x] **6.2** Add tests for `text.ts`
- [x] **6.3** Add tests for `input.ts`
- [x] **6.4** Add tests for `select.ts`
- [x] **6.5** Add tests for `dialog.ts`
- [x] **6.6** Add tests for `tabs.ts`
- [x] **6.7** Add tests for `toast.ts`
- [ ] **6.8** Add tests for remaining Tier 1-2 generators
- [ ] **6.9** Add tests for remaining Tier 3-4 generators

---

## Phase 7: Documentation

- [ ] **7.1** Update `README.md` with generator patterns
- [ ] **7.2** Document `styling` section pattern
- [ ] **7.3** Document test patterns (structural + snapshot)
- [ ] **7.4** Add troubleshooting guide for common parser issues

---

## Success Criteria

1. **All generators read from registry** - No hardcoded style values
2. **All generators have tests** - Structural + snapshot pattern
3. **Tests are not brittle** - No exact value assertions for classes
4. **Parser handles all patterns** - Arbitrary values, opacity, states
5. **Documentation is complete** - Patterns documented for future contributors

---

## Recent Session Progress (Jan 2026)

### Component Registry Improvements

1. **Hash-based caching** - Skip regeneration for unchanged components (~1s incremental builds)
2. **Parallel processing** - Process 8 components concurrently
3. **Skip inherited props by default** - Saves ~15s (use `--inherited-props` flag if needed)
4. **CLI flags** - `--no-cache`, `--verbose`, `--help`

### Code/CodeBlock Generator

1. Added `KUMO_CODE_STYLING` and `KUMO_CODEBLOCK_STYLING` exports to `code.tsx`
2. Added `Code.Block` sub-component pattern (compound component)
3. Created `code.test.ts` and `code-block.test.ts` with structural + snapshot tests
4. Added testable export functions: `getBaseStyles()`, `getLangConfig()`, `getAllVariantData()`

### Test Refactoring

All "Done" generators now use structural assertions instead of exact value checks:

- `badge.test.ts`, `banner.test.ts`, `button.test.ts`
- `checkbox.test.ts`, `clipboard-text.test.ts`
- `code.test.ts`, `code-block.test.ts` (new)

### Cleanup

- Deleted dead code: `placeholders.ts`, `placeholders.test.ts`

### CI/CD

- Added `validate:colors` script and CI job for color token validation
- Renamed `build:ai-metadata` → `codegen:registry` for clarity

### Tier 1 Generator Completion (Jan 2026)

**Text, Input, Select, Dialog, Tabs, Toast** - All migrated to registry with rigorous tests.

#### Component Styling Exports

Added `KUMO_*_STYLING` exports to all Tier 1 components:

1. **text.tsx** - `KUMO_TEXT_STYLING` with dimensions, border radius, base tokens
2. **input.tsx** - `KUMO_INPUT_STYLING` with states (focus, error, disabled), icon configuration
3. **select.tsx** - `KUMO_SELECT_STYLING` with trigger/popup dimensions, icon states
4. **dialog.tsx** - `KUMO_DIALOG_STYLING` with size variants (sm, base, lg, xl, full), overlay styling
5. **tabs.tsx** - `KUMO_TABS_STYLING` with list/trigger/panel dimensions, state styling
6. **toast.tsx** - `KUMO_TOAST_STYLING` with position variants, icon configurations for variants

#### Generator Refactoring

All generators now follow the ideal pattern:

- Import from `component-registry.json`
- Export testable pure functions (`getBaseStyles`, `getParsedVariantStyles`, `getAllVariantData`)
- Parse styling metadata using `parseTailwindClasses`
- Generate Figma components with registry-derived values

#### Test Coverage

Created rigorous tests for all 6 generators:

- **text.test.ts** - Registry validation, structural validation, snapshots
- **input.test.ts** - State validation (default, focus, error, disabled), icon parsing
- **select.test.ts** - Trigger/popup validation, icon state parsing, size variants
- **dialog.test.ts** - Size variant validation (5 sizes), overlay parsing, compound component structure
- **tabs.test.ts** - List/trigger/panel validation, state parsing, variant styles
- **toast.test.ts** - Position/variant validation (20 combinations), icon configuration parsing

All tests follow the structural + snapshot pattern:

- Registry validation (ensure expected variants exist)
- Structural validation (ensure parsed styles have expected properties)
- Snapshot tests (detect unintended changes)

#### Impact

- **6 generators** now fully registry-driven
- **6 components** now export structured styling metadata
- **6 test suites** added (~1200 lines of rigorous tests)
- **Generator Status Table** updated: 13/29 generators now marked as "Done"

### Next Priority Tasks

1. **Phase 2.2** - Audit remaining generators for dead code
2. **Phase 5.7-5.8** - Migrate Tier 2 remaining generators (dropdown, combobox)
3. **Phase 3** - Parser improvements (arbitrary values, opacity modifiers)
4. **Phase 7** - Documentation updates

---

## Appendix: Generator Pattern

### Ideal Generator Structure

```typescript
// 1. Import registry
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

### Ideal Test Structure

```typescript
// 1. Import testable functions
import { getMyComponentVariantConfig, ... } from "./my-component";

// 2. Import registry for validation
import registry from "../../../../ai/component-registry.json";

// 3. Registry validation tests
describe("Registry Validation", () => { ... });

// 4. Structural validation tests
describe("Structural Validation", () => { ... });

// 5. Snapshot tests
describe("Snapshots", () => { ... });
```
