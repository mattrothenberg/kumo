# Figma Plugin Specification for Kumo

## Overview

The Figma plugin generates component library pages from `component-registry.json`. Each component gets light and dark mode sections with all variant combinations.

```
component-registry.json → generators/*.ts → Figma ComponentSets
```

## File Structure

```
packages/kumo/scripts/figma/plugin/
├── code.ts                      # Main entry, orchestrates generation
├── manifest.json                # Figma plugin manifest
├── build.sh                     # Build script (esbuild → ES2017)
├── parsers/
│   └── tailwind-to-figma.ts     # Tailwind → Figma property conversion
└── generators/
    ├── shared.ts                # Utilities (labels, sections, bindings)
    ├── icon-utils.ts            # Icon creation and color binding
    └── *.ts                     # Component generators
```

## Registry Structure

Each component in `component-registry.json` provides:

```json
{
  "ComponentName": {
    "props": {
      "variant": {
        "type": "enum",
        "values": ["primary", "secondary"],
        "classes": {
          "primary": "bg-primary text-white",
          "secondary": "bg-secondary text-surface ring ring-border"
        },
        "descriptions": {
          "primary": "High-emphasis button",
          "secondary": "Default button style"
        },
        "default": "secondary"
      }
    }
  }
}
```

**Key fields for generators:**

- `props.*.values` - Array of variant values to generate
- `props.*.classes` - Tailwind classes per variant (parsed by `tailwind-to-figma.ts`)
- `props.*.descriptions` - Used for Figma component descriptions
- `props.*.default` - Default variant value

## Generator Pattern

### Minimal Generator Template

```typescript
import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindFillToVariable,
  bindTextColorToVariable,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import registry from "../../../../ai/component-registry.json";

// 1. Extract props from registry
const props = registry.components.ComponentName.props;
const variantProp = props.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

const SECTION_PADDING = 48;
const SECTION_GAP = 160;

// 2. Create single component variant
async function createComponent(variant: string): Promise<ComponentNode> {
  const classes = variantProp.classes[variant] || "";
  const styles = parseTailwindClasses(classes);

  const component = figma.createComponent();
  component.name = `variant=${variant}`;
  component.description = variantProp.descriptions[variant] || "";

  // Apply styles from parsed Tailwind classes
  if (styles.fillVariable) {
    const fillVar = getVariableByName(styles.fillVariable);
    if (fillVar) bindFillToVariable(component, fillVar.id);
  }

  return component;
}

// 3. Generate all variants with light/dark sections
export async function generateComponentNameComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  figma.currentPage = page;

  const variants = variantProp.values;
  const components: ComponentNode[] = [];
  const rowLabels: { y: number; text: string }[] = [];

  // Create components
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const component = await createComponent(variant);
    component.x = 160; // Label column width
    component.y = i * 50;
    rowLabels.push({ y: i * 50, text: `variant=${variant}` });
    components.push(component);
  }

  // Combine into ComponentSet
  const componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "ComponentName";
  componentSet.layoutMode = "NONE";

  // Create sections
  const contentWidth = componentSet.width + 160;
  const contentHeight = componentSet.height;

  const lightSection = createModeSection(page, "ComponentName", "light");
  const darkSection = createModeSection(page, "ComponentName", "dark");

  // Move ComponentSet to light section
  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING + 160;
  componentSet.y = SECTION_PADDING;

  // Add labels and instances to both sections
  for (const label of rowLabels) {
    const lightLabel = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y,
    );
    lightSection.frame.appendChild(lightLabel);

    const darkLabel = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y,
    );
    darkSection.frame.appendChild(darkLabel);
  }

  // Dark section gets instances
  for (const comp of components) {
    const instance = comp.createInstance();
    instance.x = comp.x + SECTION_PADDING + 160;
    instance.y = comp.y + SECTION_PADDING;
    darkSection.frame.appendChild(instance);
  }

  // Position sections
  const totalWidth = contentWidth + SECTION_PADDING * 2;
  const totalHeight = contentHeight + SECTION_PADDING * 2;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  lightSection.section.x = 100;
  lightSection.section.y = startY;
  darkSection.section.x = 100 + totalWidth + 50;
  darkSection.section.y = startY;

  return startY + totalHeight + SECTION_GAP;
}
```

### Adding to code.ts

```typescript
import { generateComponentNameComponents } from "./generators/component-name";

// In the generate handler:
figma.notify("Generating ComponentName components...");
nextY = await generateComponentNameComponents(componentsPage, nextY);
```

## Critical Rules

### Variable Bindings (Never Hardcode Colors)

```typescript
// CORRECT - Bind to variable
const surfaceVar = getVariableByName("color-surface");
if (surfaceVar) bindFillToVariable(component, surfaceVar.id);

// WRONG - Hardcoded color
component.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
```

### Variable Name Mapping

| Kumo Token     | Figma Variable       |
| -------------- | -------------------- |
| `bg-surface`   | `color-surface`      |
| `bg-primary`   | `color-primary`      |
| `text-surface` | `text-color-surface` |
| `text-label`   | `text-color-label`   |
| `border-color` | `color-color`        |

### Font Loading

**Use Roboto Mono for monospace** (SF Mono is not reliably available):

```typescript
// Standard fonts
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });

// Monospace (for Code, CodeBlock, ClipboardText)
await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
```

### Syntax Constraints (ES2017 Target)

Figma's plugin runtime doesn't support modern JS. Avoid:

| Forbidden          | Use Instead                             |
| ------------------ | --------------------------------------- |
| `value ?? default` | `value !== undefined ? value : default` |
| `obj?.prop`        | `obj && obj.prop`                       |
| `{ ...obj }`       | `Object.assign({}, obj)`                |
| `[...arr]`         | `arr.concat([])`                        |

### ComponentSet Naming

```typescript
// Single property
component.name = "variant=primary";

// Multiple properties
component.name = "variant=primary, size=base";
```

## Tailwind Parser

`parseTailwindClasses()` converts Tailwind to Figma properties:

| Tailwind      | Figma Property                     |
| ------------- | ---------------------------------- |
| `h-9`         | `height: 36`                       |
| `px-3`        | `paddingLeft/Right: 12`            |
| `rounded-lg`  | `cornerRadius: 8`                  |
| `text-sm`     | `fontSize: 14`                     |
| `bg-surface`  | `fillVariable: "color-surface"`    |
| `text-muted`  | `textVariable: "text-color-muted"` |
| `ring-border` | `strokeVariable: "color-border"`   |

## Build & Test

```bash
# Build plugin
cd packages/kumo/scripts/figma/plugin && ./build.sh

# Or from root
pnpm --filter @cloudflare/kumo build:figma-plugin
```

After building, run the plugin in Figma:

1. Plugins > Development > Import plugin from manifest
2. Select `packages/kumo/scripts/figma/plugin/manifest.json`
3. Run "Kumo UI Kit Generator"

## Component Status

| Component       | Variants                                 | Notes                       |
| --------------- | ---------------------------------------- | --------------------------- |
| Badge           | variant (5)                              | Simple text badge           |
| Banner          | variant (3)                              | Icon + text                 |
| Button          | variant (6) x size (4) x shape (3)       | Full matrix                 |
| Checkbox        | variant (2) x checked (3) x disabled (2) | With icons                  |
| ClipboardText   | size (3)                                 | Roboto Mono                 |
| Code            | lang (5)                                 | Roboto Mono, transparent bg |
| CodeBlock       | lang (5)                                 | Roboto Mono, bordered       |
| Collapsible     | open (2) x state (4)                     | Chevron icon, content panel |
| Combobox        | variant (3) x open (2) x state (3)       | Label, description, error   |
| DateRangePicker | size (3) x variant (2) x selected (2)    | Dual calendar, date range   |
| Dialog          | size (4)                                 | Title, description, actions |
| LinkButton      | variant (6) x size (4)                   | Arrow icon                  |
| RefreshButton   | loading (2) x size (4)                   | Refresh icon                |
| Text            | variant (9) x size (4)                   | Typography scale            |

## Troubleshooting

**Colors not switching in dark mode**: Ensure `createModeSection()` is used and ComponentSet is inside the frame.

**Text not rendering**: Load fonts before creating text nodes.

**Icons missing**: Run Icon Library generation first (happens automatically in code.ts).

**Build errors**: Check for forbidden syntax (nullish coalescing, optional chaining).

---

**Source of Truth**: `packages/kumo/ai/component-registry.json`
**Build Target**: ES2017 (Figma plugin sandbox)
