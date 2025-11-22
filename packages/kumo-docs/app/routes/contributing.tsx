import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function Contributing() {
  return (
    <DocLayout
      title="Contributing"
      description="Learn how to contribute to Kumo by adding new components and features."
    >
      {/* Overview */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Contributing to Kumo</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          We welcome contributions to Kumo! This guide will help you get started with adding new components and blocks to the library.
        </p>
      </ComponentSection>

      {/* Components vs Blocks vs Layouts */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Components vs Blocks vs Layouts</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Components</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Atomic, reusable UI elements
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
              <li>Single responsibility</li>
              <li>Highly reusable</li>
              <li>Minimal dependencies</li>
              <li>Style-focused</li>
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
              Examples: Button, Input, Badge, Tabs
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Blocks</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Composed patterns for page layouts
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
              <li>Compose multiple components</li>
              <li>Implement common patterns</li>
              <li>Layout-focused</li>
              <li>May include business logic</li>
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
              Examples: Breadcrumbs, PageHeader, Empty
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Layouts</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
              Page-level structure patterns
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
              <li>Full-page composition</li>
              <li>Consistent structure</li>
              <li>Responsive patterns</li>
              <li>Application-wide use</li>
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-3">
              Examples: ResourceListPage, DashboardPage
            </p>
          </div>
        </div>
      </ComponentSection>

      {/* Component Scaffolding */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Creating New Components</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Kumo includes a scaffolding tool that automates component creation. This ensures all components follow the same structure and are properly configured.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Run the Scaffolding Tool</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          From the workspace root, run:
        </p>
        <CodeBlock
          lang="bash"
          code={`pnpm --filter @cloudflare/kumo new-component`}
        />
      </ComponentSection>

      {/* What It Does */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">What the Scaffolding Tool Does</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The tool automatically creates and updates several files:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Component file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/components/{"{name}"}/{"{name}"}.tsx</code></li>
          <li><strong>Index file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/components/{"{name}"}/index.ts</code></li>
          <li><strong>Story file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/components/{"{name}"}/{"{name}"}.stories.tsx</code></li>
          <li><strong>Test file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/components/{"{name}"}/{"{name}"}.test.tsx</code></li>
          <li><strong>Main exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/index.ts</code></li>
          <li><strong>Build config</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">vite.config.ts</code></li>
          <li><strong>Package exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">package.json</code></li>
        </ul>
      </ComponentSection>

      {/* Example */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Example</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Here's what the scaffolding process looks like:
        </p>
        <CodeBlock
          lang="bash"
          code={`? Component name: Alert Banner

✅ Component scaffolded successfully!

📁 Files created:
   - src/components/alert-banner/alert-banner.tsx
   - src/components/alert-banner/index.ts
   - src/components/alert-banner/alert-banner.stories.tsx
   - src/components/alert-banner/alert-banner.test.tsx

📝 Files updated:
   - src/index.ts
   - vite.config.ts
   - package.json

💡 Import examples:
   import { AlertBanner } from "@cloudflare/kumo";
   import { AlertBanner } from "@cloudflare/kumo/components/alert-banner";`}
        />
      </ComponentSection>

      {/* Naming */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Component Naming</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The scaffolding tool handles naming automatically. You can input the name in any format:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Spaces</strong> - "Alert Banner" → <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">alert-banner</code> directory, <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">AlertBanner</code> component</li>
          <li><strong>PascalCase</strong> - "AlertBanner" → <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">alert-banner</code> directory, <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">AlertBanner</code> component</li>
          <li><strong>kebab-case</strong> - "alert-banner" → <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">alert-banner</code> directory, <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">AlertBanner</code> component</li>
        </ul>
      </ComponentSection>

      {/* Block Scaffolding */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Creating New Blocks</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Blocks are higher-level components that compose multiple base components. Use the block scaffolding tool to create them:
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Run the Block Scaffolding Tool</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          From the workspace root, run:
        </p>
        <CodeBlock
          lang="bash"
          code={`pnpm --filter @cloudflare/kumo new-block`}
        />

        <h3 className="text-xl font-semibold mb-3 mt-6">What It Creates</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The block scaffolding tool creates the same structure as components, but in the <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks</code> directory:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Block file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks/{"{name}"}/{"{name}"}.tsx</code></li>
          <li><strong>Index file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks/{"{name}"}/index.ts</code></li>
          <li><strong>Story file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks/{"{name}"}/{"{name}"}.stories.tsx</code></li>
          <li><strong>Test file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks/{"{name}"}/{"{name}"}.test.tsx</code></li>
          <li><strong>Main exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/index.ts</code> (Blocks section)</li>
          <li><strong>Build config</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">vite.config.ts</code></li>
          <li><strong>Package exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">package.json</code></li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">Example</h3>
        <CodeBlock
          lang="bash"
          code={`? Block name: Navigation Bar

✅ Block scaffolded successfully!

📁 Files created:
   - src/blocks/navigation-bar/navigation-bar.tsx
   - src/blocks/navigation-bar/index.ts
   - src/blocks/navigation-bar/navigation-bar.stories.tsx
   - src/blocks/navigation-bar/navigation-bar.test.tsx

📝 Files updated:
   - src/index.ts
   - vite.config.ts
   - package.json

💡 Import examples:
   import { NavigationBar } from "@cloudflare/kumo";
   import { NavigationBar } from "@cloudflare/kumo/blocks/navigation-bar";`}
        />
      </ComponentSection>

      {/* Layout Scaffolding */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Creating New Layouts</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Layouts are page-level components that provide consistent structure for common page patterns. Use the layout scaffolding tool:
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Run the Layout Scaffolding Tool</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          From the workspace root, run:
        </p>
        <CodeBlock
          lang="bash"
          code={`pnpm --filter @cloudflare/kumo new-layout`}
        />

        <h3 className="text-xl font-semibold mb-3 mt-6">What It Creates</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The layout scaffolding tool creates the same structure as components and blocks, but in the <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts</code> directory:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Layout file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts/{"{name}"}/{"{name}"}.tsx</code></li>
          <li><strong>Index file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts/{"{name}"}/index.ts</code></li>
          <li><strong>Story file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts/{"{name}"}/{"{name}"}.stories.tsx</code></li>
          <li><strong>Test file</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts/{"{name}"}/{"{name}"}.test.tsx</code></li>
          <li><strong>Main exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/index.ts</code> (Layouts section)</li>
          <li><strong>Build config</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">vite.config.ts</code></li>
          <li><strong>Package exports</strong> - Updates <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">package.json</code></li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">Example</h3>
        <CodeBlock
          lang="bash"
          code={`? Layout name: Dashboard Page

✅ Layout scaffolded successfully!

📁 Files created:
   - src/layouts/dashboard-page/dashboard-page.tsx
   - src/layouts/dashboard-page/index.ts
   - src/layouts/dashboard-page/dashboard-page.stories.tsx
   - src/layouts/dashboard-page/dashboard-page.test.tsx

📝 Files updated:
   - src/index.ts
   - vite.config.ts
   - package.json

💡 Import examples:
   import { DashboardPage } from "@cloudflare/kumo";
   import { DashboardPage } from "@cloudflare/kumo/layouts/dashboard-page";`}
        />
      </ComponentSection>

      {/* Development Workflow */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Development Workflow</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          After scaffolding a component, block, or layout, choose your development approach:
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Option 1: Storybook (Recommended)
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Best for isolated component development with instant feedback
            </p>
            <CodeBlock
              lang="bash"
              code={`pnpm storybook`}
            />
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-900 dark:text-blue-100 mt-3">
              <li>Full HMR with React Fast Refresh</li>
              <li>Changes reflect instantly</li>
              <li>Interactive component testing</li>
              <li>No build required</li>
            </ul>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Option 2: Watch Build
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              For testing components in the documentation site
            </p>
            <CodeBlock
              lang="bash"
              code={`# Terminal 1
pnpm --filter @cloudflare/kumo dev

# Terminal 2
pnpm --filter @cloudflare/kumo-docs dev`}
            />
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-neutral-300 mt-3">
              <li>Fast rebuild time</li>
              <li>Validates bundle exports/imports</li>
              <li>Tests actual build output</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3 mt-6">Implementation Steps</h3>
        <ol className="list-decimal list-inside space-y-3 text-neutral-700 dark:text-neutral-300">
          <li>
            <strong>Implement the component/block/layout</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Edit the generated <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">.tsx</code> file. Start Storybook for rapid iteration with instant HMR.
            </p>
          </li>
          <li>
            <strong>Create stories</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Add a <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">.stories.tsx</code> file to showcase component variants. Stories serve as living documentation.
            </p>
          </li>
          <li>
            <strong>Write tests</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Add tests to the generated <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">.test.tsx</code> file. Run tests in watch mode while developing.
            </p>
            <CodeBlock
              lang="bash"
              code={`pnpm --filter @cloudflare/kumo test`}
            />
          </li>
          <li>
            <strong>Test in documentation site (optional)</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Use the two-terminal watch build setup to see your component in the actual docs site. Validates production build output.
            </p>
          </li>
          <li>
            <strong>Build the package</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Before committing, do a full production build to ensure everything works:
            </p>
            <CodeBlock
              lang="bash"
              code={`pnpm --filter @cloudflare/kumo build`}
            />
          </li>
          <li>
            <strong>Add documentation</strong>
            <p className="ml-6 mt-1 text-neutral-600 dark:text-neutral-400">
              Create a documentation page in <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">kumo-docs/app/routes/</code> showing real-world usage examples.
            </p>
          </li>
        </ol>
      </ComponentSection>

      {/* Storybook Development */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Storybook Development (Recommended)</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Storybook is the recommended way to develop components. It provides instant feedback with full HMR and serves as interactive documentation. Use this for 90% of your component development work.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Start Storybook</h3>
        <CodeBlock
          lang="bash"
          code={`pnpm --filter @cloudflare/kumo storybook`}
        />
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 mb-4">
          Opens at <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">http://localhost:6006</code> with hot module replacement enabled.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">Why Storybook is Recommended</h3>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Instant HMR</strong> - Changes reflect immediately without page reload</li>
          <li><strong>No build step</strong> - Components run directly from source</li>
          <li><strong>Isolated testing</strong> - Test components without running the full app</li>
          <li><strong>Interactive playground</strong> - Test all variations and edge cases</li>
          <li><strong>Auto-generated docs</strong> - Documentation from TypeScript types</li>
          <li><strong>Shared workflow</strong> - Same tool for designers and developers</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">When to Use Watch Build Instead</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
          Only use the watch build mode when you need to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li>Test components in the actual documentation site with real content</li>
          <li>Validate production build configuration and exports</li>
          <li>Debug issues specific to the build process</li>
          <li>Test integration with other production features</li>
        </ul>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          <strong>Note:</strong> Watch build requires manual browser refresh and takes ~400ms per rebuild. Use Storybook for faster iteration during component development.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">Creating Stories</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Story files live alongside components and follow the pattern <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">{"{name}"}.stories.tsx</code>:
        </p>
        <CodeBlock
          lang="tsx"
          code={`import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Click me' },
};`}
        />

        <h3 className="text-xl font-semibold mb-3 mt-6">Story Organization</h3>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
          <li><strong>Components</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/components/{"{name}"}/{"{name}"}.stories.tsx</code></li>
          <li><strong>Blocks</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/blocks/{"{name}"}/{"{name}"}.stories.tsx</code></li>
          <li><strong>Layouts</strong> - <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">src/layouts/{"{name}"}/{"{name}"}.stories.tsx</code></li>
        </ul>

        <p className="text-neutral-600 dark:text-neutral-400 mt-4">
          <strong>Best Practice:</strong> Always create stories for new components, blocks, and layouts. Stories serve as living documentation and make development faster.
        </p>

        <p className="text-neutral-600 dark:text-neutral-400 mt-4">
          For comprehensive Storybook documentation, see <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">packages/kumo/STORYBOOK.md</code>
        </p>
      </ComponentSection>

      {/* Testing */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Testing</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The test suite automatically validates your component, block, or layout configuration:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>Main entry point exports the component/block/layout</li>
          <li>Deep import paths work correctly (<code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">@cloudflare/kumo/components/*</code>, <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">@cloudflare/kumo/blocks/*</code>, or <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">@cloudflare/kumo/layouts/*</code>)</li>
          <li>Package.json exports are properly configured</li>
          <li>Build configuration is correct</li>
          <li>All files exist in the correct locations</li>
        </ul>
        <p className="text-neutral-600 dark:text-neutral-400 mt-4">
          Run the test suite to ensure everything is configured correctly:
        </p>
        <CodeBlock
          lang="bash"
          code={`pnpm --filter @cloudflare/kumo test:run`}
        />
        <p className="text-neutral-600 dark:text-neutral-400 mt-4">
          The tests will provide helpful error messages with exact code snippets if any configuration is missing.
        </p>
      </ComponentSection>

      {/* Component Guidelines */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Component Guidelines</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          When implementing components, follow these guidelines:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><strong>Accessibility</strong> - Include proper ARIA attributes and keyboard navigation</li>
          <li><strong>TypeScript</strong> - Export prop types and use proper type annotations</li>
          <li><strong>Styling</strong> - Use Tailwind CSS classes and the <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">cn</code> utility</li>
          <li><strong>Consistency</strong> - Follow existing component patterns and naming conventions</li>
          <li><strong>Documentation</strong> - Add clear JSDoc comments and usage examples</li>
          <li><strong>Testing</strong> - Include unit tests for component behavior</li>
          <li><strong>Single Responsibility</strong> - Keep components focused on one task</li>
        </ul>
      </ComponentSection>

      {/* Block Guidelines */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Block Guidelines</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          When implementing blocks, follow these additional guidelines:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><strong>Composition</strong> - Compose existing components rather than reimplementing functionality</li>
          <li><strong>Framework Agnostic</strong> - Use <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">LinkProvider</code> for routing to remain framework-agnostic</li>
          <li><strong>Flexible Props</strong> - Accept both simple and complex props to support various use cases</li>
          <li><strong>Common Patterns</strong> - Focus on patterns that appear in multiple applications</li>
          <li><strong>Documentation</strong> - Include JSDoc explaining the block's purpose and when to use it</li>
          <li><strong>Examples</strong> - Provide clear usage examples showing composition</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">When to Create a Block</h3>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>Pattern appears in multiple places across applications</li>
          <li>Combines 2+ base components</li>
          <li>Implements a common layout or page structure</li>
          <li>Has specific business logic or behavior</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">When NOT to Create a Block</h3>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li>Single component with styling variations (use component variants instead)</li>
          <li>Application-specific logic (keep in application code)</li>
          <li>One-off patterns (wait for reuse before abstracting)</li>
        </ul>
      </ComponentSection>

      {/* Resources */}
      <ComponentSection>
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          For more detailed information, refer to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
          <li><a href="https://gitlab.cfdata.org/cloudflare/fe/kumo/" className="text-blue-600 dark:text-blue-400 hover:underline">Gitlab Repository</a></li>
          <li><a href="https://base-ui.com/" className="text-blue-600 dark:text-blue-400 hover:underline">Base UI Documentation</a></li>
        </ul>
      </ComponentSection>
    </DocLayout>
  );
}
