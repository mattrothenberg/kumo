import { Link, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function LinkDoc() {
  return (
    <DocLayout
      title="Link"
      description="A styled anchor element for inline text links that flow naturally with content."
      sourceFile="components/link"
      storybookPath="story/components-link"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Link href="#">Default link</Link>
<Link href="#" variant="current">Current color link</Link>
<Link href="#" variant="plain">Plain link</Link>
<Link href="https://cloudflare.com" target="_blank" rel="noopener noreferrer">
  External link <Link.ExternalIcon />
</Link>`}
        >
          <p className="mx-auto max-w-md text-[14px] leading-relaxed tracking-[-0.01em]">
            This line contains the <code className="text-sm">&lt;Link&gt;</code>{" "}
            component's <Link href="#">default</Link> inline style.
            <br />
            This line shows a link that{" "}
            <Link href="#" variant="current">
              inherits
            </Link>{" "}
            the color of its parent.
            <br />
            This line demonstrates how a{" "}
            <Link href="#" variant="plain">
              plain
            </Link>{" "}
            link looks with no underline.
            <br />
            Lastly, this line's{" "}
            <Link
              href="https://cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              external link <Link.ExternalIcon />
            </Link>{" "}
            points to another site.
          </p>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Link } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { Link } from "@cloudflare/kumo/components/link";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Link } from "@cloudflare/kumo";

export default function Example() {
  return <Link href="/docs">Learn more</Link>;
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        {/* Variants */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Variants</h3>

          <div className="space-y-8 text-[14px]">
            <div>
              <h4 className="mb-3 text-base font-medium">Inline (default)</h4>
              <ComponentExample code={`<Link href="#">Learn more</Link>`}>
                <Link href="#">Learn more</Link>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Current</h4>
              <ComponentExample
                code={`<p className="text-error">
  This error contains a <Link href="#" variant="current">link</Link> that
  inherits the red color.
</p>`}
              >
                <p className="text-error">
                  This error contains a{" "}
                  <Link href="#" variant="current">
                    link
                  </Link>{" "}
                  that inherits the red color.
                </p>
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Plain</h4>
              <ComponentExample
                code={`<Link href="#" variant="plain">Plain link</Link>`}
              >
                <Link href="#" variant="plain">
                  Plain link
                </Link>
              </ComponentExample>
            </div>
          </div>
        </div>

        {/* External Link */}
        <div className="mb-12 text-[14px]">
          <h3 className="mb-4 text-xl font-semibold">External Link</h3>
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            For external links, add{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm dark:bg-neutral-800">
              target="_blank"
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm dark:bg-neutral-800">
              rel="noopener noreferrer"
            </code>
            , then include{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm dark:bg-neutral-800">
              &lt;Link.ExternalIcon /&gt;
            </code>{" "}
            as a visual indicator.
          </p>
          <ComponentExample
            code={`<Link
  href="https://cloudflare.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Visit Cloudflare <Link.ExternalIcon />
</Link>`}
          >
            <Link
              href="https://cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Cloudflare <Link.ExternalIcon />
            </Link>
          </ComponentExample>
        </div>

        {/* Composition with render prop */}
        <div className="mb-12 text-[14px]">
          <h3 className="mb-4 text-xl font-semibold">
            Composition with render prop
          </h3>
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            Use the{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm dark:bg-neutral-800">
              render
            </code>{" "}
            prop to compose Link styles onto framework-specific link components
            (e.g., React Router's Link). This follows the{" "}
            <a
              href="https://base-ui.com/react/utils/use-render"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Base UI composition pattern
            </a>
            , ensuring proper ref forwarding, event handler merging, and
            className composition.
          </p>
          <CodeBlock
            lang="tsx"
            code={`import { Link as RouterLink } from "react-router-dom";
import { Link } from "@cloudflare/kumo";

// Compose Kumo Link styles onto React Router's Link
<Link render={<RouterLink to="/dashboard" />} variant="inline">
  Dashboard
</Link>

// External link with render prop
<Link
  render={
    <RouterLink
      to="https://developers.cloudflare.com"
      target="_blank"
      rel="noopener noreferrer"
    />
  }
  variant="inline"
>
  Cloudflare Docs <Link.ExternalIcon />
</Link>`}
          />
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
                  "inline" | "current" | "plain"
                </td>
                <td className="px-4 py-3 font-mono text-xs">"inline"</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">render</td>
                <td className="px-4 py-3 font-mono text-xs">
                  ReactElement | function
                </td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">href</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">children</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">required</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Subcomponents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-4 py-3 text-left font-semibold">Component</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-600 dark:text-neutral-400">
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">
                  Link.ExternalIcon
                </td>
                <td className="px-4 py-3 text-xs">
                  Visual indicator icon for external links. Renders an SVG that
                  scales with text.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
