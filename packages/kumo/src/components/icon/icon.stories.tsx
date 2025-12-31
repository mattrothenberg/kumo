import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, KUMO_ICON_VARIANTS } from "./icon";
import { ALL_ICON_GLYPHS } from "./icon.types";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_ICON_VARIANTS.size),
        "size",
        <Icon glyph="ph-check" />,
      )}
    </>
  ),
};

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

export const WithTitle: Story = {
  args: {
    glyph: "ph-check",
    title: "Success",
  },
};

export const WithCustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon glyph="ph-check" className="text-green" size="lg" />
      <Icon glyph="ph-warning" className="text-alert" size="lg" />
      <Icon glyph="ph-x" className="text-error" size="lg" />
      <Icon glyph="ph-info" className="text-info" size="lg" />
      <Icon glyph="ph-check" className="text-brand" size="lg" />
      <Icon glyph="ph-gear" className="text-label" size="lg" />
      <Icon
        glyph="cf-cloudflare-workers-outline"
        className="text-green"
        size="lg"
      />
      <Icon
        glyph="cf-security-shield-protection-1-outline"
        className="text-alert"
        size="lg"
      />
      <Icon
        glyph="cf-cloudflare-pages-outline"
        className="text-error"
        size="lg"
      />
      <Icon
        glyph="cf-cloudflare-zero-trust-outline"
        className="text-info"
        size="lg"
      />
      <Icon glyph="cf-r2-outline" className="text-brand" size="lg" />
      <Icon glyph="cf-d1-outline" className="text-label" size="lg" />
    </div>
  ),
};
