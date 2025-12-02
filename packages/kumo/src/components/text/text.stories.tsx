import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is default text",
  },
};

export const AllVariants: Story = {
  args: {
    children: "Text",
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Text>Default text</Text>
      <Text size="sm">Small text</Text>
      <Text size="lg">Large text</Text>
      <Text bold>Bold text</Text>
      <Text variant="success">Success text</Text>
      <Text variant="error">Error text</Text>
      <Text variant="secondary">Secondary text</Text>
    </div>
  ),
};
