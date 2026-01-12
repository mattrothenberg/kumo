# Ralph Prompt - Phase 10: Hardcoded Values Elimination (Tabs, Toast, Shadow Validation)

You are eliminating remaining hardcoded values in Figma generators and adding drift protection. This is Phase 10 of the Figma plugin robustness project.

## CRITICAL CONTEXT

**Registry styling metadata already exists** for Tabs and Toast, but generators use hardcoded values instead of reading from registry.

### Current State - Tabs Generator

**File:** `scripts/figma/plugin/generators/tabs.ts`

```typescript
// CURRENT (HARDCODED - lines 42-57)
var TABS_CONFIG = {
  containerHeight: 34,
  borderRadius: 8,
  containerPadding: 1,
  tabVerticalMargin: 1,
  tabHorizontalPadding: 10,
  tabFontSize: 16,
  tabFontWeight: 500,
};
```

**Registry has:** `registry.components.Tabs.styling` with identical values!

```json
{
  "container": { "height": 34, "borderRadius": 8, "padding": 1 },
  "tab": {
    "paddingX": 10,
    "verticalMargin": 1,
    "fontSize": 16,
    "fontWeight": 500
  }
}
```

### Current State - Toast Generator

**File:** `scripts/figma/plugin/generators/toast.ts`

```typescript
// CURRENT (HARDCODED - line 47)
var TOAST_WIDTH = 300;

// Also hardcoded inline:
// title fontSize: 16 (line 126)
// description fontSize: 15 (line 166)
```

**Registry has:** `registry.components.Toasty.styling` with all values!

```json
{
  "container": { "width": 300, ... },
  "title": { "fontSize": 16, "fontWeight": 500 },
  "description": { "fontSize": 15, "fontWeight": 400 }
}
```

### Current State - SHADOWS.dialog

**File:** `scripts/figma/plugin/generators/shared.ts`

```typescript
// CURRENT (UNDOCUMENTED SOURCE - lines 144-151)
dialog: {
  offsetX: 0,
  offsetY: 8,
  blur: 32,
  spread: 0,
  opacity: 0.16,
}
```

**No CSS backing!** Need to add `--shadow-dialog` to `theme-kumo.css`.

## Phases Status

- Phase 1-9: COMPLETE
- **Phase 10: NOT STARTED** (This is what you're working on)

## Reference Files

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @tabs.ts - Generator with TABS_CONFIG to migrate
- @toast.ts - Generator with TOAST_WIDTH to migrate
- @shared.ts - Constants with SHADOWS.dialog to document
- @theme-kumo.css - CSS theme to add --shadow-dialog token
- @pagination.ts - Reference implementation of registry reading pattern

## Task Order

| Task | Title                                  | Priority | Status  |
| ---- | -------------------------------------- | -------- | ------- |
| T1   | Update tabs.ts to Read from Registry   | HIGH     | pending |
| T2   | Update toast.ts to Read from Registry  | HIGH     | pending |
| T3   | Add --shadow-dialog CSS Token          | HIGH     | pending |
| T4   | Add Shadow Dialog Drift Detection Test | HIGH     | pending |
| T5   | Add buttonCompactSize Drift Detection  | MEDIUM   | pending |
| T6   | Add Registry Enforcement Test          | MEDIUM   | pending |
| T7   | Final Verification                     | MEDIUM   | pending |

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Implement the changes as specified in the task's acceptance criteria
3. Run tests to verify:
   - For T1: `pnpm --filter @cloudflare/kumo test generators/tabs.test.ts --run`
   - For T2: `pnpm --filter @cloudflare/kumo test generators/toast.test.ts --run`
   - For T3-T6: `pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run`
4. Update PRD.json task status to "complete"
5. Append progress to progress.txt with:
   - Task ID and name
   - Files modified
   - What was changed
   - Test results
6. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message like: "fix(figma): T1 - update tabs.ts to read from registry"
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output `<promise>COMPLETE</promise>`.

## Task Details

### T1: Update tabs.ts to Read from Registry

**File:** `scripts/figma/plugin/generators/tabs.ts`

**Pattern:** Same as pagination.ts (see reference implementation)

```typescript
// ADD at top of file (after other imports)
import registry from "../../../../ai/component-registry.json";

// Type for registry styling
const tabsStyling = (registry.components as any).Tabs?.styling;

// RENAME existing TABS_CONFIG to FALLBACK_TABS_CONFIG
const FALLBACK_TABS_CONFIG = {
  containerHeight: 34,
  borderRadius: 8,
  containerPadding: 1,
  tabVerticalMargin: 1,
  tabHorizontalPadding: 10,
  tabFontSize: 16,
  tabFontWeight: 500,
};

// ADD new function to read from registry
function getTabsConfigFromRegistry() {
  if (!tabsStyling) {
    return FALLBACK_TABS_CONFIG;
  }

  return {
    containerHeight: tabsStyling.container?.height ?? FALLBACK_TABS_CONFIG.containerHeight,
    borderRadius: tabsStyling.container?.borderRadius ?? FALLBACK_TABS_CONFIG.borderRadius,
    containerPadding: tabsStyling.container?.padding ?? FALLBACK_TABS_CONFIG.containerPadding,
    tabVerticalMargin: tabsStyling.tab?.verticalMargin ?? FALLBACK_TABS_CONFIG.tabVerticalMargin,
    tabHorizontalPadding: tabsStyling.tab?.paddingX ?? FALLBACK_TABS_CONFIG.tabHorizontalPadding,
    tabFontSize: tabsStyling.tab?.fontSize ?? FALLBACK_TABS_CONFIG.tabFontSize,
    tabFontWeight: tabsStyling.tab?.fontWeight ?? FALLBACK_TABS_CONFIG.tabFontWeight,
  };
}

// REPLACE var TABS_CONFIG = {...} with:
var TABS_CONFIG = getTabsConfigFromRegistry();
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test generators/tabs.test.ts --run
```

**Expected:** All tests pass, no snapshot changes (values match).

### T2: Update toast.ts to Read from Registry

**File:** `scripts/figma/plugin/generators/toast.ts`

```typescript
// The registry import already exists (line 40)
// import registry from "../../../../ai/component-registry.json";

// ADD: Access styling
const toastStyling = (registry.components as any).Toasty?.styling;

// ADD: Fallback config
const FALLBACK_TOAST_CONFIG = {
  width: 300,
  titleFontSize: 16,
  titleFontWeight: 500,
  descriptionFontSize: 15,
  descriptionFontWeight: 400,
  closeButtonSize: 20,
  closeButtonIconSize: 16,
};

// ADD: Function to read from registry
function getToastConfigFromRegistry() {
  if (!toastStyling) {
    return FALLBACK_TOAST_CONFIG;
  }

  return {
    width: toastStyling.container?.width ?? FALLBACK_TOAST_CONFIG.width,
    titleFontSize: toastStyling.title?.fontSize ?? FALLBACK_TOAST_CONFIG.titleFontSize,
    titleFontWeight: toastStyling.title?.fontWeight ?? FALLBACK_TOAST_CONFIG.titleFontWeight,
    descriptionFontSize: toastStyling.description?.fontSize ?? FALLBACK_TOAST_CONFIG.descriptionFontSize,
    descriptionFontWeight: toastStyling.description?.fontWeight ?? FALLBACK_TOAST_CONFIG.descriptionFontWeight,
    closeButtonSize: toastStyling.closeButton?.size ?? FALLBACK_TOAST_CONFIG.closeButtonSize,
    closeButtonIconSize: toastStyling.closeButton?.iconSize ?? FALLBACK_TOAST_CONFIG.closeButtonIconSize,
  };
}

const TOAST_CONFIG = getToastConfigFromRegistry();

// REPLACE hardcoded usages:
// Line 47: var TOAST_WIDTH = 300; → var TOAST_WIDTH = TOAST_CONFIG.width;
// Line 69: component.resize(TOAST_WIDTH, 100);
// Line 126: createTextNode("Toast created", 16, 500) → createTextNode("Toast created", TOAST_CONFIG.titleFontSize, TOAST_CONFIG.titleFontWeight)
// Line 166: createTextNode(..., 15, 400) → createTextNode(..., TOAST_CONFIG.descriptionFontSize, TOAST_CONFIG.descriptionFontWeight)
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test generators/toast.test.ts --run
```

### T3: Add --shadow-dialog CSS Token

**File:** `packages/kumo/src/styles/theme-kumo.css`

Find the @theme block where other shadows are defined and add:

```css
@theme {
  /* ... existing shadow tokens ... */

  /* Dialog shadow - elevated appearance for dialogs, popovers */
  --shadow-dialog: 0 8px 32px rgb(0 0 0 / 0.16);
}
```

**File:** `scripts/figma/plugin/generators/shared.ts`

Update the comment on SHADOWS.dialog:

```typescript
/** Dialog shadow - elevated appearance. Matches --shadow-dialog in theme-kumo.css
 *  Format: 0 8px 32px rgb(0 0 0 / 0.16)
 *  - offsetY: 8px
 *  - blur: 32px
 *  - opacity: 0.16
 */
dialog: {
  offsetX: 0,
  offsetY: 8,
  blur: 32,
  spread: 0,
  opacity: 0.16,
},
```

### T4: Add Shadow Dialog Drift Detection Test

**File:** `scripts/figma/plugin/generators/drift-detection.test.ts`

Add new test at end of file (in CSS Theme Sync Validation describe block):

```typescript
it("should have SHADOWS.dialog matching --shadow-dialog in theme-kumo.css", () => {
  // Read theme-kumo.css
  const themeCssPath = join(__dirname, "../../../../src/styles/theme-kumo.css");
  const themeCss = readFileSync(themeCssPath, "utf-8");

  // Parse --shadow-dialog: 0 8px 32px rgb(0 0 0 / 0.16)
  const shadowMatch = themeCss.match(/--shadow-dialog:\s*0\s+(\d+)px\s+(\d+)px\s+rgb\(0\s+0\s+0\s*\/\s*([\d.]+)\)/);
  expect(shadowMatch).not.toBeNull();

  if (shadowMatch) {
    const cssOffsetY = parseInt(shadowMatch[1], 10);
    const cssBlur = parseInt(shadowMatch[2], 10);
    const cssOpacity = parseFloat(shadowMatch[3]);

    // Compare against SHADOWS.dialog
    expect(SHADOWS.dialog.offsetY).toBe(cssOffsetY);
    expect(SHADOWS.dialog.blur).toBe(cssBlur);
    expect(SHADOWS.dialog.opacity).toBe(cssOpacity);
  }
});
```

**Test command:**

```bash
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run
```

### T5: Add buttonCompactSize Drift Detection Test

**File:** `scripts/figma/plugin/generators/drift-detection.test.ts`

```typescript
it("should have buttonCompactSize matching button.tsx compactSize classes", () => {
  // Read button.tsx
  const buttonPath = join(__dirname, "../../../../src/components/button/button.tsx");
  const buttonContent = readFileSync(buttonPath, "utf-8");

  // Extract compactSize mapping from KUMO_BUTTON_VARIANTS
  // Pattern: xs: "size-3.5", sm: "size-6.5", base: "size-9", lg: "size-10"
  const extractSizeClass = (size: string): number | null => {
    const match = buttonContent.match(new RegExp(`${size}:\\s*["']size-([\\d.]+)["']`));
    if (!match) return null;
    // Convert Tailwind size to pixels: size-X = X * 4
    return parseFloat(match[1]) * 4;
  };

  const cssValues = {
    xs: extractSizeClass("xs"),
    sm: extractSizeClass("sm"),
    base: extractSizeClass("base"),
    lg: extractSizeClass("lg"),
  };

  // Validate we could parse the classes
  expect(cssValues.xs).toBe(14);  // size-3.5 = 14px
  expect(cssValues.sm).toBe(26);  // size-6.5 = 26px
  expect(cssValues.base).toBe(36); // size-9 = 36px
  expect(cssValues.lg).toBe(40);  // size-10 = 40px

  // Compare against FALLBACK_VALUES.buttonCompactSize
  expect(FALLBACK_VALUES.buttonCompactSize.xs).toBe(cssValues.xs);
  expect(FALLBACK_VALUES.buttonCompactSize.sm).toBe(cssValues.sm);
  expect(FALLBACK_VALUES.buttonCompactSize.base).toBe(cssValues.base);
  expect(FALLBACK_VALUES.buttonCompactSize.lg).toBe(cssValues.lg);
});
```

### T6: Add Registry Enforcement Test for Tabs/Toast

**File:** `scripts/figma/plugin/generators/drift-detection.test.ts`

```typescript
it("Tabs and Toast generators should read from component-registry.json", () => {
  const violations: string[] = [];

  // Check tabs.ts
  const tabsPath = join(__dirname, "tabs.ts");
  const tabsContent = readFileSync(tabsPath, "utf-8");

  if (!tabsContent.includes("component-registry.json")) {
    violations.push("tabs.ts: Does not import component-registry.json");
  }
  if (!tabsContent.includes("getTabsConfigFromRegistry") && !tabsContent.includes("tabsStyling")) {
    violations.push("tabs.ts: Does not read from registry styling");
  }

  // Check toast.ts
  const toastPath = join(__dirname, "toast.ts");
  const toastContent = readFileSync(toastPath, "utf-8");

  if (!toastContent.includes("component-registry.json")) {
    violations.push("toast.ts: Does not import component-registry.json");
  }
  if (!toastContent.includes("getToastConfigFromRegistry") && !toastContent.includes("toastStyling")) {
    violations.push("toast.ts: Does not read from registry styling");
  }

  expect(violations).toEqual([]);
});
```

## Validation Commands

```bash
# Run tabs tests
pnpm --filter @cloudflare/kumo test generators/tabs.test.ts --run

# Run toast tests
pnpm --filter @cloudflare/kumo test generators/toast.test.ts --run

# Run drift detection tests
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run
```

## Success Criteria

- [ ] tabs.ts reads from registry.components.Tabs.styling
- [ ] toast.ts reads from registry.components.Toasty.styling
- [ ] --shadow-dialog CSS token added to theme-kumo.css
- [ ] SHADOWS.dialog drift test passes
- [ ] buttonCompactSize drift test passes
- [ ] Registry enforcement test passes
- [ ] All 1500+ generator tests pass

## Progress Tracking

After each task, append to progress.txt:

```
---

## Iteration XX: TX - Task Title (PHASE 10)

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
