import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon } from "@phosphor-icons/react";
import { Banner, KUMO_BANNER_VARIANTS } from "./banner";
import { propTester } from "../../utils/prop-tester";
import { Text } from "../text";

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
        <Banner icon={<InfoIcon size={16} />}>This is a banner message</Banner>,
      )}
    </>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <Banner icon={<InfoIcon size={16} />}>
      <Text DANGEROUS_className="text-inherit">
        This banner supports <strong>custom content</strong> in the text slot.
      </Text>
    </Banner>
  ),
};
