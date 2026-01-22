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
│   ├── kumo/                      # Component library package
│   │   ├── src/                   # Component source code
│   │   ├── dist/                  # Build output
│   │   ├── .storybook/            # Storybook configuration
│   │   └── package.json
│   ├── kumo-docs-astro/           # Documentation site (Astro)
│   │   ├── src/                   # Astro pages and components
│   │   ├── dist/                  # Build output
│   │   └── package.json
│   └── figma/                     # Figma plugin package
│       └── package.json
├── ci/                            # CI/CD scripts and versioning
├── pnpm-workspace.yaml
└── package.json                   # Workspace root
```

## Getting started

### Prerequisites

Install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

### Git Hooks

This repository uses [Lefthook](https://github.com/evilmartians/lefthook) to enforce changeset validation before pushing. Hooks are automatically installed when you run `pnpm install`.

**What the pre-push hook does:**

- Validates that changes to `packages/kumo/` include a changeset
- Prevents pushing without proper version documentation
- Provides clear instructions if validation fails

**Skip mechanisms:**

```bash
# Skip all hooks
git push --no-verify

# Skip specific hook
LEFTHOOK_EXCLUDE=validate-changeset git push

# Disable lefthook entirely
LEFTHOOK=0 git push
```

**Troubleshooting:**

If you're using a Git GUI client (Tower, SourceTree, GitKraken, VS Code) and hooks aren't working:

1. **PATH issues**: GUI clients may not inherit your shell's PATH. Configure PATH in your client's settings to include:
   - `/Users/{username}/Library/pnpm` (or wherever `pnpm` is installed)
   - `/opt/homebrew/bin` or `/usr/local/bin`

2. **Missing origin/main**: If you get an error about missing `origin/main`, fetch it:

   ```bash
   git fetch origin main
   ```

3. **Manual hook installation**: If hooks didn't install automatically:
   ```bash
   pnpm lefthook install
   ```

### NPM Registry Configuration

Follow the steps at [Getting started with the private NPM registry](https://wiki.cfdata.org/display/FE/Getting+started+with+the+private+NPM+registry) to configure your `NPM_TOKEN`.

To install `@cloudflare` scoped packages, you need to configure NPM to use the Cloudflare private registry. Add the following to either your user-level NPM configuration (`~/.npmrc`) or your consuming project's `.npmrc`:

```
# Cloudflare registry configuration
@cloudflare:registry=https://registry-gateway.cloudflare-ui.workers.dev
//registry-gateway.cloudflare-ui.workers.dev/:_authToken="${NPM_TOKEN}"
```

### Installation

Install the dependencies:

```bash
pnpm install
```

Build the component library (required first time):

```bash
pnpm --filter @cloudflare/kumo build
```

Start the development server:

```bash
pnpm dev
```

Your application runs at `http://localhost:5173`.

**Note:** The docs site requires the component library to be built at least once. After that, you can use the watch build for development (see [Development Scenarios](#development-scenarios) below).

## CLI Tools

Kumo provides a CLI for accessing component documentation and scaffolding templates directly from Storybook.

### Component Registry

Query component documentation from the command line:

```bash
# List all components with categories
npx @cloudflare/kumo ls

# Get detailed documentation for a specific component
npx @cloudflare/kumo doc Button

# Get documentation for all components
npx @cloudflare/kumo docs
```

The component registry is automatically generated from Kumo's source code and includes props, variants, examples, and usage patterns.

### Template System

Scaffold pages and layouts from Kumo Storybook examples. Templates are copied as source code that you own and customize, similar to shadcn/ui.

```bash
# List available templates
npx @cloudflare/kumo templates

# List templates by category
npx @cloudflare/kumo templates layouts
npx @cloudflare/kumo templates pages

# Add a template to your project
npx @cloudflare/kumo add layouts/centered-page-layout
npx @cloudflare/kumo add pages/active-sessions
```

**Why templates?**

- 🚀 **Rapid scaffolding** - Start new pages in seconds
- 🎨 **Design consistency** - All templates use Kumo's design system
- 📝 **Full ownership** - Code is copied, not installed as a dependency
- 🤖 **AI training data** - Storybook pages serve as reference implementations
- 🔄 **Battle-tested** - Templates come from production Storybook implementations

#### Available Templates

**Layouts:**

- `layouts/centered-page-layout` - Single-column centered layout with header and LayerCards

**Pages:**

- `pages/active-sessions` - Complete device/session management page with mock data

#### Using Templates

```bash
# 1. Browse available templates
npx @cloudflare/kumo templates

# 2. Add a template
npx @cloudflare/kumo add pages/active-sessions

# 3. Files are copied to your project
# ✓ src/pages/active-sessions/active-sessions.tsx
# ✓ src/pages/active-sessions/active-sessions-mocks.ts

# 4. Install dependencies (if needed)
pnpm add @cloudflare/kumo @phosphor-icons/react

# 5. Customize the template
# - Replace mock data with real API calls
# - Modify styling and behavior
# - Remove unused features
```

#### Templates vs Components

**Kumo Components** (npm package):

- Installed as dependencies
- Centrally maintained and updated
- Stable APIs
- Use for: buttons, inputs, cards, common patterns

**Kumo Templates** (copy-paste code):

- Copied as source code you own
- Full customization freedom
- No version lock-in
- Use for: complete pages, complex workflows, rapid prototyping

**Best practice:** Use both! Start with a template for page structure, then use Kumo components within it.

#### The Storybook → Production Workflow

Templates enable a powerful development workflow:

1. **Build in Storybook** - Create pages in isolation with mock data
2. **Test & Refine** - Iterate quickly without app dependencies
3. **Export as Template** - Make it available for reuse
4. **Import to Production** - `npx @cloudflare/kumo add pages/my-page`
5. **Connect & Ship** - Wire up real APIs and deploy

This workflow provides:

- ⚡ Faster iteration (no app rebuilds)
- 🎯 Focused development (no distractions)
- 📚 Living documentation (Storybook stays current)
- 🤖 AI training data (examples for coding agents)

### Working with Workspaces

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build:all

# Run command in specific package
pnpm --filter @cloudflare/kumo build
pnpm --filter @cloudflare/kumo-docs-astro dev

# Add dependency to specific package
pnpm --filter @cloudflare/kumo add react

```

## Development Workflows

The monorepo contains two packages with different development characteristics:

### Package Overview

**@cloudflare/kumo** (`packages/kumo/`)

- Component library built with Vite in library mode
- Watch mode rebuilds on changes (not full HMR)
- Outputs to `dist/` for consumption by docs site
- Includes Storybook for component development

**@cloudflare/kumo-docs-astro** (`packages/kumo-docs-astro/`)

- Documentation site built with Astro
- Full HMR with fast refresh
- Runs at `http://localhost:4321`

### Running the Documentation Site

Start the kumo-docs-astro development server:

```bash
# From workspace root
pnpm dev

# Or target the specific package
pnpm --filter @cloudflare/kumo-docs-astro dev
```

The documentation site runs at `http://localhost:4321`.

### Running Storybook

Start the Storybook development server for component development:

```bash
# From workspace root
pnpm storybook

# Or target the specific package
pnpm --filter @cloudflare/kumo storybook
```

Storybook runs at `http://localhost:6006` and provides:

- Component development in isolation
- Full HMR for instant updates
- Interactive component testing
- Documentation of component props and variants

See [packages/kumo/STORYBOOK.md](./packages/kumo/STORYBOOK.md) for more details.

### Development Scenarios

#### Isolated Component Development (Recommended)

**Using Storybook:**

```bash
pnpm --filter @cloudflare/kumo storybook
```

- ✅ Full HMR with React Fast Refresh
- ✅ Changes reflect instantly without page reload
- ✅ Best for isolated component development and testing
- ✅ Interactive component playground

#### Working on Components and Documentation Simultaneously

When you need to test components in the actual documentation site:

**Terminal 1: Start kumo watch build**

```bash
cd packages/kumo
pnpm dev
```

**Terminal 2: Start kumo-docs-astro dev server**

```bash
cd packages/kumo-docs-astro
pnpm dev
```

**Workflow:**

1. Edit a component in `packages/kumo/src/components/`
2. Kumo automatically rebuilds (~400ms with optimizations)
3. Manually refresh browser to see changes in docs site
4. Changes are validated against production build output

**Build Optimizations:**

- Development builds skip minification for faster rebuilds
- Incremental TypeScript compilation caches type information
- Selective file watching ignores test and story files
- Production builds remain fully optimized

#### Documentation Changes Only

For docs-only work (no component changes needed):

```bash
pnpm dev
```

- ✅ Full HMR with fast refresh
- ✅ Changes reflect instantly without page reload
- ✅ Runs at `http://localhost:4321`

#### Testing Components

Run tests in watch mode while developing:

```bash
cd packages/kumo
pnpm test
```

- Live test results as you edit
- Coverage tracking available with `pnpm test:coverage`
- UI mode available with `pnpm test:ui`

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

> **Note:** For detailed CI/CD documentation including staging deployments, beta releases, and MR reporter system, see [`ci/README.md`](./ci/README.md).

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

**CI Pipeline:**
The beta release process is automated through the `version-and-publish-beta` job in `.gitlab-ci.yml`:

- **Stage**: `beta-release` (runs after checks/tests pass)
- **Triggers**: Automatically on merge requests with changes to `packages/kumo/**/*`
- **Dependencies**: Requires `validate-changeset-run` job to pass
- **Process**:
  1. Validates changeset exists
  2. Runs `pnpm run version:beta` to append `-beta.{commit-hash}` to version
  3. Builds the package (`pnpm run build`)
  4. Publishes to npm with `beta` tag (`pnpm run release:beta`)
  5. Verifies publication succeeded (45s propagation wait)
  6. Posts MR comment with installation instructions

**How it works:**

1. Create a changeset for your changes: `pnpm changeset`
2. Open a merge request with changes to `packages/kumo/`
3. CI automatically validates changeset exists (`validate-changeset-run` job)
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

### Troubleshooting Beta Releases

**Beta job not appearing in MR pipeline:**

1. **Check file changes**: The job only triggers when files in `packages/kumo/**/*` are modified
2. **Verify changeset exists**: Run `ls .changeset/*.md` to confirm a changeset is present
3. **Check pipeline rules**: The job requires `$CI_MERGE_REQUEST_IID` to be set (only runs on MRs, not branches)
4. **Review dependencies**: Ensure the `validate-changeset-run` job is present and passing
5. **Check GitLab CI logs**: Review pipeline configuration and rule evaluation

**Beta job failed:**

- Check that `jq` is installed in the CI environment
- Verify npm token secrets are configured in Vault
- Ensure git is properly configured with user email/name
- Review build logs for package build failures

For detailed documentation, see [`packages/kumo/README.md`](./packages/kumo/README.md).
