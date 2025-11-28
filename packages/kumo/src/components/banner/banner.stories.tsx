import type { Meta, StoryObj } from "@storybook/react";
import { Info, WarningIcon, XCircleIcon } from "@phosphor-icons/react";
import { Banner, BannerVariant } from "./banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        BannerVariant.DEFAULT,
        BannerVariant.ALERT,
        BannerVariant.ERROR,
      ],
      description: "The visual style variant of the banner",
    },
    text: {
      control: "text",
      description: "The message text displayed in the banner",
    },
    icon: {
      control: false,
      description: "Optional icon displayed before the text",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "This is a banner message",
  },
};

export const WithIcon: Story = {
  args: {
    text: "This is an informational message",
    icon: <Info size={16} />,
  },
};

export const Alert: Story = {
  args: {
    text: "Warning: Please review your settings",
    variant: BannerVariant.ALERT,
    icon: <WarningIcon size={16} />,
  },
};

export const Error: Story = {
  args: {
    text: "Error: Something went wrong",
    variant: BannerVariant.ERROR,
    icon: <XCircleIcon size={16} />,
  },
};

export const CustomClassName: Story = {
  args: {
    text: "Banner with custom max-width",
    className: "max-w-md",
  },
};
