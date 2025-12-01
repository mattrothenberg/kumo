import type { Meta, StoryObj } from "@storybook/react";
import { ClipboardText, KUMO_CLIPBOARD_TEXT_VARIANTS } from "./clipboard-text";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof ClipboardText> = {
  title: "Components/ClipboardText",
  component: ClipboardText,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_CLIPBOARD_TEXT_VARIANTS.size),
        "size",
        <ClipboardText text="npm install @cloudflare/kumo" />,
      )}
    </>
  ),
};

export const ApiKey: Story = {
  args: {
    text: "sk_live_abc123xyz789",
  },
};

export const LongText: Story = {
  args: {
    text: "This is a much longer text that demonstrates how the clipboard text component handles overflow with extended content",
  },
};

export const CommandLine: Story = {
  args: {
    text: "npx create-cloudflare@latest my-app --template kumo",
    size: "base",
  },
};
