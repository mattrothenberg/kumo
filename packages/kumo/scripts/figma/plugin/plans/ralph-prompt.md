# Ralph Prompt - Figma Generator Coverage Completion

You are completing Figma generator coverage for components that are currently excluded from drift detection. This is Phase 4 of the Figma plugin robustness project.

## Context

Phases 1-3 are COMPLETE:

- Phase 1: Test refactoring (all 29 generators have rigorous tests)
- Phase 2: Registry integration (all generators read from component-registry.json)
- Phase 3: Parser enhancements (opacity, arbitrary values, state variants)

**Current gap:** 4 components are excluded from drift detection:

- Breadcrumbs (block component)
- Empty (display component)
- Field (utility wrapper)
- PageHeader (block component)

**Reference files:**

- @PRD.json - Task definitions and acceptance criteria
- @progress.txt - Progress log (append your work here)
- @badge.ts - Example of well-structured generator
- @drift-detection.test.ts - Where EXCLUDED_COMPONENTS is defined

## Your Task

Create generators for the excluded components OR document why they should remain excluded.

## Requirements

### 1. Analyze Component in Registry

First, check if the component exists in registry and understand its structure:

```typescript
import registry from "../../../../ai/component-registry.json";

// Check component structure
const componentData = registry.components.ComponentName;
console.log(componentData.props);
console.log(componentData.colors);
console.log(componentData.subComponents);
```

### 2. Decide: Create Generator or Keep Excluded

Some components may be intentionally excluded:

- **Icon** - Utility component, icon library handles this
- **Toasty** - Alias for Toast
- **DropdownMenu** - Alias for Dropdown
- **Field** - May be a wrapper-only component with no visual representation

If creating a generator, follow the established pattern.

### 3. Generator Pattern

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

### 4. Test Pattern

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

### 5. Register in code.ts

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

### 6. Update Drift Detection

Remove from EXCLUDED_COMPONENTS after generator is complete:

```typescript
// Before
const EXCLUDED_COMPONENTS = new Set([
  "Breadcrumbs",
  "Empty",
  "Field",
  ...
]);

// After (if Field generator created)
const EXCLUDED_COMPONENTS = new Set([
  "Breadcrumbs",
  "Empty",
  ...
]);
```

## Validation Checklist

Before marking a task complete:

- [ ] Generator imports from component-registry.json
- [ ] Generator has testable exports
- [ ] Test file exists with structural + snapshot tests
- [ ] Generator registered in code.ts
- [ ] Removed from EXCLUDED_COMPONENTS (if applicable)
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
3. Create generator OR document why it should remain excluded
4. Create test file if generator created
5. Register in code.ts if generator created
6. Update EXCLUDED_COMPONENTS in drift-detection.test.ts
7. Run tests to verify
8. Update PRD.json task status to "complete"
9. Append progress to progress.txt with:
   - Component name
   - Decision (created generator or kept excluded)
   - What was changed
   - Test results
10. **CRITICAL GIT INSTRUCTIONS:**
    - DO NOT create new branches or switch branches
    - Stay on the current branch
    - Make a git commit with clear message
    - DO NOT push to remote

ONLY WORK ON A SINGLE COMPONENT PER ITERATION.

If ALL tasks in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Notes on Specific Components

### Field

Field is a form wrapper component that provides label, description, and error message layout around form controls. Check if it has visual representation or is just a wrapper.

### Empty

Empty is a display component for empty states (no data, no results, etc.). Should show icon, title, and description.

### Breadcrumbs

Breadcrumbs shows navigation path with separator icons. Uses Icon components.

### PageHeader

PageHeader is a block component for page titles with optional breadcrumbs, description, and action buttons.
