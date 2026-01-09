# Kumo Documentation Site (Astro)

This package contains the official documentation and showcase site for **Kumo** — Cloudflare's component library built on Base UI. This Astro-based implementation provides static site generation with optimal performance and will replace the existing React Router 7 implementation.

## About Kumo

**Kumo** (雲, "cloud" in Japanese) is Cloudflare's React component library built on [Base UI](https://base-ui.com/). It provides:

- **Accessible Components** - Built on Base UI primitives with full ARIA support
- **Semantic Token System** - Automatic dark mode via `light-dark()` CSS
- **Theme Support** - Including FedRAMP compliance theme
- **Type-Safe** - Full TypeScript support with exported types
- **Tree-Shakeable** - Optimized bundle size with individual imports

**Repository:** This documentation site lives in the Kumo monorepo at `packages/kumo-docs-astro` and depends on the component library at `packages/kumo`.

## Migration from kumo-docs

> **⚠️ Migration in Progress**: This Astro-based site will replace `packages/kumo-docs` (React Router 7) as the official documentation site.

**Why migrate to Astro?**

- **Static Generation** - Pre-rendered HTML for optimal performance and SEO
- **Zero Runtime** - Minimal JavaScript, only interactive islands hydrate
- **Faster Builds** - Build time: ~6s for 28 pages
- **Simpler Deployment** - Static files

**For Contributors:**

- **New documentation**: Add to `packages/kumo-docs-astro`
- **Bug fixes**: Fix in both implementations during migration
- **Questions**: See "Differences from kumo-docs" section below

## Development

### Documentation Changes Only

If you're only working on documentation content (no component library changes):

```bash
# From this directory
pnpm dev

# Or from workspace root
pnpm --filter @cloudflare/kumo-docs-astro dev
```

The site runs at `http://localhost:4321` with full HMR support. Changes to documentation files will reflect instantly.

### Testing Component Changes

When you need to see component library changes in the documentation site:

**Terminal 1: Start kumo watch build**

```bash
cd ../kumo
pnpm dev
```

**Terminal 2: Start docs dev server**

```bash
# From this directory
pnpm dev
```

**Workflow:**

1. Edit components in `../kumo/src/`
2. Kumo rebuilds automatically (~400ms)
3. Manually refresh browser to see changes
4. Component changes are validated against the actual build output

This workflow ensures you're testing against the real production build of the component library, catching any build configuration or export issues.

## Building

Build the site for production:

```bash
# From this directory
pnpm build

# Or from workspace root
pnpm --filter @cloudflare/kumo-docs-astro build
```

This creates an optimized static build in the `dist/` directory (28 pages in ~6s), ready for deployment to Cloudflare Pages or any static hosting service.

**Note:** Production builds use the compiled `@cloudflare/kumo` package from `../kumo/dist/`. Ensure kumo is built before building docs:

```bash
# From workspace root
pnpm build:all
```

## Preview

Preview the production build locally:

```bash
# From this directory
pnpm preview

# Or from workspace root
pnpm --filter @cloudflare/kumo-docs-astro preview
```

This serves the built site from `dist/` at `http://localhost:4321`.

## Deployment

Deploy to Cloudflare Pages or any static hosting service. The build output is in the `dist/` directory.

### Cloudflare Pages

**Recommended settings:**

- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 18+
- Root directory: `packages/kumo-docs-astro`

**Important:** Cloudflare Pages builds from the monorepo root, so ensure the build command includes workspace context:

```bash
pnpm --filter @cloudflare/kumo-docs-astro build
```

The build process will:

1. Build `@cloudflare/kumo` component library
2. Build `@cloudflare/kumo-docs-astro` using the built components
3. Output static files to `dist/`

### Other Static Hosts

The `dist/` directory contains a standard static site that works with:

- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Any static file server

## Structure

```
kumo-docs-astro/
├── src/
│   ├── components/           # Site-specific components
│   │   ├── demos/           # Interactive component demos
│   │   ├── docs/            # Documentation components
│   │   └── SidebarNav.tsx   # Navigation sidebar
│   ├── layouts/             # Page layouts
│   │   ├── BaseLayout.astro # HTML base with theme init
│   │   ├── MainLayout.astro # Main layout with sidebar
│   │   └── DocLayout.astro  # Documentation page layout
│   ├── pages/               # Page routes (file-based routing)
│   │   ├── index.astro      # Home page
│   │   ├── components/      # Component documentation pages
│   │   ├── blocks/          # Block documentation pages
│   │   └── layouts/         # Layout documentation pages
│   └── styles/              # Global styles
├── public/                  # Static assets
├── astro.config.mjs        # Astro configuration
└── package.json
```

## Key Features

- **Astro v5** - Modern static site generator with islands architecture
- **React Integration** - Interactive components using islands (`client:load`, `client:visible`)
- **Tailwind CSS 4** - Styling via `@tailwindcss/vite`
- **Dual Theme Code Blocks** - Shiki with `github-light` (light mode) and `vesper` (dark mode)
- **Pure CSS Sidebar** - Uses `:has()` selector for responsive layout without JavaScript
- **Static Output** - Zero-config deployment to any static host
- **Sticky Headers** - IntersectionObserver-based sticky page titles on scroll
- **Semantic Tokens** - 100% Kumo semantic token usage (no raw Tailwind colors)

## Workspace Dependencies

This package depends on **`@cloudflare/kumo`** (the component library) via pnpm workspace protocol:

```json
{
  "dependencies": {
    "@cloudflare/kumo": "workspace:*"
  }
}
```

**What this means:**

- **Development**: Uses live `../kumo/dist/` build for instant feedback
- **Production**: Uses published `@cloudflare/kumo` npm package version
- **Versioning**: Automatically uses the workspace version during local development
- **Type Safety**: Full TypeScript support via workspace type declarations

**Component Library Location:** `packages/kumo/`

The component library (`@cloudflare/kumo`) must be built before building the docs site. Use `pnpm build:all` from the workspace root to build both in correct order.

## Key Dependencies

- **@cloudflare/kumo** - Component library (workspace dependency, required)
- **Astro 5** - Static site generator
- **React 18** - For interactive islands
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **@phosphor-icons/react** - Icon library
- **Shiki** - Syntax highlighting (via Astro)

## Pages

The site includes 28 documentation pages:

**Static Pages:**

- Home
- Installation
- Contributing
- Accessibility
- Figma Resources

**Components (19):**

- Text, Button, Input, Select, Combobox, Switch
- Dialog, Tooltip, Dropdown, Collapsible, Checkbox
- Badge, Banner, Code, Surface, SkeletonLine
- SensitiveInput, LayerCard, Loader

**Blocks (3):**

- Breadcrumbs, Empty State, Page Header

**Layouts (1):**

- Resource List

## Architecture Decisions

### Islands Architecture

React components are hydrated selectively using Astro's client directives:

- `client:load` - Immediate hydration (Dialog, Collapsible, StickyDocHeader)
- `client:visible` - Lazy hydration when scrolled into view (most demos)
- `client:only="react"` - Client-side only (HomeGrid with random skeleton widths)

### Theme System

The site uses Kumo's semantic token system:

- Theme managed via `data-mode` attribute on `<html>` element
- Stored in `localStorage` with system preference fallback
- Inline blocking script prevents flash of unstyled content
- All colors use semantic tokens (no `dark:` variants in classNames)

### Sidebar State

Pure CSS implementation using `:has()` selector:

- Sidebar state tracked via `data-sidebar-open` attribute
- Main content margin adjusts automatically via CSS
- No JavaScript state management needed for layout

### Code Highlighting

Astro's built-in `<Code />` component with Shiki:

- Dual themes: `github-light` and `vesper`
- Theme switching via `[data-mode="dark"]` CSS selector
- Syntax highlighting for TSX, TypeScript, JavaScript, Bash, CSS

## Troubleshooting

### Components Not Updating

If component changes aren't reflecting:

1. Ensure kumo watch build is running (`cd ../kumo && pnpm dev`)
2. Check that kumo rebuild completed (watch Terminal 1 for "✓ built in [time]ms")
3. Manually refresh the browser
4. If still not working, restart both dev servers

### Type Errors

If you see TypeScript errors related to kumo:

1. Ensure kumo is built: `cd ../kumo && pnpm build`
2. Restart TypeScript server in your IDE
3. Run `pnpm typecheck` to verify (when typecheck script is added)

### Build Failures

If the build fails:

1. Ensure kumo is built: `cd ../kumo && pnpm build`
2. Clear build cache: `rm -rf dist .astro`
3. Try building again: `pnpm build`

### Hydration Errors

If you see hydration mismatch errors:

1. Check if component uses random values during SSR (use `client:only` if needed)
2. Ensure component state is properly initialized
3. Verify controlled components have both `value` and `onChange` props

## Migration Guide: kumo-docs → kumo-docs-astro

### Key Differences

| Feature        | kumo-docs (RR7)    | kumo-docs-astro (Astro)   |
| -------------- | ------------------ | ------------------------- |
| **Rendering**  | SSR (Server-Side)  | SSG (Static Generation)   |
| **Framework**  | React Router 7     | Astro 5                   |
| **Deployment** | Cloudflare Workers | Cloudflare Pages / Static |
| **Hydration**  | Full React app     | Islands (selective)       |
| **Build Time** | ~3s                | ~6s (28 pages)            |
| **Output**     | Server bundle      | Static HTML               |
| **Routing**    | React Router       | File-based                |
| **Runtime**    | Node.js on Workers | None (static)             |

### What's the Same

Both implementations share:

- ✅ Same component library (`@cloudflare/kumo` workspace dependency)
- ✅ Same semantic token system (100% Kumo tokens)
- ✅ Same visual design and UX
- ✅ Same documentation content (28 pages)
- ✅ Same Tailwind CSS 4 styling
- ✅ Same dual-theme code blocks

### Migration Checklist for Contributors

If you're migrating content from kumo-docs:

- [ ] Copy page content from `packages/kumo-docs/app/routes/` to `packages/kumo-docs-astro/src/pages/`
- [ ] Convert `.tsx` files to `.astro` files (mostly copy/paste with minor syntax changes)
- [ ] Update component imports: React components need `client:load` or `client:visible` directives
- [ ] Replace any remaining `dark:` variants with semantic tokens
- [ ] Replace raw Tailwind colors with Kumo semantic tokens
- [ ] Test interactive components work (Dialog, Collapsible need controlled state)
- [ ] Verify page builds: `pnpm build`

### When to Use Which?

**Use kumo-docs-astro (this package):**

- ✅ Production documentation site (after migration)
- ✅ Static deployments
- ✅ Optimal performance needs
- ✅ New documentation pages

**Use kumo-docs (legacy):**

- ⚠️ During migration period only
- ⚠️ Will be deprecated after migration completes

### Need Help?

- **Issues with component library**: Check `packages/kumo/`
- **Documentation bugs**: Fix in `packages/kumo-docs-astro/`
- **Migration questions**: See troubleshooting section or workspace maintainers
