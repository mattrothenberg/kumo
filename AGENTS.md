# AGENTS.md

Comprehensive guide for AI agents and developers working with Kumo.

## Quick Start

```bash
pnpm add @cloudflare/kumo
```

```tsx
import { Button } from "@cloudflare/kumo";
```

**CRITICAL:** Only use semantic tokens (`bg-surface`, `text-surface`). Never raw Tailwind colors (`bg-blue-500`).

```bash
pnpm build:ai-metadata  # Generate component-registry.{json,md}
```

## Repository Overview

`Kumo` is Cloudflare's component library for building modern web applications. It is a `pnpm` monorepo containing a React component library and its documentation site. The library provides accessible, design-system-compliant UI components built on [Base UI](https://base-ui.com/).

## Project Structure

```
kumo/
├── packages/
│   ├── kumo/                      # Component library (@cloudflare/kumo)
│   │   ├── src/
│   │   │   ├── components/        # UI components (button, dialog, input, etc.)
│   │   │   ├── blocks/            # Composite components (breadcrumbs, page-header)
│   │   │   ├── layouts/           # Page layouts (resource-list)
│   │   │   ├── pages/             # Full page components
│   │   │   ├── styles/            # CSS including kumo-binding.css
│   │   │   ├── utils/             # Utilities (cn, link-provider)
│   │   │   └── index.ts           # Main exports
│   │   ├── ai/                    # Component registry for AI agents
│   │   ├── .storybook/            # Storybook configuration
│   │   ├── scripts/               # Build and linting scripts
│   │   └── package.json
│   └── kumo-docs/                 # Documentation site (@cloudflare/kumo-docs)
│       ├── app/                   # React Router application
│       ├── workers/               # Cloudflare Workers
│       └── package.json
├── ci/                            # CI/CD scripts and versioning
├── .changeset/                    # Changeset files for versioning
└── package.json                   # Workspace root
```

## Architecture

### Component Library (`packages/kumo`)

- **Built with**: React, TypeScript, Tailwind CSS v4, Base UI
- **Icons**: `@phosphor-icons/react`
- **Styling**: `cn()` utility combining `clsx` + `tailwind-merge`
- **Build**: Vite in library mode with tree-shakeable exports

### Documentation Site (`packages/kumo-docs`)

- **Framework**: React Router v7 + Vite
- **Deployment**: Cloudflare Workers
- **Dev server**: `http://localhost:5173`

## Component Registry (Source of Truth)

**Location:**

- `packages/kumo/ai/component-registry.json` - Machine-readable (28 components)
- `packages/kumo/ai/component-registry.md` - Human-readable (1575 lines)

### CLI Commands

The Kumo CLI provides quick access to component documentation, especially useful when `node_modules` is gitignored:

```bash
# List all components grouped by category
npx @cloudflare/kumo ls

# Get documentation for a specific component
npx @cloudflare/kumo doc Button
npx @cloudflare/kumo doc Dialog

# Get documentation for ALL components
npx @cloudflare/kumo docs

# Show help
npx @cloudflare/kumo help
```

**Note:** `kumo doc` (without a component name) is equivalent to `kumo docs`.

### Query examples (using jq):

```bash
# Get Button props
jq '.components.Button.props' component-registry.json

# List Action category components
jq '.search.byCategory.Action' component-registry.json

# Get all component names
jq '.search.byName' component-registry.json

# Find components using a specific token
grep "bg-surface" component-registry.md
```

**Registry contains:**

- Props (type, required/optional, default values, descriptions)
- Variants (enum values with descriptions)
- Examples (real code from stories)
- Semantic colors used (kumo tokens only)
- Sub-components (for compound patterns like Dialog.Root, Dialog.Trigger)

## Critical Rules

### ❌ NEVER

- **Raw Tailwind colors:** `bg-blue-500`, `text-gray-900` → Breaks theming, fails lint
- **Dark mode variants:** `dark:bg-black` → Dark mode is automatic via semantic tokens
- **Missing displayName:** forwardRef components must set `displayName` for debugging
- **Skipping registry:** Always check `component-registry.json` for component API before use

### ✅ ALWAYS

- **Semantic tokens:** `bg-surface`, `text-surface`, `border-border`, `ring-active`
- **Query registry first:** Props, variants, and examples are always current
- **Use `cn()` utility:** For className composition (`cn("base", conditional && "extra", className)`)
- **Forward refs:** Components wrapping DOM elements must use `forwardRef`

## Styling System

### Kumo Semantic Color Tokens

**CRITICAL**: Always use Kumo semantic color classes, never raw Tailwind colors.

The color system is defined in `packages/kumo/src/styles/kumo-binding.css`. Colors automatically adapt to light/dark mode via CSS `light-dark()` function.

**Full reference:** See `component-registry.md` lines 1-72 for complete styling guide with tables and examples.

### Core Tokens

**Backgrounds:**

- `bg-surface` - Main background (pages, cards)
- `bg-surface-2` - Secondary surface
- `bg-surface-elevated` - Elevated surfaces (modals, dropdowns, popovers, cards)
- `bg-secondary` - Secondary elements / Interactive elements (buttons, inputs)
- `bg-accent` - Accent backgrounds / Selected/active state (tabs, selections)
- `bg-primary` - Primary action backgrounds
- `bg-destructive` - Destructive action backgrounds
- `bg-subtle` - Subtle backgrounds / Hover state backgrounds
- `bg-color` - Border-like backgrounds

**Text:**

- `text-surface` - Primary text (body, headings)
- `text-secondary` - Secondary text (descriptions, hints)
- `text-muted` - Muted/placeholder text (placeholders, disabled)
- `text-white` - Always white text
- `text-label` - Label text
- `text-destructive` - Error/destructive text
- `text-info` - Success text
- `text-error` - Error text (validation messages)

**Borders:**

- `border-border` - Default borders (cards, dividers)
- `border-color` - Alternative borders
- `ring-border` - Ring borders
- `ring-active` - Active/focus rings (keyboard navigation)
- `ring-destructive` - Error state rings

### Example Usage

```tsx
// ✅ CORRECT - Using Kumo semantic tokens
<button className="bg-primary text-white hover:bg-primary/70">
  Submit
</button>

<div className="bg-surface border border-border text-surface">
  Content
</div>

// ❌ WRONG - Using raw Tailwind colors
<button className="bg-blue-500 text-white hover:bg-blue-600">
  Submit
</button>

<div className="bg-white dark:bg-gray-900 border border-gray-200">
  Content
</div>
```

### Dark Mode

**NEVER use Tailwind's `dark:` variant**. The Kumo color system handles dark mode automatically through CSS custom properties and `light-dark()`.

All semantic tokens use `light-dark()` internally. **Never use `dark:` variant.**

```tsx
// ❌ WRONG - Manual dark mode handling
<div className="bg-white dark:bg-black text-black dark:text-white" />

// ✅ CORRECT - Automatic dark mode via semantic tokens
<div className="bg-surface text-surface" />
```

### Surface Hierarchy

Use layered surfaces for visual depth:

```
bg-surface → bg-surface-elevated → bg-surface-2
```

### Mode & Theme System

Kumo uses two data attributes for styling control:

- **`data-mode`**: Controls light/dark mode (`"light"` | `"dark"`)
- **`data-theme`**: Controls theme variants (e.g., `"fedramp"`)

#### Dark Mode (`data-mode`)

Set `data-mode` on a parent element (typically `<html>` or `<body>`) to control color scheme:

```tsx
// Light mode
<html data-mode="light">

// Dark mode
<html data-mode="dark">
```

The CSS uses `color-scheme` and `light-dark()` to automatically adapt all semantic tokens:

```css
:root {
  color-scheme: light;
}

[data-mode="dark"] {
  color-scheme: dark;
}
```

#### Themes (`data-theme`)

Themes override semantic color tokens defined in `packages/kumo/src/styles/kumo-binding.css`.

**Existing Themes:**

- **Default**: No `data-theme` attribute required
- **FedRAMP**: `data-theme="fedramp"` - Government compliance styling

#### Adding a New Theme

1. Add theme overrides in `kumo-binding.css` within `@layer base`:

```css
@layer base {
  [data-theme="my-theme"] {
    --color-surface: light-dark(#custom-light, #custom-dark);
    --color-active: light-dark(#custom-light, #custom-dark);
    --text-color-surface: light-dark(#custom-light, #custom-dark);
    /* Override any semantic tokens as needed */
  }
}
```

2. Apply the theme by setting the `data-theme` attribute on a parent element:

```tsx
<div data-theme="my-theme">
  {/* All Kumo components inside will use theme overrides */}
</div>
```

#### Theme Guidelines

- **Use `light-dark()`**: Ensures themes work with both light and dark modes
- **Override sparingly**: Only override tokens that need to change
- **Semantic tokens only**: Themes should override `--color-*` and `--text-color-*` variables, not component-specific styles
- **Test both modes**: Verify theme looks correct in light and dark mode

## Component Patterns

### Standard Component Structure

Each component follows this file structure:

```
components/
└── button/
    ├── button.tsx           # Component implementation
    ├── button.stories.tsx   # Storybook stories
    └── index.ts             # Re-exports
```

### Component Implementation Pattern

```tsx
import { cn } from "../../utils/cn";
import { forwardRef } from "react";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "xs" | "sm" | "base" | "lg";
  // ... other props
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "base", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "flex items-center font-medium",
          // Variant styles using Kumo tokens
          variant === "primary" && "bg-primary text-white",
          variant === "secondary" &&
            "bg-secondary text-secondary ring ring-border",
          // Size styles
          size === "base" && "h-9 px-3 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
```

### Using Base UI

Components are built on Base UI primitives:

```tsx
import { Dialog as DialogBase } from "@base-ui/react/dialog";

function DialogContent({ children }) {
  return (
    <DialogBase.Portal>
      <DialogBase.Backdrop className="bg-color-3 opacity-80" />
      <DialogBase.Popup className="rounded-xl bg-surface">
        {children}
      </DialogBase.Popup>
    </DialogBase.Portal>
  );
}
```

### Variants System

Components export `KUMO_<NAME>_VARIANTS` constants defining available variants.

**Check registry for:**

- `props[].values` - Available variant values (e.g., `["primary", "secondary"]`)
- `props[].default` - Default variant (e.g., `"secondary"`)
- `props[].descriptions` - Variant descriptions (when to use each)

**Example from registry:**

```json
{
  "Button": {
    "props": {
      "variant": {
        "type": "enum",
        "values": ["primary", "secondary", "ghost", "destructive"],
        "default": "secondary",
        "descriptions": {
          "primary": "Primary action button",
          "secondary": "Secondary action button with border"
        }
      }
    }
  }
}
```

### Compound Components

Check registry `subComponents` field for compound component patterns.

**Example:** Dialog has sub-components: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Title`, `Dialog.Description`, `Dialog.Close`

```json
{
  "Dialog": {
    "subComponents": {
      "Root": {
        "description": "Controls the open state",
        "props": { "open": { "type": "boolean" } }
      },
      "Trigger": {
        "description": "Button that opens the dialog",
        "renderElement": "<button>"
      }
    }
  }
}
```

### Component Requirements

All components must:

1. Export `KUMO_<NAME>_VARIANTS` (variants config)
2. Export `KUMO_<NAME>_DEFAULT_VARIANTS` (default values)
3. Use `forwardRef` when wrapping DOM elements
4. Set `displayName` for React DevTools

## Adding Components

### Workflow

1. **Run the scaffolding tool:**

   ```bash
   pnpm --filter @cloudflare/kumo new-component
   ```

2. **Implement the component:**
   - Use semantic tokens only (never raw Tailwind colors)
   - Add KUMO*\*\_VARIANTS and KUMO*\*\_DEFAULT_VARIANTS exports
   - Use `forwardRef` when wrapping DOM elements
   - Set `displayName` for React DevTools

3. **Write Storybook stories** showing all variants and states

4. **Regenerate the component registry:**
   ```bash
   pnpm build:ai-metadata
   ```

### What Gets Scaffolded

- `src/components/{name}/{name}.tsx` - Component implementation
- `src/components/{name}/{name}.stories.tsx` - Storybook stories
- `src/components/{name}/index.ts` - Re-exports
- Updates `src/index.ts` exports
- Updates `vite.config.ts` build entries
- Updates `package.json` exports

## Development & Tooling

### Package Management (`pnpm`)

```bash
pnpm install                              # Install all dependencies
pnpm --filter @cloudflare/kumo build      # Build component library
pnpm --filter @cloudflare/kumo-docs dev   # Run docs dev server
```

### Common Scripts

```bash
# From workspace root
pnpm dev           # Start docs dev server
pnpm storybook     # Start Storybook (component development)
pnpm build         # Build docs site
pnpm lint          # Run linting
pnpm typecheck     # Type check all packages

# From packages/kumo
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once
pnpm new-component # Scaffold new component
```

### Build & Test

```bash
# Testing
pnpm --filter @cloudflare/kumo test       # Vitest watch mode
pnpm --filter @cloudflare/kumo test:run   # Single run
pnpm --filter @cloudflare/kumo test:ui    # UI mode

# Linting (includes custom rules)
pnpm --filter @cloudflare/kumo lint       # oxlint with:
                                           # - no-primitive-colors (fails on bg-blue-500)
                                           # - no-tailwind-dark-variant (fails on dark:)

# Build
pnpm --filter @cloudflare/kumo build      # Full build with CSS
pnpm build:ai-metadata                    # Regenerate component-registry

# Storybook
pnpm storybook                            # Dev server (http://localhost:6006)
```

### Linting (`oxlint`)

The project uses `oxlint` with type-aware linting and custom rules:

```bash
pnpm --filter @cloudflare/kumo lint
```

#### Custom Lint Rules

1. **`no-primitive-colors`** (`scripts/linting/no-primitive-colors.js`)
   - Disallows Tailwind primitive colors (e.g., `bg-blue-500`, `text-gray-900`)
   - Enforces use of Kumo semantic tokens (e.g., `bg-surface`, `text-muted`)

2. **`no-tailwind-dark-variant`** (`scripts/linting/no-tailwind-dark-variant.js`)
   - Disallows `dark:` variant in class names
   - Dark mode is handled automatically by Kumo tokens

### Testing (`vitest`)

```bash
pnpm --filter @cloudflare/kumo test       # Watch mode
pnpm --filter @cloudflare/kumo test:run   # Single run
pnpm --filter @cloudflare/kumo test:ui    # UI mode
```

### Storybook

Component development and documentation:

```bash
pnpm storybook  # Runs at http://localhost:6006
```

Stories follow this pattern:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Button" },
};
```

## Releases

Uses [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
pnpm changeset              # Create a changeset
pnpm version                # Apply changesets and bump versions
pnpm release                # Build and publish
```

## Code Review Guidelines

When reviewing code, focus on:

### Styling

- **Verify Kumo tokens**: Ensure `bg-*`, `text-*`, `border-*` semantic classes are used (e.g., `bg-surface`, `text-muted`, `border-border`)
- **No raw Tailwind colors**: Flag any `bg-blue-500`, `text-gray-*`, etc.
- **No `dark:` variants**: Dark mode should be automatic via tokens
- **Use `cn()` utility**: For conditional class composition

### Component Quality

- **Accessibility**: Components should use Base UI primitives for a11y
- **TypeScript**: Proper typing with exported types
- **forwardRef**: Components should forward refs when wrapping DOM elements
- **displayName**: Set for debugging in React DevTools

### Performance

- **Tree-shaking**: Components should be individually importable
- **Bundle size**: Avoid unnecessary dependencies
- **Re-renders**: Check for unnecessary re-renders in complex components

### Testing

- **Stories**: Every component needs Storybook stories
- **Edge cases**: Consider loading, error, empty, and disabled states

## Workflow Best Practices

### Before Writing Code

1. **Always check the component registry first** (`packages/kumo/ai/component-registry.{json,md}`)
   - Use `jq` to query component props, variants, and examples
   - Never guess component APIs - the registry is always current
   - Example: `jq '.components.Button.props' packages/kumo/ai/component-registry.json`

2. **Read related components before modifying or creating similar ones**
   - Examine existing implementations for patterns
   - Maintain consistency with established conventions

### Tool Usage for AI Agents

When working with this codebase as an AI agent:

1. **Read files** to examine component implementations before modifying them
2. **Use `jq`** to query the component registry (`packages/kumo/ai/component-registry.json`)
3. **Use search tools** for complex searches across the codebase (e.g., "find all components using bg-surface")
4. **Run commands** for scaffolding, build, test, and lint operations

### When Modifying Components

1. **Read the component and its stories first**
2. **Verify semantic tokens** - Ensure no raw Tailwind colors exist
3. **Run linting** - Custom rules will catch color and dark mode violations
4. **Update stories** - Ensure Storybook examples reflect changes
5. **Regenerate registry** - Run `pnpm build:ai-metadata` after changes

## Important Notes

- The component registry (`packages/kumo/ai/component-registry.{json,md}`) is the source of truth for component APIs
- Always regenerate the registry (`pnpm build:ai-metadata`) after modifying component props or variants
- Custom lint rules enforce semantic token usage and prevent `dark:` variants

### Common Mistakes to Avoid

- Using raw Tailwind colors (`bg-blue-500`) instead of semantic tokens (`bg-surface`)
- Using `dark:` variants instead of letting semantic tokens handle dark mode
- Forgetting to set `displayName` on `forwardRef` components
- Not checking the component registry before using a component
- Creating new components without running the scaffolding tool
- Forgetting to regenerate the component registry after changes

## Resources

- **Component Registry** - `packages/kumo/ai/component-registry.{json,md}` - Always-current component metadata
- **Storybook** - `pnpm storybook` - Live component playground with all variants
- **Source** - `packages/kumo/src/` - Component source code organized by type:
  - `components/` - UI primitives (Button, Input, Dialog)
  - `blocks/` - Composite components (Breadcrumbs, PageHeader, Empty)
  - `layouts/` - Page layouts (ResourceList)
  - `styles/` - CSS including `kumo-binding.css` (semantic token definitions)
