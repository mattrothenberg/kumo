---
"@cloudflare/kumo": minor
---

Add lint rule to detect usage of deprecated props on Kumo components.

- New `kumo/no-deprecated-props` lint rule automatically detects deprecated props from `@deprecated` JSDoc tags
- Component registry now includes `deprecated` field for props with `@deprecated` annotations
- Docs site shows strikethrough and `@deprecated` badge for deprecated props in API reference tables

To deprecate a prop, add a JSDoc comment:
```tsx
interface MyComponentProps {
  /** @deprecated Use `newProp` instead */
  oldProp?: string;
}
```

The lint rule will flag usage and show a helpful message:
```
The `oldProp` prop on <MyComponent> is deprecated. Use `newProp` instead.
```
