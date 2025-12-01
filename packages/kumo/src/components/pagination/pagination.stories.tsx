import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    perPage: 10,
    totalCount: 100,
    setPage: () => {},
  },
};

export const MiddlePage: Story = {
  args: {
    page: 5,
    perPage: 10,
    totalCount: 100,
    setPage: () => {},
  },
};
