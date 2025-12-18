import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "./meter";

const meta = {
  title: "Components/Meter",
  component: Meter,
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Progress",
    value: 50,
    max: 100,
  },
};

export const DifferentValues: Story = {
  args: {
    label: "Progress",
    value: 50,
    max: 100,
  },
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Meter label="Low" value={25} max={100} />
      <Meter label="Medium" value={50} max={100} />
      <Meter label="High" value={75} max={100} />
      <Meter label="Complete" value={100} max={100} />
    </div>
  ),
};
