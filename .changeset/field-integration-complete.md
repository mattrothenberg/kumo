---
"@cloudflare/kumo": minor
---

Add built-in Field integration to form components with automatic layout

**New Features:**
- Input, InputArea, SensitiveInput, Select, Checkbox, Switch, and Combobox now accept `label`, `description`, and `error` props for built-in Field wrapper support
- Automatic CSS-driven layout: vertical for text inputs, horizontal for checkboxes/switches using `:has()` selectors
- Checkbox.Group and Switch.Group compound components for managing multiple related controls with shared legend/description/error
- Storybook Code Panel enabled for better component code examples

**Accessibility:**
- Runtime console warnings (dev-only) when Input/Checkbox lack accessible names (label, aria-label, or aria-labelledby)
- Comprehensive JSDoc documentation with accessibility guidance and examples

**Breaking Changes:**
- Field component removed from public API (now internal implementation detail - use component props instead)

**Migration:**
```tsx
// Before: Explicit Field wrapper
<Field label="Email" description="...">
  <Input placeholder="you@example.com" />
</Field>

// After: Built-in Field API (recommended)
<Input 
  label="Email" 
  description="..."
  placeholder="you@example.com" 
/>
```
