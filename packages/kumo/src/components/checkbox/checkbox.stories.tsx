import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Checkbox",
  },
};

export const Checked: Story = {
  args: {
    label: "Checked",
    checked: true,
  },
};

export const Intederminate: Story = {
  args: {
    label: "Intederminate",
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

export const Error: Story = {
  args: {
    label: "Invalid",
    variant: "error",
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
  },
};
