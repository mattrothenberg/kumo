import type { Meta, StoryObj } from "@storybook/react";
import { Code } from "./code";

const meta = {
  title: "Components/Code",
  component: Code,
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
      Use the{" "}
      <code className="font-mono text-sm text-kumo-neutral-subtle">
        console.log()
      </code>{" "}
      function to debug.
    </p>
  ),
};
