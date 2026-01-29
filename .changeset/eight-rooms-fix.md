---
"@cloudflare/kumo": major
"@cloudflare/kumo-docs-astro": major
---

# Kumo 1.0.0 Release

The first stable release of Kumo, Cloudflare's component library.

## Breaking Changes

### Blocks Distribution via CLI

Blocks (`PageHeader`, `ResourceListPage`) are no longer exported from `@cloudflare/kumo`. They must now be installed via the CLI:

```bash
npx @cloudflare/kumo init        # Initialize kumo.json
npx @cloudflare/kumo add PageHeader
```

Blocks are copied to your project for full customization with imports automatically transformed to `@cloudflare/kumo`.

### Checkbox API Changes

- **Ref type changed**: `HTMLInputElement` → `HTMLButtonElement`
- **Props changed**: No longer extends `InputHTMLAttributes` (explicit props only)
- **Handler renamed**: `onChange`/`onValueChange` → `onCheckedChange` (deprecated handlers still work)

### Banner API Deprecation

The `text` prop is deprecated in favor of `children`:

```tsx
// Before (deprecated)
<Banner text="Your message" />

// After (preferred)
<Banner>Your message</Banner>
```

## New Features

- **Link component**: Inline text links with Base UI composition API and `render` prop for framework routing
- **DropdownMenu enhancements**: Nested submenus (`Sub`, `SubTrigger`, `SubContent`) and radio items (`RadioGroup`, `RadioItem`)
- **Grid component**: New layout primitive
- **Theme generator**: Config-driven token definitions with consolidated semantic color system
- **Component catalog**: Visibility controls for documentation
- **Deprecated props lint rule**: `kumo/no-deprecated-props` detects `@deprecated` JSDoc tags

## Fixes

- Dropdown danger variant color contrast
- Tabs segmented indicator border radius
- Combobox dropdown scrolling
- Primary button hover/focus contrast

## Migration Guide

### Blocks

If you were using blocks (note: they were never officially exported):

```bash
# 1. Initialize configuration
npx @cloudflare/kumo init

# 2. Install blocks
npx @cloudflare/kumo add PageHeader
npx @cloudflare/kumo add ResourceListPage

# 3. Update imports to the local path shown after installation
```

### Checkbox

```tsx
// Before
<Checkbox onChange={(e) => setValue(e.target.checked)} />;
const ref = useRef<HTMLInputElement>(null);

// After
<Checkbox onCheckedChange={(checked) => setValue(checked)} />;
const ref = useRef<HTMLButtonElement>(null);
```

### Banner

```tsx
// Before (still works, but deprecated)
<Banner text="Your message" />

// After
<Banner>Your message</Banner>
```
