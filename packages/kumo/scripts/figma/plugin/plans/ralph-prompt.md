# Ralph Prompt - Phase 11: Comprehensive Hardcoded Values Elimination

You are eliminating ALL remaining hardcoded CSS-derived values in Figma generators. This is Phase 11 of the Figma plugin robustness project.

## IMPORTANT: File Path Context

You are running from `packages/kumo/scripts/figma/plugin/`. All file paths in this document are relative to `packages/kumo/` unless otherwise specified.

**Key paths:**

- `scripts/figma/plugin/generators/*.ts` → Generator files to fix
- `scripts/figma/plugin/generated/theme-data.json` → Source of truth for CSS values
- `scripts/figma/plugin/generators/shared.ts` → FONT_SIZE, BORDER_RADIUS, FALLBACK_VALUES exports

## CRITICAL CONTEXT

**Audit found ~100+ hardcoded values** across 15+ generator files that should use `themeData` or `shared.ts` constants.

### The Problem

Generators have hardcoded numeric values like:
```typescript
// BAD - hardcoded values that will drift when CSS changes
fontSize: 24,
fontSize: 14,
padding: 16,
borderRadius: 8,
gap: 8,
```

### The Solution

Replace with themeData or shared.ts references:
```typescript
// GOOD - derived from CSS sources
fontSize: themeData.tailwind.fontSize['2xl'],  // 24px
fontSize: FONT_SIZE.base,                       // 14px from theme-kumo.css
padding: themeData.tailwind.spacing.scale['4'], // 16px
borderRadius: BORDER_RADIUS.lg,                 // 8px
gap: themeData.tailwind.spacing.scale['2'],     // 8px
```

### Reference: theme-data.json Structure

```json
{
  "tailwind": {
    "spacing": {
      "scale": {
        "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24,
        "1.5": 6, "2.5": 10, "3.5": 14
      }
    },
    "fontSize": {
      "xs": 12, "sm": 14, "base": 16, "lg": 18, "2xl": 24
    },
    "borderRadius": {
      "xs": 2, "sm": 4, "md": 6, "lg": 8, "xl": 12
    }
  },
  "kumo": {
    "fontSize": {
      "xs": 12, "sm": 13, "base": 14, "lg": 16
    }
  },
  "computed": {
    "fontSize": {
      "xs": 12, "sm": 13, "base": 14, "lg": 16
    }
  }
}
```

### Reference: shared.ts Exports

```typescript
// Already available - just import and use
import { FONT_SIZE, BORDER_RADIUS, FALLBACK_VALUES, SPACING } from './shared';

FONT_SIZE.xs    // 12px (from kumo theme)
FONT_SIZE.sm    // 13px (from kumo theme)
FONT_SIZE.base  // 14px (from kumo theme)
FONT_SIZE.lg    // 16px (from kumo theme)

BORDER_RADIUS.xs   // 2px
BORDER_RADIUS.sm   // 4px
BORDER_RADIUS.md   // 6px
BORDER_RADIUS.lg   // 8px
BORDER_RADIUS.xl   // 12px

FALLBACK_VALUES.height.base           // 36px (h-9)
FALLBACK_VALUES.iconSize.sm           // 16px (size-4)
FALLBACK_VALUES.iconSize.base         // 20px (size-5)
FALLBACK_VALUES.iconSize.lg           // 48px (size-12)
FALLBACK_VALUES.fontWeight.normal     // 400
FALLBACK_VALUES.fontWeight.medium     // 500
FALLBACK_VALUES.fontWeight.semiBold   // 600
```

## Phases Status

- Phase 1-10: COMPLETE
- **Phase 11: IN PROGRESS** (This is what you're working on)

## Reference Files

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @theme-data.json - Source of truth for CSS values
- @shared.ts - Constants to use (FONT_SIZE, BORDER_RADIUS, FALLBACK_VALUES)

## Task Order

| Task | Title                                    | Priority | Status  |
| ---- | ---------------------------------------- | -------- | ------- |
| T1   | Fix empty.ts Hardcoded Values            | HIGH     | pending |
| T2   | Fix meter.ts Hardcoded Values            | HIGH     | pending |
| T3   | Fix combobox.ts Hardcoded Values         | HIGH     | pending |
| T4   | Fix surface.ts Hardcoded Values          | HIGH     | pending |
| T5   | Fix dropdown.ts Hardcoded Values         | HIGH     | pending |
| T6   | Fix layer-card.ts Hardcoded Values       | HIGH     | pending |
| T7   | Fix input-area.ts Hardcoded Values       | HIGH     | pending |
| T8   | Fix switch.ts Hardcoded Values           | MEDIUM   | pending |
| T9   | Fix pagination.ts Hardcoded Values       | MEDIUM   | pending |
| T10  | Fix menubar.ts Hardcoded Values          | MEDIUM   | pending |
| T11  | Fix collapsible.ts Hardcoded Values      | MEDIUM   | pending |
| T12  | Fix dialog.ts Hardcoded Values           | MEDIUM   | pending |
| T13  | Fix code-block.ts Hardcoded Values       | MEDIUM   | pending |
| T14  | Fix select.ts Hardcoded Values           | MEDIUM   | pending |
| T15  | Fix date-range-picker.ts Hardcoded Values| MEDIUM   | pending |
| T16  | Add Drift Detection Tests                | MEDIUM   | pending |
| T17  | Final Verification                       | MEDIUM   | pending |

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Read the target file to understand current hardcoded values
3. Implement the changes as specified in the task's acceptance criteria
4. Run tests to verify:
   - `pnpm --filter @cloudflare/kumo test generators/{filename}.test.ts --run`
5. Update PRD.json task status to "complete"
6. Append progress to progress.txt with:
   - Task ID and name
   - Files modified
   - What was changed
   - Test results
7. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message like: "fix(figma): T1 - fix empty.ts hardcoded values"
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output `<promise>COMPLETE</promise>`.

## Detailed Task Examples

### T1: Fix empty.ts Hardcoded Values

**File:** `scripts/figma/plugin/generators/empty.ts`

**Current (HARDCODED):**
```typescript
export function getEmptyTextConfig() {
  return {
    title: {
      text: "No data available",
      fontSize: 24, // text-2xl
      fontWeight: 600, // font-semibold
      colorToken: "text-color-surface",
    },
    description: {
      text: "...",
      fontSize: 14, // text-base (assuming 14px default)
      fontWeight: 400, // normal
      maxWidth: 560, // max-w-140 (140 * 4px = 560px)
      ...
    },
  };
}
```

**Fixed:**
```typescript
import themeData from "../generated/theme-data.json";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";

export function getEmptyTextConfig() {
  return {
    title: {
      text: "No data available",
      fontSize: themeData.tailwind.fontSize["2xl"], // 24px from Tailwind
      fontWeight: FALLBACK_VALUES.fontWeight.semiBold,
      colorToken: "text-color-surface",
    },
    description: {
      text: "...",
      fontSize: FONT_SIZE.base, // 14px from theme-kumo.css
      fontWeight: FALLBACK_VALUES.fontWeight.normal,
      maxWidth: 560, // FIGMA-SPECIFIC: max-w-140 layout width for Figma display
      ...
    },
  };
}
```

**Test command:**
```bash
pnpm --filter @cloudflare/kumo test generators/empty.test.ts --run
```

### T2: Fix meter.ts Hardcoded Values

**File:** `scripts/figma/plugin/generators/meter.ts`

**Current:**
```typescript
const METER_TRACK_HEIGHT = 8; // h-2 from meter.tsx
const METER_GAP = 8; // gap-2 from meter.tsx

export function getMeterTypographyConfig() {
  return {
    label: {
      fontSize: 12, // text-xs from meter.tsx
      ...
    },
    value: {
      fontSize: 14, // text-sm from meter.tsx  <-- WRONG! Kumo text-sm is 13px!
      fontWeight: 500,
      ...
    },
  };
}
```

**Fixed:**
```typescript
import themeData from "../generated/theme-data.json";
import { FONT_SIZE, FALLBACK_VALUES } from "./shared";

const METER_TRACK_HEIGHT = themeData.tailwind.spacing.scale["2"]; // h-2 = 8px
const METER_GAP = themeData.tailwind.spacing.scale["2"]; // gap-2 = 8px

export function getMeterTypographyConfig() {
  return {
    label: {
      fontSize: FONT_SIZE.xs, // 12px from theme-kumo.css
      ...
    },
    value: {
      fontSize: FONT_SIZE.sm, // 13px from theme-kumo.css (NOT 14!)
      fontWeight: FALLBACK_VALUES.fontWeight.medium,
      ...
    },
  };
}
```

### Pattern for FIGMA-SPECIFIC Values

Some values are intentionally hardcoded for Figma layout purposes (not CSS-derived):

```typescript
// FIGMA-SPECIFIC: Layout width for Figma canvas display, not from CSS
const COMPONENT_WIDTH = 280;

// FIGMA-SPECIFIC: Minimum button width for visual balance in Figma
const MIN_BUTTON_WIDTH = 70;
```

## Validation Commands

```bash
# Run specific generator test
pnpm --filter @cloudflare/kumo test generators/empty.test.ts --run
pnpm --filter @cloudflare/kumo test generators/meter.test.ts --run
# ... etc

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run

# Run drift detection tests
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run
```

## Success Criteria

- [ ] All 15 generator files updated to use themeData/shared constants
- [ ] Zero undocumented hardcoded fontSize/borderRadius/spacing
- [ ] All FIGMA-SPECIFIC values documented with comments
- [ ] Drift detection test for generator imports
- [ ] All 1500+ generator tests pass
- [ ] No snapshot changes (values should match)

## Progress Tracking

After each task, append to progress.txt:

```
---

## Iteration XX: TX - Task Title (PHASE 11)

**Task:** TX - Task Title
**Status:** ✅ Complete
**Date:** YYYY-MM-DD

### What was done:
1. ...
2. ...

### Files Modified:
- file1.ts
- file2.ts

### Test Results:
- ✅ Description of passing tests

**Status:** COMPLETE
```
