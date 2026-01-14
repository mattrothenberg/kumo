// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "./integrations/pagefind";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getBuildInfo() {
  // Read version from the main kumo package, not kumo-docs-astro
  const kumoPkg = JSON.parse(
    readFileSync(resolve(__dirname, "../kumo/package.json"), "utf-8"),
  );

  let commitHash = "unknown";
  let commitDate = "unknown";
  let branch = "unknown";

  try {
    commitHash = execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
    }).trim();
    commitDate = execSync("git log -1 --format=%cI", {
      encoding: "utf-8",
    }).trim();
    branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
    }).trim();
  } catch (error) {
    console.warn(
      "[kumo-docs-astro] Git info unavailable during build:",
      error instanceof Error ? error.message : error,
    );
    console.warn(
      "[kumo-docs-astro] This may happen with shallow clones. Set GIT_DEPTH=0 or fetch-depth: 0 in CI.",
    );
  }

  return {
    version: kumoPkg.version,
    commitHash,
    commitDate,
    branch,
    buildDate: new Date().toISOString(),
  };
}

const buildInfo = getBuildInfo();

// https://astro.build/config
export default defineConfig({
  integrations: [react(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __BUILD_VERSION__: JSON.stringify(buildInfo.version),
      __BUILD_COMMIT__: JSON.stringify(buildInfo.commitHash),
      __BUILD_COMMIT_DATE__: JSON.stringify(buildInfo.commitDate),
      __BUILD_BRANCH__: JSON.stringify(buildInfo.branch),
      __BUILD_DATE__: JSON.stringify(buildInfo.buildDate),
    },
  },
});
