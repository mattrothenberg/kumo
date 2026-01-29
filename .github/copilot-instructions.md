# GitHub Copilot Instructions for Kumo

This file provides GitHub Copilot-specific guidance. For comprehensive documentation, see [AGENTS.md](../AGENTS.md).

## Project Context

Kumo is Cloudflare's React component library built on Base UI. It uses:

- React + TypeScript
- Tailwind CSS v4 with semantic tokens
- Semantic color system (automatic dark mode)
- Phosphor Icons

## Critical Rules

1. **Semantic tokens only** - Never use raw Tailwind colors (`bg-blue-500`). Always use Kumo tokens (`bg-kumo-base`, `text-kumo-default`).
2. **No `dark:` variants** - Dark mode is automatic via CSS `light-dark()` function.
3. **Always use `forwardRef`** - Components wrapping DOM elements must forward refs.
4. **Set `displayName`** - Required for React DevTools debugging.

## Correct Patterns

```tsx
// Styling - ALWAYS use semantic tokens
<div className="bg-kumo-base text-kumo-default border border-kumo-line" />
<button className="bg-kumo-brand text-white" />
<div className="bg-kumo-danger/20 text-kumo-danger" />

// Component structure
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const MyComponent = forwardRef<HTMLDivElement, MyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-kumo-base", className)} {...props} />
  )
);
MyComponent.displayName = "MyComponent";
```

## Incorrect Patterns (AVOID)

```tsx
// WRONG - raw Tailwind colors
<div className="bg-blue-500 text-gray-900" />

// WRONG - dark: variants
<div className="bg-white dark:bg-black" />

// WRONG - missing forwardRef/displayName
export const MyComponent = (props) => <div {...props} />;
```

## Quick Reference

- Component registry: `packages/kumo/ai/component-registry.json`
- Semantic tokens: `packages/kumo/src/styles/kumo-binding.css`
- CLI: `npx @cloudflare/kumo doc <Component>`

For full documentation, see [AGENTS.md](../AGENTS.md).
