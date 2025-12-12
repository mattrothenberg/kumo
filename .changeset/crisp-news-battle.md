---
"@cloudflare/kumo-docs": patch
---

Changed all onValueChange={setValue} to onValueChange={(v) => setValue(v as any)} to handle the nullable value from base-ui while maintaining existing state types.
