import {
  ListIcon,
  CodeIcon,
  GlobeIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import { CodeBlock, Button, Pagination } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { ResourceListPage, Empty } from "@cloudflare/kumo";

export default function ResourceListDoc() {
  return (
    <DocLayout
      title="Resource List"
      description="A layout component for displaying resource lists with a title, description, and optional sidebar content."
      sourceFile="layouts/resource-list"
      storybookPath="story/layouts-resourcelistpage"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<ResourceListPage
  title="Components"
  description="Reusable UI components for building modern applications."
  icon={<ListIcon size={32} />}
>
  <div className="space-y-4">
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
      Component 1
    </div>
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
      Component 2
    </div>
  </div>
</ResourceListPage>`}
        >
          <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
            <ResourceListPage
              title="Resource List Page"
              description="This is a resource list page."
              icon={<SquaresFourIcon size={28} />}
              usage={<>Usage Section</>}
              additionalContent={<>Additional Content Section</>}
            >
              <Empty
                icon={<SquaresFourIcon size={48} />}
                title="Create a Queue"
                description="Build event-driven systems by creating a Queue above, or use Wrangler CLI to create a Queue."
                commandLine="npx wrangler queues create BINDING_NAME"
                contents={
                  <div className="flex items-center gap-2">
                    <Button icon={<CodeIcon />}>See examples</Button>
                    <Button icon={<GlobeIcon />} variant="primary">
                      View documentation
                    </Button>
                  </div>
                }
              />

              <div className="mt-4">
                <Pagination
                  page={1}
                  perPage={10}
                  totalCount={100}
                  setPage={function (page: number): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </ResourceListPage>
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Copy and paste the following code into your project.
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { ResourceListPage } from "@cloudflare/kumo";
// or
import { ResourceListPage } from "@cloudflare/kumo/layouts/resource-list";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { ResourceListPage } from "@cloudflare/kumo";
import { ListIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <ResourceListPage
      title="My Resources"
      description="A list of all your resources."
      icon={<ListIcon size={32} />}
    >
      {/* Your content here */}
    </ResourceListPage>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        {/* Basic */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Basic</h3>
          <ComponentExample
            code={`<ResourceListPage
  title="Projects"
  description="All your projects in one place."
>
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
    Project content
  </div>
</ResourceListPage>`}
          >
            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <ResourceListPage
                title="Projects"
                description="All your projects in one place."
              >
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  Project content
                </div>
              </ResourceListPage>
            </div>
          </ComponentExample>
        </div>

        {/* With Icon */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Icon</h3>
          <ComponentExample
            code={`<ResourceListPage
  title="Code Snippets"
  description="Your saved code snippets."
  icon={<CodeIcon size={32} />}
>
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
    Snippet content
  </div>
</ResourceListPage>`}
          >
            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <ResourceListPage
                title="Code Snippets"
                description="Your saved code snippets."
                icon={<CodeIcon size={32} />}
              >
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  Snippet content
                </div>
              </ResourceListPage>
            </div>
          </ComponentExample>
        </div>

        {/* With Usage Sidebar */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Usage Sidebar</h3>
          <ComponentExample
            code={`<ResourceListPage
  title="API Keys"
  description="Manage your API keys and access tokens."
  icon={<ListIcon size={32} />}
  usage={
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
      <h3 className="font-semibold mb-2">Usage</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Use API keys to authenticate your requests.
      </p>
    </div>
  }
>
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
    API key content
  </div>
</ResourceListPage>`}
          >
            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <ResourceListPage
                title="API Keys"
                description="Manage your API keys and access tokens."
                icon={<ListIcon size={32} />}
                usage={
                  <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-2 font-semibold">Usage</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Use API keys to authenticate your requests.
                    </p>
                  </div>
                }
              >
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  API key content
                </div>
              </ResourceListPage>
            </div>
          </ComponentExample>
        </div>

        {/* With Additional Content */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">
            With Additional Content
          </h3>
          <ComponentExample
            code={`<ResourceListPage
  title="Deployments"
  description="View and manage your deployments."
  icon={<ListIcon size={32} />}
  additionalContent={
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
      <h3 className="font-semibold mb-2">Quick Actions</h3>
      <Button variant="primary" className="w-full">
        New Deployment
      </Button>
    </div>
  }
>
  <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg border">
    Deployment content
  </div>
</ResourceListPage>`}
          >
            <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <ResourceListPage
                title="Deployments"
                description="View and manage your deployments."
                icon={<ListIcon size={32} />}
                additionalContent={
                  <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-2 font-semibold">Quick Actions</h3>
                    <Button variant="primary" className="w-full">
                      New Deployment
                    </Button>
                  </div>
                }
              >
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  Deployment content
                </div>
              </ResourceListPage>
            </div>
          </ComponentExample>
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
                <td className="px-4 py-3 font-mono text-xs">title</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">description</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">icon</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">usage</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">
                  additionalContent
                </td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
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
      </ComponentSection>
    </DocLayout>
  );
}
