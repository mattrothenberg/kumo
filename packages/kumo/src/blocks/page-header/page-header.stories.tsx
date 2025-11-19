import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './page-header';
import { Button } from '../../components/button';
import { Plus } from '@phosphor-icons/react';

const meta = {
  title: 'Blocks/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'Current Project' },
    ],
  },
};

export const WithTabs: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Settings' },
    ],
    tabs: [
      { label: 'General', value: 'general' },
      { label: 'Security', value: 'security' },
      { label: 'Notifications', value: 'notifications' },
      { label: 'Billing', value: 'billing' },
    ],
    defaultTab: 'general',
  },
};

export const WithTabsAndActions: Story = {
  args: {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'My Project' },
    ],
    tabs: [
      { label: 'Overview', value: 'overview' },
      { label: 'Analytics', value: 'analytics' },
      { label: 'Settings', value: 'settings' },
    ],
    defaultTab: 'overview',
    children: (
      <>
        <Button variant="outline" size="sm">Export</Button>
        <Button variant="primary" size="sm">
          <Plus size={16} />
          New Item
        </Button>
      </>
    ),
  },
};
