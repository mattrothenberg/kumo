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
		onClick: () => {},
		toggled: false,
	},
};

export const Checked: Story = {
	args: {
		label: 'Enabled',
		onClick: () => {},
		toggled: true,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled',
		onClick: () => {},
		toggled: false,
		disabled: true,
	},
};

export const CheckedDisabled: Story = {
	args: {
		label: 'Enabled & Disabled',
		onClick: () => {},
		toggled: true,
		disabled: true,
	},
};
