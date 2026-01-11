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
 * Section positioning constants for Figma canvas layout
 */
export const SECTION_LAYOUT = {
  /** X position for section start */
  startX: 100,
  /** Y position for section start */
  startY: 100,
  /** Gap between light/dark mode sections */
  modeGap: 50,
} as const;

/**
 * Opacity values for component states
 */
export const OPACITY = {
  /** Opacity for disabled state */
  disabled: 0.5,
  /** Opacity for backdrop/overlay */
  backdrop: 0.8,
} as const;

/**
 * RGB color constants for Figma
 */
export const COLORS = {
  /** Placeholder/fallback gray */
  placeholder: { r: 0.5, g: 0.5, b: 0.5 },
  /** Fallback white */
  fallbackWhite: { r: 1, g: 1, b: 1 },
  /** Spinner stroke color */
  spinnerStroke: { r: 0.4, g: 0.4, b: 0.4 },
} as const;

/**
 * Layout constants for component display sections
 */
export const SECTION_PADDING = 48;
export const SECTION_GAP = 160;

/**
 * Shadow presets for components
 * Values match Figma shadow designs for elevated UI elements
 */
export const SHADOWS = {
  /** Dialog shadow - elevated appearance (0px 8px 32px rgba(0,0,0,0.16)) */
  dialog: {
    offsetX: 0,
    offsetY: 8,
    blur: 32,
    spread: 0,
    opacity: 0.16,
  },
  /** Subtle shadow for tabs indicator (0px 1px 2px rgba(0,0,0,0.05)) */
  subtle: {
    offsetX: 0,
    offsetY: 1,
    blur: 2,
    spread: 0,
    opacity: 0.05,
  },
} as const;

/**
 * Grid layout constants for component display sections
 * Used to arrange component variants in consistent grids with labels
 */
export const GRID_LAYOUT = {
  /** Vertical gap between component rows (common: 24-80px depending on component density) */
  rowGap: {
    /** Compact spacing for dense components (e.g., tabs, menubar, clipboard-text) */
    compact: 24,
    /** Medium spacing for standard components (e.g., badge, breadcrumbs, empty, meter) */
    medium: 40,
    /** Standard spacing for most components (e.g., banner, checkbox, switch, pagination) */
    standard: 48,
    /** Spacious layout for large components (e.g., refresh-button, code-block) */
    spacious: 60,
    /** Extra spacious for complex components (e.g., button, link-button) */
    extraSpacious: 80,
  },
  /** Width of label column for variant labels (common: 100-280px depending on label length) */
  labelColumnWidth: {
    /** Minimal width for short labels (e.g., surface, loader) */
    minimal: 100,
    /** Compact width for standard labels (e.g., collapsible, dialog) */
    compact: 120,
    /** Small width for slightly longer labels (e.g., clipboard-text, refresh-button) */
    small: 140,
    /** Standard width for typical labels (e.g., code, banner, menubar, tabs, text, layer-card) */
    standard: 160,
    /** Medium width for longer labels (e.g., badge, breadcrumbs, empty, meter, pagination, checkbox, dropdown, date-range-picker, select, combobox) */
    medium: 180,
    /** Wide for complex labels (e.g., input, input-area) */
    wide: 200,
    /** Wider for very long labels (e.g., button, link-button, sensitive-input) */
    wider: 220,
    /** Widest for exceptionally long labels (e.g., switch with multiple properties) */
    widest: 280,
  },
  /** Height of header row for column headers (typically 24px) */
  headerRowHeight: 24,
  /** Label vertical centering offsets by size */
  labelVerticalOffset: {
    /** Small offset for compact components (badge, loader) */
    sm: 4,
    /** Medium offset for standard components (input, checkbox) */
    md: 8,
    /** Large offset for larger components (button, dialog) */
    lg: 12,
  },
} as const;

/**
 * Fallback values when parsing fails
 * Used as defensive defaults when registry or parser doesn't provide expected values
 */
export const FALLBACK_VALUES = {
  /** Default font size (text-base = 16px) */
  fontSize: 16,
  /** Default font weight (normal = 400, medium = 500, semiBold = 600) */
  fontWeight: {
    /** Normal weight (CSS default) */
    normal: 400,
    /** Medium weight (commonly used in UI) */
    medium: 500,
    /** Semi-bold weight (used in headings and emphasis) */
    semiBold: 600,
  },
  /** Default padding values (px-3 = 12px, py-1.5 = 6px) */
  padding: {
    /** Horizontal padding for inputs/buttons (px-3 = 12px) */
    horizontal: 12,
    /** Vertical padding for compact components (py-1.5 = 6px) */
    vertical: 6,
    /** Standard padding for content areas (p-4 = 16px) */
    standard: 16,
    /** Large padding for dialogs and cards (p-6 = 24px) */
    large: 24,
  },
  /** Default border radius (rounded-lg = 8px, rounded-md = 6px) */
  borderRadius: {
    /** Medium radius (rounded-md = 6px) */
    medium: 6,
    /** Large radius (rounded-lg = 8px) */
    large: 8,
  },
  /** Default gap between elements (gap-1.5 = 6px, gap-2 = 8px, gap-1 = 4px) */
  gap: {
    /** Tight gap (gap-1 = 4px) */
    tight: 4,
    /** Standard gap (gap-1.5 = 6px) */
    standard: 6,
    /** Medium gap (gap-2 = 8px) */
    medium: 8,
    /** Large gap for dialogs and cards (gap-4 = 16px) */
    large: 16,
  },
  /** Default height for inputs/buttons (h-9 = 36px) */
  height: {
    /** Base input/button height (h-9 = 36px) */
    base: 36,
  },
  /** Default stroke weight for borders */
  strokeWeight: 1,
  /** Default icon size (size-5 = 20px, size-4.5 = 18px, size-3 = 12px) */
  iconSize: {
    /** Small icon (size-3 = 12px) */
    small: 12,
    /** Medium icon (size-4.5 = 18px) */
    medium: 18,
    /** Base icon (size-5 = 20px) */
    base: 20,
  },
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
  align: "INSIDE" | "OUTSIDE" | "CENTER" = "INSIDE",
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

  // Set stroke alignment - INSIDE matches CSS border behavior better
  // and ensures the stroke is fully visible within the node bounds
  if ("strokeAlign" in node) {
    (
      node as unknown as { strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER" }
    ).strokeAlign = align;
  }
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

  // Load ALL required fonts BEFORE setting any text properties
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  if (fontWeight >= 600) {
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  } else if (fontWeight >= 500) {
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  }

  // Now set text properties after all fonts are loaded
  textNode.characters = text;
  textNode.fontSize = fontSize;

  // Apply the appropriate font style based on weight
  if (fontWeight >= 600) {
    textNode.fontName = { family: "Inter", style: "Semi Bold" };
  } else if (fontWeight >= 500) {
    textNode.fontName = { family: "Inter", style: "Medium" };
  } else {
    textNode.fontName = { family: "Inter", style: "Regular" };
  }

  return textNode;
}

/**
 * Create a row label for component sections
 *
 * @param text - Label text (e.g., "variant=primary", "disabled=true")
 * @param x - X position
 * @param y - Y position
 * @returns Text node styled as a label
 *
 * @example
 * const label = await createRowLabel("variant=primary, size=base", 0, 100);
 */
export async function createRowLabel(
  text: string,
  x: number,
  y: number,
): Promise<TextNode> {
  const textNode = figma.createText();

  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  textNode.characters = text;
  textNode.fontSize = 12;
  textNode.fontName = { family: "Inter", style: "Medium" };

  // Use muted color for labels
  const mutedVar = getVariableByName("text-color-muted");
  if (mutedVar) {
    let fill: SolidPaint = {
      type: "SOLID",
      color: { r: 0.5, g: 0.5, b: 0.5 },
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", mutedVar);
    textNode.fills = [fill];
  } else {
    // Fallback to gray
    textNode.fills = [
      {
        type: "SOLID",
        color: { r: 0.5, g: 0.5, b: 0.5 },
      },
    ];
  }

  textNode.x = x;
  textNode.y = y;

  return textNode;
}

/**
 * Create column headers for component grids (e.g., size=xs, size=sm, etc.)
 *
 * @param headers - Array of { x, text } for each column header
 * @param y - Y position for all headers (typically above the grid)
 * @param frame - Frame to append headers to
 *
 * @example
 * await createColumnHeaders(
 *   [{ x: 180, text: "size=xs" }, { x: 280, text: "size=sm" }],
 *   SECTION_PADDING,
 *   lightSection.frame
 * );
 */
export async function createColumnHeaders(
  headers: { x: number; text: string }[],
  y: number,
  frame: FrameNode,
): Promise<void> {
  for (const header of headers) {
    const labelNode = await createRowLabel(header.text, header.x, y);
    frame.appendChild(labelNode);
  }
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
    console.warn(
      "kumo-colors collection not found. Available collections:",
      collections.map((c) => c.name).join(", ") || "none",
    );
    figma.notify("⚠️ kumo-colors collection not found", { error: true });
    return undefined;
  }

  const variables = kumoColors.variableIds
    .map((id) => figma.variables.getVariableById(id))
    .filter((v): v is Variable => v !== null);

  const variable = variables.find((v) => v.name === variableName);

  if (!variable) {
    console.warn(
      `Variable "${variableName}" not found in kumo-colors collection`,
    );
  }

  return variable;
}

/**
 * Helper to set white text color (hardcoded, not a variable)
 *
 * @param textNode - Text node to apply white color to
 */
export function setWhiteTextColor(textNode: TextNode): void {
  const fill: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 },
  };
  textNode.fills = [fill];
}

/**
 * Helper to bind text color to a Figma variable
 *
 * @param textNode - Text node to apply color to
 * @param variableId - Figma variable ID
 */
export function bindTextColorToVariable(
  textNode: TextNode,
  variableId: string,
): void {
  const variable = figma.variables.getVariableById(variableId);
  if (!variable) {
    console.warn("Variable not found: " + variableId);
    figma.notify(`⚠️ Text color variable not found: ${variableId}`, {
      error: true,
    });
    return;
  }

  let fill: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 },
  };

  fill = figma.variables.setBoundVariableForPaint(fill, "color", variable);
  textNode.fills = [fill];
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
 * Color mode for sections
 */
export type ColorMode = "light" | "dark";

/**
 * Get the kumo-colors collection and its mode IDs
 */
function getKumoColorsModes(): {
  collection: VariableCollection;
  lightModeId: string;
  darkModeId: string;
} | null {
  const collections = figma.variables.getLocalVariableCollections();
  const kumoColors = collections.find((c) => c.name === "kumo-colors");

  if (!kumoColors) {
    console.warn("kumo-colors collection not found");
    return null;
  }

  // Find light and dark mode IDs
  const lightMode = kumoColors.modes.find(
    (m) => m.name.toLowerCase() === "light",
  );
  const darkMode = kumoColors.modes.find(
    (m) => m.name.toLowerCase() === "dark",
  );

  if (!lightMode || !darkMode) {
    console.warn("Light or dark mode not found in kumo-colors collection");
    return null;
  }

  return {
    collection: kumoColors,
    lightModeId: lightMode.modeId,
    darkModeId: darkMode.modeId,
  };
}

/**
 * Result from creating a mode section - contains both section and inner frame
 */
export type ModeSectionResult = {
  /** The outer section node */
  section: SectionNode;
  /** The inner frame with variable-bound background */
  frame: FrameNode;
};

/**
 * Create a section with an inner frame that has bg-surface variable fill and explicit color mode
 *
 * The section provides organization, while the inner frame provides:
 * - Variable-bound background (bg-surface)
 * - Explicit color mode (light/dark)
 *
 * @param page - Page to create section on
 * @param sectionName - Section name
 * @param mode - Color mode ("light" or "dark")
 * @returns Object with section and inner frame
 */
export function createModeSection(
  page: PageNode | DocumentNode,
  sectionName: string,
  mode: ColorMode,
): ModeSectionResult {
  const section = figma.createSection();
  section.name = `${sectionName} (${mode})`;

  // Create inner frame for variable binding
  const frame = figma.createFrame();
  frame.name = "Content";
  frame.layoutMode = "NONE"; // Components will be positioned manually

  // Get the surface variable for background
  const surfaceVar = getVariableByName("color-surface");

  if (surfaceVar) {
    // Create fill bound to surface variable
    let fill: SolidPaint = {
      type: "SOLID",
      color: { r: 1, g: 1, b: 1 },
    };
    fill = figma.variables.setBoundVariableForPaint(fill, "color", surfaceVar);
    frame.fills = [fill];
  } else {
    // Fallback to static colors if variable not found
    frame.fills = [
      {
        type: "SOLID",
        color:
          mode === "light"
            ? { r: 1, g: 1, b: 1 } // White
            : { r: 0.067, g: 0.067, b: 0.067 }, // #111111
      },
    ];
  }

  // Set explicit variable mode on the frame
  const modesInfo = getKumoColorsModes();
  if (modesInfo) {
    const modeId =
      mode === "light" ? modesInfo.lightModeId : modesInfo.darkModeId;
    frame.setExplicitVariableModeForCollection(modesInfo.collection, modeId);
  }

  // Add frame to section
  section.appendChild(frame);

  // Position frame at origin within section
  frame.x = 0;
  frame.y = 0;

  // Section has no fill (transparent)
  section.fills = [];

  // @ts-expect-error - Figma types are overly strict for appendChild
  page.appendChild(section);

  return { section, frame };
}

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
 *
 * @deprecated Use createModeSection instead for light/dark mode support
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

/**
 * Find a ComponentSet by name on the Components page
 *
 * @param componentSetName - Name of the ComponentSet (e.g., "Checkbox", "Button")
 * @returns ComponentSetNode if found, undefined otherwise
 */
export function findComponentSet(
  componentSetName: string,
): ComponentSetNode | undefined {
  // Find the Components page
  const componentsPage = figma.root.children.find(function (page) {
    return (
      page.type === "PAGE" && page.name.trim().toLowerCase() === "components"
    );
  }) as PageNode | undefined;

  if (!componentsPage) {
    console.warn("Components page not found");
    return undefined;
  }

  // Search recursively for the ComponentSet (it may be inside sections/frames)
  function findInNode(node: SceneNode): ComponentSetNode | undefined {
    if (node.type === "COMPONENT_SET" && node.name === componentSetName) {
      return node as ComponentSetNode;
    }

    if ("children" in node && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const found = findInNode(node.children[i]);
        if (found) return found;
      }
    }

    return undefined;
  }

  for (let i = 0; i < componentsPage.children.length; i++) {
    const found = findInNode(componentsPage.children[i]);
    if (found) return found;
  }

  console.warn("ComponentSet not found: " + componentSetName);
  return undefined;
}

/**
 * Create an instance of a component variant from a ComponentSet
 *
 * @param componentSetName - Name of the ComponentSet (e.g., "Checkbox")
 * @param variantProps - Object with variant property values (e.g., { state: "checked", variant: "default" })
 * @returns InstanceNode if found, undefined otherwise
 *
 * @example
 * const checkbox = createComponentInstance("Checkbox", { state: "checked", variant: "default", disabled: "false" });
 */
export function createComponentInstance(
  componentSetName: string,
  variantProps: Record<string, string>,
): InstanceNode | undefined {
  const componentSet = findComponentSet(componentSetName);
  if (!componentSet) {
    return undefined;
  }

  // Build the variant name string (e.g., "state=checked, variant=default, disabled=false")
  const variantName = Object.entries(variantProps)
    .map(function (entry) {
      return entry[0] + "=" + entry[1];
    })
    .join(", ");

  // Find the matching component variant
  const children = componentSet.children;
  if (!children) {
    return undefined;
  }

  const variant = children.find(function (child) {
    return child.type === "COMPONENT" && child.name === variantName;
  }) as ComponentNode | undefined;

  if (!variant) {
    console.warn(
      "Variant not found in " + componentSetName + ": " + variantName,
    );
    return undefined;
  }

  return variant.createInstance();
}
