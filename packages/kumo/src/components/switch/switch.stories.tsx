import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Switch, KUMO_SWITCH_VARIANTS } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: { label: "Switch" },
  render: () => (
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
  ),
};

export const Checked: Story = {
  args: {
    label: "I'm checked",
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: "I'm unchecked",
    checked: false,
  },
};

export const Disabled: Story = {
  render: () => (
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
  ),
};

export const Error: Story = {
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Error variant provides visual error styling but no error message. Error messages only appear in Switch.Group for multiple switches.",
      },
    },
  },
};

export const LabelFirst: Story = {
  args: { label: "Label first", controlFirst: false },
  parameters: {
    docs: {
      description: {
        story:
          "Label before switch layout using controlFirst={false}. By default, switch appears before label (controlFirst=true). Note: Single switches only have labels, no descriptions.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
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
    );
  },
};

export const Group: Story = {
  args: { label: "Switch" },
  render: () => (
    <Switch.Group legend="Privacy settings">
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When you have MULTIPLE related switches, use Switch.Group. This provides proper semantic HTML (fieldset and legend) for grouped form controls. Each Switch.Item has its own label.",
      },
    },
  },
};

export const GroupWithError: Story = {
  args: { label: "Switch" },
  render: () => (
    <Switch.Group
      legend="Required settings"
      error="You must enable at least one notification method"
    >
      <Switch.Item label="Email notifications" />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" />
    </Switch.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Error messages only appear in Switch.Group (for multiple switches), not on single switches. This is because errors for single yes/no questions don't make semantic sense.",
      },
    },
  },
};

export const GroupWithDescription: Story = {
  args: { label: "Switch" },
  render: () => (
    <Switch.Group
      legend="Notification settings"
      description="Choose how you want to be notified about important updates"
    >
      <Switch.Item label="Email notifications" checked />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" checked />
    </Switch.Group>
  ),
};

export const GroupLabelFirst: Story = {
  args: { label: "Switch" },
  render: () => (
    <Switch.Group legend="Notification preferences" controlFirst={false}>
      <Switch.Item label="Email notifications" checked />
      <Switch.Item label="SMS notifications" />
      <Switch.Item label="Push notifications" checked />
    </Switch.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Switch.Group with controlFirst={false} shows labels before switches for all items in the group.",
      },
    },
  },
};

/**
 * Demonstrates single Switch flexibility across different cultural contexts and visual orders.
 * Tests all 4 combinations of text direction and control/label order for complete coverage:
 *
 * - English (LTR): Switch → Label (controlFirst=true)
 * - Spanish (LTR): Label → Switch (controlFirst=false)
 * - Arabic (RTL): Switch → Label (controlFirst=true)
 * - Hebrew (RTL): Label → Switch (controlFirst=false)
 */
export const MultipleLanguages: Story = {
  args: { label: "Switch" },
  render: () => (
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
  ),
};

/**
 * Demonstrates Switch.Group flexibility across different cultural contexts and visual orders.
 * Tests all 4 combinations of text direction and control/label order for complete coverage:
 *
 * - English (LTR): Switch → Label (controlFirst=true)
 * - Spanish (LTR): Label → Switch (controlFirst=false)
 * - Arabic (RTL): Switch → Label (controlFirst=true)
 * - Hebrew (RTL): Label → Switch (controlFirst=false)
 */
export const MultipleLanguagesGroup: Story = {
  args: { label: "Switch" },
  render: () => (
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
  ),
};
