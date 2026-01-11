# Ralph Prompt - Phase 7: Full Registry Integration

You are completing the full registry integration for Figma generators. This is Phase 7 of the Figma plugin robustness project.

## Context

Phases 1-6 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)
- Phase 4: Generator coverage (Breadcrumbs, Empty, PageHeader added)
- Phase 5: Initial magic number elimination (SHADOWS, GRID_LAYOUT, FALLBACK_VALUES)
- Phase 6: Magic numbers audit (SECTION_LAYOUT, OPACITY, COLORS, enforcement tests)

**Phase 7 uses a TEST-FIRST approach:**

1. **T1:** Create enforcement test that checks 5 generators for registry.styling usage
2. **T2-T11:** Add metadata and update generators (test will progressively pass)
3. **T13:** Final verification - all tests pass

### Generators Requiring Migration

| Generator            | Component       | Hardcoded Object  | Test Status         |
| -------------------- | --------------- | ----------------- | ------------------- |
| date-range-picker.ts | DateRangePicker | SIZE_CONFIG       | Will fail initially |
| pagination.ts        | Pagination      | Layout constants  | Will fail initially |
| input-area.ts        | InputArea       | SIZE_CONFIG       | Will fail initially |
| layer-card.ts        | LayerCard       | LAYER_CARD_CONFIG | Will fail initially |
| menubar.ts           | MenuBar         | MENUBAR_CONFIG    | Will fail initially |

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @PHASE7_REGISTRY_INTEGRATION.md - Detailed plan
- @scripts/ai/component-registry.ts - Where COMPONENT_STYLING_METADATA lives (~line 2091)

## Task 1: Create Enforcement Test (MUST DO FIRST)

Add this test to `drift-detection.test.ts`:

```typescript
/**
 * Phase 7: Registry Styling Integration Tests
 *
 * These tests enforce that generators with hardcoded CONFIG objects
 * read their styling data from registry.components.X.styling instead.
 */
describe("Figma Plugin - Registry Styling Integration", () => {
  // Generators that MUST read from registry.styling
  const GENERATORS_REQUIRING_STYLING = [
    { file: "date-range-picker.ts", component: "DateRangePicker" },
    { file: "pagination.ts", component: "Pagination" },
    { file: "input-area.ts", component: "InputArea" },
    { file: "layer-card.ts", component: "LayerCard" },
    { file: "menubar.ts", component: "MenuBar" },
  ];

  it("should read styling from registry for components with hardcoded configs", () => {
    const violations: string[] = [];

    for (const { file, component } of GENERATORS_REQUIRING_STYLING) {
      const filePath = join(__dirname, file);
      if (!existsSync(filePath)) continue;

      const content = readFileSync(filePath, "utf-8");

      // Check if generator reads from registry.styling
      // Pattern: registry.components.ComponentName... .styling
      // or: (registry.components.ComponentName as any).styling
      const readsFromStyling = new RegExp(
        `registry\\.components\\.${component}[^;]*\\.styling`,
        "s"
      ).test(content);

      if (!readsFromStyling) {
        violations.push(
          `${file}: Does not read from registry.components.${component}.styling`
        );
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `❌ Registry styling integration violations (${violations.length}/${GENERATORS_REQUIRING_STYLING.length}):\n` +
          `  - ${violations.join("\n  - ")}\n\n` +
          `🔧 To fix each generator:\n` +
          `  1. Add COMPONENT_STYLING_METADATA entry in scripts/ai/component-registry.ts\n` +
          `  2. Run: pnpm --filter @cloudflare/kumo codegen:registry\n` +
          `  3. Update generator to read: (registry.components.X as any).styling\n` +
          `  4. Use styling data instead of hardcoded CONFIG objects\n`
      );
    }

    expect(violations).toEqual([]);
  });
});
```

## Pattern: Add Styling Metadata

In `scripts/ai/component-registry.ts`, find `COMPONENT_STYLING_METADATA` (~line 2091) and add entries:

```typescript
const COMPONENT_STYLING_METADATA: Record<string, ComponentSchema["styling"]> = {
  // ... existing entries (Checkbox, ClipboardText, Code, Input, Tabs, Dialog, Toasty)

  // ADD after Toasty:
  DateRangePicker: {
    sizeVariants: {
      sm: {
        height: 0,
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
  Pagination: {
    layout: {
      height: 36,
      buttonSize: 36,
      inputWidth: 50,
      iconSize: 16,
      gap: 8,
      borderRadius: 8,
    },
  } as any,
  InputArea: {
    sizeVariants: {
      xs: { minHeight: 60, width: 160 },
      sm: { minHeight: 70, width: 200 },
      base: { minHeight: 80, width: 280 },
      lg: { minHeight: 100, width: 320 },
    },
  } as any,
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
    },
    primary: {
      paddingX: 16,
      paddingY: 16,
      fontSize: 14,
      fontWeight: 400,
    },
  } as any,
  MenuBar: {
    container: {
      height: 32,
      borderRadius: 8,
      padding: 2,
      gap: 2,
    },
    button: {
      width: 36,
      borderRadius: 6,
      iconSize: 18,
    },
  } as any,
};
```

**IMPORTANT:** Bump `CACHE_VERSION` at ~line 54 when you first add metadata (T2).

## Pattern: Update Generator to Read from Registry

```typescript
// At top of generator, after registry import:
var componentStyling = (registry.components.ComponentName as any).styling;

// Define fallback with current hardcoded values
const FALLBACK_CONFIG = {
  // ... current hardcoded values
};

// Create function to get config from registry
function getConfigFromRegistry() {
  if (!componentStyling) return FALLBACK_CONFIG;
  // Return appropriate structure from styling
  return componentStyling.layout || componentStyling.sizeVariants || FALLBACK_CONFIG;
}

// Replace hardcoded CONFIG
var CONFIG = getConfigFromRegistry();
```

## Validation Commands

```bash
# Run enforcement test (will fail initially after T1, then progressively pass)
pnpm --filter @cloudflare/kumo test generators/drift-detection.test.ts --run

# Regenerate registry after adding metadata
pnpm --filter @cloudflare/kumo codegen:registry

# Verify styling section exists
cat packages/kumo/ai/component-registry.json | jq '.components.DateRangePicker.styling'

# Run specific generator test
pnpm --filter @cloudflare/kumo test generators/date-range-picker.test.ts --run

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run
```

## Your Task (Single Task Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Implement the changes following the patterns above
3. Run tests to verify:
   - For T1: Test should FAIL (5 violations expected)
   - For T2-T11: Component tests pass, enforcement test shows fewer violations
   - For T13: ALL tests pass (0 violations)
4. Update PRD.json task status to "complete"
5. Append progress to progress.txt with:
   - Task ID and name
   - Files modified
   - Test results (violations count for enforcement test)
   - Any notes or issues encountered
6. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message like: "feat(figma): T1 - add registry styling enforcement test"
   - DO NOT push to remote

ONLY WORK ON A SINGLE TASK PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Important Notes

1. **T1 creates a FAILING test** - this is intentional and expected
2. **Bump CACHE_VERSION** when you first add metadata (T2 only)
3. **Run codegen:registry** after adding metadata
4. **Keep fallbacks** - generators should work even if registry doesn't have styling
5. **Don't change visual output** - values should match existing hardcoded values exactly
6. **Pre-existing TypeScript errors** in generators are known issues - ignore them

## Progress Tracking

After T1, track violations count:

- T1 complete: 5/5 violations (test fails as expected)
- T3 complete: 4/5 violations (DateRangePicker passes)
- T5 complete: 3/5 violations (Pagination passes)
- T7 complete: 2/5 violations (InputArea passes)
- T9 complete: 1/5 violations (LayerCard passes)
- T11 complete: 0/5 violations (MenuBar passes - ALL PASS!)

## Success Criteria

- T1: Enforcement test exists and fails with 5 violations
- T13: Enforcement test passes with 0 violations
- All 1500+ generator tests pass
- No snapshot changes
- Intentional divergences documented (T12)
