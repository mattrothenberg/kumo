# CLAUDE.md

This file provides guidance to Claude Code when working with the `kumo` codebase.

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

## Styling System

### Kumo Semantic Color Tokens

**CRITICAL**: Always use Kumo semantic color classes, never raw Tailwind colors.

The color system is defined in `packages/kumo/src/styles/kumo-binding.css`. Colors automatically adapt to light/dark mode via CSS `light-dark()` function.

#### Background Colors

- `bg-surface` - Main background
- `bg-surface-2` - Secondary surface
- `bg-surface-elevated` - Elevated surfaces (modals, cards)
- `bg-secondary` - Secondary elements
- `bg-accent` - Accent backgrounds
- `bg-primary` - Primary action backgrounds
- `bg-destructive` - Destructive action backgrounds
- `bg-subtle` - Subtle backgrounds
- `bg-color` - Border-like backgrounds

#### Text Colors

- `text-surface` - Primary text
- `text-secondary` - Secondary text
- `text-muted` - Muted/placeholder text
- `text-white` - Always white text
- `text-label` - Label text
- `text-destructive` - Error/destructive text
- `text-success` - Success text
- `text-info` - Info text
- `text-error` - Error text

#### Border Colors

- `border-border` - Default borders
- `border-color` - Alternative borders
- `ring-border` - Ring borders
- `ring-active` - Active/focus rings

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

```tsx
// ❌ WRONG - Manual dark mode handling
<div className="bg-white dark:bg-black text-black dark:text-white">

// ✅ CORRECT - Automatic dark mode via semantic tokens
<div className="bg-surface text-surface">
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
          variant === "secondary" && "bg-secondary text-secondary ring ring-border",
          // Size styles
          size === "base" && "h-9 px-3 text-base",
          className,
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

### Using Base UI

Components are built on Base UI primitives:

```tsx
import { Dialog as DialogBase } from "@base-ui-components/react";

function DialogContent({ children }) {
  return (
    <DialogBase.Portal>
      <DialogBase.Backdrop className="bg-color-3 opacity-80" />
      <DialogBase.Popup className="bg-surface rounded-xl">
        {children}
      </DialogBase.Popup>
    </DialogBase.Portal>
  );
}
```

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
import type { Meta, StoryObj } from "@storybook/react";
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

## Creating New Components

Use the scaffolding tool:

```bash
pnpm --filter @cloudflare/kumo new-component
```

This creates:

- `src/components/{name}/{name}.tsx`
- `src/components/{name}/{name}.stories.tsx`
- `src/components/{name}/index.ts`
- Updates `src/index.ts` exports
- Updates `vite.config.ts` build entries
- Updates `package.json` exports

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
