import { defineWorkspace } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// In CI, use the deployed Storybook URL for test failure links
const storybookUrl =
  process.env.CI === "true"
    ? "https://kumo-storybook.pages.dev"
    : "http://localhost:6006";

export default defineWorkspace([
  // Existing unit tests
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
    },
  },
  // Storybook tests (component + a11y)
  {
    extends: "./vitest.config.ts",
    plugins: [
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
        storybookScript: "pnpm storybook --ci",
        storybookUrl,
      }),
    ],
    test: {
      name: "storybook",
      browser: {
        enabled: true,
        provider: "playwright",
        headless: true,
        name: "chromium",
      },
      setupFiles: ["./.storybook/vitest.setup.ts"],
    },
  },
]);
