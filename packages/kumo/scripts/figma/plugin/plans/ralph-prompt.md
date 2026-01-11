# Ralph Prompt - Phase 8: Test File Assertion Hardening

You are eliminating fragile hardcoded assertions in test files. This is Phase 8 of the Figma plugin robustness project.

## Context

Phases 1-7 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)
- Phase 4: Generator coverage (Breadcrumbs, Empty, PageHeader added)
- Phase 5: Initial magic number elimination (SHADOWS, GRID_LAYOUT, FALLBACK_VALUES)
- Phase 6: Magic numbers audit (SECTION_LAYOUT, OPACITY, COLORS, enforcement tests)
- Phase 7: Full registry integration (all 5 generators read from registry.styling)

**Phase 8 Goal:** Replace 37 fragile hardcoded assertions with shared constants.

### Current Warnings (37 total)

The drift detection test warns about these patterns:

| File           | Count | Examples                                                |
| -------------- | ----- | ------------------------------------------------------- |
| banner.test.ts | 8     | `.toBe(16)` for font size, `.toBe(400)` for font weight |
| text.test.ts   | 5+    | `.toBe(600)` for semiBold, `.toBe(12)` for xs font      |
| select.test.ts | 2     | `.toBe(16)`, `.toBe(12)` for font sizes                 |
| Other files    | 22+   | Various font sizes, weights                             |

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @shared.ts - Constants to import (FONT_SIZE, FALLBACK_VALUES, etc.)

## Available Constants in shared.ts

```typescript
// Font sizes
export const FONT_SIZE = {
  xs: 12,    // text-xs
  base: 16,  // text-base
  lg: 20,    // text-lg
} as const;

// Font weights and other fallbacks
export const FALLBACK_VALUES = {
  fontWeight: {
    normal: 400,
    medium: 500,
    semiBold: 600,
  },
  // ... other properties
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 6,
  base: 8,
  lg: 12,
} as const;

// Opacity
export const OPACITY = {
  disabled: 0.5,
  backdrop: 0.8,
} as const;
```

## Pattern: Fix Test File Assertions

### Step 1: Add Import

```typescript
// At top of test file, after existing imports
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";
```

### Step 2: Replace Hardcoded Values

```typescript
// BEFORE - fragile
expect(parsed.fontSize).toBe(16);
expect(parsed.fontWeight).toBe(600);
expect(variant.text.fontWeight).toBe(400);

// AFTER - resilient
expect(parsed.fontSize).toBe(FONT_SIZE.base);
expect(parsed.fontWeight).toBe(FALLBACK_VALUES.fontWeight.semiBold);
expect(variant.text.fontWeight).toBe(FALLBACK_VALUES.fontWeight.normal);
```

### Replacement Reference

| Hardcoded    | Constant                                     | Context              |
| ------------ | -------------------------------------------- | -------------------- |
| `.toBe(12)`  | `.toBe(FONT_SIZE.xs)`                        | text-xs font size    |
| `.toBe(16)`  | `.toBe(FONT_SIZE.base)`                      | text-base font size  |
| `.toBe(20)`  | `.toBe(FONT_SIZE.lg)`                        | text-lg font size    |
| `.toBe(400)` | `.toBe(FALLBACK_VALUES.fontWeight.normal)`   | normal font weight   |
| `.toBe(500)` | `.toBe(FALLBACK_VALUES.fontWeight.medium)`   | medium font weight   |
| `.toBe(600)` | `.toBe(FALLBACK_VALUES.fontWeight.semiBold)` | semibold font weight |

### Values to Keep As-Is

Some values don't have shared constants and should remain hardcoded with a comment:

- `.toBe(30)` - text-3xl (30px) - specific heading size
- `.toBe(24)` - text-2xl (24px) - specific heading size
- `.toBe(18)` - text-lg (18px) - could add FONT_SIZE.lg_sm or keep
- `.toBe(14)` - text-sm (14px) - could add FONT_SIZE.sm or keep

If needed, you can add missing constants to shared.ts:

```typescript
export const FONT_SIZE = {
  xs: 12,
  sm: 14,    // ADD if needed
  base: 16,
  lg: 20,
  // Optional heading sizes:
  // lg_text: 18,  // text-lg
  // xl2: 24,      // text-2xl
  // xl3: 30,      // text-3xl
} as const;
```

## Validation Commands

```bash
# Run specific test file
pnpm --filter @cloudflare/kumo test generators/banner.test.ts --run

# Run drift detection to see warnings
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run
```

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Implement the changes:
   - Add import for shared constants
   - Replace hardcoded values with constants
   - Keep values that don't have constants (with optional comment)
3. Run tests to verify:
   - All tests in modified file pass
   - Drift detection warnings reduced
4. Update PRD.json task status to "complete"
5. Append progress to progress.txt with:
   - Task ID and name
   - Files modified
   - Number of replacements made
   - Test results
6. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message like: "fix(figma): T1 - replace hardcoded assertions in banner.test.ts"
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Important Notes

1. **Only replace values that have constants** - don't invent new constants
2. **Keep test logic identical** - only change the values being compared
3. **Check drift detection after each file** - warnings should decrease
4. **T5 converts warning to enforcement** - only do after T1-T4 are complete
5. **Pre-existing TypeScript errors** in test files are known issues - ignore them

## Progress Tracking

Track warnings count after each task:

- Start: 37 warnings
- T1 complete: ~29 warnings (banner.test.ts fixed)
- T2 complete: ~24 warnings (text.test.ts fixed)
- T3 complete: ~22 warnings (select.test.ts fixed)
- T4 complete: ~0 warnings (remaining files fixed)
- T5 complete: Enforcement active (test fails on new fragile assertions)

## Success Criteria

- All 37 fragile assertions replaced or documented
- Drift detection enforcement test passes
- All 1500+ generator tests pass
- No snapshot changes

## Example: Fixing banner.test.ts

```typescript
// Before
import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
// ...

it("should parse font size from base styles", () => {
  const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
  expect(parsed.fontSize).toBe(16); // text-base = 16px
});

// After
import { describe, it, expect } from "vitest";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";
// ...

it("should parse font size from base styles", () => {
  const parsed = parseTailwindClasses(BANNER_BASE_STYLES);
  expect(parsed.fontSize).toBe(FONT_SIZE.base); // text-base
});
```
