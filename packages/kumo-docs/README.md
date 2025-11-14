# Kumo Documentation Site

This package contains the documentation and showcase site for the Kumo component library.

## Development

```bash
# From workspace root
pnpm --filter @cloudflare/kumo-docs dev

# Or from this directory
pnpm dev
```

## Building

```bash
# From workspace root
pnpm --filter @cloudflare/kumo-docs build

# Or from this directory
pnpm build
```

## Deployment

```bash
# From workspace root
pnpm --filter @cloudflare/kumo-docs deploy

# Or from this directory
pnpm deploy
```

## Structure

- `app/` - React Router application source
- `workers/` - Cloudflare Workers entry point
- `public/` - Static assets
