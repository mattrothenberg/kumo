import { PlusIcon, TranslateIcon } from "@phosphor-icons/react";
import { Tooltip, TooltipProvider, Button, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function TooltipDoc() {
  return (
    <DocLayout
      title="Tooltip"
      description="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
      baseUIComponent="tooltip"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<TooltipProvider>
  <Tooltip content="Add new item" asChild>
    <Button shape="square" icon={PlusIcon} />
  </Tooltip>
</TooltipProvider>`}
        >
          <TooltipProvider>
            <Tooltip content="Add new item" asChild>
              <Button shape="square" icon={PlusIcon} />
            </Tooltip>
          </TooltipProvider>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Tooltip, TooltipProvider } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Tooltip, TooltipProvider } from "@cloudflare/kumo/components/tooltip";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Tooltip, TooltipProvider, Button } from "@cloudflare/kumo";

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip content="Tooltip text" asChild>
        <Button>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Basic Tooltip</h3>
            <ComponentExample
              code={`<TooltipProvider>
  <Tooltip content="Add" asChild>
    <Button shape="square" icon={PlusIcon} />
  </Tooltip>
</TooltipProvider>`}
            >
              <TooltipProvider>
                <Tooltip content="Add" asChild>
                  <Button shape="square" icon={PlusIcon} />
                </Tooltip>
              </TooltipProvider>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Multiple Tooltips</h3>
            <ComponentExample
              code={`<TooltipProvider>
  <div className="flex gap-2">
    <Tooltip content="Add" asChild>
      <Button shape="square" icon={PlusIcon} />
    </Tooltip>
    <Tooltip content="Change language" asChild>
      <Button shape="square" icon={TranslateIcon} />
    </Tooltip>
  </div>
</TooltipProvider>`}
            >
              <TooltipProvider>
                <div className="flex gap-2">
                  <Tooltip content="Add" asChild>
                    <Button shape="square" icon={PlusIcon} />
                  </Tooltip>
                  <Tooltip content="Change language" asChild>
                    <Button shape="square" icon={TranslateIcon} />
                  </Tooltip>
                </div>
              </TooltipProvider>
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
                <td className="px-4 py-3 font-mono text-xs">content</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">asChild</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">open</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
