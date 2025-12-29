import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tailwind color utility prefixes that use --color-* tokens
const COLOR_PREFIXES = [
  "bg",
  "border",
  "ring",
  "fill",
  "outline",
  "shadow",
  "divide",
  "from",
  "via",
  "to",
] as const;

// | Old Token | → New Token |
// Maps the color token name (without prefix) to its consolidated replacement
const colorTokenTransforms: Record<string, string> = {
  // // ============ TEXT COLOR TRANSFORMS (previous analysis) ============
  // // KEEP AS-IS (canonical tokens)
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

  // // CONSOLIDATIONS (low frequency)
  // "text-neutral-subtle": "text-label", // neutral-subtle (4) → label
  // "text-muted-2": "text-muted", // muted-2 (4) → muted
  // "text-neutral-dim": "text-muted", // neutral-dim (3) → muted
  // "text-label-inverse": "text-disabled", // label-inverse (3) → disabled
  // "text-neutral-dim-2": "text-label", // neutral-dim-2 (1) → label

  // // CALENDAR (1 each) → USE EXISTING
  // "text-calendar-day-range-selected-endpoints": "text-white",
  // "text-calendar-day-range-selected-out-of-range": "text-label",
  // "text-calendar-reset": "text-surface-inverse",

  // // TOAST (1) → USE EXISTING
  // "text-toast-button-hover": "text-label",

  // ============ COLOR TOKEN CONSOLIDATIONS (from color analysis) ============
  // Based on quantitative hue grouping, ΔE similarity metrics, and usage analysis
  // Source: kumo-theme.css lines 68-282, 43 tokens → ~25 core tokens

  // ============ NEUTRALS - MERGE CANDIDATES (ΔE < 0.02) ============

  // layer-card-primary (1 use) → surface - identical light L=100%, dark differs slightly
  "layer-card-primary": "surface",

  // color-4 (2 uses) → color - ΔE=0.022, nearly identical
  "color-4": "color",

  // border-2 (1 use) → color - ΔE=0.000, identical values (just different alpha)
  "border-2": "color",

  // calendar-day-range-selected-out-of-range (1 use) → color - ΔE=0.000, identical
  "calendar-day-range-selected-out-of-range": "color",

  // hover-border (1 use) → hover - ΔE=0.000, identical (ignoring alpha)
  "hover-border": "hover",

  // calendar-day-range-selected (5 uses) → hover - ΔE=0.000, identical L=87%/37.1%
  "calendar-day-range-selected": "hover",

  // toast (2 uses) → subtle - ΔE=0.015, both L≈98.5% light
  toast: "subtle",

  // calendar (1 use) → color-3 - ΔE=0.015, both L=97% light
  calendar: "color-3",

  // toast-button-hover (1 use) → color-3 - same L=97% light/dark
  "toast-button-hover": "color-3",

  // ============ BLUES - MERGE CANDIDATES ============

  // meter-500 (2 uses) → info-surface - ΔE=0.000, identical blue-500
  "meter-500": "info-surface",

  // selected (3 uses) → primary - ΔE=0.014, nearly identical
  // Note: keeping selected as separate for semantic clarity, but they're visually identical
  // Uncomment to merge: "selected": "primary",

  // ============ REDS - NO MERGES RECOMMENDED ============
  // destructive, error-surface, error-border are semantically distinct despite similarity

  // ============ YELLOWS - NO MERGES RECOMMENDED ============
  // alert-surface, alert-selection, alert-border are semantically distinct
};

// Generate full class name transforms for all color prefixes
const classNameTransforms: Record<string, string> = {};

for (const [oldToken, newToken] of Object.entries(colorTokenTransforms)) {
  // Handle text-* classes (already have prefix in the key)
  if (oldToken.startsWith("text-")) {
    classNameTransforms[oldToken] = newToken;
    continue;
  }

  // Generate transforms for each color prefix
  for (const prefix of COLOR_PREFIXES) {
    const oldClass = `${prefix}-${oldToken}`;
    const newClass = `${prefix}-${newToken}`;
    classNameTransforms[oldClass] = newClass;
  }
}

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
