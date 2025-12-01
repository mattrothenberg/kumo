import type { Meta, StoryObj } from "@storybook/react";
import { Badge, KUMO_BADGE_VARIANTS } from "./badge";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BADGE_VARIANTS.variant),
        "variant",
        <Badge>Badge</Badge>,
      )}
    </>
  ),
};
