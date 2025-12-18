import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader, KUMO_LOADER_VARIANTS } from "./loader";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Components/Loader",
  component: Loader,
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_LOADER_VARIANTS.size),
        "size",
        <Loader className="text-surface" />,
      )}
    </>
  ),
};

export const CustomSize: Story = {
  args: {
    size: 48,
    className: "text-surface",
  },
};
