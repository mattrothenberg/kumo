import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
	title: 'Components/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['xs', 'sm', 'base', 'lg'],
		},
		variant: {
			control: 'select',
			options: ['default', 'error'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Email',
		hideLabel: false,
		placeholder: 'Enter your email',
	},
};

export const Error: Story = {
	args: {
		variant: 'error',
		placeholder: 'Invalid input',
		defaultValue: 'error@example.com',
	},
};

export const Disabled: Story = {
	args: {
		placeholder: 'Disabled input',
		disabled: true,
	},
};

export const Sizes: Story = {
	args: {
		placeholder: 'Enter text...',
	},
	render: () => (
		<div className="flex flex-col gap-2 w-64">
			<Input size="xs" placeholder="Extra small" />
			<Input size="sm" placeholder="Small" />
			<Input size="base" placeholder="Base" />
			<Input size="lg" placeholder="Large" />
		</div>
	),
};
