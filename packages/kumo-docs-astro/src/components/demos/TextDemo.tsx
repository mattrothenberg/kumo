import { Text } from "@cloudflare/kumo";

export function TextVariantsDemo() {
  return (
    <div className="space-y-2">
      <Text variant="heading1">Heading 1</Text>
      <Text variant="heading2">Heading 2</Text>
      <Text variant="heading3">Heading 3</Text>
      <Text variant="body">Body text</Text>
      <Text variant="secondary">Secondary text</Text>
      <Text variant="mono">Monospace text</Text>
    </div>
  );
}

export function TextSizesDemo() {
  return (
    <div className="space-y-2">
      <Text size="sm">Small size</Text>
      <Text size="base">Base size</Text>
      <Text size="lg">Large size</Text>
    </div>
  );
}
