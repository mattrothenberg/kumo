---
"@cloudflare/kumo": minor
---

Add nested menu (submenu) and RadioGroup/RadioItem support to DropdownMenu

- Add `DropdownMenu.Sub`, `DropdownMenu.SubTrigger`, and `DropdownMenu.SubContent` for nested submenus
- Add `DropdownMenu.RadioGroup`, `DropdownMenu.RadioItem`, and `DropdownMenu.RadioItemIndicator` for single-selection menus
- Fix `SubTrigger` styling to match `Item` component
- Fix focus ring on dropdown popup
- Add Storybook stories demonstrating nested menus and radio items
- Update Astro docs with examples and API reference
