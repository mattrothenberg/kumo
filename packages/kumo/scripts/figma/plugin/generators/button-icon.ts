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
  xs: 20, // size-5 = 20px (adjusted for visibility)
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

/**
 * Variable names must match Figma kumo-colors collection
 * Format: "color-{name}" for fills, "text-color-{name}" for text, "color-border" for strokes
 * Note: opacity-* variables are Figma-only and need to be generated separately
 */
const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  primary: {
    fill: "color-primary",
    fillHover: "color-primary", // TODO: opacity-primary-70 needs to be generated
    fillActive: "color-primary",
    fillDisabled: "color-primary",
    text: "text-color-surface-inverse", // white text on primary
  },
  secondary: {
    fill: "color-secondary",
    fillHover: "color-secondary",
    fillActive: "color-secondary",
    fillDisabled: "color-secondary",
    text: "text-color-surface",
    stroke: "color-border",
  },
  ghost: {
    fill: "transparent", // inherit background
    fillHover: "color-accent",
    fillActive: "color-accent",
    fillDisabled: "transparent",
    text: "text-color-surface",
  },
  destructive: {
    fill: "color-error",
    fillHover: "color-error",
    fillActive: "color-error",
    fillDisabled: "color-error",
    text: "text-color-surface-inverse", // white text on error
  },
  "secondary-destructive": {
    fill: "color-secondary",
    fillHover: "color-secondary",
    fillActive: "color-secondary",
    fillDisabled: "color-secondary",
    text: "text-color-error",
    stroke: "color-border",
  },
  outline: {
    fill: "color-surface",
    fillHover: "color-surface",
    fillActive: "color-surface",
    fillDisabled: "color-surface",
    text: "text-color-surface",
    stroke: "color-border",
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

  // Add icon or loader based on state
  if (state === "Loading" && placeholders.loader) {
    // Loading state: show loader instead of icon
    const loaderInstance = (placeholders.loader as any).createInstance();
    component.appendChild(loaderInstance);

    // Scale loader to fit button size
    const loaderSize = size === "lg" ? 16 : 14;
    (loaderInstance as any).resize(loaderSize, loaderSize);
  } else {
    // Normal states: show icon placeholder
    const placeholderIcon = getPlaceholderIconForSize(size, placeholders);
    if (placeholderIcon) {
      const iconInstance = (placeholderIcon as any).createInstance();
      component.appendChild(iconInstance);
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
  // Generate all state × shape combinations as individual components first
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

  // Combine components into a ComponentSet using combineAsVariants
  // This properly creates the ComponentSet and positions it
  // @ts-ignore - combineAsVariants works with PageNode at runtime
  const componentSet = figma.combineAsVariants(components, figma.currentPage);

  // Set ComponentSet name: "Button Primary Icon Base"
  const variantName = variant
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const sizeName = size.charAt(0).toUpperCase() + size.slice(1);
  componentSet.name = `Button ${variantName} Icon ${sizeName}`;

  return componentSet;
}

/**
 * Section padding for component display
 */
const SECTION_PADDING = 48;

/**
 * Gap between sections on the page
 */
const SECTION_GAP = 48;

/**
 * Generate all button icon components
 *
 * Creates 6 sections (one per variant) with 4 ComponentSets each (one per size)
 * Total: 24 ComponentSets × 10 components each = 240 components
 *
 * @param page - Target page for components
 * @param placeholders - Placeholder component references
 * @param startY - Y position to start placing sections
 * @returns The Y position after all sections (for next section placement)
 */
export async function generateButtonIconComponents(
  page: PageNode,
  placeholders: PlaceholderRefs,
  startY: number = 100,
): Promise<number> {
  figma.currentPage = page;

  let sectionY = startY;

  // Generate ComponentSets for each variant
  for (const variant of BUTTON_VARIANTS) {
    // Create section for this variant
    const variantName = variant
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const section = getOrCreateSection(page, `Button ${variantName} Icon`);

    // Generate ComponentSets for each size
    const componentSets: ComponentSetNode[] = [];
    for (const size of BUTTON_SIZES) {
      const componentSet = createIconButtonComponentSet(
        variant,
        size,
        placeholders,
      );
      section.appendChild(componentSet);
      componentSets.push(componentSet);
    }

    // Position ComponentSets in a row with padding
    let xOffset = SECTION_PADDING;
    const spacing = 32;

    for (const cs of componentSets) {
      cs.x = xOffset;
      cs.y = SECTION_PADDING;
      xOffset += cs.width + spacing;
    }

    // Resize section to fit content
    const totalWidth = xOffset + SECTION_PADDING;
    const maxHeight = Math.max(...componentSets.map((cs) => cs.height));
    section.resizeWithoutConstraints(
      totalWidth,
      maxHeight + SECTION_PADDING * 2,
    );

    // Position section on page
    section.x = 100;
    section.y = sectionY;
    sectionY += section.height + SECTION_GAP;
  }

  console.log("✅ Generated 24 button icon ComponentSets (240 components)");

  return sectionY;
}
