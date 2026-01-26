---
"@cloudflare/kumo": minor
---

feat(banner): add children prop, deprecate text prop

Banner now supports `children` for content, which is the preferred API. The `text` prop is deprecated but still works for backwards compatibility.

```tsx
// Preferred (new)
<Banner>Your message</Banner>
<Banner icon={<Icon />}>Your message</Banner>

// Deprecated (still works)
<Banner text="Your message" />
```

The `text` prop will be removed in a future major version.
