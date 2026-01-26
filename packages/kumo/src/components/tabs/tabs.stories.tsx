import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs = [
  { value: "tab1", label: "Tab 1" },
  { value: "tab2", label: "Tab 2" },
  { value: "tab3", label: "Tab 3" },
];

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    selectedValue: "tab1",
  },
};

export const Segmented: Story = {
  args: {
    tabs: defaultTabs,
    selectedValue: "tab1",
    variant: "segmented",
  },
};

export const Underline: Story = {
  args: {
    tabs: defaultTabs,
    selectedValue: "tab1",
    variant: "underline",
  },
};

export const UnderlineMany: Story = {
  args: {
    tabs: [
      { value: "overview", label: "Overview" },
      { value: "analytics", label: "Analytics" },
      { value: "reports", label: "Reports" },
      { value: "notifications", label: "Notifications" },
      { value: "settings", label: "Settings" },
      { value: "billing", label: "Billing" },
    ],
    selectedValue: "overview",
    variant: "underline",
  },
};

export const WithRenderProp: Story = {
  args: {
    tabs: [
      {
        value: "tab1",
        label: "Regular Tab",
      },
      {
        value: "tab2",
        label: "Custom Link",
        // oxlint-disable-next-line jsx-a11y/anchor-has-content
        render: (props) => <a {...props} href="#tab2" />,
      },
      {
        value: "tab3",
        label: "Another Link",
        // oxlint-disable-next-line jsx-a11y/anchor-has-content
        render: (props) => <a {...props} href="#tab3" />,
      },
    ],
    selectedValue: "tab1",
    variant: "segmented",
  },
};
