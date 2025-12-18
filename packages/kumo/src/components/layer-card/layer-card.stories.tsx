import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "../button/button";
import { LayerCard } from "./layer-card";
import { Text } from "../text";

const meta = {
  title: "Components/LayerCard",
  component: LayerCard,
} satisfies Meta<typeof LayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LayerCard className="w-[250px]">
      <LayerCard.Secondary className="flex items-center justify-between">
        <div>Next Steps</div>
        <Button variant="ghost" size="sm" shape="square">
          <ArrowRightIcon size={16} />
        </Button>
      </LayerCard.Secondary>

      <LayerCard.Primary>
        <Text>Get started with Kumo</Text>
      </LayerCard.Primary>
    </LayerCard>
  ),
};
