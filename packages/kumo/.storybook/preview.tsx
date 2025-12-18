import { useState, useEffect } from "react";
import type { Preview, StoryContext } from "@storybook/react-vite";
import { ModeToggle } from "./mode-toggle";
import { ThemeSelect, type Theme } from "./theme-select";
import { cn } from "../src/utils/cn";

import "./preview.css";

const SWITCHER_CLASSES =
  "fixed top-8 right-12 z-50 flex items-center gap-2 rounded-lg bg-surface-2-secondary p-2 shadow-md";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "todo",
      // test: "error",
    },
    layout: "fullscreen",
    options: {
      storySort: {
        method: "alphabetical",
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
    docs: {
      codePanel: true,
    },
  },
  decorators: [
    (Story, context) => {
      // Determine if this is a component that uses portals (needs mode toggle)
      const isPortalComponent =
        context.title.startsWith("Components/Combobox") ||
        context.title.startsWith("Components/Dialog") ||
        context.title.startsWith("Components/Dropdown") ||
        context.title.startsWith("Components/Select") ||
        context.title.startsWith("Components/Toast") ||
        context.title.startsWith("Components/Tooltip");

      // Pages, Agents, Design-Tokens, and portal components get the full PageDecorator
      if (
        context.title.startsWith("Pages/") ||
        context.title.startsWith("Agents/") ||
        context.title.startsWith("Design-Tokens/") ||
        isPortalComponent
      ) {
        return (
          <PageDecorator
            className={isPortalComponent ? "p-12" : ""}
            Story={Story}
          />
        );
      }

      // Other Components/* get side-by-side light/dark with theme switcher + code
      if (context.title.startsWith("Components/")) {
        return <DualModeDecorator Story={Story} context={context} />;
      }

      // Blocks, Layouts, and other categories get the full decorator with mode toggle
      return <PageDecorator Story={Story} />;
    },
  ],
};

interface DualModeDecoratorProps {
  Story: React.ComponentType;
  context: StoryContext;
}

function DualModeDecorator({ Story, context }: DualModeDecoratorProps) {
  const [theme, setTheme] = useState<Theme>("kumo");

  return (
    <div data-theme={theme}>
      <div className={SWITCHER_CLASSES}>
        <ThemeSelect theme={theme} onThemeChange={setTheme} />
      </div>
      <div className="flex">
        <div className="flex-1 items-center border bg-surface-2 p-12">
          <div className="mb-8 font-sans text-sm leading-5 tracking-wide text-muted-2 uppercase">
            Light
          </div>
          <div className="flex flex-col flex-wrap gap-4">
            <Story />
          </div>
        </div>
        <div data-mode="dark" className="flex-1 items-center bg-surface-2 p-12">
          <div className="mb-8 font-sans text-sm leading-5 tracking-wide text-muted-2 uppercase">
            Dark
          </div>
          <div className="flex flex-col flex-wrap gap-4">
            <Story />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageDecorator({
  Story,
  className,
}: {
  Story: React.ComponentType;
  className?: string;
}) {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<Theme>("kumo");

  // Apply data-mode and bg-surface-2 to document.body so portaled elements (modals, dialogs) inherit the mode
  // and the entire canvas background is styled
  useEffect(() => {
    document.body.classList.add("bg-surface-2");
    if (isDark) {
      document.body.setAttribute("data-mode", "dark");
    } else {
      document.body.removeAttribute("data-mode");
    }
    return () => {
      document.body.removeAttribute("data-mode");
      document.body.classList.remove("bg-surface-2");
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
      className={cn("bg-surface-2", className)}
    >
      <div className={SWITCHER_CLASSES}>
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
