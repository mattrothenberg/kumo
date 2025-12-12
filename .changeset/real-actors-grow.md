---
"@cloudflare/kumo": minor
---

Bundle Base UI primitives with granular exports and fix critical compatibility issues

## Primitives: Granular Exports

Added granular exports for all 37 Base UI primitives alongside the existing barrel export. This enables better tree-shaking and smaller bundle sizes when using individual primitives.

```tsx
// Barrel export (imports all primitives)
import { Slider, Popover, Tooltip } from '@cloudflare/kumo/primitives';

// Granular exports (tree-shakeable, recommended)
import { Slider } from '@cloudflare/kumo/primitives/slider';
import { Popover } from '@cloudflare/kumo/primitives/popover';
```

**Available primitives:** accordion, alert-dialog, autocomplete, avatar, button, checkbox, checkbox-group, collapsible, combobox, context-menu, dialog, direction-provider, field, fieldset, form, input, menu, menubar, meter, navigation-menu, number-field, popover, preview-card, progress, radio, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, toggle-group, toolbar, tooltip.

## Build Output Improvements

Fixed critical compatibility issues with Jest and React Server Components by improving the build configuration.

### Problems Fixed

1. **Jest Parsing Errors** - The previous build used `preserveModules: true`, which preserved the pnpm directory structure (`node_modules/.pnpm/`) in dist. This caused Jest to fail parsing ESM imports because Jest's `transformIgnorePatterns` blocks nested `node_modules` by default.

2. **Missing "use client" Directives** - The `rollup-plugin-preserve-directives` plugin only works with `preserveModules: true`. When bundling with `preserveModules: false`, all "use client" directives were stripped, breaking components in Next.js App Router (RSC).

### Solutions Implemented

- **Flat bundle structure** - Changed to `preserveModules: false` to eliminate nested `node_modules/.pnpm/` paths
- **"use client" injection** - Added `output.banner` to inject the directive into all output chunks (since the plugin doesn't work without preserveModules)
- **Manual code splitting** - Implemented `manualChunks` to split large vendor dependencies for better caching:
  - `vendor-base-ui` (598 KB, 152 KB gzipped) - Base UI components
  - `vendor-styling` (74 KB, 13 KB gzipped) - clsx + tailwind-merge
  - `vendor-floating-ui` (33 KB, 10 KB gzipped) - Floating UI positioning
  - `vendor-utils` (24 KB, 7 KB gzipped) - tabbable, reselect, etc.
