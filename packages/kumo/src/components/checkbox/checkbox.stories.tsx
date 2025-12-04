import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, KUMO_CHECKBOX_VARIANTS } from "./checkbox";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_CHECKBOX_VARIANTS.variant),
        "variant",
        <Checkbox label="Checkbox" />,
      )}
    </>
  ),
};

export const Checked: Story = {
  args: {
    label: "Checked",
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Indeterminate",
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: "Checked & Disabled",
    checked: true,
    disabled: true,
  },
};

export const IndeterminateDisabled: Story = {
  args: {
    label: "Indeterminate & Disabled",
    indeterminate: true,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    checked: false,
  },
};
