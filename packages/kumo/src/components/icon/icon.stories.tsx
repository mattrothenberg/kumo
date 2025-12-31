import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, KUMO_ICON_VARIANTS } from "./icon";
import { ALL_ICON_GLYPHS } from "./icon.types";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    glyph: {
      control: "select",
      options: ALL_ICON_GLYPHS,
    },
    size: {
      control: "select",
      options: Object.keys(KUMO_ICON_VARIANTS.size),
    },
    title: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story with controls for interactive testing
 */
export const Default: Story = {
  args: {
    glyph: "ph-check",
    size: "base",
  },
};

/**
 * All available icons displayed in a grid
 */
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4">
      {ALL_ICON_GLYPHS.map((glyph) => (
        <div key={glyph} className="flex flex-col items-center gap-2">
          <Icon glyph={glyph} size="lg" />
          <span className="text-xs text-muted">{glyph}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * All size variants: xs (12px), sm (16px), base (20px), lg (24px), xl (32px)
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" size="xs" />
        <span className="text-xs text-muted">xs (12px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" size="sm" />
        <span className="text-xs text-muted">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" size="base" />
        <span className="text-xs text-muted">base (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" size="lg" />
        <span className="text-xs text-muted">lg (24px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" size="xl" />
        <span className="text-xs text-muted">xl (32px)</span>
      </div>
    </div>
  ),
};

/**
 * Accessible icon with title attribute for screen readers
 */
export const WithTitle: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" title="Success" />
        <span className="text-xs text-muted">With title (accessible)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-warning" title="Warning" />
        <span className="text-xs text-muted">Warning icon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-info" title="Information" />
        <span className="text-xs text-muted">Info icon</span>
      </div>
    </div>
  ),
};

/**
 * Custom colors using Kumo semantic text tokens.
 * Icons use fill-current which inherits from text color.
 */
export const WithCustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" className="text-green" size="lg" />
        <span className="text-xs text-muted">text-green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-warning" className="text-alert" size="lg" />
        <span className="text-xs text-muted">text-alert</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-x" className="text-error" size="lg" />
        <span className="text-xs text-muted">text-error</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-info" className="text-info" size="lg" />
        <span className="text-xs text-muted">text-info</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-check" className="text-brand" size="lg" />
        <span className="text-xs text-muted">text-brand</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon glyph="ph-gear" className="text-label" size="lg" />
        <span className="text-xs text-muted">text-label</span>
      </div>
    </div>
  ),
};
