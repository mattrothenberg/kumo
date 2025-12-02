import type { Meta, StoryObj } from "@storybook/react-vite";
import { TailwindColorTokens } from "./TailwindColors";

const meta = {
  component: TailwindColorTokens,
  title: "Design-Tokens/Colors",
  tags: ["!autodocs"],
} satisfies Meta<typeof TailwindColorTokens>;

export default meta;

type Story = StoryObj<typeof TailwindColorTokens>;

export const Colors = {
  args: { display: "colors" },
} satisfies Story;

export const TextColors = {
  args: { display: "text-colors" },
} satisfies Story;
