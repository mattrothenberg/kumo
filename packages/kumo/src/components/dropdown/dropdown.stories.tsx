import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./dropdown";
import { Button } from "../button/button";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Dropdown",
  component: DropdownMenu,
  tags: ["autodocs"],
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

export const DangerLinkItem: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger render={<Button>Open Menu</Button>} />
      <DropdownMenu.Content>
        <DropdownMenu.Item href="https://example.com" variant="danger">
          Delete worker
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
