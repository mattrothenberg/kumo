import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResourceListPage } from "./resource-list";
import { DatabaseIcon } from "@phosphor-icons/react";
import { Surface } from "../../components/surface";
import { Code } from "../../components/code";

const meta = {
  title: "Layouts/ResourceListPage",
  component: ResourceListPage,
} satisfies Meta<typeof ResourceListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Databases",
    description: "Manage your database instances and configurations",
    icon: <DatabaseIcon size={32} className="text-neutral-subtle" />,
    children: (
      <Surface className="p-6">
        <p>Main content area - your resource list would go here</p>
      </Surface>
    ),
  },
};

export const WithUsage: Story = {
  args: {
    title: "API Keys",
    description: "Create and manage API keys for your applications",
    usage: (
      <Surface className="p-4">
        <h3 className="mb-2 font-semibold">Quick Start</h3>
        <p className="mb-3 text-sm text-label">
          Generate an API key to authenticate your requests
        </p>
        <Code
          lang="bash"
          code='curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com'
        />
      </Surface>
    ),
    children: (
      <Surface className="p-6">
        <p>API keys list would appear here</p>
      </Surface>
    ),
  },
};

export const WithAdditionalContent: Story = {
  args: {
    title: "Workers",
    description: "Deploy and manage serverless functions at the edge",
    additionalContent: (
      <Surface className="p-4">
        <h3 className="mb-2 font-semibold">Resources</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="https://developers.cloudflare.com" className="text-info hover:underline">
              Documentation
            </a>
          </li>
          <li>
            <a href="https://developers.cloudflare.com/workers/examples" className="text-info hover:underline">
              Examples
            </a>
          </li>
          <li>
            <a href="https://community.cloudflare.com" className="text-info hover:underline">
              Community
            </a>
          </li>
        </ul>
      </Surface>
    ),
    children: (
      <Surface className="p-6">
        <p>Workers list would appear here</p>
      </Surface>
    ),
  },
};

export const Complete: Story = {
  args: {
    title: "KV Namespaces",
    description: "Store key-value data globally with low-latency access",
    icon: <DatabaseIcon size={32} className="text-neutral-subtle" />,
    usage: (
      <Surface className="p-4">
        <h3 className="mb-2 font-semibold">Usage Example</h3>
        <Code
          lang="ts"
          code={`// Read from KV
const value = await KV.get('key');

// Write to KV
await KV.put('key', 'value');`}
        />
      </Surface>
    ),
    additionalContent: (
      <Surface className="p-4">
        <h3 className="mb-2 font-semibold">Learn More</h3>
        <p className="text-sm text-label">
          Check out our documentation to learn more about KV storage.
        </p>
      </Surface>
    ),
    children: (
      <div className="space-y-4">
        <Surface className="p-6">
          <h4 className="mb-2 font-semibold">production-kv</h4>
          <p className="text-sm text-label">Created 2 days ago</p>
        </Surface>
        <Surface className="p-6">
          <h4 className="mb-2 font-semibold">staging-kv</h4>
          <p className="text-sm text-label">Created 1 week ago</p>
        </Surface>
      </div>
    ),
  },
};
