import { Surface, Text } from "@cloudflare/kumo";

export function SurfaceDemo() {
  return (
    <Surface className="rounded-lg p-6">
      <Text size="lg" weight="semibold">
        Surface Component
      </Text>
      <Text variant="secondary" className="mt-2">
        A container with consistent elevation and border styling.
      </Text>
    </Surface>
  );
}

export function SurfaceAsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Surface as="section" className="rounded-lg p-4">
        <Text weight="medium">As section element</Text>
      </Surface>
      <Surface as="article" className="rounded-lg p-4">
        <Text weight="medium">As article element</Text>
      </Surface>
      <Surface as="aside" className="rounded-lg p-4">
        <Text weight="medium">As aside element</Text>
      </Surface>
    </div>
  );
}

export function SurfaceNestedDemo() {
  return (
    <Surface className="rounded-lg p-6">
      <Text weight="semibold">Outer Surface</Text>
      <Surface className="mt-4 rounded-md bg-surface-2 p-4">
        <Text variant="secondary">Nested Surface</Text>
      </Surface>
    </Surface>
  );
}
