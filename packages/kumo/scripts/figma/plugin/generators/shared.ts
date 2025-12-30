/**
 * Shared Utilities for Component Generators
 *
 * Common functions used by all component generators (Button, Badge, etc.)
 * Provides abstractions over Figma Plugin API for creating frames, text,
 * binding variables, and applying layouts.
 */

/**
 * Size and spacing constants from SPEC.md
 */
export const SPACING = {
  /** Extra small gap between elements */
  xs: 4,
  /** Small gap between elements */
  sm: 6,
  /** Base gap between elements */
  base: 8,
  /** Large gap between elements */
  lg: 12,
} as const;

export const BORDER_RADIUS = {
  /** Small radius (2px) */
  sm: 2,
  /** Medium radius (6px) */
  md: 6,
  /** Large radius (8px) */
  lg: 8,
  /** Full rounded (9999px) */
  full: 9999,
} as const;

export const FONT_SIZE = {
  /** Extra small (12px) */
  xs: 12,
  /** Base (16px) */
  base: 16,
  /** Large (20px) */
  lg: 20,
} as const;

/**
 * Auto-layout configuration
 */
export type AutoLayoutConfig = {
  /** Layout direction */
  mode: "HORIZONTAL" | "VERTICAL";
  /** Primary axis alignment */
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  /** Counter axis alignment */
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX";
  /** Padding (all sides equal, or {top, right, bottom, left}) */
  padding?:
    | number
    | { top: number; right: number; bottom: number; left: number };
  /** Gap between child elements */
  itemSpacing?: number;
  /** Primary axis sizing behavior */
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  /** Counter axis sizing behavior */
  counterAxisSizingMode?: "FIXED" | "AUTO";
};

/**
 * Create a frame with auto-layout configuration
 *
 * @param config - Auto-layout settings
 * @returns Frame node with auto-layout applied
 *
 * @example
 * const buttonFrame = createAutoLayoutFrame({
 *   mode: "HORIZONTAL",
 *   primaryAxisAlignItems: "CENTER",
 *   counterAxisAlignItems: "CENTER",
 *   padding: { top: 8, right: 12, bottom: 8, left: 12 },
 *   itemSpacing: 6,
 * });
 */
export function createAutoLayoutFrame(config: AutoLayoutConfig): FrameNode {
  const frame = figma.createFrame();

  // Apply layout mode
  frame.layoutMode = config.mode;

  // Apply alignment
  if (config.primaryAxisAlignItems) {
    frame.primaryAxisAlignItems = config.primaryAxisAlignItems;
  }
  if (config.counterAxisAlignItems) {
    frame.counterAxisAlignItems = config.counterAxisAlignItems;
  }

  // Apply padding
  if (config.padding !== undefined) {
    if (typeof config.padding === "number") {
      frame.paddingTop = config.padding;
      frame.paddingRight = config.padding;
      frame.paddingBottom = config.padding;
      frame.paddingLeft = config.padding;
    } else {
      frame.paddingTop = config.padding.top;
      frame.paddingRight = config.padding.right;
      frame.paddingBottom = config.padding.bottom;
      frame.paddingLeft = config.padding.left;
    }
  }

  // Apply item spacing (gap)
  if (config.itemSpacing !== undefined) {
    frame.itemSpacing = config.itemSpacing;
  }

  // Apply sizing modes
  if (config.primaryAxisSizingMode) {
    frame.primaryAxisSizingMode = config.primaryAxisSizingMode;
  }
  if (config.counterAxisSizingMode) {
    frame.counterAxisSizingMode = config.counterAxisSizingMode;
  }

  return frame;
}

/**
 * Bind a fill to a Figma variable
 *
 * @param node - Node to apply fill to
 * @param variableId - Figma variable ID
 * @param opacity - Optional opacity override (0-1)
 *
 * @example
 * const button = figma.createRectangle();
 * const primaryVar = getVariableByName("primary");
 * bindFillToVariable(button, primaryVar.id);
 */
export function bindFillToVariable(
  node: SceneNode,
  variableId: string,
  opacity?: number,
): void {
  if (!("fills" in node)) return;

  const variable = figma.variables.getVariableById(variableId);
  if (!variable) {
    console.warn(`Variable not found: ${variableId}`);
    return;
  }

  // Create a base fill
  let fill: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 },
    opacity: opacity !== undefined ? opacity : 1,
  };

  // Bind the variable to the fill's color property
  fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);

  node.fills = [fill];
}

/**
 * Bind a stroke to a Figma variable
 *
 * @param node - Node to apply stroke to
 * @param variableId - Figma variable ID
 * @param weight - Stroke weight in pixels (default: 1)
 *
 * @example
 * const button = figma.createFrame();
 * const borderVar = getVariableByName("border");
 * bindStrokeToVariable(button, borderVar.id, 1);
 */
export function bindStrokeToVariable(
  node: SceneNode,
  variableId: string,
  weight: number = 1,
): void {
  if (!("strokes" in node)) return;

  const variable = figma.variables.getVariableById(variableId);
  if (!variable) {
    console.warn(`Variable not found: ${variableId}`);
    return;
  }

  // Create a base stroke
  let stroke: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 },
  };

  // Bind the variable to the stroke's color property
  stroke = figma.variables.setBoundVariableForPaint(stroke, "color", variable);

  node.strokes = [stroke];
  node.strokeWeight = weight;
}

/**
 * Create a text node with styling
 *
 * @param text - Text content
 * @param fontSize - Font size in pixels
 * @param fontWeight - Font weight (default: 400)
 * @returns Text node
 *
 * @example
 * const label = createTextNode("Button", 16, 500);
 */
export async function createTextNode(
  text: string,
  fontSize: number,
  fontWeight: number = 400,
): Promise<TextNode> {
  const textNode = figma.createText();

  // Load font before setting properties
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fontName = { family: "Inter", style: "Regular" };

  // Note: fontWeight requires loading specific font styles
  // This is simplified - actual implementation needs proper font loading
  if (fontWeight >= 600) {
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    textNode.fontName = { family: "Inter", style: "Semi Bold" };
  } else if (fontWeight >= 500) {
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    textNode.fontName = { family: "Inter", style: "Medium" };
  }

  return textNode;
}

/**
 * Get a variable by name from the kumo-colors collection
 *
 * @param variableName - Variable name (e.g., "primary", "opacity-primary-70")
 * @returns Variable or undefined if not found
 *
 * @example
 * const primaryVar = getVariableByName("primary");
 * if (primaryVar) {
 *   bindFillToVariable(node, primaryVar.id);
 * }
 */
export function getVariableByName(variableName: string): Variable | undefined {
  const collections = figma.variables.getLocalVariableCollections();
  const kumoColors = collections.find((c) => c.name === "kumo-colors");

  if (!kumoColors) {
    console.warn("kumo-colors collection not found");
    return undefined;
  }

  const variables = kumoColors.variableIds
    .map((id) => figma.variables.getVariableById(id))
    .filter((v): v is Variable => v !== null);

  return variables.find((v) => v.name === variableName);
}

/**
 * Section configuration for consistent styling
 */
export const SECTION_CONFIG = {
  /** Padding inside section */
  padding: 48,
  /** Minimum width */
  minWidth: 400,
  /** Minimum height */
  minHeight: 200,
} as const;

/**
 * Get or create a section node on a page with white background
 *
 * @param page - Page to create section on
 * @param sectionName - Section name
 * @returns Section node with white fill and padding
 *
 * @example
 * const page = figma.currentPage;
 * const section = getOrCreateSection(page, "Badge");
 */
export function getOrCreateSection(
  page: any,
  sectionName: string,
): SectionNode {
  const existing = page.findChild((n: any) => n.name === sectionName);
  if (existing && existing.type === "SECTION") {
    return existing as SectionNode;
  }

  const section = figma.createSection();
  section.name = sectionName;

  // Set white background fill
  section.fills = [
    {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 }, // White
    },
  ];

  page.appendChild(section);

  return section;
}

/**
 * Create a component property definition
 *
 * @param name - Property name
 * @param type - Property type
 * @param options - Additional options (default value, variant options, etc.)
 * @returns Component property definition
 */
export type ComponentPropertyOptions = {
  defaultValue?: string | boolean;
  variantOptions?: string[];
};

export function createComponentProperty(
  name: string,
  type: "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" | "VARIANT",
  options?: ComponentPropertyOptions,
): ComponentPropertyDefinition {
  const baseProperty = {
    type,
  };

  if (type === "BOOLEAN" && options?.defaultValue !== undefined) {
    return {
      ...baseProperty,
      type: "BOOLEAN",
      defaultValue: Boolean(options.defaultValue),
    };
  }

  if (type === "TEXT" && options?.defaultValue !== undefined) {
    return {
      ...baseProperty,
      type: "TEXT",
      defaultValue: String(options.defaultValue),
    };
  }

  if (type === "VARIANT" && options?.variantOptions) {
    return {
      ...baseProperty,
      type: "VARIANT",
      defaultValue: String(options?.defaultValue || options.variantOptions[0]),
      variantOptions: options.variantOptions,
    };
  }

  if (type === "INSTANCE_SWAP") {
    return {
      ...baseProperty,
      type: "INSTANCE_SWAP",
    };
  }

  return baseProperty as ComponentPropertyDefinition;
}

/**
 * Apply corner radius to a node
 *
 * @param node - Node to apply radius to
 * @param radius - Radius value (number or preset key)
 */
export function applyCornerRadius(
  node: SceneNode,
  radius: number | keyof typeof BORDER_RADIUS,
): void {
  if (!("cornerRadius" in node)) return;

  const radiusValue =
    typeof radius === "number" ? radius : BORDER_RADIUS[radius];
  node.cornerRadius = radiusValue;
}
