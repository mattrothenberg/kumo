import { ResourceListPage, Surface, Code } from "@cloudflare/kumo";
import { Database } from "@phosphor-icons/react";

export function ResourceListDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ResourceListPage
        title="Databases"
        description="Manage your database instances and configurations"
        icon={<Database size={32} className="text-label" />}
      >
        <Surface className="rounded-lg p-6">
          <p className="text-label">
            Main content area - your resource list would go here
          </p>
        </Surface>
      </ResourceListPage>
    </div>
  );
}

export function ResourceListWithUsageDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ResourceListPage
        title="API Keys"
        description="Create and manage API keys for your applications"
        usage={
          <Surface className="rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Quick Start</h3>
            <p className="mb-3 text-sm text-label">
              Generate an API key to authenticate your requests
            </p>
            <Code
              lang="bash"
              code='curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com'
            />
          </Surface>
        }
      >
        <Surface className="rounded-lg p-6">
          <p className="text-label">API keys list would appear here</p>
        </Surface>
      </ResourceListPage>
    </div>
  );
}

export function ResourceListCompleteDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ResourceListPage
        title="KV Namespaces"
        description="Store key-value data globally with low-latency access"
        icon={<Database size={32} className="text-label" />}
        usage={
          <Surface className="rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Usage Example</h3>
            <Code
              lang="ts"
              code={`// Read from KV
const value = await KV.get('key');

// Write to KV
await KV.put('key', 'value');`}
            />
          </Surface>
        }
        additionalContent={
          <Surface className="rounded-lg p-4">
            <h3 className="mb-2 font-semibold">Learn More</h3>
            <p className="text-sm text-label">
              Check out our documentation to learn more about KV storage.
            </p>
          </Surface>
        }
      >
        <div className="space-y-4">
          <Surface className="rounded-lg p-6">
            <h4 className="mb-2 font-semibold">production-kv</h4>
            <p className="text-sm text-label">Created 2 days ago</p>
          </Surface>
          <Surface className="rounded-lg p-6">
            <h4 className="mb-2 font-semibold">staging-kv</h4>
            <p className="text-sm text-label">Created 1 week ago</p>
          </Surface>
        </div>
      </ResourceListPage>
    </div>
  );
}
