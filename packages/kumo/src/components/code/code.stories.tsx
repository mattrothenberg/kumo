import type { Meta, StoryObj } from "@storybook/react";
import { Code } from "./code";

const meta = {
  title: "Components/Code",
  component: Code,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    lang: "ts",
    code: 'const hello = "world";',
  },
};

export const Inline: Story = {
  args: {
    lang: "ts",
    code: "console.log()",
  },
  render: () => (
    <p>
      Use the <Code lang="ts" code="console.log()" /> function to debug.
    </p>
  ),
};
