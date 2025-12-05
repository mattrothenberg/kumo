import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagedProfileApp } from "./managed-profile";
import {
  setupManagedProfileMocks,
  type ManagedProfileOverrides,
} from "./managed-profile-mocks";

type DashMockOverrides = ManagedProfileOverrides;

function setupDashMocks(overrides?: DashMockOverrides) {
  setupManagedProfileMocks(overrides);
}

const meta: Meta<typeof ManagedProfileApp> = {
  title: "Pages/Managed Profile",
  component: ManagedProfileApp,
  decorators: [
    (Story, context) => {
      setupDashMocks(
        context.parameters?.dashMocks as DashMockOverrides | undefined,
      );
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ManagedProfileApp>;

export const ProfileManagedProfilePreferences: Story = {
  name: "↳ profile/managed-profile/preferences",
  args: { view: "profile/managed-profile/preferences" },
  parameters: { dashMocks: { sso: true } },
};

export const SingleSignOn: Story = {
  args: {
    view: "preferences-sso",
  },
};

export const UpdateEmail: Story = {
  args: { view: "preferences-email-update" },
};

export const PendingEmail: Story = {
  args: {
    view: "preferences-email-pending",
  },
  parameters: {
    dashMocks: {
      newEmailRequested: "new-user@example.com",
    },
  },
};

export const DeleteEmail1: Story = {
  args: {
    view: "preferences-email-delete-1",
  },
};

export const DeleteEmail2: Story = {
  args: {
    view: "preferences-email-delete-2",
  },
};

export const DeleteEmail3: Story = {
  args: {
    view: "preferences-email-delete-3",
  },
};

export const ProfileManagedProfileNotifications: Story = {
  name: "↳ profile/managed-profile/notifications",
  args: { view: "profile/managed-profile/notifications" },
};

export const ProfileManagedProfileAuthentication: Story = {
  name: "↳ profile/managed-profile/authentication",
  args: { view: "profile/managed-profile/authentication" },
};
