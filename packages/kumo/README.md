# @cloudflare/kumo

Cloudflare's component library for building modern web applications.

## Development

### Creating New Components

Use the scaffolding tool to quickly create new components with all required files and configurations:

```bash
# Create a new component
pnpm new-component

# Or use the shorthand
pnpm new
```

**What it creates:**
- Component file: `src/components/{name}/{name}.tsx`
- Index file: `src/components/{name}/index.ts`
- Test file: `src/components/{name}/{name}.test.tsx`

**What it updates:**
- `src/index.ts` - Adds component export
- `vite.config.ts` - Adds build entry
- `package.json` - Adds export configuration

**Example:**
```bash
? Component name: Alert Banner

✅ Component scaffolded successfully!

📁 Files created:
   - src/components/alert-banner/alert-banner.tsx
   - src/components/alert-banner/index.ts
   - src/components/alert-banner/alert-banner.test.tsx
```

The scaffolding tool handles naming automatically - input any format (spaces, PascalCase, kebab-case) and it will convert appropriately.

### Creating New Blocks

Blocks are higher-level components that compose multiple base components to create common page patterns. Use the block scaffolding tool:

```bash
# Create a new block
pnpm new-block
```

**What it creates:**
- Block file: `src/blocks/{name}/{name}.tsx`
- Index file: `src/blocks/{name}/index.ts`
- Test file: `src/blocks/{name}/{name}.test.tsx`

**What it updates:**
- `src/index.ts` - Adds block export
- `vite.config.ts` - Adds build entry
- `package.json` - Adds export configuration

See [BLOCKS.md](./BLOCKS.md) for detailed documentation on blocks, including when to create them and best practices.

### Creating New Layouts

Layouts are page-level components that provide consistent structure for common page patterns like resource lists, dashboards, and settings. Use the layout scaffolding tool:

```bash
# Create a new layout
pnpm new-layout
```

**What it creates:**
- Layout file: `src/layouts/{name}/{name}.tsx`
- Index file: `src/layouts/{name}/index.ts`
- Test file: `src/layouts/{name}/{name}.test.tsx`

**What it updates:**
- `src/index.ts` - Adds layout export
- `vite.config.ts` - Adds build entry
- `package.json` - Adds export configuration

**Example:**
```bash
? Layout name: Dashboard Page

✅ Layout scaffolded successfully!

📁 Files created:
   - src/layouts/dashboard-page/dashboard-page.tsx
   - src/layouts/dashboard-page/index.ts
   - src/layouts/dashboard-page/dashboard-page.test.tsx

💡 Import examples:
   import { DashboardPage } from "@cloudflare/kumo";
   import { DashboardPage } from "@cloudflare/kumo/layouts/dashboard-page";
```

### Storybook Development

Kumo uses **Storybook** as a live development environment for building and testing components in isolation. Storybook provides instant feedback, interactive controls, and serves as living documentation for the component library.

**Start Storybook:**
```bash
# From workspace root
pnpm --filter @cloudflare/kumo storybook

# Or use shorthand
pnpm --filter @cloudflare/kumo storybook
```

Storybook runs at `http://localhost:6006` with hot module replacement enabled.

**Build static Storybook:**
```bash
pnpm --filter @cloudflare/kumo build-storybook
```

**Why use Storybook:**
- Build components without running the full app
- Test all variations and edge cases interactively
- Auto-generated docs from TypeScript types
- Develop components in isolation with instant HMR
- Shared tool for designers and developers
- Test keyboard navigation and screen readers

**Story files** live alongside components:
- Components: `src/components/{name}/{name}.stories.tsx`
- Blocks: `src/blocks/{name}/{name}.stories.tsx`
- Layouts: `src/layouts/{name}/{name}.stories.tsx`


**See [STORYBOOK.md](./STORYBOOK.md) for documentation** including:
- Writing stories guide
- Development workflow
- Best practices

### Testing

The package includes comprehensive import validation tests that ensure all components are properly exported and consumable.

**Run tests:**
```bash
# Watch mode
pnpm test

# Single run
pnpm test:run

# With UI
pnpm test:ui

# With coverage
pnpm test:coverage
```

**What's tested:**
- ✅ All components importable from main entry: `import { Component } from "@cloudflare/kumo"`
- ✅ All components importable via deep imports: `import { Component } from "@cloudflare/kumo/components/component-name"`
- ✅ All blocks importable from main entry: `import { Block } from "@cloudflare/kumo"`
- ✅ All blocks importable via deep imports: `import { Block } from "@cloudflare/kumo/blocks/block-name"`
- ✅ All layouts importable from main entry: `import { Layout } from "@cloudflare/kumo"`
- ✅ All layouts importable via deep imports: `import { Layout } from "@cloudflare/kumo/layouts/layout-name"`
- ✅ Package.json exports sync with actual components, blocks, and layouts
- ✅ Export paths and formats are correct
- ✅ Build configuration consistency

**Zero maintenance:** Tests automatically discover components, blocks, and layouts from the filesystem and validate against package.json. When adding new items, tests will fail with exact code snippets to fix configuration.

## Beta Releases

Beta releases allow you to test changes before publishing to production. Beta versions are automatically created for merge requests and include the commit hash for identification.

### Automated Beta Releases

Beta releases are automatically triggered for merge requests:

- **Job**: `version-and-publish-beta`
- **Trigger**: Automatically runs on merge requests with changes to `packages/kumo/**/*`
- **Process**:
  1. Validates that a changeset exists for `@cloudflare/kumo`
  2. Consumes pending changesets
  3. Appends `-beta.{commit-hash}` to version number
  4. Builds the package
  5. Publishes to npm registry with `beta` tag
  6. Verifies successful publication
  7. Posts MR comment with installation instructions

### Beta Version Format

Beta versions follow this pattern:
```
{base-version}-beta.{commit-hash}
```

For example: `0.1.0-beta.a1b2c3d`

### Installing Beta Versions

When a beta is published, the MR will include a comment with installation instructions:

```bash
# Install the specific beta version
npm install @cloudflare/kumo@0.1.0-beta.a1b2c3d

# Or with pnpm
pnpm add @cloudflare/kumo@0.1.0-beta.a1b2c3d
```

### Testing Beta Releases

1. **Create MR**: Submit your changes with a changeset
2. **Wait for Beta**: The beta job runs automatically after changeset validation passes
3. **Install Beta**: Use the version from the MR comment
4. **Test Changes**: Verify functionality in your project
5. **Merge**: Once tested, merge the MR for production release

### Changeset Validation

All merge requests with changes to `packages/kumo/` must include a changeset:

```bash
# Create a changeset
pnpm changeset
```

- Select `@cloudflare/kumo` when prompted
- Choose the type of change: `patch`, `minor`, or `major`
- Write a clear description of what changed

The CI will automatically validate that a changeset exists before allowing beta publication.

## Production Releases

This package uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases.

### Creating a Release

1. **Check for existing changesets**:
   ```bash
   # List any pending changesets
   ls .changeset/*.md 2>/dev/null | grep -v "README\|USAGE" || echo "No pending changesets"
   ```

2. **Create a changeset** for your changes (if necessary):
   ```bash
   pnpm changeset
   ```
   - Select `@cloudflare/kumo` from the list
   - Select the type of change: `patch`, `minor`, or `major`
   - Write a clear description of what changed
   - This creates a `.changeset/*.md` file describing the change

### Release Workflow

1. **Development**: Make changes to components, blocks, or layouts
2. **Changeset**: Create changeset describing the changes
3. **Review**: Submit MR with changes and changeset
4. **Beta Test**: Test the beta version published to the MR
5. **Merge**: Merge MR to main branch
6. **Release**: Run the production release process

### Production Release Process

To publish a production release:

```bash
# 1. Ensure you're on main branch with latest changes
git checkout main
git pull

# 2. Version all packages (consumes changesets)
pnpm version

# 3. Build all packages
pnpm build:all

# 4. Publish to npm
pnpm release
```

This will:
- Update `package.json` with new version
- Generate/update `CHANGELOG.md`
- Remove consumed changeset files
- Publish to npm registry
- Create git tags

### Post-Release

After publishing:

1. **Commit version changes**:
   ```bash
   git add .
   git commit -m "chore: release @cloudflare/kumo@{version}"
   git push
   ```

2. **Push tags**:
   ```bash
   git push --tags
   ```

3. **Verify publication**:
   ```bash
   npm view @cloudflare/kumo versions
   ```

### Semantic Versioning

Follow semantic versioning guidelines:

- **Patch** (`0.0.1`): Bug fixes, small component updates, style tweaks
- **Minor** (`0.1.0`): New components, new features, backwards-compatible changes
- **Major** (`1.0.0`): Breaking changes, removed components, API changes

### Release Notes

Changesets automatically generate:
- Updated `package.json` version
- `CHANGELOG.md` with release notes
- Git tags for each release

The changelog includes all changeset descriptions, providing clear documentation of what changed in each release.

## Troubleshooting

### Common Issues

**Changeset Validation Failed**

If the CI fails with a changeset validation error:

1. **Check if changeset exists**: Run `ls .changeset/*.md` to see pending changesets
2. **Create changeset**: Run `pnpm changeset` and select `@cloudflare/kumo`
3. **Verify changeset targets correct package**: Open the changeset file and ensure it includes `@cloudflare/kumo`
4. **Commit changeset**: Add and commit the changeset file to your branch

**Beta Publication Failed**

If the beta release job fails:

1. **Check build**: Ensure `pnpm build` succeeds locally
2. **Check npm token**: Verify npm authentication is configured in CI
3. **Check version format**: Ensure version follows semver format
4. **Review CI logs**: Check GitLab CI logs for specific error messages

**Import Errors After Release**

If consumers report import errors:

1. **Verify exports**: Check `package.json` exports match actual files
2. **Run tests**: Ensure `pnpm test:run` passes
3. **Check build output**: Verify `dist/` contains expected files
4. **Test locally**: Use `npm link` to test package locally before publishing
