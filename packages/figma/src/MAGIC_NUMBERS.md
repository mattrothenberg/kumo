# Magic Numbers Documentation

This document catalogs all remaining hardcoded dimensional values in Figma generators after Phase 5 centralization effort.

## Overview

After Phase 5 (Eliminate Magic Numbers), the following hardcoded values remain. Each is documented with:

- **Location**: File and approximate line number
- **Value**: The hardcoded number(s)
- **Justification**: Why this value is hardcoded (not centralized or derived from registry)
- **Status**: `JUSTIFIED` (intentional) or `TODO` (should be addressed in future)

## Centralized Constants (in shared.ts)

These values are centralized and reused across generators:

- **SECTION_PADDING**: 48px - Padding inside each section
- **SECTION_GAP**: 160px - Gap between sections
- **SHADOWS.dialog**: Shadow for elevated components (Dialog)
- **SHADOWS.subtle**: Subtle shadow (Tabs, Surface, MenuBar, Toast)
- **GRID_LAYOUT.rowGap**: Row gaps for component grids (compact: 24, medium: 40, standard: 48, spacious: 60, extraSpacious: 80)
- **GRID_LAYOUT.labelColumnWidth**: Label column widths (minimal: 100, compact: 120, small: 140, standard: 160, medium: 180, wide: 200, wider: 220, widest: 280)
- **GRID_LAYOUT.headerRowHeight**: 24px - Height of header row
- **FALLBACK_VALUES**: Comprehensive fallback values for parser failures

## Justified Hardcoded Values

### 1. Component-Specific Dimensions (Not Variants)

These values are specific to individual components and don't vary by size/variant:

#### Dialog (dialog.ts)

- **SIZE_CONFIG padding/gap**: Derived from registry Tailwind classes (T4 complete)
- **closeIcon.size: 20**: Icon size for close button - matches design spec for Dialog specifically
- **STATUS**: `JUSTIFIED` - Close button icon size is fixed for Dialog UX

#### Empty (empty.ts)

- **width: 600**: Fixed width for empty state container
- **STATUS**: `JUSTIFIED` - Empty state components need fixed width for proper layout

#### Breadcrumbs (breadcrumbs.ts)

- **size: 20**: Separator icon size (ph-caret-right)
- **STATUS**: `JUSTIFIED` - Separator icon size is fixed for breadcrumbs readability

#### Combobox (combobox.ts)

- **width: 280**: Trigger and dropdown width
- **height: 36**: Trigger height (matches Input base height)
- **height: 120**: Dropdown panel height
- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Layout-specific dimensions for combobox display

#### Dropdown (dropdown.ts)

- **padding: 6**: Menu padding (p-1.5)
- **height: 32**: Menu item height
- **STATUS**: `JUSTIFIED` - Menu item dimensions match design system

#### Select (select.ts)

- **height: 36**: Trigger height (h-9)
- **padding: 6**: Popup padding (p-1.5)
- **width: 280**: Layout-specific width
- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Matches Input component dimensions

#### Input (input.ts)

- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Standard disabled opacity across all form controls

#### Input Area (input-area.ts)

- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Matches Input disabled state

#### Sensitive Input (sensitive-input.ts)

- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Matches Input disabled state

#### Switch (switch.ts)

- **SWITCH_DIMENSIONS**: Derived from registry size-\* classes (T5 complete)
- **STATUS**: `JUSTIFIED` - Dimensions now parsed from registry

#### Collapsible (collapsible.ts)

- **opacity: 0.5**: Disabled state opacity
- **STATUS**: `JUSTIFIED` - Standard disabled state

### 2. Shadow Effects (Centralized in shared.ts)

All shadow effects now use SHADOWS constant from shared.ts:

#### Dialog (dialog.ts)

- Uses **SHADOWS.dialog** (0px 8px 32px rgba(0,0,0,0.16))
- **STATUS**: `JUSTIFIED` - Centralized in shared.ts (T2 complete)

#### Tabs (tabs.ts)

- Uses **SHADOWS.subtle** (0px 1px 2px rgba(0,0,0,0.05))
- **STATUS**: `JUSTIFIED` - Centralized in shared.ts (T2 complete)

#### Surface (surface.ts)

- Uses **SHADOWS.subtle** (0px 1px 2px rgba(0,0,0,0.05))
- **STATUS**: `JUSTIFIED` - Centralized in shared.ts (T2 complete)

#### MenuBar (menubar.ts)

- Uses **SHADOWS.subtle** (0px 1px 2px rgba(0,0,0,0.05))
- **STATUS**: `JUSTIFIED` - Centralized in shared.ts (T2 complete)

#### Toast (toast.ts)

- **Primary shadow**: radius 15, spread 0 (different from standard shadows)
- **Subtle shadow**: radius 6, spread 0 (different from standard shadows)
- **STATUS**: `JUSTIFIED` - Toast has unique shadow requirements (floating notification)

### 3. Layout-Specific Constants

These values control the display layout in Figma, not component rendering:

#### MenuBar (menubar.ts)

- **height: 32**: Container height
- **STATUS**: `JUSTIFIED` - Layout display dimension

#### LayerCard (layer-card.ts)

- **width: 280**: Root width
- **gap: 8**: Section gaps
- **STATUS**: `JUSTIFIED` - Layout display dimensions

#### DateRangePicker (date-range-picker.ts)

- **SIZE_CONFIG dimensions**: padding, gap per size
- **STATUS**: `JUSTIFIED` - Size-specific dimensions (sm: 12/8, base: 16/10, lg: 20/12)

### 4. Icon Sizes

Icon sizes specific to component context:

#### Icon Utils (icon-utils.ts)

- **ICON_SIZE_MAP**: Centralized icon size mapping
- **fallback: 20**: Default icon size
- **STATUS**: `JUSTIFIED` - Centralized in icon-utils.ts

## Summary Statistics

### Phase 5 Improvements

- **T1 (Section Constants)**: ✅ COMPLETE - SECTION_PADDING and SECTION_GAP centralized
- **T2 (Shadow Scale)**: ✅ COMPLETE - SHADOWS constant added to shared.ts
- **T3 (Layout Grid)**: ✅ COMPLETE - GRID_LAYOUT constant with comprehensive presets
- **T4 (Dialog Sizes)**: ✅ COMPLETE - Dialog SIZE_CONFIG derived from registry
- **T5 (Compact Sizes)**: ✅ COMPLETE - Button compact sizes derived from registry
- **T6 (Fallback Values)**: ✅ COMPLETE - FALLBACK_VALUES constant with comprehensive defaults
- **T7 (Validation Tests)**: ✅ COMPLETE - Registry sync validation tests added
- **T8 (Enforcement Tests)**: ✅ COMPLETE - Drift detection tests prevent regressions

### Remaining Hardcoded Values: ~40 instances

**Categories:**

1. **Component-specific dimensions** (15 instances) - Justified, not size/variant dependent
2. **Shadow effects** (8 instances) - 5 centralized, 3 Toast-specific (justified)
3. **Layout display dimensions** (10 instances) - Justified, Figma-specific layout
4. **Disabled state opacity** (7 instances: 0.5) - Could be centralized in future
5. **Icon sizes** (1 fallback) - Centralized in icon-utils.ts

### Recommendations for Future Work

#### Priority: LOW - Centralize Disabled Opacity

Currently, 7 generators use `opacity: 0.5` for disabled states:

- combobox.ts
- input-area.ts
- input.ts
- sensitive-input.ts
- select.ts
- collapsible.ts

**Recommendation**: Add to shared.ts as `DISABLED_OPACITY = 0.5`

**Benefit**: Single source of truth for disabled state styling

**Estimated Effort**: 15 minutes

#### Priority: NONE - Component-Specific Dimensions

Remaining hardcoded dimensions (Empty width, Breadcrumbs separator size, Dialog close icon size, etc.) are intentionally component-specific and should NOT be centralized. These values don't vary by size/variant and are part of each component's fixed design.

## Enforcement

The drift-detection.test.ts includes enforcement tests that prevent:

1. Redeclaring SECTION_PADDING or SECTION_GAP in generators
2. Using SECTION_PADDING/SECTION_GAP without importing from shared.ts
3. Hardcoding shadow effects without SHADOWS constant (warning)

These tests run automatically with `pnpm validate:figma`.

## Conclusion

After Phase 5, magic numbers have been systematically eliminated. All remaining hardcoded values are:

- **Component-specific** (not variant-dependent)
- **Layout-specific** (Figma display, not component rendering)
- **Already centralized** (in shared.ts or icon-utils.ts)
- **Justified** (documented above)

The only minor improvement would be centralizing disabled opacity (0.5), but this is low priority since the value is consistent and well-understood across all form components.
