#!/usr/bin/env tsx

import { execSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import {
  hasChangesInPath,
  getNewlyAddedFiles,
  isMergeRequestContext,
  logMergeRequestContext,
} from "../utils/git-operations";

/**
 * Validates that a changeset exists for the @cloudflare/kumo package
 * when files in packages/kumo/ are modified in a merge request.
 */

const KUMO_PACKAGE_NAME = "@cloudflare/kumo";
const KUMO_PATH = "packages/kumo";
const CHANGESET_DIR = ".changeset";

interface ChangesetFile {
  name: string;
  content: string;
  packages: string[];
}

function main() {
  console.log(`🔍 Validating changeset for kumo package: ${KUMO_PACKAGE_NAME}`);

  // Check if we're in a merge request context
  const isMR = isMergeRequestContext();

  // Log detection method for transparency
  if (isMR) {
    logMergeRequestContext();
  }

  if (!isMR) {
    console.log("Not a merge request context, skipping changeset validation");
    return;
  }

  console.log("Running in MR context - validating changesets...");

  // Check if kumo files have been modified
  const hasKumoChanges = checkForKumoChanges();
  if (!hasKumoChanges) {
    console.log(
      "No changes detected in packages/kumo/, skipping changeset validation",
    );
    return;
  }

  console.log("Changes detected in packages/kumo/");

  // Check for newly added changesets in this MR
  const newChangesets = getNewlyAddedChangesets();
  const newKumoChangesets = newChangesets.filter((cs) =>
    cs.packages.includes(KUMO_PACKAGE_NAME),
  );

  if (newKumoChangesets.length === 0) {
    // Use GitLab CI collapsible section for better visibility
    console.error(
      "\x1b[0Ksection_start:" +
        Date.now() +
        ":changeset_error\r\x1b[0K\x1b[31;1m❌ CHANGESET VALIDATION FAILED\x1b[0m",
    );
    console.error("");

    // Check if there are any new changesets at all
    if (newChangesets.length === 0) {
      console.error(
        "\x1b[31;1m❌ ERROR: Changes detected in packages/kumo/ but no NEW changeset files found\x1b[0m",
      );
    } else {
      console.error(
        "\x1b[31;1m❌ ERROR: Found NEW changeset files, but none target @cloudflare/kumo\x1b[0m",
      );
      console.error("");
      console.error("New changesets found:");
      newChangesets.forEach((cs) => {
        console.error(`   - ${cs.name} (targets: ${cs.packages.join(", ")})`);
      });
    }

    console.error("");
    console.error("\x1b[33;1m📋 To fix this issue:\x1b[0m");
    console.error("   1. Run: \x1b[36mpnpm changeset\x1b[0m");
    console.error(
      '   2. Select "\x1b[36m@cloudflare/kumo\x1b[0m" when prompted',
    );
    console.error(
      "   3. Choose the appropriate change type (patch/minor/major)",
    );
    console.error("   4. Write a clear description of your changes");
    console.error("   5. Commit the generated changeset file");
    console.error("");
    console.error(
      "This ensures proper versioning and changelog generation for the kumo package.",
    );
    console.error("");
    console.error(
      "\x1b[0Ksection_end:" + Date.now() + ":changeset_error\r\x1b[0K",
    );

    process.exit(1);
  }

  console.log(
    `✅ Found ${newKumoChangesets.length} NEW changeset(s) for @cloudflare/kumo:`,
  );
  newKumoChangesets.forEach((cs) => {
    console.log(`   - ${cs.name}`);
  });

  console.log("Changeset validation passed!");
}

function checkForKumoChanges(): boolean {
  const result = hasChangesInPath(KUMO_PATH);

  if (result === null) {
    console.warn(
      "⚠️  Warning: Could not determine if kumo changes exist, assuming they do",
    );
    return true;
  }

  return result;
}

function getNewlyAddedChangesets(): ChangesetFile[] {
  // Determine working directory (handle both repo root and packages/kumo contexts)
  const cwd = process.cwd().includes("packages/kumo") ? "../.." : ".";

  // Get newly added files in .changeset directory
  const newFiles = getNewlyAddedFiles(CHANGESET_DIR, { cwd });

  if (newFiles.length === 0) {
    console.warn(
      "Warning: Could not determine newly added changesets, falling back to all changesets",
    );
    return getChangesets();
  }

  const changesets: ChangesetFile[] = [];

  for (const { status, path: filePath } of newFiles) {
    // Only consider newly added files (A = Added)
    if (status !== "A") {
      continue;
    }

    const fileName = filePath.split("/").pop();

    // Skip config files and README
    if (
      !fileName ||
      fileName === "config.json" ||
      fileName === "README.md" ||
      fileName === "USAGE.md" ||
      !fileName.endsWith(".md")
    ) {
      continue;
    }

    try {
      // Resolve file path relative to repo root
      const repoRoot = process.cwd().includes("packages/kumo") ? "../.." : ".";
      const fullFilePath = join(repoRoot, filePath);
      const content = readFileSync(fullFilePath, "utf8");
      const packages = parseChangesetPackages(content);

      changesets.push({
        name: fileName,
        content,
        packages,
      });
    } catch (error) {
      console.warn(
        `Warning: Could not parse changeset file ${fileName}: ${error}`,
      );
    }
  }

  return changesets;
}

function getChangesets(): ChangesetFile[] {
  if (!existsSync(CHANGESET_DIR)) {
    return [];
  }

  const changesets: ChangesetFile[] = [];
  const files = readdirSync(CHANGESET_DIR);

  for (const file of files) {
    // Skip config files and README
    if (
      file === "config.json" ||
      file === "README.md" ||
      file === "USAGE.md" ||
      !file.endsWith(".md")
    ) {
      continue;
    }

    const filePath = join(CHANGESET_DIR, file);
    try {
      const content = readFileSync(filePath, "utf8");
      const packages = parseChangesetPackages(content);

      changesets.push({
        name: file,
        content,
        packages,
      });
    } catch (error) {
      console.warn(`Warning: Could not parse changeset file ${file}: ${error}`);
    }
  }

  return changesets;
}

function parseChangesetPackages(content: string): string[] {
  const lines = content.split("\n");
  const packages: string[] = [];

  // Track whether we're inside the YAML frontmatter section (between --- markers)
  // where package declarations are defined
  let inFrontmatter = false;
  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }

    if (inFrontmatter) {
      // Parse YAML-style package declarations
      // Format: "@package/name": patch|minor|major
      const match = line.match(
        /^["']?([^"':]+)["']?\s*:\s*(patch|minor|major)/,
      );
      if (match) {
        packages.push(match[1]);
      }
    }
  }

  return packages;
}

// Run if this is the main module (ES module compatible check)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
