import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';

const meta = {
	title: 'Components/Pagination',
	component: Pagination,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		currentPage: 1,
		totalPages: 10,
	},
};

export const MiddlePage: Story = {
	args: {
		currentPage: 5,
		totalPages: 10,
	},
};
