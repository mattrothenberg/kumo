---
"@cloudflare/kumo": minor
---

fix(checkbox): make label clickable, add new `onCheckedChange` API

- Clicking the label now toggles the checkbox
- New `onCheckedChange` callback (preferred over deprecated `onChange`/`onValueChange`)
- Ref type is now `HTMLButtonElement` (aligns with Base UI implementation)
