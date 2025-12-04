import { watch } from "chokidar";
import { resolve } from "path";
import type { Plugin, ViteDevServer } from "vite";

/**
 * Watches for rebuild signals from dependencies and triggers
 * a controlled full reload to avoid module invalidation crashes
 */
export function watchRebuildPlugin(): Plugin {
  let server: ViteDevServer;
  let debounceTimer: NodeJS.Timeout;

  return {
    name: "watch-rebuild",
    configureServer(devServer) {
      server = devServer;

      // Watch for kumo rebuild completion signal
      const kumoSignalFile = resolve(__dirname, "../kumo/.build-complete");

      const watcher = watch(kumoSignalFile, {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 50,
        },
      });

      watcher.on("change", () => {
        // Debounce multiple rapid rebuilds
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          console.log("🔄 Dependency rebuilt, reloading...");

          // Clear Vite's module cache for kumo
          const moduleGraph = server.moduleGraph;
          moduleGraph.fileToModulesMap.forEach((modules, file) => {
            if (
              file.includes("@cloudflare/kumo") ||
              file.includes("packages/kumo/dist")
            ) {
              modules.forEach((mod) => {
                moduleGraph.invalidateModule(mod);
              });
            }
          });

          // Trigger full reload
          server.ws.send({
            type: "full-reload",
            path: "*",
          });
        }, 200); // 200ms debounce
      });

      // Cleanup on server close
      server.httpServer?.on("close", () => {
        watcher.close();
        clearTimeout(debounceTimer);
      });
    },
  };
}
