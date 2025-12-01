import type { Meta, StoryObj } from "@storybook/react";
import { Code, CodeBlock, KUMO_CODE_VARIANTS } from "./code";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof Code> = {
  title: "Components/Code",
  component: Code,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Langs: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_CODE_VARIANTS.lang),
        "lang",
        <Code code='const hello = "world";' />,
      )}
    </>
  ),
};

export const TypeScript: Story = {
  name: "TypeScript",
  args: {
    lang: "ts",
    code: `interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "John",
  email: "john@example.com"
};`,
  },
};

export const Bash: Story = {
  args: {
    lang: "bash",
    code: "npm install @cloudflare/kumo",
  },
};

export const Block: Story = {
  render: () => (
    <CodeBlock
      lang="tsx"
      code={`<Button variant="primary">
  Click me
</Button>`}
    />
  ),
};
