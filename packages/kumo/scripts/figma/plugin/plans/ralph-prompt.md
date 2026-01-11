# Ralph Prompt - Eliminate Magic Numbers from Figma Generators

You are eliminating magic numbers from Figma generators to ensure they stay in sync with component source code. This is Phase 5 of the Figma plugin robustness project.

## Context

Phases 1-4 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (all generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)
- Phase 4: Generator coverage (Breadcrumbs, Empty, PageHeader added)

**Current gap:** Generators contain hardcoded magic numbers that could drift from component implementations:

- `SECTION_PADDING = 48` and `SECTION_GAP = 160` duplicated in 5+ files
- Dialog `SIZE_CONFIG` with hardcoded widths (350, 384, 512, 768)
- Button `COMPACT_SIZE_MAP` with hardcoded sizes (14, 26, 36, 40)
- Shadow values hardcoded in Dialog and Tabs
- Scattered inline fallbacks (`|| 8`, `|| 12`, etc.)

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @shared.ts - Where centralized constants should live
- @parsers/tailwind-to-figma.ts - Parser for Tailwind classes

## Your Task

Eliminate magic numbers by centralizing constants and deriving values from the registry.

## Requirements

### 1. Centralize Constants in shared.ts

Add new constants to shared.ts:

```typescript
/**
 * Shadow presets for components
 */
export const SHADOWS = {
  /** Dialog shadow - elevated appearance */
  dialog: { offsetX: 0, offsetY: 8, blur: 32, spread: 0, opacity: 0.16 },
  /** Subtle shadow for tabs */
  subtle: { offsetX: 0, offsetY: 1, blur: 2, spread: 0, opacity: 0.05 },
} as const;

/**
 * Grid layout constants for component display
 */
export const GRID_LAYOUT = {
  /** Gap between rows in component grid */
  rowGap: 24,
  /** Width of label column */
  labelWidth: 160,
  /** Height of header row */
  headerHeight: 24,
} as const;

/**
 * Fallback values when parsing fails
 */
export const FALLBACK_VALUES = {
  fontSize: 16,
  fontWeight: 400,
  padding: 8,
  borderRadius: 8,
  gap: 6,
} as const;
```

### 2. Remove Duplicate Declarations

Find and remove duplicate `SECTION_PADDING` and `SECTION_GAP` declarations:

```typescript
// WRONG - duplicated in each file
var SECTION_PADDING = 48;
var SECTION_GAP = 160;

// CORRECT - import from shared.ts
import { SECTION_PADDING, SECTION_GAP } from "./shared";
```

### 3. Enhance Parser for Missing Classes

Add parsing for `min-w-*` and `size-*` classes in tailwind-to-figma.ts:

```typescript
// min-w-96, min-w-[32rem], min-w-[48rem]
const minWidthMatch = cls.match(/^min-w-(\d+)$/);
if (minWidthMatch) {
  result.minWidth = getOrDefault(SPACING_SCALE, minWidthMatch[1], parseFloat(minWidthMatch[1]) * 4);
  continue;
}

// size-3.5, size-6.5, size-9, size-10 (square sizing)
const sizeMatch = cls.match(/^size-(\d+\.?\d*)$/);
if (sizeMatch) {
  const size = getOrDefault(SPACING_SCALE, sizeMatch[1], parseFloat(sizeMatch[1]) * 4);
  result.width = size;
  result.height = size;
  continue;
}
```

### 4. Derive Values from Registry

Replace hardcoded values with parsed registry values:

```typescript
// WRONG - hardcoded
const COMPACT_SIZE_MAP = { xs: 14, sm: 26, base: 36, lg: 40 };

// CORRECT - derived from registry
function getCompactSizeMap(): Record<string, number> {
  const shapeProp = registry.components.Button.props.shape;
  const compactSizeClasses = shapeProp.compactSize || {};
  const result: Record<string, number> = {};

  for (const [size, classes] of Object.entries(compactSizeClasses)) {
    const parsed = parseTailwindClasses(classes);
    result[size] = parsed.width ?? FALLBACK_VALUES.compactSize[size];
  }

  return result;
}
```

## Validation Checklist

Before marking a task complete:

- [ ] No duplicate constant declarations across files
- [ ] New constants added to shared.ts with JSDoc comments
- [ ] Generators import from shared.ts instead of local declarations
- [ ] Parser handles new class patterns (min-w-_, size-_)
- [ ] All tests pass: `pnpm --filter @cloudflare/kumo test generators/ --run`
- [ ] Drift detection passes: `pnpm --filter @cloudflare/kumo validate:figma`
- [ ] No visual changes (snapshot tests unchanged)

## Run Tests

```bash
# Run specific generator test
pnpm --filter @cloudflare/kumo test generators/[name].test.ts --run

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run

# Run drift detection (includes magic number enforcement)
pnpm --filter @cloudflare/kumo validate:figma

# Run drift detection tests specifically
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run
```

## Enforcement Tests (Already Active)

The drift-detection.test.ts file now includes enforcement tests that will **fail** if you:

1. **Redeclare SECTION_PADDING or SECTION_GAP** in any generator (must import from shared.ts)
2. **Use SECTION_PADDING/SECTION_GAP without importing** from shared.ts
3. **Add hardcoded shadow effects** without importing SHADOWS from shared.ts (warning)

These tests run automatically with `pnpm validate:figma` and will catch regressions.

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Implement the changes following the patterns above
3. Run tests to verify all pass
4. Update PRD.json task status to "complete"
5. Append progress to progress.txt with:
   - Task name
   - Files modified
   - Test results
6. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Task-Specific Notes

### T1: Centralize Section Constants

Files with duplicate declarations to fix:

- generators/dialog.ts (lines 48-53)
- generators/input.ts (lines 36-41)
- generators/tabs.ts (lines 31-32)
- generators/text.ts (lines 55-60)
- generators/banner.ts (check for duplicates)

### T2: Add Shadow Scale

Dialog shadow (dialog.ts ~line 224):

```typescript
effects = [{
  type: "DROP_SHADOW",
  offset: { x: 0, y: 8 },
  radius: 32,
  spread: 0,
  color: { r: 0, g: 0, b: 0, a: 0.16 },
}];
```

Tabs shadow (tabs.ts ~line 246):

```typescript
effects = [{
  type: "DROP_SHADOW",
  offset: { x: 0, y: 1 },
  radius: 2,
  spread: 0,
  color: { r: 0, g: 0, b: 0, a: 0.05 },
}];
```

### T3: Add Layout Grid Constants

Common values across generators:

- `rowGap`: 24 (input.ts), 40 (button.ts)
- `labelColumnWidth`: 160 (tabs.ts), 180 (badge.ts), 200 (input.ts)
- `headerRowHeight`: 24 (input.ts, dialog.ts)

### T4: Parse Dialog Sizes

Dialog size classes in registry:

- sm: likely has specific classes
- base: `min-w-96` = 384px
- lg: `min-w-[32rem]` = 512px
- xl: `min-w-[48rem]` = 768px

### T5: Derive Compact Size Map

Button compactSize classes:

- xs: `size-3.5` = 14px
- sm: `size-6.5` = 26px
- base: `size-9` = 36px
- lg: `size-10` = 40px

### T6: Centralize Fallback Values

Common fallbacks found:

- `|| 8` (gap, padding)
- `|| 12` (padding)
- `|| 16` (fontSize)
- `|| 36` (button height)
- `|| 500` (fontWeight)
- `|| 9999` (borderRadius full)
