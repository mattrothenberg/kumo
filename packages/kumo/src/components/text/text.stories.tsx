import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './text';

const meta = {
	title: 'Components/Text',
	component: Text,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'This is default text',
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-2">
			<Text>Default text</Text>
			<Text className="text-sm">Small text</Text>
			<Text className="text-lg">Large text</Text>
			<Text className="font-bold">Bold text</Text>
			<Text className="text-blue-600">Colored text</Text>
		</div>
	),
};
