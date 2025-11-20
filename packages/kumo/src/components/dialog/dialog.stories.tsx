import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './dialog';
import { Button } from '../button/button';

const meta: Meta<typeof Dialog> = {
	title: 'Components/Dialog',
	component: Dialog,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: null,
	},
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button>Open Dialog</Button>
			</Dialog.Trigger>
			<Dialog className="p-6">
				<Dialog.Title className="text-xl font-semibold mb-2">Dialog Title</Dialog.Title>
				<Dialog.Description className="mb-4">
					This is a dialog description with some content.
				</Dialog.Description>
				<Dialog.Close>
					<Button>Close</Button>
				</Dialog.Close>
			</Dialog>
		</Dialog.Root>
	),
};
