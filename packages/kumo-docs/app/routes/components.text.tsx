import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "~/components/code/code-lazy";
import { Text } from "~/components/text/text";

export default function TextDoc() {
  return (
    <DocLayout
      title="Text"
      description="A typography component for various heading and copy styles."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<div>
  <Text variant="h1">Heading 1</Text>
  <Text variant="h2">Heading 2</Text>
  <Text variant="h3">Heading 3</Text>
</div>
<div>
  <Text>Body</Text>
  <Text bold>Body bold</Text>
  <Text variant="secondary">Body secondary</Text>
  <Text variant="success">Success</Text>
  <Text variant="error">Error</Text>
  <Text variant="mono">Monospace</Text>
  <Text variant="mono-secondary">Monospace secondary</Text>
</div>
<div>
  <Text size="xs">Body xs</Text>
  <Text size="sm">Body sm</Text>
  <Text size="lg">Body lg</Text>
  <Text variant="mono" size="lg">
    Monospace lg
  </Text>
</div>`}
        >
          <div className="flex xl:gap-10 items-start">
            <div>
              <Text variant="heading1">Heading 1</Text>
              <Text variant="heading2">Heading 2</Text>
              <Text variant="heading3">Heading 3</Text>
            </div>
            <div className="grid">
              <Text>Body</Text>
              <Text bold>Body bold</Text>
              <Text variant="secondary">Body secondary</Text>
              <Text variant="success">Success</Text>
              <Text variant="error">Error</Text>
              <Text variant="mono">Monospace</Text>
              <Text variant="mono-secondary">Monospace secondary</Text>
            </div>
            <div className="grid">
              <Text size="xs">Body xs</Text>
              <Text size="sm">Body sm</Text>
              <Text size="lg">Body lg</Text>
              <Text variant="mono" size="lg">
                Monospace lg
              </Text>
            </div>
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Text } from "~/components/text/text";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Text } from "~/components/text/text";

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
