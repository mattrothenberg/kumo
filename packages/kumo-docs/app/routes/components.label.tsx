import {
  Label,
  Input,
  Select,
  Checkbox,
  Switch,
  CodeBlock,
} from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function LabelDoc() {
  return (
    <DocLayout
      title="Label"
      description="A label component for form fields with support for required/optional indicators and tooltips."
      sourceFile="components/label"
      storybookPath="story/components-label"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<div className="flex flex-col gap-4">
  <Label>Default Label</Label>
  <Label required>Required Label</Label>
  <Label showOptional>Optional Label</Label>
  <Label tooltip="More information about this field">
    Label with Tooltip
  </Label>
</div>`}
        >
          <div className="flex flex-col gap-4">
            <Label>Default Label</Label>
            <Label required>Required Label</Label>
            <Label showOptional>Optional Label</Label>
            <Label tooltip="More information about this field">
              Label with Tooltip
            </Label>
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Label } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Label } from "@cloudflare/kumo/components/label";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <h3 className="mb-2 text-lg font-semibold">
          With Form Components (Recommended)
        </h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Label features are automatically available through form components
          like <code>Input</code>, <code>Select</code>, <code>Checkbox</code>,
          and <code>Switch</code> via the <code>required</code> and{" "}
          <code>labelTooltip</code> props.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Input } from "@cloudflare/kumo";

export default function Example() {
  return (
    <>
      {/* Required field with asterisk */}
      <Input label="Email" required placeholder="you@example.com" />
      
      {/* Optional field with "(optional)" text */}
      <Input label="Phone" required={false} placeholder="+1 555-0000" />
      
      {/* With tooltip */}
      <Input 
        label="API Key" 
        labelTooltip="Find this in your dashboard settings"
        required 
      />
    </>
  );
}`}
        />

        <h3 className="mt-6 mb-2 text-lg font-semibold">Standalone Label</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          For custom form layouts, use the <code>Label</code> component
          directly.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Label } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Label required tooltip="This field is mandatory">
      Username
    </Label>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Required Field</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Shows a red asterisk (*) to indicate the field is required.
            </p>
            <ComponentExample
              code={`<Input label="Email" required placeholder="you@example.com" />`}
            >
              <Input label="Email" required placeholder="you@example.com" />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Optional Field</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Shows gray "(optional)" text when{" "}
              <code>
                required={"{"}false{"}"}
              </code>
              .
            </p>
            <ComponentExample
              code={`<Input label="Phone Number" required={false} placeholder="+1 555-0000" />`}
            >
              <Input
                label="Phone Number"
                required={false}
                placeholder="+1 555-0000"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Tooltip</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Shows an info icon with a tooltip for additional context.
            </p>
            <ComponentExample
              code={`<Input 
  label="API Key" 
  labelTooltip="Find this in your dashboard settings under API > Keys"
  placeholder="sk_live_..." 
/>`}
            >
              <Input
                label="API Key"
                labelTooltip="Find this in your dashboard settings under API > Keys"
                placeholder="sk_live_..."
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Required with Tooltip
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Combine required indicator with tooltip for complete field
              context.
            </p>
            <ComponentExample
              code={`<Input 
  label="Password" 
  required
  labelTooltip="Must be at least 8 characters with one uppercase letter"
  type="password"
  placeholder="Enter password" 
/>`}
            >
              <Input
                label="Password"
                required
                labelTooltip="Must be at least 8 characters with one uppercase letter"
                type="password"
                placeholder="Enter password"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              ReactNode Label Content
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Labels support ReactNode content for rich formatting.
            </p>
            <ComponentExample
              code={`<Checkbox 
  label={
    <span>
      I agree to the <strong>Terms of Service</strong>
    </span>
  } 
  required
/>`}
            >
              <Checkbox
                label={
                  <span>
                    I agree to the <strong>Terms of Service</strong>
                  </span>
                }
                required
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Form with Mixed Fields
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Real-world example showing required and optional fields together.
            </p>
            <ComponentExample
              code={`<div className="flex flex-col gap-4 max-w-md">
  <Input label="Full Name" required placeholder="John Doe" />
  <Input 
    label="Email" 
    required 
    labelTooltip="We'll send your receipt here"
    placeholder="john@example.com" 
    type="email"
  />
  <Input label="Company" required={false} placeholder="Acme Inc." />
  <Select 
    label="Country" 
    required 
    hideLabel={false}
    placeholder="Select a country"
  >
    <Select.Option value="us">United States</Select.Option>
    <Select.Option value="uk">United Kingdom</Select.Option>
    <Select.Option value="ca">Canada</Select.Option>
  </Select>
</div>`}
            >
              <div className="flex max-w-md flex-col gap-4">
                <Input label="Full Name" required placeholder="John Doe" />
                <Input
                  label="Email"
                  required
                  labelTooltip="We'll send your receipt here"
                  placeholder="john@example.com"
                  type="email"
                />
                <Input
                  label="Company"
                  required={false}
                  placeholder="Acme Inc."
                />
                <Select
                  label="Country"
                  required
                  hideLabel={false}
                  placeholder="Select a country"
                >
                  <Select.Option value="us">United States</Select.Option>
                  <Select.Option value="uk">United Kingdom</Select.Option>
                  <Select.Option value="ca">Canada</Select.Option>
                </Select>
              </div>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Standalone Label</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Use Label directly for custom layouts or non-form contexts.
            </p>
            <ComponentExample
              code={`<div className="flex flex-col gap-3">
  <Label>Default</Label>
  <Label required>Required</Label>
  <Label showOptional>Optional</Label>
  <Label required tooltip="Important field">Required with Tooltip</Label>
</div>`}
            >
              <div className="flex flex-col gap-3">
                <Label>Default</Label>
                <Label required>Required</Label>
                <Label showOptional>Optional</Label>
                <Label required tooltip="Important field">
                  Required with Tooltip
                </Label>
              </div>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">API Reference</h2>

        <h3 className="mb-2 text-lg font-semibold">Label Props</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Props for the standalone Label component:
        </p>
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
                <td className="px-4 py-3 font-mono text-xs">children</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Label content (required)</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">required</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">
                  Shows red asterisk (*) when true
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">showOptional</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">
                  Shows gray "(optional)" text (only when required is false)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">tooltip</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Tooltip content shown via info icon
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-2 text-lg font-semibold">
          Form Component Label Props
        </h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          These props are available on Input, InputArea, Select, Checkbox,
          Switch, SensitiveInput, and Combobox:
        </p>
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
                <td className="px-4 py-3 text-xs">
                  Label content (enables Field wrapper)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">required</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  When true: shows asterisk. When false: shows "(optional)".
                  Also sets HTML required attribute.
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
            </tbody>
          </table>
        </div>
      </ComponentSection>

      {/* Design Guidelines */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Design Guidelines</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-2 font-semibold">
              When to Use Required Indicators
            </h3>
            <ul className="ml-4 list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>
                Use asterisks (*) for required fields in forms with many fields
              </li>
              <li>
                Use "(optional)" for optional fields when most fields are
                required
              </li>
              <li>Be consistent within a form - don't mix approaches</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">When to Use Tooltips</h3>
            <ul className="ml-4 list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>Provide additional context that doesn't fit in the label</li>
              <li>Explain format requirements or validation rules</li>
              <li>Link to help documentation for complex fields</li>
              <li>Keep tooltip content concise - 1-2 sentences max</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Accessibility</h3>
            <ul className="ml-4 list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>
                Required indicators are purely visual - use the{" "}
                <code>required</code> attribute for validation
              </li>
              <li>
                Tooltips are accessible via keyboard focus on the info icon
              </li>
              <li>Screen readers will announce tooltip content when focused</li>
            </ul>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
