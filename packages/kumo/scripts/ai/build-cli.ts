#!/usr/bin/env node
/**
 * Build script for the Kumo CLI
 * Compiles TypeScript CLI files to JavaScript in dist/cli/
 */

import * as esbuild from "esbuild";
import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..", "..");
const distCliDir = join(packageRoot, "dist", "cli");

// Ensure dist/cli directory exists
mkdirSync(distCliDir, { recursive: true });
mkdirSync(join(distCliDir, "commands"), { recursive: true });

// Compile CLI files using esbuild API
const cliFiles = [
  { src: "scripts/ai/cli.ts", dest: "dist/cli/cli.js" },
  { src: "scripts/ai/commands/ls.ts", dest: "dist/cli/commands/ls.js" },
  { src: "scripts/ai/commands/doc.ts", dest: "dist/cli/commands/doc.js" },
  {
    src: "scripts/ai/commands/add-template.ts",
    dest: "dist/cli/commands/add-template.js",
  },
  {
    src: "scripts/ai/commands/list-templates.ts",
    dest: "dist/cli/commands/list-templates.js",
  },
];

console.log("Building Kumo CLI...");

for (const file of cliFiles) {
  const srcPath = join(packageRoot, file.src);
  const destPath = join(packageRoot, file.dest);

  // Use esbuild API directly
  await esbuild.build({
    entryPoints: [srcPath],
    outfile: destPath,
    format: "esm",
    platform: "node",
    target: "node18",
    bundle: true,
    packages: "external",
  });

  // Read the compiled file and ensure shebang is at the top
  let content = readFileSync(destPath, "utf-8");
  if (!content.startsWith("#!/usr/bin/env node")) {
    content = "#!/usr/bin/env node\n" + content;
    writeFileSync(destPath, content);
  }

  // Make the main CLI executable
  if (file.dest === "dist/cli/cli.js") {
    chmodSync(destPath, 0o755);
  }
}

console.log("Kumo CLI built successfully!");
