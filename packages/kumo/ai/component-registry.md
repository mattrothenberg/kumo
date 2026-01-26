# Kumo Component Registry

> Auto-generated component metadata for AI/agent consumption.

## Kumo Color System

**Critical Rule:** Only use Kumo semantic tokens. Never use raw Tailwind colors like `bg-gray-500` or `text-blue-600`.

### Quick Reference (Most Used)

| Purpose | Token | Usage |
|---------|-------|-------|
| Main page/card background | `bg-surface` | 13 components |
| Secondary/default button background | `bg-secondary` | 7 components |
| Border/divider color | `bg-color-3` | 5 components |
| Error state background | `bg-error` | 4 components |
| Primary text on surfaces | `text-surface` | 24 components |
| Placeholder text and disabled states | `text-muted` | 16 components |
| Form labels and secondary headings | `text-label` | 11 components |
| Error messages and validation | `text-error` | 9 components |
| Default border color | `ring-border` | 11 components |
| Border/divider color | `border-color` | 10 components |

### Dark Mode & Theming

Kumo uses CSS custom properties with `light-dark()` for automatic dark mode support.

**Mode Control (`data-mode`):**
```html
<html data-mode="light">  <!-- Light mode -->
<html data-mode="dark">   <!-- Dark mode -->
```

**Theme Variants (`data-theme`):**
- Default theme (no `data-theme` attribute needed)

**Never use `dark:` variants** - semantic tokens handle dark mode automatically.

### Surface Tokens (Backgrounds)

| Token | Purpose | Tailwind Classes |
|-------|---------|------------------|
| `tooltip-arrow-outer-stroke` | General styling | `bg-tooltip-arrow-outer-stroke` |
| `tooltip-arrow-inner-stroke` | General styling | `bg-tooltip-arrow-inner-stroke` |
| `surface` | Main page/card background | `bg-surface` |
| `surface-2` | Secondary surface layer | `bg-surface-2` |
| `surface-3` | Tertiary surface layer | `bg-surface-3` |
| `layer-card-primary` | Primary card layer background | `bg-layer-card-primary` |
| `surface-elevated` | Elevated surfaces (modals, dropdowns) | `bg-surface-elevated` |
| `surface-secondary` | Secondary background areas | `bg-surface-secondary` |
| `secondary` | Secondary/default button background | `bg-secondary` |
| `surface-inverse` | Inverse background (dark on light) | `bg-surface-inverse` |
| `primary` | Primary action background | `bg-primary` |

### Text Tokens

| Token | Purpose | Tailwind Class |
|-------|---------|----------------|
| `surface` | Primary text on surfaces | `text-surface` |
| `surface-inverse` | Text on inverse/dark surfaces | `text-surface-inverse` |
| `label` | Form labels and secondary headings | `text-label` |
| `muted` | Placeholder text and disabled states | `text-muted` |
| `disabled` | Disabled text | `text-disabled` |
| `brand` | Brand-colored text (Cloudflare orange) | `text-brand` |
| `green` | Success indicators | `text-green` |
| `info` | Informational text and links | `text-info` |
| `error` | Error messages and validation | `text-error` |
| `alert` | Warning messages | `text-alert` |

### State Tokens (Error, Warning, Info)

| Token | Purpose | Background | Text | Selection |
|-------|---------|------------|------|-----------|
| info | Info state background | `bg-info` | `text-info` | `bg-info-selection` |
| alert | Warning state background | `bg-alert` | `text-alert` | `bg-alert-selection` |
| error | Error state background | `bg-error` | `text-error` | `bg-error-selection` |

### Interactive Tokens (Hover, Focus, Active)

| Token | Purpose | Usage |
|-------|---------|-------|
| `active` | Active/focus ring color | `bg-active`, `ring-active` (1 uses) |
| `muted` | Muted/disabled background | `bg-muted`, `ring-muted` (1 uses) |
| `subtle` | Subtle hover background | `bg-subtle`, `ring-subtle` (2 uses) |
| `accent` | Selected/active state background | `bg-accent`, `ring-accent` (4 uses) |
| `hover` | Hover state background | `bg-hover`, `ring-hover` (2 uses) |
| `toast-button-hover` | Toast notification styling | `bg-toast-button-hover`, `ring-toast-button-hover` (1 uses) |
| `hover-selected` | Hover on selected items | `bg-hover-selected`, `ring-hover-selected` (2 uses) |

### Border & Ring Tokens

| Token | Purpose | Border | Ring |
|-------|---------|--------|------|
| `tooltip-border` | General styling | `border-tooltip-border` | `ring-tooltip-border` |
| `color` | Border/divider color | `border-color` | `ring-color` |
| `color-2` | Border/divider color | `border-color-2` | `ring-color-2` |
| `color-3` | Border/divider color | `border-color-3` | `ring-color-3` |
| `color-4` | Border/divider color | `border-color-4` | `ring-color-4` |
| `hover-border` | Hover state border | `border-hover-border` | `ring-hover-border` |
| `border` | Default border color | `border-border` | `ring-border` |
| `border-2` | Secondary border color | `border-border-2` | `ring-border-2` |

### Usage Patterns

**Most common color combinations in Kumo components:**

```tsx
// Card/container pattern
<div className="bg-surface border border-border rounded-lg">

// Button patterns
<button className="bg-primary text-white">Primary</button>
<button className="bg-secondary text-surface ring ring-border">Secondary</button>

// Form input pattern
<input className="bg-secondary text-surface ring ring-border focus:ring-active" />

// Error state pattern
<div className="bg-error/20 border-error text-error">Error message</div>

// Hover state pattern
<div className="bg-surface hover:bg-subtle">Hoverable item</div>
```

### Component-Specific Tokens

These tokens are used by specific components:

| Token | Purpose | Component |
|-------|---------|-----------|
| `black-icon` | Icon styling | Black |
| `icon-path` | Icon styling | Icon |
| `calendar` | Calendar component styling | Calendar |
| `calendar-day-range-selected-endpoints` | Calendar component styling | Calendar |
| `calendar-day-range-selected` | Calendar component styling | Calendar |
| `calendar-day-range-selected-out-of-range` | Calendar component styling | Calendar |
| `toast` | Toast notification styling | Toast |

---

### Badge

Badge component

**Type:** component

**Import:** `import { Badge } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `variant`: enum [default: primary]
  - `"primary"`: Default high-emphasis badge for important labels
  - `"secondary"`: Subtle badge for secondary information
  - `"destructive"`: Error or danger state indicator
  - `"outline"`: Bordered badge with transparent background
  - `"beta"`: Indicates beta or experimental features
- `className`: string
- `children`: ReactNode

**Colors (kumo tokens used):**

`bg-color`, `bg-error`, `bg-surface-inverse`, `border-color`, `border-primary`, `text-info`, `text-surface`, `text-surface-inverse`

**Examples:**

```tsx
<Badge variant="primary">Badge</Badge>
```


---

### Banner

Banner component

**Type:** component

**Import:** `import { Banner } from "@cloudflare/kumo";`

**Category:** Feedback

**Props:**

- `icon`: ReactNode
- `text`: string
- `children`: ReactNode
- `variant`: enum [default: default]
  - `"default"`: Informational banner for general messages
  - `"alert"`: Warning banner for cautionary messages
  - `"error"`: Error banner for critical issues
- `className`: string

**Colors (kumo tokens used):**

`bg-alert`, `bg-alert-selection`, `bg-error`, `bg-error-selection`, `bg-info`, `bg-info-selection`, `border-alert`, `border-error`, `border-info`, `text-alert`, `text-error`, `text-info`

**Examples:**

```tsx
<Banner variant="default" icon={<InfoIcon size={16} />}>This is a banner message</Banner>
```

```tsx
<Banner icon={<InfoIcon size={16} />}>
      <Text DANGEROUS_className="text-inherit">
        This banner supports <strong>custom content</strong> in the text slot.
      </Text>
    </Banner>
```


---

### Breadcrumbs

Breadcrumbs component

**Type:** block

**Import:** `import { Breadcrumbs } from "@cloudflare/kumo";`

**Category:** Block

**Props:**

- `size`: enum [default: base]
  - `"sm"`: Compact breadcrumbs for dense UIs
  - `"base"`: Default breadcrumbs size
- `children`: ReactNode
- `className`: string

**Colors (kumo tokens used):**

`text-disabled`, `text-green`, `text-muted`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Breadcrumbs.Link

Link sub-component

Props:
- `href`: string (required)
- `icon`: React.ReactNode

#### Breadcrumbs.Current

Current sub-component

Props:
- `loading`: boolean
- `icon`: React.ReactNode

#### Breadcrumbs.Separator

Separator sub-component

#### Breadcrumbs.Clipboard

Clipboard sub-component

Props:
- `text`: string (required)


**Examples:**

```tsx
<Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
    </Breadcrumbs>
```

```tsx
<Breadcrumbs size="sm">
  <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
  <Breadcrumbs.Separator />
  <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
  <Breadcrumbs.Separator />
  <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
</Breadcrumbs>
```

```tsx
<Breadcrumbs>
      <Breadcrumbs.Link href="/" icon={<House size={16} />}>
        Home
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/documents" icon={<Folder size={16} />}>
        Documents
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current icon={<File size={16} />}>
        File.txt
      </Breadcrumbs.Current>
    </Breadcrumbs>
```

```tsx
<Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects/web">Web Applications</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects/web/dashboard">
        Dashboard
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
    </Breadcrumbs>
```

```tsx
<Breadcrumbs>
      <Breadcrumbs.Current>Home</Breadcrumbs.Current>
    </Breadcrumbs>
```

```tsx
<Breadcrumbs>
      <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
      <Breadcrumbs.Clipboard text="https://example.com/projects/current-project" />
    </Breadcrumbs>
```


---

### Button

Button component

**Type:** component

**Import:** `import { Button } from "@cloudflare/kumo";`

**Category:** Action

**Props:**

- `children`: ReactNode
- `className`: string
- `icon`: ReactNode
- `loading`: boolean
- `shape`: enum [default: base]
  - `"base"`: Default rectangular button shape
  - `"square"`: Square button for icon-only actions
  - `"circle"`: Circular button for icon-only actions
- `size`: enum [default: base]
  - `"xs"`: Extra small button for compact UIs
  - `"sm"`: Small button for secondary actions
  - `"base"`: Default button size
  - `"lg"`: Large button for primary CTAs
- `variant`: enum [default: secondary]
  - `"primary"`: High-emphasis button for primary actions
  - `"secondary"`: Default button style for most actions
  - `"ghost"`: Minimal button with no background
  - `"destructive"`: Danger button for destructive actions like delete
  - `"secondary-destructive"`: Secondary button with destructive text for less prominent dangerous actions
  - `"outline"`: Bordered button with transparent background

  **State Classes:**
  - `"primary"`:
    - `hover`: `hover:bg-hover-selected`
    - `focus`: `focus:bg-hover-selected`
    - `disabled`: `disabled:bg-primary/50`
  - `"secondary"`:
    - `not-disabled`: `not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle`
    - `disabled`: `disabled:bg-secondary/50 disabled:!text-surface/70`
    - `data-state`: `data-[state=open]:bg-subtle`
  - `"ghost"`:
    - `hover`: `hover:bg-accent`
  - `"destructive"`:
    - `hover`: `hover:bg-error/70`
  - `"secondary-destructive"`:
    - `not-disabled`: `not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle`
    - `disabled`: `disabled:bg-secondary/50 disabled:!text-error/70`
    - `data-state`: `data-[state=open]:bg-subtle`
- `onChange`: React.FormEventHandler<HTMLButtonElement>
- `onSubmit`: React.FormEventHandler<HTMLButtonElement>
- `onClick`: React.MouseEventHandler<HTMLButtonElement>
- `defaultChecked`: boolean
- `defaultValue`: string | number | string[]
- `suppressContentEditableWarning`: boolean
- `suppressHydrationWarning`: boolean
- `contextMenu`: string
- `enterKeyHint`: enum
- `id`: string
- `lang`: string
- `nonce`: string
- `slot`: string
- `title`: string
- `radioGroup`: string
- `role`: React.AriaRole
- `about`: string
- `content`: string
- `datatype`: string
- `inlist`: unknown
- `prefix`: string
- `property`: string
- `rel`: string
- `resource`: string
- `rev`: string
- `typeof`: string
- `vocab`: string
- `autoCorrect`: string
- `autoSave`: string
- `color`: string
- `itemProp`: string
- `itemScope`: boolean
- `itemType`: string
- `itemID`: string
- `itemRef`: string
- `results`: number
- `security`: string
- `unselectable`: enum
- `popover`: enum
- `popoverTargetAction`: enum
- `popoverTarget`: string
- `inert`: boolean
- `inputMode`: enum
  Hints at the type of data that might be entered by the user while editing the element or its contents
- `is`: string
  Specify that a standard HTML element should behave like a defined custom built-in element
- `exportparts`: string
- `part`: string
- `disabled`: boolean
- `name`: string
- `type`: enum
- `value`: string | string[] | number

**Colors (kumo tokens used):**

`bg-accent`, `bg-error`, `bg-hover-selected`, `bg-primary`, `bg-secondary`, `bg-subtle`, `bg-surface`, `border-subtle`, `ring-active`, `ring-border`, `text-error`, `text-muted`, `text-surface`

**Examples:**

```tsx
<Button variant="primary">Button</Button>
```

```tsx
<Button size="xs">Button</Button>
```

```tsx
<Button shape="base" icon={PlusIcon} />
```

```tsx
<Button variant="primary" disabled={true}>Button</Button>
```

```tsx
<Button variant="primary" icon={PlusIcon}>Add Item</Button>
```

```tsx
<Button variant="primary" loading={true}>Loading...</Button>
```


---

### Checkbox

Checkbox component

**Type:** component

**Import:** `import { Checkbox } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default checkbox appearance
  - `"error"`: Error state for validation failures

  **State Classes:**
  - `"default"`:
    - `focus`: `[&:focus-within>span]:ring-active`
    - `hover`: `[&:hover>span]:ring-active`
- `label`: ReactNode
  Label content for the checkbox (enables built-in Field wrapper) - can be a string or any React node
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `controlFirst`: boolean
  When true (default), checkbox appears before label. When false, label appears before checkbox.
- `checked`: boolean
  Whether the checkbox is checked (controlled)
- `indeterminate`: boolean
  Whether the checkbox is in indeterminate state
- `disabled`: boolean
  Whether the checkbox is disabled
- `onChange`: object
- `onClick`: object
  Click handler
- `name`: string
  Name for form submission
- `required`: boolean
  Whether the field is required
- `className`: string
  Additional class name
- `onCheckedChange`: (checked: boolean) => void
  Callback when checked state changes
- `onValueChange`: (checked: boolean) => void
  @deprecated Use onCheckedChange instead

**Colors (kumo tokens used):**

`bg-surface`, `bg-surface-inverse`, `border-border`, `ring-active`, `ring-border`, `ring-error`, `text-error`, `text-muted`, `text-surface`, `text-surface-inverse`

**Styling:**

- **Dimensions:** `h-4 w-4`
- **Border Radius:** `rounded-sm`
- **Base Tokens:** `bg-surface`, `ring-border`
- **States:**
  - `checked`: `bg-surface-inverse`, `text-surface-inverse`
  - `indeterminate`: `bg-surface-inverse`, `text-surface-inverse`
  - `error`: `ring-error`
  - `hover`: `ring-active`
  - `focus`: `ring-active`
  - `disabled`: `opacity-50`, `cursor-not-allowed`
- **Icons:**
  - `ph-check` (checked) size 12
  - `ph-minus` (indeterminate) size 12

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Checkbox.Item

Item sub-component

#### Checkbox.Group

Group sub-component

Props:
- `legend`: string (required)
- `children`: ReactNode (required)
- `error`: string
- `description`: ReactNode
- `defaultValue`: string[]
- `value`: string[]
- `allValues`: string[]
- `disabled`: boolean
- `controlFirst`: boolean
- `className`: string


**Examples:**

```tsx
<div className="flex flex-col gap-4">
      {Object.keys(KUMO_CHECKBOX_VARIANTS.variant).map((variant) => (
        <div
          key={variant}
          className="border border-dotted border-color bg-surface p-4"
        >
          <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted uppercase">
            {variant}
          </div>
          <VariantCheckbox variant={variant} />
        </div>
      ))}
    </div>
```

```tsx
<Checkbox
        label="I'm checked"
        checked={checked}
        onCheckedChange={setChecked}
      />
```

```tsx
<Checkbox
        label="Indeterminate state"
        indeterminate={indeterminate}
        onCheckedChange={() => setIndeterminate(false)}
      />
```

```tsx
<div className="flex flex-col gap-4">
      {[false, true, "indeterminate"].map((state) => (
        <Checkbox
          key={String(state)}
          label={`Disabled (${state === "indeterminate" ? "indeterminate" : state ? "checked" : "unchecked"})`}
          checked={state === true}
          indeterminate={state === "indeterminate"}
          disabled
        />
      ))}
    </div>
```

```tsx
<div className="flex flex-col gap-4">
      {[false, true].map((checked) => (
        <Checkbox
          key={String(checked)}
          label={`Error (${checked ? "checked" : "unchecked"})`}
          variant="error"
          checked={checked}
        />
      ))}
    </div>
```

```tsx
<Checkbox
        label="Label first"
        controlFirst={false}
        checked={checked}
        onCheckedChange={setChecked}
      />
```

```tsx
<Checkbox
        label="Subscribe to newsletter"
        required={false}
        checked={checked}
        onCheckedChange={setChecked}
      />
```

```tsx
<Checkbox
        label="Enable two-factor authentication"
        labelTooltip="Adds an extra layer of security to your account"
        checked={checked}
        onCheckedChange={setChecked}
      />
```

```tsx
<Checkbox
        label="Remember my preferences"
        required={false}
        labelTooltip="We'll save your settings for next time"
        checked={checked}
        onCheckedChange={setChecked}
      />
```

```tsx
<Checkbox.Group legend="Choose your preferences">
      <Checkbox.Item label="Email notifications" name="preferences" />
      <Checkbox.Item label="SMS notifications" name="preferences" />
      <Checkbox.Item label="Push notifications" name="preferences" />
    </Checkbox.Group>
```

```tsx
<Checkbox.Group
      legend="Required preferences"
      error="You must select at least one notification method"
    >
      <Checkbox.Item label="Email notifications" name="preferences" />
      <Checkbox.Item label="SMS notifications" name="preferences" />
      <Checkbox.Item label="Push notifications" name="preferences" />
    </Checkbox.Group>
```

```tsx
<Checkbox.Group
      legend="Notification settings"
      description="Choose how you want to be notified about important updates"
    >
      <Checkbox.Item label="Email notifications" value="email" />
      <Checkbox.Item label="SMS notifications" value="sms" />
      <Checkbox.Item label="Push notifications" value="push" />
    </Checkbox.Group>
```

```tsx
<Checkbox.Group
      legend="Marketing preferences"
      description="Pre-selected with email notifications enabled"
      defaultValue={["email"]}
    >
      <Checkbox.Item label="Email notifications" value="email" />
      <Checkbox.Item label="SMS notifications" value="sms" />
      <Checkbox.Item label="Push notifications" value="push" />
    </Checkbox.Group>
```

```tsx
<div className="flex flex-col gap-4">
        <Checkbox.Group
          legend="Notification preferences"
          description="Controlled state - selected values shown below"
          value={value}
          onValueChange={setValue}
        >
          <Checkbox.Item label="Email notifications" value="email" />
          <Checkbox.Item label="SMS notifications" value="sms" />
          <Checkbox.Item label="Push notifications" value="push" />
        </Checkbox.Group>
        <div className="rounded-md bg-surface-elevated p-4">
          <div className="mb-2 text-sm font-medium text-surface">Selected:</div>
          <code className="text-sm text-muted">{JSON.stringify(value)}</code>
        </div>
      </div>
```

```tsx
<div className="flex flex-col gap-8">
      {/* English (LTR) - Control First: Checkbox → Label */}
      <fieldset className="rounded border border-border p-4">
        <legend className="px-2 text-base font-semibold text-surface">
          English (Checkbox → Label)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox label="Checkbox is unchecked" controlFirst={true} />
          <Checkbox
            label="Checkbox is unchecked and disabled"
            disabled
            controlFirst={true}
          />
          <Checkbox label="Checkbox is checked" checked controlFirst={true} />
          <Checkbox
            label="Checkbox is checked and disabled"
            checked
            disabled
            controlFirst={true}
          />
        </div>
      </fieldset>

      {/* Spanish (LTR) - Label First: Label → Checkbox */}
      <fieldset className="rounded border border-border p-4">
        <legend className="px-2 text-base font-semibold text-surface">
          Español (Etiqueta → Casilla de verificación)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox label="La casilla está desmarcada" controlFirst={false} />
          <Checkbox
            label="La casilla está desmarcada y deshabilitada"
            disabled
            controlFirst={false}
          />
          <Checkbox
            label="La casilla está marcada"
            checked
            controlFirst={false}
          />
          <Checkbox
            label="La casilla está marcada y deshabilitada"
            checked
            disabled
            controlFirst={false}
          />
        </div>
      </fieldset>

      {/* Arabic (RTL) - Control First: Checkbox → Label */}
      <fieldset className="rounded border border-border p-4" dir="rtl">
        <legend className="px-2 text-base font-semibold text-surface">
          العربية (مربع الاختيار ← التسمية)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox label="مربع الاختيار غير محدد" controlFirst={true} />
          <Checkbox
            label="مربع الاختيار غير محدد ومعطل"
            disabled
            controlFirst={true}
          />
          <Checkbox label="مربع الاختيار محدد" checked controlFirst={true} />
          <Checkbox
            label="مربع الاختيار محدد ومعطل"
            checked
            disabled
            controlFirst={true}
          />
        </div>
      </fieldset>

      {/* Hebrew (RTL) - Label First: Label → Checkbox */}
      <fieldset className="rounded border border-border p-4" dir="rtl">
        <legend className="px-2 text-base font-semibold text-surface">
          עברית (תווית ← תיבת סימון)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox label="תיבת הסימון לא מסומנת" controlFirst={false} />
          <Checkbox
            label="תיבת הסימון לא מסומנת ומושבתת"
            disabled
            controlFirst={false}
          />
          <Checkbox label="תיבת הסימון מסומנת" checked controlFirst={false} />
          <Checkbox
            label="תיבת הסימון מסומנת ומושבתת"
            checked
            disabled
            controlFirst={false}
          />
        </div>
      </fieldset>
    </div>
```

```tsx
<div className="flex flex-col gap-8">
      {/* English (LTR) - Control First: Checkbox → Label */}
      <div>
        <Checkbox.Group legend="English (Checkbox → Label)" controlFirst={true}>
          <Checkbox.Item label="Email notifications" value="email" />
          <Checkbox.Item label="SMS notifications" value="sms" />
          <Checkbox.Item label="Push notifications" value="push" />
          <Checkbox.Item label="In-app notifications" value="in-app" disabled />
        </Checkbox.Group>
      </div>

      {/* Spanish (LTR) - Label First: Label → Checkbox */}
      <div>
        <Checkbox.Group
          legend="Español (Etiqueta → Casilla de verificación)"
          controlFirst={false}
        >
          <Checkbox.Item
            label="Notificaciones por correo electrónico"
            value="email"
          />
          <Checkbox.Item label="Notificaciones por SMS" value="sms" />
          <Checkbox.Item label="Notificaciones push" value="push" />
          <Checkbox.Item
            label="Notificaciones en la aplicación"
            value="in-app"
            disabled
          />
        </Checkbox.Group>
      </div>

      {/* Arabic (RTL) - Control First: Checkbox → Label */}
      <div dir="rtl">
        <Checkbox.Group
          legend="العربية (مربع الاختيار ← التسمية)"
          controlFirst={true}
        >
          <Checkbox.Item label="إشعارات البريد الإلكتروني" value="email" />
          <Checkbox.Item label="إشعارات الرسائل القصيرة" value="sms" />
          <Checkbox.Item label="الإشعارات الفورية" value="push" />
          <Checkbox.Item
            label="الإشعارات داخل التطبيق"
            value="in-app"
            disabled
          />
        </Checkbox.Group>
      </div>

      {/* Hebrew (RTL) - Label First: Label → Checkbox */}
      <div dir="rtl">
        <Checkbox.Group
          legend="עברית (תווית ← תיבת סימון)"
          controlFirst={false}
        >
          <Checkbox.Item label="התראות אימייל" value="email" />
          <Checkbox.Item label="התראות SMS" value="sms" />
          <Checkbox.Item label="התראות דחיפה" value="push" />
          <Checkbox.Item
            label="התראות בתוך האפליקציה"
            value="in-app"
            disabled
          />
        </Checkbox.Group>
      </div>
    </div>
```


---

### ClipboardText

ClipboardText component

**Type:** component

**Import:** `import { ClipboardText } from "@cloudflare/kumo";`

**Category:** Action

**Props:**

- `size`: enum [default: lg]
  - `"sm"`: Small clipboard text for compact UIs
  - `"base"`: Default clipboard text size
  - `"lg"`: Large clipboard text for prominent display
- `text`: string (required)
  The text to display and copy to clipboard
- `className`: string
  Additional CSS classes

**Colors (kumo tokens used):**

`bg-surface`, `border-color`

**Styling:**

- **Base Tokens:** `bg-surface`, `text-surface`, `ring-border`, `border-color`
- **States:**
  - `input`: `bg-secondary`, `text-surface`, `ring-border`
  - `text`: `bg-surface`, `font-mono`
  - `button`: `border-color`
- **Icons:**
  - `ph-clipboard` (default) size 16
  - `ph-check` (copied) size 16
- **Input Styles:**
  - Base: `bg-secondary text-surface ring ring-border`
  - Sizes:
    - `xs`: `h-5 gap-1 rounded-sm px-1.5 text-xs`
    - `sm`: `h-6.5 gap-1 rounded-md px-2 text-xs`
    - `base`: `h-9 gap-1.5 rounded-lg px-3 text-base`
    - `lg`: `h-10 gap-2 rounded-lg px-4 text-base`
- **Size Variants:**
  - `sm`:
    - Height: 26px
    - Classes: `text-xs`
    - Button Size: `sm`
    - Dimensions:
      - paddingX: 8
      - gap: 1
      - borderRadius: 6
      - fontSize: 12
  - `base`:
    - Height: 36px
    - Classes: `text-sm`
    - Button Size: `base`
    - Dimensions:
      - paddingX: 12
      - gap: 6
      - borderRadius: 8
      - fontSize: 14
  - `lg`:
    - Height: 40px
    - Classes: `text-sm`
    - Button Size: `lg`
    - Dimensions:
      - paddingX: 16
      - gap: 8
      - borderRadius: 8
      - fontSize: 14

**Examples:**

```tsx
<ClipboardText size="sm" text="npm install @cloudflare/kumo" />
```

```tsx
<ClipboardText text="sk_live_abc123xyz789" />
```


---

### Code

Code component

**Type:** component

**Import:** `import { Code } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `lang`: enum [default: ts]
  - `"ts"`: TypeScript code
  - `"tsx"`: TypeScript JSX code
  - `"jsonc"`: JSON with comments
  - `"bash"`: Shell/Bash commands
  - `"css"`: CSS styles
- `code`: string (required)
  The code content to display
- `values`: Record<string, { value: string; highlight?: boolean }>
  Template values for interpolation
- `className`: string
  Additional CSS classes

**Colors (kumo tokens used):**

`bg-surface`, `border-color`, `text-label`

**Styling:**

- **Dimensions:** `m-0 w-auto p-0`
- **Border Radius:** `rounded-none`
- **Base Tokens:** `text-label`
- **States:**
  - `base`: `bg-transparent`, `border-none`, `font-mono`, `text-sm`, `leading-[20px]`
  - `code_block_container`: `min-w-0`, `rounded-md`, `border`, `border-color`, `bg-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Code.Block

Block sub-component

Props:
- `code`: string (required)
- `lang`: CodeLang


**Examples:**

```tsx
<Code lang="ts" code='const hello = "world";' />
```

```tsx
<CodeBlock
      lang="tsx"
      code={`<Button variant="primary">
  Click me
</Button>`}
    />
```


---

### Collapsible

Collapsible component for showing/hiding content. Features: - Animated chevron indicator (rotates 180° when open) - Accessible with aria-expanded and aria-controls - Content panel with left border accent ```tsx const [open, setOpen] = useState(false); <Collapsible label="Show details" open={open} onOpenChange={setOpen}> <Text>Hidden content revealed when expanded.</Text> </Collapsible> ``` ```tsx const [activeIndex, setActiveIndex] = useState<number | null>(null); {items.map((item, i) => ( <Collapsible key={i} label={item.title} open={activeIndex === i} onOpenChange={(open) => setActiveIndex(open ? i : null)} > {item.content} </Collapsible> ))} ```

**Type:** component

**Import:** `import { Collapsible } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `children`: ReactNode
- `label`: string (required)
  Text label displayed in the trigger button
- `open`: boolean
  Whether the collapsible content is visible
- `className`: string
  Additional CSS classes for the content panel
- `onOpenChange`: (open: boolean) => void
  Callback when collapsed state changes

**Colors (kumo tokens used):**

`border-color`, `text-info`

**Examples:**

```tsx
<Collapsible label="Click to expand" open={open} onOpenChange={setOpen}>
        <Text>
          This is the collapsible content that can be shown or hidden.
        </Text>
      </Collapsible>
```


---

### Combobox

Combobox component

**Type:** component

**Import:** `import { Combobox } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `inputSide`: enum [default: right]
  - `"right"`: Input positioned inline to the right of chips
  - `"top"`: Input positioned above chips
- `items`: T[] (required)
  Array of items to display in the dropdown
- `value`: T | T[]
  Currently selected value(s)
- `children`: ReactNode
  Combobox content (trigger, content, items)
- `className`: string
  Additional CSS classes
- `label`: ReactNode
  Label content for the combobox (enables Field wrapper) - can be a string or any React node
- `required`: boolean
  Whether the combobox is required
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `description`: ReactNode
  Helper text displayed below the combobox
- `error`: string | object
  Error message or validation error object
- `onValueChange`: (value: T | T[]) => void
  Callback when selection changes
- `multiple`: boolean
  Allow multiple selections
- `isItemEqualToValue`: (item: T, value: T) => boolean
  Custom equality function for comparing items

**Colors (kumo tokens used):**

`bg-color-2`, `bg-color-3`, `bg-secondary`, `fill-active`, `ring-border`, `text-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Combobox.Content

Content sub-component

Props:
- `className`: string
- `align`: ComboboxBase.Positioner.Props["align"]
- `alignOffset`: ComboboxBase.Positioner.Props["alignOffset"]
- `side`: ComboboxBase.Positioner.Props["side"]
- `sideOffset`: ComboboxBase.Positioner.Props["sideOffset"]

#### Combobox.TriggerValue

TriggerValue sub-component

#### Combobox.TriggerInput

TriggerInput sub-component

#### Combobox.TriggerMultipleWithInput

TriggerMultipleWithInput sub-component

#### Combobox.Chip

Chip sub-component

#### Combobox.Item

Item sub-component

#### Combobox.Input

Input sub-component

#### Combobox.Empty

Empty sub-component

#### Combobox.GroupLabel

GroupLabel sub-component

#### Combobox.Group

Group sub-component

#### Combobox.List

A container for combobox items. Supports render prop for custom item rendering. Renders a `<div>` element.

Props:
- `children`: ReactNode | ((item: T, index: number) => ReactNode) - Items to render, or a function that receives each item and returns a node

Usage:
```tsx
<Combobox.List>
  {(item) => <Combobox.Item value={item}>{item.label}</Combobox.Item>}
</Combobox.List>
```

#### Combobox.Collection

Renders filtered list items. Use when you need more control over item rendering.

Props:
- `children`: (item: T, index: number) => ReactNode (required) - Function that receives each filtered item and returns a node

Usage:
```tsx
<Combobox.Collection>
  {(item, index) => (
    <Combobox.Item key={index} value={item}>
      {item.label}
    </Combobox.Item>
  )}
</Combobox.Collection>
```


**Examples:**

```tsx
<Combobox items={items} value={value} onValueChange={setValue}>
        <Combobox.TriggerInput placeholder="Please select database" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
```

```tsx
<Combobox
        items={items}
        value={value}
        onValueChange={setValue}
        label="Country"
      >
        <Combobox.TriggerInput placeholder="Select country" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
```

```tsx
<Combobox
        items={items}
        value={value}
        onValueChange={setValue}
        label="Subscription Plan"
        description="Choose a plan that fits your needs"
        error={{ message: "Please select a plan to continue", match: true }}
      >
        <Combobox.TriggerInput placeholder="Select plan" />
        <Combobox.Content>
          <Combobox.Empty />
          <Combobox.List>
            {(item: (typeof items)[number]) => {
              return (
                <Combobox.Item key={item.value} value={item}>
                  {item.label}
                </Combobox.Item>
              );
            }}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
```


---

### CommandPalette

CommandPalette component

**Type:** component

**Import:** `import { CommandPalette } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `open`: boolean (required)
  Whether the dialog is open
- `children`: ReactNode
  Child content - typically one or more Panel components

**Colors (kumo tokens used):**

`bg-alert`, `bg-color-3`, `bg-subtle`, `bg-surface-2`, `bg-surface-elevated`, `ring-border`, `text-label`, `text-muted`, `text-surface`

**Examples:**

```tsx
<>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={sampleGroups}
          value={search}
          onValueChange={setSearch}
          itemToStringValue={(group) => group.label}
          getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
          onSelect={(item) => {
            console.log("Selected:", item);
            setOpen(false);
          }}
        >
          <CommandPalette.Input
            placeholder="Search..."
            trailing={
              <Button
                className="m-0 h-5 p-0"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
              >
                <Kbd>Esc</Kbd>
              </Button>
            }
          />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        breadcrumbs={item.breadcrumbs}
                        description={item.description}
                        icon={item.icon}
                        nonInteractive={item.nonInteractive}
                        onClick={() => {
                          console.log("Clicked:", item);
                          setOpen(false);
                        }}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
            <CommandPalette.Empty>No results found</CommandPalette.Empty>
          </CommandPalette.List>
          <CommandPalette.Footer>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                Select
              </span>
            </div>
          </CommandPalette.Footer>
        </CommandPalette.Root>
      </>
```

```tsx
<>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={itemsWithHighlights}
          itemToStringValue={(group) => group.label}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        breadcrumbs={item.breadcrumbs}
                        titleHighlights={[[0, 5]]}
                        onClick={() => setOpen(false)}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
```

```tsx
<>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={[]}
          itemToStringValue={() => ""}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Loading />
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
```

```tsx
<>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={groups}
          itemToStringValue={(group) => group.label}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        external={item.external}
                        onClick={() => setOpen(false)}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
```

```tsx
<>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <p className="mt-4 text-sm text-muted">
          Click a zone feature to drill down into zone selection. Press
          Backspace (when input is empty) to go back.
        </p>

        {/* Dialog stays mounted, Panel content swaps */}
        <CommandPalette.Dialog open={open} onOpenChange={handleOpenChange}>
          {isInDrillDown ? (
            // Zone Picker Panel
            <CommandPalette.Panel
              items={zoneGroups}
              value={search}
              onValueChange={setSearch}
              itemToStringValue={(group) => group.label}
              open={open}
              getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
              onSelect={(item) => handleZoneSelect(item)}
            >
              <CommandPalette.Input
                placeholder="Search for a domain..."
                onKeyDown={handleZoneKeyDown}
                leading={
                  <button
                    onClick={handleBack}
                    className="flex h-4 w-4 items-center justify-center rounded transition-colors hover:bg-accent"
                    aria-label="Back"
                  >
                    <ArrowLeftIcon
                      className="h-4 w-4 text-muted"
                      weight="bold"
                    />
                  </button>
                }
                trailing={
                  <Button
                    className="m-0 h-5 p-0"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    <Kbd>Esc</Kbd>
                  </Button>
                }
              />
              <CommandPalette.List>
                <CommandPalette.Results>
                  {(group: SearchGroup) => (
                    <CommandPalette.Group key={group.label} items={group.items}>
                      <CommandPalette.GroupLabel>
                        {group.label}
                      </CommandPalette.GroupLabel>
                      <CommandPalette.Items>
                        {(item: SearchItem) => (
                          <CommandPalette.ResultItem
                            key={item.id}
                            value={item}
                            title={item.title}
                            icon={item.icon}
                            onClick={() => handleZoneSelect(item)}
                          />
                        )}
                      </CommandPalette.Items>
                    </CommandPalette.Group>
                  )}
                </CommandPalette.Results>
                <CommandPalette.Empty>No domains found</CommandPalette.Empty>
              </CommandPalette.List>
              <CommandPalette.Footer>
                <div className="flex items-center gap-1.5 text-muted">
                  <TreeStructureIcon className="h-4 w-4" />
                  <span className="font-medium">{drillDown.featureTitle}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Kbd>⌫</Kbd>
                    to go back
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    to select
                  </span>
                </div>
              </CommandPalette.Footer>
            </CommandPalette.Panel>
          ) : (
            // Main Search Panel
            <CommandPalette.Panel
              items={mainGroups}
              value={search}
              onValueChange={setSearch}
              itemToStringValue={(group) => group.label}
              open={open}
              getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
              onSelect={(item) => handleMainSelect(item)}
            >
              <CommandPalette.Input
                placeholder="Search..."
                trailing={
                  <Button
                    className="m-0 h-5 p-0"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    <Kbd>Esc</Kbd>
                  </Button>
                }
              />
              <CommandPalette.List>
                <CommandPalette.Results>
                  {(group: SearchGroup) => (
                    <CommandPalette.Group key={group.label} items={group.items}>
                      <CommandPalette.GroupLabel>
                        {group.label}
                      </CommandPalette.GroupLabel>
                      <CommandPalette.Items>
                        {(item: SearchItem) => (
                          <CommandPalette.ResultItem
                            key={item.id}
                            value={item}
                            title={item.title}
                            breadcrumbs={item.breadcrumbs}
                            icon={item.icon}
                            onClick={() => handleMainSelect(item)}
                          />
                        )}
                      </CommandPalette.Items>
                    </CommandPalette.Group>
                  )}
                </CommandPalette.Results>
                <CommandPalette.Empty>No results found</CommandPalette.Empty>
              </CommandPalette.List>
              <CommandPalette.Footer>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    to select
                  </span>
                </div>
              </CommandPalette.Footer>
            </CommandPalette.Panel>
          )}
        </CommandPalette.Dialog>
      </>
```


---

### DateRangePicker

DateRangePicker component

**Type:** component

**Import:** `import { DateRangePicker } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `size`: enum [default: base]
  - `"sm"`: Compact calendar for tight spaces
  - `"base"`: Default calendar size
  - `"lg"`: Large calendar for prominent date selection
- `variant`: enum [default: default]
  - `"default"`: Default calendar appearance
  - `"subtle"`: Subtle calendar with minimal background
- `timezone`: string
  Display timezone (display only)
- `className`: string
  Additional CSS classes
- `onStartDateChange`: (date: Date | null) => void
  Callback when start date changes
- `onEndDateChange`: (date: Date | null) => void
  Callback when end date changes

**Colors (kumo tokens used):**

`bg-calendar`, `bg-calendar-day-range-selected`, `bg-calendar-day-range-selected-endpoints`, `bg-calendar-day-range-selected-out-of-range`, `bg-hover`, `bg-surface`, `text-label`, `text-muted`, `text-surface`, `text-surface-inverse`

**Styling:**

- **Size Variants:**
  - `sm`:
    - Classes: `p-3 gap-2`
    - Dimensions:
      - calendarWidth: 168
      - cellHeight: 22
      - cellWidth: 24
      - textSize: 12
      - iconSize: 14
      - padding: 12
      - gap: 8
  - `base`:
    - Classes: `p-4 gap-2.5`
    - Dimensions:
      - calendarWidth: 196
      - cellHeight: 26
      - cellWidth: 28
      - textSize: 14
      - iconSize: 16
      - padding: 16
      - gap: 10
  - `lg`:
    - Classes: `p-5 gap-3`
    - Dimensions:
      - calendarWidth: 252
      - cellHeight: 32
      - cellWidth: 36
      - textSize: 16
      - iconSize: 18
      - padding: 20
      - gap: 12

**Examples:**

```tsx
<DateRangePicker size="sm" onStartDateChange={() => {}} onEndDateChange={() => {}} />
```

```tsx
<DateRangePicker variant="default" onStartDateChange={() => {}} onEndDateChange={() => {}} />
```

```tsx
<DateRangePicker timezone="UTC (GMT+0)" />
```


---

### Dialog

Dialog component

**Type:** component

**Import:** `import { Dialog } from "@cloudflare/kumo";`

**Category:** Overlay

**Props:**

- `className`: string
- `children`: ReactNode
- `size`: enum [default: base]
  - `"base"`: Default dialog width
  - `"sm"`: Small dialog for simple confirmations
  - `"lg"`: Large dialog for complex content
  - `"xl"`: Extra large dialog for detailed views

**Colors (kumo tokens used):**

`bg-color-3`, `bg-surface`, `text-surface`

**Styling:**

- **Base Tokens:** `bg-surface`, `text-surface`, `border-border`, `shadow-m`
- **States:**
  - `base`: `bg-surface`, `text-surface`, `shadow-m`
  - `backdrop`: `bg-color-3`, `opacity-80`
- **Size Variants:**
  - `sm`:
    - Classes: `min-w-72`
    - Dimensions:
      - paddingX: 16
      - paddingY: 16
      - gap: 8
      - borderRadius: 12
  - `base`:
    - Classes: `min-w-96`
    - Dimensions:
      - paddingX: 24
      - paddingY: 24
      - gap: 16
      - borderRadius: 12
  - `lg`:
    - Classes: `min-w-[32rem]`
    - Dimensions:
      - paddingX: 24
      - paddingY: 24
      - gap: 16
      - borderRadius: 12
  - `xl`:
    - Classes: `min-w-[48rem]`
    - Dimensions:
      - paddingX: 24
      - paddingY: 24
      - gap: 16
      - borderRadius: 12

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Dialog.Root

Controls the open state of the dialog. Doesn't render its own HTML element.

Props:
- `open`: boolean - Whether the dialog is currently open (controlled mode)
- `defaultOpen`: boolean [default: false] - Whether the dialog is initially open (uncontrolled mode)
- `onOpenChange`: (open: boolean, event: Event) => void - Callback fired when the dialog opens or closes
- `modal`: boolean | 'trap-focus' [default: true] - Whether the dialog is modal. When true, focus is trapped and page scroll is locked
- `dismissible`: boolean [default: true] - Whether clicking outside closes the dialog

Usage:
```tsx
<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
```
```tsx
<Dialog.Root defaultOpen={false}>
```

#### Dialog.Trigger

A button that opens the dialog when clicked. Renders a `<button>` element.

Props:
- `render`: ReactElement | ((props, state) => ReactElement) - Custom element to render instead of the default button
- `disabled`: boolean - Whether the trigger is disabled

Usage:
```tsx
<Dialog.Trigger render={<Button>Open</Button>} />
```
```tsx
<Dialog.Trigger>Open Dialog</Dialog.Trigger>
```

#### Dialog.Title

A heading that labels the dialog for accessibility. Renders a `<h2>` element.

Props:
- `render`: ReactElement | ((props, state) => ReactElement) - Custom element to render instead of the default h2

Usage:
```tsx
<Dialog.Title>Confirm Action</Dialog.Title>
```
```tsx
<Dialog.Title render={<h3 />}>Custom Heading</Dialog.Title>
```

#### Dialog.Description

A paragraph providing additional context about the dialog. Renders a `<p>` element.

Props:
- `render`: ReactElement | ((props, state) => ReactElement) - Custom element to render instead of the default p

Usage:
```tsx
<Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
```

#### Dialog.Close

A button that closes the dialog when clicked. Renders a `<button>` element.

Props:
- `render`: ReactElement | ((props, state) => ReactElement) - Custom element to render instead of the default button
- `disabled`: boolean - Whether the close button is disabled

Usage:
```tsx
<Dialog.Close render={<Button>Cancel</Button>} />
```
```tsx
<Dialog.Close>×</Dialog.Close>
```


**Examples:**

```tsx
<Dialog.Root>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog className="p-6" size={args.size}>
        <Dialog.Title className="mb-2 text-xl font-semibold">
          Dialog Title
        </Dialog.Title>
        <Dialog.Description className="mb-4 text-muted">
          This is a dialog description with some content.
        </Dialog.Description>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog>
    </Dialog.Root>
```

```tsx
<Dialog.Root>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog className="p-6" size={args.size}>
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl font-semibold">
            Dialog Title
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          This is a dialog description with some content explaining the purpose
          of this dialog.
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />
          <Button variant="primary">Confirm</Button>
        </div>
      </Dialog>
    </Dialog.Root>
```

```tsx
<Dialog.Root>
      <Dialog.Trigger render={<Button variant="destructive">Delete</Button>} />
      <Dialog className="p-6" size="sm">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-lg font-semibold">
            Delete Item
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </div>
      </Dialog>
    </Dialog.Root>
```

```tsx
<div className="flex flex-wrap gap-4">
      <Dialog.Root>
        <Dialog.Trigger render={<Button>Small (sm)</Button>} />
        <Dialog className="p-6" size="sm">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Small Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is a small dialog for simple confirmations.
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Base (default)</Button>} />
        <Dialog className="p-6" size="base">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Base Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is the default dialog size for most use cases.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Large (lg)</Button>} />
        <Dialog className="p-6" size="lg">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Large Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is a large dialog for complex content that needs more space.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Extra Large (xl)</Button>} />
        <Dialog className="p-6" size="xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Extra Large Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is an extra large dialog for detailed views and complex forms.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>
    </div>
```

```tsx
<Dialog.Root>
      <Dialog.Trigger render={<Button>Edit Profile</Button>} />
      <Dialog className="p-6" size="base">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl font-semibold">
            Edit Profile
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          Update your profile information below.
        </Dialog.Description>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              aria-label="Name"
              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-label="Email"
              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Save Changes</Button>
          </div>
        </form>
      </Dialog>
    </Dialog.Root>
```


---

### DropdownMenu

DropdownMenu component

**Type:** component

**Import:** `import { DropdownMenu } from "@cloudflare/kumo";`

**Category:** Overlay

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default dropdown item appearance
  - `"danger"`: Destructive action item

**Colors (kumo tokens used):**

`bg-accent`, `bg-color-3`, `bg-error-selection`, `bg-muted`, `bg-secondary`, `ring-border`, `text-error`, `text-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### DropdownMenu.Trigger

Trigger sub-component

#### DropdownMenu.Portal

Portal sub-component (wraps DropdownMenuPrimitive)

#### DropdownMenu.Sub

Sub sub-component (wraps DropdownMenuPrimitive)

#### DropdownMenu.SubTrigger

SubTrigger sub-component

#### DropdownMenu.SubContent

SubContent sub-component

#### DropdownMenu.Content

Content sub-component

#### DropdownMenu.Item

Item sub-component

#### DropdownMenu.CheckboxItem

CheckboxItem sub-component

#### DropdownMenu.Label

Label sub-component

#### DropdownMenu.Separator

Separator sub-component

#### DropdownMenu.Shortcut

Shortcut sub-component

#### DropdownMenu.Group

Group sub-component (wraps DropdownMenuPrimitive)


---

### Empty

Empty component

**Type:** block

**Import:** `import { Empty } from "@cloudflare/kumo";`

**Category:** Block

**Props:**

- `size`: enum [default: base]
  - `"sm"`: Compact empty state for smaller containers
  - `"base"`: Default empty state size
  - `"lg"`: Large empty state for prominent placement
- `icon`: ReactNode
- `title`: string (required)
- `description`: string
- `commandLine`: string
- `contents`: ReactNode
- `className`: string

**Colors (kumo tokens used):**

`bg-secondary`, `bg-surface-secondary`, `border-border-2`, `border-color`, `border-hover-border`, `text-brand`, `text-disabled`, `text-green`, `text-label`, `text-surface`

**Examples:**

```tsx
<Empty icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment. Try creating a new item to get started." />
```

```tsx
<Empty size="sm" icon={<DatabaseIcon size={48} className="text-disabled" />} title="No data available" description="There is no data to display at the moment." />
```

```tsx
<Empty icon={<FolderOpenIcon size={48} className="text-disabled" />} title="No projects found" description="Get started by creating your first project using the command below." commandLine="npm create kumo-project" />
```

```tsx
<Empty icon={<CloudSlashIcon size={48} className="text-disabled" />} title="No connection" description="Unable to connect to the server. Please check your connection and try again." contents={<div className="flex gap-2">
        <Button variant="primary">Retry</Button>
        <Button variant="outline">Go Back</Button>
      </div>} />
```

```tsx
<Empty title="Nothing here" />
```


---

### Field

Field component

**Type:** component

**Import:** `import { Field } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `controlFirst`: boolean
  When true, places the control (checkbox/switch) before the label visually. When false (default), places the label before the control. Used to support different layout patterns (e.g., iOS-style toggles on the right).
- `children`: ReactNode
- `label`: ReactNode
  The label content - can be a string or any React node
- `required`: boolean
  When explicitly false, shows gray "(optional)" text after the label. When true or undefined, no indicator is shown.
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `error`: object
- `description`: ReactNode

**Colors (kumo tokens used):**

`text-error`, `text-muted`, `text-surface`

---

### Icon

Icon component variants configuration / export const KUMO_ICON_VARIANTS = { size: { xs: { classes: "size-3", description: "12px - small UI elements", }, sm: { classes: "size-4", description: "16px - standard inline icons", }, base: { classes: "size-5", description: "20px - default size", }, lg: { classes: "size-6", description: "24px - prominent icons", }, xl: { classes: "size-8", description: "32px - hero sections", }, }, } as const; /** Default variant values for Icon component / export const KUMO_ICON_DEFAULT_VARIANTS = { size: "base", } as const; /** Generate className string for icon variants / export function iconVariants({ size = KUMO_ICON_DEFAULT_VARIANTS.size, }: KumoIconVariantsProps = {}) { return cn( // Base styles - no default color, inherits currentColor from parent // This matches Phosphor icon behavior "inline-block shrink-0 fill-current", // Apply size variant KUMO_ICON_VARIANTS.size[size].classes, ); } /** Icon component using SVG sprite with <use> pattern Color is inherited from parent's text color (currentColor), matching Phosphor icon behavior. Override with text-* classes when needed. ```tsx // Basic usage - inherits color from parent <Icon glyph="ph-check" /> // With explicit color and size <Icon glyph="ph-arrow-right" className="text-brand" size="lg" /> // Accessible icon with title <Icon glyph="cf-cloudflare-workers-outline" title="Cloudflare Workers" /> // Error state <Icon glyph="ph-warning" className="text-error" /> // Success state <Icon glyph="ph-check" className="text-green" /> ```

**Type:** component

**Import:** `import { Icon } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `glyph`: IconGlyph (required)
  Icon glyph identifier (e.g., "ph-check", "cf-workers")
- `title`: string
  Accessible title for the icon (makes it non-decorative)
- `size`: enum [default: base]
  - `"xs"`: 12px - small UI elements
  - `"sm"`: 16px - standard inline icons
  - `"base"`: 20px - default size
  - `"lg"`: 24px - prominent icons
  - `"xl"`: 32px - hero sections
- `children`: ReactNode
- `onChange`: React.FormEventHandler<SVGSVGElement>
- `onSubmit`: React.FormEventHandler<SVGSVGElement>
- `onClick`: React.MouseEventHandler<SVGSVGElement>
- `suppressHydrationWarning`: boolean
- `className`: string
- `color`: string
- `height`: number | string
- `id`: string
- `lang`: string
- `media`: string
- `method`: string
- `name`: string
- `target`: string
- `type`: string
- `width`: number | string
- `role`: React.AriaRole
- `accentHeight`: number | string
- `accumulate`: enum
- `additive`: enum
- `alignmentBaseline`: enum
- `allowReorder`: enum
- `alphabetic`: number | string
- `amplitude`: number | string
- `arabicForm`: enum
- `ascent`: number | string
- `attributeName`: string
- `attributeType`: string
- `autoReverse`: Booleanish
- `azimuth`: number | string
- `baseFrequency`: number | string
- `baselineShift`: number | string
- `baseProfile`: number | string
- `bbox`: number | string
- `begin`: number | string
- `bias`: number | string
- `by`: number | string
- `calcMode`: number | string
- `capHeight`: number | string
- `clip`: number | string
- `clipPath`: string
- `clipPathUnits`: number | string
- `clipRule`: number | string
- `colorInterpolation`: number | string
- `colorInterpolationFilters`: enum
- `colorProfile`: number | string
- `colorRendering`: number | string
- `contentScriptType`: number | string
- `contentStyleType`: number | string
- `cursor`: number | string
- `cx`: number | string
- `cy`: number | string
- `d`: string
- `decelerate`: number | string
- `descent`: number | string
- `diffuseConstant`: number | string
- `direction`: number | string
- `display`: number | string
- `divisor`: number | string
- `dominantBaseline`: enum
- `dur`: number | string
- `dx`: number | string
- `dy`: number | string
- `edgeMode`: number | string
- `elevation`: number | string
- `enableBackground`: number | string
- `end`: number | string
- `exponent`: number | string
- `externalResourcesRequired`: Booleanish
- `fill`: string
- `fillOpacity`: number | string
- `fillRule`: enum
- `filter`: string
- `filterRes`: number | string
- `filterUnits`: number | string
- `floodColor`: number | string
- `floodOpacity`: number | string
- `focusable`: Booleanish | string
- `fontFamily`: string
- `fontSize`: number | string
- `fontSizeAdjust`: number | string
- `fontStretch`: number | string
- `fontStyle`: number | string
- `fontVariant`: number | string
- `fontWeight`: number | string
- `format`: number | string
- `fr`: number | string
- `from`: number | string
- `fx`: number | string
- `fy`: number | string
- `g1`: number | string
- `g2`: number | string
- `glyphName`: number | string
- `glyphOrientationHorizontal`: number | string
- `glyphOrientationVertical`: number | string
- `glyphRef`: number | string
- `gradientTransform`: string
- `gradientUnits`: string
- `hanging`: number | string
- `horizAdvX`: number | string
- `horizOriginX`: number | string
- `href`: string
- `ideographic`: number | string
- `imageRendering`: number | string
- `in2`: number | string
- `in`: string
- `intercept`: number | string
- `k1`: number | string
- `k2`: number | string
- `k3`: number | string
- `k4`: number | string
- `k`: number | string
- `kernelMatrix`: number | string
- `kernelUnitLength`: number | string
- `kerning`: number | string
- `keyPoints`: number | string
- `keySplines`: number | string
- `keyTimes`: number | string
- `lengthAdjust`: number | string
- `letterSpacing`: number | string
- `lightingColor`: number | string
- `limitingConeAngle`: number | string
- `local`: number | string
- `markerEnd`: string
- `markerHeight`: number | string
- `markerMid`: string
- `markerStart`: string
- `markerUnits`: number | string
- `markerWidth`: number | string
- `mask`: string
- `maskContentUnits`: number | string
- `maskUnits`: number | string
- `mathematical`: number | string
- `mode`: number | string
- `numOctaves`: number | string
- `offset`: number | string
- `opacity`: number | string
- `operator`: number | string
- `order`: number | string
- `orient`: number | string
- `orientation`: number | string
- `origin`: number | string
- `overflow`: number | string
- `overlinePosition`: number | string
- `overlineThickness`: number | string
- `paintOrder`: number | string
- `panose1`: number | string
- `path`: string
- `pathLength`: number | string
- `patternContentUnits`: string
- `patternTransform`: number | string
- `patternUnits`: string
- `pointerEvents`: number | string
- `points`: string
- `pointsAtX`: number | string
- `pointsAtY`: number | string
- `pointsAtZ`: number | string
- `preserveAlpha`: Booleanish
- `preserveAspectRatio`: string
- `primitiveUnits`: number | string
- `r`: number | string
- `radius`: number | string
- `refX`: number | string
- `refY`: number | string
- `renderingIntent`: number | string
- `repeatCount`: number | string
- `repeatDur`: number | string
- `requiredExtensions`: number | string
- `requiredFeatures`: number | string
- `restart`: number | string
- `result`: string
- `rotate`: number | string
- `rx`: number | string
- `ry`: number | string
- `scale`: number | string
- `seed`: number | string
- `shapeRendering`: number | string
- `slope`: number | string
- `spacing`: number | string
- `specularConstant`: number | string
- `specularExponent`: number | string
- `speed`: number | string
- `spreadMethod`: string
- `startOffset`: number | string
- `stdDeviation`: number | string
- `stemh`: number | string
- `stemv`: number | string
- `stitchTiles`: number | string
- `stopColor`: string
- `stopOpacity`: number | string
- `strikethroughPosition`: number | string
- `strikethroughThickness`: number | string
- `string`: number | string
- `stroke`: string
- `strokeDasharray`: string | number
- `strokeDashoffset`: string | number
- `strokeLinecap`: enum
- `strokeLinejoin`: enum
- `strokeMiterlimit`: number | string
- `strokeOpacity`: number | string
- `strokeWidth`: number | string
- `surfaceScale`: number | string
- `systemLanguage`: number | string
- `tableValues`: number | string
- `targetX`: number | string
- `targetY`: number | string
- `textAnchor`: enum
- `textDecoration`: number | string
- `textLength`: number | string
- `textRendering`: number | string
- `to`: number | string
- `transform`: string
- `u1`: number | string
- `u2`: number | string
- `underlinePosition`: number | string
- `underlineThickness`: number | string
- `unicode`: number | string
- `unicodeBidi`: number | string
- `unicodeRange`: number | string
- `unitsPerEm`: number | string
- `vAlphabetic`: number | string
- `values`: string
- `vectorEffect`: number | string
- `version`: string
- `vertAdvY`: number | string
- `vertOriginX`: number | string
- `vertOriginY`: number | string
- `vHanging`: number | string
- `vIdeographic`: number | string
- `viewBox`: string
- `viewTarget`: number | string
- `visibility`: number | string
- `vMathematical`: number | string
- `widths`: number | string
- `wordSpacing`: number | string
- `writingMode`: number | string
- `x1`: number | string
- `x2`: number | string
- `x`: number | string
- `xChannelSelector`: string
- `xHeight`: number | string
- `xlinkActuate`: string
- `xlinkArcrole`: string
- `xlinkHref`: string
- `xlinkRole`: string
- `xlinkShow`: string
- `xlinkTitle`: string
- `xlinkType`: string
- `xmlBase`: string
- `xmlLang`: string
- `xmlns`: string
- `xmlnsXlink`: string
- `xmlSpace`: string
- `y1`: number | string
- `y2`: number | string
- `y`: number | string
- `yChannelSelector`: string
- `z`: number | string
- `zoomAndPan`: string

**Colors (kumo tokens used):**

`text-brand`, `text-error`, `text-green`

**Examples:**

```tsx
<Icon size="xs" glyph="ph-check" />
```

```tsx
<div className="grid grid-cols-8 gap-4">
      {ALL_ICON_GLYPHS.map((glyph) => (
        <div key={glyph} className="flex flex-col items-center gap-2">
          <Icon glyph={glyph} size="lg" />
          <span className="text-xs text-muted">{glyph}</span>
        </div>
      ))}
    </div>
```

```tsx
<Icon glyph="ph-check" title={Success} />
```

```tsx
<div className="flex gap-4">
      <Icon glyph="ph-check" className="text-green" size="lg" />
      <Icon glyph="ph-warning" className="text-alert" size="lg" />
      <Icon glyph="ph-x" className="text-error" size="lg" />
      <Icon glyph="ph-info" className="text-info" size="lg" />
      <Icon glyph="ph-check" className="text-brand" size="lg" />
      <Icon glyph="ph-gear" className="text-label" size="lg" />
      <Icon
        glyph="cf-cloudflare-workers-outline"
        className="text-green"
        size="lg"
      />
      <Icon
        glyph="cf-security-shield-protection-1-outline"
        className="text-alert"
        size="lg"
      />
      <Icon
        glyph="cf-cloudflare-pages-outline"
        className="text-error"
        size="lg"
      />
      <Icon
        glyph="cf-cloudflare-zero-trust-outline"
        className="text-info"
        size="lg"
      />
      <Icon glyph="cf-r2-outline" className="text-brand" size="lg" />
      <Icon glyph="cf-d1-outline" className="text-label" size="lg" />
    </div>
```


---

### Input

Input component

**Type:** component

**Import:** `import { Input } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `label`: ReactNode
  Label content for the input (enables Field wrapper) - can be a string or any React node
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `description`: ReactNode
  Helper text displayed below the input
- `error`: string | object
  Error message or validation error object
- `size`: enum [default: base]
  - `"xs"`: Extra small input for compact UIs
  - `"sm"`: Small input for secondary fields
  - `"base"`: Default input size
  - `"lg"`: Large input for prominent fields
- `variant`: enum [default: default]
  - `"default"`: Default input appearance
  - `"error"`: Error state for validation failures

  **State Classes:**
  - `"default"`:
    - `focus`: `focus:ring-active`
  - `"error"`:
    - `focus`: `focus:ring-error`

**Colors (kumo tokens used):**

`bg-secondary`, `ring-active`, `ring-border`, `ring-error`, `text-muted`, `text-surface`

**Styling:**

- **Base Tokens:** `bg-secondary`, `text-surface`, `text-muted`, `ring-border`
- **States:**
  - `base`: `bg-secondary`, `text-surface`, `ring-border`
  - `focus`: `ring-active`
  - `error`: `ring-error`
  - `disabled`: `opacity-50`, `text-muted`
- **Size Variants:**
  - `xs`:
    - Height: 20px
    - Classes: `h-5 gap-1 rounded-sm px-1.5 text-xs`
    - Dimensions:
      - paddingX: 6
      - fontSize: 12
      - borderRadius: 2
  - `sm`:
    - Height: 26px
    - Classes: `h-6.5 gap-1 rounded-md px-2 text-xs`
    - Dimensions:
      - paddingX: 8
      - fontSize: 12
      - borderRadius: 6
  - `base`:
    - Height: 36px
    - Classes: `h-9 gap-1.5 rounded-lg px-3 text-base`
    - Dimensions:
      - paddingX: 12
      - fontSize: 16
      - borderRadius: 8
  - `lg`:
    - Height: 40px
    - Classes: `h-10 gap-2 rounded-lg px-4 text-base`
    - Dimensions:
      - paddingX: 16
      - fontSize: 16
      - borderRadius: 8

**Examples:**

```tsx
<Input placeholder="Enter text..." />
```

```tsx
<Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />
```

```tsx
<Input
      label="Phone Number"
      required={false}
      placeholder="+1 (555) 000-0000"
      description="Optional fields show '(optional)' indicator"
    />
```

```tsx
<Input
      label="API Key"
      labelTooltip="Find this in your dashboard under Settings > API Keys"
      placeholder="sk_live_..."
    />
```

```tsx
<Input
      label="Backup Email"
      required={false}
      labelTooltip="Used for account recovery if you lose access to your primary email"
      type="email"
      placeholder="backup@example.com"
    />
```

```tsx
<Input
      label={
        <span>
          Email for <strong>billing</strong>
        </span>
      }
      placeholder="billing@company.com"
      type="email"
    />
```

```tsx
<div className="flex max-w-md flex-col gap-4">
      <Input label="Full Name" placeholder="John Doe" />
      <Input
        label="Email"
        labelTooltip="We'll send your receipt here"
        placeholder="john@example.com"
        type="email"
      />
      <Input label="Company" required={false} placeholder="Acme Inc." />
      <Input
        label="Notes"
        required={false}
        labelTooltip="Any additional information"
        placeholder="Tell us more..."
      />
    </div>
```

```tsx
<Input
      label="Email"
      placeholder="Invalid input"
      defaultValue="error@example.com"
      variant="error"
      error="Please enter a valid email address"
    />
```

```tsx
<Input label="Disabled Field" placeholder="Disabled input" disabled />
```

```tsx
function InputGroupExamplesRender() {
    const [username, setUsername] = React.useState("");
    const [status, setStatus] = React.useState<
      "idle" | "checking" | "available" | "taken" | "error"
    >("idle");

    const checkAvailability = () => {
      if (!username) {
        setStatus("error");
        return;
      }
      setStatus("checking");
      // Simulate API call
      setTimeout(() => {
        setStatus(username.length > 3 ? "available" : "taken");
      }, 800);
    };

    const statusText = {
      idle: "",
      checking: "Checking...",
      available: "✓ Available",
      taken: "✗ Taken",
      error: "Please enter a username",
    };

    return (
      <div className="space-y-6">
        {/* Prefix label - common for URLs, usernames, currencies */}
        <div className="space-y-1">
          <p className="text-center text-sm text-muted">Prefix label</p>
          <InputGroup>
            <InputGroup.Label>https://</InputGroup.Label>
            <InputGroup.Input placeholder="example.com" />
          </InputGroup>
        </div>

        {/* Prefix label with suffix description - common for currency inputs */}
        <div className="space-y-1">
          <p className="text-center text-sm text-muted">
            Label with description
          </p>
          <InputGroup>
            <InputGroup.Label>$</InputGroup.Label>
            <InputGroup.Input placeholder="0.00" type="number" />
            <InputGroup.Description>USD</InputGroup.Description>
          </InputGroup>
        </div>

        {/* With action button - interactive example */}
        <div className="space-y-1">
          <p className="text-center text-sm text-muted">
            With action button (4+ chars = available, fewer = taken)
          </p>
          <InputGroup>
            <InputGroup.Label>@</InputGroup.Label>
            <InputGroup.Input
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkAvailability();
                }
              }}
            />
            <InputGroup.Button onClick={checkAvailability}>
              {status === "checking" ? "Checking..." : "Check"}
            </InputGroup.Button>
          </InputGroup>
          <p
            aria-live="polite"
            className={`text-sm ${status === "available" ? "text-info" : status === "error" || status === "taken" ? "text-error" : "text-muted"}`}
          >
            {statusText[status]}
          </p>
        </div>

        {/* With multiple inputs - used for  */}
        <div className="space-y-1">
          <p className="text-center text-sm text-muted">
            A group of multiple inputs using individualFocus
          </p>
          <InputGroup focusMode={"individual"}>
            <InputGroup.Button onClick={checkAvailability}>
              <CaretDoubleLeftIcon size={16} />
            </InputGroup.Button>
            <InputGroup.Button onClick={checkAvailability}>
              <CaretLeftIcon size={16} />
            </InputGroup.Button>
            <InputGroup.Input placeholder="page" value={0} />
            <InputGroup.Button onClick={checkAvailability}>
              <CaretRightIcon size={16} />
            </InputGroup.Button>
            <InputGroup.Button onClick={checkAvailability}>
              <CaretDoubleRightIcon size={16} />
            </InputGroup.Button>
          </InputGroup>
        </div>
      </div>
    );
  }
```

```tsx
<div className="space-y-4">
      <div className="space-y-1">
        <p className="text-center text-sm text-muted">Size: xs</p>
        <InputGroup size="xs">
          <InputGroup.Label>@</InputGroup.Label>
          <InputGroup.Input placeholder="username" />
          <InputGroup.Button>Submit</InputGroup.Button>
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-center text-sm text-muted">Size: sm</p>
        <InputGroup size="sm">
          <InputGroup.Label>@</InputGroup.Label>
          <InputGroup.Input placeholder="username" />
          <InputGroup.Button>Submit</InputGroup.Button>
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-center text-sm text-muted">Size: base (default)</p>
        <InputGroup size="base">
          <InputGroup.Label>@</InputGroup.Label>
          <InputGroup.Input placeholder="username" />
          <InputGroup.Button>Submit</InputGroup.Button>
        </InputGroup>
      </div>

      <div className="space-y-1">
        <p className="text-center text-sm text-muted">Size: lg</p>
        <InputGroup size="lg">
          <InputGroup.Label>@</InputGroup.Label>
          <InputGroup.Input placeholder="username" />
          <InputGroup.Button>Submit</InputGroup.Button>
        </InputGroup>
      </div>
    </div>
```


---

### Label

When true, only renders the inline content (indicators, tooltip) without the outer span with font styling. Useful when composed inside another label element that already provides the text styling. / asContent?: boolean; } /** Label component for form fields. Provides a standardized way to display labels with optional indicators: - Optional indicator: gray "(optional)" text when `showOptional={true}` - Tooltip: info icon with hover tooltip for additional context // Basic label <Label>Email</Label> // Optional field with indicator <Label showOptional>Middle Name</Label> // With tooltip <Label tooltip="We'll use this to send you updates">Email</Label> // With ReactNode children <Label> <span>Custom label with <strong>bold</strong> text</span> </Label>

**Type:** component

**Import:** `import { Label } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `children`: ReactNode
  The label content - can be a string or any React node
- `showOptional`: boolean
  When true (and required is false), shows gray "(optional)" text after the label
- `tooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `className`: string
  Additional CSS classes
- `asContent`: boolean
  When true, only renders the inline content (indicators, tooltip) without the outer span with font styling. Useful when composed inside another label element that already provides the text styling.

**Colors (kumo tokens used):**

`text-label`, `text-surface`

**Examples:**

```tsx
<Label>Email Address</Label>
```

```tsx
<Label tooltip="We'll use this to send you important updates about your account">
      Email Address
    </Label>
```

```tsx
<div className="flex flex-col gap-4">
      <Label>Default Label</Label>
      <Label showOptional>Optional Label</Label>
      <Label tooltip="More information">Label with Tooltip</Label>
      <Label showOptional tooltip="Optional field info">
        Optional with Tooltip
      </Label>
    </div>
```

```tsx
<div className="flex max-w-md flex-col gap-4">
      <Input label="Full Name" placeholder="John Doe" />
      <Input
        label="Email"
        labelTooltip="We'll send your receipt here"
        placeholder="john@example.com"
        type="email"
      />
      <Input label="Company" required={false} placeholder="Acme Inc." />
      <Input
        label="Notes"
        required={false}
        labelTooltip="Any additional information you'd like to share"
        placeholder="Tell us more..."
      />
    </div>
```


---

### LayerCard

LayerCard component

**Type:** component

**Import:** `import { LayerCard } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `children`: ReactNode
- `className`: string

**Colors (kumo tokens used):**

`bg-layer-card-primary`, `bg-surface-2`, `ring-border`, `ring-color`, `text-label`

**Styling:**


**Sub-Components:**

This is a compound component. Use these sub-components:

#### LayerCard.Primary

Primary sub-component

#### LayerCard.Secondary

Secondary sub-component


**Examples:**

```tsx
<LayerCard className="w-[250px]">
      <LayerCard.Secondary className="flex items-center justify-between">
        <div>Next Steps</div>
        <Button variant="ghost" size="sm" shape="square">
          <ArrowRightIcon size={16} />
        </Button>
      </LayerCard.Secondary>

      <LayerCard.Primary>
        <Text>Get started with Kumo</Text>
      </LayerCard.Primary>
    </LayerCard>
```


---

### Loader

Loader component

**Type:** component

**Import:** `import { Loader } from "@cloudflare/kumo";`

**Category:** Feedback

**Props:**

- `className`: string
- `size`: enum [default: base]
  - `"sm"`: Small loader for inline use
  - `"base"`: Default loader size
  - `"lg"`: Large loader for prominent loading states

**Examples:**

```tsx
<Loader size="sm" className="text-surface" />
```


---

### MenuBar

MenuBar component

**Type:** component

**Import:** `import { MenuBar } from "@cloudflare/kumo";`

**Category:** Navigation

**Props:**

- `className`: string
- `isActive`: number | boolean | string
- `options`: MenuOptionProps[] (required)
- `optionIds`: boolean

**Colors (kumo tokens used):**

`bg-color`, `bg-surface`, `border-color`

**Styling:**


---

### Meter

Meter component

**Type:** component

**Import:** `import { Meter } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `customValue`: string
- `label`: string (required)
- `showValue`: boolean
- `trackClassName`: string
- `indicatorClassName`: string
- `value`: number
  Current value of the meter
- `max`: number
  Maximum value of the meter (default: 100)
- `min`: number
  Minimum value of the meter (default: 0)

**Colors (kumo tokens used):**

`bg-color`, `text-label`, `text-surface`

**Examples:**

```tsx
<Meter label="Progress" value={50} max={100} />
```

```tsx
<div className="flex w-64 flex-col gap-4">
      <Meter label="Low" value={25} max={100} />
      <Meter label="Medium" value={50} max={100} />
      <Meter label="High" value={75} max={100} />
      <Meter label="Complete" value={100} max={100} />
    </div>
```


---

### PageHeader

PageHeader component

**Type:** block

**Import:** `import { PageHeader } from "@cloudflare/kumo";`

**Category:** Block

**Props:**

- `spacing`: enum [default: base]
  - `"compact"`: Compact spacing between header elements
  - `"base"`: Default spacing between header elements
  - `"relaxed"`: Relaxed spacing for more prominent headers
- `className`: string
  Additional CSS classes
- `children`: ReactNode
  Child elements

**Colors (kumo tokens used):**

`border-color`, `text-muted`, `text-surface`

**Examples:**

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Current Project</Breadcrumbs.Current>
        </Breadcrumbs>
      }
    />
```

```tsx
<PageHeader spacing="compact" breadcrumbs={<Breadcrumbs>
              <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
              <Breadcrumbs.Current>Current</Breadcrumbs.Current>
            </Breadcrumbs>} tabs={[
            { label: "General", value: "general" },
            { label: "Settings", value: "settings" },
          ]} defaultTab="general" />
```

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "General", value: "general" },
        { label: "Security", value: "security" },
        { label: "Notifications", value: "notifications" },
        { label: "Billing", value: "billing" },
      ]}
      defaultTab="general"
    />
```

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "Analytics", value: "analytics" },
        { label: "Settings", value: "settings" },
      ]}
      defaultTab="overview"
    >
      <Button variant="outline" size="sm">
        Export
      </Button>
      <Button variant="primary" size="sm">
        <PlusIcon size={16} />
        New Item
      </Button>
    </PageHeader>
```

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Page title</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="Page title"
    />
```

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Page title</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="Page title"
      description="Action-led, value-oriented description of what this page does. Optional second sentence with use cases or prerequisites."
    />
```

```tsx
<PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="/products">Products</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>Page title</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      title="Page title"
      description="Action-led, value-oriented description of what this page does. Optional second sentence with use cases or prerequisites."
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "Analytics", value: "analytics" },
        { label: "Settings", value: "settings" },
      ]}
      defaultTab="overview"
    >
      <Button variant="outline" size="sm">
        Export
      </Button>
      <Button variant="primary" size="sm">
        <PlusIcon size={16} />
        New Item
      </Button>
    </PageHeader>
```


---

### Pagination

Pagination component

**Type:** component

**Import:** `import { Pagination } from "@cloudflare/kumo";`

**Category:** Navigation

**Props:**

- `controls`: enum [default: full]
  - `"full"`: Full pagination controls with first, previous, page input, next, and last buttons
  - `"simple"`: Simple pagination controls with only previous and next buttons
- `setPage`: (page: number) => void (required)
  Callback when page changes
- `page`: number
- `perPage`: number
- `totalCount`: number

**Colors (kumo tokens used):**

`text-label`

**Styling:**


**Examples:**

```tsx
<Pagination page={1} perPage={10} totalCount={100} setPage={() => {}} />
```

```tsx
<Pagination page={5} perPage={10} totalCount={100} setPage={() => {}} controls="simple" />
```


---

### Popover

Arrow SVG with three paths for proper border rendering in both light and dark modes. This approach matches Base UI's popover/tooltip implementation. The three paths are: 1. ArrowFill - The main arrow body, matches popover background 2. ArrowOuterStroke - Border visible in light mode only (transparent in dark) 3. ArrowInnerStroke - Border visible in dark mode only (transparent in light) This is necessary because the outer and inner stroke paths have different geometries, and using both ensures the arrow border aligns perfectly with the popover's outline in both color modes. / function ArrowSvg(props: React.ComponentProps<"svg">) { return ( <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}> <path d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z" className="fill-surface" /> <path d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z" className="fill-tooltip-arrow-outer-stroke" /> <path d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z" className="fill-tooltip-arrow-inner-stroke" /> </svg> ); } // ============================================================================ // Compound Component Export // ============================================================================ /** Popover component for displaying accessible popup content anchored to a trigger. ```tsx <Popover> <Popover.Trigger asChild> <Button>Open</Button> </Popover.Trigger> <Popover.Content> <Popover.Title>Notifications</Popover.Title> <Popover.Description>You are all caught up!</Popover.Description> </Popover.Content> </Popover> ```

**Type:** component

**Import:** `import { Popover } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `side`: enum [default: bottom]
  - `"top"`: Popover appears above the trigger
  - `"bottom"`: Popover appears below the trigger
  - `"left"`: Popover appears to the left of the trigger
  - `"right"`: Popover appears to the right of the trigger

**Colors (kumo tokens used):**

`bg-surface`, `fill-surface`, `fill-tooltip-arrow-inner-stroke`, `fill-tooltip-arrow-outer-stroke`, `outline-tooltip-border`, `text-muted`, `text-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Popover.Trigger

Trigger sub-component

#### Popover.Content

Content sub-component

#### Popover.Title

Title sub-component

#### Popover.Description

Description sub-component

#### Popover.Close

Close sub-component


**Examples:**

```tsx
<Popover>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>
          You are all caught up. Good job!
        </Popover.Description>
      </Popover.Content>
    </Popover>
```

```tsx
<Popover>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Settings</Popover.Title>
        <Popover.Description>
          Configure your preferences below.
        </Popover.Description>
        <div className="mt-3">
          <Popover.Close asChild>
            <Button variant="secondary" size="sm">
              Close
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover>
```

```tsx
<div className="pt-32">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Open Above</Button>
        </Popover.Trigger>
        <Popover.Content side="top">
          <Popover.Title>Top Popover</Popover.Title>
          <Popover.Description>
            This popover appears above the trigger.
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
```

```tsx
<Popover>
      <Popover.Trigger asChild>
        <Button>Open Right</Button>
      </Popover.Trigger>
      <Popover.Content side="right">
        <Popover.Title>Right Popover</Popover.Title>
        <Popover.Description>
          This popover appears to the right.
        </Popover.Description>
      </Popover.Content>
    </Popover>
```

```tsx
function ControlledPopover() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button>Controlled Popover</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Controlled State</Popover.Title>
            <Popover.Description>
              This popover is controlled externally.
            </Popover.Description>
          </Popover.Content>
        </Popover>
        <span className="text-sm text-muted">
          Status: {open ? "Open" : "Closed"}
        </span>
      </div>
    );
  }
```

```tsx
<Popover>
      <Popover.Trigger openOnHover delay={300} asChild>
        <Button>Hover to Open</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Hover Trigger</Popover.Title>
        <Popover.Description>
          This popover opens on hover, similar to a tooltip.
        </Popover.Description>
      </Popover.Content>
    </Popover>
```

```tsx
<Popover>
      <Popover.Trigger asChild>
        <Button>User Profile</Button>
      </Popover.Trigger>
      <Popover.Content className="w-64" align="start" sideOffset={16}>
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-surface-3" />
          <div>
            <Popover.Title>Matt Rothenberg</Popover.Title>
            <p className="text-sm text-muted">mrothenberg@cloudflare.com</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 border-t border-border pt-3 justify-end">
          <div>
            <Popover.Close asChild>
              <Button variant="ghost" size="sm" className="flex-1">
                Close
              </Button>
            </Popover.Close>
          </div>
          <div>
            <Button variant="primary" size="sm" className="flex-1">
              View profile
            </Button>
          </div>
        </div>
      </Popover.Content>
    </Popover>
```

```tsx
<div className="flex gap-8">
      <Popover>
        <Popover.Trigger asChild>
          <Button>Default (8px)</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Default Offset</Popover.Title>
          <Popover.Description>sideOffset: 8px (default)</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
          <Button>Large Gap</Button>
        </Popover.Trigger>
        <Popover.Content sideOffset={16}>
          <Popover.Title>Large Side Offset</Popover.Title>
          <Popover.Description>sideOffset: 16px</Popover.Description>
        </Popover.Content>
      </Popover>

      <Popover>
        <Popover.Trigger asChild>
          <Button>Shifted Right</Button>
        </Popover.Trigger>
        <Popover.Content align="start" alignOffset={20}>
          <Popover.Title>Align Offset</Popover.Title>
          <Popover.Description>
            align: start, alignOffset: 20px
          </Popover.Description>
        </Popover.Content>
      </Popover>
    </div>
```

```tsx
function FilterPanelExample() {
    const [filters, setFilters] = React.useState({
      status: "",
      country: "",
      path: "",
    });
    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
      <Popover>
        <Popover.Trigger asChild>
          <Button variant="secondary" icon={FunnelIcon}>
            Filters{activeCount > 0 && ` (${activeCount})`}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-80" align="start" sideOffset={16}>
          <Popover.Title>Filter Requests</Popover.Title>
          <div className="mt-3 space-y-3">
            <div className="flex gap-3">
              <Select
                label="Status Code"
                placeholder="Any status"
                value={filters.status || undefined}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, status: value ?? "" }))
                }
              >
                <Select.Option value="2xx">2xx Success</Select.Option>
                <Select.Option value="3xx">3xx Redirect</Select.Option>
                <Select.Option value="4xx">4xx Client Error</Select.Option>
                <Select.Option value="5xx">5xx Server Error</Select.Option>
              </Select>
              <Select
                label="Country"
                placeholder="Any country"
                value={filters.country || undefined}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, country: value ?? "" }))
                }
              >
                <Select.Option value="US">United States</Select.Option>
                <Select.Option value="GB">United Kingdom</Select.Option>
                <Select.Option value="DE">Germany</Select.Option>
                <Select.Option value="FR">France</Select.Option>
                <Select.Option value="JP">Japan</Select.Option>
              </Select>
            </div>
            <Input
              label="Path contains"
              placeholder="/api/"
              value={filters.path}
              onChange={(e) =>
                setFilters((f) => ({ ...f, path: e.target.value }))
              }
            />
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ status: "", country: "", path: "" })}
            >
              Clear All
            </Button>
            <Popover.Close asChild>
              <Button variant="primary" size="sm">
                Apply Filters
              </Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    );
  }
```


---

### Radio

Radio component

**Type:** component

**Import:** `import { Radio } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `legend`: string (required)
  Legend text for the group (required for accessibility)
- `children`: ReactNode
  Child Radio.Item components
- `orientation`: enum
  Layout direction of the radio items
- `error`: string
  Error message for the group
- `description`: ReactNode
  Helper text for the group
- `defaultValue`: string
  Value of the radio that should be initially selected (uncontrolled)
- `value`: string
  Value of the radio that should be selected (controlled)
- `disabled`: boolean
  Whether all radios in the group are disabled
- `controlPosition`: enum
  Position of radio control relative to label: "start" (default) puts radio before label, "end" puts label before radio
- `name`: string
  Form submission name for the radio group
- `className`: string
  Additional CSS classes

**Colors (kumo tokens used):**

`bg-surface`, `bg-surface-inverse`, `border-border`, `ring-active`, `ring-border`, `text-error`, `text-muted`, `text-surface`

**Examples:**

```tsx
<Radio.Group legend="Notification preference" defaultValue="email">
      <Radio.Item label="Email" value="email" />
      <Radio.Item label="SMS" value="sms" />
      <Radio.Item label="Push notification" value="push" />
    </Radio.Group>
```

```tsx
<div className="flex flex-col gap-4">
      {Object.keys(KUMO_RADIO_VARIANTS.variant).map((variant) => (
        <div
          key={variant}
          className="border border-dotted border-color bg-surface p-4"
        >
          <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted uppercase">
            {variant}
          </div>
          <Radio.Group legend="Choose an option" defaultValue="a">
            <Radio.Item
              label="Option A"
              value="a"
              variant={variant as "default" | "error"}
            />
            <Radio.Item
              label="Option B"
              value="b"
              variant={variant as "default" | "error"}
            />
          </Radio.Group>
        </div>
      ))}
    </div>
```

```tsx
<Radio.Group
      legend="Size"
      orientation="horizontal"
      defaultValue="md"
      description="Choose the size that works best for your needs"
    >
      <Radio.Item label="Small" value="sm" />
      <Radio.Item label="Medium" value="md" />
      <Radio.Item label="Large" value="lg" />
      <Radio.Item label="Extra Large" value="xl" />
    </Radio.Group>
```

```tsx
<div className="flex flex-col gap-8">
      <Radio.Group
        legend="Entirely disabled group"
        disabled
        defaultValue="free"
      >
        <Radio.Item label="Free" value="free" />
        <Radio.Item label="Pro" value="pro" />
        <Radio.Item label="Enterprise" value="enterprise" />
      </Radio.Group>

      <Radio.Group legend="Individual disabled items" defaultValue="available">
        <Radio.Item label="Available option" value="available" />
        <Radio.Item label="Unavailable option" value="unavailable" disabled />
        <Radio.Item label="Another available" value="another" />
      </Radio.Group>
    </div>
```

```tsx
<Radio.Group
      legend="Payment method"
      error="Please select a payment method to continue"
    >
      <Radio.Item label="Credit Card" value="card" />
      <Radio.Item label="PayPal" value="paypal" />
      <Radio.Item label="Bank Transfer" value="bank" />
    </Radio.Group>
```

```tsx
<Radio.Group
      legend="Account type"
      description="Choose the account type that best fits your needs. You can change this later in settings."
      defaultValue="personal"
    >
      <Radio.Item label="Personal" value="personal" />
      <Radio.Item label="Business" value="business" />
      <Radio.Item label="Enterprise" value="enterprise" />
    </Radio.Group>
```

```tsx
<Radio.Group
      legend="Subscription tier"
      description="Select a plan to get started"
      error="A subscription tier is required"
    >
      <Radio.Item label="Starter" value="starter" />
      <Radio.Item label="Professional" value="professional" />
      <Radio.Item label="Enterprise" value="enterprise" />
    </Radio.Group>
```

```tsx
<Radio.Group
      legend="Preferences"
      controlPosition="end"
      defaultValue="option1"
    >
      <Radio.Item label="Label appears before radio" value="option1" />
      <Radio.Item label="This layout may suit RTL languages" value="option2" />
      <Radio.Item label="Or specific design requirements" value="option3" />
    </Radio.Group>
```

```tsx
<div className="flex flex-col gap-4">
        <Radio.Group
          legend="Contact preference"
          description="Controlled state - selected value shown below"
          value={value}
          onValueChange={setValue}
        >
          <Radio.Item label="Email" value="email" />
          <Radio.Item label="Phone" value="phone" />
          <Radio.Item label="Mail" value="mail" />
        </Radio.Group>
        <div className="rounded-md bg-surface-elevated p-4">
          <div className="mb-2 text-sm font-medium text-surface">Selected:</div>
          <code className="text-sm text-muted">"{value}"</code>
        </div>
      </div>
```

```tsx
<div className="flex flex-col gap-8">
      {/* English - Control at start: Radio → Label */}
      <div>
        <Radio.Group
          legend="English (Radio → Label)"
          controlPosition="start"
          defaultValue="email"
        >
          <Radio.Item label="Email notifications" value="email" />
          <Radio.Item label="SMS notifications" value="sms" />
          <Radio.Item label="Push notifications" value="push" />
          <Radio.Item label="In-app notifications" value="in-app" disabled />
        </Radio.Group>
      </div>

      {/* Spanish - Control at end: Label → Radio */}
      <div>
        <Radio.Group
          legend="Español (Etiqueta → Radio)"
          controlPosition="end"
          defaultValue="email"
        >
          <Radio.Item
            label="Notificaciones por correo electrónico"
            value="email"
          />
          <Radio.Item label="Notificaciones por SMS" value="sms" />
          <Radio.Item label="Notificaciones push" value="push" />
          <Radio.Item
            label="Notificaciones en la aplicación"
            value="in-app"
            disabled
          />
        </Radio.Group>
      </div>
    </div>
```

```tsx
<div className="flex flex-col gap-8">
      <Radio.Group
        legend="Vertical (default)"
        orientation="vertical"
        defaultValue="a"
      >
        <Radio.Item label="Option A" value="a" />
        <Radio.Item label="Option B" value="b" />
        <Radio.Item label="Option C" value="c" />
      </Radio.Group>

      <Radio.Group
        legend="Horizontal"
        orientation="horizontal"
        defaultValue="a"
      >
        <Radio.Item label="Option A" value="a" />
        <Radio.Item label="Option B" value="b" />
        <Radio.Item label="Option C" value="c" />
      </Radio.Group>
    </div>
```


---

### Select

Select component

**Type:** component

**Import:** `import { Select } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `className`: string
  Additional CSS classes
- `label`: ReactNode
  Label content for the select (enables Field wrapper) - can be a string or any React node
- `hideLabel`: boolean
  Whether to visually hide the label (still accessible to screen readers)
- `placeholder`: string
  Placeholder text when no value is selected
- `loading`: boolean
  Whether the select is in a loading state
- `disabled`: boolean
  Whether the select is disabled
- `required`: boolean
  Whether the select is required
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `value`: string
  The currently selected value
- `defaultValue`: string
  Initial value for uncontrolled mode
- `children`: ReactNode
  Child elements (Select.Option components)
- `description`: ReactNode
  Helper text displayed below the select
- `error`: string | object
  Error message or validation error object
- `onValueChange`: (value: string) => void
  Callback when selection changes

**Colors (kumo tokens used):**

`bg-color-3`, `bg-secondary`, `ring-active`, `ring-border`, `text-surface`

**Styling:**


**Sub-Components:**

This is a compound component. Use these sub-components:

#### Select.Option

Option sub-component


**Examples:**

```tsx
<Select defaultValue="1" placeholder="Select an option">
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
      <Select.Option value="3">Option 3</Select.Option>
    </Select>
```

```tsx
<Select
      label="Country"
      hideLabel={false}
      placeholder="Select a country"
      description="Choose your country of residence"
    >
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="uk">United Kingdom</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="au">Australia</Select.Option>
    </Select>
```

```tsx
<Select
      label="Preferred Language"
      hideLabel={false}
      required={false}
      placeholder="Select a language"
    >
      <Select.Option value="en">English</Select.Option>
      <Select.Option value="es">Spanish</Select.Option>
      <Select.Option value="fr">French</Select.Option>
    </Select>
```

```tsx
<Select
      label="Timezone"
      hideLabel={false}
      labelTooltip="This will be used for scheduling and notifications"
      placeholder="Select your timezone"
    >
      <Select.Option value="utc">UTC</Select.Option>
      <Select.Option value="est">Eastern Time (EST)</Select.Option>
      <Select.Option value="pst">Pacific Time (PST)</Select.Option>
    </Select>
```

```tsx
<Select
      label="Plan"
      hideLabel={false}
      required={false}
      labelTooltip="Choose the plan that best fits your needs. You can upgrade anytime."
      placeholder="Select a plan"
    >
      <Select.Option value="free">Free</Select.Option>
      <Select.Option value="pro">Pro - $9/month</Select.Option>
      <Select.Option value="enterprise">Enterprise - Contact us</Select.Option>
    </Select>
```

```tsx
<Select
      label="Account Type"
      hideLabel={false}
      placeholder="Select an account type"
      error="Please select an account type to continue"
    >
      <Select.Option value="personal">Personal</Select.Option>
      <Select.Option value="business">Business</Select.Option>
      <Select.Option value="enterprise">Enterprise</Select.Option>
    </Select>
```

```tsx
<Select label="Language" hideLabel={true} placeholder="Select language">
      <Select.Option value="en">English</Select.Option>
      <Select.Option value="es">Spanish</Select.Option>
      <Select.Option value="fr">French</Select.Option>
      <Select.Option value="de">German</Select.Option>
    </Select>
```

```tsx
<Select
      label="Options"
      hideLabel={false}
      placeholder="Loading options..."
      loading
    >
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
    </Select>
```

```tsx
<Select
      label="Status"
      hideLabel={false}
      placeholder="Select status"
      disabled
      defaultValue="active"
    >
      <Select.Option value="active">Active</Select.Option>
      <Select.Option value="inactive">Inactive</Select.Option>
    </Select>
```


---

### SensitiveInput

SensitiveInput component

**Type:** component

**Import:** `import { SensitiveInput } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `alt`: string
- `autoComplete`: React.HTMLInputAutoCompleteAttribute
- `checked`: boolean
- `disabled`: boolean
- `height`: number | string
- `list`: string
- `name`: string
- `placeholder`: string
- `readOnly`: boolean
- `required`: boolean
- `width`: number | string
- `onChange`: React.ChangeEventHandler<HTMLInputElement>
- `defaultChecked`: boolean
- `suppressContentEditableWarning`: boolean
- `suppressHydrationWarning`: boolean
- `className`: string
- `contextMenu`: string
- `enterKeyHint`: enum
- `id`: string
- `lang`: string
- `nonce`: string
- `slot`: string
- `title`: string
- `radioGroup`: string
- `role`: React.AriaRole
- `about`: string
- `content`: string
- `datatype`: string
- `inlist`: unknown
- `prefix`: string
- `property`: string
- `rel`: string
- `resource`: string
- `rev`: string
- `typeof`: string
- `vocab`: string
- `autoCorrect`: string
- `autoSave`: string
- `color`: string
- `itemProp`: string
- `itemScope`: boolean
- `itemType`: string
- `itemID`: string
- `itemRef`: string
- `results`: number
- `security`: string
- `unselectable`: enum
- `popover`: enum
- `popoverTargetAction`: enum
- `popoverTarget`: string
- `inert`: boolean
- `inputMode`: enum
  Hints at the type of data that might be entered by the user while editing the element or its contents
- `is`: string
  Specify that a standard HTML element should behave like a defined custom built-in element
- `exportparts`: string
- `part`: string
- `children`: ReactNode
- `onSubmit`: React.FormEventHandler<HTMLInputElement>
- `onClick`: React.MouseEventHandler<HTMLInputElement>
- `value`: string
  Controlled value
- `defaultValue`: string
  Uncontrolled default value
- `size`: enum [default: base]
  Size variant
- `variant`: enum [default: default]
  Style variant
- `label`: ReactNode
  Label content for the input (enables Field wrapper and sets masked state label) - can be a string or any React node
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `description`: ReactNode
  Helper text displayed below the input
- `error`: string | object
  Error message or validation error object

**Colors (kumo tokens used):**

`bg-primary`, `bg-secondary`, `outline-active`, `text-muted`, `text-surface`

**Examples:**

```tsx
<SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />
```

```tsx
<div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-2">
          <span className="w-12 text-sm text-muted">{size}</span>
          <SensitiveInput
            label={`${size} size`}
            size={size}
            defaultValue="secret-api-key-123"
          />
        </div>
      ))}
    </div>
```

```tsx
<SensitiveInput label="Secret" placeholder="Enter your secret..." />
```

```tsx
<div className="flex flex-col gap-4">
        <SensitiveInput
          label="Controlled Secret"
          value={value}
          onValueChange={setValue}
        />
        <div className="text-sm text-muted">
          Current value: <code className="text-surface">{value}</code>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setValue("new-secret-" + Date.now())}
            className="rounded bg-primary px-2 py-1 text-sm text-white"
          >
            Change value
          </button>
          <button
            onClick={() => setValue("")}
            className="rounded bg-secondary px-2 py-1 text-sm text-surface ring ring-border"
          >
            Clear
          </button>
        </div>
      </div>
```

```tsx
<SensitiveInput
      label="Invalid Key"
      variant="error"
      defaultValue="invalid-key"
      error="This API key is not valid"
    />
```

```tsx
<SensitiveInput
      label="Password"
      defaultValue="my-secret-value"
      description="Keep this password secure and don't share it"
    />
```

```tsx
<SensitiveInput
      label="Backup Password"
      required={false}
      placeholder="Enter backup password"
    />
```

```tsx
<SensitiveInput
      label="Secret Key"
      labelTooltip="Find this in your dashboard under Settings > API Keys"
      defaultValue="sk_live_abc123xyz789"
    />
```

```tsx
<SensitiveInput
      label="API Key"
      defaultValue="copyable-secret-key"
      onCopy={() => console.log("Value copied!")}
    />
```

```tsx
<SensitiveInput
      defaultValue="sk_live_abc123xyz789"
      placeholder="Input without Field wrapper"
    />
```


---

### Surface

Surface component

**Type:** component

**Import:** `import { Surface } from "@cloudflare/kumo";`

**Category:** Layout

**Props:**

- `as`: React.ElementType
  The element type to render as (default: "div")
- `color`: enum [default: primary]
  - `"primary"`: Primary surface color
  - `"secondary"`: Secondary surface color
- `className`: string
  Additional CSS classes
- `children`: ReactNode
  Child elements

**Colors (kumo tokens used):**

`bg-surface`, `ring-border`

**Examples:**


---

### Switch

Switch component

**Type:** component

**Import:** `import { Switch } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default switch appearance
  - `"error"`: Error state for validation failures
- `label`: ReactNode
  Label content for the switch (Field wrapper is built-in) - can be a string or any React node. Optional when used standalone for visual-only purposes.
- `labelTooltip`: ReactNode
  Tooltip content to display next to the label via an info icon
- `required`: boolean
  Whether the switch is required. When explicitly false, shows "(optional)" text after the label.
- `controlFirst`: boolean
  When true (default), switch appears before label. When false, label appears before switch.
- `size`: enum [default: base]
  - `"sm"`: Small switch for compact UIs
  - `"base"`: Default switch size
  - `"lg"`: Large switch for prominent toggles
- `checked`: boolean
- `disabled`: boolean
- `transitioning`: boolean
- `name`: string
- `type`: enum
- `value`: string | string[] | number
- `defaultChecked`: boolean
- `defaultValue`: string | number | string[]
- `suppressContentEditableWarning`: boolean
- `suppressHydrationWarning`: boolean
- `className`: string
- `contextMenu`: string
- `enterKeyHint`: enum
- `id`: string
- `lang`: string
- `nonce`: string
- `slot`: string
- `title`: string
- `radioGroup`: string
- `role`: React.AriaRole
- `about`: string
- `content`: string
- `datatype`: string
- `inlist`: unknown
- `prefix`: string
- `property`: string
- `rel`: string
- `resource`: string
- `rev`: string
- `typeof`: string
- `vocab`: string
- `autoCorrect`: string
- `autoSave`: string
- `color`: string
- `itemProp`: string
- `itemScope`: boolean
- `itemType`: string
- `itemID`: string
- `itemRef`: string
- `results`: number
- `security`: string
- `unselectable`: enum
- `popover`: enum
- `popoverTargetAction`: enum
- `popoverTarget`: string
- `inert`: boolean
- `inputMode`: enum
  Hints at the type of data that might be entered by the user while editing the element or its contents
- `is`: string
  Specify that a standard HTML element should behave like a defined custom built-in element
- `exportparts`: string
- `part`: string
- `onChange`: React.FormEventHandler<HTMLButtonElement>
- `onSubmit`: React.FormEventHandler<HTMLButtonElement>
- `onClick`: (event: React.MouseEvent) => void
  Callback when switch is clicked

**Colors (kumo tokens used):**

`bg-error`, `bg-hover`, `bg-hover-selected`, `bg-primary`, `bg-surface-3`, `border-border`, `ring-error`, `text-error`, `text-muted`, `text-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Switch.Item

Item sub-component

#### Switch.Group

Group sub-component

Props:
- `legend`: string (required)
- `children`: ReactNode (required)
- `error`: string
- `description`: ReactNode
- `disabled`: boolean
- `controlFirst`: boolean
- `className`: string


**Examples:**

```tsx
<div className="flex flex-col gap-4">
      {Object.keys(KUMO_SWITCH_VARIANTS.variant).map((variant) => (
        <div
          key={variant}
          className="border border-dotted border-color bg-surface p-4"
        >
          <div className="mb-2 font-sans text-sm leading-5 font-light tracking-wide text-muted uppercase">
            {variant}
          </div>
          <Switch label="Switch variant" variant={variant as any} />
        </div>
      ))}
    </div>
```

```tsx
<Switch label="I'm checked" checked={true} />
```

```tsx
<div className="flex flex-col gap-4">
      {[false, true].map((checked) => (
        <Switch
          key={String(checked)}
          label={`Disabled (${checked ? "checked" : "unchecked"})`}
          checked={checked}
          disabled
        />
      ))}
    </div>
```

```tsx
<div className="flex flex-col gap-4">
      {[false, true].map((checked) => (
        <Switch
          key={String(checked)}
          label={`Error (${checked ? "checked" : "unchecked"})`}
          variant="error"
          checked={checked}
        />
      ))}
    </div>
```

```tsx
<Switch label="Label first" controlFirst={false} />
```

```tsx
<Switch label="Enable dark mode" required={false} />
```

```tsx
<Switch label="Enable two-factor authentication" labelTooltip="Adds an extra layer of security by requiring a code from your phone" />
```

```tsx
<Switch label="Save preferences" required={false} labelTooltip="We'll remember your settings for next time" />
```

```tsx
<Switch
      label={
        <span>
          Enable <strong>automatic updates</strong>
        </span>
      }
    />
```

```tsx
<div className="flex flex-col gap-4">
        <Switch
          label="Controlled switch"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <div className="rounded-md bg-surface-elevated p-4">
          <div className="mb-2 text-sm font-medium text-surface">State:</div>
          <code className="text-sm text-muted">
            {checked ? "checked" : "unchecked"}
          </code>
        </div>
      </div>
```

```tsx
<Switch.Group legend="Privacy settings">
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>
```

```tsx
<Switch.Group
      legend="Required settings"
      error="You must enable at least one notification method"
    >
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>
```

```tsx
<Switch.Group
      legend="Notification settings"
      description="Choose how you want to be notified about important updates"
    >
      <Switch.Item label="Email notifications" checked />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" checked />
    </Switch.Group>
```

```tsx
<Switch.Group legend="Notification preferences" controlFirst={false}>
      <Switch.Item label="Email notifications" checked />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" checked />
    </Switch.Group>
```

```tsx
<div className="flex flex-col gap-8">
      {/* English (LTR) - Control First: Switch → Label */}
      <fieldset className="rounded border border-border p-4">
        <legend className="px-2 text-base font-semibold text-surface">
          English (Switch → Label)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Switch label="Switch is unchecked" controlFirst={true} />
          <Switch
            label="Switch is unchecked and disabled"
            disabled
            controlFirst={true}
          />
          <Switch label="Switch is checked" checked controlFirst={true} />
          <Switch
            label="Switch is checked and disabled"
            checked
            disabled
            controlFirst={true}
          />
        </div>
      </fieldset>

      {/* Spanish (LTR) - Label First: Label → Switch */}
      <fieldset className="rounded border border-border p-4">
        <legend className="px-2 text-base font-semibold text-surface">
          Español (Etiqueta → Interruptor)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Switch label="El interruptor está desmarcado" controlFirst={false} />
          <Switch
            label="El interruptor está desmarcado y deshabilitado"
            disabled
            controlFirst={false}
          />
          <Switch
            label="El interruptor está marcado"
            checked
            controlFirst={false}
          />
          <Switch
            label="El interruptor está marcado y deshabilitado"
            checked
            disabled
            controlFirst={false}
          />
        </div>
      </fieldset>

      {/* Arabic (RTL) - Control First: Switch → Label */}
      <fieldset className="rounded border border-border p-4" dir="rtl">
        <legend className="px-2 text-base font-semibold text-surface">
          العربية (المفتاح ← التسمية)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Switch label="المفتاح غير محدد" controlFirst={true} />
          <Switch label="المفتاح غير محدد ومعطل" disabled controlFirst={true} />
          <Switch label="المفتاح محدد" checked controlFirst={true} />
          <Switch
            label="المفتاح محدد ومعطل"
            checked
            disabled
            controlFirst={true}
          />
        </div>
      </fieldset>

      {/* Hebrew (RTL) - Label First: Label → Switch */}
      <fieldset className="rounded border border-border p-4" dir="rtl">
        <legend className="px-2 text-base font-semibold text-surface">
          עברית (תווית ← מתג)
        </legend>
        <div className="mt-4 flex flex-col gap-4">
          <Switch label="המתג לא מסומן" controlFirst={false} />
          <Switch label="המתג לא מסומן ומושבת" disabled controlFirst={false} />
          <Switch label="המתג מסומן" checked controlFirst={false} />
          <Switch
            label="המתג מסומן ומושבת"
            checked
            disabled
            controlFirst={false}
          />
        </div>
      </fieldset>
    </div>
```

```tsx
<div className="flex flex-col gap-8">
      {/* English (LTR) - Control First: Switch → Label */}
      <div>
        <Switch.Group legend="English (Switch → Label)" controlFirst={true}>
          <Switch.Item label="Email notifications" checked />
          <Switch.Item label="SMS notifications" />
          <Switch.Item label="Push notifications" checked />
          <Switch.Item label="In-app notifications" disabled />
        </Switch.Group>
      </div>

      {/* Spanish (LTR) - Label First: Label → Switch */}
      <div>
        <Switch.Group
          legend="Español (Etiqueta → Interruptor)"
          controlFirst={false}
        >
          <Switch.Item label="Notificaciones por correo electrónico" checked />
          <Switch.Item label="Notificaciones por SMS" />
          <Switch.Item label="Notificaciones push" checked />
          <Switch.Item label="Notificaciones en la aplicación" disabled />
        </Switch.Group>
      </div>

      {/* Arabic (RTL) - Control First: Switch → Label */}
      <div dir="rtl">
        <Switch.Group legend="العربية (المفتاح ← التسمية)" controlFirst={true}>
          <Switch.Item label="إشعارات البريد الإلكتروني" checked />
          <Switch.Item label="إشعارات الرسائل القصيرة" />
          <Switch.Item label="الإشعارات الفورية" checked />
          <Switch.Item label="الإشعارات داخل التطبيق" disabled />
        </Switch.Group>
      </div>

      {/* Hebrew (RTL) - Label First: Label → Switch */}
      <div dir="rtl">
        <Switch.Group legend="עברית (תווית ← מתג)" controlFirst={false}>
          <Switch.Item label="התראות אימייל" checked />
          <Switch.Item label="התראות SMS" />
          <Switch.Item label="התראות דחיפה" checked />
          <Switch.Item label="התראות בתוך האפליקציה" disabled />
        </Switch.Group>
      </div>
    </div>
```


---

### Table

Table component

**Type:** component

**Import:** `import { Table } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `layout`: enum [default: auto]
  - `"auto"`: Auto table layout - columns resize based on content
  - `"fixed"`: Fixed table layout - columns have equal width, controlled via colgroup
- `variant`: enum [default: default]
  - `"default"`: Default row variant
  - `"selected"`: Selected row variant
- `className`: string
  Additional CSS classes
- `children`: ReactNode
  Child elements

**Colors (kumo tokens used):**

`bg-accent`, `bg-active`, `bg-surface`, `border-color`, `text-surface`

**Sub-Components:**

This is a compound component. Use these sub-components:

#### Table.Header

Header sub-component

#### Table.Head

Head sub-component

#### Table.Row

Row sub-component

#### Table.Body

Body sub-component

#### Table.Cell

Cell sub-component

#### Table.CheckCell

CheckCell sub-component

#### Table.CheckHead

CheckHead sub-component

#### Table.Footer

Footer sub-component

#### Table.ResizeHandle

ResizeHandle sub-component


---

### Tabs

Tabs component

**Type:** component

**Import:** `import { Tabs } from "@cloudflare/kumo";`

**Category:** Navigation

**Props:**

- `className`: string
  Additional CSS classes
- `children`: ReactNode
  Child elements
- `onValueChange`: (value: string) => void
  Callback when active tab changes

**Colors (kumo tokens used):**

`bg-accent`, `bg-primary`, `bg-surface-elevated`, `border-accent`, `border-border`, `ring-active`, `ring-color-2`, `text-label`, `text-muted`, `text-surface`

**Styling:**


**Examples:**

```tsx
<Tabs tabs="defaultTabs" selectedValue="tab1" />
```

```tsx
<Tabs tabs="defaultTabs" selectedValue="tab1" variant="segmented" />
```

```tsx
<Tabs tabs={[
      {
        value: "tab1",
        label: "Regular Tab",
      },
      {
        value: "tab2",
        label: "Custom Link",
        // oxlint-disable-next-line jsx-a11y/anchor-has-content
        render: (props) => <a {...props} href="#tab2" />,
      },
      {
        value: "tab3",
        label: "Another Link",
        // oxlint-disable-next-line jsx-a11y/anchor-has-content
        render: (props) => <a {...props} href="#tab3" />,
      },
    ]} selectedValue="tab1" variant="segmented" />
```


---

### Text

Text component

**Type:** component

**Import:** `import { Text } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `variant`: enum [default: body]
  - `"heading1"`: Large heading for page titles
  - `"heading2"`: Medium heading for section titles
  - `"heading3"`: Small heading for subsections
  - `"body"`: Default body text
  - `"secondary"`: Muted text for secondary information
  - `"success"`: Success state text
  - `"error"`: Error state text
  - `"mono"`: Monospace text for code
  - `"mono-secondary"`: Muted monospace text
- `size`: enum [default: base]
  - `"xs"`: Extra small text
  - `"sm"`: Small text
  - `"base"`: Default text size
  - `"lg"`: Large text
- `bold`: boolean
  Whether to use bold font weight (only applies to body variants)
- `as`: React.ElementType
  The element type to render as
- `children`: ReactNode
  Child text content

**Colors (kumo tokens used):**

`text-error`, `text-info`, `text-muted`, `text-surface`

**Examples:**

```tsx
<Text variant="heading1">Sample text</Text>
```

```tsx
<Text size="xs">Sample text</Text>
```

```tsx
<Text bold={true}>Bold text</Text>
```


---

### Toasty

Toasty component

**Type:** component

**Import:** `import { Toasty } from "@cloudflare/kumo";`

**Category:** Feedback

**Props:**

- `children`: ReactNode

**Colors (kumo tokens used):**

`bg-toast`, `bg-toast-button-hover`, `border-color`, `text-label`, `text-muted`, `text-surface`

**Styling:**


---

### Tooltip

Tooltip component

**Type:** component

**Import:** `import { Tooltip } from "@cloudflare/kumo";`

**Category:** Overlay

**Props:**

- `align`: enum
- `asChild`: boolean
- `className`: string
- `content`: ReactNode
  Content to display in the tooltip
- `side`: enum [default: top]
  - `"top"`: Tooltip appears above the trigger
  - `"bottom"`: Tooltip appears below the trigger
  - `"left"`: Tooltip appears to the left of the trigger
  - `"right"`: Tooltip appears to the right of the trigger

**Colors (kumo tokens used):**

`bg-surface`, `fill-surface`, `fill-tooltip-arrow-inner-stroke`, `fill-tooltip-arrow-outer-stroke`, `outline-tooltip-border`, `text-surface`

**Examples:**

```tsx
<Tooltip content="This is a tooltip" asChild>
      <Button>Hover me</Button>
    </Tooltip>
```


---

### InputArea

Multi-line textarea input with Input variants and InputArea-specific dimensions

**Type:** component

**Import:** `import { InputArea } from "@cloudflare/kumo (synthetic - uses Input component)";`

**Category:** Input

**Props:**


**Styling:**

- **Size Variants:**
  - `xs`:
  - `sm`:
  - `base`:
  - `lg`:

## Quick Reference

**Components by Category:**
- **Display:** Badge, Code, Collapsible, LayerCard, Meter, Text
- **Feedback:** Banner, Loader, Toasty
- **Block:** Breadcrumbs, Empty, PageHeader
- **Action:** Button, ClipboardText
- **Input:** Checkbox, Combobox, DateRangePicker, Field, Input, Select, Switch
- **Other:** CommandPalette, Icon, Label, Popover, Radio, SensitiveInput, Table
- **Overlay:** Dialog, DropdownMenu, Tooltip
- **Navigation:** MenuBar, Pagination, Tabs
- **Layout:** Surface
