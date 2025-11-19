import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './breadcrumbs';
import { House, Folder, File } from '@phosphor-icons/react';

const meta = {
  title: 'Blocks/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'Current Project' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', to: '/', icon: <House size={16} /> },
      { label: 'Documents', to: '/documents', icon: <Folder size={16} /> },
      { label: 'File.txt', icon: <File size={16} /> },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'Web Applications', to: '/projects/web' },
      { label: 'Dashboard', to: '/projects/web/dashboard' },
      { label: 'Settings' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      { label: 'Home' },
    ],
  },
};
