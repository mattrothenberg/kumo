import type { Meta, StoryObj } from "@storybook/react";
import { Empty, KUMO_EMPTY_VARIANTS } from "./empty";
import {
  DatabaseIcon,
  FolderOpenIcon,
  CloudSlashIcon,
} from "@phosphor-icons/react";
import { Button } from "../../components/button";
import { propTester } from "../../utils/prop-tester";

const meta = {
  title: "Blocks/Empty",
  component: Empty,
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <DatabaseIcon size={48} className="text-disabled" />,
    title: "No data available",
    description:
      "There is no data to display at the moment. Try creating a new item to get started.",
  },
};

export const Sizes: Story = {
  args: {
    icon: <DatabaseIcon size={48} className="text-disabled" />,
    title: "No data available",
    description:
      "There is no data to display at the moment. Try creating a new item to get started.",
  },
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_EMPTY_VARIANTS.size),
        "size",
        <Empty
          icon={<DatabaseIcon size={48} className="text-disabled" />}
          title="No data available"
          description="There is no data to display at the moment."
        />,
      )}
    </>
  ),
};

export const WithCommandLine: Story = {
  args: {
    icon: <FolderOpenIcon size={48} className="text-disabled" />,
    title: "No projects found",
    description:
      "Get started by creating your first project using the command below.",
    commandLine: "npm create kumo-project",
  },
};

export const WithLongCommandLine: Story = {
  args: {
    icon: <FolderOpenIcon size={48} className="text-disabled" />,
    title: "Long command example",
    description:
      "Demonstrates how long commands scroll horizontally inside the command line area.",
    commandLine:
      "npx create-app --template edge-worker --name my-very-long-project-name-with-extra-flags --region us-west-2",
  },
};

export const WithCustomContent: Story = {
  args: {
    icon: <CloudSlashIcon size={48} className="text-disabled" />,
    title: "No connection",
    description:
      "Unable to connect to the server. Please check your connection and try again.",
    contents: (
      <div className="flex gap-2">
        <Button variant="primary">Retry</Button>
        <Button variant="outline">Go Back</Button>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    title: "Nothing here",
  },
};
