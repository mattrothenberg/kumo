import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './dropdown';
import { Button } from '../button/button';

const meta = {
	title: 'Components/Dropdown',
	component: DropdownMenu,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenu.Trigger>
				<Button>Open Menu</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>Item 1</DropdownMenu.Item>
				<DropdownMenu.Item>Item 2</DropdownMenu.Item>
				<DropdownMenu.Item>Item 3</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu>
	),
};
