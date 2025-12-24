import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentRegistryView } from "./agents";

const meta = {
  component: ComponentRegistryView,
  title: "Agents/Component Registry",
  tags: ["!autodocs"],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ComponentRegistryView>;

export default meta;

type Story = StoryObj<typeof ComponentRegistryView>;

export const ComponentRegistry: Story = {};
