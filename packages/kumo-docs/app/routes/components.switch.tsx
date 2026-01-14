import { Switch } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function SwitchDoc() {
  return (
    <DocLayout
      title="Switch"
      description="A two-state button that can be either on or off."
      sourceFile="components/switch"
      storybookPath="story/components-switch"
      baseUIComponent="switch"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Switch label="Switch" checked={false} onCheckedChange={() => {}} />`}
        >
          <Switch label="Switch" checked={false} onCheckedChange={() => {}} />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Switch } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Switch } from "@cloudflare/kumo/components/switch";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Switch } from "@cloudflare/kumo";
import { useState } from "react";

export default function Example() {
  const [checked, setChecked] = useState(false);
  
  return (
    <Switch 
      checked={checked} 
      onCheckedChange={(val) => setChecked(val)} 
    />
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Off State</h3>
            <ComponentExample
              code={`<Switch label="Switch" checked={false} onCheckedChange={() => {}} />`}
            >
              <Switch
                label="Switch"
                checked={false}
                onCheckedChange={() => {}}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">On State</h3>
            <ComponentExample
              code={`<Switch label="Switch" checked={true} onCheckedChange={() => {}} />`}
            >
              <Switch
                label="Switch"
                checked={true}
                onCheckedChange={() => {}}
              />
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
                <th className="px-4 py-3 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Label content</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">required</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  When true: shows asterisk (*). When false: shows "(optional)".
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">labelTooltip</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Tooltip content shown via info icon next to label
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">checked</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">Checked state</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">onCheckedChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {"(checked: boolean) => void"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Callback when toggled</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">controlFirst</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">true</td>
                <td className="px-4 py-3 text-xs">
                  When true, switch before label; false for label first
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">Disabled state</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "default" | "error"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"default"</td>
                <td className="px-4 py-3 text-xs">Visual variant</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
