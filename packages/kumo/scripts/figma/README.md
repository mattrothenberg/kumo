# Figma Token Sync

Unidirectional sync from code to Figma design variables.

## Single Source of Truth

**The codebase is the single source of truth.** Running sync will:

1. **PURGE** all existing variables in the Figma file
2. **CREATE** fresh variables from the CSS

Designers can fork the Figma file for their own use, but this file is always kept in sync with code.

## Structure

The sync creates two collections:

```
kumo-colors (collection)
├── Light (mode)      - Light theme values
├── Dark (mode)       - Dark theme values
└── fedramp (extension collection)
    ├── Light         - FedRAMP light overrides
    └── Dark          - FedRAMP dark overrides

kumo-typography (collection)
└── Desktop (mode)    - Typography values (font sizes, line heights)
```

## Token Sources

### Color Tokens

| Source         | CSS File            | Description                                 |
| -------------- | ------------------- | ------------------------------------------- |
| kumo           | `theme-kumo.css`    | Core semantic tokens (46 tokens)            |
| fedramp-global | `theme-fedramp.css` | Global FedRAMP tokens (`--color-fedramp-*`) |

### Typography Tokens

| Source | CSS File         | Description                                         |
| ------ | ---------------- | --------------------------------------------------- |
| kumo   | `theme-kumo.css` | Typography tokens (26 tokens: sizes + line heights) |

Typography tokens include:

- `text-xs` through `text-9xl` - Font sizes in pixels
- `text-xs--line-height` through `text-9xl--line-height` - Line height ratios

## Extended Modes

Extended modes inherit all base tokens and can override specific values:

| Mode    | Override Source                   | Description             |
| ------- | --------------------------------- | ----------------------- |
| fedramp | `theme-fedramp.css` `@layer base` | FedRAMP theme overrides |

When overrides are commented out (as they currently are), the extended mode mirrors the Light values.

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
   ```

3. **Ensure `.env` is gitignored** (it is by default)

## Usage

### Sync tokens (purge + create):

```bash
FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

### Get existing Figma variables:

```bash
FIGMA_TOKEN="your-token" npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts get
```

### With `.env` file:

```bash
source packages/kumo/scripts/figma/.env
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts
```

### CLI Help:

```bash
npx tsx packages/kumo/scripts/figma/sync-tokens-to-figma.ts --help
```

## Adding Overrides

To add FedRAMP-specific color overrides, uncomment the tokens in `theme-fedramp.css`:

```css
@layer base {
  [data-theme="fedramp"] {
    /* Uncomment to override: */
    --color-surface: var(--color-fedramp-surface);
    --color-active: var(--color-fedramp-active);
    --text-color-surface: light-dark(#ffffff, #ffffff);
  }
}
```

Then run sync again - the `fedramp` mode will have these overrides applied.

## Adding New Extended Modes

1. Add the mode config to `EXTENDED_MODES` in `sync-tokens-to-figma.ts`:

```typescript
const EXTENDED_MODES = [
  // ... existing modes
  {
    name: "mycompany",
    overrideCssPath: resolve(__dirname, "../../src/styles/theme-mycompany.css"),
  },
];
```

2. Create the CSS file with `@layer base` overrides
3. Run sync

## Architecture

### Files

- **`sync-tokens-to-figma.ts`** - Main CLI entry point
- **`parse-css.ts`** - Parses CSS and extracts `light-dark()` tokens
- **`color-utils.ts`** - Converts oklch/hex/rgb to Figma RGB format
- **`figma-api.ts`** - Figma Variables API client (purge + create)

### Token Flow

```
theme-*.css
  → parseCssTokensFromFile()      (color tokens with light-dark())
  → parseTypographyTokensFromFile() (typography tokens)
  → resolveColor() / resolveTypographyToken()
  → syncAllToFigma()
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

## Security

**⚠️ NEVER commit your Figma token to the repository.**

- `.env` is gitignored by default
- Always use environment variables for tokens
- Rotate tokens if accidentally exposed

## Resources

- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Kumo Color System](../../ai/component-registry.md)
- [CSS Color Module Level 4 (oklch)](https://www.w3.org/TR/css-color-4/)
