import type { Meta, StoryObj } from "@storybook/react";
import { Input, KUMO_INPUT_VARIANTS } from "./input";
import { propTester } from "../../utils/prop-tester";

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
        Object.keys(KUMO_INPUT_VARIANTS.size),
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
        Object.keys(KUMO_INPUT_VARIANTS.variant),
        "variant",
        <Input placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const WithLabel: Story = {
  args: {
    label: "Email",
    hideLabel: false,
    placeholder: "Enter your email",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    placeholder: "Invalid input",
    defaultValue: "error@example.com",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};
