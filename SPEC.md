what are your thoughts on having not having an icon component? factor in our plugin AND shipping the component library @packages/kumo/ here is how we may want to handle it in figma: https://www.uiprep.com/blog/ultimate-guide-to-using-icons-in-figma
dir packages/kumo/
jonnie
Let me read that article and think through the implications:
% WebFetch https://www.uiprep.com/blog/ultimate-guide-to-using-icons-in-figma
Good article. Let me also check what icon library Kumo uses:

# Check icon library in package.json

$ grep -r "phosphor" /Users/jonnie/dev/cf/kumo/packages/kumo/package.json
/Users/jonnie/dev/cf/kumo/packages/kumo/package.json: "@phosphor-icons/react": "^2.1.10",
Here's my analysis:
Thoughts on Icon Component Strategy
Current State

- Kumo uses Phosphor Icons (@phosphor-icons/react) - a well-established library with 9,000+ icons
- Components like Button, Checkbox use Phosphor directly: import { CheckIcon, MinusIcon } from "@phosphor-icons/react"
- No wrapper <Icon> component exists in Kumo
  Should Kumo have an Icon component?
  Arguments FOR a wrapper Icon component:

1. Consistent sizing - enforce standard sizes (12, 16, 20, 24px)
2. Color binding - auto-bind to semantic tokens (text-surface, text-muted)
3. Accessibility - enforce aria-hidden or aria-label patterns
4. Future-proofing - swap icon libraries without touching every component
   Arguments AGAINST:
5. Phosphor is already excellent - has weight variants, consistent API, tree-shakeable
6. Extra abstraction - adds indirection for minimal benefit
7. Bundle size - wrapper adds overhead
8. Flexibility - direct Phosphor usage is more flexible
   Figma Plugin Strategy
   Based on the article, the best approach for Figma:
9. Don't generate icons in the plugin - icons should come from a dedicated Figma icon library (Phosphor has an official Figma file)
10. Use placeholder/slot pattern - what we're already doing with placeholderIcon12/16/20. Designers swap these with real icons via instance swap.
11. Consider a separate "Kumo Icons" Figma library - curated subset of Phosphor icons used in Kumo, properly sized (16x16, 20x20, 24x24) with semantic color variables bound
    Recommendation
    For the React library: Don't add an Icon wrapper. Phosphor is great, and direct usage keeps things simple. Document the pattern:
    import { CheckIcon } from "@phosphor-icons/react";
    <CheckIcon size={16} className="text-surface" weight="bold" />
    For Figma plugin:
12. Keep placeholder icons for instance swapping
13. Consider creating a separate "Kumo Icons" page with commonly-used Phosphor icons (Arrow, Check, X, Plus, Minus, etc.) properly sized and with color variables bound
14. These become the "swap targets" for placeholder icons in components
    Want me to enhance the plugin to generate a curated icon library page with the most commonly used Phosphor icons, properly set up for instance swapping?
    ▣ Build · claude-opus-4-5 · 44.4s
    some more context so combine your analysis above with the considerations brought up in this conversation we may want to consider shipping an <Icon /> component that can render the phosphor icons and maybe our custom brand icons, too.
    this substantially help simplify the codemods and we'll get a lot of performance benefits if we ship this as a sprite:
    https://benadam.me/thoughts/react-svg-sprites/
    https://www.jacobparis.com/content/svg-icons
    https://github.com/epicweb-dev/epic-stack/blob/2c2a65d7e8d27c0e4e9bb00534d136a43a9d804d/docs/decisions/020-icons.md
    Brayden Wilmoth, Dec 18, 3:27 PM
    Maybe we can double-click into this one a bit. My personal preference would be to not have a layer of abstraction on top... or at least when I see implementations like this it's some generic <Icon type="..." /> and we have a manual mapping and we obfuscate some things away. But instead of making it easier we're just hiding more.
    But maybe I'm misunderstanding too!!
    Rob Knecht, Dec 18, 3:35 PM
    I've been sketching this out for a while, but I keep getting pulled away from the POC. One problem we need to solve soon: CL1's icon workflow is brittle and crashes Stratus, which can have real user-facing impact and blocks staging.
    Whenever we bring up "icons," it quickly turns into three separate conversations mushed into one:
    Content: which icons we include and how we add more
    Workflow: how we get the current CF icon assets into Stratus so we can reuse and consolidate consistently
    Delivery: how icons should ship to the browser (sprite vs no sprite) — production optimization / delivery strategy
    Right now, I think we should focus on (1) and (2) first: get a solid content + asset workflow in place, eliminate the CL1 icon path, then iterate on (3) in partnership with the Stratus team and ZTX.
    You, Dec 18, 3:36 PM
    i personally like: <Icon glyph="" where the name of the glyphe would be the exact name of the phosphor icon name. no abstraction or weird mapping.
    some benefits:
15. installing kumo requires just installing kumo, not installing two packages.
16. with sprites, you have one reference of an icon rather than rendering x number of instances that it is on the page. so there is a substantial improvement to performance over inlining it
    Rob Knecht, Dec 18, 3:40 PM
    We could introduce a dedicated legacy wrapper -- e.g. CL1 / <IconLegacy type="" /> to explicitly distinguish legacy usage and contexts. There may be overlap with what Phosphor and Stratus already use today, but this gives us a clear separation line.
    From there, we can treat <IconLegacy> (or whatever naming convention) as a migration target and burn down usage over time, eventually removing it once consumers have moved to the consolidated icon path.
    You, Dec 18, 3:40 PM
    and no rush on a decision here, appreciate you thinking about it. i posted our convo in opencode around this:
    https://paste.cfdata.org/kHmZM05jjvcy
    i really don't like <IconLegacy />
    because 8 years later…
    Rob Knecht, Dec 18, 3:44 PM
    yeah, I mean we need to be deliberate about prioritization and getting migrations completed.
    What could alternatives look like?
    <Icon glyph="cl1-right-arrow"
    You, Dec 18, 3:45 PM
    yeah.. that's good, flatten the list
    Rob Knecht, Dec 18, 3:55 PM
    Yeah I think we need to flesh out migration paths options. One of the issues is that current Icons in CL1 don't match the naming conventions in the origin. Not sure how to approach that naming conflict with Phosphor in the mix.
    You, Dec 18, 4:04 PM
    one other thing is discoverability... with the inline approach, idk what icons are available to me. i can look in node_modules or phosphor website. but with typescript types, you get all the names:
    Brayden Wilmoth, Dec 18, 4:57 PM
    If we're merging two libraries (e.g. Phosphor & internal) then you have to figure out how to surface props & educate people about them.
    For example, this icon in Phosphor being defined like this
    <AddressBook size={56} color="#e00000" weight="duotone" />
    Would it be identical wrapped in an <Icon /> abstraction we create? Phosphor takes size as a number of pixels.
    I could have the unpopular opinion in the room (as I sometimes do 😅) but I always prefer leaning away from over-engineering and layers of abstraction that newcomers have to learn instead of us just telling them to "we use Phosphor or insert icon pack here".
    If we ever decided to move away from Phosphor what happens to the glyph strings used that don't have 1:1?
    Sorry randomly dumping thoughts. At least things for us to think through.
    Brayden Wilmoth, Dec 18, 4:58 PM, Edited
    FWIW when I was migrating the Payments project from Fractus to Stratus the other night... Claude Code one-shot replaced the use of all icons to use Phosphor which was pretty cool to see
    You, Dec 18, 5:00 PM
    but we don't just use phosphor icons...
    Brayden Wilmoth, Dec 18, 5:00 PM
    Right, that's part of my point sadly. If we box up N icon libraries under one abstraction then it's harder to tell what we do use, what looks good together, etc
    Rob Knecht, Dec 18, 5:00 PM
    @Brayden Wilmoth I think to start this conversation maybe we need to begin at what we want to keep and what we want to translate to Phosphor? Phosphor is also changing names in coming versions
    You, Dec 18, 5:01 PM
    i am very sensitive to the abstractions argument, though.
    Brayden Wilmoth, Dec 18, 5:02 PM
    Maybe we can cover this in our Kumo talk tomorrow? 👀 Happy to hear you all out too!
    You, Dec 18, 5:04 PM
    yes absolutely. i feel bad i keep coming at ya'll with these architecture topics... it came up doing some button codemod mapping, since button usage involves the icon.
    Brayden Wilmoth, Dec 18, 5:04 PM
    haha these are the best kinds of topics to bring up 🙂
    You, Dec 18, 5:15 PM
    genuinely i am very cautious about abstractions. they're evil. i don't want to ever confuse our robot friends. i like to feed them our whole chat log on topics like these and provide a prompt like this:
    "this repo is large and uses a legacy <Icon /> pattern and kumo/phosphor icons. i'm proposing we introduce to kumo a similar <Icon/> component, but with a different underlying implementation using a sprite. weigh in as a senior architect and consider all these options, with a normative recommendation."
    i did the same thing with the semantic token.
    jonnie
    This is a great discussion. Let me synthesize everything and provide a recommendation.
    Analysis: Should Kumo Ship an <Icon /> Component?
    The Core Tension
    Brayden's concern (valid): Abstractions hide complexity, add learning curves, and can become legacy debt. Direct Phosphor usage is explicit and Claude can one-shot migrate it.
    Your concern (also valid):
17. Installing Kumo shouldn't require installing two packages
18. Sprites offer real performance benefits over inlined SVGs
19. TypeScript discoverability (glyph="" with autocomplete)
20. Codemods are simpler with a unified interface
21. Custom brand icons need a home
    Performance Reality Check
    From the articles you shared:
    Inlined SVGs (current Phosphor approach):

- Each icon instance = full SVG markup in DOM
- 100 instances of same icon = 100x the markup
- Tree-shaking helps bundle, but runtime DOM is bloated
  Sprite approach:
- Single <symbol> definition, <use href="#icon-name"> references
- 100 instances = 1 definition + 100 tiny <use> elements
- Significant DOM reduction, better paint performance
  The Abstraction Question
  The key insight from your chat: this isn't abstraction for abstraction's sake. It's:

1. Delivery optimization (sprite vs inline)
2. Content consolidation (Phosphor + brand icons)
3. Migration path (CL1 icons → unified system)
   A well-designed <Icon> isn't hiding Phosphor—it's solving a different problem: how icons ship to the browser.
   Recommended Design
   // Simple, explicit, no weird mapping
   <Icon glyph="address-book" size={20} weight="bold" />
   <Icon glyph="cf-workers" size={24} /> // brand icon
   // TypeScript provides discoverability
   type IconGlyph =
   | "address-book"
   | "arrow-right"
   | "check"
   // ... all phosphor icons
   | "cf-workers"
   | "cf-pages"
   // ... brand icons
   Key principles:
4. Flat namespace - no phosphor- or brand- prefixes, just the glyph name
5. Same props as Phosphor - size, weight, color work identically
6. Sprite under the hood - but consumers don't need to know
7. TypeScript autocomplete - solves discoverability
   Migration Strategy
   // Old CL1
   <Icon type="right-arrow" />
   // Codemod to
   <Icon glyph="arrow-right" />
   // Old direct Phosphor
   import { ArrowRight } from "@phosphor-icons/react"
   <ArrowRight size={20} />
   // Codemod to
   <Icon glyph="arrow-right" size={20} />
   The codemod is straightforward because:

- CL1 type → Kumo glyph (with name mapping table)
- Phosphor component name → kebab-case glyph name
  Figma Plugin Implications
  With this approach, the Figma plugin should:

1. Generate an Icon ComponentSet with all available glyphs as variants
2. Bind colors to semantic tokens (text-surface, text-muted, etc.)
3. Standard sizes (12, 16, 20, 24) as a size property
4. Instance swap ready - designers swap icons in Button, Checkbox, etc.
   Addressing Brayden's Concerns
   > "If we ever decided to move away from Phosphor what happens to the glyph strings?"
   > The glyph names ARE the abstraction boundary. If we switch to Lucide:

- Internal sprite changes
- Glyph names stay the same (or we provide a migration)
- Consumer code unchanged
  > "Phosphor takes size as a number of pixels"
  > Keep it identical:
  > <Icon glyph="address-book" size={56} color="#e00000" weight="duotone" />
  > No learning curve—same API, different delivery mechanism.
  > Recommendation
  > Ship <Icon /> in Kumo with:

1. Sprite-based delivery (Epic Stack pattern)
2. Flat glyph namespace (Phosphor names + brand icons)
3. Phosphor-compatible props (size, weight, color)
4. TypeScript union type for discoverability
5. Build-time sprite generation (not runtime)
   Don't:

- Create weird mappings or rename icons
- Hide the fact that we use Phosphor (document it)
- Over-engineer—start with Phosphor subset + brand icons
  This gives you:
- ✅ Single package install
- ✅ Performance (sprites)
- ✅ Discoverability (TypeScript)
- ✅ Simple codemods
- ✅ Brand icon support
- ✅ Figma plugin can generate matching components
  Want me to prototype this Icon component implementation?
