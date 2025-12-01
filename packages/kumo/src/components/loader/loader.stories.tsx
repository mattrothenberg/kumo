import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomSize: Story = {
  args: {
    size: 32,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loader size={12} />
      <Loader size={16} />
      <Loader size={24} />
      <Loader size={32} />
      <Loader size={48} />
    </div>
  ),
};
