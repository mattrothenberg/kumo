import { PlusIcon } from "@phosphor-icons/react";
import { DropdownMenu, Button, CodeBlock } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";

export default function DropdownDoc() {
  return (
    <DocLayout
      title="Dropdown Menu"
      description="Displays a menu to the user—such as a set of actions or functions—triggered by a button."
      sourceFile="components/dropdown"
      storybookPath="story/components-dropdown"
      baseUIComponent="menu"
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<DropdownMenu>
  <DropdownMenu.Trigger render={<Button icon={PlusIcon}>Add</Button>} />
  <DropdownMenu.Content>
    <DropdownMenu.Item>Worker</DropdownMenu.Item>
    <DropdownMenu.Item>Pages</DropdownMenu.Item>
    <DropdownMenu.Item>KV Namespace</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`}
        >
          <DropdownMenu>
            <DropdownMenu.Trigger
              render={<Button icon={PlusIcon}>Add</Button>}
            />
            <DropdownMenu.Content>
              <DropdownMenu.Item>Worker</DropdownMenu.Item>
              <DropdownMenu.Item>Pages</DropdownMenu.Item>
              <DropdownMenu.Item>KV Namespace</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { DropdownMenu } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { DropdownMenu } from "@cloudflare/kumo/components/dropdown";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { DropdownMenu, Button } from "@cloudflare/kumo";

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>Menu</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item>Option 1</DropdownMenu.Item>
        <DropdownMenu.Item>Option 2</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Basic Dropdown</h3>
            <ComponentExample
              code={`<DropdownMenu>
  <DropdownMenu.Trigger render={<Button icon={PlusIcon}>Add</Button>} />
  <DropdownMenu.Content>
    <DropdownMenu.Item>Worker</DropdownMenu.Item>
    <DropdownMenu.Item>Pages</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`}
            >
              <DropdownMenu>
                <DropdownMenu.Trigger
                  render={<Button icon={PlusIcon}>Add</Button>}
                />
                <DropdownMenu.Content>
                  <DropdownMenu.Item>Worker</DropdownMenu.Item>
                  <DropdownMenu.Item>Pages</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </ComponentExample>
          </div>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
