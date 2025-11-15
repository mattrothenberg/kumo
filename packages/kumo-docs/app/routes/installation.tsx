import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "~/components/code/code-lazy";

export default function Installation() {
  return (
    <DocLayout
      title="Installation"
      description="Get started with Kumo by installing the package and importing components."
    >
      {/* Installation */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Install Package</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Install Kumo using your preferred package manager:
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">npm</p>
            <CodeBlock
              lang="bash"
              code={`npm install @cloudflare/kumo`}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">pnpm</p>
            <CodeBlock
              lang="bash"
              code={`pnpm add @cloudflare/kumo`}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">yarn</p>
            <CodeBlock
              lang="bash"
              code={`yarn add @cloudflare/kumo`}
            />
          </div>
        </div>
      </ComponentSection>

      {/* Import Components */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Import Components</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Import components from the main package or use granular imports for better tree-shaking:
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Main Package Import</p>
            <CodeBlock
              lang="tsx"
              code={`import { Button, Input, Surface } from "@cloudflare/kumo";`}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Granular Import (Recommended)</p>
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
        <h2 className="text-2xl font-bold mb-4">Import Styles</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Import the Kumo CSS file in your application's entry point:
        </p>
        <CodeBlock
          lang="tsx"
          code={`import "@cloudflare/kumo/styles";`}
        />
      </ComponentSection>

      {/* Usage Example */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Here's a complete example of using Kumo components:
        </p>
        <CodeBlock
          lang="tsx"
          code={`import { Button, Input, Surface } from "@cloudflare/kumo";
import "@cloudflare/kumo/styles";

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
      </ComponentSection>

      {/* Available Components */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Available Components</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The following components are currently available in Kumo:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><strong>Badge</strong> - Display status indicators and labels</li>
          <li><strong>Button</strong> - Interactive buttons with multiple variants</li>
          <li><strong>Input</strong> - Text input fields with validation support</li>
          <li><strong>InputArea</strong> - Multi-line textarea with Input styling</li>
          <li><strong>InputGroup</strong> - Compound component for grouped inputs and buttons</li>
          <li><strong>Loader</strong> - Loading spinners and indicators</li>
          <li><strong>SkeletonLine</strong> - Animated skeleton loading placeholders</li>
          <li><strong>Surface</strong> - Container component for content</li>
        </ul>
        <p className="text-neutral-600 dark:text-neutral-400 mt-4">
          More components are being added regularly. Check the Components section for detailed documentation.
        </p>
      </ComponentSection>

      {/* Utilities */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Utilities</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
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
