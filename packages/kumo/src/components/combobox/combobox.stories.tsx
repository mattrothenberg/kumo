import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './combobox';

const meta = {
	title: 'Components/Combobox',
	component: Combobox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
	{ id: '1', value: 'Option 1' },
	{ id: '2', value: 'Option 2' },
	{ id: '3', value: 'Option 3' },
];

export const Default: Story = {
	args: {
		items,
		placeholder: 'Select an option',
	},
};
