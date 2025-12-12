import type { Meta, StoryObj } from "@storybook/react";
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
