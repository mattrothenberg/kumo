# AGENTS.md

Quick reference for AI agents and developers working with Kumo.

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

## Component Registry (Source of Truth)

**Location:**

- `packages/kumo/dist/ai/component-registry.json` - Machine-readable (28 components)
- `packages/kumo/dist/ai/component-registry.md` - Human-readable (1575 lines)

**Query examples:**

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

## Semantic Tokens

**Full reference:** See `component-registry.md` lines 1-72 for complete styling guide with tables and examples.

### Core Tokens

**Backgrounds:**

- `bg-surface` - Main background (pages, cards)
- `bg-surface-elevated` - Elevated surfaces (modals, dropdowns, popovers)
- `bg-secondary` - Interactive elements (buttons, inputs)
- `bg-accent` - Selected/active state (tabs, selections)
- `bg-subtle` - Hover state backgrounds

**Text:**

- `text-surface` - Primary text (body, headings)
- `text-secondary` - Secondary text (descriptions, hints)
- `text-muted` - Muted text (placeholders, disabled)
- `text-error` - Error text (validation messages)

**Borders:**

- `border-border` - Default borders (cards, dividers)
- `border-color` - Alternative borders
- `ring-active` - Focus rings (keyboard navigation)
- `ring-destructive` - Error state rings

### Dark Mode

All semantic tokens use `light-dark()` internally. **Never use `dark:` variant.**

```tsx
// ❌ WRONG - Manual dark mode
<div className="bg-white dark:bg-black" />

// ✅ CORRECT - Automatic via semantic tokens
<div className="bg-surface" />
```

### Surface Hierarchy

Use layered surfaces for visual depth:

```
bg-surface → bg-surface-elevated → bg-surface-2
```

## Component Patterns

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

```bash
pnpm --filter @cloudflare/kumo new-component
```

**Scaffolds:**

- `src/components/{name}/{name}.tsx` - Component implementation
- `src/components/{name}/{name}.stories.tsx` - Storybook stories
- `src/components/{name}/index.ts` - Re-exports
- Updates `src/index.ts` exports
- Updates `vite.config.ts` build entries
- Updates `package.json` exports

**After scaffolding:**

1. Implement component with semantic tokens only
2. Add KUMO*\*\_VARIANTS and KUMO*\*\_DEFAULT_VARIANTS exports
3. Write Storybook stories
4. Run `pnpm build:ai-metadata` to update component-registry

## Build & Test

```bash
# Testing
pnpm --filter @cloudflare/kumo test       # Vitest watch mode
pnpm --filter @cloudflare/kumo test:run   # Single run

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

## Resources

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive guide: architecture, theming system, mode/theme variants, code review guidelines, release process
- **Component Registry** - `packages/kumo/dist/ai/component-registry.{json,md}` - Always-current component metadata
- **Storybook** - `pnpm storybook` - Live component playground with all variants
- **Source** - `packages/kumo/src/` - Component source code organized by type:
  - `components/` - UI primitives (Button, Input, Dialog)
  - `blocks/` - Composite components (Breadcrumbs, PageHeader, Empty)
  - `layouts/` - Page layouts (ResourceList)
  - `styles/` - CSS including `kumo-binding.css` (semantic token definitions)

---

**For complex topics not covered here, see [CLAUDE.md](./CLAUDE.md):**

- Mode & theme system (`data-mode`, `data-theme`)
- Adding new themes
- Custom lint rule details
- CI/CD and release process (changesets)
- Code review guidelines
