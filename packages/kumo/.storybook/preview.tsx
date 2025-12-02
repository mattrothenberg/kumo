import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Special-case: Tailwind color tokens should only render once (no light/dark split)
      if (context.title === "Design-Tokens/Colors") {
        return (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex-1 bg-kumo-surface p-6 text-kumo-surface">
              <Story />
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex-1 bg-kumo-surface p-6 text-kumo-surface">
            <div className="mb-2 text-[12px] font-medium">Light</div>
            <Story />
          </div>
          <div className="dark-mode flex-1 bg-kumo-surface p-6 text-kumo-surface">
            <div className="mb-2 text-[12px] font-medium">Dark</div>
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
