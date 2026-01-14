import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Radio, RadioGroup, KUMO_RADIO_VARIANTS } from "./radio";

const meta = {
  title: "Components/Radio",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: "Notification preference",
    children: null,
  },
  render: () => (
    <Radio.Group legend="Notification preference" defaultValue="email">
      <Radio.Item label="Email" value="email" />
      <Radio.Item label="SMS" value="sms" />
      <Radio.Item label="Push notification" value="push" />
    </Radio.Group>
  ),
};

export const Variants: Story = {
  args: {
    legend: "Variants",
    children: null,
  },
  render: () => (
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
  ),
};

export const Horizontal: Story = {
  args: {
    legend: "Size",
    children: null,
  },
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal layout using orientation="horizontal". Items wrap to the next line when there isn\'t enough space.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    legend: "Plan selection",
    children: null,
  },
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates both entirely disabled groups and individual disabled items within an otherwise enabled group.",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    legend: "Payment method",
    children: null,
  },
  render: () => (
    <Radio.Group
      legend="Payment method"
      error="Please select a payment method to continue"
    >
      <Radio.Item label="Credit Card" value="card" />
      <Radio.Item label="PayPal" value="paypal" />
      <Radio.Item label="Bank Transfer" value="bank" />
    </Radio.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Error state with validation message. Use this when form validation fails.",
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    legend: "Account type",
    children: null,
  },
  render: () => (
    <Radio.Group
      legend="Account type"
      description="Choose the account type that best fits your needs. You can change this later in settings."
      defaultValue="personal"
    >
      <Radio.Item label="Personal" value="personal" />
      <Radio.Item label="Business" value="business" />
      <Radio.Item label="Enterprise" value="enterprise" />
    </Radio.Group>
  ),
};

export const WithErrorAndDescription: Story = {
  args: {
    legend: "Subscription tier",
    children: null,
  },
  render: () => (
    <Radio.Group
      legend="Subscription tier"
      description="Select a plan to get started"
      error="A subscription tier is required"
    >
      <Radio.Item label="Starter" value="starter" />
      <Radio.Item label="Professional" value="professional" />
      <Radio.Item label="Enterprise" value="enterprise" />
    </Radio.Group>
  ),
};

export const ControlPositionEnd: Story = {
  args: {
    legend: "Preferences",
    children: null,
  },
  render: () => (
    <Radio.Group
      legend="Preferences"
      controlPosition="end"
      defaultValue="option1"
    >
      <Radio.Item label="Label appears before radio" value="option1" />
      <Radio.Item label="This layout may suit RTL languages" value="option2" />
      <Radio.Item label="Or specific design requirements" value="option3" />
    </Radio.Group>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Label before radio layout using controlPosition="end". By default, radio appears before label (controlPosition="start").',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    legend: "Contact preference",
    children: null,
  },
  render: () => {
    const [value, setValue] = React.useState("email");
    return (
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
    );
  },
};

function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const shippingValue = formData.get("shipping");
  const shipping =
    typeof shippingValue === "string" ? shippingValue : "unknown";
  alert(`Selected shipping: ${shipping}`);
}

function InFormExample() {
  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <Radio.Group
        legend="Shipping method"
        name="shipping"
        defaultValue="standard"
      >
        <Radio.Item label="Standard (5-7 days)" value="standard" />
        <Radio.Item label="Express (2-3 days)" value="express" />
        <Radio.Item label="Overnight" value="overnight" />
      </Radio.Group>
      <button
        type="submit"
        className="w-fit rounded-md bg-primary px-4 py-2 text-white"
      >
        Submit
      </button>
    </form>
  );
}

export const InForm: Story = {
  args: {
    legend: "Shipping method",
    children: null,
  },
  render: () => <InFormExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Radio.Group with a name prop for form submission. The selected value is submitted with the form data.",
      },
    },
  },
};

/**
 * Demonstrates Radio.Group flexibility with controlPosition option.
 *
 * - English: Radio → Label (controlPosition="start", default)
 * - Spanish: Label → Radio (controlPosition="end")
 */
export const MultipleLanguages: Story = {
  args: {
    legend: "Languages",
    children: null,
  },
  render: () => (
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
  ),
};

export const HorizontalVsVertical: Story = {
  args: {
    legend: "Orientation comparison",
    children: null,
  },
  render: () => (
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
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of vertical (default) and horizontal orientations. Use horizontal for short option lists or when horizontal space is abundant.",
      },
    },
  },
};
