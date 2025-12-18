import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  LinkButton,
  RefreshButton,
  KUMO_BUTTON_VARIANTS,
} from "./button";
import { PlusIcon } from "@phosphor-icons/react";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Components/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BUTTON_VARIANTS.variant),
        "variant",
        <Button>Button</Button>,
      )}
    </>
  ),
};

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BUTTON_VARIANTS.size),
        "size",
        <Button>Button</Button>,
      )}
    </>
  ),
};

export const Shapes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BUTTON_VARIANTS.shape),
        "shape",
        <Button icon={PlusIcon} />,
      )}
    </>
  ),
};

export const Disabled: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_BUTTON_VARIANTS.variant),
        "variant",
        <Button disabled>Button</Button>,
      )}
    </>
  ),
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    icon: PlusIcon,
    children: "Add Item",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    loading: true,
    children: "Loading...",
  },
};

export const Refresh: Story = {
  render: () => (
    <div className="flex gap-2">
      <RefreshButton />
      <RefreshButton loading />
    </div>
  ),
};

export const Link: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div className="flex gap-2">
      <LinkButton href="#" variant="ghost">
        Link Button
      </LinkButton>
      <LinkButton href="#" variant="primary" icon={PlusIcon}>
        Link with Icon
      </LinkButton>
    </div>
  ),
};
