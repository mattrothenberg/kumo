import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Input,
  KUMO_INPUT_VARIANTS,
  type KumoInputSize,
  type KumoInputVariant,
} from "./input";
import { InputGroup } from "./input-group";
import { propTester } from "../../utils/prop-tester";
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_INPUT_VARIANTS.size) as KumoInputSize[],
        "size",
        <Input placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_INPUT_VARIANTS.variant) as KumoInputVariant[],
        "variant",
        <Input placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Enter your email"
      description="We'll never share your email with anyone else"
    />
  ),
};

export const OptionalField: Story = {
  render: () => (
    <Input
      label="Phone Number"
      required={false}
      placeholder="+1 (555) 000-0000"
      description="Optional fields show '(optional)' indicator"
    />
  ),
};

export const WithLabelTooltip: Story = {
  render: () => (
    <Input
      label="API Key"
      labelTooltip="Find this in your dashboard under Settings > API Keys"
      placeholder="sk_live_..."
    />
  ),
};

export const WithTooltipAndOptional: Story = {
  render: () => (
    <Input
      label="Backup Email"
      required={false}
      labelTooltip="Used for account recovery if you lose access to your primary email"
      type="email"
      placeholder="backup@example.com"
    />
  ),
};

export const ReactNodeLabel: Story = {
  render: () => (
    <Input
      label={
        <span>
          Email for <strong>billing</strong>
        </span>
      }
      placeholder="billing@company.com"
      type="email"
    />
  ),
};

export const FormWithOptionalFields: Story = {
  render: () => (
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
  ),
};

export const WithError: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Invalid input"
      defaultValue="error@example.com"
      variant="error"
      error="Please enter a valid email address"
    />
  ),
};

export const WithValidationError: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="Enter your email"
      defaultValue="not-an-email"
      variant="error"
      error={{
        message: "Please enter a valid email address",
        match: "typeMismatch",
      }}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input label="Disabled Field" placeholder="Disabled input" disabled />
  ),
};

/**
 * InputGroup combines a label, input, and optional button into a single
 * visually connected component. Use this pattern when you need:
 * - Prefix labels (e.g., "https://", "$", "@")
 * - Suffix labels (e.g., "USD", ".com")
 * - Inline action buttons
 *
 * The Label automatically associates with the Input for accessibility.
 * Clicking the label will focus the input field.
 */
export const InputGroupExamples: Story = {
  render: function InputGroupExamplesRender() {
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
  },
};

/**
 * Size variants for InputGroup. The size prop on the root InputGroup
 * controls all child components (Label, Input, Button) via React context.
 */
export const InputGroupSizes: Story = {
  render: () => (
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
  ),
};

export const BareInput: Story = {
  render: () => <Input placeholder="Input without Field wrapper" />,
};
