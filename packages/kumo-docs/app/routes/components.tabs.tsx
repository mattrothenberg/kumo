import { useState } from "react";
import { Tabs, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function TabsDoc() {
  return (
    <DocLayout
      title="Tabs"
      description="A set of layered sections of content, known as tab panels, displayed one at a time."
      sourceFile="components/tabs"
      storybookPath="story/components-tabs"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`{/* Segmented (default) */}
<Tabs
  variant="segmented"
  tabs={[
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ]}
  selectedValue="tab1"
/>

{/* Underline */}
<Tabs
  variant="underline"
  tabs={[
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ]}
  selectedValue="tab1"
/>`}
        >
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm text-muted">Segmented (default)</p>
              <Tabs
                variant="segmented"
                tabs={[
                  { value: "tab1", label: "Tab 1" },
                  { value: "tab2", label: "Tab 2" },
                  { value: "tab3", label: "Tab 3" },
                ]}
                selectedValue="tab1"
              />
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">Underline</p>
              <Tabs
                variant="underline"
                tabs={[
                  { value: "tab1", label: "Tab 1" },
                  { value: "tab2", label: "Tab 2" },
                  { value: "tab3", label: "Tab 3" },
                ]}
                selectedValue="tab1"
              />
            </div>
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <CodeBlock lang="bash" code={`npm install @cloudflare/kumo`} />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Tabs } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Tabs
      tabs={[
        { value: "overview", label: "Overview" },
        { value: "settings", label: "Settings" },
      ]}
      selectedValue="overview"
    />
  );
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
              <h4 className="mb-3 text-base font-medium">
                Segmented (Default)
              </h4>
              <p className="mb-4 text-secondary">
                A pill-shaped indicator slides between tabs on a subtle
                background.
              </p>
              <ComponentExample
                code={`<Tabs
  variant="segmented"
  tabs={[
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ]}
  selectedValue="tab1"
/>`}
              >
                <Tabs
                  variant="segmented"
                  tabs={[
                    { value: "tab1", label: "Tab 1" },
                    { value: "tab2", label: "Tab 2" },
                    { value: "tab3", label: "Tab 3" },
                  ]}
                  selectedValue="tab1"
                />
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Underline</h4>
              <p className="mb-4 text-secondary">
                A bottom border with a primary-colored indicator. The active tab
                has bolder text for emphasis.
              </p>
              <ComponentExample
                code={`<Tabs
  variant="underline"
  tabs={[
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ]}
  selectedValue="tab1"
/>`}
              >
                <Tabs
                  variant="underline"
                  tabs={[
                    { value: "tab1", label: "Tab 1" },
                    { value: "tab2", label: "Tab 2" },
                    { value: "tab3", label: "Tab 3" },
                  ]}
                  selectedValue="tab1"
                />
              </ComponentExample>
            </div>
          </div>
        </div>

        {/* Controlled */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Controlled</h3>
          <p className="mb-4 text-secondary">
            Use the <code className="text-sm">value</code> and{" "}
            <code className="text-sm">onValueChange</code> props for controlled
            state.
          </p>
          <ControlledTabsExample />
        </div>

        {/* Many Tabs */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Many Tabs</h3>
          <p className="mb-4 text-secondary">
            Tabs automatically scroll horizontally when there are many items.
          </p>
          <ComponentExample
            code={`<Tabs
  tabs={[
    { value: "overview", label: "Overview" },
    { value: "analytics", label: "Analytics" },
    { value: "reports", label: "Reports" },
    { value: "notifications", label: "Notifications" },
    { value: "settings", label: "Settings" },
    { value: "billing", label: "Billing" },
  ]}
  selectedValue="overview"
/>`}
          >
            <Tabs
              tabs={[
                { value: "overview", label: "Overview" },
                { value: "analytics", label: "Analytics" },
                { value: "reports", label: "Reports" },
                { value: "notifications", label: "Notifications" },
                { value: "settings", label: "Settings" },
                { value: "billing", label: "Billing" },
              ]}
              selectedValue="overview"
            />
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
                  "segmented" | "underline"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"segmented"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">tabs</td>
                <td className="px-4 py-3 font-mono text-xs">TabsItem[]</td>
                <td className="px-4 py-3 font-mono text-xs">[]</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">selectedValue</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">first tab value</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  (value: string) =&gt; void
                </td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">listClassName</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">
                  indicatorClassName
                </td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TabsItem</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-3 text-left font-semibold">Property</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Required</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">Yes</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">Yes</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}

function ControlledTabsExample() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <ComponentExample
      code={`const [activeTab, setActiveTab] = useState("tab1");

<Tabs
  tabs={[
    { value: "tab1", label: "Tab 1" },
    { value: "tab2", label: "Tab 2" },
    { value: "tab3", label: "Tab 3" },
  ]}
  value={activeTab}
  onValueChange={setActiveTab}
/>`}
    >
      <div className="space-y-4">
        <Tabs
          tabs={[
            { value: "tab1", label: "Tab 1" },
            { value: "tab2", label: "Tab 2" },
            { value: "tab3", label: "Tab 3" },
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
        />
        <p className="text-sm text-secondary">
          Active tab: <code className="text-sm">{activeTab}</code>
        </p>
      </div>
    </ComponentExample>
  );
}
