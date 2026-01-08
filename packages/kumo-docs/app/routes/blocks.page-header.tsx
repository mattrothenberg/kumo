import {
  HouseIcon,
  GearIcon,
  CodeIcon,
  GlobeIcon,
} from "@phosphor-icons/react";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Button } from "@cloudflare/kumo";
import { PageHeader, Breadcrumbs, CodeBlock } from "@cloudflare/kumo";

export default function PageHeaderDoc() {
  return (
    <DocLayout
      title="Page Header"
      description="A composite component that combines breadcrumbs and tabs for page navigation."
      sourceFile="blocks/page-header"
      storybookPath="story/blocks-pageheader"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<PageHeader
  className="w-full"
  breadcrumbs={
    <Breadcrumbs>
      <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
        Workers & Pages
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>cloudflare-dev-platform</Breadcrumbs.Current>
    </Breadcrumbs>
  }
  tabs={[
    { label: "Overview", value: "overview" },
    { label: "Metrics", value: "metrics" },
    { label: "Deployments", value: "deployments" },
    { label: "Bindings", value: "bindings" },
    { label: "Observability", value: "observability" },
    { label: "Settings", value: "settings" },
  ]}
  defaultTab="overview"
  onValueChange={(v) => console.log(v)}
>
  <Button icon={<CodeIcon />} className="h-8">Edit code</Button>
  <Button icon={<GlobeIcon />} variant="primary" className="h-8">Visit</Button>
</PageHeader>`}
        >
          <PageHeader
            className="w-full"
            breadcrumbs={
              <Breadcrumbs>
                <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
                  Workers & Pages
                </Breadcrumbs.Link>
                <Breadcrumbs.Separator />
                <Breadcrumbs.Current>
                  cloudflare-dev-platform
                </Breadcrumbs.Current>
              </Breadcrumbs>
            }
            tabs={[
              { label: "Overview", value: "overview" },
              { label: "Metrics", value: "metrics" },
              { label: "Deployments", value: "deployments" },
              { label: "Bindings", value: "bindings" },
              { label: "Observability", value: "observability" },
              { label: "Settings", value: "settings" },
            ]}
            defaultTab={"overview"}
            onValueChange={(v) => console.log(v)}
          >
            <Button icon={<CodeIcon />} className="h-8">
              Edit code
            </Button>
            <Button icon={<GlobeIcon />} variant="primary" className="h-8">
              Visit
            </Button>
          </PageHeader>
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
          code={`import { PageHeader } from "~/blocks/page-header";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { PageHeader } from "~/blocks/page-header";
import { Breadcrumbs } from "@cloudflare/kumo";

export default function Example() {
  return (
    <PageHeader
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
        </Breadcrumbs>
      }
      tabs={[
        { label: "Overview", value: "overview" },
        { label: "Settings", value: "settings" }
      ]}
      defaultTab="overview"
      onValueChange={(value) => {
        console.log(value);
      }}
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
            code={`<PageHeader
  breadcrumbs={
    <Breadcrumbs>
      <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Dashboard</Breadcrumbs.Current>
    </Breadcrumbs>
  }
/>`}
          >
            <PageHeader
              breadcrumbs={
                <Breadcrumbs>
                  <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Current>Dashboard</Breadcrumbs.Current>
                </Breadcrumbs>
              }
            />
          </ComponentExample>
        </div>

        {/* With Tabs */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Tabs</h3>
          <ComponentExample
            code={`<PageHeader
  breadcrumbs={
    <Breadcrumbs>
      <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
    </Breadcrumbs>
  }
  tabs={[
    { label: "General", href: "/settings" },
    { label: "Security", href: "/settings/security" },
    { label: "Notifications", href: "/settings/notifications" }
  ]}
/>`}
          >
            <PageHeader
              breadcrumbs={
                <Breadcrumbs>
                  <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
                </Breadcrumbs>
              }
              //   tabs={[
              //     { label: "General", href: "/settings" },
              //     { label: "Security", href: "/settings/security" },
              //     { label: "Notifications", href: "/settings/notifications" }
              //   ]}
            />
          </ComponentExample>
        </div>

        {/* With Icons */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Icons</h3>
          <ComponentExample
            code={`<PageHeader
  breadcrumbs={
    <Breadcrumbs>
      <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
        Home
      </Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current icon={<GearIcon size={16} />}>
        Settings
      </Breadcrumbs.Current>
    </Breadcrumbs>
  }
  tabs={[
    { label: "General", href: "/settings" },
    { label: "Advanced", href: "/settings/advanced" }
  ]}
/>`}
          >
            <PageHeader
              breadcrumbs={
                <Breadcrumbs>
                  <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="#">
                    Home
                  </Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Current icon={<GearIcon size={16} />}>
                    Settings
                  </Breadcrumbs.Current>
                </Breadcrumbs>
              }
              //   tabs={[
              //     { label: "General", href: "/settings" },
              //     { label: "Advanced", href: "/settings/advanced" }
              //   ]}
            />
          </ComponentExample>
        </div>

        {/* With Actions */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With Actions</h3>
          <ComponentExample
            code={`<PageHeader
  breadcrumbs={
    <Breadcrumbs>
      <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
    </Breadcrumbs>
  }
  tabs={[
    { label: "Overview", href: "/projects/my-project" },
    { label: "Settings", href: "/projects/my-project/settings" }
  ]}
>
  <Button variant="primary" size="base">
    Deploy
  </Button>
</PageHeader>`}
          >
            <PageHeader
              breadcrumbs={
                <Breadcrumbs>
                  <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Link href="#">Projects</Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                  <Breadcrumbs.Current>My Project</Breadcrumbs.Current>
                </Breadcrumbs>
              }
              //   tabs={[
              //     { label: "Overview", href: "/projects/my-project" },
              //     { label: "Settings", href: "/projects/my-project/settings" }
              //   ]}
            >
              <Button variant="primary" size="base">
                Deploy
              </Button>
            </PageHeader>
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
                <td className="px-4 py-3 font-mono text-xs">breadcrumbs</td>
                <td className="px-4 py-3 font-mono text-xs">
                  BreadcrumbsItem[]
                </td>
                <td className="px-4 py-3 font-mono text-xs">required</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">tabs</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {"{ label: string; href: string }[]"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">children</td>
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
