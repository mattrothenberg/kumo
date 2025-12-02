import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  LinkButton,
  RefreshButton,
  KUMO_BUTTON_VARIANTS,
  KUMO_BUTTON_DEFAULT_VARIANTS,
} from "./button";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(KUMO_BUTTON_VARIANTS.variant),
    },
    size: {
      control: "select",
      options: Object.keys(KUMO_BUTTON_VARIANTS.size),
    },
    shape: {
      control: "select",
      options: Object.keys(KUMO_BUTTON_VARIANTS.shape),
    },
  },
  args: {
    variant: KUMO_BUTTON_DEFAULT_VARIANTS.variant,
    size: KUMO_BUTTON_DEFAULT_VARIANTS.size,
    shape: KUMO_BUTTON_DEFAULT_VARIANTS.shape,
    children: "Button",
  },
};

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
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled",
  },
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
