import { LayerCard, Text, Button } from "@cloudflare/kumo";
import { ArrowRight } from "@phosphor-icons/react";

export function LayerCardDemo() {
  return (
    <LayerCard className="w-[250px]">
      <LayerCard.Secondary className="flex items-center justify-between">
        <div>Next Steps</div>
        <Button variant="ghost" size="sm" shape="square">
          <ArrowRight size={16} />
        </Button>
      </LayerCard.Secondary>

      <LayerCard.Primary>
        <Text>Get started with Kumo</Text>
      </LayerCard.Primary>
    </LayerCard>
  );
}

export function LayerCardVariantsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <LayerCard className="w-[280px]">
        <LayerCard.Secondary>
          <Text variant="secondary" size="sm">
            Getting Started
          </Text>
        </LayerCard.Secondary>
        <LayerCard.Primary>
          <Text weight="medium">Install the package</Text>
          <Text variant="secondary" size="sm" className="mt-1">
            Run npm install to get started
          </Text>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard className="w-[280px]">
        <LayerCard.Primary>
          <Text weight="medium">Primary Only</Text>
          <Text variant="secondary" size="sm" className="mt-1">
            Card without secondary section
          </Text>
        </LayerCard.Primary>
      </LayerCard>

      <LayerCard className="w-[280px]">
        <LayerCard.Secondary className="flex items-center justify-between">
          <Text variant="secondary" size="sm">
            Documentation
          </Text>
          <Button variant="ghost" size="xs">
            View all
          </Button>
        </LayerCard.Secondary>
        <LayerCard.Primary>
          <Text weight="medium">Read the docs</Text>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  );
}
