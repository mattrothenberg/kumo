---
"@cloudflare/kumo": minor
---

Migrate to @base-ui/react V1

**Breaking Change:** Updated from `@base-ui-components/react` to the new `@base-ui/react` V1 package.

## What Changed

- **Package name:** `@base-ui-components/react` → `@base-ui/react`
- **Version:** `^1.0.0-rc.0` > `^1.0.0`
- All component imports updated to use the new package
- All primitive re-exports updated to use the new package
- Build configuration updated to bundle the new package

## Migration Required

This is a **major version bump** because the underlying Base UI package has changed. While the Kumo API remains the same, you'll need to:

1. **Update dependencies:**
   ```bash
   pnpm install
   ```

2. **No code changes needed** - All Kumo components and primitives work exactly the same way. The package name change is internal to Kumo.

## For Kumo Maintainers

After merging this PR, run:

```bash
# Install the new @base-ui/react package
pnpm install

# Regenerate primitive files with new package references
pnpm --filter @cloudflare/kumo build:primitives

# Rebuild the package
pnpm --filter @cloudflare/kumo build

# Run tests to verify everything works
pnpm --filter @cloudflare/kumo test:run
```

## Technical Details

- Updated all imports from `@base-ui-components/react/*` to `@base-ui/react/*`
- Updated `generate-primitives.ts` script to reference new package
- Updated test files to check for new package name
- Updated `vite.config.ts` manualChunks to match new package name
- All 37 primitives will be regenerated with new imports
