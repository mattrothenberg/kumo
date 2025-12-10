import type { Meta, StoryObj } from "@storybook/react";
import { InputArea } from "./input-area";
import { propTester } from "../../utils/prop-tester";
import { KUMO_INPUT_VARIANTS } from "./input";
import { Field } from "../field";

const meta: Meta<typeof InputArea> = {
  title: "Components/InputArea",
  component: InputArea,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_INPUT_VARIANTS.size),
        "size",
        <InputArea placeholder="Enter text..." />,
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
        <InputArea placeholder="Enter text..." />,
      )}
    </>
  ),
};

export const WithLabel: Story = {
  args: {
    placeholder: "Enter your email",
  },
  render: (args) => (
    <Field label="Email">
      <InputArea {...args} />
    </Field>
  ),
};

export const Error: Story = {
  args: {
    variant: "error",
    placeholder: "Invalid input",
    defaultValue: "error@example.com",
  },
  render: (args) => (
    <Field label="Email">
      <InputArea {...args} />
    </Field>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
  render: (args) => (
    <Field label="Disabled Field">
      <InputArea {...args} />
    </Field>
  ),
};
