import { ClipboardText, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function ClipboardTextDoc() {
  return (
    <DocLayout
      title="Clipboard Text"
      description="A text component with a copy-to-clipboard button."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample code={`<ClipboardText text="0c239dd2" />`}>
          <ClipboardText text="0c239dd2" />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { ClipboardText } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { ClipboardText } from "@cloudflare/kumo/components/clipboard-text";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { ClipboardText } from "@cloudflare/kumo";

export default function Example() {
  return <ClipboardText text="Copy this text" />;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Short Text</h3>
            <ComponentExample code={`<ClipboardText text="abc123" />`}>
              <ClipboardText text="abc123" />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">API Key</h3>
            <ComponentExample code={`<ClipboardText text="sk_live_51H8..." />`}>
              <ClipboardText text="sk_live_51H8..." />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Long Text</h3>
            <ComponentExample
              code={`<ClipboardText text="https://example.com/very/long/url/path" />`}
            >
              <ClipboardText text="https://example.com/very/long/url/path" />
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
                <td className="px-4 py-3 font-mono text-xs">text</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
