import { Input } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function InputDoc() {
  return (
    <DocLayout
      title="Input"
      description="A text input field for user input with built-in label, description, and error support."
      baseUIComponent="input"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Input 
  label="Email" 
  placeholder="you@example.com"
  description="We'll never share your email"
/>`}
        >
          <Input
            label="Email"
            placeholder="you@example.com"
            description="We'll never share your email"
          />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Input } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Input } from "@cloudflare/kumo/components/input";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <h3 className="mb-2 text-lg font-semibold">
          With Built-in Field (Recommended)
        </h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Use the <code>label</code> prop to enable the built-in Field wrapper
          with label, description, and error support.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Input } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Input 
      label="Email" 
      placeholder="you@example.com"
      description="We'll never share your email"
    />
  );
}`}
        />

        <h3 className="mt-6 mb-2 text-lg font-semibold">
          Bare Input (Custom Layouts)
        </h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          For custom form layouts, use Input without <code>label</code>. Must
          provide <code>aria-label</code> or <code>aria-labelledby</code> for
          accessibility.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Input } from "@cloudflare/kumo";

export default function Example() {
  return <Input placeholder="Search..." aria-label="Search products" />;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">
              With Label and Description
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              The <code>label</code> prop enables the built-in Field wrapper
              with automatic vertical layout (label above input).
            </p>
            <ComponentExample
              code={`<Input 
  label="Username" 
  placeholder="Choose a username"
  description="3-20 characters, alphanumeric only"
/>`}
            >
              <Input
                label="Username"
                placeholder="Choose a username"
                description="3-20 characters, alphanumeric only"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">With Error (String)</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Pass <code>error</code> as a string for simple error messages.
              Error replaces description when present.
            </p>
            <ComponentExample
              code={`<Input 
  label="Email" 
  placeholder="you@example.com"
  value="invalid-email"
  variant="error"
  error="Please enter a valid email address"
/>`}
            >
              <Input
                label="Email"
                placeholder="you@example.com"
                value="invalid-email"
                variant="error"
                error="Please enter a valid email address"
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              With Error (Validation Object)
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Pass <code>error</code> as an object with <code>message</code> and{" "}
              <code>match</code> for HTML5 validation. Error shows when field
              validity matches.
            </p>
            <ComponentExample
              code={`<Input 
  label="Password"
  type="password"
  value="short"
  variant="error"
  error={{
    message: "Password must be at least 8 characters",
    match: "tooShort"
  }}
  minLength={8}
/>`}
            >
              <Input
                label="Password"
                type="password"
                value="short"
                variant="error"
                error={{
                  message: "Password must be at least 8 characters",
                  match: "tooShort",
                }}
                minLength={8}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Input Sizes</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Four sizes available: <code>xs</code>, <code>sm</code>,{" "}
              <code>base</code> (default), <code>lg</code>.
            </p>
            <ComponentExample
              code={`<>
  <Input size="xs" label="Extra Small" placeholder="Extra small input" />
  <Input size="sm" label="Small" placeholder="Small input" />
  <Input label="Base" placeholder="Base input (default)" />
  <Input size="lg" label="Large" placeholder="Large input" />
</>`}
            >
              <div className="flex flex-col gap-4">
                <Input
                  size="xs"
                  label="Extra Small"
                  placeholder="Extra small input"
                />
                <Input size="sm" label="Small" placeholder="Small input" />
                <Input label="Base" placeholder="Base input (default)" />
                <Input size="lg" label="Large" placeholder="Large input" />
              </div>
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Disabled</h3>
            <ComponentExample
              code={`<Input 
  label="Disabled field" 
  placeholder="Cannot edit" 
  disabled 
/>`}
            >
              <Input
                label="Disabled field"
                placeholder="Cannot edit"
                disabled
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Bare Input (No Label)
            </h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Input without <code>label</code> renders as a bare input. Must
              provide <code>aria-label</code> for accessibility.
            </p>
            <ComponentExample
              code={`<Input placeholder="Search..." aria-label="Search products" />`}
            >
              <Input placeholder="Search..." aria-label="Search products" />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Input Types</h3>
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
              Supports all HTML input types: <code>text</code>,{" "}
              <code>email</code>, <code>password</code>, <code>number</code>,{" "}
              <code>tel</code>, <code>url</code>, etc.
            </p>
            <ComponentExample
              code={`<>
  <Input type="email" label="Email" placeholder="you@example.com" />
  <Input type="password" label="Password" placeholder="••••••••" />
  <Input type="number" label="Age" placeholder="18" />
  <Input type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
</>`}
            >
              <div className="flex flex-col gap-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                />
                <Input type="number" label="Age" placeholder="18" />
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">API Reference</h2>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Input accepts all standard HTML input attributes plus the following:
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
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Label text (enables built-in Field wrapper)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">description</td>
                <td className="px-4 py-3 font-mono text-xs">ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Helper text displayed below input (requires label)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">error</td>
                <td className="px-4 py-3 font-mono text-xs">
                  string | {"{"}message: ReactNode, match: FieldErrorMatch{"}"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">
                  Error message or validation object (requires label)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "xs" | "sm" | "base" | "lg"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"base"</td>
                <td className="px-4 py-3 text-xs">Input size variant</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "default" | "error"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"default"</td>
                <td className="px-4 py-3 text-xs">
                  Visual variant (use with error prop)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">type</td>
                <td className="px-4 py-3 font-mono text-xs">
                  "text" | "email" | "password" | ...
                </td>
                <td className="px-4 py-3 font-mono text-xs">"text"</td>
                <td className="px-4 py-3 text-xs">HTML input type</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">placeholder</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">-</td>
                <td className="px-4 py-3 text-xs">Placeholder text</td>
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

        <h3 className="mt-6 mb-2 text-lg font-semibold">
          Validation Error Types
        </h3>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          When using <code>error</code> as an object, the <code>match</code>{" "}
          property corresponds to HTML5 ValidityState values:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-3 text-left font-semibold">Match</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">valueMissing</td>
                <td className="px-4 py-3 text-xs">Required field is empty</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">typeMismatch</td>
                <td className="px-4 py-3 text-xs">
                  Value doesn't match type (e.g., invalid email)
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">patternMismatch</td>
                <td className="px-4 py-3 text-xs">
                  Value doesn't match pattern attribute
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">tooShort</td>
                <td className="px-4 py-3 text-xs">
                  Value shorter than minLength
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">tooLong</td>
                <td className="px-4 py-3 text-xs">
                  Value longer than maxLength
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">rangeUnderflow</td>
                <td className="px-4 py-3 text-xs">Value less than min</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">rangeOverflow</td>
                <td className="px-4 py-3 text-xs">Value greater than max</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">true</td>
                <td className="px-4 py-3 text-xs">
                  Always show error (for server-side validation)
                </td>
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
              Inputs require an accessible name via one of:
            </p>
            <ul className="mt-2 ml-4 list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
              <li>
                <code>label</code> prop (recommended)
              </li>
              <li>
                <code>placeholder</code> + <code>aria-label</code> for bare
                inputs
              </li>
              <li>
                <code>aria-labelledby</code> for custom label association
              </li>
            </ul>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Missing accessible names trigger console warnings in development.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Error Association</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Error messages are automatically associated with the input via
              ARIA attributes for screen reader announcement.
            </p>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
