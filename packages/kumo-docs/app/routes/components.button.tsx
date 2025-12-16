import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Callout } from "~/components/docs/callout";
import { CodeBlock } from "@cloudflare/kumo";

export default function ButtonDoc() {
  return (
    <DocLayout
      title="Button"
      description="Displays a button or a component that looks like a button."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Button variant="secondary">Button</Button>
<Button variant="secondary" shape="square" icon={PlusIcon} />`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary">Button</Button>
            <Button variant="secondary" shape="square" icon={PlusIcon} />
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Button } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Button } from "@cloudflare/kumo/components/button";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Button } from "@cloudflare/kumo";

export default function Example() {
  return <Button variant="secondary">Click me</Button>;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        {/* Variants */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Variants</h3>

          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-base font-medium">Primary</h4>
              <ComponentExample
                code={`<Button variant="primary">Primary</Button>`}
              >
                <Button variant="primary">Primary</Button>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Secondary</h4>
              <ComponentExample
                code={`<Button variant="secondary">Secondary</Button>`}
              >
                <Button variant="secondary">Secondary</Button>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Ghost</h4>
              <ComponentExample code={`<Button variant="ghost">Ghost</Button>`}>
                <Button variant="ghost">Ghost</Button>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Destructive</h4>
              <ComponentExample
                code={`<Button variant="destructive">Destructive</Button>`}
              >
                <Button variant="destructive">Destructive</Button>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Outline</h4>
              <ComponentExample
                code={`<Button variant="outline">Outline</Button>`}
              >
                <Button variant="outline">Outline</Button>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">
                Secondary Destructive
              </h4>
              <ComponentExample
                code={`<Button variant="secondary-destructive">Secondary Destructive</Button>`}
              >
                <Button variant="secondary-destructive">
                  Secondary Destructive
                </Button>
              </ComponentExample>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Sizes</h3>
          <ComponentExample
            code={`<Button size="xs" variant="secondary">Extra Small</Button>
<Button size="sm" variant="secondary">Small</Button>
<Button size="base" variant="secondary">Base</Button>
<Button size="lg" variant="secondary">Large</Button>`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs" variant="secondary">
                Extra Small
              </Button>
              <Button size="sm" variant="secondary">
                Small
              </Button>
              <Button size="base" variant="secondary">
                Base
              </Button>
              <Button size="lg" variant="secondary">
                Large
              </Button>
            </div>
          </ComponentExample>
        </div>

        {/* With Icon */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Icon</h3>
          <ComponentExample
            code={`<Button variant="secondary" icon={PlusIcon}>
  Create Worker
</Button>`}
          >
            <Button variant="secondary" icon={PlusIcon}>
              Create Worker
            </Button>
          </ComponentExample>
        </div>

        {/* Icon Only */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Icon Only</h3>
          <ComponentExample
            code={`<Button variant="secondary" shape="square" icon={PlusIcon} />
<Button variant="secondary" shape="circle" icon={PlusIcon} />`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" shape="square" icon={PlusIcon} />
              <Button variant="secondary" shape="circle" icon={PlusIcon} />
            </div>
          </ComponentExample>
        </div>

        {/* Loading State */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Loading State</h3>
          <ComponentExample
            code={`<Button variant="primary" loading>
  Loading...
</Button>`}
          >
            <Button variant="primary" loading>
              Loading...
            </Button>
          </ComponentExample>
        </div>

        {/* Disabled State */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Disabled State</h3>
          <ComponentExample
            code={`<Button variant="secondary" disabled>
  Disabled
</Button>`}
          >
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </ComponentExample>
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
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "primary" | "secondary" | "ghost" | "destructive" |
                  "secondary-destructive" | "outline"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"secondary"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "xs" | "sm" | "base" | "lg"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"base"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">shape</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "base" | "square" | "circle"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"base"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">icon</td>
                <td className="px-4 py-3 font-mono text-xs">
                  Icon | React.ReactNode
                </td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">loading</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
