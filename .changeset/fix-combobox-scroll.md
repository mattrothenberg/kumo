---
"@cloudflare/kumo": patch
---

Fix Combobox dropdown not scrolling when it has many items. The `overflow-hidden` class was overriding `overflow-y-auto`, causing content to be clipped instead of scrollable.
