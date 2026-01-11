# Ralph Prompt - Figma Generator Registry Integration

You are migrating Figma generators from hardcoded configuration to dynamic reading from component-registry.json. This ensures generators stay in sync with React component changes automatically.

## Context

The tests are complete. Now we need to standardize all generators to use component-registry.json as the single source of truth.

**Reference files:**

- @SPEC.md - Architecture specification and observations
- @PRD.json - Product requirements document (registry integration task)
- @badge.ts - Example of fully integrated generator
- @button.ts - Complex example with multi-variant registry integration
- @checkbox.ts - Example using props and styling sections

## Your Task

Migrate the **[GENERATOR_NAME]** generator from hardcoded configuration to reading from component-registry.json.

## Requirements

### 1. Analyze Current Implementation

First, examine:

- `[generator-name].ts` - The generator implementation (identify hardcoded config)
- `../../../../ai/component-registry.json` - Check what data is available
- `[generator-name].test.ts` - Understand existing test coverage

Look for these hardcoded patterns to replace:

```typescript
// ANTI-PATTERNS to remove:
const SIZE_CONFIG = { xs: { height: 20 }, ... };  // Hardcoded
const VARIANT_VALUES = ["default", "error"];       // Hardcoded
const STATE_STYLES = { default: {...}, ... };      // Hardcoded
const SIZES = ["xs", "sm", "base", "lg"];          // Hardcoded
```

### 2. Add Registry Import

```typescript
// Add at top of file
import registry from "../../../../ai/component-registry.json";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";

// Extract component data
const componentData = registry.components.ComponentName;
const componentProps = componentData.props;

// Extract variant prop (if exists)
const variantProp = componentProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

// Extract size prop (if exists)
const sizeProp = componentProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

// Extract styling section (if available)
const componentStyling = componentData.styling;
```

### 3. Replace Hardcoded Arrays

```typescript
// BEFORE (hardcoded):
const VARIANT_VALUES = ["default", "error"];
const SIZE_VALUES = ["xs", "sm", "base", "lg"];

// AFTER (from registry):
const VARIANT_VALUES = variantProp.values;
const SIZE_VALUES = sizeProp.values;
```

### 4. Replace Hardcoded Config Objects

```typescript
// BEFORE (hardcoded):
const SIZE_CONFIG = {
  xs: { height: 20, paddingX: 6, fontSize: 12, borderRadius: 2, width: 160 },
  sm: { height: 26, paddingX: 8, fontSize: 12, borderRadius: 6, width: 200 },
  // ...
};

// AFTER (from registry + parser):
function getSizeConfig(size: string) {
  const sizeClasses = sizeProp.classes[size];
  const parsed = parseTailwindClasses(sizeClasses);

  // Use parsed values with sensible fallbacks
  return {
    height: parsed.height ?? getDefaultHeight(size),
    paddingX: parsed.paddingX ?? getDefaultPaddingX(size),
    fontSize: parsed.fontSize ?? 16,
    borderRadius: parsed.borderRadius ?? 8,
    width: 280, // Layout-specific, may need to remain hardcoded
  };
}
```

### 5. Use Styling Section When Available

```typescript
// If component has styling section in registry
if (componentStyling) {
  // Use dimensions
  const dimensions = componentStyling.dimensions;

  // Use state tokens
  const baseTokens = componentStyling.baseTokens;
  const states = componentStyling.states;

  // Use size variants
  const sizeVariants = componentStyling.sizeVariants;
}
```

### 6. Update Testable Exports

Ensure testable exports reflect registry-based configuration:

```typescript
/**
 * Get variant configuration from registry
 */
export function get[Component]VariantConfig() {
  return {
    values: variantProp.values,
    classes: variantProp.classes,
    descriptions: variantProp.descriptions,
    default: variantProp.default,
  };
}

/**
 * Get size configuration from registry
 */
export function get[Component]SizeConfig() {
  return {
    values: sizeProp.values,
    classes: sizeProp.classes,
    descriptions: sizeProp.descriptions,
    default: sizeProp.default,
  };
}

/**
 * Get parsed size styles for a specific size
 */
export function get[Component]ParsedSizeStyles(size: string) {
  const classes = sizeProp.classes[size] || "";
  return {
    size,
    classes,
    description: sizeProp.descriptions[size] || "",
    parsed: parseTailwindClasses(classes),
  };
}
```

### 7. Handle Missing Registry Data

If registry doesn't have required data:

```typescript
// Option 1: Use fallback with warning
const variantClasses = variantProp?.classes?.[variant];
if (!variantClasses) {
  logWarn(`Missing variant classes for ${variant}, using fallback`);
  // Use sensible fallback
}

// Option 2: Document gap for follow-up
// TODO: Add KUMO_COMPONENT_STYLING export to component.tsx
// Currently using hardcoded values as fallback
```

## Example Migration

### Before (input.ts - hardcoded):

```typescript
const SIZE_CONFIG: Record<string, {...}> = {
  xs: { height: 20, paddingX: 6, fontSize: 12, borderRadius: 2, width: 160 },
  sm: { height: 26, paddingX: 8, fontSize: 12, borderRadius: 6, width: 200 },
  base: { height: 36, paddingX: 12, fontSize: 16, borderRadius: 8, width: 280 },
  lg: { height: 40, paddingX: 16, fontSize: 16, borderRadius: 8, width: 320 },
};
```

### After (input.ts - from registry):

```typescript
import registry from "../../../../ai/component-registry.json";

const inputComponent = registry.components.Input;
const inputProps = inputComponent.props;
const sizeProp = inputProps.size as { values: string[]; classes: Record<string, string>; ... };
const inputStyling = inputComponent.styling;

// Use styling.sizeVariants if available
function getSizeDimensions(size: string) {
  // Check for styling metadata first
  if (inputStyling?.sizeVariants?.[size]) {
    return inputStyling.sizeVariants[size];
  }

  // Fall back to parsing Tailwind classes
  const sizeClasses = sizeProp.classes[size] || "";
  const parsed = parseTailwindClasses(sizeClasses);

  return {
    height: parsed.height ?? 36,
    paddingX: parsed.paddingX ?? 12,
    fontSize: parsed.fontSize ?? 16,
    borderRadius: parsed.borderRadius ?? 8,
    width: 280, // Layout-specific
  };
}
```

## Validation Checklist

Before marking complete, verify:

- [ ] Generator imports component-registry.json
- [ ] Hardcoded arrays replaced with registry.props.\*.values
- [ ] Hardcoded config objects replaced with registry data or parsed classes
- [ ] Testable exports use registry data
- [ ] All existing tests still pass
- [ ] Snapshots unchanged (or intentionally updated)
- [ ] Missing registry data documented (if any)

## Run Tests

After migration:

```bash
# Run tests
pnpm --filter @cloudflare/kumo test [generator-name].test.ts --run

# If snapshots need updating (review changes first!)
pnpm --filter @cloudflare/kumo test [generator-name].test.ts -u

# Verify all pass
pnpm --filter @cloudflare/kumo test [generator-name].test.ts --run
```

## Your Task (Single Generator Per Iteration)

1. Find the NEXT incomplete generator from PRD.json (first generator with status: "hardcoded" or "partial")
2. Migrate ONLY that generator following this guide
3. Run feedback loops before committing:
   - Tests: `pnpm --filter @cloudflare/kumo test [generator].test.ts --run`
   - If tests fail, investigate and fix
   - If snapshots changed, review and update: `pnpm --filter @cloudflare/kumo test [generator].test.ts -u`
4. Do NOT commit if tests fail. Fix issues first.
5. Update PRD.json to mark the generator status as "complete"
6. Append your progress to progress.txt with:
   - Generator name
   - What was changed
   - Test results
   - Registry gaps found (if any)
7. **CRITICAL GIT INSTRUCTIONS:**
   - DO NOT create new branches or switch branches
   - Stay on the current branch
   - Make a git commit with clear message: "refactor([generator]): migrate to component-registry.json"
   - DO NOT push to remote (commits will be pushed in batch later)

ONLY WORK ON A SINGLE GENERATOR PER ITERATION.

If ALL generators in PRD.json are complete (status: "complete"), output <promise>COMPLETE</promise>.

## Common Issues

### Parser Doesn't Support Certain Classes

Some Tailwind classes may not be parsed. Document and use fallback:

```typescript
const parsed = parseTailwindClasses(classes);
// Parser doesn't support pl-* (left-only padding)
const paddingLeft = parsed.paddingX ?? 16; // Fallback
```

### Registry Missing Styling Section

If component doesn't have `styling` section:

```typescript
// Document gap
// TODO: Add KUMO_INPUT_STYLING export to input.tsx
// Using parsed Tailwind classes as fallback

const sizeClasses = sizeProp.classes[size];
const parsed = parseTailwindClasses(sizeClasses);
```

### Values Differ Between Hardcoded and Registry

If registry values differ from hardcoded:

1. Check if registry is correct (authoritative source)
2. If registry is correct, update generator to use registry
3. Review snapshot changes carefully
4. Update snapshots intentionally

## References

- badge.ts - Full registry integration example
- button.ts - Complex multi-variant example
- checkbox.ts - Uses props and styling sections
- component-registry.json - Source of truth
- parsers/tailwind-to-figma.ts - Parser implementation
