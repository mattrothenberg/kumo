#!/usr/bin/env node
/**
 * List all available templates
 * Usage: kumo templates [category]
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface TemplateRegistry {
  version: string;
  templates: Record<
    string,
    {
      name: string;
      category: string;
      title: string;
      description: string;
      tags?: string[];
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
 * Load the template registry
 */
function loadRegistry(): TemplateRegistry {
  const registryPath = getRegistryPath();
  const content = readFileSync(registryPath, "utf-8");
  return JSON.parse(content) as TemplateRegistry;
}

/**
 * List all templates, optionally filtered by category
 */
export function listTemplates(category?: string): void {
  try {
    const registry = loadRegistry();
    const templates = Object.entries(registry.templates);

    // Filter by category if specified
    const filtered = category
      ? templates.filter(([_, t]) => t.category === category)
      : templates;

    if (filtered.length === 0) {
      if (category) {
        console.error(`No templates found in category: ${category}`);
        console.log("\nAvailable categories: pages, blocks, flows");
      } else {
        console.log("No templates available yet.");
      }
      return;
    }

    // Group by category
    const byCategory = new Map<string, typeof filtered>();
    for (const [key, template] of filtered) {
      const cat = template.category || "Other";
      if (!byCategory.has(cat)) {
        byCategory.set(cat, []);
      }
      byCategory.get(cat)!.push([key, template]);
    }

    // Sort categories
    const sortedCategories = [...byCategory.keys()].sort();

    console.log(`\nKumo Templates (${filtered.length} total)\n`);

    for (const cat of sortedCategories) {
      const categoryTemplates = [...byCategory.get(cat)!].sort((a, b) =>
        a[1].title.localeCompare(b[1].title),
      );

      console.log(`${cat.toUpperCase()}:`);
      for (const [key, template] of categoryTemplates) {
        console.log(`  ${key}`);
        console.log(`    ${template.description}`);
        if (template.tags && template.tags.length > 0) {
          console.log(`    Tags: ${template.tags.join(", ")}`);
        }
        console.log();
      }
    }

    console.log("Usage:");
    console.log(
      "  kumo templates [category]  List templates (optionally by category)",
    );
    console.log("  kumo add <template-name>   Copy a template to your project");
    console.log("\nExample:");
    console.log("  kumo templates layouts");
    console.log("  kumo add layouts/centered-page-layout\n");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.error(
        "Error: Template registry not found. Make sure you're in a Kumo project.",
      );
      process.exit(1);
    }
    throw error;
  }
}
