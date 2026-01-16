#!/usr/bin/env node
/**
 * Add a template to the current project
 * Usage: kumo add <template-name>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

interface TemplateFile {
  source: string;
  target: string;
}

interface TemplateConfig {
  name: string;
  category: string;
  title: string;
  description: string;
  targetPath: string;
  files: TemplateFile[];
  dependencies?: Record<string, string>;
}

interface TemplateRegistry {
  version: string;
  templates: Record<
    string,
    {
      name: string;
      category: string;
      title: string;
      description: string;
      targetPath: string;
      files: string[];
      dependencies?: Record<string, string>;
    }
  >;
}

/**
 * Get the path to the template registry JSON file
 */
function getRegistryPath(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // When installed as npm package, we're in dist/cli/commands/
  // When running locally, we're in scripts/ai/commands/
  // In both cases, go up to find package root (where package.json is)
  let currentDir = __dirname;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const packageJsonPath = join(currentDir, "package.json");
    try {
      readFileSync(packageJsonPath, "utf-8");
      // Found package.json, templates/ should be here
      return join(currentDir, "templates", "registry.json");
    } catch {
      // Go up one level
      currentDir = dirname(currentDir);
      attempts++;
    }
  }

  throw new Error("Could not find package root");
}

/**
 * Get the templates directory path
 */
function getTemplatesDir(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // Find package root first
  let currentDir = __dirname;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const packageJsonPath = join(currentDir, "package.json");
    try {
      readFileSync(packageJsonPath, "utf-8");
      // Found package.json, templates/ should be here
      return join(currentDir, "templates");
    } catch {
      // Go up one level
      currentDir = dirname(currentDir);
      attempts++;
    }
  }

  throw new Error("Could not find package root");
}

/**
 * Load the template registry
 */
function loadRegistry(): TemplateRegistry {
  const registryPath = getRegistryPath();
  const content = readFileSync(registryPath, "utf-8");
  return JSON.parse(content) as TemplateRegistry;
}

/**
 * Copy a template to the target directory
 */
export function addTemplate(templateName: string): void {
  if (!templateName) {
    console.error("Error: Template name is required");
    console.log("\nUsage: kumo add <template-name>");
    console.log("\nExample: kumo add pages/active-sessions");
    console.log("\nRun 'kumo templates' to see available templates");
    process.exit(1);
  }

  try {
    const registry = loadRegistry();
    const template = registry.templates[templateName];

    if (!template) {
      console.error(`Error: Template '${templateName}' not found`);
      console.log("\nRun 'kumo templates' to see available templates");
      process.exit(1);
    }

    console.log(`\n📦 Adding template: ${template.title}`);
    console.log(`   ${template.description}\n`);

    // Determine target directory (current working directory)
    const targetBase = process.cwd();
    const targetDir = join(targetBase, template.targetPath);

    // Check if target directory already exists
    if (existsSync(targetDir)) {
      console.error(
        `Error: Target directory already exists: ${template.targetPath}`,
      );
      console.log(
        "\nPlease remove the existing directory or choose a different location.",
      );
      process.exit(1);
    }

    // Create target directory
    mkdirSync(targetDir, { recursive: true });

    // Copy files
    const templatesDir = getTemplatesDir();
    const templateDir = join(templatesDir, template.category, template.name);

    console.log("📁 Copying files:");
    for (const file of template.files) {
      const sourcePath = join(templateDir, file);
      const targetPath = join(targetDir, file);

      // Create subdirectories if needed
      const targetFileDir = dirname(targetPath);
      if (!existsSync(targetFileDir)) {
        mkdirSync(targetFileDir, { recursive: true });
      }

      // Copy file
      const content = readFileSync(sourcePath, "utf-8");
      writeFileSync(targetPath, content, "utf-8");

      const relativePath = relative(targetBase, targetPath);
      console.log(`   ✓ ${relativePath}`);
    }

    console.log("\n✅ Template installed successfully!\n");

    // Show dependencies
    if (
      template.dependencies &&
      Object.keys(template.dependencies).length > 0
    ) {
      console.log("📦 Required dependencies:");
      for (const [pkg, version] of Object.entries(template.dependencies)) {
        console.log(`   ${pkg}@${version}`);
      }
      console.log("\nMake sure these are installed in your project.");
      console.log(
        "Run: pnpm add " + Object.keys(template.dependencies).join(" "),
      );
      console.log();
    }

    // Show next steps
    console.log("📖 Next steps:");
    console.log(`   1. Review the files in ${template.targetPath}`);
    console.log(`   2. Customize as needed for your project`);
    console.log(`   3. Import and use the components\n`);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.error(
        "Error: Template registry not found. Make sure you're running this from a Kumo project.",
      );
      process.exit(1);
    }
    throw error;
  }
}
