import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// | Old Token | → New Token |
const classNameTransforms: Record<string, string> = {
  // // ============ KEEP AS-IS (canonical tokens) ============
  // "text-surface": "text-surface", // 44 uses - primary text
  // "text-secondary": "text-secondary", // 25 uses - KEEP! L=21% vs 0% is visible
  // "text-muted": "text-muted", // 34 uses - FIX dark value 98.5% → 70.8%
  // "text-label": "text-label", // 9 uses
  // "text-surface-inverse": "text-surface-inverse", // 3 uses
  // "text-disabled": "text-disabled", // 7 uses
  // "text-white": "text-white", // 7 uses
  // "text-brand": "text-brand", // 2 uses
  // "text-green": "text-green", // 2 uses
  // "text-info": "text-info", // 13 uses
  // "text-error": "text-error", // 14 uses
  // "text-alert": "text-alert", // 1 use

  // // ============ CONSOLIDATIONS (low frequency) ============

  // // neutral-subtle (4) → label - both adaptive, similar role
  // "text-neutral-subtle": "text-label",

  // // muted-2 (4) → muted - identical light, muted gets fixed dark value
  // "text-muted-2": "text-muted",

  // // neutral-dim (3) → muted - identical light L=55.6%
  // "text-neutral-dim": "text-muted",

  // // label-inverse (3) → disabled - same light L=70.8%
  // "text-label-inverse": "text-disabled",

  // // neutral-dim-2 (1) → label - identical light L=43.9%
  // "text-neutral-dim-2": "text-label",

  // // ============ CALENDAR (1 each) → USE EXISTING ============
  // "text-calendar-day-range-selected-endpoints": "text-white",
  // "text-calendar-day-range-selected-out-of-range": "text-label",
  // "text-calendar-reset": "text-surface-inverse",
  // // ============ TOAST (1) → USE EXISTING ============
  // "text-toast-button-hover": "text-label",

  // ============ NEW TOKENS (1 each) → USE EXISTING ============
  "text-secondary": "text-surface",
};

// Filter to only transforms that actually change the class name
const activeTransforms = Object.fromEntries(
  Object.entries(classNameTransforms).filter(([from, to]) => from !== to),
);

const SRC_DIR = resolve(__dirname, "../../src");
const STORYBOOK_DIR = resolve(__dirname, "../../.storybook");
const FILE_EXTENSIONS = [".ts", ".tsx"];

async function getAllFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else if (FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function transformContent(content: string): {
  transformed: string;
  changes: string[];
} {
  let transformed = content;
  const changes: string[] = [];

  for (const [oldClass, newClass] of Object.entries(activeTransforms)) {
    // Match class names in various contexts:
    // - In className strings: "text-color-secondary"
    // - In template literals: `text-color-secondary`
    // - In cn() calls: cn("text-color-secondary", ...)
    // - With word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${oldClass}\\b`, "g");
    const matches = transformed.match(regex);
    if (matches) {
      transformed = transformed.replace(regex, newClass);
      changes.push(`${oldClass} → ${newClass} (${matches.length}x)`);
    }
  }

  return { transformed, changes };
}

async function main() {
  const dryRun = !process.argv.includes("--write");

  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log(
      "DRY RUN - No files will be modified. Use --write to apply changes.\n",
    );
  }

  // eslint-disable-next-line no-console
  console.log("Active transforms:");
  for (const [from, to] of Object.entries(activeTransforms)) {
    // eslint-disable-next-line no-console
    console.log(`  ${from} → ${to}`);
  }
  // eslint-disable-next-line no-console
  console.log("");

  const srcFiles = await getAllFiles(SRC_DIR);
  const storybookFiles = await getAllFiles(STORYBOOK_DIR);
  const files = [...srcFiles, ...storybookFiles];
  let totalChanges = 0;
  let filesChanged = 0;

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const { transformed, changes } = transformContent(content);

    if (changes.length > 0) {
      filesChanged++;
      totalChanges += changes.length;
      const relativePath = file
        .replace(SRC_DIR, "src")
        .replace(STORYBOOK_DIR, ".storybook");
      // eslint-disable-next-line no-console
      console.log(`${relativePath}:`);
      for (const change of changes) {
        // eslint-disable-next-line no-console
        console.log(`  ${change}`);
      }

      if (!dryRun) {
        await writeFile(file, transformed, "utf8");
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n${dryRun ? "Would modify" : "Modified"} ${filesChanged} files with ${totalChanges} changes.`,
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Transform failed:", error);
  process.exitCode = 1;
});
