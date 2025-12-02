import type { Meta, StoryObj } from "@storybook/react";
import { ClipboardText } from "./clipboard-text";

const meta = {
  title: "Components/ClipboardText",
  component: ClipboardText,
  tags: ["autodocs"],
} satisfies Meta<typeof ClipboardText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Copy this text",
  },
};
