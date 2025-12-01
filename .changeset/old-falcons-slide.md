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
- Migration: Add `data-theme="kumo"` to your root element (defaults to light mode)
