# Ralph Prompt - Phase 6: Magic Numbers Audit Remediation

You are completing the magic numbers audit remediation for Figma generators. This is Phase 6 of the Figma plugin robustness project.

## Context

Phases 1-5 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (all generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)
- Phase 4: Generator coverage (Breadcrumbs, Empty, PageHeader added)
- Phase 5: Initial magic number elimination (SHADOWS, GRID_LAYOUT, FALLBACK_VALUES added)

**Phase 6 addresses remaining issues from comprehensive audit:**

A thorough audit revealed ~40% of generators still have hardcoded values:

| Pattern                       | Locations                     | Risk   | Fix                             |
| ----------------------------- | ----------------------------- | ------ | ------------------------------- |
| `100, 50` section positioning | Every generator (~30+ files)  | High   | SECTION_LAYOUT constants        |
| `0.5` disabled opacity        | button, input, checkbox, etc. | Medium | OPACITY.disabled                |
| Label offsets `4, 8, 12`      | Most generators               | Medium | GRID_LAYOUT.labelVerticalOffset |
| RGB colors `{ r: 0.5, ... }`  | icon-utils.ts, dialog.ts      | Medium | COLORS constants                |
| Font sizes/weights            | dialog.ts, input.ts           | Medium | FALLBACK_VALUES                 |

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @shared.ts - Where centralized constants live
- @icon-utils.ts - High-risk file needing refactor
- @dialog.ts - High-risk file needing refactor
- @input.ts - High-risk file needing refactor

## Your Task

Address remaining magic numbers by adding new constants and refactoring generators.

## New Constants to Add (Tasks T1-T4)

### T1: SECTION_LAYOUT

```typescript
/**
 * Section positioning constants for Figma canvas layout
 */
export const SECTION_LAYOUT = {
  /** X position for section start */
  startX: 100,
  /** Y position for section start */
  startY: 100,
  /** Gap between light/dark mode sections */
  modeGap: 50,
} as const;
```

### T2: OPACITY

```typescript
/**
 * Opacity values for component states
 */
export const OPACITY = {
  /** Opacity for disabled state */
  disabled: 0.5,
  /** Opacity for backdrop/overlay */
  backdrop: 0.8,
} as const;
```

### T3: COLORS

```typescript
/**
 * RGB color constants for Figma
 */
export const COLORS = {
  /** Placeholder/fallback gray */
  placeholder: { r: 0.5, g: 0.5, b: 0.5 },
  /** Fallback white */
  fallbackWhite: { r: 1, g: 1, b: 1 },
  /** Spinner stroke color */
  spinnerStroke: { r: 0.4, g: 0.4, b: 0.4 },
} as const;
```

### T4: Extend GRID_LAYOUT

```typescript
export const GRID_LAYOUT = {
  // ... existing values
  /** Label vertical centering offsets by size */
  labelVerticalOffset: {
    /** Small offset for compact components (badge, loader) */
    sm: 4,
    /** Medium offset for standard components (input, checkbox) */
    md: 8,
    /** Large offset for larger components (button, dialog) */
    lg: 12,
  },
} as const;
```

## Refactoring Patterns

### Section Positioning (T5)

```typescript
// BEFORE - hardcoded everywhere
lightSection.x = 100;
darkSection.x = lightSection.x + lightSection.width + 50;

// AFTER - use constants
import { SECTION_LAYOUT } from './shared';
lightSection.x = SECTION_LAYOUT.startX;
darkSection.x = lightSection.x + lightSection.width + SECTION_LAYOUT.modeGap;
```

### Disabled Opacity (T6)

```typescript
// BEFORE - scattered 0.5 values
component.opacity = 0.5;

// AFTER - use constant
import { OPACITY } from './shared';
component.opacity = OPACITY.disabled;
```

### Placeholder Colors (T7 - icon-utils.ts)

```typescript
// BEFORE - hardcoded RGB
fills: [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]

// AFTER - use constant
import { COLORS } from './shared';
fills: [{ type: 'SOLID', color: COLORS.placeholder }]
```

### Label Vertical Offsets (T10)

```typescript
// BEFORE - magic numbers
labelText.y = rowY + 4;  // or 8, or 12

// AFTER - semantic selection
import { GRID_LAYOUT } from './shared';
labelText.y = rowY + GRID_LAYOUT.labelVerticalOffset.sm; // for badge, loader
labelText.y = rowY + GRID_LAYOUT.labelVerticalOffset.md; // for input, checkbox
labelText.y = rowY + GRID_LAYOUT.labelVerticalOffset.lg; // for button, dialog
```

## Task-Specific Notes

### T5: Refactor Section Positioning (HIGH PRIORITY)

This is the biggest task - every generator has hardcoded 100/50 values.

Search patterns to find:

- `x = 100` or `.x = 100`
- `+ 50` for mode gaps
- `y = 100` or `.y = 100`

Files to update (all generators):

- button.ts, input.ts, dialog.ts, badge.ts, tabs.ts, checkbox.ts
- loader.ts, text.ts, banner.ts, toast.ts, tooltip.ts, dropdown.ts
- select.ts, combobox.ts, switch.ts, meter.ts, pagination.ts
- collapsible.ts, code.ts, code-block.ts, clipboard-text.ts
- surface.ts, link-button.ts, refresh-button.ts, input-area.ts
- sensitive-input.ts, layer-card.ts, menubar.ts, date-range-picker.ts
- breadcrumbs.ts, empty.ts, page-header.ts

### T7: Refactor icon-utils.ts (HIGH RISK)

Current magic numbers:

- Line 13-18: `ICON_SIZE_MAP = { xs: 12, sm: 16, base: 20, lg: 20 }`
- Line 115: Corner radius multiplier `0.2`
- Line 116: Placeholder color `{ r: 0.6, g: 0.6, b: 0.6 }`
- Line 133: Default icon size `20`
- Line 154: Default loader size `16`
- Line 169: Spinner stroke `{ r: 0.4, g: 0.4, b: 0.4 }`
- Line 170: Spinner stroke weight `2`
- Line 174: Dash pattern `[4, 4]`

### T8: Refactor dialog.ts (HIGH RISK)

Current magic numbers:

- Lines 88-123: SIZE_CONFIG typography (titleSize: 20, descSize: 16, etc.)
- Lines 147-158: Button padding (12, 8, 16, etc.)
- Line 181, 296: Font sizes (14, 16)
- Line 187: White color `{ r: 1, g: 1, b: 1 }`
- Line 256: Header height (24)
- Line 322: Actions frame itemSpacing (12)
- Lines 435, 455: Label vertical offset (8)

### T11: Add DASH_PATTERN Constant

```typescript
/**
 * Dash pattern arrays for strokes
 */
export const DASH_PATTERN = {
  /** Standard dash pattern for dashed borders */
  standard: [4, 4],
} as const;
```

## Validation Checklist

Before marking a task complete:

- [ ] New constants added with JSDoc documentation
- [ ] Generators import from shared.ts
- [ ] No hardcoded values remain for the pattern being fixed
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

## Files with Most Magic Numbers (Priority Order)

1. **dialog.ts** - 15+ magic numbers (typography, layout, colors)
2. **icon-utils.ts** - 10+ magic numbers (sizes, colors, stroke)
3. **input.ts** - 10+ magic numbers (typography, spacing)
4. **button.ts** - 12+ magic numbers (sizes, opacity, offsets)
5. **tabs.ts** - 8+ magic numbers (config values, positioning)

## Success Criteria

- Zero hardcoded section positioning (100, 50)
- Zero hardcoded opacity (0.5) without OPACITY constant
- All placeholder colors use COLORS constants
- All label offsets use GRID_LAYOUT.labelVerticalOffset
- All typography fallbacks use FALLBACK_VALUES
- Enforcement tests catch regressions
- All tests pass
- No visual changes to generated components
