import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createIndex } from "pagefind";
import fs from "node:fs";

export default function pagefindIntegration(): AstroIntegration {
  return {
    name: "astro-pagefind",
    hooks: {
      "astro:server:setup": async ({ server, logger }) => {
        // In dev mode, serve pagefind files from the dist directory
        // This requires running `pnpm build` at least once
        // server.config.root is already a string path, not a URL
        const rootDir = server.config.root;
        const outDir = path.join(rootDir, "dist");
        const pagefindDir = path.join(outDir, "pagefind");

        if (!fs.existsSync(pagefindDir)) {
          logger.warn(
            "Pagefind index not found. Run `pnpm build` first to enable search in dev mode.",
          );
          return;
        }

        logger.info(`Serving pagefind from ${pagefindDir}`);

        // Serve pagefind files statically
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/pagefind/")) {
            return next();
          }

          // Strip query string and get the file path
          const urlPath = req.url.split("?")[0];
          const filePath = path.join(outDir, urlPath);

          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }

          // Set content type based on extension
          const ext = path.extname(filePath);
          const contentTypes: Record<string, string> = {
            ".js": "application/javascript",
            ".json": "application/json",
            ".css": "text/css",
            ".wasm": "application/wasm",
          };

          if (contentTypes[ext]) {
            res.setHeader("Content-Type", contentTypes[ext]);
          } else {
            res.setHeader("Content-Type", "application/octet-stream");
          }

          res.setHeader("Cache-Control", "no-cache");
          const content = fs.readFileSync(filePath);
          res.end(content);
        });
      },

      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        logger.info("Building Pagefind search index...");

        const { index, errors: createErrors } = await createIndex();
        if (!index) {
          logger.error("Pagefind failed to create index");
          createErrors.forEach((e) => logger.error(e));
          return;
        }

        const { page_count, errors: addErrors } = await index.addDirectory({
          path: outDir,
        });

        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          addErrors.forEach((e) => logger.error(e));
          return;
        }

        logger.info(`Pagefind indexed ${page_count} pages`);

        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });

        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          writeErrors.forEach((e) => logger.error(e));
          return;
        }

        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
    },
  };
}
