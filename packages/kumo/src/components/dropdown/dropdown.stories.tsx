import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu, KUMO_DROPDOWN_VARIANTS } from "./dropdown";
import { Button } from "../button/button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Dropdown",
  component: DropdownMenu,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button>Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Item 1</DropdownMenu.Item>
        <DropdownMenu.Item>Item 2</DropdownMenu.Item>
        <DropdownMenu.Item>Item 3</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const ItemVariants: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>Open Menu</Button>} />
      <DropdownMenu.Content>
        {Object.keys(KUMO_DROPDOWN_VARIANTS.variant).map((variant) => (
          <DropdownMenu.Item
            key={variant}
            variant={variant as keyof typeof KUMO_DROPDOWN_VARIANTS.variant}
          >
            {variant} item
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
