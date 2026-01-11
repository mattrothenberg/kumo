# Ralph Prompt - Phase 9: CSS-to-Constants Sync (Tailwind v4 Theme Alignment)

You are fixing **critical font size drift** between Kumo's CSS theme and the Figma plugin parser. This is Phase 9 of the Figma plugin robustness project.

## CRITICAL CONTEXT

**Kumo uses Tailwind v4** which defines theme values in CSS via `@theme` directive, NOT in `tailwind.config.js`.

The file `packages/kumo/src/styles/theme-kumo.css` contains:

```css
@theme {
  /* Typography - text sizes and line heights */
  --text-xs: 12px;
  --text-sm: 13px;   /* ← Kumo uses 13px, NOT Tailwind's default 14px! */
  --text-base: 14px; /* ← Kumo uses 14px, NOT Tailwind's default 16px! */
  --text-lg: 16px;   /* ← Kumo uses 16px, NOT Tailwind's default 18px! */
}
```

The Figma plugin's parser (`tailwind-to-figma.ts`) uses **WRONG** values:

```typescript
const FONT_SIZE_SCALE: Record<string, number> = {
  xs: 12,   // ✅ CORRECT
  sm: 14,   // ❌ WRONG - should be 13
  base: 16, // ❌ WRONG - should be 14
  lg: 18,   // ❌ WRONG - should be 16
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};
```

**Result:** All Figma-generated components using `text-sm`, `text-base`, or `text-lg` have INCORRECT font sizes.

## Phases Status

- Phase 1-7: COMPLETE
- Phase 8: IN PROGRESS (T1-T3 complete, T4-T6 pending → renumbered to T8-T10)
- **Phase 9: NOT STARTED** (This is what you're working on)

## Reference Files

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @theme-kumo.css - Source of truth for Kumo typography values
- @tailwind-to-figma.ts - Parser with FONT_SIZE_SCALE to fix
- @shared.ts - Constants with FONT_SIZE to fix

## Task Order (T4-T7 are Phase 9, T8-T10 are remaining Phase 8)

| Task | Title                                    | Priority | Status  |
| ---- | ---------------------------------------- | -------- | ------- |
| T4   | Fix FONT_SIZE_SCALE in Parser            | CRITICAL | pending |
| T5   | Fix FONT_SIZE in shared.ts               | CRITICAL | pending |
| T6   | Add CSS Theme Drift Detection Test       | HIGH     | pending |
| T7   | Update Snapshots with Correct Font Sizes | HIGH     | pending |
| T8   | Fix Remaining Test File Assertions       | MEDIUM   | pending |
| T9   | Convert Warning to Enforcement           | HIGH     | pending |
| T10  | Final Verification                       | MEDIUM   | pending |

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Implement the changes as specified in the task's `code_change` or `acceptance` criteria
3. Run tests to verify:
   - For T4-T5: Parser/generator tests may have snapshot failures (expected)
   - For T6: New drift detection test must pass
   - For T7: All snapshots updated with correct values
4. Update PRD.json task status to "complete"
5. Append progress to progress.txt with:
   - Task ID and name
   - Files modified
   - What was changed
   - Test results
6. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message like: "fix(figma): T4 - fix FONT_SIZE_SCALE to match theme-kumo.css"
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output `<promise>COMPLETE</promise>`.

## Task Details

### T4: Fix FONT_SIZE_SCALE in Parser

**File:** `scripts/figma/plugin/parsers/tailwind-to-figma.ts`

**Change lines 70-78:**

```typescript
// BEFORE (WRONG - Tailwind defaults)
const FONT_SIZE_SCALE: Record<string, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};

// AFTER (CORRECT - Kumo theme values from theme-kumo.css)
const FONT_SIZE_SCALE: Record<string, number> = {
  xs: 12,   // --text-xs: 12px
  sm: 13,   // --text-sm: 13px (Kumo override from Tailwind's 14px)
  base: 14, // --text-base: 14px (Kumo override from Tailwind's 16px)
  lg: 16,   // --text-lg: 16px (Kumo override from Tailwind's 18px)
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test parsers/ --run
```

**Expected:** Tests may fail or show snapshot diffs - this is correct behavior. Note the failures for T7.

### T5: Fix FONT_SIZE in shared.ts

**File:** `scripts/figma/plugin/generators/shared.ts`

**Change lines 34-41:**

```typescript
// BEFORE (WRONG - missing sm, wrong base and lg)
export const FONT_SIZE = {
  /** Extra small (12px) */
  xs: 12,
  /** Base (16px) */
  base: 16,
  /** Large (20px) */
  lg: 20,
} as const;

// AFTER (CORRECT - matches theme-kumo.css)
export const FONT_SIZE = {
  /** Extra small (12px) - matches --text-xs in theme-kumo.css */
  xs: 12,
  /** Small (13px) - matches --text-sm in theme-kumo.css (Kumo override from 14px) */
  sm: 13,
  /** Base (14px) - matches --text-base in theme-kumo.css (Kumo override from 16px) */
  base: 14,
  /** Large (16px) - matches --text-lg in theme-kumo.css (Kumo override from 18px) */
  lg: 16,
} as const;
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test generators/shared --run
```

### T6: Add CSS Theme Drift Detection Test

**File:** `scripts/figma/plugin/generators/drift-detection.test.ts`

**Add new test block at end of file:**

```typescript
/**
 * Phase 9: CSS Theme Sync Validation
 *
 * These tests ensure parser values match theme-kumo.css @theme definitions.
 * Kumo uses Tailwind v4 which defines theme values in CSS, not config.
 */
describe("Figma Plugin - CSS Theme Sync Validation", () => {
  it("should have FONT_SIZE_SCALE matching theme-kumo.css @theme values", () => {
    // Read theme-kumo.css
    const themeCssPath = join(__dirname, "../../../src/styles/theme-kumo.css");
    const themeCss = readFileSync(themeCssPath, "utf-8");

    // Parse @theme block for typography
    const extractFontSize = (name: string): number | null => {
      const match = themeCss.match(new RegExp(`--text-${name}:\\s*(\\d+)px`));
      return match ? parseInt(match[1], 10) : null;
    };

    const themeValues = {
      xs: extractFontSize("xs"),
      sm: extractFontSize("sm"),
      base: extractFontSize("base"),
      lg: extractFontSize("lg"),
    };

    // Validate we could parse the theme
    expect(themeValues.xs).toBe(12);
    expect(themeValues.sm).toBe(13);
    expect(themeValues.base).toBe(14);
    expect(themeValues.lg).toBe(16);

    // Read parser FONT_SIZE_SCALE
    const parserPath = join(__dirname, "../parsers/tailwind-to-figma.ts");
    const parserContent = readFileSync(parserPath, "utf-8");

    // Extract FONT_SIZE_SCALE values
    const extractParserValue = (name: string): number | null => {
      const match = parserContent.match(new RegExp(`${name}:\\s*(\\d+)`));
      return match ? parseInt(match[1], 10) : null;
    };

    const parserValues = {
      xs: extractParserValue("xs"),
      sm: extractParserValue("sm"),
      base: extractParserValue("base"),
      lg: extractParserValue("lg"),
    };

    // Validate parser matches theme
    expect(parserValues.xs).toBe(themeValues.xs);
    expect(parserValues.sm).toBe(themeValues.sm);
    expect(parserValues.base).toBe(themeValues.base);
    expect(parserValues.lg).toBe(themeValues.lg);
  });

  it("should have FONT_SIZE constant in shared.ts matching theme-kumo.css", () => {
    // Read theme-kumo.css
    const themeCssPath = join(__dirname, "../../../src/styles/theme-kumo.css");
    const themeCss = readFileSync(themeCssPath, "utf-8");

    const extractFontSize = (name: string): number | null => {
      const match = themeCss.match(new RegExp(`--text-${name}:\\s*(\\d+)px`));
      return match ? parseInt(match[1], 10) : null;
    };

    // Read shared.ts FONT_SIZE
    const sharedPath = join(__dirname, "shared.ts");
    const sharedContent = readFileSync(sharedPath, "utf-8");

    // Validate FONT_SIZE.sm exists (was missing)
    expect(/sm:\s*\d+/.test(sharedContent)).toBe(true);

    // Extract FONT_SIZE values
    const extractSharedValue = (name: string): number | null => {
      // Match pattern: name: NUMBER (within FONT_SIZE block)
      const fontSizeBlock = sharedContent.match(/export const FONT_SIZE = \{[\s\S]*?\} as const/);
      if (!fontSizeBlock) return null;
      const match = fontSizeBlock[0].match(new RegExp(`${name}:\\s*(\\d+)`));
      return match ? parseInt(match[1], 10) : null;
    };

    const sharedValues = {
      xs: extractSharedValue("xs"),
      sm: extractSharedValue("sm"),
      base: extractSharedValue("base"),
      lg: extractSharedValue("lg"),
    };

    // Validate shared matches theme
    expect(sharedValues.xs).toBe(extractFontSize("xs"));
    expect(sharedValues.sm).toBe(extractFontSize("sm"));
    expect(sharedValues.base).toBe(extractFontSize("base"));
    expect(sharedValues.lg).toBe(extractFontSize("lg"));
  });
});
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run
```

### T7: Update Snapshots

**After T4-T6 are complete, run:**

```bash
# See what snapshots changed
pnpm --filter @cloudflare/kumo test generators/ --run

# If changes look correct (font sizes changed from 14→13, 16→14, 18→16), update:
pnpm --filter @cloudflare/kumo test generators/ --run -u

# Verify all pass
pnpm --filter @cloudflare/kumo test generators/ --run
```

## Validation Commands

```bash
# Run specific parser tests
pnpm --filter @cloudflare/kumo test parsers/ --run

# Run drift detection
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run

# Run all generator tests (will show snapshot diffs)
pnpm --filter @cloudflare/kumo test generators/ --run

# Update snapshots after font size fixes
pnpm --filter @cloudflare/kumo test generators/ --run -u
```

## Success Criteria

- [ ] FONT_SIZE_SCALE in parser: xs=12, sm=13, base=14, lg=16
- [ ] FONT_SIZE in shared.ts: xs=12, sm=13, base=14, lg=16
- [ ] CSS theme drift detection test passes
- [ ] All generator snapshots updated with correct values
- [ ] All 1500+ tests pass

## Important Notes

1. **Snapshot changes are EXPECTED** - this is fixing incorrect values
2. **T4 and T5 should be done together** - they fix the same underlying issue
3. **T6 prevents future drift** - test will fail if values diverge again
4. **T7 is a mass update** - review diffs to confirm correctness before updating

## Progress Tracking

After each task, append to progress.txt:

```
---

## Iteration XX: TX - Task Title (PHASE 9)

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
- Changes observed (snapshot diffs, etc.)

**Status:** COMPLETE
```
