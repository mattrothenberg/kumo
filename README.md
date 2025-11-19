# Kumo

Kumo is Cloudflare's component library for building modern web applications. It gives you a set of ready-to-use components that work well together and handle the details you'd otherwise have to build yourself.

## What you get

The library includes buttons, inputs, dialogs, menus, and other common interface elements. Each component handles keyboard navigation, focus management, and ARIA attributes. This means you can build accessible applications without thinking through every detail.

Kumo is built on [Base UI](https://base-ui.com/). Meaning we get a lot of primitives and niceties for free.

## Workspace Structure

This repository uses **pnpm workspaces** for monorepo management:

```
kumo/
├── packages/
│   ├── kumo/                      # Component library package (future)
│   └── kumo-docs/                 # Documentation site
│       ├── app/                   # React Router application
│       ├── workers/               # Cloudflare Workers
│       ├── public/                # Static assets
│       └── package.json
├── _docs/                         # Migration documentation
├── pnpm-workspace.yaml
└── package.json                   # Workspace root
```

## Getting started

### Prerequisites

Install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

### Installation

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Your application runs at `http://localhost:5173`.

### Working with Workspaces

```bash
# Install dependencies for all packages
pnpm install

# Run commands in all packages
pnpm -r build

# Run command in specific package
pnpm --filter @cloudflare/kumo build
pnpm --filter @cloudflare/kumo-docs dev

# Add dependency to specific package
pnpm --filter @cloudflare/kumo add react

# List all workspace packages
pnpm -r list --depth 0
```

## Development Workflows

The monorepo contains two packages with different development characteristics:

### Package Overview

**@cloudflare/kumo** (`packages/kumo/`)
- Component library built with Vite in library mode
- Watch mode rebuilds on changes (not full HMR)
- Outputs to `dist/` for consumption by docs site

**@cloudflare/kumo-docs** (`packages/kumo-docs/`)
- Documentation site built with React Router + Vite
- Full HMR with React Fast Refresh
- Runs at `http://localhost:5173`

### Running in Development

**Option 1: Documentation Only**

If you're only working on the docs site:

```bash
pnpm dev
```

This starts the docs site with full HMR enabled.

**Option 2: Full Development (Both Packages)**

To develop both packages simultaneously with live updates:

```bash
# Terminal 1 - Watch library changes
pnpm --filter @cloudflare/kumo dev

# Terminal 2 - Run documentation site
pnpm --filter @cloudflare/kumo-docs dev
```

The library rebuilds automatically when you edit components, and the docs site detects the changes and reloads.

### Understanding HMR

**Documentation Site:**
- ✅ Full HMR with React Fast Refresh
- ✅ Changes reflect instantly without page reload
- ✅ Component state preserved during updates

**Component Library:**
- ⚠️ Watch mode (auto-rebuild on changes)
- ⚠️ Requires docs site refresh to see updates
- ⚠️ Not true HMR due to library build mode

### Development Scenarios

**Working on Components:**
1. Run both terminals (library watch + docs dev)
2. Edit components in `packages/kumo/src/components/`
3. Library rebuilds automatically
4. Docs site refreshes to show changes

**Working on Documentation:**
1. Run docs only: `pnpm dev`
2. Edit files in `packages/kumo-docs/app/`
3. See instant HMR updates

**Testing Components:**
1. Run tests: `pnpm --filter @cloudflare/kumo test`
2. Edit components and see live test results

**Developing with Storybook:**
1. Run Storybook: `pnpm --filter @cloudflare/kumo storybook`
2. Build components in isolation at `http://localhost:6006`
3. See instant HMR updates for component changes
4. See [packages/kumo/STORYBOOK.md](./packages/kumo/STORYBOOK.md) for details

## Creating New Components

Use the scaffolding tool to quickly create new components in the library:

```bash
# From workspace root
pnpm --filter @cloudflare/kumo new-component

# Or use shorthand
pnpm --filter @cloudflare/kumo new
```

**What it does:**
- Creates component, index, and test files in `packages/kumo/src/components/{name}/`
- Updates `src/index.ts` with component export
- Updates `vite.config.ts` with build entry
- Updates `package.json` with export configuration
- Handles naming automatically (converts any format to proper casing)

**Example:**
```bash
? Component name: Alert Banner

✅ Component scaffolded successfully!

📁 Files created:
   - src/components/alert-banner/alert-banner.tsx
   - src/components/alert-banner/index.ts
   - src/components/alert-banner/alert-banner.test.tsx

💡 Import examples:
   import { AlertBanner } from "@cloudflare/kumo";
   import { AlertBanner } from "@cloudflare/kumo/components/alert-banner";
```

**Next steps:**
1. Implement your component in the generated `.tsx` file
2. Write tests in the generated `.test.tsx` file
3. Run tests: `pnpm --filter @cloudflare/kumo test`
4. Build: `pnpm --filter @cloudflare/kumo build`

The test suite will automatically validate that your component is properly configured for both import patterns.

## Building and deploying

Create a production build:

```bash
pnpm build
```

Deploy to production:

```bash
pnpm deploy
```

Deploy a preview version:

```bash
npx wrangler versions upload
```

After you verify the preview works, promote it to production:

```bash
npx wrangler versions deploy
```

## Accessibility

The components follow WAI-ARIA guidelines and work with keyboard navigation. They manage focus automatically and include the right ARIA attributes. You still need to style focus states and check color contrast, but the structural work is done.

## Styling

The library uses Tailwind CSS.

## Releases

Kumo uses [Changesets](https://github.com/changesets/changesets) for version management with automated beta and production releases.

### Beta Releases

Beta releases are automatically published for merge requests, allowing you to test changes before merging to production.

**How it works:**
1. Create a changeset for your changes: `pnpm changeset`
2. Open a merge request
3. CI automatically validates changeset exists
4. CI publishes beta version with format: `{version}-beta.{commit-hash}`
5. MR receives comment with installation instructions

**Installing beta versions:**
```bash
npm install @cloudflare/kumo@0.1.0-beta.a1b2c3d
# or
pnpm add @cloudflare/kumo@0.1.0-beta.a1b2c3d
```

### Production Releases

To publish a production release:

```bash
# 1. Ensure you're on main with latest changes
git checkout main && git pull

# 2. Version packages (consumes changesets)
pnpm version

# 3. Build all packages
pnpm build:all

# 4. Publish to npm
pnpm release

# 5. Commit and push version changes
git add .
git commit -m "chore: release @cloudflare/kumo@{version}"
git push --follow-tags
```

### Creating Changesets

When making changes to the library:

```bash
pnpm changeset
```

- Select `@cloudflare/kumo` from the list
- Choose change type:
  - **Patch** (`0.0.1`): Bug fixes, small updates
  - **Minor** (`0.1.0`): New components, backwards-compatible features
  - **Major** (`1.0.0`): Breaking changes, removed components
- Write a clear description

The changeset will be consumed during the next release and added to the changelog.

### Release Workflow

1. **Development**: Make changes to components
2. **Changeset**: Create changeset describing changes
3. **Review**: Submit MR with changes and changeset
4. **Beta Test**: Test the auto-published beta version
5. **Merge**: Merge MR to main
6. **Release**: Run production release process

For detailed documentation, see [`packages/kumo/README.md`](./packages/kumo/README.md).
