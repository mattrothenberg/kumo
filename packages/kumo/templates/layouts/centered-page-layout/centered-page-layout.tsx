import { Text } from "@cloudflare/kumo";
import { Button } from "@cloudflare/kumo";
import { LayerCard } from "@cloudflare/kumo";

export function CenteredPageLayout() {
  return (
    <div className="min-h-screen bg-surface p-8 text-surface">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Text variant="heading1" as="h1">
              Page Title
            </Text>
            <div className="hidden md:block">
              <Text variant="secondary" size="lg">
                A brief description of what this page does.
              </Text>
            </div>
          </div>
          <Button
            variant="secondary"
            size="base"
            className="hidden md:flex"
            onClick={() => console.log("Action button clicked")}
          >
            Action
          </Button>
        </div>

        {/* Content Cards */}
        <div className="flex flex-col gap-4">
          <LayerCard>
            <LayerCard.Primary>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Text variant="body" bold>
                    Card Title
                  </Text>
                  <Text variant="secondary" size="sm">
                    Card subtitle or metadata
                  </Text>
                </div>
                <Button variant="secondary" size="sm">
                  Action
                </Button>
              </div>
            </LayerCard.Primary>

            <LayerCard.Secondary>
              <div className="flex flex-col gap-3">
                <Text variant="secondary" size="sm">
                  Additional details or content goes here. You can add multiple
                  sections, lists, or any other content.
                </Text>
              </div>
            </LayerCard.Secondary>
          </LayerCard>

          <LayerCard>
            <LayerCard.Primary>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Text variant="body" bold>
                    Another Card
                  </Text>
                  <Text variant="secondary" size="sm">
                    More content
                  </Text>
                </div>
              </div>
            </LayerCard.Primary>
          </LayerCard>
        </div>
      </div>
    </div>
  );
}
