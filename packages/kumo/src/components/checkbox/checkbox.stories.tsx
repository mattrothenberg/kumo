import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Checkbox, KUMO_CHECKBOX_VARIANTS } from "./checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function VariantCheckbox({ variant }: { variant: string }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <Checkbox
      label="Checkbox variant"
      variant={variant as any}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}

export const Variants: Story = {
  args: { label: "Checkbox" },
  render: () => (
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
  ),
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <Checkbox
        label="I'm checked"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [indeterminate, setIndeterminate] = React.useState(true);
    return (
      <Checkbox
        label="Indeterminate state"
        indeterminate={indeterminate}
        onCheckedChange={() => setIndeterminate(false)}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
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
  ),
};

export const Error: Story = {
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Error variant provides visual error styling (red ring) but no error message. Error messages only appear in Checkbox.Group for multiple checkboxes.",
      },
    },
  },
};

export const LabelFirst: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        label="Label first"
        controlFirst={false}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Label before checkbox layout using controlFirst={false}. By default, checkbox appears before label (controlFirst=true). Note: Single checkboxes only have labels, no descriptions.",
      },
    },
  },
};

export const OptionalField: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        label="Subscribe to newsletter"
        required={false}
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const WithLabelTooltip: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        label="Enable two-factor authentication"
        labelTooltip="Adds an extra layer of security to your account"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const OptionalWithTooltip: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        label="Remember my preferences"
        required={false}
        labelTooltip="We'll save your settings for next time"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const ReactNodeLabel: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <Checkbox
        label={
          <span>
            I agree to the <strong>Terms of Service</strong> and{" "}
            <strong>Privacy Policy</strong>
          </span>
        }
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const Group: Story = {
  args: { label: "Checkbox" },
  render: () => (
    <Checkbox.Group legend="Choose your preferences">
      <Checkbox.Item label="Email notifications" name="preferences" />
      <Checkbox.Item label="SMS notifications" name="preferences" />
      <Checkbox.Item label="Push notifications" name="preferences" />
    </Checkbox.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When you have MULTIPLE related checkboxes, use Checkbox.Group. This provides proper semantic HTML (fieldset and legend) for grouped form controls. Each Checkbox.Item has its own label.",
      },
    },
  },
};

export const GroupWithError: Story = {
  args: { label: "Checkbox" },
  render: () => (
    <Checkbox.Group
      legend="Required preferences"
      error="You must select at least one notification method"
    >
      <Checkbox.Item label="Email notifications" name="preferences" />
      <Checkbox.Item label="SMS notifications" name="preferences" />
      <Checkbox.Item label="Push notifications" name="preferences" />
    </Checkbox.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Error messages only appear in Checkbox.Group (for multiple checkboxes), not on single checkboxes. This is because errors for single yes/no questions don't make semantic sense.",
      },
    },
  },
};

export const GroupWithDescription: Story = {
  args: { label: "Checkbox" },
  render: () => (
    <Checkbox.Group
      legend="Notification settings"
      description="Choose how you want to be notified about important updates"
    >
      <Checkbox.Item label="Email notifications" value="email" />
      <Checkbox.Item label="SMS notifications" value="sms" />
      <Checkbox.Item label="Push notifications" value="push" />
    </Checkbox.Group>
  ),
};

export const GroupWithDefaultValue: Story = {
  args: { label: "Checkbox" },
  render: () => (
    <Checkbox.Group
      legend="Marketing preferences"
      description="Pre-selected with email notifications enabled"
      defaultValue={["email"]}
    >
      <Checkbox.Item label="Email notifications" value="email" />
      <Checkbox.Item label="SMS notifications" value="sms" />
      <Checkbox.Item label="Push notifications" value="push" />
    </Checkbox.Group>
  ),
};

export const GroupControlled: Story = {
  args: { label: "Checkbox" },
  render: () => {
    const [value, setValue] = React.useState<string[]>(["email", "push"]);
    return (
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
    );
  },
};

/**
 * Demonstrates single Checkbox flexibility across different cultural contexts and visual orders.
 * Tests all 4 combinations of text direction and control/label order for complete coverage:
 *
 * - English (LTR): Checkbox → Label (controlFirst=true)
 * - Spanish (LTR): Label → Checkbox (controlFirst=false)
 * - Arabic (RTL): Checkbox → Label (controlFirst=true)
 * - Hebrew (RTL): Label → Checkbox (controlFirst=false)
 */
export const MultipleLanguages: Story = {
  args: { label: "Checkbox" },
  render: () => (
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
  ),
};

/**
 * Demonstrates Checkbox.Group flexibility across different cultural contexts and visual orders.
 * Tests all 4 combinations of text direction and control/label order for complete coverage:
 *
 * - English (LTR): Checkbox → Label (controlFirst=true)
 * - Spanish (LTR): Label → Checkbox (controlFirst=false)
 * - Arabic (RTL): Checkbox → Label (controlFirst=true)
 * - Hebrew (RTL): Label → Checkbox (controlFirst=false)
 */
export const MultipleLanguagesGroup: Story = {
  args: { label: "Checkbox" },
  render: () => (
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
  ),
};
