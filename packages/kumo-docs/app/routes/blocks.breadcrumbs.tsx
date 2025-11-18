import { HouseIcon } from "@phosphor-icons/react";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Breadcrumb, CodeBlock } from "@cloudflare/kumo";

export default function BreadcrumbsDoc() {
  return (
    <DocLayout
      title="Breadcrumbs"
      description="A navigation component that shows the current page's location within a navigational hierarchy."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Breadcrumb>
  <Breadcrumb.Link icon={<HouseIcon size={16} />} href="/">
    Home
  </Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Link href="/docs">Projects</Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Current>Current Project</Breadcrumb.Current>
</Breadcrumb>`}
        >
          <Breadcrumb>
            <Breadcrumb.Link icon={<HouseIcon size={16} />} href="#">
              Home
            </Breadcrumb.Link>
            <Breadcrumb.Separator />
            <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
            <Breadcrumb.Separator />
            <Breadcrumb.Current>Current Project</Breadcrumb.Current>
          </Breadcrumb>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Copy and paste the following code into your project.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Breadcrumb } from "@cloudflare/kumo";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Breadcrumb } from "@cloudflare/kumo";

export default function Example() {
  return (
    <Breadcrumb>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      <Breadcrumb.Separator />
      <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
      <Breadcrumb.Separator />
      <Breadcrumb.Current>Breadcrumbs</Breadcrumb.Current>
    </Breadcrumb>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-6">Examples</h2>

        {/* Basic */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Basic</h3>
          <ComponentExample
            code={`<Breadcrumb>
  <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Current>Breadcrumbs</Breadcrumb.Current>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              <Breadcrumb.Separator />
              <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
              <Breadcrumb.Separator />
              <Breadcrumb.Current>Breadcrumbs</Breadcrumb.Current>
            </Breadcrumb>
          </ComponentExample>
        </div>
      </ComponentSection>

      <ComponentSection>
        {/* Loading */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Loading</h3>
          <ComponentExample
            code={`<Breadcrumb>
  <Breadcrumb.Link href="#" icon={<HouseIcon size={16} />}>
    Home
  </Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Current loading></Breadcrumb.Current>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Link href="#" icon={<HouseIcon size={16} />}>
                Home
              </Breadcrumb.Link>
              <Breadcrumb.Separator />
              <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
              <Breadcrumb.Separator />
              <Breadcrumb.Current loading></Breadcrumb.Current>
            </Breadcrumb>
          </ComponentExample>
        </div>
      </ComponentSection>

      <ComponentSection>
        {/* Root */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Root</h3>
          <ComponentExample
            code={`<Breadcrumb>
  <Breadcrumb.Current icon={<HouseIcon size={16} />}>
    Worker Analytics
  </Breadcrumb.Current>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Current icon={<HouseIcon size={16} />}>
                Worker Analytics
              </Breadcrumb.Current>
            </Breadcrumb>
          </ComponentExample>
        </div>
      </ComponentSection>

      <ComponentSection>
        {/* Clipboard */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Clipboard</h3>
          <ComponentExample
            code={`<Breadcrumb>
  <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
  <Breadcrumb.Separator />
  <Breadcrumb.Current>Breadcrumbs</Breadcrumb.Current>
  <Breadcrumb.Clipboard text="#" />
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              <Breadcrumb.Separator />
              <Breadcrumb.Current>Breadcrumbs</Breadcrumb.Current>
              <Breadcrumb.Clipboard text="#" />
            </Breadcrumb>
          </ComponentExample>
        </div>
      </ComponentSection>

      {/* API Reference */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">API Reference</h2>

        <div className="space-y-8">
          {/* Breadcrumb */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Breadcrumb</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 font-semibold">Prop</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">children</td>
                    <td className="py-3 px-4 font-mono text-xs">ReactNode</td>
                    <td className="py-3 px-4 font-mono text-xs">required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Breadcrumb.Link */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Breadcrumb.Link</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 font-semibold">Prop</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">children</td>
                    <td className="py-3 px-4 font-mono text-xs">ReactNode</td>
                    <td className="py-3 px-4 font-mono text-xs">required</td>
                  </tr>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">href</td>
                    <td className="py-3 px-4 font-mono text-xs">string</td>
                    <td className="py-3 px-4 font-mono text-xs">required</td>
                  </tr>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">icon</td>
                    <td className="py-3 px-4 font-mono text-xs">ReactNode</td>
                    <td className="py-3 px-4 font-mono text-xs">undefined</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Breadcrumb.Current */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Breadcrumb.Current</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 font-semibold">Prop</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">children</td>
                    <td className="py-3 px-4 font-mono text-xs">ReactNode</td>
                    <td className="py-3 px-4 font-mono text-xs">required</td>
                  </tr>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">icon</td>
                    <td className="py-3 px-4 font-mono text-xs">ReactNode</td>
                    <td className="py-3 px-4 font-mono text-xs">undefined</td>
                  </tr>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">loading</td>
                    <td className="py-3 px-4 font-mono text-xs">boolean</td>
                    <td className="py-3 px-4 font-mono text-xs">false</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Breadcrumb.Separator */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Breadcrumb.Separator</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 font-semibold">Prop</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">-</td>
                    <td className="py-3 px-4 font-mono text-xs">-</td>
                    <td className="py-3 px-4 font-mono text-xs">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Breadcrumb.Clipboard */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Breadcrumb.Clipboard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left py-3 px-4 font-semibold">Prop</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Default
                    </th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <td className="py-3 px-4 font-mono text-xs">text</td>
                    <td className="py-3 px-4 font-mono text-xs">string</td>
                    <td className="py-3 px-4 font-mono text-xs">required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
