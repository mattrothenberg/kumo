---
"@cloudflare/kumo": minor
---

Add Figma plugin for UI kit generation

- New plugin at `packages/figma/` (`@cloudflare/figma-plugin`)
- Generates 29 component types: Badge, Banner, Button, Checkbox, Code, CodeBlock, Collapsible, Combobox, DateRangePicker, Dialog, Dropdown, Icon Library, Input, InputArea, LayerCard, LinkButton, Loader, MenuBar, Meter, Pagination, RefreshButton, Select, SensitiveInput, Surface, Switch, Switch.Group, Tabs, Text, Toast
- Each component generated with light and dark mode sections
- Icon Library generator creates all Phosphor and Cloudflare brand icons
- Parses component-registry.json and source files for variant specs
- Extracts opacity modifiers from Tailwind classes (bg-primary/70 → opacity-primary-70)
- Binds fills/strokes to kumo-colors variables
- Includes progress UI and validation output
