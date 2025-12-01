/**
 * Component Metadata Generator for AI/Agent Consumption
 *
 * This script auto-discovers components from the filesystem and uses
 * ts-json-schema-generator to derive props directly from TypeScript types,
 * then enriches with variant descriptions from KUMO_*_VARIANTS.
 *
 * Components are auto-discovered from src/components/ subdirectories.
 * Each component must export KUMO_<NAME>_VARIANTS and KUMO_<NAME>_DEFAULT_VARIANTS
 *
 * Run: pnpm build:ai-metadata
 * Output: dist/ai/component-registry.json
 */

import { writeFileSync, mkdirSync, readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import * as tsj from "ts-json-schema-generator";
import type { Definition } from "ts-json-schema-generator";
import { extractAllExamples } from "./extract-story-examples";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, "../../src/components");
const blocksDir = join(__dirname, "../../src/blocks");
const rootDir = join(__dirname, "../..");

// =============================================================================
// Component configuration - maps component to its props type and metadata
// =============================================================================

interface ComponentConfig {
  name: string;
  /** Override props type name. Defaults to `${name}Props` */
  propsType?: string;
  /** Source file path relative to source dir */
  sourceFile: string;
  /** Directory name (kebab-case) */
  dirName: string;
  /** Base source directory (components or blocks) */
  sourceDir: string;
  description: string;
  category: string;
  /**
   * Manually curated examples. If not provided, examples are auto-extracted
   * from the component's .stories.tsx file (excluding propTester stories).
   * Set to empty array [] to explicitly have no examples.
   */
  examples?: readonly string[];
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  variants: Record<string, Record<string, any>>;
  defaults: Record<string, string>;
}

// =============================================================================
// Component metadata overrides (for special cases)
// Most components are auto-discovered from index.ts exports
// =============================================================================

interface ComponentOverride {
  /** Override description */
  description?: string;
  /** Override category */
  category?: string;
}

/**
 * Overrides for component metadata that can't be auto-detected.
 * Key is the directory name (kebab-case).
 * Note: Component names and props types are now auto-detected from index.ts exports.
 */
const COMPONENT_OVERRIDES: Record<string, ComponentOverride> = {
  // Add overrides here only for description/category if needed
};

/**
 * Category mappings based on component type.
 * Key is the directory name (kebab-case).
 */
const CATEGORY_MAP: Record<string, string> = {
  // Action
  button: "Action",
  "clipboard-text": "Action",
  // Display
  badge: "Display",
  code: "Display",
  expandable: "Display",
  "layer-card": "Display",
  meter: "Display",
  text: "Display",
  // Feedback
  banner: "Feedback",
  loader: "Feedback",
  toast: "Feedback",
  // Input
  checkbox: "Input",
  combobox: "Input",
  "date-range-picker": "Input",
  field: "Input",
  input: "Input",
  select: "Input",
  switch: "Input",
  // Layout
  surface: "Layout",
  // Navigation
  menubar: "Navigation",
  pagination: "Navigation",
  tabs: "Navigation",
  // Overlay
  dialog: "Overlay",
  dropdown: "Overlay",
  tooltip: "Overlay",
  // Blocks
  breadcrumbs: "Block",
  empty: "Block",
  "page-header": "Block",
};

/** Convert kebab-case to PascalCase: "clipboard-text" → "ClipboardText" */
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// =============================================================================
// Auto-detect component names and props from index.ts exports
// =============================================================================

interface DetectedExports {
  /** Main component name (first PascalCase export) */
  componentName: string | null;
  /** Props type name if exported */
  propsType: string | null;
}

/**
 * Parse index.ts to detect the main component name and props type.
 * This eliminates the need for manual overrides for naming conventions.
 *
 * Detection rules:
 * 1. Component name: First PascalCase named export (not a type)
 * 2. Props type: First export matching *Props pattern
 */
function detectExportsFromIndex(dirPath: string): DetectedExports {
  const indexPath = join(dirPath, "index.ts");
  const result: DetectedExports = { componentName: null, propsType: null };

  if (!existsSync(indexPath)) {
    return result;
  }

  try {
    const content = readFileSync(indexPath, "utf-8");

    // Match named exports: export { Foo, Bar, type BazProps } from "./file"
    // Also handles: export { Foo } from "./file"
    const exportPattern = /export\s*\{([^}]+)\}/g;
    let match: RegExpExecArray | null;

    const namedExports: string[] = [];
    const typeExports: string[] = [];

    while ((match = exportPattern.exec(content)) !== null) {
      const exportList = match[1];
      // Split by comma and process each export
      const items = exportList.split(",").map((s) => s.trim()).filter(Boolean);

      for (const item of items) {
        // Check if it's a type export: "type FooProps"
        const typeMatch = item.match(/^type\s+(\w+)/);
        if (typeMatch) {
          typeExports.push(typeMatch[1]);
        } else {
          // Regular named export, could have "as" alias: "Foo as Bar"
          const nameMatch = item.match(/^(\w+)/);
          if (nameMatch) {
            namedExports.push(nameMatch[1]);
          }
        }
      }
    }

    // Also match direct exports: export const Foo = ...
    const directExportPattern = /export\s+(?:const|function)\s+(\w+)/g;
    while ((match = directExportPattern.exec(content)) !== null) {
      namedExports.push(match[1]);
    }

    // Find main component: first PascalCase export that's not a type/hook/constant
    for (const name of namedExports) {
      // Skip hooks (useXxx), constants (SCREAMING_CASE), and lowercase names
      if (
        name.startsWith("use") ||
        name === name.toUpperCase() ||
        name[0] !== name[0].toUpperCase()
      ) {
        continue;
      }
      // Skip variant functions (xxxVariants)
      if (name.endsWith("Variants")) {
        continue;
      }
      result.componentName = name;
      break;
    }

    // Find props type: look for ComponentNameProps or any *Props export
    if (result.componentName) {
      // First try exact match: ComponentNameProps
      const exactPropsType = `${result.componentName}Props`;
      if (typeExports.includes(exactPropsType)) {
        result.propsType = exactPropsType;
      }
    }

    // If no exact match, look for any *Props type
    if (!result.propsType) {
      const propsType = typeExports.find((t) => t.endsWith("Props"));
      if (propsType) {
        result.propsType = propsType;
      }
    }

    return result;
  } catch {
    return result;
  }
}

/**
 * Detect props type from the main component file by looking for exported interfaces/types.
 * Falls back to standard naming convention if not found in index.ts.
 */
function detectPropsTypeFromFile(filePath: string, componentName: string): string | null {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for exported interface/type that ends with Props
    // Pattern: export interface FooProps or export type FooProps
    const propsPattern = /export\s+(?:interface|type)\s+(\w+Props)/g;
    const propsTypes: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = propsPattern.exec(content)) !== null) {
      propsTypes.push(match[1]);
    }

    // Prefer exact match: ComponentNameProps
    const exactMatch = `${componentName}Props`;
    if (propsTypes.includes(exactMatch)) {
      return exactMatch;
    }

    // Otherwise return first Props type found
    return propsTypes[0] || null;
  } catch {
    return null;
  }
}

/** Convert PascalCase to SCREAMING_SNAKE_CASE: "ClipboardText" → "CLIPBOARD_TEXT" */
function toScreamingSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toUpperCase();
}

/** Derive propsType from component name */
function getPropsType(config: ComponentConfig): string {
  return config.propsType ?? `${config.name}Props`;
}

/** Derive sourceFile from component name */
function getSourceFile(config: ComponentConfig): string {
  return config.sourceFile;
}

// =============================================================================
// Auto-discover components from filesystem
// =============================================================================

/**
 * Discover all component directories in a given source directory.
 * Returns array of directory names (kebab-case)
 */
function discoverDirs(sourceDir: string): string[] {
  const entries = readdirSync(sourceDir);
  return entries.filter((entry) => {
    const fullPath = join(sourceDir, entry);
    if (!statSync(fullPath).isDirectory()) return false;
    // Check if main component file exists
    const mainFile = join(fullPath, `${entry}.tsx`);
    return existsSync(mainFile);
  });
}

/**
 * Discover all component directories in src/components/
 * Returns array of directory names (kebab-case)
 */
function discoverComponentDirs(): string[] {
  return discoverDirs(componentsDir);
}

/**
 * Discover all block directories in src/blocks/
 * Returns array of directory names (kebab-case)
 */
function discoverBlockDirs(): string[] {
  return discoverDirs(blocksDir);
}

/**
 * Extract a balanced brace block starting from a position in the string.
 * Returns the content between the outermost braces.
 */
function extractBalancedBraces(content: string, startIndex: number): string | null {
  let depth = 0;
  let start = -1;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        return content.substring(start, i + 1);
      }
    }
  }
  return null;
}

/**
 * Extract KUMO_*_VARIANTS and KUMO_*_DEFAULT_VARIANTS from a component file.
 * Uses regex parsing to avoid import issues with JSX/React dependencies.
 */
function extractVariantsFromFile(
  filePath: string,
): {
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  variants: Record<string, Record<string, any>>;
  defaults: Record<string, string>;
} | null {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Find KUMO_*_VARIANTS export start position
    const variantsStartMatch = content.match(
      /export\s+const\s+KUMO_\w+_VARIANTS\s*=\s*/,
    );
    // Find KUMO_*_DEFAULT_VARIANTS export start position
    const defaultsStartMatch = content.match(
      /export\s+const\s+KUMO_\w+_DEFAULT_VARIANTS\s*=\s*/,
    );

    if (!variantsStartMatch || !defaultsStartMatch) {
      return null;
    }

    // Extract balanced brace content for variants
    const variantsStartIndex = (variantsStartMatch.index ?? 0) + variantsStartMatch[0].length;
    const variantsBlock = extractBalancedBraces(content, variantsStartIndex);

    // Extract balanced brace content for defaults
    const defaultsStartIndex = (defaultsStartMatch.index ?? 0) + defaultsStartMatch[0].length;
    const defaultsBlock = extractBalancedBraces(content, defaultsStartIndex);

    if (!variantsBlock || !defaultsBlock) {
      return null;
    }

    // Parse the variants object
    const variants = parseVariantsObject(variantsBlock);
    const defaults = parseDefaultsObject(defaultsBlock);

    return { variants, defaults };
  } catch {
    return null;
  }
}

/**
 * Parse a variants object string into a structured object.
 * Extracts variant keys and their descriptions.
 */
// biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
function parseVariantsObject(objStr: string): Record<string, Record<string, any>> {
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  const result: Record<string, Record<string, any>> = {};

  // Find top-level property names (e.g., shape, size, variant)
  // These are identifiers followed by `: {` at the first nesting level
  const topLevelPropPattern = /^\s*(\w+)\s*:\s*\{/gm;
  let propMatch: RegExpExecArray | null;

  while ((propMatch = topLevelPropPattern.exec(objStr)) !== null) {
    const propName = propMatch[1];

    // Skip nested properties like classes, description
    if (["classes", "description"].includes(propName)) continue;

    // Extract the balanced brace block for this property
    const propStartIndex = propMatch.index + propMatch[0].length - 1; // Start at the {
    const propBlock = extractBalancedBraces(objStr, propStartIndex);

    if (!propBlock) continue;

    // Now parse the variant values within this block
    // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
    const variants: Record<string, any> = {};
    const variantPropPattern = /^\s*(\w+)\s*:\s*\{/gm;
    let variantMatch: RegExpExecArray | null;

    while ((variantMatch = variantPropPattern.exec(propBlock)) !== null) {
      const variantName = variantMatch[1];

      // Skip nested properties
      if (["classes", "description"].includes(variantName)) continue;

      // Extract the balanced brace block for this variant
      const variantStartIndex = variantMatch.index + variantMatch[0].length - 1;
      const variantBlock = extractBalancedBraces(propBlock, variantStartIndex);

      if (!variantBlock) continue;

      // Extract description if present
      const descMatch = variantBlock.match(/description\s*:\s*["']([^"']*)["']/);
      variants[variantName] = {
        description: descMatch ? descMatch[1] : undefined,
      };
    }

    if (Object.keys(variants).length > 0) {
      result[propName] = variants;
    }
  }

  return result;
}

/**
 * Parse a defaults object string into a key-value map.
 */
function parseDefaultsObject(objStr: string): Record<string, string> {
  const result: Record<string, string> = {};

  // Match properties like: variant: "primary", size: "base"
  const propPattern = /(\w+)\s*:\s*["']([^"']*)["']/g;
  let match: RegExpExecArray | null;

  while ((match = propPattern.exec(objStr)) !== null) {
    result[match[1]] = match[2];
  }

  return result;
}

/**
 * Extract component description from JSDoc comment or generate a default one.
 */
function extractDescription(filePath: string, componentName: string): string {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for JSDoc comment before the main component function/const
    const jsdocPattern = new RegExp(
      `/\\*\\*[\\s\\S]*?\\*/\\s*(?:export\\s+)?(?:function|const)\\s+${componentName}`,
    );
    const match = content.match(jsdocPattern);

    if (match) {
      // Extract description from JSDoc
      const descMatch = match[0].match(/\*\s+([^@*][^\n]*)/g);
      if (descMatch) {
        return descMatch
          .map((line) => line.replace(/^\*\s*/, "").trim())
          .filter((line) => line.length > 0)
          .join(" ");
      }
    }

    // Generate default description from component name
    return `${componentName} component`;
  } catch {
    return `${componentName} component`;
  }
}

/**
 * Auto-discover and build configurations from a source directory.
 * Component/block names and props types are detected from index.ts exports.
 */
async function discoverFromDir(sourceDir: string, type: "component" | "block"): Promise<ComponentConfig[]> {
  const dirs = discoverDirs(sourceDir);
  const configs: ComponentConfig[] = [];

  console.log(`Discovering ${type}s from ${sourceDir}...`);

  for (const dirName of dirs) {
    const dirPath = join(sourceDir, dirName);
    const mainFile = join(dirPath, `${dirName}.tsx`);
    const override = COMPONENT_OVERRIDES[dirName] || {};

    // Auto-detect component name and props type from index.ts
    const detected = detectExportsFromIndex(dirPath);

    // Determine component name: detected from index.ts, or fallback to PascalCase of dir name
    const baseName = toPascalCase(dirName);
    const componentName = detected.componentName || baseName;

    // Determine props type: detected from index.ts, then from main file, then convention
    let propsType = detected.propsType;
    if (!propsType) {
      propsType = detectPropsTypeFromFile(mainFile, componentName);
    }
    // Final fallback: standard convention
    if (!propsType) {
      propsType = `${componentName}Props`;
    }

    // Extract variants from file
    const variantsData = extractVariantsFromFile(mainFile);
    if (!variantsData) {
      console.warn(`Warning: Could not extract variants from ${dirName}, skipping...`);
      continue;
    }

    // Determine category
    const category = override.category || CATEGORY_MAP[dirName] || "Other";

    // Extract or generate description
    const description =
      override.description || extractDescription(mainFile, componentName);

    console.log(`  ${dirName} → ${componentName} (props: ${propsType})`);

    configs.push({
      name: componentName,
      propsType,
      sourceFile: `${dirName}/${dirName}.tsx`,
      dirName,
      sourceDir,
      description,
      category,
      variants: variantsData.variants,
      defaults: variantsData.defaults,
    });
  }

  return configs;
}

/**
 * Auto-discover and build component configurations from filesystem.
 * Discovers both components and blocks.
 */
async function discoverComponents(): Promise<ComponentConfig[]> {
  const componentConfigs = await discoverFromDir(componentsDir, "component");
  const blockConfigs = await discoverFromDir(blocksDir, "block");
  
  const allConfigs = [...componentConfigs, ...blockConfigs];
  console.log(`Discovered ${componentConfigs.length} components and ${blockConfigs.length} blocks`);

  // Sort by name for consistent output
  return allConfigs.sort((a, b) => a.name.localeCompare(b.name));
}

// =============================================================================
// Types for the generated registry
// =============================================================================

interface PropSchema {
  type: string;
  required?: boolean;
  optional?: boolean;
  default?: string;
  description?: string;
  values?: readonly string[];
  descriptions?: Record<string, string>;
}

interface ComponentSchema {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropSchema>;
  examples: readonly string[];
  colors: string[];
}

interface ComponentRegistry {
  version: string;
  generatedAt: string;
  components: Record<string, ComponentSchema>;
  // MCP-friendly helpers
  search: {
    byCategory: Record<string, string[]>;
    byName: string[];
  };
}

// =============================================================================
// Extract semantic color classes from component source files
// =============================================================================

/**
 * Parse kumo-theme.css to extract semantic color names from --color-* and --text-color-* variables.
 * Excludes raw palette colors (e.g., --color-red-650, --color-neutral-50) which have numeric suffixes.
 */
function parseSemanticColorNames(): string[] {
  const themePath = join(__dirname, "../../src/styles/kumo-theme.css");
  const content = readFileSync(themePath, "utf-8");

  const colorNames = new Set<string>();

  // Match semantic color variable declarations that use light-dark()
  // Pattern: "--color-<name>: light-dark(" or "--text-color-<name>: light-dark("
  // This excludes raw palette colors which are defined with direct values like "oklch(...)"
  const semanticColorPattern =
    /--(?:text-)?color-([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*light-dark\(/g;
  let match: RegExpExecArray | null;

  while ((match = semanticColorPattern.exec(content)) !== null) {
    colorNames.add(match[1]);
  }

  return [...colorNames].sort();
}

// Semantic color names derived from kumo-theme.css (--color-* and --text-color-*)
const SEMANTIC_COLOR_NAMES = parseSemanticColorNames();

// Utility prefixes that use color tokens
const COLOR_UTILITY_PREFIXES = ["text", "bg", "ring", "outline", "fill", "border"];

function extractSemanticColors(sourceFile: string): string[] {
  try {
    const content = readFileSync(sourceFile, "utf-8");
    const matches: string[] = [];

    // Build regex pattern for each prefix + semantic color combination
    // Match patterns like: text-surface, bg-primary, border-color, ring-border
    // Also handles variants like: hover:bg-primary, disabled:text-muted
    for (const prefix of COLOR_UTILITY_PREFIXES) {
      for (const colorName of SEMANTIC_COLOR_NAMES) {
        // Escape hyphens for regex and create pattern
        const pattern = new RegExp(
          `(?:[\\w\\[\\]=_-]+:)*(${prefix}-${colorName})(?![a-zA-Z0-9-])`,
          "g",
        );
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(content)) !== null) {
          matches.push(match[1]);
        }
      }
    }

    return [...new Set(matches)].sort();
  } catch {
    return [];
  }
}

// =============================================================================
// Convert JSON Schema to PropSchema
// =============================================================================

function jsonSchemaTypeToString(def: Definition): string {
  if (def.$ref) {
    // Extract type name from $ref like "#/definitions/ReactNode"
    const refName = def.$ref.split("/").pop() || "unknown";
    // Simplify common React types
    if (refName.includes("ReactNode") || refName.includes("ReactElement")) {
      return "ReactNode";
    }
    return refName;
  }
  if (def.enum) {
    return "enum";
  }
  if (def.type === "array") {
    const itemType = def.items
      ? jsonSchemaTypeToString(def.items as Definition)
      : "unknown";
    return `${itemType}[]`;
  }
  if (def.anyOf || def.oneOf) {
    const types = (def.anyOf || def.oneOf) as Definition[];
    const typeStrings = types
      .map((t) => jsonSchemaTypeToString(t))
      .filter((t) => t !== "undefined" && t !== "null");
    // Simplify if it includes ReactNode variants
    if (typeStrings.some((t) => t.includes("React"))) {
      return "ReactNode";
    }
    return typeStrings.join(" | ");
  }
  if (def.type) {
    return Array.isArray(def.type) ? def.type.join(" | ") : def.type;
  }
  return "unknown";
}

function convertToPropSchema(
  propName: string,
  def: Definition,
  required: boolean,
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  variants?: Record<string, Record<string, any>>,
  defaults?: Record<string, string>,
): PropSchema {
  const prop: PropSchema = {
    type: jsonSchemaTypeToString(def),
  };

  if (required) {
    prop.required = true;
  } else {
    prop.optional = true;
  }

  if (def.description) {
    prop.description = def.description;
  }

  // Handle enums - either from JSON schema or from variants
  if (def.enum) {
    prop.values = def.enum as string[];
  }

  // Enrich with variant descriptions if this prop is a variant
  if (variants && propName in variants) {
    const variantDef = variants[propName];
    prop.values = Object.keys(variantDef);
    prop.type = "enum";

    const descriptions: Record<string, string> = {};
    for (const [key, val] of Object.entries(variantDef)) {
      if (val.description) {
        descriptions[key] = val.description;
      }
    }
    if (Object.keys(descriptions).length > 0) {
      prop.descriptions = descriptions;
    }
  }

  // Add default value from variants defaults
  if (defaults && propName in defaults) {
    prop.default = defaults[propName];
  }

  return prop;
}

// =============================================================================
// Generate props from TypeScript types using ts-json-schema-generator
// =============================================================================

function generatePropsFromType(
  config: ComponentConfig,
): Record<string, PropSchema> {
  const sourceFile = getSourceFile(config);
  const propsType = getPropsType(config);
  const sourcePath = join(config.sourceDir, sourceFile);

  try {
    const tsjConfig: tsj.Config = {
      path: sourcePath,
      tsconfig: join(rootDir, "tsconfig.json"),
      type: propsType,
      skipTypeCheck: true,
      expose: "all",
    };

    const schema = tsj.createGenerator(tsjConfig).createSchema(propsType);
    const props: Record<string, PropSchema> = {};

    // Get the main type definition
    const mainDef = schema.definitions?.[propsType] as Definition;
    if (!mainDef) {
      console.warn(`Warning: Could not find type ${propsType}`);
      return {};
    }

    // Handle intersection types (allOf) - merge all properties
    // biome-ignore lint/suspicious/noExplicitAny: JSON Schema types are complex
    let allProperties: Record<string, any> = {};
    let allRequired: string[] = [];

    if (mainDef.allOf) {
      for (const part of mainDef.allOf as Definition[]) {
        if (part.$ref) {
          const refName = part.$ref.split("/").pop()!;
          const refDef = schema.definitions?.[refName] as Definition;
          if (refDef?.properties) {
            allProperties = { ...allProperties, ...refDef.properties };
          }
          if (refDef?.required) {
            allRequired = [...allRequired, ...(refDef.required as string[])];
          }
        } else if (part.properties) {
          allProperties = { ...allProperties, ...part.properties };
          if (part.required) {
            allRequired = [...allRequired, ...(part.required as string[])];
          }
        }
      }
    } else if (mainDef.properties) {
      allProperties = mainDef.properties;
      allRequired = (mainDef.required as string[]) || [];
    }

    // Convert each property
    for (const [propName, propDef] of Object.entries(allProperties)) {
      // Skip internal React props we don't want to expose
      if (
        propName.startsWith("aria-") ||
        propName.startsWith("data-") ||
        ["key", "ref", "style"].includes(propName)
      ) {
        continue;
      }

      props[propName] = convertToPropSchema(
        propName,
        propDef as Definition,
        allRequired.includes(propName),
        config.variants,
        config.defaults,
      );
    }

    return props;
  } catch (error) {
    console.warn(
      `Warning: Could not generate schema for ${getPropsType(config)}:`,
      error,
    );
    return {};
  }
}

// =============================================================================
// Generate the registry
// =============================================================================

async function generateRegistry(): Promise<ComponentRegistry> {
  // Auto-discover components from filesystem
  const COMPONENTS = await discoverComponents();
  console.log(`Discovered ${COMPONENTS.length} components`);

  const components: Record<string, ComponentSchema> = {};
  const byCategory: Record<string, string[]> = {};

  // Build variant constants map for propTester parsing
  // Maps "KUMO_*_VARIANTS.propName" to their variant keys
  // e.g., "KUMO_BUTTON_VARIANTS.variant" -> ["primary", "secondary", ...]
  // e.g., "KUMO_BUTTON_VARIANTS.size" -> ["xs", "sm", "base", "lg"]
  const variantConstants = new Map<string, string[]>();
  for (const config of COMPONENTS) {
    // Derive the constant name from the component name
    const constName = `KUMO_${toScreamingSnakeCase(config.name)}_VARIANTS`;
    // Map each variant prop (variant, size, shape, etc.)
    for (const [propName, propVariants] of Object.entries(config.variants)) {
      if (typeof propVariants === "object" && propVariants !== null) {
        variantConstants.set(`${constName}.${propName}`, Object.keys(propVariants));
      }
    }
  }

  // Extract examples from all story files
  const storyExamples = extractAllExamples(variantConstants);

  for (const config of COMPONENTS) {
    console.log(`Processing ${config.name}...`);

    const props = generatePropsFromType(config);
    const colors = extractSemanticColors(
      join(config.sourceDir, getSourceFile(config)),
    );

    // Determine examples: use manual if provided, otherwise auto-extract from stories
    let examples: readonly string[];
    if (config.examples !== undefined) {
      // Manual examples provided (could be empty array for explicit "no examples")
      examples = config.examples;
    } else {
      // Auto-extract from stories
      const extracted = storyExamples.get(config.name);
      examples = extracted?.aiExamples ?? [];
      if (examples.length > 0) {
        console.log(`  → Auto-extracted ${examples.length} examples from stories`);
      }
    }

    components[config.name] = {
      name: config.name,
      description: config.description,
      importPath: "@cloudflare/kumo",
      category: config.category,
      props,
      examples,
      colors,
    };

    if (!byCategory[config.category]) {
      byCategory[config.category] = [];
    }
    byCategory[config.category].push(config.name);
  }

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    components,
    search: {
      byCategory,
      byName: COMPONENTS.map((c) => c.name),
    },
  };
}

// =============================================================================
// Generate AI context string (markdown format for LLM consumption)
// =============================================================================

function generateAIContext(registry: ComponentRegistry): string {
  let context = `# Kumo Component Registry

> Auto-generated component metadata for AI/agent consumption.
> Generated: ${registry.generatedAt}

## Available Components

`;

  for (const [name, comp] of Object.entries(registry.components)) {
    context += `### ${name}\n\n`;
    context += `${comp.description}\n\n`;
    context += `**Import:** \`import { ${name} } from "${comp.importPath}";\`\n\n`;
    context += `**Category:** ${comp.category}\n\n`;

    context += `**Props:**\n`;
    for (const [propName, prop] of Object.entries(comp.props)) {
      const required = prop.required ? " (required)" : "";
      const defaultVal = prop.default ? ` [default: ${prop.default}]` : "";
      context += `- \`${propName}\`: ${prop.type}${required}${defaultVal}\n`;

      if (prop.values && prop.descriptions) {
        for (const val of prop.values) {
          const desc = prop.descriptions[val];
          if (desc) {
            context += `  - \`"${val}"\`: ${desc}\n`;
          }
        }
      } else if (prop.description) {
        context += `  ${prop.description}\n`;
      }
    }

    if (comp.colors.length > 0) {
      context += `\n**Colors (kumo tokens used):**\n`;
      context += `\`${comp.colors.join("`, `")}\`\n`;
    }

    context += `\n**Examples:**\n`;
    for (const example of comp.examples) {
      context += `\`\`\`tsx\n${example}\n\`\`\`\n`;
    }
    context += "\n---\n\n";
  }

  context += `## Quick Reference

**Components by Category:**
`;
  for (const [category, names] of Object.entries(registry.search.byCategory)) {
    context += `- **${category}:** ${names.join(", ")}\n`;
  }

  return context;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const registry = await generateRegistry();
  const aiContext = generateAIContext(registry);

  // Ensure output directory exists
  const outputDir = join(__dirname, "../../dist/ai");
  mkdirSync(outputDir, { recursive: true });

  // Write JSON registry
  const jsonPath = join(outputDir, "component-registry.json");
  writeFileSync(jsonPath, JSON.stringify(registry, null, 2));
  console.log(`✓ Generated ${jsonPath}`);

  // Write markdown context for LLMs
  const mdPath = join(outputDir, "component-registry.md");
  writeFileSync(mdPath, aiContext);
  console.log(`✓ Generated ${mdPath}`);

  // Also output to stdout for piping
  console.log("\n--- Generated Registry Summary ---");
  console.log(`Components: ${registry.search.byName.join(", ")}`);
  console.log(
    `Categories: ${Object.keys(registry.search.byCategory).join(", ")}`,
  );
}

main().catch(console.error);
