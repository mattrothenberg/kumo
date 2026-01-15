# Kumo Component Registry

> Auto-generated component metadata for AI/agent consumption.


## Styling Guide

**Important:** Only use Kumo semantic tokens. Never use raw Tailwind colors like `bg-gray-500` or `text-blue-600`.

### Quick Reference

| Purpose | Token | Example Use |
|---------|-------|-------------|
| **Page/card background** | `bg-surface` | Main content areas |
| **Elevated surface** | `bg-surface-elevated` | Modals, dropdowns |
| **Interactive element** | `bg-secondary` | Buttons, inputs |
| **Hover state** | `bg-subtle` | Hover backgrounds |
| **Selected/active** | `bg-accent` | Active tabs, selections |
| **Primary text** | `text-surface` | Body text, headings |
| **Secondary text** | `text-secondary` | Descriptions, hints |
| **Muted text** | `text-muted` | Placeholders, disabled |
| **Card border** | `border-color` | Dividers, outlines |
| **Focus ring** | `ring-active` | Keyboard focus |
| **Error state** | `text-error` + `ring-destructive` | Validation errors |

### State Colors

| State | Background | Text | Border/Ring |
|-------|------------|------|-------------|
| **Error** | `bg-error-surface` | `text-error` | `ring-destructive` |
| **Warning** | `bg-alert-surface` | `text-alert` | `ring-alert-border` |
| **Success** | — | `text-info` | — |

### Surface Hierarchy

Use layered surfaces for visual depth:
```
bg-surface → bg-surface-elevated → bg-surface-secondary
```

### Dark Mode

All semantic tokens automatically adapt to dark mode. No manual `dark:` prefixes needed.

### Token Usage in Components

Most frequently used tokens across Kumo components:

| Category | Top Tokens |
|----------|------------|
| **Background** | `bg-surface`, `bg-secondary`, `bg-color-3`, `bg-color`, `bg-destructive` |
| **Text** | `text-surface`, `text-muted`, `text-error`, `text-label`, `text-info` |
| **Border/Ring** | `ring-border`, `ring-active`, `ring-destructive`, `ring-color` |

---

### All Semantic Tokens (Reference)

> Use the Quick Reference table above for common cases. This section lists all available tokens.

**Text:** `text-alert`, `text-brand`, `text-disabled`, `text-error`, `text-green`, `text-info`, `text-label`, `text-muted`, and 2 more

**Background:** `bg-accent`, `bg-active`, `bg-alert-border`, `bg-alert-selection`, `bg-alert-surface`, `bg-black-icon`, `bg-border`, `bg-calendar`, and 27 more

**Border:** `border-alert-border`, `border-border`, `border-color`, `border-error-border`, `border-hover`, `border-hover-border`, `border-hover-selected`, `border-info-border`, `border-subtle`, `border-toast-button-hover`

**Ring:** `ring-active`, `ring-alert-border`, `ring-border`, `ring-color`, `ring-destructive`, `ring-error-border`, `ring-hover-border`, `ring-info-border`

**Fill:** `fill-active`, `fill-black-icon`, `fill-icon-path`

---

### Badge

Badge component

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

`bg-color`, `bg-destructive`, `bg-surface-inverse`, `border-color`, `border-primary`, `text-info`, `text-surface`, `text-surface-inverse`

**Examples:**

```tsx
<Badge variant="primary">Badge</Badge>
```


---

### Banner

Banner component

**Import:** `import { Banner } from "@cloudflare/kumo";`

**Category:** Feedback

**Props:**

- `icon`: ReactNode
- `text`: string (required)
- `variant`: enum [default: default]
  - `"default"`: Informational banner for general messages
  - `"alert"`: Warning banner for cautionary messages
  - `"error"`: Error banner for critical issues
- `className`: string

**Colors (kumo tokens used):**

`bg-alert-selection`, `bg-alert-surface`, `bg-error-selection`, `bg-error-surface`, `bg-info-selection`, `bg-info-surface`, `border-alert-border`, `border-error-border`, `border-info-border`, `text-alert`, `text-error`, `text-info`

**Examples:**

```tsx
<Banner variant="default" text="This is a banner message" icon={<InfoIcon size={16} />} />
```


---

### Breadcrumbs

Breadcrumbs component

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
  - `"outline"`: Bordered button with transparent background
- `onChange`: React.FormEventHandler<HTMLButtonElement>
- `onSubmit`: React.FormEventHandler<HTMLButtonElement>
- `onClick`: React.MouseEventHandler<HTMLButtonElement>
- `id`: string
- `title`: string
- `disabled`: boolean
- `name`: string
- `type`: enum
- `value`: string | string[] | number

**Colors (kumo tokens used):**

`bg-accent`, `bg-destructive`, `bg-primary`, `bg-secondary`, `bg-subtle`, `bg-surface`, `border-subtle`, `ring-active`, `ring-border`, `text-error`, `text-muted`, `text-surface`

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

**Import:** `import { Checkbox } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default checkbox appearance
  - `"error"`: Error state for validation failures
- `label`: string
  Label text for the checkbox (enables built-in Field wrapper)
- `controlFirst`: boolean
  When true (default), checkbox appears before label. When false, label appears before checkbox.
- `checked`: boolean
- `indeterminate`: boolean
- `disabled`: boolean
- `name`: string
- `placeholder`: string
- `readOnly`: boolean
- `required`: boolean
- `size`: number
- `type`: React.HTMLInputTypeAttribute
- `value`: string | string[] | number
- `onChange`: React.ChangeEventHandler<HTMLInputElement>
- `className`: string
- `id`: string
- `title`: string
- `onSubmit`: React.FormEventHandler<HTMLInputElement>
- `onClick`: React.MouseEventHandler<HTMLInputElement>

**Colors (kumo tokens used):**

`bg-surface`, `bg-surface-inverse`, `border-border`, `ring-active`, `ring-border`, `ring-destructive`, `text-error`, `text-muted`, `text-surface`, `text-surface-inverse`

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
          <Checkbox label="Checkbox variant" variant={variant as any} />
        </div>
      ))}
    </div>
```

```tsx
<Checkbox label="I'm checked" checked={true} />
```

```tsx
<Checkbox label="Indeterminate state" indeterminate={true} />
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
<Checkbox label="Label first" controlFirst={false} />
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

**Examples:**

```tsx
<ClipboardText size="sm" text="npm install @cloudflare/kumo" />
```

```tsx
<ClipboardText text="sk_live_abc123xyz789" />
```


---

### Code

Simple code component without syntax highlighting

**Import:** `import { Code } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `code`: string (required)
  The code content to display
- `values`: Record<string, { value: string; highlight?: boolean }>
  Template values for interpolation
- `className`: string
  Additional CSS classes
- `lang`: 'ts' | 'tsx' | 'jsonc' | 'bash' | 'css'
  Language for syntax highlighting

**Colors (kumo tokens used):**

`bg-surface`, `border-color`, `text-label`

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

Collapsible component

**Import:** `import { Collapsible } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `children`: ReactNode
- `label`: string (required)
- `open`: boolean
- `className`: string
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
- `label`: string
  Label text for the combobox (enables Field wrapper)
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

### DateRangePicker

DateRangePicker component

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
      <Dialog className="p-6">
        <Dialog.Title className="mb-2 text-xl font-semibold">
          Dialog Title
        </Dialog.Title>
        <Dialog.Description className="mb-4">
          This is a dialog description with some content.
        </Dialog.Description>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog>
    </Dialog.Root>
```


---

### DropdownMenu

DropdownMenu component

**Import:** `import { DropdownMenu } from "@cloudflare/kumo";`

**Category:** Overlay

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default dropdown item appearance
  - `"danger"`: Destructive action item

**Colors (kumo tokens used):**

`bg-accent`, `bg-color-3`, `bg-destructive-2`, `bg-muted`, `bg-secondary`, `ring-border`, `text-error`, `text-surface`

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

**Import:** `import { Field } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `controlFirst`: boolean
  When true, places the control (checkbox/switch) before the label visually. When false (default), places the label before the control. Used to support different layout patterns (e.g., iOS-style toggles on the right).
- `children`: ReactNode
- `label`: string (required)
- `error`: object
- `description`: ReactNode

**Colors (kumo tokens used):**

`text-error`, `text-muted`, `text-surface`

---

### Input

Input component

**Import:** `import { Input } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `label`: string
  Label text for the input (enables Field wrapper)
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

**Colors (kumo tokens used):**

`bg-secondary`, `ring-active`, `ring-border`, `ring-destructive`, `text-muted`, `text-surface`

**Examples:**

```tsx
<Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />
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

```tsx
<Input placeholder="Input without Field wrapper" />
```


---

### LayerCard

LayerCard component

**Import:** `import { LayerCard } from "@cloudflare/kumo";`

**Category:** Display

**Props:**

- `children`: ReactNode
- `className`: string

**Colors (kumo tokens used):**

`bg-layer-card-primary`, `bg-surface-2`, `ring-border`, `ring-color`, `text-label`

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

**Import:** `import { MenuBar } from "@cloudflare/kumo";`

**Category:** Navigation

**Props:**

- `className`: string
- `isActive`: number | boolean | string
- `options`: MenuOptionProps[] (required)
- `optionIds`: boolean

**Colors (kumo tokens used):**

`bg-color`, `bg-surface`, `border-color`

---

### Meter

Meter component

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

**Import:** `import { PageHeader } from "@cloudflare/kumo";`

**Category:** Block

**Props:**

- `spacing`: enum [default: base]
  - `"compact"`: Compact spacing between header elements
  - `"base"`: Default spacing between header elements
  - `"relaxed"`: Relaxed spacing for more prominent headers
- `breadcrumbs`: ReactNode
- `title`: string
- `description`: string
- `tabs`: TabsItem[]
- `defaultTab`: string
- `className`: string
- `children`: ReactNode

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

**Examples:**

```tsx
<Pagination page={1} perPage={10} totalCount={100} setPage={() => {}} />
```

```tsx
<Pagination page={5} perPage={10} totalCount={100} setPage={() => {}} controls="simple" />
```


---

### Radio

Radio component

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
- `value`: string
  Value of the radio that should be selected (controlled)
- `disabled`: boolean
  Whether all radios in the group are disabled
- `controlPosition`: RadioControlPosition
  Position of radio control relative to label: "start" (default) puts radio before label, "end" puts label before radio
- `name`: string
  Form submission name for the radio group
- `className`: string
  Additional CSS classes

**Colors (kumo tokens used):**

`bg-surface`, `bg-surface-inverse`, `border-border`, `ring-active`, `ring-border`, `ring-destructive`, `text-error`, `text-muted`, `text-surface`

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

**Import:** `import { Select } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `className`: string
  Additional CSS classes
- `label`: string
  Label text for the select (enables Field wrapper)
- `hideLabel`: boolean
  Whether to visually hide the label (still accessible to screen readers)
- `placeholder`: string
  Placeholder text when no value is selected
- `loading`: boolean
  Whether the select is in a loading state
- `disabled`: boolean
  Whether the select is disabled
- `value`: string
  The currently selected value
- `children`: ReactNode
  Child elements (Select.Option components)
- `description`: ReactNode
  Helper text displayed below the select
- `error`: string | object
  Error message or validation error object
- `onValueChange`: (value: string) => void
  Callback when selection changes
- `defaultValue`: string
  Initial value for uncontrolled mode

**Colors (kumo tokens used):**

`bg-color-3`, `bg-secondary`, `ring-active`, `ring-border`, `text-surface`

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

**Import:** `import { SensitiveInput } from "@cloudflare/kumo";`

**Category:** Other

**Props:**

- `checked`: boolean
- `disabled`: boolean
- `name`: string
- `placeholder`: string
- `readOnly`: boolean
- `required`: boolean
- `onChange`: React.ChangeEventHandler<HTMLInputElement>
- `className`: string
- `id`: string
- `title`: string
- `children`: ReactNode
- `onSubmit`: React.FormEventHandler<HTMLInputElement>
- `onClick`: React.MouseEventHandler<HTMLInputElement>
- `value`: string
  Controlled value
- `size`: KumoInputSize [default: base]
  Size variant
- `variant`: KumoInputVariant [default: default]
  Style variant
- `label`: string
  Label text for the input (enables Field wrapper and sets masked state label)
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

**Import:** `import { Surface } from "@cloudflare/kumo";`

**Category:** Layout

**Props:**

- `as`: React.ElementType
  The element type to render as (default: "div")
- `className`: string
  Additional CSS classes
- `children`: ReactNode
  Child elements

**Colors (kumo tokens used):**

`ring-border`

**Examples:**


---

### Switch

Switch component

**Import:** `import { Switch } from "@cloudflare/kumo";`

**Category:** Input

**Props:**

- `variant`: enum [default: default]
  - `"default"`: Default switch appearance
  - `"error"`: Error state for validation failures
- `label`: string
  Label text for the switch (Field wrapper is built-in). Optional when used standalone for visual-only purposes.
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
- `className`: string
- `id`: string
- `title`: string
- `onChange`: React.FormEventHandler<HTMLButtonElement>
- `onSubmit`: React.FormEventHandler<HTMLButtonElement>
- `onClick`: (event: React.MouseEvent) => void
  Callback when switch is clicked

**Colors (kumo tokens used):**

`bg-destructive`, `bg-hover`, `bg-hover-selected`, `bg-selected`, `bg-surface-3`, `border-border`, `ring-destructive`, `text-error`, `text-muted`, `text-surface`

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

### Tabs

Tabs component

**Import:** `import { Tabs } from "@cloudflare/kumo";`

**Category:** Navigation

**Props:**

- `tabs`: TabsItem[]
  Array of tab items to render
- `value`: string
  Controlled value. When set, component becomes controlled.
- `selectedValue`: string
  Default selected value for uncontrolled mode. Ignored when `value` is set.
- `activateOnFocus`: boolean
  When true, tabs are activated immediately upon receiving focus via arrow keys. When false (default), tabs receive focus but require Enter/Space to activate. Set to true for better keyboard UX in most cases.
- `className`: string
  Additional class name for the root element
- `listClassName`: string
  Additional class name for the tab list element
- `indicatorClassName`: string
  Additional class name for the indicator element
- `variant`: enum [default: segmented]
- `onValueChange`: (value: string) => void
  Callback when active tab changes

**Colors (kumo tokens used):**

`bg-accent`, `bg-primary`, `bg-surface-elevated`, `border-border`, `outline-active`, `ring-color-2`, `text-label`, `text-surface`

**Examples:**

```tsx
<Tabs tabs="defaultTabs" selectedValue="tab1" />
```

```tsx
<Tabs tabs="defaultTabs" selectedValue="tab1" variant="segmented" />
```


---

### Text

Text component

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

**Import:** `import { Toasty } from "@cloudflare/kumo";`

**Category:** Feedback

**Props:**

- `children`: ReactNode

**Colors (kumo tokens used):**

`bg-toast`, `bg-toast-button-hover`, `border-color`, `text-label`, `text-muted`, `text-surface`

---

### Tooltip

Tooltip component

**Import:** `import { Tooltip } from "@cloudflare/kumo";`

**Category:** Overlay

**Props:**

- `align`: TooltipAlign
- `asChild`: boolean
- `className`: string
- `side`: enum [default: top]
  - `"top"`: Tooltip appears above the trigger
  - `"bottom"`: Tooltip appears below the trigger
  - `"left"`: Tooltip appears to the left of the trigger
  - `"right"`: Tooltip appears to the right of the trigger
- `content`: ReactNode (required)
  Content to display in the tooltip

**Colors (kumo tokens used):**

`bg-black-icon`, `fill-black-icon`, `fill-icon-path`

**Examples:**

```tsx
<Tooltip content="This is a tooltip" asChild>
      <Button>Hover me</Button>
    </Tooltip>
```


## Quick Reference

**Components by Category:**
- **Display:** Badge, Code, Collapsible, LayerCard, Meter, Text
- **Feedback:** Banner, Loader, Toasty
- **Block:** Breadcrumbs, Empty, PageHeader
- **Action:** Button, ClipboardText
- **Input:** Checkbox, Combobox, DateRangePicker, Field, Input, Select, Switch
- **Overlay:** Dialog, DropdownMenu, Tooltip
- **Navigation:** MenuBar, Pagination, Tabs
- **Other:** Radio, SensitiveInput
- **Layout:** Surface
