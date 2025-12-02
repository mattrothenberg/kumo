---
"@cloudflare/kumo": minor
---

- Complete semantic color tokens migrated from Stratus app
- Document color and text-color tokens in Storybook
- Add accessibility tests via Storybook Vitest addon
- Add component-metadata generator for AI tooling
- Enable linting in CI/CD (passing)
- Apply Prettier Tailwind plugin for consistent class ordering
- Use pnpm catalog for shared package versions
- Semantic colors now scoped to `[data-theme]` and `[data-mode]` attributes
- Consumers must ensure root element has these attributes for proper theming

### Migration Guide

Add `data-theme` and `data-mode` attributes to your root element:

```tsx
// React example
<html data-theme="kumo" data-mode={isDark ? "dark" : "light"}>

// Static HTML
<html data-theme="kumo" data-mode="light">
```

- **`data-theme`**: Set to `"kumo"` (default theme) or other theme variants like `"fedramp"`
- **`data-mode`**: Set to `"light"` or `"dark"` to control color scheme

If no `data-mode` is set, the system defaults to light mode.
