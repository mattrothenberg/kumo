import { defineWorkspace } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
