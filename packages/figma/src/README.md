# Kumo UI Kit Generator - Figma Plugin

Generates production-quality Figma components from Kumo component definitions.

## Quick Start

### Building the Plugin

```bash
# From packages/kumo/scripts/figma/plugin/
./build.sh

# Or manually:
npx esbuild code.ts --bundle --outfile=code.js --format=iife --target=es2020
```

### Running in Figma

1. Open Figma Desktop
2. Go to **Plugins > Development > Import plugin from manifest...**
3. Select `packages/kumo/scripts/figma/plugin/manifest.json`
4. Open the target file: https://www.figma.com/design/sKKZc6pC6W1TtzWBLxDGSU/kumo-ai
5. Run the plugin from **Plugins > Development > Kumo UI Kit Generator**

### Prerequisites

- Figma Desktop app (plugin development requires desktop)
- Target file must have `kumo-colors` variable collection (from token sync)
- Node.js for building

## Structure

```
plugin/
├── manifest.json          # Figma plugin manifest
├── code.ts                # Main plugin entry point
├── code.js                # Compiled output (generated)
├── ui.html                # Plugin UI
├── build.sh               # Build script
├── tsconfig.json          # TypeScript config
├── figma-types.d.ts       # Figma API type declarations
├── parsers/
│   ├── opacity-extractor.ts      # Extract opacity modifiers from source
│   ├── tailwind-to-figma.ts      # Parse Tailwind classes to Figma values
│   └── component-registry.ts     # Parse component-registry.json
└── generators/
    ├── shared.ts                 # Shared utilities for all generators
    ├── badge.ts                  # Badge component generator
    ├── button-text.ts            # Button text component generator
    ├── button-icon.ts            # Button icon component generator (Phase 4)
    └── placeholders.ts           # Placeholder icon/loader generators
```

## Key Modules

### Parsers

#### `tailwind-to-figma.ts`

Parses Tailwind CSS classes from component variant definitions and converts them to Figma-compatible values.

**Key exports:**

- `ParsedStyles` - Type for parsed style information
- `parseTailwindClasses(classes)` - Parse Tailwind classes to Figma values
- `parseBaseStyles(baseStylesString)` - Parse base style strings

#### `opacity-extractor.ts`

Extracts Tailwind opacity patterns like `bg-primary/70` and generates Figma variable definitions.

**Key exports:**

- `OpacityModifier` - Type for opacity modifier (token, opacity, variableName)
- `extractOpacityModifiers(sourceCode)` - Extract from single source string
- `extractOpacityModifiersFromSources(sources)` - Extract from multiple source strings
- `BUNDLED_OPACITY_MODIFIERS` - Pre-extracted modifiers from Kumo components

#### `component-registry.ts`

Parses `component-registry.json` to extract component specifications.

**Key exports:**

- `ComponentSpec` - Type for component specification
- `parseComponentRegistry(json)` - Parse registry JSON
- `getComponentSpec(registry, name)` - Get spec by component name

### Generators

#### `shared.ts`

Shared utilities for creating Figma nodes with proper styling and variable bindings.

**Key exports:**

- `SPACING`, `BORDER_RADIUS`, `FONT_SIZE` - Size constants from SPEC.md
- `createAutoLayoutFrame(config)` - Create frame with auto-layout
- `bindFillToVariable(node, variableId)` - Bind fill to variable
- `bindStrokeToVariable(node, variableId)` - Bind stroke to variable
- `createTextNode(text, fontSize)` - Create styled text node
- `getVariableByName(name)` - Get variable from kumo-colors collection
- `getOrCreateSection(page, name)` - Get or create section on page
- `setWhiteTextColor(textNode)` - Set hardcoded white text
- `bindTextColorToVariable(textNode, variableId)` - Bind text color to variable

#### `badge.ts`

Generates Badge ComponentSet with 5 variants (primary, secondary, destructive, outline, beta).

#### `button-text.ts`

Generates Button ComponentSet with 6 variants × 4 sizes = 24 component variants.

**Supported:**

- Variants: primary, secondary, ghost, destructive, secondary-destructive, outline
- Sizes: xs, sm, base, lg
- Variable bindings for fills, strokes, text colors
- Auto-layout configuration

**Planned (Phase 5):**

- State variants (Default, Hover, Active, Disabled, Loading)
- Icon support (left/right positions)
- Loading state with Loader component

#### `button-icon.ts`

Generates icon-only button ComponentSets (Phase 4 - implemented but not integrated).

**Features:**

- Square and circle shapes
- All 6 variants × 4 sizes × 5 states × 2 shapes = 240 components
- Placeholder icon integration

#### `placeholders.ts`

Generates utility components for icon buttons.

**Components:**

- Placeholder Icon 12 (12×12)
- Placeholder Icon 16 (16×16)
- Placeholder Icon 20 (20×20)
- Loader (16×16 spinner)

## Target Figma File

- **File:** `sKKZc6pC6W1TtzWBLxDGSU` (kumo-ai)
- **URL:** https://www.figma.com/design/sKKZc6pC6W1TtzWBLxDGSU/kumo-ai

## Sync Strategy

**Destructive sync** - purges all existing generated components and recreates them fresh on each run.

1. Delete all components in Components page
2. Regenerate Badge ComponentSet
3. Regenerate Button ComponentSet

## Technical Constraints

### ES2020 Target

The plugin uses ES2020 as the compilation target (`tsconfig.json`) due to Figma's plugin runtime requirements. This means:

- **Modern syntax supported:** Optional chaining (`?.`), nullish coalescing (`??`), and other ES2020 features work
- **const/let preferred:** ES2020 fully supports `const` and `let` - use them instead of `var`
- **Existing var usage:** The codebase currently uses `var` in many places due to historical reasons, not technical constraints
- **Migration:** Prefer `const`/`let` in new code; existing `var` can be migrated incrementally

### Variable Declaration Best Practices

```typescript
// ✅ Preferred (ES2020 fully supports these)
const variable = figma.getVariableById(id);
let mutableValue = 0;

// ❌ Avoid in new code
var variable = figma.getVariableById(id);
```

### Relationship to Token Sync

This plugin and the token sync script serve different purposes:

1. **Token Sync Script** (`sync-tokens-to-figma.ts`):
   - Syncs color tokens from `kumo-binding.css` to Figma variables
   - Creates/updates the `kumo-colors` variable collection
   - **Run this FIRST** before running the plugin

2. **This Plugin** (`code.ts`):
   - Generates Figma component instances from `component-registry.json`
   - Binds components to variables from the `kumo-colors` collection
   - **Run this SECOND** after token sync completes

**Workflow:**

```bash
# 1. Sync tokens first
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts

# 2. Build and run plugin
cd packages/kumo/scripts/figma/plugin
./build.sh
# Then run in Figma: Plugins > Development > Kumo UI Kit Generator
```

## Troubleshooting

### "kumo-colors collection not found"

The target Figma file must have the `kumo-colors` variable collection. Run the token sync script first:

```bash
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

### "Variable not found: color-primary"

Variable names must match the kumo-colors collection. Check that tokens were synced correctly.

### "Font not found"

The plugin uses Inter font. Ensure Inter is available in Figma (it's a default Figma font).

## Implementation Status

- ✅ **Phase 1:** Plugin infrastructure and parsers
- ✅ **Phase 2:** Badge component generator (5 variants)
- ✅ **Phase 3:** Button text component generator (24 variants)
- 🔄 **Phase 4:** Button icon component generator (implemented, not integrated)
- ⏳ **Phase 5:** Polish - state variants, icons, documentation

See [SPEC.md](../../../../SPEC.md) for full specification.

## Drift Prevention System

The plugin includes automated drift detection to ensure Figma generators stay in sync with component definitions.

### How It Works

1. **Automatic Detection**: `drift-detection.test.ts` compares:
   - Components in `component-registry.json` (auto-generated from source)
   - Generator files in `generators/` directory
   - Registration in `code.ts` GENERATORS array

2. **CI Enforcement**: GitLab CI runs `validate:figma` on every MR that changes:
   - `component-registry.json`
   - Any files in `generators/`
   - `code.ts`

3. **Failure = Blocked PR**: If drift is detected, CI fails with clear instructions on what to fix.

### Adding a New Component

When you add a new component to Kumo, follow these steps to add Figma support:

#### 1. Component Implementation
```bash
# Your component code in packages/kumo/src/components/
# component-registry.json updates automatically via build:ai-metadata
```

#### 2. Create Figma Generator

Create `generators/yourcomponent.ts`:
```typescript
import {
  createTextNode,
  bindFillToVariable,
  getVariableByName,
  createModeSection,
  SECTION_PADDING,
  SECTION_GAP,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import registry from "../../../../ai/component-registry.json";

const componentSpec = registry.components.YourComponent;

// CRITICAL: Export testable functions
export function getYourComponentConfig() {
  return componentSpec.props;
}

export async function generateYourComponentComponents(
  page: PageNode,
  startY: number
): Promise<number> {
  // Implementation here
  return startY + 500 + SECTION_GAP;
}
```

#### 3. Register in code.ts

Add to the `GENERATORS` array in `code.ts`:
```typescript
import { generateYourComponentComponents } from "./generators/yourcomponent";

const GENERATORS = [
  // ... existing generators
  {
    name: "YourComponent",
    execute: async (page, y) => {
      const result = await generateYourComponentComponents(page, y);
      return { nextY: result };
    },
  },
];
```

#### 4. Run Tests Locally
```bash
cd packages/kumo
pnpm validate:figma  # Runs drift detection test
```

#### 5. Test the Plugin
```bash
cd packages/kumo/scripts/figma/plugin
./build.sh
# Open Figma Desktop and run the plugin
```

### What If I Don't Want to Add a Generator?

Some components (like utility components or layout-only components) don't need Figma representation. To exclude a component:

1. Open `generators/drift-detection.test.ts`
2. Add the component name to `EXCLUDED_COMPONENTS`:
   ```typescript
   const EXCLUDED_COMPONENTS = new Set([
     "Container",  // Example: layout-only component
     "YourComponent",  // Your excluded component
   ]);
   ```

### Common Issues

**Q: CI fails with "Missing Figma generators"**
A: Follow the instructions in the error message. Either create a generator or add to `EXCLUDED_COMPONENTS`.

**Q: I created a generator but CI still fails**
A: Make sure you registered it in `code.ts` GENERATORS array. The test checks both file existence and registration.

**Q: My generator has a different name than the component**
A: Add a mapping in `drift-detection.test.ts`:
   ```typescript
   const COMPONENT_NAME_MAPPING: Record<string, string> = {
     "Switch.Group": "switch",  // Both in same file
     "YourComponent": "special-name",  // Custom mapping
   };
   ```

**Q: How do I test my generator logic?**
A: Export pure functions (like `getYourComponentConfig()`) and write tests in `generators/yourcomponent.test.ts`. See `badge.test.ts` for examples.
