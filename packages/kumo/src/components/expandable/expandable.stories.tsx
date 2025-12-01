import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Expandable } from "./expandable";
import { Text } from "../text";

const meta = {
  title: "Components/Expandable",
  component: Expandable,
} satisfies Meta<typeof Expandable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Click to expand",
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Expandable title="Click to expand" open={open} onOpenChange={setOpen}>
        <Text>This is the expandable content that can be shown or hidden.</Text>
      </Expandable>
    );
  },
};
