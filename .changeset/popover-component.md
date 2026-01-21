---
"@cloudflare/kumo": minor
---

feat(popover): Add new Popover component

Adds a new Popover component based on Base UI's popover primitive. The Popover provides an accessible popup anchored to a trigger element, with support for:

- Compound component API: `Popover`, `Popover.Trigger`, `Popover.Content`, `Popover.Title`, `Popover.Description`, `Popover.Close`
- Positioning options: `side` (top, bottom, left, right), `align` (start, center, end), `sideOffset`
- Click-to-open by default, with optional `openOnHover` behavior
- Controlled mode via `open` and `onOpenChange` props
- Visual styling matching the updated Tooltip component (surface-aware background, proper light/dark mode support)
