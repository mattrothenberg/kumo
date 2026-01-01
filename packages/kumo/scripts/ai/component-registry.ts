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
 * Output: ai/component-registry.json (committed to git)
 */

import {
  writeFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as tsj from "ts-json-schema-generator";
import * as ts from "typescript";
import type { Definition } from "ts-json-schema-generator";
import { extractAllExamples } from "./extract-story-examples";
import { generateStyleGuideMarkdown } from "./color-style-guide";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, "../../src/components");
const blocksDir = join(__dirname, "../../src/blocks");
const rootDir = join(__dirname, "../..");

/**
 * Component type based on source directory.
 * - component: Base UI primitives (button, input, dialog)
 * - block: Composite components (breadcrumbs, page-header, empty)
 */
export type ComponentType = "component" | "block";

// =============================================================================
// Component configuration - maps component to its props type and metadata
// =============================================================================

interface SubComponentConfig {
  /** Sub-component name (e.g., "Root", "Trigger", "Content") */
  name: string;
  /** Props type name if available */
  propsType: string | null;
  /** Description extracted from JSDoc or generated */
  description: string;
  /** Whether this is a pass-through to a base library component */
  isPassThrough: boolean;
  /** Base library component reference (e.g., "DialogBase.Root") */
  baseComponent?: string;
}

interface ComponentConfig {
  name: string;
  /** Override props type name. Defaults to `${name}Props` */
  propsType?: string;
  /** Source file path relative to source dir */
  sourceFile: string;
  /** Directory name (kebab-case) */
  dirName: string;
  /** Base source directory (components, blocks, layouts, or pages) */
  sourceDir: string;
  /** Component type based on source directory */
  type: ComponentType;
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
  /**
   * Base Tailwind classes applied to all variants.
   * Extracted from KUMO_*_BASE_STYLES constant if present.
   */
  baseStyles?: string;
  /** Sub-components for compound component patterns (e.g., Dialog.Root, Dialog.Trigger) */
  subComponents?: SubComponentConfig[];
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
const COMPONENT_OVERRIDES: Record<string, ComponentOverride> = {};

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
  collapsible: "Display",
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
      const items = exportList
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      for (const item of items) {
        // Check if it's a type export: "type FooProps" or "type Foo as Bar"
        const typeMatch = item.match(/^type\s+(\w+)(?:\s+as\s+(\w+))?/);
        if (typeMatch) {
          // Use aliased name if present, otherwise original name
          typeExports.push(typeMatch[2] || typeMatch[1]);
        } else {
          // Regular named export, could have "as" alias: "Foo as Bar"
          const nameMatch = item.match(/^(\w+)(?:\s+as\s+(\w+))?/);
          if (nameMatch) {
            // Use aliased name if present, otherwise original name
            namedExports.push(nameMatch[2] || nameMatch[1]);
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
 * Detect props type from the main component file by looking for interfaces/types.
 * Checks both exported and non-exported types since many components use internal type aliases.
 * Falls back to standard naming convention if not found in index.ts.
 */
function detectPropsTypeFromFile(
  filePath: string,
  componentName: string,
): string | null {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for interface/type that ends with Props (both exported and non-exported)
    // Pattern: [export] interface FooProps or [export] type FooProps
    const exportedPropsPattern = /export\s+(?:interface|type)\s+(\w+Props)/g;
    const nonExportedPropsPattern =
      /(?:^|\n)\s*(?:interface|type)\s+(\w+Props)\s*[=<{]/g;

    const exportedTypes: string[] = [];
    const nonExportedTypes: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = exportedPropsPattern.exec(content)) !== null) {
      exportedTypes.push(match[1]);
    }

    while ((match = nonExportedPropsPattern.exec(content)) !== null) {
      // Skip if it's actually exported (already captured above)
      if (!exportedTypes.includes(match[1])) {
        nonExportedTypes.push(match[1]);
      }
    }

    // Prefer exact match: ComponentNameProps (check exported first, then non-exported)
    const exactMatch = `${componentName}Props`;
    if (exportedTypes.includes(exactMatch)) {
      return exactMatch;
    }
    if (nonExportedTypes.includes(exactMatch)) {
      return exactMatch;
    }

    // Otherwise return first Props type found (prefer exported)
    return exportedTypes[0] || nonExportedTypes[0] || null;
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
 * Extract state-specific classes from a class string.
 * Identifies hover:*, focus:*, active:*, disabled:*, not-disabled:* prefixes.
 * Also handles complex selectors like [&:hover>span], [&:focus-within>span].
 */
function extractStateClasses(classString: string): Record<string, string> {
  const states: Record<string, string> = {};

  // Split by whitespace to process each class individually
  const classes = classString.split(/\s+/);

  for (const cls of classes) {
    if (!cls) continue;

    // Check for hover states
    if (cls.startsWith("hover:") || cls.match(/^\[&:hover[^\]]*\]:/)) {
      states.hover = states.hover ? `${states.hover} ${cls}` : cls;
    }
    // Check for focus states (focus, focus-visible, focus-within)
    else if (
      cls.match(/^(focus|focus-visible|focus-within):/) ||
      cls.match(/^\[&:focus(-visible|-within)?[^\]]*\]:/)
    ) {
      states.focus = states.focus ? `${states.focus} ${cls}` : cls;
    }
    // Check for active state
    else if (cls.startsWith("active:")) {
      states.active = states.active ? `${states.active} ${cls}` : cls;
    }
    // Check for disabled state
    else if (cls.startsWith("disabled:")) {
      states.disabled = states.disabled ? `${states.disabled} ${cls}` : cls;
    }
    // Check for not-disabled state
    else if (cls.startsWith("not-disabled:")) {
      states["not-disabled"] = states["not-disabled"]
        ? `${states["not-disabled"]} ${cls}`
        : cls;
    }
    // Check for data-state
    else if (cls.match(/^data-\[state=[^\]]+\]:/)) {
      states["data-state"] = states["data-state"]
        ? `${states["data-state"]} ${cls}`
        : cls;
    }
  }

  return states;
}

/**
 * Extract a balanced brace block starting from a position in the string.
 * Returns the content between the outermost braces.
 */
function extractBalancedBraces(
  content: string,
  startIndex: number,
): string | null {
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
 * Extract KUMO_*_BASE_STYLES from a component file.
 * Returns the base styles string or null if not found.
 */
function extractBaseStylesFromFile(filePath: string): string | null {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Match: export const KUMO_*_BASE_STYLES = "..." or '...' or `...`
    // Handles multi-line strings with template literals
    const baseStylesMatch = content.match(
      /export\s+const\s+KUMO_\w+_BASE_STYLES\s*=\s*["'`]([^"'`]+)["'`]/,
    );

    if (baseStylesMatch) {
      return baseStylesMatch[1].trim();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract KUMO_*_VARIANTS and KUMO_*_DEFAULT_VARIANTS from a component file.
 * Uses regex parsing to avoid import issues with JSX/React dependencies.
 */
function extractVariantsFromFile(filePath: string): {
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  variants: Record<string, Record<string, any>>;
  defaults: Record<string, string>;
  baseStyles: string | null;
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
    const variantsStartIndex =
      (variantsStartMatch.index ?? 0) + variantsStartMatch[0].length;
    const variantsBlock = extractBalancedBraces(content, variantsStartIndex);

    // Extract balanced brace content for defaults
    const defaultsStartIndex =
      (defaultsStartMatch.index ?? 0) + defaultsStartMatch[0].length;
    const defaultsBlock = extractBalancedBraces(content, defaultsStartIndex);

    if (!variantsBlock || !defaultsBlock) {
      return null;
    }

    // Parse the variants object (may be empty for components without variants)
    const variants = parseVariantsObject(variantsBlock);
    const defaults = parseDefaultsObject(defaultsBlock);

    // Extract base styles if present
    const baseStyles = extractBaseStylesFromFile(filePath);

    // Return even if variants is empty - component still has props to document
    return { variants, defaults, baseStyles };
  } catch {
    return null;
  }
}

/**
 * Parse a variants object string into a structured object.
 * Extracts variant keys and their descriptions.
 */
// biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
function parseVariantsObject(
  objStr: string,
): Record<string, Record<string, any>> {
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
    // Match variant names including quoted keys like "secondary-destructive"
    const variantPropPattern = /^\s*(?:"([^"]+)"|'([^']+)'|(\w+))\s*:\s*\{/gm;
    let variantMatch: RegExpExecArray | null;

    while ((variantMatch = variantPropPattern.exec(propBlock)) !== null) {
      // Capture group 1 = double-quoted, 2 = single-quoted, 3 = unquoted
      const variantName = variantMatch[1] || variantMatch[2] || variantMatch[3];

      // Skip nested properties
      if (["classes", "description"].includes(variantName)) continue;

      // Extract the balanced brace block for this variant
      const variantStartIndex = variantMatch.index + variantMatch[0].length - 1;
      const variantBlock = extractBalancedBraces(propBlock, variantStartIndex);

      if (!variantBlock) continue;

      // Extract description if present
      const descMatch = variantBlock.match(
        /description\s*:\s*["']([^"']*)["']/,
      );
      // Extract classes if present (for Figma plugin consumption)
      const classesMatch = variantBlock.match(/classes\s*:\s*["']([^"']*)["']/);

      // Extract state classes from the classes string
      const stateClasses = classesMatch
        ? extractStateClasses(classesMatch[1])
        : {};

      variants[variantName] = {
        description: descMatch ? descMatch[1] : undefined,
        ...(classesMatch && { classes: classesMatch[1] }),
        ...(Object.keys(stateClasses).length > 0 && { stateClasses }),
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
 * Looks for JSDoc directly before the component function/const declaration.
 */
function extractDescription(filePath: string, componentName: string): string {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for JSDoc comment immediately before the component function/const
    // Pattern: /** ... */ followed by export function ComponentName or export const ComponentName
    const jsdocPattern = new RegExp(
      `/\\*\\*\\s*\\n([\\s\\S]*?)\\*/\\s*\\n\\s*(?:export\\s+)?(?:function|const)\\s+${componentName}\\b`,
    );
    const match = content.match(jsdocPattern);

    if (match && match[1]) {
      // Extract description lines from JSDoc (lines starting with * but not @tags)
      const jsdocContent = match[1];
      const lines = jsdocContent
        .split("\n")
        .map((line) => line.replace(/^\s*\*\s?/, "").trim())
        .filter((line) => line.length > 0 && !line.startsWith("@"));

      if (lines.length > 0) {
        return lines.join(" ");
      }
    }

    // Generate default description from component name
    return `${componentName} component`;
  } catch {
    return `${componentName} component`;
  }
}

/**
 * Detect compound component sub-components from Object.assign patterns.
 * Parses patterns like:
 *   const Dialog = Object.assign(DialogContent, { Root: DialogBase.Root, Trigger: ... })
 *   Breadcrumb.Link = Link;
 */
function detectSubComponents(filePath: string): SubComponentConfig[] {
  try {
    const content = readFileSync(filePath, "utf-8");
    const subComponents: SubComponentConfig[] = [];

    // Pattern 1: Object.assign with sub-components
    // Find the start of Object.assign and then extract the balanced braces
    // Supports both simple names (Component) and dotted names (SomeBase.Root)
    const objectAssignStart = /Object\.assign\s*\(\s*[\w.]+\s*,\s*\{/g;
    let startMatch: RegExpExecArray | null;

    while ((startMatch = objectAssignStart.exec(content)) !== null) {
      // Find the opening brace position
      const braceStart = startMatch.index + startMatch[0].length - 1;
      const assignBlock = extractBalancedBraces(content, braceStart);

      if (!assignBlock) continue;

      // Extract sub-component assignments: SubName: Value or SubName: SomeBase.SubName
      // Handle multi-line with comments
      const subPattern = /^\s*(\w+)\s*[,:]/gm;
      let subMatch: RegExpExecArray | null;

      while ((subMatch = subPattern.exec(assignBlock)) !== null) {
        const subName = subMatch[1];

        // Skip common non-component patterns (lowercase keywords)
        // Sub-components should be PascalCase (start with uppercase)
        if (
          [
            "classes",
            "const",
            "let",
            "var",
            "function",
            "description",
          ].includes(subName) ||
          !subName.match(/^[A-Z]/)
        ) {
          continue;
        }

        // Find the value after the colon for this sub-component
        const valuePattern = new RegExp(
          `\\b${subName}\\s*:\\s*(\\w+(?:\\.\\w+)?)`,
        );
        const valueMatch = assignBlock.match(valuePattern);
        const value = valueMatch ? valueMatch[1] : subName;

        // Determine if it's a pass-through to a base library
        const isPassThrough = value.includes(".");
        const baseComponent = isPassThrough ? value : undefined;

        // Try to find props type for this sub-component
        let propsType: string | null = null;

        // Look for function signature or interface for this sub-component
        // Pattern: function SubName({ ... }: SubNameProps) or function SubName(props: SubNameProps)
        const funcPropsPattern = new RegExp(
          `function\\s+${value}\\s*(?:<[^>]*>)?\\s*\\([^)]*:\\s*(\\w+Props)`,
        );
        const funcMatch = content.match(funcPropsPattern);
        if (funcMatch) {
          propsType = funcMatch[1];
        }

        // Also check for inline type in PropsWithChildren pattern
        const propsWithChildrenPattern = new RegExp(
          `function\\s+${value}\\s*\\([^)]*:\\s*PropsWithChildren<\\{([^}]+)\\}>`,
        );
        const pwcMatch = content.match(propsWithChildrenPattern);
        if (pwcMatch && !propsType) {
          // Has inline props, we'll extract them later
          propsType = `${value}Props`;
        }

        // Generate description
        let description = `${subName} sub-component`;
        if (isPassThrough) {
          const baseName = baseComponent?.split(".")[0] || "";
          description = `${subName} sub-component (wraps ${baseName})`;
        }

        // Skip if already added (avoid duplicates)
        if (subComponents.some((sc) => sc.name === subName)) {
          continue;
        }

        subComponents.push({
          name: subName,
          propsType,
          description,
          isPassThrough,
          baseComponent,
        });
      }
    }

    // Pattern 2: Direct property assignment at module level (e.g., Breadcrumb.Link = Link)
    // Must be at start of line (module level) and sub-component name must be PascalCase
    const directAssignPattern = /^([A-Z]\w+)\.([A-Z]\w+)\s*=\s*(\w+)\s*;/gm;
    let directMatch: RegExpExecArray | null;

    while ((directMatch = directAssignPattern.exec(content)) !== null) {
      const subName = directMatch[2];
      const value = directMatch[3];

      // Skip displayName assignments
      if (subName === "displayName") {
        continue;
      }

      // Skip if already found via Object.assign
      if (subComponents.some((sc) => sc.name === subName)) {
        continue;
      }

      // Try to find props type for this sub-component
      let propsType: string | null = null;
      const funcPropsPattern = new RegExp(
        `function\\s+${value}\\s*(?:<[^>]*>)?\\s*\\([^)]*:\\s*(\\w+Props)`,
      );
      const funcMatch = content.match(funcPropsPattern);
      if (funcMatch) {
        propsType = funcMatch[1];
      }

      subComponents.push({
        name: subName,
        propsType,
        description: `${subName} sub-component`,
        isPassThrough: false,
      });
    }

    return subComponents;
  } catch {
    return [];
  }
}

/**
 * Extract props for a sub-component from the source file.
 * Handles:
 * - Inline props in function signature: function Foo({ a, b }: { a: string; b: number })
 * - PropsWithChildren pattern: function Foo(props: PropsWithChildren<{ a: string }>)
 * - Named interface reference: function Foo(props: FooProps)
 */
function extractSubComponentProps(
  filePath: string,
  subComponent: SubComponentConfig,
): Record<string, PropSchema> {
  // Skip pass-through components - their props come from the base library
  if (subComponent.isPassThrough) {
    return {};
  }

  try {
    const content = readFileSync(filePath, "utf-8");
    const funcName = subComponent.name;
    const props: Record<string, PropSchema> = {};

    // Pattern 1: Inline object type in function signature
    // Matches: function Foo({ ... }: { prop: Type }) or ({ ... }: PropsWithChildren<{ prop: Type }>)
    // Also matches arrow functions: const Foo = ({ ... }: { prop: Type }) =>
    const inlinePropsPatterns = [
      // function Name({ destructured }: { inline props })
      new RegExp(
        `(?:function|const)\\s+${funcName}\\s*=?\\s*\\([^)]*:\\s*(?:PropsWithChildren<)?\\{([^}]+)\\}`,
      ),
      // function Name({ destructured }: PropsWithChildren<InterfaceName>)
      new RegExp(
        `(?:function|const)\\s+${funcName}\\s*=?\\s*\\([^)]*:\\s*PropsWithChildren<(\\w+)>`,
      ),
    ];

    for (const pattern of inlinePropsPatterns) {
      const match = content.match(pattern);
      if (match) {
        const propsBlock = match[1];

        // Check if it's an interface name (single word) or inline props
        if (propsBlock.match(/^\w+$/)) {
          // It's an interface name, try to find and parse it
          const interfaceProps = extractPropsFromInterface(content, propsBlock);
          Object.assign(props, interfaceProps);
        } else {
          // Parse inline props: propName?: Type or propName: Type
          const propPattern = /(\w+)(\?)?:\s*([^;,\n}]+)/g;
          let propMatch: RegExpExecArray | null;

          while ((propMatch = propPattern.exec(propsBlock)) !== null) {
            const propName = propMatch[1];
            const isOptional = propMatch[2] === "?";
            let propType = propMatch[3].trim();

            // Clean up type
            propType = propType.replace(/[,;]$/, "").trim();

            if (shouldSkipProp(propName)) continue;

            props[propName] = {
              type: propType,
              ...(isOptional ? { optional: true } : { required: true }),
            };
          }
        }

        if (Object.keys(props).length > 0) {
          return props;
        }
      }
    }

    // Pattern 2: Named props type reference (from subComponent.propsType)
    if (subComponent.propsType) {
      const interfaceProps = extractPropsFromInterface(
        content,
        subComponent.propsType,
      );
      Object.assign(props, interfaceProps);
    }

    // Pattern 3: Find interface used in function parameter type
    // Matches: const Link = ({ ... }: PropsWithChildren<BreadcrumbsItemProps>) =>
    // or: function Link({ ... }: BreadcrumbsItemProps)
    if (Object.keys(props).length === 0) {
      // Use a more flexible approach: find the function definition and extract the type annotation
      // This handles multi-line destructuring patterns
      const funcDefPatterns = [
        // Arrow function: const Name = (...)
        new RegExp(`const\\s+${funcName}\\s*=\\s*\\([\\s\\S]*?\\)\\s*=>`),
        // Regular function: function Name(...)
        new RegExp(`function\\s+${funcName}\\s*\\([\\s\\S]*?\\)\\s*\\{`),
      ];

      for (const defPattern of funcDefPatterns) {
        const defMatch = content.match(defPattern);
        if (defMatch) {
          const funcDef = defMatch[0];

          // Extract PropsWithChildren<InterfaceName> or direct interface reference
          const typePatterns = [
            /PropsWithChildren<(\w+)>/,
            /:\s*(\w+Props)\s*\)/,
            /:\s*(\w+ItemProps)\s*\)/,
          ];

          for (const typePattern of typePatterns) {
            const typeMatch = funcDef.match(typePattern);
            if (typeMatch && typeMatch[1]) {
              const interfaceName = typeMatch[1];
              const interfaceProps = extractPropsFromInterface(
                content,
                interfaceName,
              );
              Object.assign(props, interfaceProps);
              if (Object.keys(props).length > 0) {
                break;
              }
            }
          }

          if (Object.keys(props).length > 0) {
            break;
          }
        }
      }
    }

    return props;
  } catch {
    return {};
  }
}

/**
 * Extract props from an interface definition in the file content.
 */
function extractPropsFromInterface(
  content: string,
  interfaceName: string,
): Record<string, PropSchema> {
  const props: Record<string, PropSchema> = {};

  // Match interface definition
  const interfacePattern = new RegExp(
    `interface\\s+${interfaceName}\\s*(?:extends[^{]*)?\\{([^}]+)\\}`,
  );
  const match = content.match(interfacePattern);

  if (match) {
    const propsBlock = match[1];
    const propPattern = /(\w+)(\?)?:\s*([^;,\n}]+)/g;
    let propMatch: RegExpExecArray | null;

    while ((propMatch = propPattern.exec(propsBlock)) !== null) {
      const propName = propMatch[1];
      const isOptional = propMatch[2] === "?";
      let propType = propMatch[3].trim();

      propType = propType.replace(/[,;]$/, "").trim();

      if (shouldSkipProp(propName)) continue;

      props[propName] = {
        type: propType,
        ...(isOptional ? { optional: true } : { required: true }),
      };
    }
  }

  return props;
}

/**
 * Auto-discover and build configurations from a source directory.
 * Component/block names and props types are detected from index.ts exports.
 */
async function discoverFromDir(
  sourceDir: string,
  type: ComponentType,
): Promise<ComponentConfig[]> {
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

    // Extract variants from file (may be empty for components without variant props)
    // Layouts and pages may not have KUMO_*_VARIANTS exports
    const variantsData = extractVariantsFromFile(mainFile);
    if (!variantsData && (type === "component" || type === "block")) {
      console.warn(
        `Warning: Could not find KUMO_*_VARIANTS exports in ${dirName}, skipping...`,
      );
      continue;
    }

    // Determine category
    const category = override.category || CATEGORY_MAP[dirName] || "Other";

    // Extract or generate description
    const description =
      override.description || extractDescription(mainFile, componentName);

    // Detect sub-components for compound component patterns
    const subComponents = detectSubComponents(mainFile);

    console.log(
      `  ${dirName} → ${componentName} (props: ${propsType}, type: ${type})`,
    );
    if (subComponents.length > 0) {
      console.log(
        `    → Found ${subComponents.length} sub-components: ${subComponents.map((s) => s.name).join(", ")}`,
      );
    }

    configs.push({
      name: componentName,
      propsType,
      sourceFile: `${dirName}/${dirName}.tsx`,
      dirName,
      sourceDir,
      type,
      description,
      category,
      variants: variantsData?.variants ?? {},
      defaults: variantsData?.defaults ?? {},
      ...(variantsData?.baseStyles && { baseStyles: variantsData.baseStyles }),
      ...(subComponents.length > 0 && { subComponents }),
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
  console.log(
    `Discovered ${componentConfigs.length} components and ${blockConfigs.length} blocks`,
  );

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
  /** Tailwind classes for each variant value (for Figma plugin) */
  classes?: Record<string, string>;
  /** State-specific classes extracted from variant classes */
  stateClasses?: Record<string, Record<string, string>>;
}

interface SubComponentSchema {
  name: string;
  description: string;
  props: Record<string, PropSchema>;
  /** Whether this is a pass-through to a base library component */
  isPassThrough?: boolean;
  /** Base library component reference for documentation */
  baseComponent?: string;
  /** Usage examples for this sub-component */
  usageExamples?: string[];
  /** Render element info (e.g., "Renders a <button> element") */
  renderElement?: string;
}

interface ComponentSchema {
  name: string;
  /** Component type: "component" (base UI primitive) or "block" (composite component) */
  type: ComponentType;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropSchema>;
  examples: readonly string[];
  colors: string[];
  /**
   * Base Tailwind classes applied to all variants.
   * Useful for Figma plugin to parse layout, spacing, typography.
   */
  baseStyles?: string;
  /** Sub-components for compound component patterns */
  subComponents?: Record<string, SubComponentSchema>;
  /** Component-specific styling metadata (dimensions, states, icons, etc.) */
  styling?: {
    /** Fixed dimensions (e.g., "h-4 w-4" for checkbox) */
    dimensions?: string;
    /** Border radius classes */
    borderRadius?: string;
    /** Base state styling tokens */
    baseTokens?: string[];
    /** State-specific styling (checked, hover, disabled, etc.) */
    states?: Record<string, string[]>;
    /** Icon information */
    icons?: {
      name: string;
      state?: string;
      size?: string | number;
    }[];
  };
}

interface ComponentRegistry {
  version: string;
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
 * Parse theme-kumo.css to extract semantic color names from --color-* and --text-color-* variables.
 * Excludes raw palette colors (e.g., --color-red-650, --color-neutral-50) which have numeric suffixes.
 */
function parseSemanticColorNames(): string[] {
  const themePath = join(__dirname, "../../src/styles/theme-kumo.css");
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

const SEMANTIC_COLOR_NAMES = parseSemanticColorNames();

// Utility prefixes that use color tokens
const COLOR_UTILITY_PREFIXES = [
  "text",
  "bg",
  "ring",
  "outline",
  "fill",
  "border",
];

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
    const refName = decodeURIComponent(def.$ref.split("/").pop() || "unknown");
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

/**
 * Resolve a $ref to its actual definition.
 * Returns the resolved definition or the original if no $ref.
 */
function resolveRef(
  def: Definition,
  allDefinitions?: Record<string, Definition>,
): Definition {
  if (!def.$ref || !allDefinitions) {
    return def;
  }
  const refName = decodeURIComponent(def.$ref.split("/").pop() || "");
  const resolved = allDefinitions[refName];
  return resolved || def;
}

function convertToPropSchema(
  propName: string,
  def: Definition,
  required: boolean,
  // biome-ignore lint/suspicious/noExplicitAny: Variants have varying shapes
  variants?: Record<string, Record<string, any>>,
  defaults?: Record<string, string>,
  allDefinitions?: Record<string, Definition>,
): PropSchema {
  // Resolve $ref to get the actual definition (for enum detection)
  const resolvedDef = resolveRef(def, allDefinitions);

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

  // Handle enums - check both original def and resolved def (for $ref cases)
  if (def.enum) {
    prop.values = def.enum as string[];
    prop.type = "enum";
  } else if (resolvedDef.enum) {
    // Enum found via $ref resolution (e.g., KumoCodeLang)
    prop.values = resolvedDef.enum as string[];
    prop.type = "enum";
  }

  // Enrich with variant descriptions and classes if this prop is a variant
  if (variants && propName in variants) {
    const variantDef = variants[propName];
    prop.values = Object.keys(variantDef);
    prop.type = "enum";

    const descriptions: Record<string, string> = {};
    const classes: Record<string, string> = {};
    const stateClassesMap: Record<string, Record<string, string>> = {};

    for (const [key, val] of Object.entries(variantDef)) {
      if (val.description) {
        descriptions[key] = val.description;
      }
      if (val.classes) {
        classes[key] = val.classes;
      }
      if (val.stateClasses) {
        stateClassesMap[key] = val.stateClasses;
      }
    }

    if (Object.keys(descriptions).length > 0) {
      prop.descriptions = descriptions;
    }
    if (Object.keys(classes).length > 0) {
      prop.classes = classes;
    }
    if (Object.keys(stateClassesMap).length > 0) {
      prop.stateClasses = stateClassesMap;
    }
  }

  // Add default value from variants defaults
  if (defaults && propName in defaults) {
    prop.default = defaults[propName];
  }

  return prop;
}

// =============================================================================
// Props filtering - exclude inherited DOM/React props that add noise
// =============================================================================

/**
 * Props to always skip - these are internal React props or rarely useful for LLMs
 */
const ALWAYS_SKIP_PROPS = new Set([
  "key",
  "ref",
  "style",
  "dangerouslySetInnerHTML",
]);

/**
 * Prefixes for props that should be skipped (DOM event handlers, ARIA, data attributes)
 */
const SKIP_PROP_PREFIXES = [
  "aria-",
  "data-",
  "on", // Event handlers: onClick, onMouseDown, onKeyUp, etc.
];

/**
 * Props that should be kept even if they appear in inherited HTML types.
 * These are commonly used and meaningful for component APIs.
 */
const KEEP_PROPS = new Set([
  "children",
  "className",
  "id",
  "disabled",
  "name",
  "value",
  "checked",
  "required",
  "placeholder",
  "readOnly",
  "type",
  "size", // Common variant prop, even though InputHTMLAttributes has size for field width
  "title", // Common component prop, even though HTMLAttributes has title for tooltips
  "label", // Common form field prop
  "href", // Common link prop for navigation components
  "lang", // Code component uses lang for syntax highlighting (not HTML lang attribute)
  "onClick", // Common event handler to keep
  "onChange", // Common event handler to keep
  "onSubmit", // Common event handler to keep
]);

/**
 * React interface names that define inherited HTML props.
 * Props from these interfaces are filtered out to keep docs focused on component-specific props.
 */
const REACT_HTML_INTERFACES = [
  "HTMLAttributes",
  "InputHTMLAttributes",
  "ButtonHTMLAttributes",
  "AnchorHTMLAttributes",
  "FormHTMLAttributes",
  "TextareaHTMLAttributes",
  "SelectHTMLAttributes",
];

/**
 * Derive inherited HTML props from React's type definitions using the TypeScript compiler.
 * Extracts property names from HTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes, etc.
 * These are filtered out to keep component docs focused on component-specific props.
 */
function deriveInheritedHtmlProps(): Set<string> {
  const inheritedProps = new Set<string>();

  try {
    // Read tsconfig to get compiler options
    const configPath = join(rootDir, "tsconfig.json");
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      rootDir,
    );

    // Create a program to access React's type definitions
    const program = ts.createProgram({
      rootNames: parsedConfig.fileNames,
      options: parsedConfig.options,
    });

    // Find React's type definition file
    const reactDts = program
      .getSourceFiles()
      .find((sf) =>
        sf.fileName.includes("node_modules/@types/react/index.d.ts"),
      );

    if (!reactDts) {
      throw new Error("Could not find React type definitions");
    }

    // Walk the AST to find the HTML attribute interfaces
    ts.forEachChild(reactDts, function visit(node) {
      if (ts.isInterfaceDeclaration(node)) {
        const name = node.name.text;
        if (REACT_HTML_INTERFACES.includes(name)) {
          // Extract property names from this interface
          for (const member of node.members) {
            if (ts.isPropertySignature(member) && member.name) {
              const propName = member.name.getText(reactDts);
              inheritedProps.add(propName);
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    });

    console.log(
      `Derived ${inheritedProps.size} inherited HTML props from React types`,
    );
  } catch (error) {
    console.warn(
      "Warning: Could not derive HTML props from React types, using fallback list",
    );
    console.warn(error instanceof Error ? error.message : error);

    // Fallback to a minimal set if derivation fails
    const fallbackProps = [
      "accessKey",
      "autoCapitalize",
      "autoFocus",
      "contentEditable",
      "dir",
      "draggable",
      "hidden",
      "lang",
      "spellCheck",
      "tabIndex",
      "title",
      "translate",
      "className",
      "id",
      "style",
      "children",
    ];
    for (const prop of fallbackProps) {
      inheritedProps.add(prop);
    }
  }

  return inheritedProps;
}

// Lazily computed inherited HTML props (derived from React types at runtime)
let _inheritedHtmlProps: Set<string> | null = null;

function getInheritedHtmlProps(): Set<string> {
  if (!_inheritedHtmlProps) {
    _inheritedHtmlProps = deriveInheritedHtmlProps();
  }
  return _inheritedHtmlProps;
}

/**
 * Determine if a prop should be skipped from the generated documentation.
 * Filters out inherited DOM props, event handlers, and internal React props.
 */
function shouldSkipProp(propName: string): boolean {
  // Never skip props in the keep list
  if (KEEP_PROPS.has(propName)) {
    return false;
  }

  // Always skip certain props
  if (ALWAYS_SKIP_PROPS.has(propName)) {
    return true;
  }

  // Skip props with certain prefixes
  for (const prefix of SKIP_PROP_PREFIXES) {
    if (propName.startsWith(prefix)) {
      return true;
    }
  }

  // Skip inherited HTML attributes (derived from React types)
  if (getInheritedHtmlProps().has(propName)) {
    return true;
  }

  return false;
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

    // Get the main type definition, following $ref if needed
    let mainDef = schema.definitions?.[propsType] as Definition;
    if (!mainDef) {
      console.warn(`Warning: Could not find type ${propsType}`);
      return {};
    }

    // Follow $ref chain to get the actual definition
    // This handles cases like: ExpandableProps -> React.PropsWithChildren<...>
    while (mainDef.$ref && !mainDef.properties && !mainDef.allOf) {
      const refName = decodeURIComponent(mainDef.$ref.split("/").pop()!);
      const refDef = schema.definitions?.[refName] as Definition;
      if (!refDef) break;
      mainDef = refDef;
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
      // Skip internal React props and inherited DOM props we don't want to expose
      if (shouldSkipProp(propName)) {
        continue;
      }

      props[propName] = convertToPropSchema(
        propName,
        propDef as Definition,
        allRequired.includes(propName),
        config.variants,
        config.defaults,
        schema.definitions as Record<string, Definition>,
      );
    }

    return props;
  } catch (error) {
    console.warn(
      `Warning: Could not generate schema for ${getPropsType(config)}:`,
      error,
    );
    // Fallback: generate props from variants only
    return generatePropsFromVariantsOnly(config);
  }
}

// =============================================================================
// Pass-through component documentation
// =============================================================================

/**
 * Documentation for pass-through sub-components from base-ui.
 * These provide props, descriptions, and usage examples for components
 * that are directly re-exported from @base-ui/react.
 */
interface PassthroughDoc {
  description: string;
  renderElement?: string;
  props: Record<string, PropSchema>;
  usageExamples?: string[];
}

const PASSTHROUGH_COMPONENT_DOCS: Record<string, PassthroughDoc> = {
  // Dialog sub-components
  "DialogBase.Root": {
    description:
      "Controls the open state of the dialog. Doesn't render its own HTML element.",
    props: {
      open: {
        type: "boolean",
        description: "Whether the dialog is currently open (controlled mode)",
      },
      defaultOpen: {
        type: "boolean",
        description: "Whether the dialog is initially open (uncontrolled mode)",
        default: "false",
      },
      onOpenChange: {
        type: "(open: boolean, event: Event) => void",
        description: "Callback fired when the dialog opens or closes",
      },
      modal: {
        type: "boolean | 'trap-focus'",
        description:
          "Whether the dialog is modal. When true, focus is trapped and page scroll is locked",
        default: "true",
      },
      dismissible: {
        type: "boolean",
        description: "Whether clicking outside closes the dialog",
        default: "true",
      },
    },
    usageExamples: [
      "<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>",
      "<Dialog.Root defaultOpen={false}>",
    ],
  },
  "DialogBase.Trigger": {
    description: "A button that opens the dialog when clicked.",
    renderElement: "<button>",
    props: {
      render: {
        type: "ReactElement | ((props, state) => ReactElement)",
        description: "Custom element to render instead of the default button",
      },
      disabled: {
        type: "boolean",
        description: "Whether the trigger is disabled",
      },
    },
    usageExamples: [
      "<Dialog.Trigger render={<Button>Open</Button>} />",
      "<Dialog.Trigger>Open Dialog</Dialog.Trigger>",
    ],
  },
  "DialogBase.Title": {
    description: "A heading that labels the dialog for accessibility.",
    renderElement: "<h2>",
    props: {
      render: {
        type: "ReactElement | ((props, state) => ReactElement)",
        description: "Custom element to render instead of the default h2",
      },
    },
    usageExamples: [
      "<Dialog.Title>Confirm Action</Dialog.Title>",
      "<Dialog.Title render={<h3 />}>Custom Heading</Dialog.Title>",
    ],
  },
  "DialogBase.Description": {
    description: "A paragraph providing additional context about the dialog.",
    renderElement: "<p>",
    props: {
      render: {
        type: "ReactElement | ((props, state) => ReactElement)",
        description: "Custom element to render instead of the default p",
      },
    },
    usageExamples: [
      "<Dialog.Description>Are you sure you want to proceed?</Dialog.Description>",
    ],
  },
  "DialogBase.Close": {
    description: "A button that closes the dialog when clicked.",
    renderElement: "<button>",
    props: {
      render: {
        type: "ReactElement | ((props, state) => ReactElement)",
        description: "Custom element to render instead of the default button",
      },
      disabled: {
        type: "boolean",
        description: "Whether the close button is disabled",
      },
    },
    usageExamples: [
      "<Dialog.Close render={<Button>Cancel</Button>} />",
      "<Dialog.Close>×</Dialog.Close>",
    ],
  },

  // Combobox sub-components
  "ComboboxBase.List": {
    description:
      "A container for combobox items. Supports render prop for custom item rendering.",
    renderElement: "<div>",
    props: {
      children: {
        type: "ReactNode | ((item: T, index: number) => ReactNode)",
        description:
          "Items to render, or a function that receives each item and returns a node",
      },
    },
    usageExamples: [
      `<Combobox.List>
  {(item) => <Combobox.Item value={item}>{item.label}</Combobox.Item>}
</Combobox.List>`,
    ],
  },
  "ComboboxBase.Collection": {
    description:
      "Renders filtered list items. Use when you need more control over item rendering.",
    props: {
      children: {
        type: "(item: T, index: number) => ReactNode",
        required: true,
        description:
          "Function that receives each filtered item and returns a node",
      },
    },
    usageExamples: [
      `<Combobox.Collection>
  {(item, index) => (
    <Combobox.Item key={index} value={item}>
      {item.label}
    </Combobox.Item>
  )}
</Combobox.Collection>`,
    ],
  },
};

/**
 * Additional props to inject for specific components.
 * These are important inherited props that the schema generator misses
 * because they come from base library types.
 */
const ADDITIONAL_COMPONENT_PROPS: Record<string, Record<string, PropSchema>> = {
  Meter: {
    value: {
      type: "number",
      description: "Current value of the meter",
    },
    max: {
      type: "number",
      description: "Maximum value of the meter (default: 100)",
    },
    min: {
      type: "number",
      description: "Minimum value of the meter (default: 0)",
    },
  },
  Tooltip: {
    content: {
      type: "ReactNode",
      required: true,
      description: "Content to display in the tooltip",
    },
  },
  Pagination: {
    setPage: {
      type: "(page: number) => void",
      required: true,
      description: "Callback when page changes",
    },
  },
  Switch: {
    onClick: {
      type: "(event: React.MouseEvent) => void",
      required: true,
      description: "Callback when switch is clicked",
    },
  },
  // Code.lang is now handled by KUMO_CODE_VARIANTS - no manual override needed
  Combobox: {
    onValueChange: {
      type: "(value: T | T[]) => void",
      description: "Callback when selection changes",
    },
    multiple: {
      type: "boolean",
      description: "Allow multiple selections",
    },
    isItemEqualToValue: {
      type: "(item: T, value: T) => boolean",
      description: "Custom equality function for comparing items",
    },
  },
  Select: {
    onValueChange: {
      type: "(value: string) => void",
      description: "Callback when selection changes",
    },
    defaultValue: {
      type: "string",
      description: "Initial value for uncontrolled mode",
    },
  },
  DateRangePicker: {
    onStartDateChange: {
      type: "(date: Date | null) => void",
      description: "Callback when start date changes",
    },
    onEndDateChange: {
      type: "(date: Date | null) => void",
      description: "Callback when end date changes",
    },
  },
  Tabs: {
    onValueChange: {
      type: "(value: string) => void",
      description: "Callback when active tab changes",
    },
  },
  Collapsible: {
    onOpenChange: {
      type: "(open: boolean) => void",
      description: "Callback when collapsed state changes",
    },
  },
  Checkbox: {
    onValueChange: {
      type: "(checked: boolean) => void",
      description: "Callback when checkbox value changes",
    },
  },
};

/**
 * Type overrides for props with opaque or unhelpful generated types.
 * Maps component name -> prop name -> cleaner type string.
 */
const PROP_TYPE_OVERRIDES: Record<string, Record<string, string>> = {
  Code: {
    values: "Record<string, { value: string; highlight?: boolean }>",
  },
  Combobox: {
    items: "T[]",
    value: "T | T[]",
  },
  Select: {
    value: "string",
  },
};

/**
 * Component-specific styling metadata for AI/Figma plugin consumption.
 * Documents dimensions, states, icons, and color tokens used in components.
 */
const COMPONENT_STYLING_METADATA: Record<string, ComponentSchema["styling"]> = {
  Checkbox: {
    dimensions: "h-4 w-4",
    borderRadius: "rounded-sm",
    baseTokens: ["bg-surface", "ring-border"],
    states: {
      checked: ["bg-surface-inverse", "text-surface-inverse"],
      indeterminate: ["bg-surface-inverse", "text-surface-inverse"],
      error: ["ring-error"],
      hover: ["ring-active"],
      focus: ["ring-active"],
      disabled: ["opacity-50", "cursor-not-allowed"],
    },
    icons: [
      {
        name: "ph-check",
        state: "checked",
        size: 12,
      },
      {
        name: "ph-minus",
        state: "indeterminate",
        size: 12,
      },
    ],
  },
};

/**
 * Fallback props generation when ts-json-schema-generator fails.
 * Extracts props from the KUMO_*_VARIANTS object only.
 * This is useful for components with complex generic types.
 */
function generatePropsFromVariantsOnly(
  config: ComponentConfig,
): Record<string, PropSchema> {
  const props: Record<string, PropSchema> = {};

  // Add variant props from the config
  for (const [propName, variantDef] of Object.entries(config.variants)) {
    const values = Object.keys(variantDef);
    const descriptions: Record<string, string> = {};

    for (const [key, val] of Object.entries(variantDef)) {
      if (val.description) {
        descriptions[key] = val.description;
      }
    }

    props[propName] = {
      type: "enum",
      values,
      ...(config.defaults[propName] && { default: config.defaults[propName] }),
      ...(Object.keys(descriptions).length > 0 && { descriptions }),
    };
  }

  // Add common props that most components have
  props.className = { type: "string", description: "Additional CSS classes" };
  props.children = { type: "ReactNode", description: "Child elements" };

  console.log(
    `  → Fallback: generated ${Object.keys(props).length} props from variants`,
  );
  return props;
}

// =============================================================================
// Generate the registry
// =============================================================================

interface GenerateRegistryResult {
  registry: ComponentRegistry;
  componentColors: Map<string, string[]>;
}

async function generateRegistry(): Promise<GenerateRegistryResult> {
  // Auto-discover components from filesystem
  const COMPONENTS = await discoverComponents();
  console.log(`Discovered ${COMPONENTS.length} components`);

  const components: Record<string, ComponentSchema> = {};
  const byCategory: Record<string, string[]> = {};
  const componentColors = new Map<string, string[]>();

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
        variantConstants.set(
          `${constName}.${propName}`,
          Object.keys(propVariants),
        );
      }
    }
  }

  // Extract examples from all story files
  const storyExamples = extractAllExamples(variantConstants);

  for (const config of COMPONENTS) {
    console.log(`Processing ${config.name}...`);

    const props = generatePropsFromType(config);

    // Inject additional props for components with important inherited props
    const additionalProps = ADDITIONAL_COMPONENT_PROPS[config.name];
    if (additionalProps) {
      for (const [propName, propSchema] of Object.entries(additionalProps)) {
        if (!props[propName]) {
          // Add new prop
          props[propName] = propSchema;
        } else {
          // Merge with existing prop (override type and description if provided)
          if (propSchema.type) {
            props[propName].type = propSchema.type;
          }
          if (propSchema.description) {
            props[propName].description = propSchema.description;
          }
        }
      }
    }

    // Apply type overrides for props with opaque types
    const typeOverrides = PROP_TYPE_OVERRIDES[config.name];
    if (typeOverrides) {
      for (const [propName, newType] of Object.entries(typeOverrides)) {
        if (props[propName]) {
          props[propName].type = newType;
        }
      }
    }

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
        console.log(
          `  → Auto-extracted ${examples.length} examples from stories`,
        );
      }
    }

    // Process sub-components for compound component patterns
    let subComponentSchemas: Record<string, SubComponentSchema> | undefined;
    if (config.subComponents && config.subComponents.length > 0) {
      subComponentSchemas = {};
      const sourcePath = join(config.sourceDir, getSourceFile(config));

      for (const subComp of config.subComponents) {
        let subProps = extractSubComponentProps(sourcePath, subComp);
        let description = subComp.description;
        let usageExamples: string[] | undefined;
        let renderElement: string | undefined;

        // For pass-through components, use documentation from PASSTHROUGH_COMPONENT_DOCS
        if (subComp.isPassThrough && subComp.baseComponent) {
          const passthroughDoc =
            PASSTHROUGH_COMPONENT_DOCS[subComp.baseComponent];
          if (passthroughDoc) {
            // Use pass-through documentation
            description = passthroughDoc.description;
            subProps = passthroughDoc.props;
            usageExamples = passthroughDoc.usageExamples;
            renderElement = passthroughDoc.renderElement;
          }
        }

        subComponentSchemas[subComp.name] = {
          name: subComp.name,
          description,
          props: subProps,
          ...(subComp.isPassThrough && { isPassThrough: true }),
          ...(subComp.baseComponent && {
            baseComponent: subComp.baseComponent,
          }),
          ...(usageExamples && { usageExamples }),
          ...(renderElement && { renderElement }),
        };
      }

      console.log(
        `  → Processed ${Object.keys(subComponentSchemas).length} sub-components`,
      );
    }

    // Store colors for style guide generation
    componentColors.set(config.name, colors);

    // Get styling metadata if available
    const stylingMetadata = COMPONENT_STYLING_METADATA[config.name];

    components[config.name] = {
      name: config.name,
      type: config.type,
      description: config.description,
      importPath: "@cloudflare/kumo",
      category: config.category,
      props,
      examples,
      colors,
      ...(config.baseStyles && { baseStyles: config.baseStyles }),
      ...(subComponentSchemas && { subComponents: subComponentSchemas }),
      ...(stylingMetadata && { styling: stylingMetadata }),
    };

    if (!byCategory[config.category]) {
      byCategory[config.category] = [];
    }
    byCategory[config.category].push(config.name);
  }

  return {
    registry: {
      version: "1.0.0",
      components,
      search: {
        byCategory,
        byName: COMPONENTS.map((c) => c.name),
      },
    },
    componentColors,
  };
}

// =============================================================================
// Example cleanup - fix common issues in extracted examples
// =============================================================================

/**
 * Clean up extracted examples to fix common issues:
 * - Stringified functions: setPage="() => {}" -> setPage={() => {}}
 * - Stringified arrays: tabs={`[...]`} -> tabs={[...]}
 * - Escaped template literals: code={\`...\`} -> code={`...`}
 * - Unquoted identifiers used as strings: label={Checked} -> label="Checked"
 * - Double backticks from escaping: {``content``} -> {`content`}
 */
function cleanupExample(example: string): string {
  let cleaned = example;

  // Fix stringified functions: prop="() => {}" -> prop={() => {}}
  cleaned = cleaned.replace(/(\w+)="(\(\)\s*=>\s*\{[^}]*\})"/g, "$1={$2}");

  // Fix stringified arrays: prop={`[...]`} -> prop={[...]}
  // Match prop={`[...multiline content...]`}
  cleaned = cleaned.replace(/(\w+)=\{`(\[[\s\S]*?\])`\}/g, "$1={$2}");

  // Fix escaped template literals: \` -> `
  cleaned = cleaned.replace(/\\`/g, "`");

  // Fix double backticks that result from escaping: {``content``} -> {`content`}
  // This happens when template literals get double-escaped
  cleaned = cleaned.replace(/\{``/g, "{`");
  cleaned = cleaned.replace(/``\}/g, "`}");

  // Fix unquoted identifiers that should be strings (common in Checkbox labels)
  // label={Checked} -> label="Checked" (when it's clearly meant to be a string)
  const identifierAsStringProps = ["label"];
  for (const prop of identifierAsStringProps) {
    // Match prop={SingleWord} where SingleWord is a simple identifier (not a component or expression)
    const pattern = new RegExp(`(${prop})=\\{([A-Z][a-z]+)\\}(?![\\w.])`, "g");
    cleaned = cleaned.replace(pattern, '$1="$2"');
  }

  return cleaned;
}

/**
 * Filter out problematic examples that can't be easily fixed
 */
function shouldIncludeExample(example: string, componentName: string): boolean {
  // Skip examples that reference undefined components
  const undefinedComponents = [
    "RefreshButton",
    "LinkButton",
    "DefaultMenuBar",
    "ToastTriggerButton",
  ];
  for (const comp of undefinedComponents) {
    if (example.includes(`<${comp}`)) {
      return false;
    }
  }

  // Skip empty or near-empty examples
  if (example.trim().length < 10) {
    return false;
  }

  // Skip examples that are just the component with no props (not useful)
  const emptyPattern = new RegExp(`^<${componentName}\\s*/>$`);
  if (emptyPattern.test(example.trim())) {
    return false;
  }

  // Skip examples with undefined variables (common in story extractions)
  const undefinedVars = [
    "args.placeholder",
    "args.inputSide",
    "botList",
    "INITIAL_BOT_LIST",
  ];
  for (const varName of undefinedVars) {
    if (example.includes(varName)) {
      return false;
    }
  }

  return true;
}

/**
 * Track seen examples to filter near-duplicates.
 * Key is component name, value is set of "signature" strings.
 */
const seenExampleSignatures = new Map<string, Set<string>>();

/**
 * Generate a signature for an example to detect near-duplicates.
 * Extracts the prop names being demonstrated.
 */
function getExampleSignature(example: string): string {
  // Extract prop assignments like variant="primary" or size="sm"
  const propPattern = /(\w+)=["'{]/g;
  const props: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = propPattern.exec(example)) !== null) {
    props.push(match[1]);
  }
  // Sort for consistent comparison
  return props.sort().join(",");
}

/**
 * Check if this example is a near-duplicate of one we've already seen.
 * Returns true if we should skip this example.
 */
function isNearDuplicateExample(
  example: string,
  componentName: string,
): boolean {
  const signature = getExampleSignature(example);

  // Get or create the set for this component
  let signatures = seenExampleSignatures.get(componentName);
  if (!signatures) {
    signatures = new Set();
    seenExampleSignatures.set(componentName, signatures);
  }

  // If we've seen this signature, it's a duplicate
  if (signatures.has(signature)) {
    return true;
  }

  // Mark as seen
  signatures.add(signature);
  return false;
}

// =============================================================================
// Generate AI context string (markdown format for LLM consumption)
// =============================================================================

function generateAIContext(
  registry: ComponentRegistry,
  componentColors: Map<string, string[]>,
): string {
  // Clear example signature cache for fresh duplicate detection
  seenExampleSignatures.clear();

  // Generate style guide from color usage data
  const styleGuide = generateStyleGuideMarkdown(componentColors);

  let context = `# Kumo Component Registry

> Auto-generated component metadata for AI/agent consumption.

${styleGuide}`;

  for (const [name, comp] of Object.entries(registry.components)) {
    context += `---\n\n`;
    context += `### ${name}\n\n`;
    context += `${comp.description}\n\n`;
    context += `**Type:** ${comp.type}\n\n`;
    context += `**Import:** \`import { ${name} } from "${comp.importPath}";\`\n\n`;
    context += `**Category:** ${comp.category}\n\n`;

    context += `**Props:**\n\n`;
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

      // Document state classes for variant props
      if (prop.stateClasses && Object.keys(prop.stateClasses).length > 0) {
        context += `\n  **State Classes:**\n`;
        for (const [variantValue, states] of Object.entries(
          prop.stateClasses,
        )) {
          context += `  - \`"${variantValue}"\`:\n`;
          for (const [stateName, stateClass] of Object.entries(states)) {
            context += `    - \`${stateName}\`: \`${stateClass}\`\n`;
          }
        }
      }
    }

    if (comp.colors.length > 0) {
      context += `\n**Colors (kumo tokens used):**\n\n`;
      context += `\`${comp.colors.join("`, `")}\`\n`;
    }

    // Document styling metadata (dimensions, states, icons)
    if (comp.styling) {
      context += `\n**Styling:**\n\n`;

      if (comp.styling.dimensions) {
        context += `- **Dimensions:** \`${comp.styling.dimensions}\`\n`;
      }
      if (comp.styling.borderRadius) {
        context += `- **Border Radius:** \`${comp.styling.borderRadius}\`\n`;
      }
      if (comp.styling.baseTokens && comp.styling.baseTokens.length > 0) {
        context += `- **Base Tokens:** \`${comp.styling.baseTokens.join("`, `")}\`\n`;
      }
      if (comp.styling.states && Object.keys(comp.styling.states).length > 0) {
        context += `- **States:**\n`;
        for (const [stateName, tokens] of Object.entries(comp.styling.states)) {
          context += `  - \`${stateName}\`: \`${tokens.join("`, `")}\`\n`;
        }
      }
      if (comp.styling.icons && comp.styling.icons.length > 0) {
        context += `- **Icons:**\n`;
        for (const icon of comp.styling.icons) {
          const stateInfo = icon.state ? ` (${icon.state})` : "";
          const sizeInfo = icon.size ? ` size ${icon.size}` : "";
          context += `  - \`${icon.name}\`${stateInfo}${sizeInfo}\n`;
        }
      }
    }

    // Document sub-components for compound component patterns
    if (comp.subComponents && Object.keys(comp.subComponents).length > 0) {
      context += `\n**Sub-Components:**\n\n`;
      context += `This is a compound component. Use these sub-components:\n\n`;

      for (const [subName, subComp] of Object.entries(comp.subComponents)) {
        context += `#### ${name}.${subName}\n\n`;
        context += `${subComp.description}`;

        // Add render element info if available
        if (subComp.renderElement) {
          context += ` Renders a \`${subComp.renderElement}\` element.`;
        }
        context += "\n\n";

        // Show props with descriptions
        if (Object.keys(subComp.props).length > 0) {
          context += `Props:\n`;
          for (const [propName, prop] of Object.entries(subComp.props)) {
            const required = prop.required ? " (required)" : "";
            const defaultVal = prop.default
              ? ` [default: ${prop.default}]`
              : "";
            context += `- \`${propName}\`: ${prop.type}${required}${defaultVal}`;
            if (prop.description) {
              context += ` - ${prop.description}`;
            }
            context += "\n";
          }
          context += "\n";
        }

        // Show usage examples for pass-through components
        if (subComp.usageExamples && subComp.usageExamples.length > 0) {
          context += `Usage:\n`;
          for (const example of subComp.usageExamples) {
            context += `\`\`\`tsx\n${example}\n\`\`\`\n`;
          }
          context += "\n";
        }
      }
    }

    if (comp.examples.length > 0) {
      context += `\n**Examples:**\n\n`;
      for (const example of comp.examples) {
        // Clean up and filter examples
        if (!shouldIncludeExample(example, name)) {
          continue;
        }
        // Skip near-duplicate examples (e.g., multiple size variants)
        if (isNearDuplicateExample(example, name)) {
          continue;
        }
        const cleanedExample = cleanupExample(example);
        context += `\`\`\`tsx\n${cleanedExample}\n\`\`\`\n\n`;
      }
    }
    context += "\n";
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
  const { registry, componentColors } = await generateRegistry();
  const aiContext = generateAIContext(registry, componentColors);

  // Ensure output directory exists
  const outputDir = join(__dirname, "../../ai");
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
