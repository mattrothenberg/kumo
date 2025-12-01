import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MenuBar } from "./menubar";
import { House, MagnifyingGlass, Bell, Gear } from "@phosphor-icons/react";

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

export const Default: Story = {
  args: {
    isActive: "home",
    options: [],
  },
  render: () => {
    const [active, setActive] = useState<string>("home");

    return (
      <MenuBar
        isActive={active}
        options={[
          {
            icon: <House />,
            id: "home",
            isActive: active,
            onClick: () => setActive("home"),
            tooltip: "Home",
          },
          {
            icon: <MagnifyingGlass />,
            id: "search",
            isActive: active,
            onClick: () => setActive("search"),
            tooltip: "Search",
          },
          {
            icon: <Bell />,
            id: "notifications",
            isActive: active,
            onClick: () => setActive("notifications"),
            tooltip: "Notifications",
          },
          {
            icon: <Gear />,
            id: "settings",
            isActive: active,
            onClick: () => setActive("settings"),
            tooltip: "Settings",
          },
        ]}
      />
    );
  },
};
