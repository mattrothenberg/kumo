import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActiveSessionsApp } from "./active-sessions";
import {
  setupActiveSessionsMocks,
  type ActiveSessionsOverrides,
} from "./active-sessions-mocks";

type DashMockOverrides = ActiveSessionsOverrides;

function setupDashMocks(overrides?: DashMockOverrides) {
  setupActiveSessionsMocks(overrides);
}

const meta: Meta<typeof ActiveSessionsApp> = {
  title: "Pages/Active Sessions",
  component: ActiveSessionsApp,
  parameters: {
    layout: "fullscreen",
  },
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
type Story = StoryObj<typeof ActiveSessionsApp>;

export const ProfileSessions: Story = {
  name: "↳ profile/sessions",
  args: { view: "profile/sessions" },
};
