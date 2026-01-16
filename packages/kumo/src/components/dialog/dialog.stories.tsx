import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./dialog";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "base", "lg", "xl"],
      description: "Dialog width size",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "base",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog className="p-6" size={args.size}>
        <Dialog.Title className="mb-2 text-xl font-semibold">
          Dialog Title
        </Dialog.Title>
        <Dialog.Description className="mb-4 text-muted">
          This is a dialog description with some content.
        </Dialog.Description>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog>
    </Dialog.Root>
  ),
};

export const WithCloseIcon: Story = {
  args: {
    size: "base",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog className="p-6" size={args.size}>
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl font-semibold">
            Dialog Title
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          This is a dialog description with some content explaining the purpose
          of this dialog.
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />
          <Button variant="primary">Confirm</Button>
        </div>
      </Dialog>
    </Dialog.Root>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="destructive">Delete</Button>} />
      <Dialog className="p-6" size="sm">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-lg font-semibold">
            Delete Item
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Dialog.Description>
        <div className="flex justify-end gap-3">
          <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </div>
      </Dialog>
    </Dialog.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Dialog.Root>
        <Dialog.Trigger render={<Button>Small (sm)</Button>} />
        <Dialog className="p-6" size="sm">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              Small Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is a small dialog for simple confirmations.
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Base (default)</Button>} />
        <Dialog className="p-6" size="base">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Base Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is the default dialog size for most use cases.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Large (lg)</Button>} />
        <Dialog className="p-6" size="lg">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Large Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is a large dialog for complex content that needs more space.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger render={<Button>Extra Large (xl)</Button>} />
        <Dialog className="p-6" size="xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold">
              Extra Large Dialog
            </Dialog.Title>
            <Dialog.Close
              render={
                <button className="text-muted transition-colors hover:text-surface">
                  <Icon glyph="ph-x" size="sm" />
                </button>
              }
            />
          </div>
          <Dialog.Description className="mb-4 text-muted">
            This is an extra large dialog for detailed views and complex forms.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Confirm</Button>
          </div>
        </Dialog>
      </Dialog.Root>
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Edit Profile</Button>} />
      <Dialog className="p-6" size="base">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-xl font-semibold">
            Edit Profile
          </Dialog.Title>
          <Dialog.Close
            render={
              <button className="text-muted transition-colors hover:text-surface">
                <Icon glyph="ph-x" size="sm" />
              </button>
            }
          />
        </div>
        <Dialog.Description className="mb-4 text-muted">
          Update your profile information below.
        </Dialog.Description>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              aria-label="Name"
              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-label="Email"
              className="w-full rounded-lg bg-secondary px-3 py-2 ring ring-border focus:ring-active"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Button variant="primary">Save Changes</Button>
          </div>
        </form>
      </Dialog>
    </Dialog.Root>
  ),
};
