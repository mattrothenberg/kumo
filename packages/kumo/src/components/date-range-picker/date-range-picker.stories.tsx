import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DateRangePicker,
  KUMO_DATE_RANGE_PICKER_VARIANTS,
} from "./date-range-picker";
import { propTester } from "../../utils/prop-tester";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper for stories that need state
const InteractiveDateRangePicker = (
  props: React.ComponentProps<typeof DateRangePicker>,
) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div>
      <DateRangePicker
        {...props}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      {startDate && endDate && (
        <div className="mt-4 text-sm text-label">
          Selected range: {startDate.toLocaleDateString()} -{" "}
          {endDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveDateRangePicker {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_DATE_RANGE_PICKER_VARIANTS.size),
        "size",
        <DateRangePicker
          onStartDateChange={() => {}}
          onEndDateChange={() => {}}
        />,
      )}
    </>
  ),
};

export const Variants: Story = {
  render: () => (
    <>
      {propTester(
        Object.keys(KUMO_DATE_RANGE_PICKER_VARIANTS.variant),
        "variant",
        <DateRangePicker
          onStartDateChange={() => {}}
          onEndDateChange={() => {}}
        />,
      )}
    </>
  ),
};

export const CustomTimezone: Story = {
  args: {
    timezone: "UTC (GMT+0)",
  },
  render: (args) => <InteractiveDateRangePicker {...args} />,
};
