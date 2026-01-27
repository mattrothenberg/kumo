---
"@cloudflare/kumo": minor
---

Add Link component with Base UI composition API

- New `Link` component for consistent inline text links
- Supports `render` prop for composition with framework-specific links (e.g., React Router)
- Uses Base UI's `useRender` hook for proper ref/event merging
- Three variants: `inline` (default), `current`, and `plain`
- `Link.ExternalIcon` subcomponent for external link indicators
- Integrates with `LinkProvider` for framework-agnostic routing
