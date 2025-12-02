import { useState, useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { ModeToggle } from "./mode-toggle";
import { ThemeSelect, type Theme } from "./theme-select";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "todo",
      // test: "error",
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Agents",
          "Design-Tokens",
          "Components",
          "Blocks",
          "Layouts",
          "Pages",
        ],
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
      if (
        context.title.startsWith("Pages/") ||
        context.title.startsWith("Agents/") ||
        context.title.startsWith("Design-Tokens/") ||
        context.title.startsWith("Components/Combobox") ||
        context.title.startsWith("Components/Dialog") ||
        context.title.startsWith("Components/Dropdown") ||
        context.title.startsWith("Components/Select") ||
        context.title.startsWith("Components/Toast") ||
        context.title.startsWith("Components/Tooltip")
      ) {
        return <PageDecorator Story={Story} />;
      }

      return (
        <div className="flex" data-theme="kumo">
          <div className="flex-1 items-center border bg-surface p-6">
            <div className="mb-2 font-sans text-sm leading-5 tracking-wide text-muted-2 uppercase">
              Light
            </div>
            <div className="flex flex-col flex-wrap gap-4">
              <Story />
            </div>
          </div>
          <div data-mode="dark" className="flex-1 items-center bg-surface p-6">
            <div className="mb-2 font-sans text-sm leading-5 tracking-wide text-muted-2 uppercase">
              Dark
            </div>
            <div className="flex flex-col flex-wrap gap-4">
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
  const [theme, setTheme] = useState<Theme>("kumo");

  // Apply data-mode and bg-surface to document.body so portaled elements (modals, dialogs) inherit the mode
  // and the entire canvas background is styled
  useEffect(() => {
    document.body.classList.add("bg-surface");
    if (isDark) {
      document.body.setAttribute("data-mode", "dark");
    } else {
      document.body.removeAttribute("data-mode");
    }
    return () => {
      document.body.removeAttribute("data-mode");
      document.body.classList.remove("bg-surface");
    };
  }, [isDark]);

  // Apply data-theme to document.body so portaled elements inherit the theme
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    return () => {
      document.body.removeAttribute("data-theme");
    };
  }, [theme]);

  return (
    <div
      data-theme={theme}
      data-mode={isDark ? "dark" : "light"}
      className="bg-surface"
    >
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-surface-secondary p-2 shadow-md">
        <ThemeSelect theme={theme} onThemeChange={setTheme} />
        <ModeToggle
          isDark={isDark}
          onClick={() => setIsDark(!isDark)}
          className="text-secondary"
        />
      </div>
      <Story />
    </div>
  );
}

export default preview;
