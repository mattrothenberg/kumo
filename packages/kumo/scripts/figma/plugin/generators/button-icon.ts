/**
 * Button Icon Component Generator
 *
 * Generates 24 icon button ComponentSets for the Kumo UI Kit.
 * Structure: 6 variants × 4 sizes = 24 ComponentSets
 * Each ComponentSet has 5 state variants × 2 shape variants = 10 components
 *
 * Sections:
 * - Primary Icon (Button Primary Icon XS, SM, Base, LG)
 * - Secondary Icon (Button Secondary Icon XS, SM, Base, LG)
 * - Ghost Icon (Button Ghost Icon XS, SM, Base, LG)
 * - Destructive Icon (Button Destructive Icon XS, SM, Base, LG)
 * - Secondary-Destructive Icon (Button Secondary-Destructive Icon XS, SM, Base, LG)
 * - Outline Icon (Button Outline Icon XS, SM, Base, LG)
 *
 * @see SPEC.md - Phase 4: Button Component (Icon)
 */

import {
  bindFillToVariable,
  bindStrokeToVariable,
  getVariableByName,
  getOrCreateSection,
  BORDER_RADIUS,
} from "./shared";

/**
 * Button variants matching button.tsx KUMO_BUTTON_VARIANTS.variant
 */
const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "secondary-destructive",
  "outline",
] as const;

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/**
 * Button sizes matching button.tsx KUMO_BUTTON_VARIANTS.size
 */
const BUTTON_SIZES = ["xs", "sm", "base", "lg"] as const;
type ButtonSize = (typeof BUTTON_SIZES)[number];

/**
 * Button states for variant property
 */
const BUTTON_STATES = [
  "Default",
  "Hover",
  "Active",
  "Disabled",
  "Loading",
] as const;
type ButtonState = (typeof BUTTON_STATES)[number];

/**
 * Shape variants for icon buttons
 */
const BUTTON_SHAPES = ["square", "circle"] as const;
type ButtonShape = (typeof BUTTON_SHAPES)[number];

/**
 * Icon button size specifications (compactSize)
 * From button.tsx KUMO_BUTTON_VARIANTS.compactSize
 */
const ICON_BUTTON_SIZES: Record<ButtonSize, number> = {
  xs: 14, // size-3.5 = 14px
  sm: 26, // size-6.5 = 26px
  base: 36, // size-9 = 36px
  lg: 40, // size-10 = 40px
};

/**
 * Border radius by size for square icon buttons
 * Matches text button sizes
 */
const BORDER_RADIUS_BY_SIZE: Record<ButtonSize, number> = {
  xs: BORDER_RADIUS.sm, // 2px
  sm: BORDER_RADIUS.md, // 6px
  base: BORDER_RADIUS.lg, // 8px
  lg: BORDER_RADIUS.lg, // 8px
};

/**
 * Icon size by button size
 * Approximate icon sizes that fit well in each button size
 */
const _ICON_SIZES: Record<ButtonSize, number> = {
  xs: 10,
  sm: 16,
  base: 20,
  lg: 24,
};

/**
 * Placeholder icon components by size
 * These should be created by placeholders.ts generator
 */
type PlaceholderRefs = {
  placeholderIcon12?: ComponentNode;
  placeholderIcon16?: ComponentNode;
  placeholderIcon20?: ComponentNode;
  loader?: ComponentNode;
};

/**
 * Get placeholder icon component for a given size
 */
function getPlaceholderIconForSize(
  size: ButtonSize,
  placeholders: PlaceholderRefs,
): ComponentNode | undefined {
  // Map button sizes to placeholder icon sizes
  const iconSizeMap: Record<ButtonSize, keyof PlaceholderRefs> = {
    xs: "placeholderIcon12",
    sm: "placeholderIcon16",
    base: "placeholderIcon20",
    lg: "placeholderIcon20",
  };

  const key = iconSizeMap[size];
  return placeholders[key];
}

/**
 * Variant styling configuration
 * Maps button variants to their fill/stroke variable bindings
 */
type VariantStyle = {
  /** Fill variable name for Default state */
  fill: string;
  /** Fill variable name for Hover state */
  fillHover: string;
  /** Fill variable name for Active state */
  fillActive: string;
  /** Fill variable name for Disabled state */
  fillDisabled: string;
  /** Text color variable name */
  text: string;
  /** Stroke variable name (for variants with borders) */
  stroke?: string;
};

const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  primary: {
    fill: "primary",
    fillHover: "opacity-primary-70",
    fillActive: "opacity-primary-70",
    fillDisabled: "opacity-primary-50",
    text: "white", // white is a kumo token
  },
  secondary: {
    fill: "secondary",
    fillHover: "secondary",
    fillActive: "secondary",
    fillDisabled: "opacity-secondary-50",
    text: "surface",
    stroke: "border",
  },
  ghost: {
    fill: "transparent", // inherit background
    fillHover: "accent",
    fillActive: "accent",
    fillDisabled: "transparent",
    text: "surface",
  },
  destructive: {
    fill: "error",
    fillHover: "opacity-error-70",
    fillActive: "opacity-error-70",
    fillDisabled: "opacity-error-50",
    text: "white",
  },
  "secondary-destructive": {
    fill: "secondary",
    fillHover: "secondary",
    fillActive: "secondary",
    fillDisabled: "opacity-secondary-50",
    text: "error",
    stroke: "border",
  },
  outline: {
    fill: "surface",
    fillHover: "surface",
    fillActive: "surface",
    fillDisabled: "surface",
    text: "surface",
    stroke: "border",
  },
};

/**
 * Create a single icon button component variant
 *
 * @param variant - Button variant (primary, secondary, etc.)
 * @param size - Button size (xs, sm, base, lg)
 * @param state - Button state (Default, Hover, Active, Disabled, Loading)
 * @param shape - Button shape (square, circle)
 * @param placeholders - Placeholder component references
 * @returns Component node
 */
function createIconButtonComponent(
  variant: ButtonVariant,
  size: ButtonSize,
  state: ButtonState,
  shape: ButtonShape,
  placeholders: PlaceholderRefs,
): ComponentNode {
  const component = figma.createComponent();

  // Component name: "State=Default, Shape=square"
  component.name = `State=${state}, Shape=${shape}`;

  // Get variant style configuration
  const style = VARIANT_STYLES[variant];

  // Get dimensions
  const buttonSize = ICON_BUTTON_SIZES[size];

  // Configure auto-layout (ComponentNode extends FrameNode)
  (component as any).layoutMode = "HORIZONTAL";
  (component as any).primaryAxisAlignItems = "CENTER";
  (component as any).counterAxisAlignItems = "CENTER";
  (component as any).primaryAxisSizingMode = "FIXED";
  (component as any).counterAxisSizingMode = "FIXED";
  (component as any).resize(buttonSize, buttonSize);

  // Apply border radius based on shape
  if (shape === "circle") {
    (component as any).cornerRadius = BORDER_RADIUS.full;
  } else {
    (component as any).cornerRadius = BORDER_RADIUS_BY_SIZE[size];
  }

  // Apply fills based on state
  const fillVar = getVariableByName(
    state === "Hover"
      ? style.fillHover
      : state === "Active"
        ? style.fillActive
        : state === "Disabled"
          ? style.fillDisabled
          : style.fill,
  );

  if (fillVar) {
    bindFillToVariable(component, fillVar.id);
  } else {
    // Fallback for ghost variant (no fill)
    if (variant === "ghost" && state === "Default") {
      component.fills = [];
    }
  }

  // Apply strokes for variants that need borders
  if (style.stroke) {
    const strokeVar = getVariableByName(style.stroke);
    if (strokeVar) {
      bindStrokeToVariable(component, strokeVar.id, 1);
    }
  }

  // Apply disabled state opacity
  if (state === "Disabled") {
    (component as any).opacity = 0.5;
  }

  // Add icon instance
  const placeholderIcon = getPlaceholderIconForSize(size, placeholders);
  if (placeholderIcon) {
    const iconInstance = (placeholderIcon as any).createInstance();
    component.appendChild(iconInstance);

    // Bind icon color to text color variable
    const textVar = getVariableByName(style.text);
    if (textVar) {
      bindFillToVariable(iconInstance as any, textVar.id);
    }
  }

  // Add loader for Loading state
  if (state === "Loading" && placeholders.loader) {
    const loaderInstance = (placeholders.loader as any).createInstance();
    component.appendChild(loaderInstance);

    // Scale loader to fit button size
    const loaderSize = size === "lg" ? 16 : 14;
    (loaderInstance as any).resize(loaderSize, loaderSize);

    // Bind loader color to text color variable
    const textVar = getVariableByName(style.text);
    if (textVar) {
      bindFillToVariable(loaderInstance as any, textVar.id);
    }
  }

  return component;
}

/**
 * Create a ComponentSet for a specific variant and size
 *
 * @param variant - Button variant
 * @param size - Button size
 * @param placeholders - Placeholder component references
 * @returns ComponentSet node
 */
function createIconButtonComponentSet(
  variant: ButtonVariant,
  size: ButtonSize,
  placeholders: PlaceholderRefs,
): ComponentSetNode {
  const componentSet = figma.createComponentSet();

  // ComponentSet name: "Button Primary Icon Base"
  const variantName = variant
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const sizeName = size.charAt(0).toUpperCase() + size.slice(1);
  componentSet.name = `Button ${variantName} Icon ${sizeName}`;

  // Generate all state × shape combinations
  const components: ComponentNode[] = [];
  for (const state of BUTTON_STATES) {
    for (const shape of BUTTON_SHAPES) {
      const component = createIconButtonComponent(
        variant,
        size,
        state,
        shape,
        placeholders,
      );
      components.push(component);
    }
  }

  // Append components to ComponentSet
  for (const component of components) {
    componentSet.appendChild(component);
  }

  return componentSet;
}

/**
 * Generate all button icon components
 *
 * Creates 6 sections (one per variant) with 4 ComponentSets each (one per size)
 * Total: 24 ComponentSets × 10 components each = 240 components
 *
 * @param page - Target page for components
 * @param placeholders - Placeholder component references
 */
export async function generateButtonIconComponents(
  page: PageNode,
  placeholders: PlaceholderRefs,
): Promise<void> {
  // Generate ComponentSets for each variant
  for (const variant of BUTTON_VARIANTS) {
    // Create section for this variant
    const variantName = variant
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const section = getOrCreateSection(page, `${variantName} Icon`);

    // Generate ComponentSets for each size
    for (const size of BUTTON_SIZES) {
      const componentSet = createIconButtonComponentSet(
        variant,
        size,
        placeholders,
      );
      section.appendChild(componentSet);
    }
  }

  figma.notify("Generated 24 button icon ComponentSets (240 components total)");
}
