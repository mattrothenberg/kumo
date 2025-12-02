import { useState, useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { ThemeToggle } from "./theme-toggle";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Design-Tokens", "Components", "Blocks", "Layouts", "Pages"],
      },
    },
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
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-kumo-surface p-6 text-kumo-surface">
              <Story />
            </div>
          </div>
        );
      }

      // Special-case: Pages render standalone with dark-mode class at root for proper modal/dialog support
      if (context.title.startsWith("Pages/")) {
        return <PageDecorator Story={Story} />;
      }

      return (
        <div className="flex flex-col">
          <div className="flex-1 items-center border bg-kumo-surface p-6">
            <div className="mb-2 font-sans text-sm leading-5 tracking-wide text-kumo-muted-2 uppercase">
              Light
            </div>
            <div className="flex gap-4">
              <Story />
            </div>
          </div>
          <div className="dark-mode flex-1 items-center bg-kumo-surface p-6">
            <div className="mb-2 font-sans text-sm leading-5 tracking-wide text-kumo-muted-2 uppercase">
              Dark
            </div>
            <div className="flex gap-4">
              <Story />
            </div>
          </div>
        </div>
      );
    },
  ],
};

function PageDecorator({ Story }: { Story: React.ComponentType }) {
  const [isDark, setIsDark] = useState(false);

  // Apply dark-mode class to document.body so portaled elements (modals, dialogs) inherit the theme
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDark]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-kumo-surface-secondary p-2 shadow-md">
        <ThemeToggle
          isDark={isDark}
          onClick={() => setIsDark(!isDark)}
          className="text-kumo-secondary"
        />
      </div>
      <Story />
    </>
  );
}

export default preview;
