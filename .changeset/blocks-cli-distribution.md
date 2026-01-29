---
"@cloudflare/kumo": minor
---

feat(cli): blocks are now distributed via CLI instead of npm exports

New CLI commands for block management:

- `kumo init` - Initialize kumo.json configuration file
- `kumo blocks` - List all available blocks for CLI installation
- `kumo add <block-name>` - Install a block to your project with transformed imports

Blocks are copied to your project for full customization, with relative imports automatically converted to `@cloudflare/kumo`.
