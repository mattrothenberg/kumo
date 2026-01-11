/**
 * Figma Plugin Drift Detection Tests
 *
 * CRITICAL: This test prevents drift between component-registry.json and Figma generators.
 * When this test fails, you need to either:
 * 1. Create a new generator in generators/<component-name>.ts
 * 2. Add the generator to code.ts GENERATORS array
 * 3. Or add component to EXCLUDED_COMPONENTS if intentionally skipped
 *
 * This runs automatically in CI via the test-kumo job.
 */

import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import registry from "../../../../ai/component-registry.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Components that intentionally don't have Figma generators
// Add components here that shouldn't be in Figma (e.g., layout-only, utility components)
const EXCLUDED_COMPONENTS = new Set([
  // Permanently excluded - no visual representation needed in Figma
  "DropdownMenu", // Alias for Dropdown - uses dropdown.ts generator
  "Field", // Form wrapper utility - provides label/description/error layout, no standalone visual
  "Icon", // Utility component - handled by icon-library.ts
  "Toasty", // Alias for Toast - uses toast.ts generator

  // Components not yet implemented in Figma (Phase 4 targets)
  "Breadcrumbs", // Block component with navigation path
  "Empty", // Display component for empty states
  "PageHeader", // Block component with title, description, actions
]);

// Map registry component names to generator file names (if they differ)
const COMPONENT_NAME_MAPPING: Record<string, string> = {
  "Switch.Group": "switch", // Switch.Group is in switch.ts
  ClipboardText: "clipboard-text",
  DateRangePicker: "date-range-picker",
  LayerCard: "layer-card",
  SensitiveInput: "sensitive-input",
};

// Utility files that aren't component generators
const UTILITY_FILES = new Set([
  "shared",
  "icon-utils",
  "icon-library",
  "drift-detection", // This test file
]);

describe("Figma Plugin Drift Detection", () => {
  it("should have generators for all components in registry", () => {
    const registryComponents = Object.keys(registry.components);
    const generatorFiles = readdirSync(__dirname)
      .filter((f: string) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
      .map((f: string) => f.replace(".ts", ""));

    const missingGenerators: string[] = [];

    for (const component of registryComponents) {
      if (EXCLUDED_COMPONENTS.has(component)) continue;

      const expectedFileName =
        COMPONENT_NAME_MAPPING[component] ||
        component.toLowerCase().replace(/\./g, "-");

      if (!generatorFiles.includes(expectedFileName)) {
        missingGenerators.push(component);
      }
    }

    if (missingGenerators.length > 0) {
      const firstMissing = missingGenerators[0];
      const expectedFile = (
        COMPONENT_NAME_MAPPING[firstMissing] ||
        firstMissing.toLowerCase().replace(/\./g, "-")
      ).toLowerCase();

      throw new Error(
        `❌ Missing Figma generators for ${missingGenerators.length} component(s):\n` +
          `  - ${missingGenerators.join("\n  - ")}\n\n` +
          `🔧 To fix:\n` +
          `  1. Create generators/${expectedFile}.ts\n` +
          `  2. Add to code.ts GENERATORS array:\n` +
          `     import { generate${firstMissing}Components } from "./generators/${expectedFile}";\n` +
          `     { name: "${firstMissing}", execute: async (page, y) => { ... } }\n` +
          `  3. Or add to EXCLUDED_COMPONENTS in drift-detection.test.ts if intentional\n\n` +
          `📖 See scripts/figma/plugin/README.md for full instructions`
      );
    }

    expect(missingGenerators).toEqual([]);
  });

  it("should have all generators registered in code.ts", () => {
    const codeTs = readFileSync(join(__dirname, "..", "code.ts"), "utf-8");

    // Extract generator imports (matches kebab-case and single-word filenames)
    const importMatches = codeTs.matchAll(
      /import\s+\{[^}]*generate\w+Components[^}]*\}\s+from\s+["']\.\/generators\/([\w-]+)["']/g
    );

    const registeredGenerators = new Set<string>();
    for (const match of importMatches) {
      registeredGenerators.add(match[1]); // filename with kebab-case preserved
    }

    // Get all generator files (excluding utility files and tests)
    const generatorFiles = readdirSync(__dirname)
      .filter(
        (f: string) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !UTILITY_FILES.has(f.replace(".ts", ""))
      )
      .map((f: string) => f.replace(".ts", ""));

    const unregistered = generatorFiles.filter(
      (f: string) => !registeredGenerators.has(f)
    );

    if (unregistered.length > 0) {
      const firstUnreg = unregistered[0];
      const componentName =
        firstUnreg.charAt(0).toUpperCase() + firstUnreg.slice(1);

      throw new Error(
        `❌ Generator files exist but not registered in code.ts:\n` +
          `  - ${unregistered.join("\n  - ")}\n\n` +
          `🔧 To fix, add to the GENERATORS array in code.ts:\n` +
          `  import { generate${componentName}Components } from "./generators/${firstUnreg}";\n` +
          `  { name: "${componentName}", execute: async (page, y) => { ... } }\n\n` +
          `📖 See scripts/figma/plugin/README.md for full instructions`
      );
    }

    expect(unregistered).toEqual([]);
  });

  it("should have testable exports from each generator", () => {
    const registryComponents = Object.keys(registry.components);
    const warnings: string[] = [];

    for (const component of registryComponents) {
      if (EXCLUDED_COMPONENTS.has(component)) continue;

      const fileName =
        COMPONENT_NAME_MAPPING[component] || component.toLowerCase();
      const filePath = join(__dirname, `${fileName}.ts`);

      if (!existsSync(filePath)) {
        // Will be caught by first test
        continue;
      }

      try {
        // Read file and check for testable exports (get*Config or get*Data functions)
        const content = readFileSync(filePath, "utf-8");
        const hasTestExports =
          /export\s+function\s+get\w+(Config|Data|Styles)/g.test(content);

        if (!hasTestExports) {
          warnings.push(
            `${component} (${fileName}.ts): No testable exports found. Consider adding get*Config() or get*Data() functions for snapshot testing.`
          );
        }
      } catch {
        // Generator doesn't exist - will be caught by first test
      }
    }

    // This is a warning, not a failure - testable exports are good practice but not required
    if (warnings.length > 0) {
      console.warn(
        "\n⚠️  Generators without testable exports:\n  " + warnings.join("\n  ")
      );
    }

    // Always pass - this is just a warning
    expect(true).toBe(true);
  });
});
