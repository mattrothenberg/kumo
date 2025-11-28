/**
 * Schema Helpers - Utilities for deriving component metadata with minimal drift risk
 *
 * These helpers ensure that SCHEMA exports stay in sync with actual component
 * implementations by deriving as much information as possible from the source.
 */

// =============================================================================
// Constants
// =============================================================================

export const KUMO_IMPORT_PATH = "@cloudflare/kumo" as const;

// =============================================================================
// Types
// =============================================================================

/** Variant config shape used across all Kumo components */
export interface VariantConfig {
  classes: string;
  description?: string;
}

/** A variants object like KUMO_BADGE_VARIANTS (may include internal variants without descriptions) */
export type VariantsDefinition = Record<string, Record<string, VariantConfig>>;

/** A defaults object like KUMO_BADGE_DEFAULT_VARIANTS */
export type DefaultsDefinition = Record<string, string>;

/** Prop schema for a single prop */
export interface PropSchema {
  type: string;
  required?: boolean;
  optional?: boolean;
  default?: string;
  description?: string;
  values?: string[];
  descriptions?: Record<string, string>;
}

/** Full component schema */
export interface ComponentSchema {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropSchema>;
  examples: readonly string[];
}

// =============================================================================
// Schema Derivation Helpers
// =============================================================================

/**
 * Derives prop schema from a KUMO_*_VARIANTS definition.
 * Automatically extracts values, defaults, and descriptions.
 */
export function deriveVariantProp<
  V extends VariantsDefinition,
  D extends DefaultsDefinition,
  K extends keyof V & keyof D,
>(variants: V, defaults: D, propName: K): PropSchema {
  const variantDef = variants[propName];
  const descriptions: Record<string, string> = {};

  for (const [key, val] of Object.entries(variantDef)) {
    const desc = (val as VariantConfig).description;
    if (desc) {
      descriptions[key] = desc;
    }
  }

  return {
    type: "enum",
    values: Object.keys(variantDef),
    default: defaults[propName],
    descriptions,
  };
}

/**
 * Derives all variant props from a KUMO_*_VARIANTS definition.
 * Skips internal variants (like compactSize) that aren't exposed as props.
 */
export function deriveAllVariantProps<
  V extends VariantsDefinition,
  D extends DefaultsDefinition,
>(
  variants: V,
  defaults: D,
  exclude: (keyof V)[] = [],
): Record<string, PropSchema> {
  const props: Record<string, PropSchema> = {};

  for (const key of Object.keys(defaults) as (keyof V & keyof D)[]) {
    if (!exclude.includes(key) && key in variants) {
      props[key as string] = deriveVariantProp(variants, defaults, key);
    }
  }

  return props;
}

// =============================================================================
// Common Prop Definitions (reusable across components)
// =============================================================================

export const COMMON_PROPS = {
  className: { type: "string", optional: true } as PropSchema,
  children: { type: "ReactNode", required: true } as PropSchema,
  childrenOptional: { type: "ReactNode", optional: true } as PropSchema,
  icon: {
    type: "Icon | ReactNode",
    optional: true,
    description: "Icon from @phosphor-icons/react",
  } as PropSchema,
  disabled: { type: "boolean", default: "false" } as PropSchema,
  loading: { type: "boolean", default: "false" } as PropSchema,
  onClick: { type: "() => void", optional: true } as PropSchema,
} as const;

// =============================================================================
// Schema Builder
// =============================================================================

/** React component with optional displayName */
// biome-ignore lint/suspicious/noExplicitAny: Need to accept any React component
type ComponentWithName = ((...args: any[]) => any) & { displayName?: string };

interface DefineSchemaOptions<
  V extends VariantsDefinition,
  D extends DefaultsDefinition,
> {
  /** Component function - name is derived from function.name or displayName */
  component: ComponentWithName;
  /** Human-readable description */
  description: string;
  /** Component category for organization */
  category: string;
  /** KUMO_*_VARIANTS object */
  variants?: V;
  /** KUMO_*_DEFAULT_VARIANTS object */
  defaults?: D;
  /** Variant keys to exclude from props (e.g., internal variants) */
  excludeVariants?: (keyof V)[];
  /** Additional props not derived from variants */
  additionalProps?: Record<string, PropSchema>;
  /** Usage examples */
  examples: readonly string[];
}

/**
 * Defines a component schema with maximum derivation from source.
 *
 * @example
 * export const BADGE_SCHEMA = defineSchema({
 *   component: Badge,
 *   description: "Small badge for labels and status indicators",
 *   category: "Display",
 *   variants: KUMO_BADGE_VARIANTS,
 *   defaults: KUMO_BADGE_DEFAULT_VARIANTS,
 *   additionalProps: {
 *     className: COMMON_PROPS.className,
 *     children: COMMON_PROPS.children,
 *   },
 *   examples: ['<Badge variant="primary">New</Badge>'],
 * });
 */
export function defineSchema<
  V extends VariantsDefinition,
  D extends DefaultsDefinition,
>(options: DefineSchemaOptions<V, D>): ComponentSchema {
  const {
    component,
    description,
    category,
    variants,
    defaults,
    excludeVariants = [],
    additionalProps = {},
    examples,
  } = options;

  // Derive name from component
  const name = component.displayName || component.name || "Unknown";

  // Derive variant props
  const variantProps =
    variants && defaults
      ? deriveAllVariantProps(
          variants,
          defaults,
          excludeVariants as (keyof V)[],
        )
      : {};

  return {
    name,
    description,
    importPath: KUMO_IMPORT_PATH,
    category,
    props: {
      ...variantProps,
      ...additionalProps,
    },
    examples,
  };
}
