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
  tags: ["autodocs"],
} satisfies Meta<typeof MenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultMenuBar() {
  const [active, setActive] = useState<string>("home");

  return (
    <MenuBar
      isActive={active}
      options={[
        {
          icon: <HouseIcon />,
          id: "home",
          isActive: active,
          onClick: () => setActive("home"),
          tooltip: "Home",
        },
        {
          icon: <MagnifyingGlassIcon />,
          id: "search",
          isActive: active,
          onClick: () => setActive("search"),
          tooltip: "Search",
        },
        {
          icon: <BellIcon />,
          id: "notifications",
          isActive: active,
          onClick: () => setActive("notifications"),
          tooltip: "Notifications",
        },
        {
          icon: <GearIcon />,
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
