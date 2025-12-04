import { TextBolderIcon, TextItalicIcon } from "@phosphor-icons/react";
import { MenuBar } from "@cloudflare/kumo";
import { DocLayout } from "~/components/docs/doc-layout";
import { ComponentExample } from "~/components/docs/component-example";
import { ComponentSection } from "~/components/docs/component-section";
import { CodeBlock } from "@cloudflare/kumo";

export default function MenuBarDoc() {
  return (
    <DocLayout
      title="MenuBar"
      description="A horizontal menu bar with icon buttons, commonly used for text editors or toolbars."
    >
      {/* Demo */}
      <ComponentSection>
        <ComponentExample
          code={`<MenuBar
  isActive="bold"
  optionIds
  options={[
    {
      icon: <TextBolderIcon />,
      id: "bold",
      tooltip: "Bold",
      onClick: () => {},
    },
    {
      icon: <TextItalicIcon />,
      id: "italic",
      tooltip: "Italic",
      onClick: () => {},
    },
  ]}
/>`}
        >
          <MenuBar
            isActive="bold"
            optionIds
            options={[
              {
                icon: <TextBolderIcon />,
                id: "bold",
                tooltip: "Bold",
                onClick: () => {},
              },
              {
                icon: <TextItalicIcon />,
                id: "italic",
                tooltip: "Italic",
                onClick: () => {},
              },
            ]}
          />
        </ComponentExample>
      </ComponentSection>

      {/* Installation */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Installation</h2>
        <h3 className="mb-2 text-lg font-semibold">Barrel</h3>
        <CodeBlock
          lang="tsx"
          code={`import { MenuBar } from "@cloudflare/kumo";`}
        />
        <h3 className="mt-4 mb-2 text-lg font-semibold">Granular</h3>
        <CodeBlock
          lang="tsx"
          code={`import { MenuBar } from "@cloudflare/kumo/components/menubar";`}
        />
      </ComponentSection>

      {/* Usage */}
      <ComponentSection>
        <h2 className="mb-4 text-2xl font-bold">Usage</h2>
        <CodeBlock
          lang="tsx"
          code={`import { MenuBar } from "@cloudflare/kumo";
import { TextBolderIcon } from "@phosphor-icons/react";

export default function Example() {
  return (
    <MenuBar
      options={[
        {
          icon: <TextBolderIcon />,
          id: "bold",
          tooltip: "Bold",
          onClick: () => console.log("Bold clicked"),
        },
      ]}
    />
  );
}`}
        />
      </ComponentSection>

      {/* Examples */}
      <ComponentSection>
        <h2 className="mb-6 text-2xl font-bold">Examples</h2>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Text Formatting</h3>
            <ComponentExample
              code={`<MenuBar
  isActive="bold"
  optionIds
  options={[
    {
      icon: <TextBolderIcon />,
      id: "bold",
      tooltip: "Bold",
      onClick: () => {},
    },
    {
      icon: <TextItalicIcon />,
      id: "italic",
      tooltip: "Italic",
      onClick: () => {},
    },
  ]}
/>`}
            >
              <MenuBar
                isActive="bold"
                optionIds
                options={[
                  {
                    icon: <TextBolderIcon />,
                    id: "bold",
                    tooltip: "Bold",
                    onClick: () => {},
                  },
                  {
                    icon: <TextItalicIcon />,
                    id: "italic",
                    tooltip: "Italic",
                    onClick: () => {},
                  },
                ]}
              />
            </ComponentExample>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Without Active State</h3>
            <ComponentExample
              code={`<MenuBar
  isActive=""
  optionIds
  options={[
    {
      icon: <TextBolderIcon />,
      id: "bold",
      tooltip: "Bold",
      onClick: () => {},
    },
    {
      icon: <TextItalicIcon />,
      id: "italic",
      tooltip: "Italic",
      onClick: () => {},
    },
  ]}
/>`}
            >
              <MenuBar
                isActive=""
                optionIds
                options={[
                  {
                    icon: <TextBolderIcon />,
                    id: "bold",
                    tooltip: "Bold",
                    onClick: () => {},
                  },
                  {
                    icon: <TextItalicIcon />,
                    id: "italic",
                    tooltip: "Italic",
                    onClick: () => {},
                  },
                ]}
              />
            </ComponentExample>
          </div>
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
                <td className="px-4 py-3 font-mono text-xs">options</td>
                <td className="px-4 py-3 font-mono text-xs">{`Array<{ icon: ReactNode; id: string; tooltip: string; onClick: () => void }>`}</td>
                <td className="px-4 py-3 font-mono text-xs">[]</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">isActive</td>
                <td className="px-4 py-3 font-mono text-xs">string</td>
                <td className="px-4 py-3 font-mono text-xs">undefined</td>
              </tr>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-mono text-xs">optionIds</td>
                <td className="px-4 py-3 font-mono text-xs">boolean</td>
                <td className="px-4 py-3 font-mono text-xs">false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentSection>
    </DocLayout>
  );
}
