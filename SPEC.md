# Figma Plugin Generator Specification for Kumo

## Executive Summary

This specification defines the Figma Plugin Generator system for Kumo. The plugin generates Figma component library pages directly from React component source code, using `component-registry.json` as the source of truth.

### Key Design Decisions

- **Source of truth**: `component-registry.json` drives all generation
- **Dual mode sections**: Every component page has Light and Dark mode sections
- **Variable bindings**: Colors bound to Figma variables (not hardcoded hex)
- **ComponentSet pattern**: Variants combined via `combineAsVariants()` for Figma's variant system
- **Row/column organization**: Labels and headers for visual clarity in Figma

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FIGMA PLUGIN SYSTEM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  component-registry.json ──┬──> parsers/tailwind-to-figma.ts       │
│                            │                                        │
│                            └──> generators/*.ts ──> Figma API       │
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐ │
│  │   Registry  │───>│   Parser    │───>│      Generator          │ │
│  │   (JSON)    │    │ (Tailwind)  │    │ (Figma Nodes)           │ │
│  └─────────────┘    └─────────────┘    └─────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Registry** (`component-registry.json`) contains:
   - Props with types, defaults, descriptions
   - Variant values and their Tailwind classes
   - Examples from Storybook stories
   - Semantic colors used by each component

2. **Parser** (`tailwind-to-figma.ts`) converts:
   - Tailwind classes → Figma properties (size, padding, colors)
   - Semantic tokens → Figma variable references

3. **Generators** (`generators/*.ts`) create:
   - Figma ComponentSets with all variant combinations
   - Light and Dark mode sections
   - Row labels and column headers

---

## File Structure

```
packages/kumo/scripts/figma/plugin/
├── code.ts                      # Main plugin entry, orchestrates generation
├── manifest.json                # Figma plugin manifest
├── parsers/
│   └── tailwind-to-figma.ts     # Tailwind → Figma property conversion
├── generators/
│   ├── shared.ts                # Shared utilities (labels, sections, bindings)
│   ├── icon-utils.ts            # Icon creation and color binding
│   ├── badge.ts                 # Badge component generator
│   ├── banner.ts                # Banner component generator
│   ├── button.ts                # Button component generator
│   ├── checkbox.ts              # Checkbox component generator
│   ├── clipboard-text.ts        # ClipboardText component generator
│   ├── code.ts                  # Code component generator
│   ├── code-block.ts            # CodeBlock component generator
│   ├── link-button.ts           # LinkButton component generator
│   ├── refresh-button.ts        # RefreshButton component generator
│   └── text.ts                  # Text component generator
└── tsconfig.json                # Plugin-specific TypeScript config
```

---

## Component Registry Requirements

### Required Fields for Generation

Each component in `component-registry.json` must have:

```typescript
interface ComponentRegistryEntry {
  // Required
  description: string;
  props: {
    [propName: string]: {
      type: "enum" | "boolean" | "string" | "ReactNode";
      values?: string[]; // For enum types
      default?: string | boolean;
      required?: boolean;
      description?: string;
      descriptions?: Record<string, string>; // Per-value descriptions
    };
  };

  // Required for styling
  variants: {
    [variantName: string]: {
      [value: string]: string; // Tailwind classes
    };
  };

  // Optional but recommended
  examples: Array<{
    name: string;
    code: string;
  }>;

  semanticColors: string[]; // Kumo tokens used (e.g., "bg-surface")
}
```

### Example: Button Registry Entry

```json
{
  "Button": {
    "description": "Primary action button component",
    "props": {
      "variant": {
        "type": "enum",
        "values": ["primary", "secondary", "ghost", "destructive"],
        "default": "secondary",
        "descriptions": {
          "primary": "Primary action, high emphasis",
          "secondary": "Secondary action with border",
          "ghost": "Minimal styling, text only",
          "destructive": "Dangerous/delete actions"
        }
      },
      "size": {
        "type": "enum",
        "values": ["xs", "sm", "base", "lg"],
        "default": "base"
      }
    },
    "variants": {
      "variant": {
        "primary": "bg-primary text-white",
        "secondary": "bg-secondary text-surface ring ring-border",
        "ghost": "bg-transparent text-surface",
        "destructive": "bg-error text-white"
      },
      "size": {
        "xs": "h-6 px-2 text-xs",
        "sm": "h-7 px-2.5 text-sm",
        "base": "h-9 px-3 text-base",
        "lg": "h-11 px-4 text-lg"
      }
    },
    "semanticColors": [
      "bg-primary",
      "bg-secondary",
      "bg-error",
      "text-surface",
      "ring-border"
    ]
  }
}
```

---

## Generator Pattern

### Standard Generator Template

Every generator follows this pattern:

```typescript
// generators/component-name.ts

import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import {
  createModeSection,
  createRowLabel,
  createColumnHeaders,
  bindFillToVariable,
  bindTextColorToVariable,
} from "./shared";
import componentRegistry from "../../../../ai/component-registry.json";

// 1. Extract registry data
const registry = componentRegistry.components.ComponentName;
const variants = registry.variants;

// 2. Define base styles (from registry or hardcoded)
const BASE_STYLES = {
  // Common properties across all variants
};

// 3. Define variant mappings
const VARIANT_STYLES: Record<string, Record<string, object>> = {
  variantName: {
    value1: {
      /* Figma properties */
    },
    value2: {
      /* Figma properties */
    },
  },
};

// 4. Create individual component
function createComponent(
  variant: string,
  size: string,
  // ... other variant props
): ComponentNode {
  const component = figma.createComponent();
  component.name = `variant=${variant}, size=${size}`;

  // Apply base styles
  // Apply variant-specific styles
  // Bind colors to variables

  return component;
}

// 5. Export page generator
export async function generateComponentNamePage(
  startY: number = 0,
): Promise<number> {
  // Create page
  let page = figma.root.children.find((p) => p.name === "ComponentName");
  if (!page) {
    page = figma.createPage();
    page.name = "ComponentName";
  }
  figma.currentPage = page;

  let nextY = startY;

  // Generate Light mode section
  nextY = await createModeSection({
    title: "ComponentName - Light Mode",
    mode: "light",
    startY: nextY,
    generateContent: (y) => generateVariants("light", y),
  });

  // Generate Dark mode section
  nextY = await createModeSection({
    title: "ComponentName - Dark Mode",
    mode: "dark",
    startY: nextY + 100,
    generateContent: (y) => generateVariants("dark", y),
  });

  return nextY;
}

// 6. Generate all variant combinations
function generateVariants(mode: "light" | "dark", startY: number): number {
  const variants = ["primary", "secondary", "ghost", "destructive"];
  const sizes = ["xs", "sm", "base", "lg"];

  // Create column headers
  createColumnHeaders(variants, startY);

  // Create components in grid
  const components: ComponentNode[] = [];

  sizes.forEach((size, rowIndex) => {
    // Create row label
    createRowLabel(size, startY + 60 + rowIndex * 60);

    variants.forEach((variant, colIndex) => {
      const comp = createComponent(variant, size);
      comp.x = 120 + colIndex * 150;
      comp.y = startY + 60 + rowIndex * 60;
      components.push(comp);
    });
  });

  // Combine into ComponentSet
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "ComponentName";

  return startY + 60 + sizes.length * 60 + 100;
}
```

---

## Syntax Constraints

**CRITICAL**: Figma's plugin sandbox uses an older JavaScript runtime. The following syntax is NOT supported:

### Forbidden Syntax

| Syntax                    | Example                | Use Instead                                               |
| ------------------------- | ---------------------- | --------------------------------------------------------- |
| Nullish coalescing (`??`) | `value ?? default`     | `value !== null && value !== undefined ? value : default` |
| Spread in objects (`...`) | `{ ...obj, key: val }` | `Object.assign({}, obj, { key: val })`                    |
| Spread in arrays (`...`)  | `[...arr, item]`       | `arr.concat([item])` or manual push                       |
| Optional chaining (`?.`)  | `obj?.prop`            | `obj && obj.prop`                                         |

### Safe Alternatives

```typescript
// BAD: Nullish coalescing
const size = props.size ?? "base";

// GOOD: Ternary with explicit null check
const size =
  props.size !== null && props.size !== undefined ? props.size : "base";

// BAD: Object spread
const merged = { ...defaults, ...overrides };

// GOOD: Object.assign
const merged = Object.assign({}, defaults, overrides);

// BAD: Array spread
const all = [...existing, newItem];

// GOOD: concat
const all = existing.concat([newItem]);

// BAD: Optional chaining
const name = component?.name;

// GOOD: Explicit check
const name = component && component.name;
```

### Why This Matters

The Figma plugin build (esbuild) targets an older runtime. Using modern syntax will cause runtime errors like:

```
SyntaxError: Unexpected token '?'
```

Always test the built plugin in Figma after changes.

---

## Shared Utilities

### `shared.ts` Exports

```typescript
// Create row label (left side)
export function createRowLabel(text: string, y: number, x?: number): TextNode;

// Create column headers (top)
export function createColumnHeaders(
  headers: string[],
  y: number,
  startX?: number,
  spacing?: number,
): TextNode[];

// Create mode section with title and variable bindings
export interface ModeSectionConfig {
  title: string;
  mode: "light" | "dark";
  startY: number;
  generateContent: (y: number) => number;
}
export async function createModeSection(
  config: ModeSectionConfig,
): Promise<number>;

// Bind fill to Figma variable
export function bindFillToVariable(
  node: SceneNode,
  variableName: string,
  mode: "light" | "dark",
): void;

// Bind stroke to Figma variable
export function bindStrokeToVariable(
  node: SceneNode,
  variableName: string,
  mode: "light" | "dark",
): void;

// Bind text color to Figma variable
export function bindTextColorToVariable(
  node: TextNode,
  variableName: string,
  mode: "light" | "dark",
): void;
```

### `icon-utils.ts` Exports

```typescript
// Create icon instance from Icon Library
export function createIconInstance(
  iconName: string,
  size?: number,
): InstanceNode | null;

// Bind icon color to variable
export function bindIconColor(
  icon: InstanceNode,
  variableName: string,
  mode: "light" | "dark",
): void;
```

---

## Component Complexity Tiers

### Tier 1: Simple (Text-only, single variant axis)

**Components**: Text, Badge

**Characteristics**:

- Single content type (text)
- 1-2 variant axes
- No interactive states
- No icons

**Generator complexity**: ~100-150 lines

### Tier 2: Basic (Multiple variant axes)

**Components**: Button, LinkButton, RefreshButton, Checkbox

**Characteristics**:

- Multiple variant axes (variant + size)
- May include icons
- Simple interactive states (hover, disabled)
- Single content area

**Generator complexity**: ~150-250 lines

### Tier 3: Composite (Multiple content areas)

**Components**: Banner, ClipboardText, Input, Select

**Characteristics**:

- Multiple content areas (icon + text + action)
- Complex layout (auto-layout with gaps)
- Multiple interactive states
- May have sub-components

**Generator complexity**: ~250-400 lines

### Tier 4: Complex (Compound components)

**Components**: Dialog, Dropdown, Table, Tabs

**Characteristics**:

- Multiple sub-components
- Complex state management
- Portal/overlay patterns
- Requires multiple pages or frames

**Generator complexity**: ~400+ lines

---

## Implementation Checklist

### Per-Component Checklist

- [ ] Registry entry complete with all variants
- [ ] Generator file created in `generators/`
- [ ] Light mode section generates correctly
- [ ] Dark mode section generates correctly
- [ ] Colors bound to Figma variables (not hardcoded)
- [ ] Row labels present
- [ ] Column headers present
- [ ] ComponentSet created via `combineAsVariants()`
- [ ] Variant naming follows pattern: `variant=value, size=value`
- [ ] Added to `code.ts` orchestrator

### Pre-Commit Checklist

- [ ] Plugin builds: `pnpm --filter @cloudflare/kumo build:figma-plugin`
- [ ] Plugin type checks: `pnpm --filter @cloudflare/kumo typecheck:figma-plugin`
- [ ] Root type check passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint`

---

## Component Status

### Completed

| Component     | Tier | Variants                   | Icons | Notes                      |
| ------------- | ---- | -------------------------- | ----- | -------------------------- |
| Badge         | 1    | look (8)                   | No    | Simple text badge          |
| Banner        | 3    | variant (4)                | Yes   | Icon + text + close button |
| Button        | 2    | variant (4) x size (4)     | Yes   | Primary action button      |
| Checkbox      | 2    | checked (3) x disabled (2) | Yes   | Check/indeterminate icons  |
| ClipboardText | 3    | variant (2)                | Yes   | Text + copy button         |
| Code          | 1    | lang (5)                   | No    | Monospace text, SF Mono    |
| CodeBlock     | 2    | lang (5)                   | No    | Code wrapper with border   |
| LinkButton    | 2    | variant (4) x size (4)     | Yes   | Arrow icon                 |
| RefreshButton | 2    | variant (4) x size (4)     | Yes   | Refresh icon               |
| Text          | 1    | variant (10)               | No    | Typography scale           |

### Pending

| Component | Tier | Priority | Blockers            |
| --------- | ---- | -------- | ------------------- |
| Input     | 3    | High     | None                |
| Select    | 3    | High     | Dropdown complexity |
| Dialog    | 4    | Medium   | Compound component  |
| Dropdown  | 4    | Medium   | Portal pattern      |
| Table     | 4    | Low      | Complex layout      |
| Tabs      | 4    | Low      | State management    |

---

## Tailwind Parser Reference

### Supported Conversions

| Tailwind Class   | Figma Property               |
| ---------------- | ---------------------------- |
| `h-{n}`          | `height: n * 4`              |
| `w-{n}`          | `width: n * 4`               |
| `px-{n}`         | `paddingLeft/Right: n * 4`   |
| `py-{n}`         | `paddingTop/Bottom: n * 4`   |
| `p-{n}`          | `padding: n * 4` (all sides) |
| `gap-{n}`        | `itemSpacing: n * 4`         |
| `rounded-{size}` | `cornerRadius: mapped value` |
| `text-{size}`    | `fontSize: mapped value`     |
| `font-{weight}`  | `fontWeight: mapped value`   |
| `bg-{color}`     | Variable binding             |
| `text-{color}`   | Variable binding             |
| `ring-{color}`   | Stroke variable binding      |
| `border-{color}` | Stroke variable binding      |

### Size Mappings

```typescript
const ROUNDED_MAP = {
  "rounded-none": 0,
  "rounded-sm": 2,
  rounded: 4,
  "rounded-md": 6,
  "rounded-lg": 8,
  "rounded-xl": 12,
  "rounded-2xl": 16,
  "rounded-full": 9999,
};

const TEXT_SIZE_MAP = {
  "text-xs": 12,
  "text-sm": 14,
  "text-base": 16,
  "text-lg": 18,
  "text-xl": 20,
  "text-2xl": 24,
  "text-3xl": 30,
};

const FONT_WEIGHT_MAP = {
  "font-normal": 400,
  "font-medium": 500,
  "font-semibold": 600,
  "font-bold": 700,
};
```

---

## Figma Variable System

### Variable Collections

The plugin expects these Figma variable collections:

1. **kumo-semantic-tokens** (or similar)
   - Contains all semantic color tokens
   - Has Light and Dark modes

### Variable Naming Convention

Variables should match Kumo token names:

| Kumo Token      | Figma Variable              |
| --------------- | --------------------------- |
| `bg-surface`    | `surface` or `bg/surface`   |
| `text-surface`  | `text/surface`              |
| `bg-primary`    | `primary` or `bg/primary`   |
| `text-muted`    | `text/muted`                |
| `border-border` | `border` or `stroke/border` |
| `ring-active`   | `active` or `stroke/active` |

### Binding Pattern

```typescript
// Find variable by name
const variable = figma.variables
  .getLocalVariables()
  .find((v) => v.name === "surface" || v.name === "bg/surface");

// Bind to fill
if (variable) {
  const fillsCopy = clone(node.fills);
  fillsCopy[0] = figma.variables.setBoundVariableForPaint(
    fillsCopy[0],
    "color",
    variable,
  );
  node.fills = fillsCopy;
}
```

---

## Testing Strategy

### Manual QA Checklist

For each generated component:

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] All variant combinations present
- [ ] Colors change when switching Figma modes
- [ ] Text is readable in both modes
- [ ] Icons render at correct size
- [ ] Spacing matches design specs
- [ ] ComponentSet variants work in Figma UI

### Automated Checks

```bash
# Build plugin
pnpm --filter @cloudflare/kumo build:figma-plugin

# Type check plugin
pnpm --filter @cloudflare/kumo typecheck:figma-plugin

# Type check root (ensures plugin doesn't break main package)
pnpm typecheck

# Lint
pnpm lint
```

---

## Troubleshooting

### Common Issues

**Issue**: Colors not binding to variables
**Solution**: Check variable names match exactly. Use `figma.variables.getLocalVariables()` to debug available variables.

**Issue**: Dark mode label positioned incorrectly
**Solution**: Call `combineAsVariants()` before positioning the label, as it moves components.

**Issue**: Icons not rendering
**Solution**: Ensure Icon Library page exists and icons are published as components.

**Issue**: Text not rendering
**Solution**: Load fonts before creating text nodes: `await figma.loadFontAsync({ family: "Inter", style: "Regular" })`

**Issue**: Plugin build fails
**Solution**: Check `tsconfig.json` excludes plugin from root compilation. Plugin has its own tsconfig.

---

## Future Enhancements

### v1.1: Interactive States

- Hover, focus, active states as additional variants
- State management in Figma via interactions

### v1.2: Responsive Variants

- Mobile/tablet/desktop breakpoint variants
- Auto-layout constraints for responsive behavior

### v1.3: Theme Support

- FedRAMP theme generation
- Custom theme variable collections

### v1.4: Storybook Sync

- Generate Figma pages from Storybook stories
- Two-way sync between code examples and Figma

---

## Resources

- **Component Registry**: `packages/kumo/ai/component-registry.json`
- **Figma Plugin API**: https://www.figma.com/plugin-docs/
- **Figma Variables API**: https://www.figma.com/plugin-docs/api/variables/
- **Kumo Storybook**: `pnpm storybook`

---

**Last Updated**: 2025-12-31
**Status**: Active Development
**Branch**: `swarm/figma-plugin`
