import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In CI, use the deployed Storybook URL for test failure links
const storybookUrl =
  process.env.CI === "true"
    ? "https://kumo-storybook.pages.dev"
    : "http://localhost:6006";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@cloudflare/kumo": resolve(__dirname, "src/index.ts"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}", "**/index.ts"],
    },
    projects: [
      // Unit tests
      {
        resolve: {
          alias: {
            "@": resolve(__dirname, "src"),
            "@cloudflare/kumo": resolve(__dirname, "src/index.ts"),
          },
        },
        test: {
          name: "unit",
          environment: "happy-dom",
          setupFiles: ["./tests/setup.ts"],
          globals: true,
        },
      },
      // Storybook tests (component + a11y)
      {
        plugins: [
          storybookTest({
            configDir: join(__dirname, ".storybook"),
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
    ],
  },
});
