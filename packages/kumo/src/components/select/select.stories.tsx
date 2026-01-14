import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select";

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="1" placeholder="Select an option">
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
      <Select.Option value="3">Option 3</Select.Option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
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
  ),
};

export const RequiredField: Story = {
  render: () => (
    <Select
      label="Country"
      hideLabel={false}
      required
      placeholder="Select a country"
    >
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="uk">United Kingdom</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
    </Select>
  ),
};

export const OptionalField: Story = {
  render: () => (
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
  ),
};

export const WithLabelTooltip: Story = {
  render: () => (
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
  ),
};

export const RequiredWithTooltip: Story = {
  render: () => (
    <Select
      label="Plan"
      hideLabel={false}
      required
      labelTooltip="Choose the plan that best fits your needs. You can upgrade anytime."
      placeholder="Select a plan"
    >
      <Select.Option value="free">Free</Select.Option>
      <Select.Option value="pro">Pro - $9/month</Select.Option>
      <Select.Option value="enterprise">Enterprise - Contact us</Select.Option>
    </Select>
  ),
};

export const WithError: Story = {
  render: () => (
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
  ),
};

export const HiddenLabel: Story = {
  render: () => (
    <Select label="Language" hideLabel={true} placeholder="Select language">
      <Select.Option value="en">English</Select.Option>
      <Select.Option value="es">Spanish</Select.Option>
      <Select.Option value="fr">French</Select.Option>
      <Select.Option value="de">German</Select.Option>
    </Select>
  ),
};

export const Loading: Story = {
  render: () => (
    <Select
      label="Options"
      hideLabel={false}
      placeholder="Loading options..."
      loading
    >
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
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
  ),
};
