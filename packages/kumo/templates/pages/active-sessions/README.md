# Active Sessions Page Template

Complete page implementation for managing active devices and sessions on user accounts. This is a fully-built example from Kumo Storybook that you can copy and customize.

## Features

- **Device Management**: Display active sessions with device type (desktop, mobile, tablet), OS, and browser information
- **Session Details**: Shows IP address, login time, last seen timestamp, and location
- **Current Session Badge**: Highlights the user's current active session
- **Revoke Action**: Button to revoke non-current sessions (requires modal implementation)
- **Responsive Design**: Description and documentation button hidden on mobile
- **Accessibility**: Decorative icons marked with `aria-hidden`

## Installation

```bash
npx kumo add pages/active-sessions
```

## Usage

This template includes mock data. Replace it with your actual API calls:

```tsx
import { ActiveSessionsApp } from './pages/active-sessions';

function ProfilePage() {
  return <ActiveSessionsApp view="profile/sessions" />;
}
```

## What's Included

- `active-sessions.tsx` - Main page component with SessionCard inline
- `active-sessions-mocks.ts` - Mock data and types

## Customization

### Replace Mock Data with Real API

```tsx
// In active-sessions.tsx, replace:
const sessions = getActiveSessions();

// With your API call:
const sessions = await fetchUserSessions();
```

### Add Revoke Functionality

The "Revoke" button is included but requires implementation:

```tsx
<Button
  variant="secondary"
  size="sm"
  onClick={() => handleRevokeSession(session.id)}
>
  Revoke
</Button>
```

See the `flows/revoke-session` template for the complete modal flow.

### Customize Layout

This page uses the `layouts/centered-page-layout` pattern. You can:

- Change `max-w-4xl` to adjust page width
- Modify the header structure
- Add/remove card sections

## Design Patterns Used

- `Text variant="heading1"` for page title
- `Text variant="body" bold` for emphasized device names
- `Text variant="secondary" size="sm"` for metadata
- Middot (`·`) separators for inline metadata
- Phosphor icons with proper sizing and `aria-hidden`
- Responsive utilities (`hidden md:block`)
- LayerCard compound component pattern

## Dependencies

- `@cloudflare/kumo` - UI components (Text, Button, LayerCard, Badge)
- `@phosphor-icons/react` - Icons (Desktop, DeviceMobile, DeviceTablet, Globe, Clock, MapPin)

## Related Templates

- `layouts/centered-page-layout` - The layout pattern this page uses
- `flows/revoke-session` - Modal flow for revoking sessions (coming soon)
- `blocks/page-header` - Reusable page header pattern (coming soon)
