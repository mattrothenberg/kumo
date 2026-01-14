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
  const [preferences, setPreferences] = useState<string[]>(["email"]);

  return (
    <DocLayout
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not checked. Features built-in label support with automatic horizontal layout."
      sourceFile="components/checkbox"
      storybookPath="story/components-checkbox"
      baseUIComponent="checkbox"
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
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Checkbox } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Checkbox } from "@cloudflare/kumo/components/checkbox";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
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
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Default</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Checkbox with built-in label. The label automatically displays in
              a horizontal layout (checkbox before label).
            </p>
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
            <h3 className="mb-4 text-xl font-semibold">Checked</h3>
            <ComponentExample code={`<Checkbox label="I agree" checked />`}>
              <Checkbox
                label="I agree"
                checked={agree}
                onValueChange={setAgree}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Indeterminate</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Used for "select all" patterns when some but not all items are
              selected.
            </p>
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
            <h3 className="mb-4 text-xl font-semibold">Label First Layout</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Use <code>controlFirst={"{false}"}</code> to place the label
              before the checkbox.
            </p>
            <ComponentExample
              code={`<Checkbox label="Remember me" controlFirst={false} />`}
            >
              <Checkbox label="Remember me" controlFirst={false} />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Disabled</h3>
            <ComponentExample
              code={`<Checkbox label="Disabled option" disabled />`}
            >
              <Checkbox label="Disabled option" disabled />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Error</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Error variant provides visual styling (red ring). For error
              messages, use Checkbox.Group.
            </p>
            <ComponentExample
              code={`<Checkbox label="Invalid option" variant="error" />`}
            >
              <Checkbox label="Invalid option" variant="error" />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Checkbox Group</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Group multiple checkboxes with a legend, description, and shared
              error messages. Uses Checkbox.Group and Checkbox.Item.
            </p>
            <ComponentExample
              code={`<Checkbox.Group
  legend="Email preferences"
  description="Choose how you'd like to receive updates"
  value={preferences}
  onValueChange={setPreferences}
>
  <Checkbox.Item value="email" label="Email notifications" />
  <Checkbox.Item value="sms" label="SMS notifications" />
  <Checkbox.Item value="push" label="Push notifications" />
</Checkbox.Group>`}
            >
              <Checkbox.Group
                legend="Email preferences"
                description="Choose how you'd like to receive updates"
                value={preferences}
                onValueChange={setPreferences}
              >
                <Checkbox.Item value="email" label="Email notifications" />
                <Checkbox.Item value="sms" label="SMS notifications" />
                <Checkbox.Item value="push" label="Push notifications" />
              </Checkbox.Group>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Checkbox Group with Error
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Show validation errors at the group level. Error replaces
              description when present.
            </p>
            <ComponentExample
              code={`<Checkbox.Group
  legend="Required preferences"
  error="Please select at least one notification method"
  value={[]}
  onValueChange={() => {}}
>
  <Checkbox.Item value="email" label="Email" variant="error" />
  <Checkbox.Item value="sms" label="SMS" variant="error" />
</Checkbox.Group>`}
            >
              <Checkbox.Group
                legend="Required preferences"
                error="Please select at least one notification method"
                value={[]}
                onValueChange={() => {}}
              >
                <Checkbox.Item value="email" label="Email" variant="error" />
                <Checkbox.Item value="sms" label="SMS" variant="error" />
              </Checkbox.Group>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">API Reference</h2>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Checkbox</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Single checkbox component with built-in label and horizontal layout.
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
                  Label content (required for accessibility)
                </td>
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
                <td className="px-4 py-3 font-mono text-xs">indeterminate</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">
                  Indeterminate state (for "select all")
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">controlFirst</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">true</td>
                <td className="px-4 py-3 text-xs">
                  When true, checkbox before label; false for label first
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
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  (checked: boolean) =&gt; void
                </td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Callback when toggled</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Checkbox.Group</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Wrapper for multiple checkboxes with legend, description, and error
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
                <td className="px-4 py-3 text-xs">Group legend/title</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">value</td>
                <td className="px-4 py-3 font-mono text-xs">string[]</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Controlled selected values
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">onValueChange</td>
                <td className="px-4 py-3 font-mono text-xs">
                  (value: string[]) =&gt; void
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
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Error message (replaces description)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">controlFirst</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">true</td>
                <td className="px-4 py-3 text-xs">
                  Layout direction for all items
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">disabled</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
                <td className="px-4 py-3 text-xs">Disables all items</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 mb-2 text-lg font-semibold">Checkbox.Item</h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Individual checkbox within Checkbox.Group.
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
                  Unique value for this item
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">label</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Label text</td>
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
            <h3 className="mb-2 font-semibold">Label Requirement</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Single checkboxes require a <code>label</code> prop or{" "}
              <code>aria-label</code> for accessibility. Missing labels trigger
              console warnings in development.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Keyboard Navigation</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              <kbd>Space</kbd> toggles the checkbox. <kbd>Tab</kbd> moves focus
              between checkboxes.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Screen Readers</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Checkbox.Group uses semantic <code>&lt;fieldset&gt;</code> and{" "}
              <code>&lt;legend&gt;</code> elements for proper grouping
              announcement.
            </p>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
