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
    ├── placeholders.ts           # Placeholder icon/loader generators
    └── kumo-variants.ts          # Variant definitions
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
