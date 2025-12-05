import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./field";
import { Input } from "../input/input";

const meta = {
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    children: null,
  },
  render: () => (
    <Field label="Email" description="Enter your email address">
      <Input placeholder="email@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  args: {
    label: "Email",
    children: null,
  },
  render: () => (
    <Field
      label="Email"
      error={{ message: "Invalid email address", match: true }}
    >
      <Input placeholder="email@example.com" variant="error" />
    </Field>
  ),
};
