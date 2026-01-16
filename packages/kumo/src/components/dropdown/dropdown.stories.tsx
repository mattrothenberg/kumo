import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu, KUMO_DROPDOWN_VARIANTS } from "./dropdown";
import { Button } from "../button/button";
import {
  TrashIcon,
  PencilIcon,
  CopyIcon,
  DownloadIcon,
  ShareIcon,
  WarningIcon,
  GearIcon,
  UserIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/Dropdown",
  component: DropdownMenu,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
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
  render: () => (
    <DropdownMenu defaultOpen>
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

export const Open: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Menu (Open)</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item icon={DownloadIcon}>Download</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DangerVariant: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button variant="destructive">Danger Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Destructive Actions</DropdownMenu.Label>
          <DropdownMenu.Item icon={WarningIcon} variant="danger">
            Remove from project
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={TrashIcon} variant="danger">
            Delete permanently
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon}>Copy</DropdownMenu.Item>
        <DropdownMenu.Item icon={ShareIcon}>Share</DropdownMenu.Item>
        <DropdownMenu.Item icon={DownloadIcon}>Download</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithLabelsAndGroups: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>User Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Account</DropdownMenu.Label>
          <DropdownMenu.Item icon={UserIcon}>Profile</DropdownMenu.Item>
          <DropdownMenu.Item icon={GearIcon}>Settings</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={SignOutIcon} variant="danger">
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>View Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Display</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem checked>
            Show sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={false}>
            Show line numbers
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked>
            Word wrap
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={CopyIcon}>
          Copy
          <DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={PencilIcon}>
          Edit
          <DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger">
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item icon={PencilIcon}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item icon={CopyIcon} disabled>
          Copy (disabled)
        </DropdownMenu.Item>
        <DropdownMenu.Item icon={ShareIcon}>Share</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={TrashIcon} variant="danger" disabled>
          Delete (disabled)
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const MixedVariants: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger>
        <Button>Resource Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item icon={PencilIcon}>Edit resource</DropdownMenu.Item>
          <DropdownMenu.Item icon={CopyIcon}>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item icon={DownloadIcon}>Export</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Label>Danger Zone</DropdownMenu.Label>
          <DropdownMenu.Item icon={WarningIcon} variant="danger">
            Disable resource
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={TrashIcon} variant="danger">
            Delete resource
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
