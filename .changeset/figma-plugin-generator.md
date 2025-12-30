---
"@cloudflare/kumo": minor
---

Add Figma plugin for UI kit generation

- New plugin at `packages/kumo/scripts/figma/plugin/`
- Generates Button (48 ComponentSets) and Badge (5 ComponentSets) in Figma
- Parses component-registry.json and source files for variant specs
- Extracts opacity modifiers from Tailwind classes (bg-primary/70 → opacity-primary-70)
- Binds fills/strokes to kumo-colors variables
- Includes progress UI and validation output
