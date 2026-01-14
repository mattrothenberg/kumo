import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Input } from "../input/input";
import { Select } from "../select/select";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label>Email Address</Label>,
};

export const Required: Story = {
  render: () => <Label required>Password</Label>,
};

export const Optional: Story = {
  render: () => <Label showOptional>Middle Name</Label>,
};

export const WithTooltip: Story = {
  render: () => (
    <Label tooltip="We'll use this to send you important updates about your account">
      Email Address
    </Label>
  ),
};

export const RequiredWithTooltip: Story = {
  render: () => (
    <Label required tooltip="Your password must be at least 8 characters long">
      Password
    </Label>
  ),
};

export const OptionalWithTooltip: Story = {
  render: () => (
    <Label showOptional tooltip="This helps us personalize your experience">
      Nickname
    </Label>
  ),
};

export const WithReactNodeChildren: Story = {
  render: () => (
    <Label>
      <span>
        Accept the <strong>terms and conditions</strong>
      </span>
    </Label>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Label>Default Label</Label>
      <Label required>Required Label</Label>
      <Label showOptional>Optional Label</Label>
      <Label tooltip="More information">Label with Tooltip</Label>
      <Label required tooltip="Required field info">
        Required with Tooltip
      </Label>
      <Label showOptional tooltip="Optional field info">
        Optional with Tooltip
      </Label>
    </div>
  ),
};

// Integration examples showing how the label props work with form components
export const InputWithRequiredLabel: Story = {
  name: "Input - Required",
  render: () => (
    <Input
      label="Email Address"
      required
      labelTooltip="We'll send account notifications here"
      placeholder="you@example.com"
    />
  ),
};

export const InputWithOptionalLabel: Story = {
  name: "Input - Optional",
  render: () => (
    <Input
      label="Phone Number"
      required={false}
      labelTooltip="For two-factor authentication (optional)"
      placeholder="+1 (555) 000-0000"
    />
  ),
};

export const SelectWithRequiredLabel: Story = {
  name: "Select - Required",
  render: () => (
    <Select
      label="Country"
      required
      hideLabel={false}
      labelTooltip="Select your country of residence"
      placeholder="Select a country"
    >
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="uk">United Kingdom</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
    </Select>
  ),
};

export const FormExample: Story = {
  name: "Form with Mixed Required/Optional",
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input label="Full Name" required placeholder="John Doe" />
      <Input
        label="Email"
        required
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
  ),
};
