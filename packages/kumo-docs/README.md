# Kumo Documentation Site

This package contains the documentation and showcase site for the Kumo component library, built with React Router 7 and deployed to Cloudflare Workers.

## Development

### Documentation Changes Only

If you're only working on documentation content (no component library changes):

```bash
# From this directory
pnpm dev

# Or from workspace root
pnpm dev
```

The site runs at `http://localhost:5173` with full HMR support. Changes to documentation files will reflect instantly.

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
pnpm --filter @cloudflare/kumo-docs build
```

This creates an optimized build in the `build/` directory, ready for deployment to Cloudflare Workers.

**Note:** Production builds use the compiled `@cloudflare/kumo` package from `../kumo/dist/`. Ensure kumo is built before building docs:

```bash
# From workspace root
pnpm build:all
```

## Deployment

Deploy to Cloudflare Workers:

```bash
# From this directory
pnpm deploy

# Or from workspace root
pnpm --filter @cloudflare/kumo-docs deploy
```

This runs `pnpm build && wrangler deploy` to build and deploy in one command.

### Preview Deployments

Create a preview deployment:

```bash
npx wrangler versions upload
```

After verifying the preview works, promote it to production:

```bash
npx wrangler versions deploy
```

## Structure

```
kumo-docs/
├── app/                      # React Router application
│   ├── components/          # Site-specific components
│   ├── routes/              # Page routes and content
│   ├── lib/                 # Utilities and helpers
│   └── root.tsx             # Root layout
├── workers/                 # Cloudflare Workers
│   └── app.ts              # Workers entry point with caching
├── public/                  # Static assets
├── vite.config.ts          # Vite configuration
└── react-router.config.ts  # React Router configuration
```

## Key Dependencies

- **React Router 7** - Framework with SSR support
- **@cloudflare/kumo** - Component library (workspace dependency)
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Wrangler** - Cloudflare Workers deployment
- **@codesandbox/sandpack-react** - Live code examples

## Environment Variables

- `OPENAI_API_KEY` - (Optional) For AI-powered features

Set in `.env` or via Wrangler secrets for production:

```bash
npx wrangler secret put OPENAI_API_KEY
```

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
3. Run `pnpm typecheck` to verify

### Build Failures

If the build fails:

1. Ensure kumo is built: `cd ../kumo && pnpm build`
2. Clear build cache: `rm -rf build .react-router`
3. Try building again: `pnpm build`
