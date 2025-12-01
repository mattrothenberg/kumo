import type { Meta, StoryObj } from "@storybook/react";
import { InfoIcon } from "@phosphor-icons/react";
import { Banner, KUMO_BANNER_VARIANTS } from "./banner";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BANNER_VARIANTS.variant),
        "variant",
        <Banner
          text="This is a banner message"
          icon={<InfoIcon size={16} />}
        />,
      )}
    </>
  ),
};
