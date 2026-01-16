import type { Meta, StoryObj } from "@storybook/react-vite";
import { TailwindColorTokens } from "./TailwindColors";

const meta = {
  component: TailwindColorTokens,
  title: "Design-Tokens/Colors",
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Kumo Color System

Kumo uses semantic color tokens that automatically adapt to light/dark mode via CSS \`light-dark()\`.

### Token Types

| Type | CSS Variable | Tailwind Class | Example |
|------|-------------|----------------|---------|
| Surface colors | \`--color-surface\` | \`bg-surface\` | Backgrounds, cards |
| Text colors | \`--text-color-surface\` | \`text-surface\` | Body text |
| State colors | \`--color-active\` | \`ring-active\` | Focus rings |

### Theme Support

Kumo supports two types of theme customization:

#### 1. Global Tokens (Explicit Opt-In)

Theme-specific tokens available globally via Tailwind classes. Use these when you want to apply theme styling to specific elements without affecting the component tree.

\`\`\`tsx
// Explicit FedRAMP styling on specific elements
<header className="bg-fedramp-surface text-white">
  FedRAMP Header
</header>

// Mix with standard Kumo tokens
<div className="bg-surface">
  <Badge className="bg-fedramp-active">FedRAMP</Badge>
</div>
\`\`\`

#### 2. Semantic Overrides (Cascading Theme)

Override semantic tokens via \`data-theme\` on a parent element. All Kumo components within that subtree automatically use the theme colors without any className changes.

\`\`\`tsx
// All children use FedRAMP colors automatically
<div data-theme="fedramp">
  <Button>Uses FedRAMP primary</Button>
  <Input placeholder="Uses FedRAMP surface" />
</div>
\`\`\`

### Dark Mode

**Never use Tailwind's \`dark\`\`:\` variant.** Semantic tokens handle dark mode automatically via \`light-dark()\`.

\`\`\`tsx
// ❌ WRONG - Manual dark mode (using dark variant)
<div className="bg-white ..." />

// ✅ CORRECT - Automatic via semantic tokens
<div className="bg-surface" />
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof TailwindColorTokens>;

export default meta;

type Story = StoryObj<typeof TailwindColorTokens>;

export const Colors: Story = {
  args: { display: "colors" },
  parameters: {
    docs: {
      description: {
        story:
          "Surface, state, and theme-specific color tokens. Use with `bg-*`, `border-*`, `ring-*`, `fill-*` utilities.",
      },
    },
  },
};

export const TextColors: Story = {
  args: { display: "text-colors" },
  parameters: {
    docs: {
      description: {
        story: "Text color tokens. Use with `text-*` utility.",
      },
    },
  },
};
