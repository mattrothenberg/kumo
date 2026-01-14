import { useState } from "react";
import { Radio } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function RadioDoc() {
  const [notification, setNotification] = useState("email");
  const [size, setSize] = useState("md");
  const [shipping, setShipping] = useState("standard");

  return (
    <DocLayout
      title="Radio"
      description="A control that allows the user to select one option from a set. Always used within a Radio.Group."
      sourceFile="components/radio"
      storybookPath="story/components-radio"
      baseUIComponent="radio-group"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Radio.Group legend="Notification preference" defaultValue="email">
  <Radio.Item label="Email" value="email" />
  <Radio.Item label="SMS" value="sms" />
  <Radio.Item label="Push notification" value="push" />
</Radio.Group>`}
        >
          <Radio.Group
            legend="Notification preference"
            value={notification}
            onValueChange={setNotification}
          >
            <Radio.Item label="Email" value="email" />
            <Radio.Item label="SMS" value="sms" />
            <Radio.Item label="Push notification" value="push" />
          </Radio.Group>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Radio } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Radio } from "@cloudflare/kumo/components/radio";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Radio } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Radio.Group legend="Choose an option" defaultValue="a">
      <Radio.Item label="Option A" value="a" />
      <Radio.Item label="Option B" value="b" />
    </Radio.Group>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Default (Vertical)</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Radio groups display vertically by default. Each radio has a label
              displayed to its right.
            </p>
            <ComponentExample
              code={`<Radio.Group legend="Account type" defaultValue="personal">
  <Radio.Item label="Personal" value="personal" />
  <Radio.Item label="Business" value="business" />
  <Radio.Item label="Enterprise" value="enterprise" />
</Radio.Group>`}
            >
              <Radio.Group legend="Account type" defaultValue="personal">
                <Radio.Item label="Personal" value="personal" />
                <Radio.Item label="Business" value="business" />
                <Radio.Item label="Enterprise" value="enterprise" />
              </Radio.Group>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Horizontal</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Use <code>orientation="horizontal"</code> for inline layouts.
              Items wrap when there isn't enough space.
            </p>
            <ComponentExample
              code={`<Radio.Group legend="Size" orientation="horizontal" defaultValue="md">
  <Radio.Item label="Small" value="sm" />
  <Radio.Item label="Medium" value="md" />
  <Radio.Item label="Large" value="lg" />
</Radio.Group>`}
            >
              <Radio.Group
                legend="Size"
                orientation="horizontal"
                value={size}
                onValueChange={setSize}
              >
                <Radio.Item label="Small" value="sm" />
                <Radio.Item label="Medium" value="md" />
                <Radio.Item label="Large" value="lg" />
              </Radio.Group>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Description</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Add helper text below the radio items using the{" "}
              <code>description</code> prop.
            </p>
            <ComponentExample
              code={`<Radio.Group
  legend="Shipping method"
  description="Choose how you'd like to receive your order"
  defaultValue="standard"
>
  <Radio.Item label="Standard (5-7 days)" value="standard" />
  <Radio.Item label="Express (2-3 days)" value="express" />
  <Radio.Item label="Overnight" value="overnight" />
</Radio.Group>`}
            >
              <Radio.Group
                legend="Shipping method"
                description="Choose how you'd like to receive your order"
                value={shipping}
                onValueChange={setShipping}
              >
                <Radio.Item label="Standard (5-7 days)" value="standard" />
                <Radio.Item label="Express (2-3 days)" value="express" />
                <Radio.Item label="Overnight" value="overnight" />
              </Radio.Group>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Error</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Show validation errors at the group level using the{" "}
              <code>error</code> prop.
            </p>
            <ComponentExample
              code={`<Radio.Group
  legend="Payment method"
  error="Please select a payment method to continue"
>
  <Radio.Item label="Credit Card" value="card" variant="error" />
  <Radio.Item label="PayPal" value="paypal" variant="error" />
  <Radio.Item label="Bank Transfer" value="bank" variant="error" />
</Radio.Group>`}
            >
              <Radio.Group
                legend="Payment method"
                error="Please select a payment method to continue"
              >
                <Radio.Item label="Credit Card" value="card" variant="error" />
                <Radio.Item label="PayPal" value="paypal" variant="error" />
                <Radio.Item
                  label="Bank Transfer"
                  value="bank"
                  variant="error"
                />
              </Radio.Group>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Disabled</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Disable the entire group or individual items.
            </p>
            <ComponentExample
              code={`<Radio.Group legend="Disabled group" disabled defaultValue="a">
  <Radio.Item label="Option A" value="a" />
  <Radio.Item label="Option B" value="b" />
</Radio.Group>

<Radio.Group legend="Individual disabled" defaultValue="available">
  <Radio.Item label="Available" value="available" />
  <Radio.Item label="Unavailable" value="unavailable" disabled />
</Radio.Group>`}
            >
              <div className="flex flex-col gap-6">
                <Radio.Group legend="Disabled group" disabled defaultValue="a">
                  <Radio.Item label="Option A" value="a" />
                  <Radio.Item label="Option B" value="b" />
                </Radio.Group>
                <Radio.Group
                  legend="Individual disabled"
                  defaultValue="available"
                >
                  <Radio.Item label="Available" value="available" />
                  <Radio.Item
                    label="Unavailable"
                    value="unavailable"
                    disabled
                  />
                </Radio.Group>
              </div>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Control Position</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Use <code>controlPosition="end"</code> to place labels before
              radio buttons.
            </p>
            <ComponentExample
              code={`<Radio.Group legend="Preferences" controlPosition="end" defaultValue="a">
  <Radio.Item label="Label before radio" value="a" />
  <Radio.Item label="Another option" value="b" />
</Radio.Group>`}
            >
              <Radio.Group
                legend="Preferences"
                controlPosition="end"
                defaultValue="a"
              >
                <Radio.Item label="Label before radio" value="a" />
                <Radio.Item label="Another option" value="b" />
              </Radio.Group>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">API Reference</h2>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Radio.Group</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Container for radio buttons with legend, description, and error
          support.
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
                <td className="px-4 py-3 font-mono text-xs">legend</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Group legend/title (required)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">orientation</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "vertical" | "horizontal"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"vertical"</td>
                <td className="px-4 py-3 text-xs">Layout direction</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Controlled selected value</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">defaultValue</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Uncontrolled initial value
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  (value: string) =&gt; void
                </td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Callback when selection changes
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">description</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Helper text below items</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">error</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Error message</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">controlPosition</td>
                <td className="px-4 py-3 font-mono text-xs">"start" | "end"</td>
                <td className="px-4 py-3 font-mono text-xs">"start"</td>
                <td className="px-4 py-3 text-xs">
                  Position of radio: "start" (before label) or "end" (after
                  label)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">Disables all items</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">name</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Form submission name</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Radio.Item</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Individual radio button within Radio.Group.
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
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Unique value for this item (required)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Label text (required)</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "default" | "error"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"default"</td>
                <td className="px-4 py-3 text-xs">Visual variant</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">Disabled state</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>

      {/* Accessibility */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Accessibility</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-2 font-semibold">Semantic HTML</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Radio.Group uses semantic <code>&lt;fieldset&gt;</code> and{" "}
              <code>&lt;legend&gt;</code> elements for proper grouping and
              screen reader announcement.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Keyboard Navigation</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              <kbd>Arrow Up/Down</kbd> or <kbd>Arrow Left/Right</kbd> moves
              between options. <kbd>Space</kbd> selects the focused option.{" "}
              <kbd>Tab</kbd> moves focus to and from the radio group.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Screen Readers</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Each radio is announced with its label and selection state. The
              group legend provides context for all options.
            </p>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
