# Storybook Development Guide

Kumo uses [Storybook](https://storybook.js.org/) as a live development environment and component documentation tool. Storybook allows developers and designers to build, test, and document components in isolation from the main application.

## Quick Start

### Running Storybook

```bash
# From workspace root
pnpm --filter @cloudflare/kumo storybook

# Or from packages/kumo directory
pnpm storybook
```

Storybook will start at `http://localhost:6006` with hot module replacement (HMR) enabled.

### Building Storybook

To create a static build of Storybook for deployment or review:

```bash
# From workspace root
pnpm --filter @cloudflare/kumo build:storybook

# Or from packages/kumo directory
pnpm build:storybook
```

This generates a static site in `storybook-static/` that can be deployed to any web server.

## Why Storybook?

### For Developers

- **Isolated Development**: Build components without running the full application
- **Fast Feedback Loop**: Instant HMR updates as you code
- **Component States**: Test all component variations and edge cases in one place
- **Interactive Testing**: Experiment with props using Storybook's controls
- **Documentation**: Auto-generated props documentation from TypeScript types
- **Visual Testing**: See all components and their variants at a glance

### For Designers

- **Live Component Library**: Browse all available components and their variants
- **Interactive Playground**: Adjust props and see changes in real-time
- **Copy Examples**: Get working code examples for any component state
- **Design Validation**: Verify implementations match design specifications
- **Accessibility Review**: Test keyboard navigation and screen reader behavior
- **Responsive Testing**: View components at different viewport sizes

### For Teams

- **Single Source of Truth**: Centralized component documentation
- **Collaboration**: Designers and developers work from the same tool
- **Quality Assurance**: Catch visual regressions and edge cases early
- **Onboarding**: New team members can explore components quickly
- **Design System Maintenance**: Keep components consistent and documented

## Project Structure

### Storybook Configuration

```
packages/kumo/.storybook/
├── main.ts           # Configures story location patterns, addons, and Vite integration with Tailwind CSS
├── preview.ts        # Global decorators and parameters for controls and other addons
└── preview.css       # Global styles for Storybook, imports Kumo styles needed for component rendering
```

### Story Files

Stories live alongside their components:

```
src/
├── components/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.stories.tsx    # Button stories
│   │   └── index.ts
│   └── ...
├── blocks/
│   ├── breadcrumbs/
│   │   ├── breadcrumbs.tsx
│   │   ├── breadcrumbs.stories.tsx  # Breadcrumbs stories
│   │   └── index.ts
│   └── ...
└── layouts/
    ├── resource-list/
    │   ├── resource-list.tsx
    │   ├── resource-list.stories.tsx  # Layout stories
    │   └── index.ts
    └── ...
```

## Writing Stories

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};
```

### Story Organization

Stories are organized hierarchically in the Storybook sidebar:

- **Components/** - Base UI components (Button, Input, Dialog, etc.)
- **Blocks/** - Higher-level composed components (Breadcrumbs, PageHeader, Empty, etc.)
- **Layouts/** - Page-level layout components (ResourceListPage, etc.)

### Naming Conventions

- **File Name**: `{component-name}.stories.tsx` (kebab-case)
- **Story Title**: `Components/{ComponentName}`, `Blocks/{BlockName}`, or `Layouts/{LayoutName}` (PascalCase)
- **Story Exports**: Use descriptive names: `Default`, `Primary`, `WithIcon`, `Loading`, etc.

### Story Best Practices

#### 1. Show All Component States

```typescript
export const Default: Story = {
  args: { children: 'Default Button' },
};

export const Loading: Story = {
  args: { children: 'Loading...', disabled: true },
};

export const WithIcon: Story = {
  args: {
    children: 'Save',
    icon: <FloppyDisk size={16} />,
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};
```

#### 2. Use Layout Parameters

```typescript
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered", // 'centered', 'fullscreen', or 'padded'
  },
} satisfies Meta<typeof Button>;
```

- **centered**: For small components (buttons, badges, inputs)
- **fullscreen**: For layouts and page-level components
- **padded**: Default, adds padding around the component

#### 3. Enable Auto-Documentation

```typescript
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // Generates docs from TypeScript types
} satisfies Meta<typeof Button>;
```

#### 4. Provide Realistic Examples

Use realistic content and context:

```typescript
export const Complete: Story = {
  args: {
    title: 'KV Namespaces',
    description: 'Store key-value data globally with low-latency access',
    icon: <Database size={32} />,
    usage: (
      <Surface className="p-4">
        <h3 className="font-semibold mb-2">Usage Example</h3>
        <Code lang="ts" code={`// Read from KV
const value = await KV.get('key');

// Write to KV
await KV.put('key', 'value');`} />
      </Surface>
    ),
    children: (
      <Surface className="p-6">
        <p>Your KV namespaces will appear here</p>
      </Surface>
    ),
  },
};
```

## Development Workflow

### As a Live IDE

Storybook serves as your primary development environment:

1. **Start Storybook**: `pnpm storybook`
2. **Create or Open Story**: Navigate to your component's story in the sidebar
3. **Develop Component**: Edit component file and see instant updates
4. **Test Variations**: Use story args to test different props and states
5. **Iterate Quickly**: No need to navigate through the full app

### Parallel Development

Run Storybook alongside other development tools:

```bash
# Terminal 1: Storybook for component development
pnpm --filter @cloudflare/kumo storybook

# Terminal 2: Tests in watch mode
pnpm --filter @cloudflare/kumo test

# Terminal 3: Documentation site (if needed)
pnpm --filter @cloudflare/kumo-docs dev
```

### Component Development Cycle

1. **Create Component**: Use scaffolding tool: `pnpm new-component`
2. **Create Story**: Create `{component}.stories.tsx` file
3. **Develop in Storybook**: Build component with live feedback
4. **Add Story Variants**: Create stories for all component states
5. **Test**: Write tests in `{component}.test.tsx`
6. **Document**: Ensure props are well-typed for auto-docs

## Tips and Tricks

### Quick Navigation

- **Keyboard Shortcut**: Press `/` in Storybook to open search
- **Sidebar Organization**: Stories are grouped by category for easy browsing
- **Fullscreen Mode**: Press `F` to toggle fullscreen mode

### Using Controls

The Controls addon (enabled by default) allows you to:

- Adjust component props in real-time
- Test edge cases without writing new stories
- Generate shareable URLs with specific prop values

### Viewport Testing

- Click the viewport icon in the toolbar to test responsive designs
- Test components at mobile, tablet, and desktop sizes

### Accessibility Testing

- Use keyboard navigation to test focus management
- Check color contrast and ARIA attributes
- Test with screen readers

### Performance Tips

- Stories load only when viewed (lazy loading)
- Use `parameters.layout` appropriately to optimize rendering
- Keep story args simple and focused

## Adding Stories to New Components

When creating a new component, block, or layout:

1. **Create the component**: `pnpm new-component` / `pnpm new-block` / `pnpm new-layout`
2. **Create story file**: `src/{type}/{name}/{name}.stories.tsx`
3. **Add basic stories**: Start with `Default` story, add variants as needed
4. **Test in Storybook**: Run `pnpm storybook` and verify stories appear

### Story Template

```typescript
import type { Meta, StoryObj } from "@storybook/react-vite";
import { YourComponent } from "./your-component";

const meta = {
  title: "Components/YourComponent",
  component: YourComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};

// Add more story variants
export const AnotherVariant: Story = {
  args: {
    // Different props configuration
  },
};
```

## Troubleshooting

### Storybook Won't Start

**Problem**: Port 6006 already in use

```bash
# Find and kill the process using port 6006
lsof -ti:6006 | xargs kill -9

# Or specify a different port
pnpm storybook --port 6007
```

### Component Not Rendering

**Problem**: Missing styles or dependencies

- Ensure `preview.css` imports necessary styles
- Check that peer dependencies are installed
- Verify Tailwind CSS is configured in `main.ts`

### Story Not Appearing

**Problem**: Story file not detected

- Verify file matches pattern: `**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Check file is in `src/` directory
- Restart Storybook to pick up new files

### Type Errors in Stories

**Problem**: TypeScript errors in story files

- Ensure story structure matches `Meta` and `StoryObj` types
- Verify component props match `args` in stories
- Check that imports are correct

## Resources

- **Storybook Documentation**: https://storybook.js.org/docs/react/get-started/introduction
- **Writing Stories**: https://storybook.js.org/docs/react/writing-stories/introduction
- **Component Story Format (CSF)**: https://storybook.js.org/docs/react/api/csf
- **TypeScript Support**: https://storybook.js.org/docs/react/configure/typescript

## Contributing

When contributing to Kumo:

1. **Always include stories** for new components, blocks, and layouts
2. **Update existing stories** when modifying component APIs
3. **Test stories locally** before submitting PRs
4. **Follow naming conventions** for consistency
5. **Provide realistic examples** that showcase component capabilities
6. **Document edge cases** with dedicated stories

Stories are living documentation—they help maintainers understand components and help users learn how to use them effectively.
