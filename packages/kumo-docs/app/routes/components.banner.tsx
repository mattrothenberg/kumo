import { Banner, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { Info, WarningCircle } from "@phosphor-icons/react";

export default function BannerDoc() {
  return (
    <DocLayout
      title="Banner"
      description="Displays contextual inline messages for informational, alert, or error states."
      sourceFile="components/banner"
      storybookPath="story/components-banner"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<Banner text="This is an informational banner." />
<Banner
  variant={BannerVariant.ALERT}
  text="This is an alert banner."
/>
<Banner
  variant={BannerVariant.ERROR}
  text="This is an error banner."
/>`}
        >
          <div className="space-y-3">
            <Banner text="This is an informational banner." />
            <Banner variant="alert" text="This is an alert banner." />
            <Banner variant="error" text="This is an error banner." />
          </div>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <CodeBlock lang="bash" code={`npm install @cloudflare/kumo`} />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { Banner, BannerVariant } from "@cloudflare/kumo";
import { Info } from "@phosphor-icons/react";

export default function Example() {
  return (
    <Banner
      icon={<Info />}
      text="You have a new message."
      variant={BannerVariant.DEFAULT}
    />
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        {/* Variants */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">Variants</h3>
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-base font-medium">Default</h4>
              <ComponentExample
                code={`<Banner text="This is an informational banner." />`}
              >
                <Banner text="This is an informational banner." />
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Alert</h4>
              <ComponentExample
                code={`<Banner
  variant={BannerVariant.ALERT}
  text="Your session will expire soon."
/>`}
              >
                <Banner variant="alert" text="Your session will expire soon." />
              </ComponentExample>
            </div>

            <div>
              <h4 className="mb-3 text-base font-medium">Error</h4>
              <ComponentExample
                code={`<Banner
  variant={BannerVariant.ERROR}
  text="We couldn't save your changes."
/>`}
              >
                <Banner variant="error" text="We couldn't save your changes." />
              </ComponentExample>
            </div>
          </div>
        </div>

        {/* With icon */}
        <div className="mb-12">
          <h3 className="mb-4 text-xl font-semibold">With icon</h3>
          <ComponentExample
            code={`<Banner
  icon={<WarningCircle />}
  variant={BannerVariant.ALERT}
  text="Review your billing information."
/>`}
          >
            <Banner
              icon={<WarningCircle />}
              variant="alert"
              text="Review your billing information."
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
                <td className="px-4 py-3 font-mono text-xs">text</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">required</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">icon</td>
                <td className="px-4 py-3 font-mono text-xs">React.ReactNode</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">variant</td>
                <td className="px-4 py-3 font-mono text-xs">
                  BannerVariant.DEFAULT | BannerVariant.ALERT |
                  BannerVariant.ERROR
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  BannerVariant.DEFAULT
                </td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">className</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
