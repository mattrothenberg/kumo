/**
 * Utility to load and query component registry data for documentation.
 * Reads from the auto-generated component-registry.json in the kumo package.
 *
 * Note: We use a Vite alias instead of an npm export to keep the component
 * registry internal (not published to npm). The alias is configured in
 * astro.config.mjs to point to ../kumo/ai/component-registry.json
 */

// Import the registry JSON via Vite alias (configured in astro.config.mjs)
// @ts-expect-error - Vite alias, not a real npm package
import registry from "@kumo-internal/component-registry";

export interface PropSchema {
  type: string;
  optional?: boolean;
  required?: boolean;
  values?: string[];
  descriptions?: Record<string, string>;
  default?: string;
  description?: string;
}

export interface SubComponentData {
  name: string;
  description: string;
  props: Record<string, PropSchema>;
  isPassThrough?: boolean;
  baseComponent?: string;
  usageExamples?: string[];
  renderElement?: string;
}

export interface ComponentData {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropSchema>;
  examples?: string[];
  colors?: string[];
  subComponents?: Record<string, SubComponentData>;
}

export interface ComponentRegistry {
  version: string;
  components: Record<string, ComponentData>;
}

const typedRegistry = registry as ComponentRegistry;

/**
 * Get data for a component, including support for sub-component notation.
 *
 * @param componentName - e.g., "Button", "Dialog", or "Dialog.Root"
 * @returns Component or sub-component data, or null if not found
 */
export function getComponentData(componentName: string): {
  name: string;
  description: string;
  props: Record<string, PropSchema>;
  isSubComponent: boolean;
  parentName?: string;
} | null {
  // Check for sub-component notation: "Dialog.Root" -> parent="Dialog", sub="Root"
  if (componentName.includes(".")) {
    const [parentName, subName] = componentName.split(".");
    const parent = typedRegistry.components[parentName];

    if (!parent?.subComponents?.[subName]) {
      return null;
    }

    const sub = parent.subComponents[subName];
    return {
      name: `${parentName}.${subName}`,
      description: sub.description,
      props: sub.props,
      isSubComponent: true,
      parentName,
    };
  }

  // Regular component lookup
  const component = typedRegistry.components[componentName];
  if (!component) {
    return null;
  }

  return {
    name: component.name,
    description: component.description,
    props: component.props,
    isSubComponent: false,
  };
}

/**
 * Get all sub-component names for a compound component.
 *
 * @param componentName - e.g., "Dialog"
 * @returns Array of sub-component names, or empty array if none
 */
export function getSubComponentNames(componentName: string): string[] {
  const component = typedRegistry.components[componentName];
  if (!component?.subComponents) {
    return [];
  }
  return Object.keys(component.subComponents);
}

/**
 * Check if a component has sub-components (is a compound component).
 */
export function hasSubComponents(componentName: string): boolean {
  const component = typedRegistry.components[componentName];
  return (
    !!component?.subComponents &&
    Object.keys(component.subComponents).length > 0
  );
}

/**
 * Format a prop type for display.
 * Handles enums by joining values with " | ".
 */
export function formatPropType(prop: PropSchema): string {
  if (prop.type === "enum" && prop.values) {
    return prop.values.map((v) => `"${v}"`).join(" | ");
  }
  return prop.type;
}

/**
 * Get the default value for display, or "-" if none.
 */
export function formatDefault(prop: PropSchema): string {
  if (prop.default !== undefined) {
    // Don't double-quote if it's already a quoted string or a boolean/number
    if (prop.type === "enum" || prop.type === "string") {
      return `"${prop.default}"`;
    }
    return String(prop.default);
  }
  return "-";
}
