# Kumo Templates

Copyable page and component templates for building Cloudflare dashboard experiences.

## What are Templates?

Templates are **copy-paste implementations** of common UI patterns using Kumo components. Unlike the Kumo component library (which you install via npm), templates are copied directly into your project as source code that you own and can customize.

Think of it like shadcn/ui, but for complete pages and flows instead of individual components.

## Usage

```bash
# Add a template to your project
npx kumo add layouts/centered-page-layout

# List all available templates
npx kumo templates

# Show template details
npx kumo info layouts/centered-page-layout
```

## Template Categories

### Layouts (`templates/layouts/`)

Page layout patterns and structure templates.

- **centered-page-layout** - Single-column centered layout with max-w-4xl container

### Pages (`templates/pages/`)

Complete page implementations from Kumo Storybook.

- **active-sessions** - Device and session management page

### Blocks (`templates/blocks/`)

Reusable UI patterns and components.

- Coming soon: page-header, breadcrumbs, data-table

### Flows (`templates/flows/`)

Modal and interaction flows for common actions.

- Coming soon: revoke-session, delete-resource, multi-step-wizard

## How It Works

1. **Browse templates** in this directory or via `npx kumo templates`
2. **Copy template** via `npx kumo add <template-name>`
3. **Customize** the copied code to fit your needs
4. **Own it** - no package dependencies, no version conflicts

## Template Structure

Each template includes:

- `template.json` - Metadata and configuration
- Source files (`.tsx`, `.ts`)
- `README.md` - Usage documentation

## Design Principles

Templates demonstrate:

- ✅ Proper Kumo component usage
- ✅ Semantic token usage (no hardcoded colors)
- ✅ Accessibility best practices
- ✅ Responsive design patterns
- ✅ TypeScript types

## For Internal Cloudflare Use

These templates are designed for Cloudflare dashboard developers. They follow internal patterns and conventions.

## Contributing

To add a new template:

1. Create directory: `templates/<category>/<name>/`
2. Add `template.json` with metadata
3. Add source files
4. Add `README.md` with usage instructions
5. Update `registry.json`

See existing templates for examples.
