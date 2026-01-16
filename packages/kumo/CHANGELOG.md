# @cloudflare/kumo

## 0.5.0

### Minor Changes

- ee744b3: feat(PageHeader): add optional title and description props
  - Adds `title?: string` and `description?: string` props to PageHeader block
  - Title renders as semantic h1 for Section 508 and WCAG 2.4.2 (Level A) compliance: "Web pages have titles that describe topic or purpose"
  - Description uses max-w-prose (65ch) for optimal readability per industry standards
  - Styling matches Stratus Workers & Pages implementation
  - Includes comprehensive Storybook examples (WithTitle, WithTitleAndDescription, CompleteExample)

  ## Why This Feature Matters

  **Without this feature**, pages using only PageHeader would lack a semantic page title (h1), requiring developers to manually add titles elsewhere. This creates:
  - ❌ Risk of Section 508 and WCAG 2.4.2 violations
  - ❌ Compliance risk for FedRAMP High authorization (requires Section 508 conformance)
  - ❌ Inconsistent title placement across pages
  - ❌ Additional implementation burden on every page

  **With this feature**, PageHeader provides a standardized way to include accessible page titles that:
  - ✅ Render as semantic h1 elements (required by Section 508 and WCAG 2.4.2)
  - ✅ Visually differentiate from breadcrumbs
  - ✅ Work correctly with screen readers and assistive technology
  - ✅ Maintain consistency across the dashboard
  - ✅ Support FedRAMP High compliance requirements

  ### Important: Breadcrumbs Are Not Page Titles

  Breadcrumbs serve navigation purposes and cannot replace semantic page titles. Both should coexist:
  - **Page title (h1)**: Primary orientation, required for accessibility
  - **Breadcrumb trail**: Secondary navigation showing site hierarchy
  - **Visual differentiation**: Size, weight, and placement distinguish the two

  ### References
  - [Section 508 Standards](https://www.access-board.gov/ict/) - Requires WCAG 2.0 Level A and AA conformance
  - [WCAG 2.4.2: Page Titled](https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html) - Level A requirement

- b4a817f: Add table component
  - Introduce new Table component with row variants and styling options
  - Add Table documentation and examples to `kumo-docs`

- 0e5cf84: lighter red in light mode
- 6c94137: Add Label component with standardized label features for form fields
  - New Label component with support for ReactNode children, optional indicator, and tooltip
  - Enhanced form components (Input, Select, Checkbox, Switch, SensitiveInput, Combobox) with:
    - `label` prop now accepts ReactNode (not just strings)
    - `required={false}` shows "(optional)" text
    - `labelTooltip` prop for info icon with hover tooltip
  - Updated Field component to use Label internally
  - Added Label documentation page to kumo-docs

- 742dc89: Add Radio component for single-selection from a set of options
  - New `Radio.Group` and `Radio.Item` compound components built on Base UI primitives
  - Supports vertical and horizontal orientations
  - Includes error, description, and disabled states
  - `controlPosition` prop for label placement ("start" or "end")
  - Full accessibility support with semantic HTML and keyboard navigation
  - Documentation added to both kumo-docs and kumo-docs-astro sites

- 872ef11: Add Storybook preview deployments and MR reporter system
  - Storybook previews deploy to Cloudflare Workers on MR commits
  - Staging deployment to `storybook.staging.kumo-ui.com` on merge to main
  - Consolidated MR comments with beta npm version and preview URL

- 9537114: Add variant prop to Tabs component with 'segmented' (default) and 'underline' options

### Patch Changes

- 7c2e8dd: Fix label not appearing in Combobox unless a description or error given.
- 5bdfae9: fix bug where delete user external links were being treated as internal navigation and appending urls to domain
- d598621: Fix Base UI nativeButton warning in Switch component by adding nativeButton prop to BaseSwitch.Root
- e613876: Update deployment configs to enable preview urls
- d9add6b: added a next / previous form of pagination
- 356d1e6: Modernize Active Sessions page with updated Kumo design patterns
- 5b256bd: - Align border color with sidebar
  - Center arrow icon in select component
- d998518: Add `bg-surface` as default background for Surface component

## 0.4.0

### Minor Changes

- 010d1f0: Fix Combobox button styles
- 933fdf2: Migrate to @base-ui/react V1

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

- 731e636: Add built-in Field integration to form components with automatic layout

  **New Features:**
  - Input, InputArea, SensitiveInput, Select, Checkbox, Switch, and Combobox now accept `label`, `description`, and `error` props for built-in Field wrapper support
  - Automatic CSS-driven layout: vertical for text inputs, horizontal for checkboxes/switches using `:has()` selectors
  - Checkbox.Group and Switch.Group compound components for managing multiple related controls with shared legend/description/error
  - Storybook Code Panel enabled for better component code examples

  **Accessibility:**
  - Runtime console warnings (dev-only) when Input/Checkbox lack accessible names (label, aria-label, or aria-labelledby)
  - Comprehensive JSDoc documentation with accessibility guidance and examples

  **Breaking Changes:**
  - Field component removed from public API (now internal implementation detail - use component props instead)

  **Migration:**

  ```tsx
  // Before: Explicit Field wrapper
  <Field label="Email" description="...">
    <Input placeholder="you@example.com" />
  </Field>

  // After: Built-in Field API (recommended)
  <Input
    label="Email"
    description="..."
    placeholder="you@example.com"
  />
  ```

- 1db802c: change error color for text component to match field input error colors
- 45ccaec: secondary-destructive button variant
- ccc03dc: fix: update changeset validation logic
- 2f91f1f: - Complete semantic color tokens migrated from Stratus app
  - Document color and text-color tokens in Storybook
  - Add accessibility tests via Storybook Vitest addon
  - Add component-metadata generator for AI tooling
  - Enable linting in CI/CD (passing)
  - Apply Prettier Tailwind plugin for consistent class ordering
  - Use pnpm catalog for shared package versions
  - Semantic colors now scoped to `[data-theme]` and `[data-mode]` attributes
  - Consumers must ensure root element has these attributes for proper theming

  ### Migration Guide

  Add `data-theme` and `data-mode` attributes to your root element:

  ```tsx
  // React example
  <html data-theme="kumo" data-mode={isDark ? "dark" : "light"}>

  // Static HTML
  <html data-theme="kumo" data-mode="light">
  ```

  - **`data-theme`**: Set to `"kumo"` (default theme) or other theme variants like `"fedramp"`
  - **`data-mode`**: Set to `"light"` or `"dark"` to control color scheme

  If no `data-mode` is set, the system defaults to light mode.

- ad3c8fa: tab and text style fixes; storybook theme select always visible
- 731e636: inputs with built-in fields
- 933fdf2: Bundle Base UI primitives with granular exports and fix critical compatibility issues

  ## Primitives: Granular Exports

  Added granular exports for all 37 Base UI primitives alongside the existing barrel export. This enables better tree-shaking and smaller bundle sizes when using individual primitives.

  ```tsx
  // Barrel export (imports all primitives)
  import { Slider, Popover, Tooltip } from "@cloudflare/kumo/primitives";

  // Granular exports (tree-shakeable, recommended)
  import { Slider } from "@cloudflare/kumo/primitives/slider";
  import { Popover } from "@cloudflare/kumo/primitives/popover";
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

- abc1a1e: kumo cli
- e6a6f8c: semantic text colors - consolidation
- 167a92b: Removed label prop from input components. Prefer using Field to compose a label with an input.
- 8578662: consolidate blue text to match banner blue text across: badge, expandable, text components
- 37a703d: consolidate on the green text tokens

### Patch Changes

- d23783f: Update kumo package to use literal depdency versions for better yarn linking/portal support.
- fe8fd1b: improve input group label to be semantic and use htmlFor
- 933fdf2: **Combobox Type Fixes**
  - Removed `any` type and eslint-disable comments
  - Used proper `ComboboxBase.Root.Props<Value, Multiple>` from base-ui's namespace
  - Simplified generic parameters from 3 (ItemValue, SelectedValue, Multiple) to 2 (Value, Multiple) to match base-ui's actual API

- 949fe52: fix remaining lint errors and increase lint warn -> error
- 72f0695: Update reamde documentation
- e6326f1: Consolidate AGENTS.md and CLAUDE.md LLM instructions
- 9fbb791: fix resource-list href lint errors
- a4231cc: Improve expandable component semantics
- 344372e: Update Storybook imports from @storybook/react to @storybook/react-vite for Storybook 10 compatibility. Also removes generatedAt timestamp from component registry to prevent merge conflicts during rebases.
- d1b80c8: improve sensitive input component - semantics, button nesting, labelling, screen reader experience
- 38f4424: Fix: Resolve type check errors across components/blocks/layouts
  Fix: Export Kumo Breadcrumb as Breadcrumbs + Documentation Improvements
  Fix: MenuBar -Bypass the React 19 type checking issue with IconContext.Provider
- e82f3f7: improve semantics and labelling for date picker component

## 0.3.0

### Minor Changes

- 8113cf4: docs updates and semantic colors for banner
- 3bca64a: ship dark-mode color scheme styles from kumo lib instead of setting it at the app
- a5cd231: Adds Storybook 10 integration to the Kumo component library for interactive component development, testing, and documentation. Includes stories for 29 components, automated plop generator updates, and documentation.

### Patch Changes

- 969750a: enforce button background transparency for tabs
- 2f516b0: Combobox - Adjust multiple select height with standard Kumo component height
- be563d1: Checkbox indeterminate state
- 7481c95: Improve development workflow with 10x faster rebuilds and comprehensive documentation

  Add development mode with optimized builds, skip minification and enable incremental TypeScript compilation. Update all READMEs and contributing docs with clear guidance on Storybook (recommended) vs watch build workflows. Add story file documentation to scaffolding sections and two-terminal setup instructions for testing components in docs.

- c48b7b5: Enhance CICD to publish beta releases
- b68c768: Fix: Resolve type check erros across components/blocks/layouts
  Fix: Export Kumo Breadcrumb as Breadcrumbs + Documentation Improvements
  Fix: MenuBar -Bypass the React 19 type checking issue with IconContext.Provider

## 0.2.0

### Minor Changes

- 924e016: Semantic color improvements
- 924e016: Improve select components
- 924e016: Fix Input borders
- e73fb2e: Fix exports
- 1bb5cf7: Compile Tailwind and Standalone CSS, update installation documentation

### Patch Changes

- 1bb5cf7: Adding changesets
