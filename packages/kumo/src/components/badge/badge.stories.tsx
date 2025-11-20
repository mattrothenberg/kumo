import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
	title: 'Components/Badge',
	component: Badge,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'destructive', 'outline'],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Badge',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Badge',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Badge',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Badge',
	},
};

export const AllVariants: Story = {
	args: {
		children: 'Badge',
	},
	render: () => (
		<div className="flex gap-2">
			<Badge variant="primary">Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	),
};
