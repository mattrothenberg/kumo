import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text, KUMO_TEXT_VARIANTS } from "./text";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Components/Text",
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_TEXT_VARIANTS.variant),
        "variant",
        <Text>Sample text</Text>,
      )}
    </>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_TEXT_VARIANTS.size),
        "size",
        <Text>Sample text</Text>,
      )}
    </>
  ),
};

export const Bold: Story = {
  args: {
    bold: true,
    children: "Bold text",
  },
};
