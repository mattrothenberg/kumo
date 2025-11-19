import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DateRangePicker from './calendar';

const meta = {
	title: 'Components/Calendar',
	component: DateRangePicker,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [startDate, setStartDate] = useState<Date | null>(null);
		const [endDate, setEndDate] = useState<Date | null>(null);
		
		return (
			<div>
				<DateRangePicker
					onStartDateChange={setStartDate}
					onEndDateChange={setEndDate}
				/>
				{startDate && endDate && (
					<div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
						Selected range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
					</div>
				)}
			</div>
		);
	},
};
