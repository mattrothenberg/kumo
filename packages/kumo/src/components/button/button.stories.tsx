import type { Meta, StoryObj } from '@storybook/react';
import { Button, LinkButton, RefreshButton } from './button';
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';

const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'destructive', 'outline'],
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'base', 'lg'],
		},
		shape: {
			control: 'select',
			options: ['base', 'square', 'circle'],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Button',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Button',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Button',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Button',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Button',
	},
};

export const WithIcon: Story = {
	args: {
		variant: 'primary',
		icon: PlusIcon,
		children: 'Add Item',
	},
};

export const Loading: Story = {
	args: {
		variant: 'primary',
		loading: true,
		children: 'Loading...',
	},
};

export const Disabled: Story = {
	args: {
		variant: 'primary',
		disabled: true,
		children: 'Disabled',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex gap-2 items-center">
			<Button size="xs">Extra Small</Button>
			<Button size="sm">Small</Button>
			<Button size="base">Base</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const Square: Story = {
	args: {
		variant: 'secondary',
		shape: 'square',
		icon: TrashIcon,
	},
};

export const Circle: Story = {
	args: {
		variant: 'secondary',
		shape: 'circle',
		icon: PlusIcon,
	},
};

export const Refresh: Story = {
	render: () => (
		<div className="flex gap-2">
			<RefreshButton />
			<RefreshButton loading />
		</div>
	),
};

export const Link: Story = {
	render: () => (
		<div className="flex gap-2">
			<LinkButton href="#" variant="ghost">
				Link Button
			</LinkButton>
			<LinkButton href="#" variant="primary" icon={PlusIcon}>
				Link with Icon
			</LinkButton>
		</div>
	),
};
