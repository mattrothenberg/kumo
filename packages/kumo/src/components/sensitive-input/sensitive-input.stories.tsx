import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SensitiveInput } from "./sensitive-input";
import { Field } from "../field";

const meta = {
  title: "Components/SensitiveInput",
  component: SensitiveInput,
} satisfies Meta<typeof SensitiveInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "sk_live_abc123xyz789",
  },
  render: (args) => (
    <Field label="API Key">
      <SensitiveInput {...args} />
    </Field>
  ),
};

const sizes = ["xs", "sm", "base", "lg"] as const;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-center gap-2">
          <span className="w-12 text-sm text-muted">{size}</span>
          <Field label={`${size} size`}>
            <SensitiveInput size={size} defaultValue="secret-api-key-123" />
          </Field>
        </div>
      ))}
    </div>
  ),
};

export const ExistingValue: Story = {
  args: {
    defaultValue: "sk_live_abc123xyz789",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When initialized with a value, the input shows masked dots. Click to reveal.",
      },
    },
  },
  render: (args) => (
    <Field label="API Key">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const EmptyInput: Story = {
  args: {
    placeholder: "Enter your secret...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty inputs start in editing mode. Type to enter a value - it will be masked. Eye icon appears when there is content.",
      },
    },
  },
  render: (args) => (
    <Field label="Secret">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("initial-secret");
    return (
      <div className="flex flex-col gap-4">
        <Field label="Controlled Secret">
          <SensitiveInput value={value} onValueChange={setValue} />
        </Field>
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
    );
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    defaultValue: "invalid-key",
  },
  render: (args) => (
    <Field label="Invalid Key">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: "cannot-edit",
    disabled: true,
  },
  render: (args) => (
    <Field label="Disabled Secret">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const ReadOnly: Story = {
  args: {
    defaultValue: "view-only-secret-key",
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Read-only mode allows clicking to reveal but prevents editing.",
      },
    },
  },
  render: (args) => (
    <Field label="Read-only Secret">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const WithVisibleLabel: Story = {
  args: {
    defaultValue: "my-secret-value",
  },
  render: (args) => (
    <Field label="Password">
      <SensitiveInput {...args} />
    </Field>
  ),
};

export const WithCopyCallback: Story = {
  args: {
    defaultValue: "copyable-secret-key",
    onCopy: () => console.log("Value copied!"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover to reveal copy button in top right. Works when masked or revealed.",
      },
    },
  },
  render: (args) => (
    <Field label="API Key">
      <SensitiveInput {...args} />
    </Field>
  ),
};
