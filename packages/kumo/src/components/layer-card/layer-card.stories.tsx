import type { Meta, StoryObj } from '@storybook/react';
import { LayerCard } from './layer-card';

const meta = {
	title: 'Components/LayerCard',
	component: LayerCard,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof LayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Layer card content',
	},
};
