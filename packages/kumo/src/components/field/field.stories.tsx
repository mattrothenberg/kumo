import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './field';
import { Input } from '../input/input';

const meta = {
	title: 'Components/Field',
	component: Field,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Field label="Email" description="Enter your email address">
			<Input placeholder="email@example.com" />
		</Field>
	),
};

export const WithError: Story = {
	render: () => (
		<Field label="Email" error="Invalid email address">
			<Input placeholder="email@example.com" variant="error" />
		</Field>
	),
};
