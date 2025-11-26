import { Expandable, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { useState } from "react";

export default function ExpandableDoc() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <DocLayout
      title="Expandable"
      description="A vertically stacked set of interactive headings that each reveal a section of content."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Expandable title="What is Kumo?">
  Kumo is Cloudflare's new design system.
</Expandable>`}
        >
          <Expandable
            title="What is Kumo?"
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
            }}
          >
            Kumo is Cloudflare's new design system.
          </Expandable>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Expandable } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Expandable } from "@cloudflare/kumo/components/expandable";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Expandable } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Expandable title="Question">
      Answer content goes here.
    </Expandable>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Single Item</h3>
            <ComponentExample
              code={`<Expandable title="What is Kumo?">
  Kumo is Cloudflare's new design system.
</Expandable>`}
            >
              <Expandable title="What is Kumo?">
                Kumo is Cloudflare's new design system.
              </Expandable>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Multiple Items</h3>
            <ComponentExample
              code={`<div className="space-y-2">
  <Expandable title="What is Kumo?">
    Kumo is Cloudflare's new design system.
  </Expandable>
  <Expandable title="How do I use it?">
    Install the components and import them into your project.
  </Expandable>
  <Expandable title="Is it open source?">
    Check the repository for license information.
  </Expandable>
</div>`}
            >
              <div className="w-full space-y-2">
                <Expandable title="What is Kumo?">
                  Kumo is Cloudflare's new design system.
                </Expandable>
                <Expandable title="How do I use it?">
                  Install the components and import them into your project.
                </Expandable>
                <Expandable title="Is it open source?">
                  Check the repository for license information.
                </Expandable>
              </div>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">API Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">title</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">children</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
