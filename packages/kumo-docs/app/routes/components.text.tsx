import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock, Text } from "@cloudflare/kumo";

export default function TextDoc() {
  return (
    <DocLayout
      title="Text"
      description="A typography component for various heading and copy styles."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<div className="flex gap-10 xl:gap-10 items-start">
  <div className="grid gap-2">
    <Text variant="heading1">Heading 1</Text>
    <Text variant="heading2">Heading 2</Text>
    <Text variant="heading3">Heading 3</Text>
    <Text variant="secondary">Body secondary</Text>
    <Text variant="mono">Monospace</Text>
    <Text variant="mono-secondary">Monospace secondary</Text>
    <Text variant="success">Success</Text>
    <Text variant="error">Error</Text>
  </div>
  <div className="grid gap-2">
    <Text variant="mono" size="lg">
      Monospace lg
    </Text>
    <Text size="lg">Body lg</Text>
    <Text size="sm">Body sm</Text>
    <Text size="xs">Body xs</Text>
  </div>
  <div className="grid gap-2">
    <Text>Body</Text>
    <Text bold>Body bold</Text>
  </div>
</div>`}
        >
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="heading1">Heading 1</Text>
    <p className="text-xs text-muted font-mono">
      text-3xl (30px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="heading2">Heading 2</Text>
    <p className="text-xs text-muted font-mono">  
      text-2xl (24px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="heading3">Heading 3</Text>
    <p className="text-xs text-muted font-mono">
      text-lg (16px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text>Body</Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text bold>Body bold</Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text size="lg">Body lg</Text>
    <p className="text-xs text-muted font-mono">
      text-lg (16px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text size="sm">Body sm</Text>
    <p className="text-xs text-muted font-mono">
      text-sm (13px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text size="xs">Body xs</Text>
    <p className="text-xs text-muted font-mono">
      text-xs (12px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="secondary">Body secondary</Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="mono">Monospace</Text>
    <p className="text-xs text-muted font-mono">
      text-sm (13px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="mono" size="lg">
      Monospace lg
    </Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="mono-secondary">Monospace secondary</Text>
    <p className="text-xs text-muted font-mono">
      text-sm (13px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="success">Success</Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
  <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 justify-end">
    <Text variant="error">Error</Text>
    <p className="text-xs text-muted font-mono">
      text-base (14px)
    </p>
  </div>
</div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Text } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Text } from "@cloudflare/kumo/components/text";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Text } from "@cloudflare/kumo";

export default function Example() {
  return <Text>Your content here</Text>;
}`}
        />
        <section className="mt-8 space-y-4 [&_code]:text-sm">
          <Text variant="heading3">Restrictions</Text>
          <Text>
            The <code>bold</code> and <code>size</code> props are intentionally
            restricted to the <code>base</code>, <code>secondary</code>,{" "}
            <code>success</code>, and <code>error</code> text variants.
          </Text>
          <CodeBlock
            lang="tsx"
            code={`<Text size="sm" bold>Body</Text>
<Text variant="secondary" bold>Body secondary</Text>
<Text variant="success" size="lg">Success</Text>
<Text variant="error">Error</Text>`}
          />
          <Text>
            Monospace variants (<code>mono</code> and{" "}
            <code>mono-secondary</code>) can only set <code>size</code> to{" "}
            <code>lg</code> and cannot use the <code>bold</code> prop:
          </Text>
          <CodeBlock
            lang="tsx"
            code={`<Text variant="mono">Monospace</Text>
<Text variant="mono" size="lg">Monospace</Text>
<Text variant="mono" bold>Monospace</Text> // Doesn't compile`}
          />
          <Text>
            Headings (i.e. <code>h1</code>, <code>h2</code> and <code>h3</code>{" "}
            variants) cannot use these props at all:
          </Text>
          <CodeBlock
            lang="tsx"
            code={`<Text variant="h1" bold>Heading 1</Text> // Doesn't compile`}
          />
        </section>
      </ComponentSection>
    </DocLayout>
  );
}
