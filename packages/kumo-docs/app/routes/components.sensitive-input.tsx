import { SensitiveInput } from "@cloudflare/kumo";
// Field is now an internal component - SensitiveInput will have built-in field support
// import { Field } from "@cloudflare/kumo/components/field";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function SensitiveInputDoc() {
  return (
    <DocLayout
      title="Sensitive Input"
      description="A masked input for sensitive values like API keys and passwords. Click to reveal."
      sourceFile="components/sensitive-input"
      storybookPath="story/components-sensitiveinput"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<SensitiveInput defaultValue="sk_live_abc123xyz789" />`}
        >
          <SensitiveInput defaultValue="sk_live_abc123xyz789" />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { SensitiveInput } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { SensitiveInput } from "@cloudflare/kumo/components/sensitive-input";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { SensitiveInput } from "@cloudflare/kumo";

export default function Example() {
  return (
    <SensitiveInput label="Secret" defaultValue="my-secret-key" />
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Existing Value (Masked)
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              When initialized with a value, shows masked dots. Hover to see
              hint, click to reveal.
            </p>
            <ComponentExample
              code={`<SensitiveInput label="API Key" defaultValue="sk_live_abc123xyz789" />`}
            >
              <SensitiveInput
                label="API Key"
                defaultValue="sk_live_abc123xyz789"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Empty (New Input)</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Empty inputs show placeholder. Type to enter - value is masked.
              Eye icon appears when there's content.
            </p>
            <ComponentExample
              code={`<SensitiveInput label="Secret" placeholder="Enter your secret..." />`}
            >
              <SensitiveInput
                label="Secret"
                placeholder="Enter your secret..."
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Read Only</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              View-only mode - click to reveal but cannot edit.
            </p>
            <ComponentExample
              code={`<SensitiveInput label="Read Only" defaultValue="view-only-secret" readOnly />`}
            >
              <SensitiveInput
                label="Read Only"
                defaultValue="view-only-secret"
                readOnly
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Error State</h3>
            <ComponentExample
              code={`<SensitiveInput label="Invalid" defaultValue="invalid-key" variant="error" />`}
            >
              <SensitiveInput
                label="Invalid"
                defaultValue="invalid-key"
                variant="error"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Disabled</h3>
            <ComponentExample
              code={`<SensitiveInput label="Disabled" defaultValue="cannot-edit" disabled />`}
            >
              <SensitiveInput
                label="Disabled"
                defaultValue="cannot-edit"
                disabled
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Default</h3>
            <ComponentExample
              code={`<SensitiveInput defaultValue="sk_live_abc123xyz789" />`}
            >
              <SensitiveInput defaultValue="sk_live_abc123xyz789" />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Empty State</h3>
            <ComponentExample
              code={`<SensitiveInput placeholder="Enter API key..." />`}
            >
              <SensitiveInput placeholder="Enter API key..." />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Read Only</h3>
            <ComponentExample
              code={`<SensitiveInput defaultValue="sk_live_abc123xyz789" readOnly />`}
            >
              <SensitiveInput defaultValue="sk_live_abc123xyz789" readOnly />
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
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Prop</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Default</th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">required</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">labelTooltip</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">defaultValue</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">""</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  (value: string) =&gt; void
                </td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "xs" | "sm" | "base" | "lg"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"base"</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "default" | "error"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"default"</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-mono text-xs">readOnly</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
              </tr>
              <tr className="border-b border-border">
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
