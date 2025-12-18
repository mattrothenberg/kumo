import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Collapsible } from "./collapsible";
import { Text } from "../text";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Click to expand",
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible label="Click to expand" open={open} onOpenChange={setOpen}>
        <Text>
          This is the collapsible content that can be shown or hidden.
        </Text>
      </Collapsible>
    );
  },
};
