---
"@cloudflare/kumo": minor
---

Add Label component with standardized label features for form fields

- New Label component with support for ReactNode children, optional indicator, and tooltip
- Enhanced form components (Input, Select, Checkbox, Switch, SensitiveInput, Combobox) with:
  - `label` prop now accepts ReactNode (not just strings)
  - `required={false}` shows "(optional)" text
  - `labelTooltip` prop for info icon with hover tooltip
- Updated Field component to use Label internally
- Added Label documentation page to kumo-docs
