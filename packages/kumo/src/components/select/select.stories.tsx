import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const meta = {
	title: 'Components/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Select defaultValue="1">
			<Select.Trigger placeholder="Select an option" />
			<Select.Content>
				<Select.Item value="1">Option 1</Select.Item>
				<Select.Item value="2">Option 2</Select.Item>
				<Select.Item value="3">Option 3</Select.Item>
			</Select.Content>
		</Select>
	),
};
