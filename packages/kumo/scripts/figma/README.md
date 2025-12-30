# Figma Token Sync

Syncs Kumo semantic color tokens from CSS to Figma design variables.

## Purpose

This script automates the synchronization of Kumo's semantic color tokens (defined in `src/styles/theme-kumo.css`) to Figma design variables. It:

1. Parses CSS tokens from `theme-kumo.css`
2. Extracts light and dark mode values from `light-dark()` functions
3. Resolves color values (oklch, hex, rgb) to Figma RGB format
4. Pushes tokens to Figma via the Variables API

This ensures design tokens stay in sync between code and design, enabling:

- Designers to use semantic tokens in Figma
- Automatic updates when tokens change in code
- Single source of truth for color values

## Prerequisites

### Figma Personal Access Token

1. Go to [Figma Settings > Personal Access Tokens](https://www.figma.com/developers/api#authentication)
2. Click "Create new token"
3. Give it a descriptive name (e.g., "Kumo Token Sync")
4. Copy the token (you won't see it again)

### Figma File Access

You need **edit access** to the target Figma file. The default file key is `sKKZc6pC6W1TtzWBLxDGSU`.

## Setup

1. **Copy `.env.example` to `.env`:**

   ```bash
   cp packages/kumo/scripts/figma/.env.example packages/kumo/scripts/figma/.env
   ```

2. **Add your Figma token to `.env`:**

   ```bash
   FIGMA_TOKEN=your-token-here
   FIGMA_FILE_KEY=sKKZc6pC6W1TtzWBLxDGSU
   FIGMA_COLLECTION_NAME=kumo-semantic-tokens
   ```

3. **Ensure `.env` is gitignored** (it is by default)

## Usage

### Run with environment variable:

```bash
FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

### Or with `.env` file:

```bash
# Load from .env
source packages/kumo/scripts/figma/.env
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

### With custom configuration:

```bash
FIGMA_TOKEN="your-token" \
FIGMA_FILE_KEY="custom-file-key" \
FIGMA_COLLECTION_NAME="my-tokens" \
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

## What It Does

The sync process:

1. **Parses CSS** - Reads `theme-kumo.css` and extracts `@theme` blocks
2. **Extracts tokens** - Finds all CSS variables with `light-dark()` values
3. **Resolves colors** - Converts oklch/hex/rgb values to Figma RGB format (0-1 range)
4. **Creates collection** - Creates or updates the Figma variable collection
5. **Syncs variables** - Pushes all tokens with light/dark mode values

### Example Token

**CSS:**

```css
@theme {
  --text-color-surface: light-dark(
    oklch(21% 0.006 285.885),
    oklch(98% 0.003 285.885)
  );
}
```

**Figma Result:**

- Variable name: `text-color-surface`
- Light mode: `rgb(49, 49, 56)`
- Dark mode: `rgb(248, 248, 251)`

## Future Support

- **FedRAMP Theme**: Will support syncing `theme-fedramp.css` to a separate collection
- **Custom themes**: Support for syncing additional theme variants

## Architecture

### Files

- **`sync-tokens-to-figma.ts`** - Main entry point, orchestrates the sync
- **`parse-css.ts`** - Parses CSS and extracts `light-dark()` tokens
- **`color-utils.ts`** - Converts oklch/hex/rgb to Figma RGB format
- **`figma-api.ts`** - Figma Variables API client
- **`design-tokens.ts`** - Type definitions

### Token Flow

```
theme-kumo.css
  → parseCssTokensFromFile()
  → resolveColor() (for light + dark)
  → buildFigmaPayload()
  → syncToFigma()
  → Figma Variables API
```

## Troubleshooting

### "FIGMA_TOKEN is required"

You need to provide a Figma personal access token. See [Prerequisites](#prerequisites).

### "Figma API error (403)"

Your token doesn't have access to the file. Verify:

- Token is valid
- You have edit access to the Figma file

### "Figma API error (404)"

The file key is incorrect. Check the URL in Figma:

```
https://www.figma.com/file/{FILE_KEY}/...
                           ^^^^^^^^^^^
```

### Color parsing errors

If colors fail to parse, check that:

- Values are valid oklch/hex/rgb formats
- `light-dark()` syntax is correct

## Security

**⚠️ NEVER commit your Figma token to the repository.**

- `.env` is gitignored by default
- Always use environment variables for tokens
- Rotate tokens if accidentally exposed

## Resources

- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Kumo Color System](../../ai/component-registry.md)
- [CSS Color Module Level 4 (oklch)](https://www.w3.org/TR/css-color-4/)
