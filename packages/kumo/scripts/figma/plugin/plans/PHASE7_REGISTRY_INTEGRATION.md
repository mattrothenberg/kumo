# Phase 7: Full Registry Integration Plan

**Date:** 2026-01-11  
**Phase:** 7 - Full Registry Integration  
**Status:** COMPLETE ✅  
**Goal:** Ensure all Figma generators derive styling values from component-registry.json for automatic sync with code changes  
**Completion Date:** 2026-01-11

---

## Completion Summary

**Phase 7 is COMPLETE!** All 5 generators now read styling metadata from component-registry.json.

### Final Metrics

| Metric                                   | Before Phase 7 | After Phase 7 | Status  |
| ---------------------------------------- | -------------- | ------------- | ------- |
| Components with full styling metadata    | 7/12           | 12/12         | ✅ 100% |
| Generators reading from registry.styling | 0/5            | 5/5           | ✅ 100% |
| Hardcoded SIZE_CONFIG objects            | 5              | 0             | ✅ 100% |
| Drift detection tests                    | 19/19 passing  | 20/20 passing | ✅      |
| Generator tests                          | 1501 passing   | 1501 passing  | ✅      |
| Snapshot changes                         | N/A            | 0             | ✅      |

### Components Migrated

1. ✅ **DateRangePicker** - Now reads sizeVariants (sm, base, lg) with dimensions from registry
2. ✅ **Pagination** - Now reads layout dimensions (height, buttonSize, inputWidth, iconSize, gap, borderRadius) from registry
3. ✅ **InputArea** - Now reads sizeVariants (xs, sm, base, lg) with minHeight and width from registry
4. ✅ **LayerCard** - Now reads container and section styling (width, padding, fontSize, fontWeight) from registry
5. ✅ **MenuBar** - Now reads container and button dimensions (height, width, iconSize, borderRadius) from registry

### Test Results

- **Enforcement Test:** 0 violations (all 5 generators pass registry.styling check)
- **Drift Detection:** All 20 tests pass
- **Generator Tests:** All 1501 tests pass across 32 test suites
- **Visual Stability:** 0 snapshot changes (values match original hardcoded values exactly)

### Files Modified

- `scripts/ai/component-registry.ts` - Added 5 new COMPONENT_STYLING_METADATA entries
- `scripts/figma/plugin/generators/date-range-picker.ts` - Reads from registry
- `scripts/figma/plugin/generators/pagination.ts` - Reads from registry
- `scripts/figma/plugin/generators/input-area.ts` - Reads from registry
- `scripts/figma/plugin/generators/layer-card.ts` - Reads from registry
- `scripts/figma/plugin/generators/menubar.ts` - Reads from registry
- `scripts/figma/plugin/generators/drift-detection.test.ts` - Added registry integration enforcement test
- `scripts/figma/plugin/generators/dropdown.ts` - Added JSDoc explaining intentional divergence
- `scripts/figma/plugin/generators/combobox.ts` - Added JSDoc explaining intentional divergence

### Intentional Divergences Documented

- **Dropdown** - Figma variants (default, withIcons, withDanger, withGroups, withCheckbox, withShortcuts) differ from React variants (default, danger) for demonstration purposes
- **Combobox** - Figma variants (default, withLabel, withError) show visual configurations for design exploration

---

## Executive Summary

Phase 6 eliminated ~95% of hardcoded magic numbers by centralizing constants in `shared.ts`. Phase 7 addresses the remaining gap: **generators that have hardcoded dimension/styling values that exist in the source React components but aren't exposed through the registry**.

The solution is to add detailed styling metadata to `COMPONENT_STYLING_METADATA` in `scripts/ai/component-registry.ts`, then update generators to read from `registry.components.X.styling`.

---

## Current Architecture

### How Figma-Code Sync Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CODE → FIGMA SYNC PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. React Component (source of truth)                                       │
│     └── src/components/button/button.tsx                                    │
│         └── exports KUMO_BUTTON_VARIANTS, KUMO_BUTTON_DEFAULT_VARIANTS      │
│                                                                             │
│  2. Registry Generator (extracts metadata)                                  │
│     └── scripts/ai/component-registry.ts                                    │
│         └── pnpm codegen:registry                                           │
│         └── outputs: ai/component-registry.json                             │
│                                                                             │
│  3. Figma Generator (reads registry, creates Figma components)              │
│     └── scripts/figma/plugin/generators/button.ts                           │
│         └── import registry from "../../../../ai/component-registry.json"   │
│         └── reads: registry.components.Button.props, .styling               │
│                                                                             │
│  4. Figma Plugin (runs generators in Figma)                                 │
│     └── scripts/figma/plugin/code.ts                                        │
│         └── Plugins > Development > Kumo UI Kit Generator                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Two Sources of Styling Data

| Source                                    | What It Captures                                        | Limitation                           |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| **`KUMO_*_VARIANTS`** (auto-extracted)    | Tailwind class strings (`h-9 gap-2 rounded-lg`)         | Only strings, no parsed pixel values |
| **`COMPONENT_STYLING_METADATA`** (manual) | Full dimensions (`height: 36, gap: 8, borderRadius: 8`) | Requires manual sync                 |

### Components with Full Styling Metadata (✅ Good)

These components have detailed `styling` sections in the registry:

- **Checkbox** - dimensions, borderRadius, states, icons
- **ClipboardText** - sizeVariants with height, paddingX, gap, borderRadius, fontSize
- **Code** - dimensions, borderRadius, states
- **Input** - sizeVariants with height, paddingX, fontSize, borderRadius
- **Tabs** - container, tab, indicator dimensions
- **Dialog** - sizeVariants with padding, gap, borderRadius
- **Toasty** - container, title, description, closeButton dimensions

### Components Missing Full Styling Metadata (❌ Gap)

These generators have hardcoded values that should come from registry:

| Component           | Hardcoded Values                                                                    | Source File                                | Risk Level |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ | ---------- |
| **DateRangePicker** | SIZE_CONFIG: calendarWidth, cellHeight, cellWidth, textSize, iconSize, padding, gap | `date-range-picker.tsx` lines 9-37         | **HIGH**   |
| **Pagination**      | PAGINATION_HEIGHT, BUTTON_SIZE, INPUT_WIDTH, ICON_SIZE, GAP, BORDER_RADIUS          | `pagination.tsx`                           | **MEDIUM** |
| **InputArea**       | minHeight, width per size                                                           | Uses Input registry but adds custom values | **MEDIUM** |
| **LayerCard**       | LAYER_CARD_CONFIG: width, borderRadius, padding, fontSize, fontWeight               | `layer-card.tsx`                           | **MEDIUM** |
| **MenuBar**         | MENUBAR_CONFIG: height, buttonWidth, iconSize, borderRadius                         | `menubar.tsx`                              | **MEDIUM** |
| **Switch**          | SWITCH_DIMENSIONS: track width/height per size                                      | Already parses from Tailwind               | **LOW**    |
| **Dropdown**        | DROPDOWN_WIDTH, variant-specific styling                                            | Intentional Figma variants                 | **LOW**    |
| **Combobox**        | VARIANT_CONFIG, styling                                                             | Intentional Figma variants                 | **LOW**    |

---

## Migration Tasks

### Task 1: DateRangePicker Styling Metadata (HIGH PRIORITY)

**Current State:** `date-range-picker.ts` has hardcoded `SIZE_CONFIG`:

```typescript
// HARDCODED in Figma generator
var SIZE_CONFIG = {
  sm: { calendarWidth: 168, cellHeight: 22, cellWidth: 24, textSize: 12, iconSize: 14, padding: 12, gap: 8 },
  base: { calendarWidth: 196, cellHeight: 26, cellWidth: 28, textSize: 14, iconSize: 16, padding: 16, gap: 10 },
  lg: { calendarWidth: 252, cellHeight: 32, cellWidth: 36, textSize: 16, iconSize: 18, padding: 20, gap: 12 },
};
```

**Source of Truth:** `date-range-picker.tsx` exports `KUMO_DATE_RANGE_PICKER_VARIANTS`:

```typescript
// SOURCE in React component
export const KUMO_DATE_RANGE_PICKER_VARIANTS = {
  size: {
    sm: { classes: "p-3 gap-2", cellHeight: "h-[22px]", cellWidth: "w-6", calendarWidth: "w-[168px]", textSize: "text-xs", iconSize: 14 },
    base: { classes: "p-4 gap-2.5", cellHeight: "h-[26px]", cellWidth: "w-7", calendarWidth: "w-[196px]", textSize: "text-sm", iconSize: 16 },
    lg: { classes: "p-5 gap-3", cellHeight: "h-[32px]", cellWidth: "w-9", calendarWidth: "w-[252px]", textSize: "text-base", iconSize: 18 },
  },
  // ...
};
```

**Solution:** Add `COMPONENT_STYLING_METADATA` entry:

```typescript
// Add to scripts/ai/component-registry.ts
DateRangePicker: {
  sizeVariants: {
    sm: {
      height: 0, // Auto
      classes: "p-3 gap-2",
      dimensions: {
        calendarWidth: 168,
        cellHeight: 22,
        cellWidth: 24,
        textSize: 12,
        iconSize: 14,
        padding: 12,
        gap: 8,
      },
    },
    base: {
      height: 0,
      classes: "p-4 gap-2.5",
      dimensions: {
        calendarWidth: 196,
        cellHeight: 26,
        cellWidth: 28,
        textSize: 14,
        iconSize: 16,
        padding: 16,
        gap: 10,
      },
    },
    lg: {
      height: 0,
      classes: "p-5 gap-3",
      dimensions: {
        calendarWidth: 252,
        cellHeight: 32,
        cellWidth: 36,
        textSize: 16,
        iconSize: 18,
        padding: 20,
        gap: 12,
      },
    },
  },
} as any,
```

**Then update generator:**

```typescript
// In date-range-picker.ts
var dateRangePickerStyling = (registry.components.DateRangePicker as any).styling;
var SIZE_CONFIG = dateRangePickerStyling?.sizeVariants || FALLBACK_SIZE_CONFIG;
```

**Acceptance Criteria:**

- [x] `COMPONENT_STYLING_METADATA.DateRangePicker` added with sizeVariants
- [x] `pnpm codegen:registry` regenerates registry with styling section
- [x] Generator reads from `registry.components.DateRangePicker.styling`
- [x] All 40 date-range-picker tests pass
- [x] Snapshots unchanged (values match)

---

### Task 2: Pagination Styling Metadata (MEDIUM PRIORITY)

**Current State:** Hardcoded constants:

```typescript
const PAGINATION_HEIGHT = 36;
const BUTTON_SIZE = 36;
const INPUT_WIDTH = 50;
const ICON_SIZE = 16;
```

**Solution:** Add styling metadata and derive from Button/Input where possible:

```typescript
Pagination: {
  layout: {
    height: 36, // Matches Button base height
    buttonSize: 36, // Square button
    inputWidth: 50,
    iconSize: 16,
    gap: 8,
    borderRadius: 8,
  },
  buttons: {
    variant: "secondary",
    size: "base",
  },
  input: {
    size: "base",
  },
} as any,
```

**Acceptance Criteria:**

- [x] `COMPONENT_STYLING_METADATA.Pagination` added
- [x] Generator reads from registry
- [x] All 51 pagination tests pass

---

### Task 3: InputArea Styling Metadata (MEDIUM PRIORITY)

**Current State:** Uses Input registry but adds hardcoded minHeight/width:

```typescript
var SIZE_CONFIG = {
  xs: { minHeight: 60, paddingX: 6, ... },
  sm: { minHeight: 70, paddingX: 8, ... },
  base: { minHeight: 80, paddingX: 12, ... },
  lg: { minHeight: 100, paddingX: 16, ... },
};
```

**Solution:** Add InputArea-specific styling:

```typescript
InputArea: {
  sizeVariants: {
    xs: { minHeight: 60, width: 160 },
    sm: { minHeight: 70, width: 200 },
    base: { minHeight: 80, width: 280 },
    lg: { minHeight: 100, width: 320 },
  },
  // Inherits other values from Input.sizeVariants
} as any,
```

**Acceptance Criteria:**

- [x] `COMPONENT_STYLING_METADATA.InputArea` added
- [x] Generator reads from registry
- [x] All 40 input-area tests pass

---

### Task 4: LayerCard Styling Metadata (MEDIUM PRIORITY)

**Current State:** Hardcoded LAYER_CARD_CONFIG:

```typescript
const LAYER_CARD_CONFIG = {
  width: 320,
  borderRadius: 8,
  secondary: { paddingX: 16, paddingY: 12, fontSize: 14, fontWeight: 500 },
  primary: { paddingX: 16, paddingY: 16, fontSize: 14, fontWeight: 400 },
};
```

**Solution:**

```typescript
LayerCard: {
  container: {
    width: 320,
    borderRadius: 8,
  },
  secondary: {
    paddingX: 16,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
    background: "color-surface-2",
    textColor: "text-color-label",
  },
  primary: {
    paddingX: 16,
    paddingY: 16,
    fontSize: 14,
    fontWeight: 400,
    background: "color-layer-card-primary",
  },
} as any,
```

**Acceptance Criteria:**

- [x] `COMPONENT_STYLING_METADATA.LayerCard` added
- [x] Generator reads from registry
- [x] All 34 layer-card tests pass

---

### Task 5: MenuBar Styling Metadata (MEDIUM PRIORITY)

**Current State:** Hardcoded MENUBAR_CONFIG:

```typescript
const MENUBAR_CONFIG = {
  height: 32,
  buttonWidth: 36,
  iconSize: 18,
  borderRadius: 8,
  buttonBorderRadius: 6,
};
```

**Solution:**

```typescript
MenuBar: {
  container: {
    height: 32,
    borderRadius: 8,
    padding: 2,
    gap: 2,
    background: "color-color",
    border: "color-border",
  },
  button: {
    width: 36,
    borderRadius: 6,
    iconSize: 18,
    activeBackground: "color-surface",
    inactiveBackground: "color-color",
    iconColor: "fill-surface-inverse",
  },
} as any,
```

**Acceptance Criteria:**

- [x] `COMPONENT_STYLING_METADATA.MenuBar` added
- [x] Generator reads from registry
- [x] All 35 menubar tests pass

---

### Task 6: Document Intentional Divergences (LOW PRIORITY)

**Dropdown and Combobox** intentionally use Figma-specific variants for demonstration purposes:

| React Variant | Figma Variant                        | Purpose                            |
| ------------- | ------------------------------------ | ---------------------------------- |
| `default`     | `default`, `withIcons`, `withGroups` | Show different menu configurations |
| `danger`      | `withDanger`                         | Show destructive option styling    |
| -             | `withCheckbox`, `withShortcuts`      | Show additional features           |

**Action:** Add JSDoc comments explaining this intentional divergence.

---

## Implementation Order

| Priority | Task                             | Effort  | Impact                                     |
| -------- | -------------------------------- | ------- | ------------------------------------------ |
| 1        | DateRangePicker styling metadata | 2 hours | High - eliminates largest hardcoded config |
| 2        | Pagination styling metadata      | 1 hour  | Medium                                     |
| 3        | InputArea styling metadata       | 1 hour  | Medium                                     |
| 4        | LayerCard styling metadata       | 1 hour  | Medium                                     |
| 5        | MenuBar styling metadata         | 1 hour  | Medium                                     |
| 6        | Document Dropdown/Combobox       | 30 min  | Low                                        |

**Total Estimated Effort:** 6-7 hours

---

## Enforcement Strategy

### New Drift Detection Test

Add to `drift-detection.test.ts`:

```typescript
it("should not have SIZE_CONFIG/VARIANT_CONFIG without registry import", () => {
  // Check for hardcoded config objects that should come from registry
  const configPatterns = [
    /(?:const|var)\s+SIZE_CONFIG\s*[=:]/,
    /(?:const|var)\s+VARIANT_CONFIG\s*[=:]/,
    /(?:const|var)\s+\w+_CONFIG\s*[=:]\s*\{/,
  ];

  for (const file of generatorFiles) {
    const content = readFileSync(file, "utf-8");
    const importsRegistry = /import registry from/.test(content);
    const readsFromStyling = /registry\.components\.\w+\.styling/.test(content);

    for (const pattern of configPatterns) {
      if (pattern.test(content) && !readsFromStyling) {
        warnings.push(`${file}: Has CONFIG object that may need registry integration`);
      }
    }
  }
});
```

---

## Success Criteria

| Metric                                   | Target                   |
| ---------------------------------------- | ------------------------ |
| Components with full styling metadata    | 12/12 (currently 7/12)   |
| Generators reading from registry.styling | 100% where applicable    |
| Hardcoded SIZE_CONFIG objects            | 0 (currently 5)          |
| Drift detection tests                    | All passing              |
| Test count                               | Maintained (1500+ tests) |
| Snapshot changes                         | None (values match)      |

---

## Validation Commands

```bash
# Regenerate registry with new styling metadata
pnpm --filter @cloudflare/kumo codegen:registry

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run

# Run drift detection specifically
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run

# Verify registry has styling sections
cat packages/kumo/ai/component-registry.json | jq '.components.DateRangePicker.styling'

# Search for remaining hardcoded configs
grep -rn "SIZE_CONFIG\s*=" packages/kumo/scripts/figma/plugin/generators/*.ts
```

---

## Appendix: Reference Pattern

Example of well-integrated generator (Input):

```typescript
// input.ts - reads from registry styling
import registry from "../../../../ai/component-registry.json";

var inputComponent = registry.components.Input;
var inputStyling = (inputComponent as any).styling;

// Derive SIZE_CONFIG from registry
function getSizeConfigFromRegistry(): Record<string, SizeConfig> {
  const config: Record<string, SizeConfig> = {};

  if (inputStyling?.sizeVariants) {
    for (const [size, data] of Object.entries(inputStyling.sizeVariants)) {
      config[size] = {
        height: data.height,
        paddingX: data.dimensions?.paddingX || FALLBACK_VALUES.padding.horizontal,
        fontSize: data.dimensions?.fontSize || FALLBACK_VALUES.fontSize,
        borderRadius: data.dimensions?.borderRadius || BORDER_RADIUS.lg,
      };
    }
  }

  return config;
}

var SIZE_CONFIG = getSizeConfigFromRegistry();
```

This pattern ensures:

1. Values come from registry (source of truth)
2. Fallbacks exist for graceful degradation
3. Changes to React component propagate to Figma

---

## Next Steps

1. **Review this plan** - Get approval before implementation
2. **Bump CACHE_VERSION** in `component-registry.ts` when adding metadata
3. **Implement Task 1** (DateRangePicker) as proof of concept
4. **Run full test suite** after each task
5. **Document patterns** for future generator authors
