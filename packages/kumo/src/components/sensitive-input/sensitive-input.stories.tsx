import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SensitiveInput } from "./sensitive-input";

const meta = {
  title: "Components/SensitiveInput",
  component: SensitiveInput,
} satisfies Meta<typeof SensitiveInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />
  ),
};

const sizes = ["xs", "sm", "base", "lg"] as const;

export const Sizes: Story = {
  render: () => (
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
  ),
};

export const ExistingValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When initialized with a value, the input shows masked dots. Click to reveal.",
      },
    },
  },
  render: () => (
    <SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />
  ),
};

export const EmptyInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Empty inputs start in editing mode. Type to enter a value - it will be masked. Eye icon appears when there is content.",
      },
    },
  },
  render: () => (
    <SensitiveInput label="Secret" placeholder="Enter your secret..." />
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("initial-secret");
    return (
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
    );
  },
};

export const WithError: Story = {
  render: () => (
    <SensitiveInput
      label="Invalid Key"
      variant="error"
      defaultValue="invalid-key"
      error="This API key is not valid"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <SensitiveInput
      label="Disabled Secret"
      defaultValue="cannot-edit"
      disabled
    />
  ),
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only mode allows clicking to reveal but prevents editing.",
      },
    },
  },
  render: () => (
    <SensitiveInput
      label="Read-only Secret"
      defaultValue="view-only-secret-key"
      readOnly
    />
  ),
};

export const WithDescription: Story = {
  render: () => (
    <SensitiveInput
      label="Password"
      defaultValue="my-secret-value"
      description="Keep this password secure and don't share it"
    />
  ),
};

export const OptionalField: Story = {
  render: () => (
    <SensitiveInput
      label="Backup Password"
      required={false}
      placeholder="Enter backup password"
    />
  ),
};

export const WithLabelTooltip: Story = {
  render: () => (
    <SensitiveInput
      label="Secret Key"
      labelTooltip="Find this in your dashboard under Settings > API Keys"
      defaultValue="sk_live_abc123xyz789"
    />
  ),
};

export const WithCopyCallback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Hover to reveal copy button in top right. Works when masked or revealed.",
      },
    },
  },
  render: () => (
    <SensitiveInput
      label="API Key"
      defaultValue="copyable-secret-key"
      onCopy={() => console.log("Value copied!")}
    />
  ),
};

export const BareInput: Story = {
  render: () => (
    <SensitiveInput
      defaultValue="sk_live_abc123xyz789"
      placeholder="Input without Field wrapper"
    />
  ),
};
