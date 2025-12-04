import type { Meta, StoryObj } from "@storybook/react";
import { Surface } from "./surface";
import { Text } from "../text/text";

const meta = {
  title: "Components/Surface",
  component: Surface,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <Text>Surface content</Text>,
  },
};
