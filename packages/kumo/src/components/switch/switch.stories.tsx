import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta = {
	title: 'Components/Switch',
	component: Switch,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Toggle switch',
	},
};

export const Checked: Story = {
	args: {
		label: 'Enabled',
		checked: true,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled',
		disabled: true,
	},
};

export const CheckedDisabled: Story = {
	args: {
		label: 'Enabled & Disabled',
		checked: true,
		disabled: true,
	},
};
