/**
 * Icon Utilities for Component Generators
 *
 * Provides functions to find and use icon components from the Icon Library page.
 * Icons are created by icon-library.ts with names like "Icon/ph-check", "Icon/cf-workers-outline".
 */

import { getVariableByName, bindFillToVariable } from "./shared";

/**
 * Icon size mapping for different button sizes
 */
export var ICON_SIZE_MAP: Record<string, number> = {
  xs: 12,
  sm: 16,
  base: 20,
  lg: 20,
};

/**
 * Default icons used in components
 */
export var DEFAULT_ICONS = {
  /** Plus icon for add buttons */
  plus: "ph-plus",
  /** Refresh/arrows clockwise for refresh button */
  refresh: "ph-arrows-clockwise",
  /** Check icon for checkboxes */
  check: "ph-check",
  /** Minus icon for indeterminate checkbox */
  minus: "ph-minus",
  /** Arrow right for link buttons */
  arrowRight: "ph-arrow-right",
};

/**
 * Find an icon component by name from the Icon Library page
 *
 * @param iconId - Icon ID without "Icon/" prefix (e.g., "ph-check", "cf-workers-outline")
 * @returns ComponentNode if found, undefined otherwise
 */
export function findIconComponent(iconId: string): ComponentNode | undefined {
  // Find the Icon Library page
  var iconLibraryPage = figma.root.children.find(function (page) {
    return page.type === "PAGE" && page.name === "Icon Library";
  }) as PageNode | undefined;

  if (!iconLibraryPage) {
    console.warn("Icon Library page not found. Run icon generation first.");
    return undefined;
  }

  // Find the Icons container frame
  var iconsFrame = iconLibraryPage.children.find(function (node) {
    return node.type === "FRAME" && node.name === "Icons";
  }) as FrameNode | undefined;

  if (!iconsFrame) {
    console.warn("Icons frame not found in Icon Library page.");
    return undefined;
  }

  // Search for the icon component by name
  var componentName = "Icon/" + iconId;
  var iconComponent = iconsFrame.children.find(function (node) {
    return node.type === "COMPONENT" && node.name === componentName;
  }) as ComponentNode | undefined;

  if (!iconComponent) {
    console.warn("Icon component not found: " + componentName);
  }

  return iconComponent;
}

/**
 * Create an icon instance at a specific size
 *
 * @param iconId - Icon ID (e.g., "ph-check")
 * @param size - Target size in pixels
 * @returns InstanceNode if icon found, undefined otherwise
 */
export function createIconInstance(
  iconId: string,
  size: number,
): InstanceNode | undefined {
  var iconComponent = findIconComponent(iconId);
  if (!iconComponent) {
    return undefined;
  }

  var instance = iconComponent.createInstance();
  instance.resize(size, size);
  return instance;
}

/**
 * Create a placeholder icon when the real icon is not available
 * Used as fallback when Icon Library hasn't been generated yet
 *
 * @param size - Icon size in pixels
 * @returns FrameNode with a simple placeholder shape
 */
export function createPlaceholderIcon(size: number): FrameNode {
  var frame = figma.createFrame();
  frame.name = "Placeholder Icon";
  frame.resize(size, size);
  frame.fills = [];

  // Create a rounded rectangle as the icon placeholder
  var rect = figma.createRectangle();
  rect.resize(size, size);
  rect.x = 0;
  rect.y = 0;
  rect.cornerRadius = size * 0.2;
  rect.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];

  frame.appendChild(rect);
  return frame;
}

/**
 * Get an icon instance for a button, with fallback to placeholder
 *
 * @param iconId - Icon ID (e.g., "ph-plus")
 * @param size - Button size key (xs, sm, base, lg)
 * @returns InstanceNode of the icon or a placeholder frame
 */
export function getButtonIcon(
  iconId: string,
  size: string,
): InstanceNode | FrameNode {
  var iconSize = ICON_SIZE_MAP[size] || 20;
  var instance = createIconInstance(iconId, iconSize);

  if (instance) {
    return instance;
  }

  // Fallback to placeholder
  console.warn(
    "Using placeholder for icon: " + iconId + ". Generate Icon Library first.",
  );
  return createPlaceholderIcon(iconSize);
}

/**
 * Create a loader component for loading states
 *
 * @param size - Loader size in pixels (default: 16)
 * @returns FrameNode with a circular spinner shape
 */
export function createLoader(size: number): FrameNode {
  if (size === undefined) size = 16;

  var frame = figma.createFrame();
  frame.name = "Loader";
  frame.resize(size, size);
  frame.fills = [];

  // Create circle with stroke (spinner ring)
  var spinner = figma.createEllipse();
  spinner.resize(size, size);
  spinner.x = 0;
  spinner.y = 0;

  // Transparent fill, visible stroke
  spinner.fills = [];
  spinner.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
  spinner.strokeWeight = 2;
  spinner.strokeAlign = "CENTER";

  // Dashed stroke to create spinner appearance
  spinner.dashPattern = [4, 4];

  frame.appendChild(spinner);
  return frame;
}

/**
 * Bind icon fill color to a Figma variable or hardcoded color
 *
 * Traverses all vector/shape nodes within an icon and binds their fills
 * to a color variable from the kumo-colors collection.
 *
 * Special cases:
 * - "text-white" → hardcoded white (#FFFFFF)
 * - "text-surface-inverse" → maps to "text-color-surface-inverse" variable
 *
 * @param icon - Icon instance or frame containing vector nodes
 * @param colorVariableName - Variable name or special value (e.g., 'text-surface', 'text-white')
 *
 * @example
 * const iconInstance = createIconInstance("ph-check", 20);
 * if (iconInstance) {
 *   bindIconColor(iconInstance, "text-surface");
 * }
 */
export function bindIconColor(
  icon: InstanceNode | FrameNode,
  colorVariableName: string,
): void {
  // Handle hardcoded white (not a variable)
  var isHardcodedWhite =
    colorVariableName === "text-white" || colorVariableName === "!text-white";

  // Map semantic names to Figma variable names
  var figmaVariableName = colorVariableName;
  if (colorVariableName === "text-surface") {
    figmaVariableName = "text-color-surface";
  } else if (colorVariableName === "text-surface-inverse") {
    figmaVariableName = "text-color-surface-inverse";
  } else if (colorVariableName === "fill-surface-inverse") {
    // fill-surface-inverse uses color-surface-inverse (dark on light, light on dark)
    figmaVariableName = "color-surface-inverse";
  } else if (colorVariableName === "text-muted") {
    figmaVariableName = "text-color-muted";
  } else if (colorVariableName === "text-error") {
    figmaVariableName = "text-color-error";
  } else if (colorVariableName === "text-info") {
    figmaVariableName = "text-color-info";
  } else if (colorVariableName === "text-disabled") {
    figmaVariableName = "text-color-disabled";
  } else if (colorVariableName === "text-label") {
    figmaVariableName = "text-color-label";
  }

  var variable: Variable | undefined;
  if (!isHardcodedWhite) {
    variable = getVariableByName(figmaVariableName);

    if (!variable) {
      console.warn(
        "Failed to bind icon color: variable '" +
          figmaVariableName +
          "' not found (from '" +
          colorVariableName +
          "')",
      );
      figma.notify("⚠️ Icon color variable not found: " + figmaVariableName, {
        error: true,
      });
      return;
    }
  }

  // Recursively traverse all nodes to find vectors/shapes
  function traverseAndBind(node: SceneNode): void {
    // Bind fills for vector nodes
    if (
      node.type === "VECTOR" ||
      node.type === "ELLIPSE" ||
      node.type === "RECTANGLE" ||
      node.type === "POLYGON" ||
      node.type === "STAR" ||
      node.type === "LINE"
    ) {
      if (isHardcodedWhite) {
        // Set hardcoded white fill
        var whiteFill: SolidPaint = {
          type: "SOLID",
          color: { r: 1, g: 1, b: 1 },
        };
        (node as unknown as MinimalFillsMixin).fills = [whiteFill];
      } else if (variable) {
        bindFillToVariable(node, variable.id);
      }
    }

    // Recursively process children
    if ("children" in node && node.children) {
      for (var i = 0; i < node.children.length; i++) {
        traverseAndBind(node.children[i]);
      }
    }
  }

  traverseAndBind(icon);
}
