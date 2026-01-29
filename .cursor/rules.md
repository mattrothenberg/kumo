# Cursor Rules for Kumo

This file provides Cursor-specific guidance. For comprehensive documentation, see [AGENTS.md](../AGENTS.md).

## Critical Rules

1. **Semantic tokens only** - Never use raw Tailwind colors (`bg-blue-500`). Always use Kumo tokens (`bg-kumo-base`).
2. **No `dark:` variants** - Dark mode is automatic via `light-dark()` in semantic tokens.
3. **Check component registry** - Query `packages/kumo/ai/component-registry.json` before using components.
4. **Use `cn()` utility** - For className composition.

## Quick Commands

```bash
npx @cloudflare/kumo doc Button    # Component docs
pnpm --filter @cloudflare/kumo new-component  # Scaffold component
pnpm --filter @cloudflare/kumo codegen:registry  # Regenerate registry
```

## Key Patterns

```tsx
// Correct styling
<div className="bg-kumo-base text-kumo-default border-kumo-line">

// Correct component structure
export const MyComponent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return <div ref={ref} className={cn("base-styles", props.className)} />;
});
MyComponent.displayName = "MyComponent";
```

For full documentation including component patterns, styling system, CI/CD, and Figma plugin, see [AGENTS.md](../AGENTS.md).
