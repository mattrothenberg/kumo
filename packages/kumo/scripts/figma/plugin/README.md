# Kumo UI Kit Generator - Figma Plugin

Generates production-quality Figma components from Kumo component definitions.

## Structure

```
plugin/
├── manifest.json          # Figma plugin manifest
├── code.ts                # Main plugin entry point
├── ui.html                # Plugin UI
├── tsconfig.json          # TypeScript config
├── figma-types.d.ts       # Minimal Figma API types
├── parsers/
│   ├── opacity-extractor.ts      # Extract opacity modifiers from source
│   └── component-registry.ts     # Parse component-registry.json
└── generators/
    ├── shared.ts                 # Shared utilities for all generators
    ├── badge.ts                  # Badge component generator
    ├── button-text.ts            # Button text component generator
    ├── button-icon.ts            # Button icon component generator
    └── placeholders.ts           # Placeholder icon/loader generators
```

## Key Modules

### Parsers

#### `opacity-extractor.ts`
Scans component source files for Tailwind opacity patterns like `bg-primary/70` and generates Figma variable definitions like `opacity-primary-70`.

**Key exports:**
- `OpacityModifier` - Type for opacity modifier (token, opacity, variableName)
- `extractOpacityModifiers(sourceCode)` - Extract from single source string
- `extractOpacityModifiersFromFiles(paths)` - Extract from multiple files
- `generateOpacityVariableName(token, opacity)` - Generate variable name

#### `component-registry.ts`
Parses `component-registry.json` to extract component specifications (props, variants, defaults).

**Key exports:**
- `ComponentSpec` - Type for component specification
- `parseComponentRegistry(json)` - Parse registry JSON
- `getComponentSpec(registry, name)` - Get spec by component name
- `getVariantValues(spec, propName)` - Get enum variant values
- `getDefaultValue(spec, propName)` - Get default value for prop

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

## Target Figma File

- **File:** `sKKZc6pC6W1TtzWBLxDGSU` (kumo-ai)
- **URL:** https://www.figma.com/design/sKKZc6pC6W1TtzWBLxDGSU/kumo-ai

## Sync Strategy

**Destructive sync** - purges all existing generated components and recreates them fresh on each run.

1. Delete all components in target sections
2. Delete all `opacity-*` variables from `kumo-colors` collection
3. Regenerate opacity variables from source analysis
4. Regenerate all component ComponentSets

## Development

This plugin is development tooling only - not shipped with npm package.

### Type Checking

The plugin includes minimal Figma API type declarations in `figma-types.d.ts`. For full types, install:

```bash
npm install -D @figma/plugin-typings
```

## Implementation Status

- ✅ **Phase 1:** Plugin infrastructure and parsers
- ⏳ **Phase 2:** Badge component generator
- ⏳ **Phase 3:** Button (text) component generator
- ⏳ **Phase 4:** Button (icon) component generator
- ⏳ **Phase 5:** Polish and documentation

See [SPEC.md](../../../SPEC.md) for full specification.
