/**
 * Extract Phosphor Icons Used in Kumo Components
 *
 * This script scans all TypeScript/TSX files in Kumo's src directory
 * to find imports from @phosphor-icons/react and extracts the icon names.
 *
 * The extracted names are:
 * 1. Converted from PascalCase to kebab-case (ArrowRightIcon -> arrow-right)
 * 2. Prefixed with "ph-" (arrow-right -> ph-arrow-right)
 * 3. Deduplicated and sorted alphabetically
 *
 * Run: npx tsx packages/kumo/scripts/icon/extract-phosphor-icons.ts
 *
 * @example
 * ```ts
 * import { extractPhosphorIcons } from './extract-phosphor-icons';
 *
 * const icons = await extractPhosphorIcons();
 * console.log(icons); // ["ph-arrow-right", "ph-check", ...]
 * ```
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Convert PascalCase to kebab-case
 *
 * @example
 * pascalToKebab("ArrowRightIcon") // "arrow-right-icon"
 * pascalToKebab("CheckIcon") // "check-icon"
 * pascalToKebab("XIcon") // "x-icon"
 */
function pascalToKebab(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // lowercase followed by uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // uppercase followed by uppercase+lowercase
    .toLowerCase();
}

/**
 * Recursively walk a directory and return all .ts and .tsx file paths
 */
function walkDirectory(dir: string): string[] {
  const files: string[] = [];

  function walk(currentPath: string) {
    const entries = readdirSync(currentPath);

    for (const entry of entries) {
      const fullPath = join(currentPath, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx)$/.test(entry)) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Extract Phosphor icon imports from Kumo source files
 *
 * Scans the following directories:
 * - src/components/
 * - src/blocks/
 * - src/layouts/
 * - src/docs/
 *
 * @returns Sorted array of icon names with "ph-" prefix (e.g., ["ph-arrow-right", "ph-check"])
 */
export async function extractPhosphorIcons(): Promise<string[]> {
  const srcDir = join(__dirname, "../../src");
  const dirsToScan = ["components", "blocks", "layouts", "docs"];

  const iconSet = new Set<string>();

  // Regex to match: import { IconName, AnotherIcon } from "@phosphor-icons/react";
  const importRegex =
    /import\s*\{([^}]+)\}\s*from\s*["']@phosphor-icons\/react["']/g;

  for (const dir of dirsToScan) {
    const fullPath = join(srcDir, dir);
    const files = walkDirectory(fullPath);

    for (const file of files) {
      const content = readFileSync(file, "utf-8");

      // Find all import statements from @phosphor-icons/react
      let match: RegExpExecArray | null;
      while ((match = importRegex.exec(content)) !== null) {
        const importContent = match[1];

        // Split imports by comma and process each one
        const imports = importContent.split(",").map((s) => s.trim());

        for (const imp of imports) {
          // Skip type imports: "type Icon" or "type IconWeight"
          if (imp.startsWith("type ")) {
            continue;
          }

          // Handle aliased imports: "CheckIcon as Check"
          const aliasMatch = imp.match(/^(\w+)(?:\s+as\s+\w+)?/);
          if (!aliasMatch) {
            continue;
          }

          const importName = aliasMatch[1];

          // Skip non-icon exports (Icon, IconContext, IconProps, IconWeight)
          if (
            importName === "Icon" ||
            importName === "IconContext" ||
            importName === "IconProps" ||
            importName === "IconWeight"
          ) {
            continue;
          }

          // Remove "Icon" suffix if present
          const iconName = importName.replace(/Icon$/, "");

          // Convert to kebab-case
          const kebabName = pascalToKebab(iconName);

          // Add ph- prefix
          iconSet.add(`ph-${kebabName}`);
        }
      }
    }
  }

  // Return sorted array
  return Array.from(iconSet).sort();
}

// If run directly, print the icon list
if (import.meta.url === `file://${process.argv[1]}`) {
  extractPhosphorIcons()
    .then((icons) => {
      console.log(`Found ${icons.length} Phosphor icons:\n`);
      console.log(JSON.stringify(icons, null, 2));
    })
    .catch((error) => {
      console.error("Error extracting icons:", error);
      process.exit(1);
    });
}
