import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function Installation() {
  return (
    <DocLayout
      title="Installation"
      description="Get started with Kumo by installing the package and importing components."
    >
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">NPM Registry Configuration</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Follow the steps at{" "}
          <a
            href="https://wiki.cfdata.org/display/FE/Getting+started+with+the+private+NPM+registry"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Getting started with the private NPM registry
          </a>{" "}
          to configure your local environment with a <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">NPM_TOKEN</code>.
        </p>

        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          To install <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">@cloudflare</code> scoped packages, 
          you need to configure NPM to use the Cloudflare private registry.<br />
          Add the following to either your user-level NPM configuration (<code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">~/.npmrc</code>) 
          or your consuming project's <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">.npmrc</code> file:
        </p>
        <CodeBlock
          lang="bash"
          code={`# Cloudflare registry configuration
@cloudflare:registry=https://registry-gateway.cloudflare-ui.workers.dev
//registry-gateway.cloudflare-ui.workers.dev/:_authToken="\${NPM_TOKEN}"`}
        />
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Install Package</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Install Kumo using your preferred package manager:
        </p>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              npm
            </p>
            <CodeBlock lang="bash" code={`npm install @cloudflare/kumo`} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              pnpm
            </p>
            <CodeBlock lang="bash" code={`pnpm add @cloudflare/kumo`} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              yarn
            </p>
            <CodeBlock lang="bash" code={`yarn add @cloudflare/kumo`} />
          </div>
        </div>
      </ComponentSection>

      {/* Import Components */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Import Components</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Import components from the main package or use granular imports for
          better tree-shaking:
        </p>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Main Package Import
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { Button, Input, Surface } from "@cloudflare/kumo";`}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Granular Import (Recommended)
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";`}
            />
          </div>
        </div>
      </ComponentSection>

      {/* Import Styles */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Import Styles</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Kumo provides two CSS distribution options depending on your setup:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              For Tailwind CSS Users (Recommended)
            </h3>
            <p className="mb-3 text-neutral-600 dark:text-neutral-400">
              If your application uses Tailwind CSS, add Kumo's source files to
              your content configuration and import the styles. Make sure to
              import Tailwind first, then Kumo styles:
            </p>
            <CodeBlock
              lang="css"
              code={`/* app.css or main.css */
@source "../node_modules/@cloudflare/kumo/dist/**/*.{js,jsx,ts,tsx}";
@import "tailwindcss";
@import "@cloudflare/kumo/styles/tailwind";

/* Your custom styles */`}
            />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
              Note: You can also use the default export{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">
                @cloudflare/kumo/styles
              </code>{" "}
              which is equivalent to{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs dark:bg-neutral-800">
                styles/tailwind
              </code>
              .
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">
              For Non-Tailwind Users (Standalone)
            </h3>
            <p className="mb-3 text-neutral-600 dark:text-neutral-400">
              If your application doesn't use Tailwind CSS, use the standalone
              build which includes all compiled styles:
            </p>
            <CodeBlock
              lang="tsx"
              code={`// In your app entry point (e.g., main.tsx, index.tsx)
import "@cloudflare/kumo/styles/standalone";`}
            />
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
              The standalone build includes all Tailwind utilities and Kumo
              component styles pre-compiled. No Tailwind configuration needed!
            </p>
          </div>
        </div>
      </ComponentSection>

      {/* Usage Example */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage Example</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Here's a complete example of using Kumo components with Tailwind CSS:
        </p>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              CSS File (app.css)
            </p>
            <CodeBlock
              lang="css"
              code={`@import "tailwindcss";
@import "@cloudflare/kumo/styles/tailwind";`}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Component File (App.tsx)
            </p>
            <CodeBlock
              lang="tsx"
              code={`import { Button, Input, Surface } from "@cloudflare/kumo";
import "./app.css";

export default function App() {
  return (
    <Surface className="p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Welcome to Kumo</h1>
      <Input placeholder="Enter your name..." className="mb-4" />
      <Button variant="primary">Submit</Button>
    </Surface>
  );
}`}
            />
          </div>
        </div>
      </ComponentSection>

      {/* Available Components */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Available Components</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          The following components are currently available in Kumo:
        </p>
        <ul className="list-inside list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Badge</strong> - Display status indicators and labels
          </li>
          <li>
            <strong>Button</strong> - Interactive buttons with multiple variants
          </li>
          <li>
            <strong>Input</strong> - Text input fields with validation support
          </li>
          <li>
            <strong>InputArea</strong> - Multi-line textarea with Input styling
          </li>
          <li>
            <strong>InputGroup</strong> - Compound component for grouped inputs
            and buttons
          </li>
          <li>
            <strong>Loader</strong> - Loading spinners and indicators
          </li>
          <li>
            <strong>SkeletonLine</strong> - Animated skeleton loading
            placeholders
          </li>
          <li>
            <strong>Surface</strong> - Container component for content
          </li>
        </ul>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          More components are being added regularly. Check the Components
          section for detailed documentation.
        </p>
      </ComponentSection>

      {/* Utilities */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Utilities</h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Kumo also exports utility functions for common tasks:
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { cn, safeRandomId, LinkProvider } from "@cloudflare/kumo";

// Merge class names with Tailwind
const className = cn("base-class", condition && "conditional-class");

// Generate safe random IDs
const id = safeRandomId();

// Configure link component for your framework
<LinkProvider component={YourLinkComponent}>
  {/* Your app */}
</LinkProvider>`}
        />
      </ComponentSection>
    </DocLayout>
  );
}
