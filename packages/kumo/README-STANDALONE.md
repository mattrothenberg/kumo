# Using Kumo Without Tailwind CSS

Kumo provides a standalone CSS build for applications that don't use Tailwind CSS.

## Installation

```bash
npm install @cloudflare/kumo
```

## Usage

### For Tailwind CSS Users

```js
// Explicit import (recommended)
import '@cloudflare/kumo/styles/tailwind';

// Or use the default export (same as above)
import '@cloudflare/kumo/styles';
```

This imports the raw CSS with Tailwind directives (`@theme`, `@layer`, etc.) that your Tailwind setup will process.

### For Non-Tailwind Users (Standalone)

```js
import '@cloudflare/kumo/styles/standalone';
```

This imports a fully compiled CSS file with all Tailwind utilities and Kumo styles pre-compiled. No Tailwind configuration needed!

## What's Included

The standalone CSS includes:
- All Tailwind utility classes used by Kumo components
- Kumo component styles
- Dark mode support (via `.dark-mode` class)
- All animations and keyframes
- Responsive utilities

## File Size

The standalone CSS is minified and optimized, but will be larger than the Tailwind version since it includes all utilities. Consider using a CSS purging tool in production if needed.

## Dark Mode

Add the `dark-mode` class to your root element to enable dark mode:

```html
<html class="dark-mode">
  <!-- Your app -->
</html>
```
