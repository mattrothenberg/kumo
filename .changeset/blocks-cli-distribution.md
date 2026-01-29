---
"@cloudflare/kumo": patch
---

feat(cli): blocks are now distributed via CLI instead of npm exports

**BREAKING CHANGES:**

- Blocks (PageHeader, ResourceListPage) are no longer exported from `@cloudflare/kumo`
- Blocks must be installed via the Kumo CLI: `kumo add <block-name>`

**New Features:**

- `kumo init` - Initialize kumo.json configuration file
- `kumo blocks` - List all available blocks for CLI installation
- `kumo add <block-name>` - Install a block to your project with transformed imports

**Migration Guide:**

If you were previously using blocks (note: they were never officially exported), you must now:

1. Initialize Kumo configuration:

   ```bash
   npx @cloudflare/kumo init
   ```

2. Install blocks via CLI:

   ```bash
   npx @cloudflare/kumo add PageHeader
   npx @cloudflare/kumo add ResourceListPage
   ```

3. Import from the local installation path (shown after installation)

**Why this change?**

Blocks are composite components that copy source code into your project, allowing you to customize them. This is fundamentally different from npm-distributed components, which are imported as dependencies. The CLI approach provides:

- Full ownership: Blocks are copied to your project for customization
- Import transformation: Relative imports are automatically converted to `@cloudflare/kumo`
- Dependency visibility: See exactly which Kumo components each block uses
- No bundle bloat: Only install the blocks you need
