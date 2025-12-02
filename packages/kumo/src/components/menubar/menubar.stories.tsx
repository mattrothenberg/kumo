import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MenuBar } from "./menubar";
import {
  HouseIcon,
  MagnifyingGlassIcon,
  BellIcon,
  GearIcon,
} from "@phosphor-icons/react";

const meta = {
  title: "Components/Menubar",
  component: MenuBar,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultMenuBar() {
  const [active, setActive] = useState<string>("home");

  return (
    <MenuBar
      isActive={active}
      optionIds
      options={[
        {
          icon: <HouseIcon className="fill-surface-inverse" />,
          id: "home",
          isActive: active,
          onClick: () => setActive("home"),
          tooltip: "Home",
        },
        {
          icon: <MagnifyingGlassIcon className="fill-surface-inverse" />,
          id: "search",
          isActive: active,
          onClick: () => setActive("search"),
          tooltip: "Search",
        },
        {
          icon: <BellIcon className="fill-surface-inverse" />,
          id: "notifications",
          isActive: active,
          onClick: () => setActive("notifications"),
          tooltip: "Notifications",
        },
        {
          icon: <GearIcon className="fill-surface-inverse" />,
          id: "settings",
          isActive: active,
          onClick: () => setActive("settings"),
          tooltip: "Settings",
        },
      ]}
    />
  );
}

export const Default: Story = {
  args: {
    isActive: "home",
    options: [],
  },
  render: () => <DefaultMenuBar />,
};
