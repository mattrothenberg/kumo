---
"@cloudflare/kumo": minor
---

fix(checkbox): make label clickable, add new `onCheckedChange` API

**BREAKING CHANGES:**

- Checkbox ref type changed from `HTMLInputElement` to `HTMLButtonElement`
- Props no longer extend `InputHTMLAttributes` (explicit props only)

**Migration Guide:**

- Update `onChange` → `onCheckedChange` (deprecated `onChange` still works)
- Update `onValueChange` → `onCheckedChange` (deprecated `onValueChange` still works)
- If accessing ref, expect `HTMLButtonElement` instead of `HTMLInputElement`
