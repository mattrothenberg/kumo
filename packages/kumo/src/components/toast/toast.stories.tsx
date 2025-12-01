import type { Meta, StoryObj } from "@storybook/react";
import { Toasty } from "./toast";
import { Toast } from "@base-ui-components/react/toast";
import { Button } from "../button/button";

const meta = {
  title: "Components/Toast",
  component: Toasty,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toasty>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastTriggerButton() {
  const toastManager = Toast.useToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: "Toast created",
          description: "This is a toast notification.",
        })
      }
    >
      Give me a toast
    </Button>
  );
}

export const Default: Story = {
  args: {
    children: <ToastTriggerButton />,
  },
  render: (args) => <Toasty {...args} />,
};
