import { useState } from "react";
import { Checkbox } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function CheckboxDoc() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [agree, setAgree] = useState(true);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <DocLayout
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not checked."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Checkbox label="Accept terms and conditions" />`}
        >
          <Checkbox
            label="Accept terms and conditions"
            checked={acceptTerms}
            onValueChange={setAcceptTerms}
          />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <h3 className="text-lg font-semibold mb-2">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Checkbox } from "@cloudflare/kumo";`}
        />
        <h3 className="text-lg font-semibold mb-2 mt-4">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Checkbox } from "@cloudflare/kumo/components/checkbox";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Checkbox } from "@cloudflare/kumo";

export default function Example() {
  return <Checkbox label="Accept terms" />;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-6">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Default</h3>
            <ComponentExample
              code={`<Checkbox label="Enable notifications" />`}
            >
              <Checkbox
                label="Enable notifications"
                checked={enableNotifications}
                onValueChange={setEnableNotifications}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Checked</h3>
            <ComponentExample code={`<Checkbox label="I agree" checked />`}>
              <Checkbox
                label="I agree"
                checked={agree}
                onValueChange={setAgree}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Indeterminate</h3>
            <ComponentExample
              code={`<Checkbox label="Select all" indeterminate />`}
            >
              <Checkbox
                label="Select all"
                indeterminate={indeterminate}
                onValueChange={setIndeterminate}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Disabled</h3>
            <ComponentExample
              code={`<Checkbox label="Disabled option" disabled />`}
            >
              <Checkbox label="Disabled option" disabled />
            </ComponentExample>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Error</h3>
            <ComponentExample
              code={`<Checkbox label="Invalid option" variant="error" />`}
            >
              <Checkbox label="Invalid option" variant="error" />
            </ComponentExample>
          </div>
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
                <td className="py-3 px-4 font-mono text-xs">label</td>
                <td className="py-3 px-4 font-mono text-xs">string</td>
                <td className="py-3 px-4 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">checked</td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">indeterminate</td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">disabled</td>
                <td className="py-3 px-4 font-mono text-xs">boolean</td>
                <td className="py-3 px-4 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="py-3 px-4 font-mono text-xs">variant</td>
                <td className="py-3 px-4 font-mono text-xs">
                  "default" | "disabled"
                </td>
                <td className="py-3 px-4 font-mono text-xs">"default"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
