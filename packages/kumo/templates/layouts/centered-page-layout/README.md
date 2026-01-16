# Centered Page Layout Template

A single-column, centered page layout with a simple header and LayerCard content. Perfect for focused, content-heavy pages like settings, profiles, or detail views.

## Layout Features

- **Centered container**: `max-w-4xl` for optimal readability
- **Responsive header**: Title + description (hidden on mobile) + optional action button
- **LayerCard structure**: Primary/Secondary sections for organized content
- **Semantic tokens**: Uses `bg-surface`, `text-surface` for automatic dark mode

## What This Template Provides

This is a **layout pattern**, not a specific page implementation. It gives you:

1. **Page structure**: Centered container with proper spacing
2. **Header pattern**: Title, description, and action button layout
3. **Card pattern**: LayerCard with Primary/Secondary sections
4. **Responsive design**: Mobile-first with `hidden md:block` patterns

## Installation

```bash
npx kumo add pages/centered-page-layout
```

## Usage

Replace the placeholder content with your actual page content:

```tsx
import { CenteredPageLayout } from './pages/my-page';

function MyPage() {
  return <CenteredPageLayout />;
}
```

## Customization

### Change the max-width

```tsx
// Default: max-w-4xl (896px)
<div className="mx-auto max-w-4xl">

// Wider: max-w-6xl (1152px)
<div className="mx-auto max-w-6xl">

// Narrower: max-w-2xl (672px)
<div className="mx-auto max-w-2xl">
```

### Add more cards

```tsx
<div className="flex flex-col gap-4">
  <LayerCard>...</LayerCard>
  <LayerCard>...</LayerCard>
  <LayerCard>...</LayerCard>
</div>
```

### Remove the action button

Simply delete the `<Button>` element from the header.

### Add icons or badges

```tsx
import { CheckCircle } from "@phosphor-icons/react";

<LayerCard.Primary>
  <div className="flex items-center gap-2">
    <CheckCircle size={20} />
    <Text variant="body" bold>Card Title</Text>
  </div>
</LayerCard.Primary>
```

## Design Patterns Used

- `Text variant="heading1"` for page title
- `Text variant="secondary" size="lg"` for page description
- `Text variant="body" bold` for card titles
- `Text variant="secondary" size="sm"` for metadata
- `LayerCard.Primary` for main content
- `LayerCard.Secondary` for additional details
- `hidden md:block` for responsive visibility

## Examples Using This Layout

- **Active Sessions page** (`src/pages/active-sessions/`) - Device/session management
- **Profile settings** - User preferences and account settings
- **Resource details** - Single resource view with metadata

## Dependencies

- `@cloudflare/kumo` - UI components (Text, Button, LayerCard)

## Related Templates

- `blocks/page-header` - Reusable page header component (coming soon)
- `flows/*` - Modal flows for actions (coming soon)
