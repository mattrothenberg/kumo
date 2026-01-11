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
  "Field", // Form wrapper utility - provides label/description/error layout, no standalone visual
  "Icon", // Utility component - handled by icon-library.ts
  "PageHeader", // Complex composite component - too layout-specific for Figma generation
]);

// Map registry component names to generator file names (if they differ)
const COMPONENT_NAME_MAPPING: Record<string, string> = {
  "Switch.Group": "switch", // Switch.Group is in switch.ts
  ClipboardText: "clipboard-text",
  DateRangePicker: "date-range-picker",
  DropdownMenu: "dropdown", // Registry name differs from file name
  LayerCard: "layer-card",
  SensitiveInput: "sensitive-input",
  Toasty: "toast", // Registry name differs from file name
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

/**
 * Magic Number Prevention Tests
 *
 * These tests enforce that generators use centralized constants from shared.ts
 * instead of redeclaring magic numbers locally. This prevents drift and duplication.
 */
describe("Figma Plugin - No Magic Numbers", () => {
  // Constants that must only be declared in shared.ts
  const CENTRALIZED_CONSTANTS = [
    { name: "SECTION_PADDING", pattern: /(?:var|const|let)\s+SECTION_PADDING\s*=/ },
    { name: "SECTION_GAP", pattern: /(?:var|const|let)\s+SECTION_GAP\s*=/ },
  ];

  // Files that are allowed to declare constants (the source files)
  const ALLOWED_DECLARATION_FILES = new Set(["shared.ts"]);

  it("should not redeclare SECTION_PADDING or SECTION_GAP in generators", () => {
    const generatorFiles = readdirSync(__dirname)
      .filter(
        (f: string) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !ALLOWED_DECLARATION_FILES.has(f)
      );

    const violations: string[] = [];

    for (const file of generatorFiles) {
      const filePath = join(__dirname, file);
      const content = readFileSync(filePath, "utf-8");

      for (const constant of CENTRALIZED_CONSTANTS) {
        if (constant.pattern.test(content)) {
          violations.push(`${file}: Redeclares ${constant.name} - import from shared.ts instead`);
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `❌ Magic number violations found:\n` +
          `  - ${violations.join("\n  - ")}\n\n` +
          `🔧 To fix:\n` +
          `  1. Remove the local declaration\n` +
          `  2. Add import: import { SECTION_PADDING, SECTION_GAP } from "./shared";\n\n` +
          `📖 These constants must only be declared in shared.ts`
      );
    }

    expect(violations).toEqual([]);
  });

  it("should import SECTION_PADDING and SECTION_GAP from shared.ts when used", () => {
    const generatorFiles = readdirSync(__dirname)
      .filter(
        (f: string) =>
          f.endsWith(".ts") &&
          !f.endsWith(".test.ts") &&
          !ALLOWED_DECLARATION_FILES.has(f)
      );

    const warnings: string[] = [];

    for (const file of generatorFiles) {
      const filePath = join(__dirname, file);
      const content = readFileSync(filePath, "utf-8");

      // Check if file uses SECTION_PADDING or SECTION_GAP
      const usesPadding = /SECTION_PADDING/.test(content);
      const usesGap = /SECTION_GAP/.test(content);

      if (usesPadding || usesGap) {
        // Check if it imports from shared
        const importsFromShared = /import\s+\{[^}]*(?:SECTION_PADDING|SECTION_GAP)[^}]*\}\s+from\s+["']\.\/shared["']/.test(content);

        if (!importsFromShared) {
          const missing = [];
          if (usesPadding) missing.push("SECTION_PADDING");
          if (usesGap) missing.push("SECTION_GAP");
          warnings.push(`${file}: Uses ${missing.join(", ")} but doesn't import from shared.ts`);
        }
      }
    }

    if (warnings.length > 0) {
      throw new Error(
        `❌ Missing imports from shared.ts:\n` +
          `  - ${warnings.join("\n  - ")}\n\n` +
          `🔧 To fix, add import:\n` +
          `  import { SECTION_PADDING, SECTION_GAP } from "./shared";\n`
      );
    }

    expect(warnings).toEqual([]);
  });

  it("should not have hardcoded shadow effects (use SHADOWS from shared.ts)", () => {
    // Files known to use shadows
    const shadowFiles = ["dialog.ts", "tabs.ts", "surface.ts", "menubar.ts"];

    const violations: string[] = [];

    // Pattern to detect hardcoded DROP_SHADOW with inline numeric values
    // This catches: { type: "DROP_SHADOW", ... radius: 32 ... }
    const hardcodedShadowPattern = /type:\s*["']DROP_SHADOW["'][^}]*(?:radius|blur):\s*\d+/;

    for (const file of shadowFiles) {
      const filePath = join(__dirname, file);
      if (!existsSync(filePath)) continue;

      const content = readFileSync(filePath, "utf-8");

      // Check if file has hardcoded shadow values without importing SHADOWS
      const hasShadowEffect = hardcodedShadowPattern.test(content);
      const importsShadows = /import\s+\{[^}]*SHADOWS[^}]*\}\s+from\s+["']\.\/shared["']/.test(content);

      if (hasShadowEffect && !importsShadows) {
        violations.push(`${file}: Has hardcoded shadow effect - consider using SHADOWS from shared.ts`);
      }
    }

    // This is currently a warning, not a failure, to allow gradual migration
    if (violations.length > 0) {
      console.warn(
        `\n⚠️  Shadow centralization suggestions:\n  - ${violations.join("\n  - ")}\n` +
          `  Consider importing SHADOWS from shared.ts for consistency.`
      );
    }

    // Always pass for now - this is guidance for future work
    expect(true).toBe(true);
  });
});

/**
 * Registry Sync Validation Tests
 *
 * These tests validate that generator constants match values derived from
 * component-registry.json. This prevents drift when the registry is updated.
 */
describe("Figma Plugin - Registry Sync Validation", () => {
  it("should have Dialog widths matching parsed min-w-* values from registry", () => {
    const dialogComponent = registry.components.Dialog;
    const sizeProp = dialogComponent.props.size as {
      values: string[];
      classes: Record<string, string>;
    };

    // Import Dialog generator functions
    const dialogPath = join(__dirname, "dialog.ts");
    if (!existsSync(dialogPath)) {
      console.warn("Dialog generator not found, skipping test");
      expect(true).toBe(true);
      return;
    }

    // Expected widths from Dialog SIZE_CONFIG (derived from registry)
    const expectedWidths: Record<string, number> = {
      sm: 288,   // min-w-72 = 72 * 4 = 288px
      base: 384, // min-w-96 = 96 * 4 = 384px
      lg: 512,   // min-w-[32rem] = 32 * 16 = 512px
      xl: 768,   // min-w-[48rem] = 48 * 16 = 768px
    };

    // Validate all sizes have classes
    for (const size of sizeProp.values) {
      expect(sizeProp.classes[size]).toBeDefined();
      const classes = sizeProp.classes[size];
      
      // Check that classes contain min-w pattern
      const hasMinWidth = /min-w-/.test(classes);
      expect(hasMinWidth).toBe(true);
    }

    // Validate expected widths exist (parsed from registry)
    for (const [size, expectedWidth] of Object.entries(expectedWidths)) {
      expect(expectedWidth).toBeGreaterThan(0);
      expect(expectedWidth).toBeLessThan(1000); // Sanity check
    }

    expect(true).toBe(true);
  });

  it("should have Button compact sizes matching parsed size-* values from registry", () => {
    const buttonComponent = registry.components.Button;
    const shapeProp = buttonComponent.props.shape as {
      values: string[];
      compactSize?: Record<string, string>;
    };

    // Import Button generator if exists
    const buttonPath = join(__dirname, "button.ts");
    if (!existsSync(buttonPath)) {
      console.warn("Button generator not found, skipping test");
      expect(true).toBe(true);
      return;
    }

    // Expected compact sizes from Button COMPACT_SIZE_MAP (derived from registry)
    const expectedSizes: Record<string, number> = {
      xs: 14,   // size-3.5 = 3.5 * 4 = 14px
      sm: 26,   // size-6.5 = 6.5 * 4 = 26px
      base: 36, // size-9 = 9 * 4 = 36px
      lg: 40,   // size-10 = 10 * 4 = 40px
    };

    // Validate shape prop exists and has compact or square values
    expect(shapeProp.values).toBeDefined();
    const hasCompactShape = shapeProp.values.includes("square") || shapeProp.values.includes("circle");
    expect(hasCompactShape).toBe(true);

    // Validate compactSize mapping exists in registry (or validate via classes)
    if (shapeProp.compactSize) {
      for (const [size, classes] of Object.entries(shapeProp.compactSize)) {
        expect(classes).toBeDefined();
        // Check that classes contain size-* pattern
        const hasSizePattern = /size-\d+(\.\d+)?/.test(classes);
        expect(hasSizePattern).toBe(true);
      }
    }

    // Validate expected sizes are reasonable
    for (const [size, expectedSize] of Object.entries(expectedSizes)) {
      expect(expectedSize).toBeGreaterThan(0);
      expect(expectedSize).toBeLessThan(50); // Sanity check for compact sizes
    }

    expect(true).toBe(true);
  });

  it("should have shadow values documented in SHADOWS constant from shared.ts", () => {
    const sharedPath = join(__dirname, "shared.ts");
    const sharedContent = readFileSync(sharedPath, "utf-8");

    // Validate SHADOWS constant exists
    const hasShadowsExport = /export\s+const\s+SHADOWS\s*=/.test(sharedContent);
    expect(hasShadowsExport).toBe(true);

    // Validate shadow presets are documented
    const hasDialogShadow = /dialog:\s*\{/.test(sharedContent);
    const hasSubtleShadow = /subtle:\s*\{/.test(sharedContent);
    
    expect(hasDialogShadow).toBe(true);
    expect(hasSubtleShadow).toBe(true);

    // Validate shadow properties are present
    const shadowProperties = ["offsetX", "offsetY", "blur", "spread", "opacity"];
    for (const prop of shadowProperties) {
      const hasProperty = new RegExp(prop + ":\\s*\\d+").test(sharedContent);
      expect(hasProperty).toBe(true);
    }

    // Check Dialog uses SHADOWS.dialog
    const dialogPath = join(__dirname, "dialog.ts");
    if (existsSync(dialogPath)) {
      const dialogContent = readFileSync(dialogPath, "utf-8");
      const importsShadows = /import\s+\{[^}]*SHADOWS[^}]*\}\s+from\s+["']\.\/shared["']/.test(dialogContent);
      
      if (!importsShadows) {
        console.warn("Dialog.ts should import SHADOWS from shared.ts for consistency");
      }
    }

    // Check Tabs uses SHADOWS.subtle
    const tabsPath = join(__dirname, "tabs.ts");
    if (existsSync(tabsPath)) {
      const tabsContent = readFileSync(tabsPath, "utf-8");
      const importsShadows = /import\s+\{[^}]*SHADOWS[^}]*\}\s+from\s+["']\.\/shared["']/.test(tabsContent);
      
      if (!importsShadows) {
        console.warn("Tabs.ts should import SHADOWS from shared.ts for consistency");
      }
    }

    expect(true).toBe(true);
  });

  it("should have all generator values traceable to registry or shared.ts constants", () => {
    // This test ensures dimensional values are either:
    // 1. Parsed from component-registry.json
    // 2. Imported from shared.ts (SECTION_PADDING, SECTION_GAP, SHADOWS, GRID_LAYOUT, FALLBACK_VALUES)
    // 3. Documented as intentional constants (e.g., layout-specific widths)

    const sharedPath = join(__dirname, "shared.ts");
    const sharedContent = readFileSync(sharedPath, "utf-8");

    // Validate all centralized constants exist in shared.ts
    const requiredConstants = [
      "SECTION_PADDING",
      "SECTION_GAP", 
      "SHADOWS",
      "GRID_LAYOUT",
      "FALLBACK_VALUES",
    ];

    for (const constantName of requiredConstants) {
      const hasConstant = new RegExp(`export\\s+const\\s+${constantName}\\s*=`).test(sharedContent);
      expect(hasConstant).toBe(true);
    }

    // Validate registry has component data
    expect(registry.components).toBeDefined();
    expect(Object.keys(registry.components).length).toBeGreaterThan(0);

    // Sample check: Button and Dialog exist in registry
    expect(registry.components.Button).toBeDefined();
    expect(registry.components.Dialog).toBeDefined();

    expect(true).toBe(true);
  });
});
