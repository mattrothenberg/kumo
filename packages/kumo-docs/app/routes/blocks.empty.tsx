import {
  CodeIcon,
  GlobeIcon,
  PackageIcon,
  RocketIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import { CodeBlock, Button } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Empty } from "@cloudflare/kumo";

export default function EmptyDoc() {
  return (
    <DocLayout
      title="Empty State"
      description="A component to display when there's no content or data to show, with optional command line and actions."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Empty 
    icon={<PackageIcon size={48} />}
    title="No packages found" 
    description="Get started by installing your first package." 
    commandLine="npm install @cloudflare/kumo" 
    contents={<div className="flex items-center gap-2">
        <Button icon={<CodeIcon />}>See examples</Button>
        <Button icon={<GlobeIcon />} variant="primary">View documentation</Button>
    </div>}
/>`}
        >
          <Empty
            icon={<PackageIcon size={48} />}
            title="No packages found"
            description="Get started by installing your first package."
            commandLine="npm install @cloudflare/kumo"
            contents={
              <div className="flex items-center gap-2">
                <Button icon={<CodeIcon />}>See examples</Button>
                <Button icon={<GlobeIcon />} variant="primary">
                  View documentation
                </Button>
              </div>
            }
          />
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
          code={`import { Empty } from "@cloudflare/kumo";
// or
import { Empty } from "@cloudflare/kumo/blocks/empty";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Empty } from "@cloudflare/kumo";
import { PackageIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Empty
      icon={<PackageIcon size={48} />}
      title="No packages found"
      description="Get started by installing your first package."
      commandLine="npm install @kumo/ui"
    />
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
            code={`<Empty
  title="No results found"
  description="Try adjusting your search or filter to find what you're looking for."
/>`}
          >
            <Empty
              title="No results found"
              description="Try adjusting your search or filter to find what you're looking for."
            />
          </ComponentExample>
        </div>

        {/* With Icon */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Icon</h3>
          <ComponentExample
            code={`<Empty
  icon={<RocketIcon size={48} />}
  title="Ready to launch"
  description="Deploy your application to production with a single command."
/>`}
          >
            <Empty
              icon={<RocketIcon size={48} className="text-neutral-400" />}
              title="Ready to launch"
              description="Deploy your application to production with a single command."
            />
          </ComponentExample>
        </div>

        {/* With Command Line */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Command Line</h3>
          <ComponentExample
            code={`<Empty
  icon={<PackageIcon size={48} />}
  title="No dependencies installed"
  description="Install dependencies to get started with your project."
  commandLine="npm install"
/>`}
          >
            <Empty
              icon={<PackageIcon size={48} className="text-neutral-400" />}
              title="No dependencies installed"
              description="Install dependencies to get started with your project."
              commandLine="npm install"
            />
          </ComponentExample>
        </div>

        {/* With Custom Content */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Custom Content</h3>
          <ComponentExample
            code={`<Empty
  icon={<PackageIcon size={48} />}
  title="No projects yet"
  description="Create your first project to get started."
  contents={
    <Button variant="primary" icon={RocketIcon}>
      Create Project
    </Button>
  }
/>`}
          >
            <Empty
              icon={<PackageIcon size={48} className="text-neutral-400" />}
              title="No projects yet"
              description="Create your first project to get started."
              contents={
                <Button variant="primary" icon={RocketIcon}>
                  Create Project
                </Button>
              }
            />
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
                <td className="px-4 py-3 font-mono text-xs">icon</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">title</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">required</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">description</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">commandLine</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">contents</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
