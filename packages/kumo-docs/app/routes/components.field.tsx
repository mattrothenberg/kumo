import { Field, Input, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function FieldDoc() {
  return (
    <DocLayout
      title="Field"
      description="A wrapper component that provides labels, descriptions, and error messages for form inputs."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Field
  label="Email"
  description="The email to send notifications to."
>
  <Input placeholder="name@example.com" type="email" />
</Field>`}
        >
          <Field
            label="Email"
            description="The email to send notifications to."
          >
            <Input placeholder="name@example.com" type="email" />
          </Field>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Field } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Field } from "@cloudflare/kumo/components/field";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Field, Input } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Field label="Username">
      <Input placeholder="Enter username" />
    </Field>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">With Label</h3>
            <ComponentExample
              code={`<Field label="Username">
  <Input placeholder="Enter username" />
</Field>`}
            >
              <Field label="Username">
                <Input placeholder="Enter username" />
              </Field>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Description</h3>
            <ComponentExample
              code={`<Field
  label="API Key"
  description="Your secret API key for authentication."
>
  <Input type="password" placeholder="sk_..." />
</Field>`}
            >
              <Field
                label="API Key"
                description="Your secret API key for authentication."
              >
                <Input type="password" placeholder="sk_..." />
              </Field>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Error</h3>
            <ComponentExample
              code={`<Field
  label="Email"
  error={{
    message: "Please enter a valid email.",
    match: "typeMismatch",
  }}
>
  <Input 
    placeholder="name@example.com" 
    type="email" 
    variant="error"
  />
</Field>`}
            >
              <Field
                label="Email"
                error={{
                  message: "Please enter a valid email.",
                  match: "typeMismatch",
                }}
              >
                <Input
                  placeholder="name@example.com"
                  type="email"
                  variant="error"
                />
              </Field>
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
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">description</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">error</td>
                <td className="px-4 py-3 font-mono text-xs">{`{ message: string; match: string }`}</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
