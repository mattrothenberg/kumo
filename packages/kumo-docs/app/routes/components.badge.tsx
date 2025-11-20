import { Badge, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function BadgeDoc() {
  return (
    <DocLayout
      title="Badge"
      description="Displays a small label for status, categorization, or metadata."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="beta">Beta</Badge>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="beta">Beta</Badge>
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <CodeBlock lang="bash" code={`npm install @cloudflare/kumo`} />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Badge } from "@cloudflare/kumo";

export default function Example() {
  return <Badge variant="primary">Beta</Badge>;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-6">Examples</h2>

        {/* Variants */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Variants</h3>
          <div className="space-y-8">
            <div>
              <h4 className="text-base font-medium mb-3">Primary</h4>
              <ComponentExample
                code={`<Badge variant="primary">Primary</Badge>`}
              >
                <Badge variant="primary">Primary</Badge>
              </ComponentExample>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Secondary</h4>
              <ComponentExample
                code={`<Badge variant="secondary">Secondary</Badge>`}
              >
                <Badge variant="secondary">Secondary</Badge>
              </ComponentExample>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Destructive</h4>
              <ComponentExample
                code={`<Badge variant="destructive">Destructive</Badge>`}
              >
                <Badge variant="destructive">Destructive</Badge>
              </ComponentExample>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Outline</h4>
              <ComponentExample
                code={`<Badge variant="outline">Outline</Badge>`}
              >
                <Badge variant="outline">Outline</Badge>
              </ComponentExample>
            </div>
            <div>
              <h4 className="text-base font-medium mb-3">Beta</h4>
              <ComponentExample
                code={`<Badge variant="beta">Beta</Badge>`}
              >
                <Badge variant="beta">Beta</Badge>
              </ComponentExample>
            </div>
          </div>
        </div>

        {/* In a sentence */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">In a sentence</h3>
          <ComponentExample
            code={`<p className="flex items-center gap-2">
  Workers
  <Badge variant="primary">Beta</Badge>
</p>`}
          >
            <p className="flex items-center gap-2">
              Workers
              <Badge variant="beta">Beta</Badge>
            </p>
          </ComponentExample>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">API Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">variant</td>
                <td className="py-3 px-4 font-mono text-xs">
                  "primary" | "secondary" | "destructive" | "outline" | "beta"
                </td>
                <td className="py-3 px-4 font-mono text-xs">"primary"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">className</td>
                <td className="py-3 px-4 font-mono text-xs">string</td>
                <td className="py-3 px-4 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">children</td>
                <td className="py-3 px-4 font-mono text-xs">React.ReactNode</td>
                <td className="py-3 px-4 font-mono text-xs">required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
