---
"@cloudflare/kumo": patch
---

**Combobox Type Fixes**

- Removed `any` type and eslint-disable comments
- Used proper `ComboboxBase.Root.Props<Value, Multiple>` from base-ui's namespace
- Simplified generic parameters from 3 (ItemValue, SelectedValue, Multiple) to 2 (Value, Multiple) to match base-ui's actual API
