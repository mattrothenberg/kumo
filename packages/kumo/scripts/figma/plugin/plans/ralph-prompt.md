# Ralph Prompt - Figma Generator Coverage Completion

You are completing Figma generator coverage for components that are currently excluded from drift detection. This is Phase 4 of the Figma plugin robustness project.

## Context

Phases 1-3 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (all generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)

**Current gap:** 3 components need generators (temporarily excluded):

- Empty (display component for empty states)
- Breadcrumbs (block component with navigation path)
- PageHeader (block component with title, description, actions)

**Permanently excluded (no generator needed):**

- Field - Form wrapper utility with no standalone visual representation
- Icon - Utility component (handled by icon-library.ts)

**Name mappings (generator exists, name differs):**

- DropdownMenu → dropdown.ts
- Toasty → toast.ts

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @badge.ts - Example of well-structured generator
- @drift-detection.test.ts - Where EXCLUDED_COMPONENTS is defined

## Your Task

Create generators for the 3 temporarily excluded components.

## Requirements

### 1. Analyze Component in Registry

First, check the component structure in registry:

```typescript
import registry from "../../../../ai/component-registry.json";

// Check component structure
const componentData = registry.components.ComponentName;
console.log(componentData.props);
console.log(componentData.colors);
console.log(componentData.subComponents);
```

### 2. Generator Pattern

```typescript
import registry from "../../../../ai/component-registry.json";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { createTextNode, bindFillToVariable, ... } from "./shared";

const componentData = registry.components.ComponentName;

// Testable exports (pure functions)
export function getComponentConfig() { ... }
export function getComponentParsedStyles() { ... }
export function getAllComponentData() { ... }

// Generator function
export async function generateComponentComponents(startY: number): Promise<number> {
  // Create Figma components
  // Return nextY for next section
}
```

### 3. Test Pattern

```typescript
import { getComponentConfig, getAllComponentData } from "./component";
import registry from "../../../../ai/component-registry.json";

describe("Component Generator - Registry Validation", () => {
  it("should exist in registry", () => { ... });
});

describe("Component Generator - Configuration", () => {
  it("should have config defined", () => { ... });
});

describe("Component Generator - Snapshots", () => {
  it("should produce consistent data", () => {
    expect(getAllComponentData()).toMatchSnapshot();
  });
});
```

### 4. Register in code.ts

Add import and register in GENERATORS array:

```typescript
import { generateComponentComponents } from "./generators/component";

// In GENERATORS array:
{
  name: "Component",
  execute: async (page, y) => {
    const result = await generateComponentComponents(y);
    return { nextY: result };
  },
},
```

### 5. Update Drift Detection

Remove from EXCLUDED_COMPONENTS after generator is complete:

```typescript
// In drift-detection.test.ts, remove the component from the "Phase 4 targets" section
const EXCLUDED_COMPONENTS = new Set([
  // Permanently excluded...
  "Field",
  "Icon",

  // Components not yet implemented (remove as you complete them)
  "Breadcrumbs",
  "Empty",
  "PageHeader",
]);
```

## Validation Checklist

Before marking a task complete:

- [ ] Generator imports from component-registry.json
- [ ] Generator has testable exports (get*Config, get*Data functions)
- [ ] Test file exists with structural + snapshot tests
- [ ] Generator registered in code.ts GENERATORS array
- [ ] Removed from EXCLUDED_COMPONENTS in drift-detection.test.ts
- [ ] All tests pass: `pnpm --filter @cloudflare/kumo test generators/ --run`
- [ ] Drift detection passes: `pnpm --filter @cloudflare/kumo validate:figma`

## Run Tests

```bash
# Run specific generator test
pnpm --filter @cloudflare/kumo test generators/[name].test.ts --run

# Run all generator tests
pnpm --filter @cloudflare/kumo test generators/ --run

# Run drift detection
pnpm --filter @cloudflare/kumo validate:figma
```

## Your Task (Single Component Per Iteration)

1. Find the NEXT incomplete task from PRD.json (first task with status: "pending")
2. Analyze the component in registry
3. Create generator following the established pattern
4. Create test file with structural + snapshot tests
5. Register in code.ts
6. Remove from EXCLUDED_COMPONENTS in drift-detection.test.ts
7. Run tests to verify all pass
8. Update PRD.json task status to "complete"
9. Append progress to progress.txt with:
   - Component name
   - What was created
   - Test results
10. **CRITICAL GIT INSTRUCTIONS:**
    - DO NOT create new branches or switch branches
    - Stay on the current branch
    - Make a git commit with clear message
    - DO NOT push to remote

ONLY WORK ON A SINGLE COMPONENT PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Component-Specific Notes

### Empty (T1 - First Priority)

- Display component for empty states (no data, no results, etc.)
- Should show: icon (centered), title text, description text
- Layout: vertical stack, centered
- Check registry for props like `icon`, `title`, `description`

### Breadcrumbs (T2)

- Navigation path component with multiple items
- Items separated by icons (typically ph-caret-right)
- Last item is current page (different styling)
- Check registry for separator icon and item structure

### PageHeader (T3)

- Page title block with optional breadcrumbs, description, actions
- May include Breadcrumbs component reference
- Action buttons area on the right
- Check registry for subComponents
