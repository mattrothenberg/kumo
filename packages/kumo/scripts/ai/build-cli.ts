#!/usr/bin/env node
/**
 * Build script for the Kumo CLI
 * Compiles TypeScript CLI files to JavaScript in dist/cli/
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, chmodSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..", "..");
const distCliDir = join(packageRoot, "dist", "cli");

// Ensure dist/cli directory exists
mkdirSync(distCliDir, { recursive: true });
mkdirSync(join(distCliDir, "commands"), { recursive: true });

// Use esbuild via tsx to compile the CLI files
// We compile each file separately to maintain the structure
const cliFiles = [
  { src: "scripts/ai/cli.ts", dest: "dist/cli/cli.js" },
  { src: "scripts/ai/commands/ls.ts", dest: "dist/cli/commands/ls.js" },
  { src: "scripts/ai/commands/doc.ts", dest: "dist/cli/commands/doc.js" },
];

console.log("Building Kumo CLI...");

for (const file of cliFiles) {
  const srcPath = join(packageRoot, file.src);
  const destPath = join(packageRoot, file.dest);

  // Use esbuild to compile (tsx uses esbuild under the hood)
  execSync(
    `npx esbuild ${srcPath} --outfile=${destPath} --format=esm --platform=node --target=node18 --bundle --packages=external`,
    { cwd: packageRoot, stdio: "inherit" },
  );

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
