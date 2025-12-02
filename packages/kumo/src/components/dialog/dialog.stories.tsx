import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";
import { Button } from "../button/button";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog className="p-6">
        <Dialog.Title className="mb-2 text-xl font-semibold">
          Dialog Title
        </Dialog.Title>
        <Dialog.Description className="mb-4">
          This is a dialog description with some content.
        </Dialog.Description>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog>
    </Dialog.Root>
  ),
};
