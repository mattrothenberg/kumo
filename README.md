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
