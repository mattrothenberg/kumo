import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

function getBuildInfo() {
  const pkg = JSON.parse(
    readFileSync(resolve(__dirname, "package.json"), "utf-8"),
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
      "[kumo-docs] Git info unavailable during build:",
      error instanceof Error ? error.message : error,
    );
    console.warn(
      "[kumo-docs] This may happen with shallow clones. Set GIT_DEPTH=0 or fetch-depth: 0 in CI.",
    );
  }

  return {
    version: pkg.version,
    commitHash,
    commitDate,
    branch,
    buildDate: new Date().toISOString(),
  };
}

const buildInfo = getBuildInfo();

export default defineConfig({
  define: {
    __BUILD_VERSION__: JSON.stringify(buildInfo.version),
    __BUILD_COMMIT__: JSON.stringify(buildInfo.commitHash),
    __BUILD_COMMIT_DATE__: JSON.stringify(buildInfo.commitDate),
    __BUILD_BRANCH__: JSON.stringify(buildInfo.branch),
    __BUILD_DATE__: JSON.stringify(buildInfo.buildDate),
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          sandpack: ["@codesandbox/sandpack-react"],
          phosphor: ["@phosphor-icons/react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "@phosphor-icons/react"],
  },
  ssr: {
    noExternal: ["@codesandbox/sandpack-react"],
  },
});
