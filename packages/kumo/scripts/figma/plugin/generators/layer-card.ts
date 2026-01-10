/**
 * LayerCard Component Generator
 *
 * Generates a LayerCard ComponentSet in Figma that matches
 * the LayerCard component structure:
 *
 * - LayerCard (root): Container with bg-surface-2, ring-border
 * - LayerCard.Secondary: Header section with text-label
 * - LayerCard.Primary: Main content area with bg-layer-card-primary
 *
 * LayerCard has no variants - it's a single compound component style.
 *
 * @see packages/kumo/src/components/layer-card/layer-card.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindFillToVariable,
  bindStrokeToVariable,
  bindTextColorToVariable,
  BORDER_RADIUS,
} from "./shared";
import { createIconInstance, bindIconColor, DEFAULT_ICONS } from "./icon-utils";
import registry from "../../../../ai/component-registry.json";

/**
 * Section padding for component display
 */
var SECTION_PADDING = 48;

/**
 * Gap between sections on the page
 */
var SECTION_GAP = 160;

/**
 * LayerCard dimensions
 */
var LAYER_CARD_CONFIG = {
  width: 280,
  borderRadius: BORDER_RADIUS.lg,
  secondary: {
    paddingX: 8,
    paddingY: 8,
    gap: 8,
    fontSize: 16,
    fontWeight: 500,
  },
  primary: {
    paddingX: 16,
    paddingY: 16,
    paddingRight: 12,
    gap: 8,
    fontSize: 16,
    fontWeight: 400,
    borderRadius: BORDER_RADIUS.lg,
  },
};

/**
 * Create a single LayerCard component
 *
 * Structure:
 * - Root frame (bg-surface-2, ring-border)
 *   - Secondary frame (header with text-label)
 *   - Primary frame (bg-layer-card-primary, ring-color)
 *
 * @returns ComponentNode for the LayerCard
 */
async function createLayerCardComponent(): Promise<ComponentNode> {
  console.log("LayerCard: Creating component...");
  var config = LAYER_CARD_CONFIG;

  // Create component
  var component = figma.createComponent();
  console.log("LayerCard: Component created");
  component.name = "default";
  component.description =
    "LayerCard - A layered card component with secondary header and primary content area";

  // Set up vertical auto-layout for root
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  // Set width directly - height will auto-size from children
  component.resizeWithoutConstraints(config.width, 100);
  component.itemSpacing = 0;
  component.cornerRadius = config.borderRadius;

  // Apply root background (bg-surface-2)
  var rootBgVar = getVariableByName("color-surface-2");
  if (rootBgVar) {
    bindFillToVariable(component, rootBgVar.id);
  } else {
    console.log(
      "LayerCard: color-surface-2 variable not found, using fallback",
    );
    // Fallback to surface variable
    var fallbackBgVar = getVariableByName("color-surface");
    if (fallbackBgVar) {
      bindFillToVariable(component, fallbackBgVar.id);
    }
  }

  // Apply root ring (ring-border)
  var rootRingVar = getVariableByName("color-border");
  if (rootRingVar) {
    bindStrokeToVariable(component, rootRingVar.id, 1);
  }

  // Create Secondary section (header)
  var secondaryFrame = figma.createFrame();
  secondaryFrame.name = "Secondary";
  secondaryFrame.layoutMode = "HORIZONTAL";
  // Use SPACE_BETWEEN to push icon to the right (like justify-between in CSS)
  secondaryFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  secondaryFrame.counterAxisAlignItems = "CENTER";
  // Note: layoutSizingHorizontal = "FILL" must be set AFTER appending to auto-layout parent
  secondaryFrame.primaryAxisSizingMode = "FIXED";
  secondaryFrame.counterAxisSizingMode = "AUTO";
  secondaryFrame.paddingLeft = config.secondary.paddingX;
  secondaryFrame.paddingRight = config.secondary.paddingX;
  secondaryFrame.paddingTop = config.secondary.paddingY;
  secondaryFrame.paddingBottom = config.secondary.paddingY;
  secondaryFrame.itemSpacing = config.secondary.gap;
  secondaryFrame.fills = [];

  // Secondary text
  console.log("LayerCard: Creating secondary text...");
  var secondaryText = await createTextNode(
    "Next Steps",
    config.secondary.fontSize,
    config.secondary.fontWeight,
  );
  console.log("LayerCard: Secondary text created");
  secondaryText.name = "Title";
  secondaryText.textAutoResize = "WIDTH_AND_HEIGHT";

  var secondaryTextVar = getVariableByName("text-color-label");
  if (secondaryTextVar) {
    bindTextColorToVariable(secondaryText, secondaryTextVar.id);
  }

  // Create arrow icon button (ghost button with arrow-right icon)
  var iconButtonFrame = figma.createFrame();
  iconButtonFrame.name = "Action Button";
  iconButtonFrame.layoutMode = "HORIZONTAL";
  iconButtonFrame.primaryAxisAlignItems = "CENTER";
  iconButtonFrame.counterAxisAlignItems = "CENTER";
  iconButtonFrame.resize(28, 28); // sm size button
  iconButtonFrame.cornerRadius = 4;
  iconButtonFrame.fills = []; // Ghost button has no background

  // Create arrow-right icon
  var arrowIcon = createIconInstance(DEFAULT_ICONS.arrowRight, 16);
  if (arrowIcon) {
    arrowIcon.name = "Icon";
    // Bind icon color to text-label (same as the title text)
    bindIconColor(arrowIcon, "text-label");
    iconButtonFrame.appendChild(arrowIcon);
  } else {
    // Fallback: create a simple arrow placeholder if icon library not generated
    console.log("LayerCard: Arrow icon not found, using placeholder");
    var arrowPlaceholder = figma.createFrame();
    arrowPlaceholder.name = "Arrow Placeholder";
    arrowPlaceholder.resize(16, 16);
    arrowPlaceholder.fills = [];
    var arrowBorderVar = getVariableByName("color-border");
    if (arrowBorderVar) {
      bindStrokeToVariable(arrowPlaceholder, arrowBorderVar.id, 1);
    }
    iconButtonFrame.appendChild(arrowPlaceholder);
  }

  secondaryFrame.appendChild(secondaryText);
  secondaryFrame.appendChild(iconButtonFrame);
  // Append to parent FIRST, then set FILL sizing
  component.appendChild(secondaryFrame);
  secondaryFrame.layoutSizingHorizontal = "FILL";

  // Create Primary section (main content)
  var primaryFrame = figma.createFrame();
  primaryFrame.name = "Primary";
  primaryFrame.layoutMode = "VERTICAL";
  primaryFrame.primaryAxisAlignItems = "MIN";
  primaryFrame.counterAxisAlignItems = "MIN";
  // Note: layoutSizingHorizontal = "FILL" must be set AFTER appending to auto-layout parent
  primaryFrame.primaryAxisSizingMode = "AUTO";
  primaryFrame.counterAxisSizingMode = "AUTO";
  primaryFrame.paddingLeft = config.primary.paddingX;
  primaryFrame.paddingRight = config.primary.paddingRight;
  primaryFrame.paddingTop = config.primary.paddingY;
  primaryFrame.paddingBottom = config.primary.paddingY;
  primaryFrame.itemSpacing = config.primary.gap;
  primaryFrame.cornerRadius = config.primary.borderRadius;

  // Apply primary background (bg-layer-card-primary)
  // Fallback to color-surface if color-layer-card-primary doesn't exist
  var primaryBgVar = getVariableByName("color-layer-card-primary");
  if (!primaryBgVar) {
    primaryBgVar = getVariableByName("color-surface");
  }
  if (primaryBgVar) {
    bindFillToVariable(primaryFrame, primaryBgVar.id);
  }

  // Apply primary ring (ring-color)
  // Fallback to color-border if color-color doesn't exist
  var primaryRingVar = getVariableByName("color-color");
  if (!primaryRingVar) {
    console.log("LayerCard: color-color not found, trying color-border");
    primaryRingVar = getVariableByName("color-border");
  }
  if (primaryRingVar) {
    bindStrokeToVariable(primaryFrame, primaryRingVar.id, 1);
  } else {
    console.log("LayerCard: No ring variable found for primary section");
  }

  // Primary text content
  console.log("LayerCard: Creating primary text...");
  var primaryText = await createTextNode(
    "Get started with Kumo",
    config.primary.fontSize,
    config.primary.fontWeight,
  );
  console.log("LayerCard: Primary text created");
  primaryText.name = "Content";
  primaryText.textAutoResize = "WIDTH_AND_HEIGHT";

  var primaryTextVar = getVariableByName("text-color-surface");
  if (primaryTextVar) {
    bindTextColorToVariable(primaryText, primaryTextVar.id);
  }

  primaryFrame.appendChild(primaryText);
  // Append to parent FIRST, then set FILL sizing
  component.appendChild(primaryFrame);
  primaryFrame.layoutSizingHorizontal = "FILL";

  console.log("LayerCard: Component assembly complete");
  return component;
}

/**
 * Generate LayerCard ComponentSet
 *
 * Creates a "LayerCard" ComponentSet with the compound component structure.
 * LayerCard has no variants - it's a single style.
 *
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateLayerCardComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  console.log("LayerCard: Starting generation at Y=" + startY);

  try {
    figma.currentPage = page;

    // Generate single component (no variants)
    var components: ComponentNode[] = [];
    var rowLabels: { y: number; text: string }[] = [];

    var labelColumnWidth = 160;

    console.log("LayerCard: Calling createLayerCardComponent...");
    var component = await createLayerCardComponent();
    console.log("LayerCard: Component returned, setting position...");
    component.x = labelColumnWidth; // Position after label column
    component.y = 0;
    rowLabels.push({ y: 0, text: "LayerCard" });
    components.push(component);

    console.log("LayerCard: Combining as variants...");
    // Combine into ComponentSet (even with single variant for consistency)
    // @ts-ignore - combineAsVariants works at runtime
    var componentSet = figma.combineAsVariants(components, page);
    console.log("LayerCard: ComponentSet created");
    componentSet.name = "LayerCard";
    componentSet.description =
      "LayerCard - A layered card component with Secondary (header) and Primary (content) sections. " +
      "Use LayerCard.Secondary for the header area and LayerCard.Primary for the main content.";
    componentSet.layoutMode = "NONE";

    // Calculate content dimensions
    var contentWidth = componentSet.width + labelColumnWidth;
    var contentHeight = componentSet.height;

    // Create light mode section
    var lightSection = createModeSection(page, "LayerCard", "light");
    lightSection.frame.resize(
      contentWidth + SECTION_PADDING * 2,
      contentHeight + SECTION_PADDING * 2,
    );

    // Create dark mode section
    var darkSection = createModeSection(page, "LayerCard", "dark");
    darkSection.frame.resize(
      contentWidth + SECTION_PADDING * 2,
      contentHeight + SECTION_PADDING * 2,
    );

    // Move ComponentSet into light section frame
    lightSection.frame.appendChild(componentSet);
    componentSet.x = SECTION_PADDING + labelColumnWidth;
    componentSet.y = SECTION_PADDING;

    // Add row labels to light section
    for (var li = 0; li < rowLabels.length; li++) {
      var label = rowLabels[li];
      var labelNode = await createRowLabel(
        label.text,
        SECTION_PADDING,
        SECTION_PADDING + label.y + 8,
      );
      lightSection.frame.appendChild(labelNode);
    }

    // Create instances for dark section
    for (var k = 0; k < components.length; k++) {
      var origComp = components[k];
      var instance = origComp.createInstance();
      instance.x = origComp.x + SECTION_PADDING + labelColumnWidth;
      instance.y = origComp.y + SECTION_PADDING;
      darkSection.frame.appendChild(instance);
    }

    // Add row labels to dark section
    for (var di = 0; di < rowLabels.length; di++) {
      var darkLabel = rowLabels[di];
      var darkLabelNode = await createRowLabel(
        darkLabel.text,
        SECTION_PADDING,
        SECTION_PADDING + darkLabel.y + 8,
      );
      darkSection.frame.appendChild(darkLabelNode);
    }

    // Resize sections to fit content with padding
    var totalWidth = contentWidth + SECTION_PADDING * 2;
    var totalHeight = contentHeight + SECTION_PADDING * 2;

    lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
    darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

    // Position sections side by side
    lightSection.section.x = 100;
    lightSection.section.y = startY;

    darkSection.section.x = 100 + totalWidth + 50;
    darkSection.section.y = startY;

    console.log("Generated LayerCard ComponentSet (light + dark)");
    console.log(
      "LayerCard dimensions: " +
        totalWidth +
        "x" +
        totalHeight +
        " at Y=" +
        startY,
    );

    return startY + totalHeight + SECTION_GAP;
  } catch (error) {
    var errorMessage = error instanceof Error ? error.message : String(error);
    var errorStack = error instanceof Error ? error.stack : "";
    console.error("LayerCard generation failed: " + errorMessage);
    console.error("Stack: " + errorStack);
    throw error;
  }
}

// ============================================================================
// TESTABLE EXPORTS
// ============================================================================

/**
 * Get LayerCard dimensions configuration
 *
 * Returns the layout dimensions for the LayerCard component including
 * dimensions for both Secondary (header) and Primary (content) sections.
 */
export function getLayerCardDimensionsConfig() {
  return LAYER_CARD_CONFIG;
}

/**
 * Get LayerCard color bindings
 *
 * Returns the semantic color tokens used for LayerCard styling.
 * Includes color bindings for root, secondary, and primary sections.
 */
export function getLayerCardColorBindings() {
  return {
    root: {
      background: "color-surface-2",
      backgroundFallback: "color-surface",
      border: "color-border",
    },
    secondary: {
      text: "text-color-label",
    },
    primary: {
      background: "color-layer-card-primary",
      backgroundFallback: "color-surface",
      border: "color-color",
      borderFallback: "color-border",
      text: "text-color-surface",
    },
  };
}

/**
 * Get LayerCard sub-component configuration
 *
 * Returns metadata about the Secondary and Primary sub-components.
 */
export function getLayerCardSubComponentConfig() {
  var layerCardComponent = registry.components.LayerCard;
  return {
    subComponents: layerCardComponent.subComponents || {},
    hasSubComponents: Object.keys(layerCardComponent.subComponents || {}).length > 0,
  };
}

/**
 * Get LayerCard content configuration
 *
 * Returns the text content used in the LayerCard example.
 */
export function getLayerCardContentConfig() {
  return {
    secondary: {
      title: "Next Steps",
      iconName: "arrow-right",
      iconSize: 16,
    },
    primary: {
      content: "Get started with Kumo",
    },
  };
}

/**
 * Get all LayerCard data
 *
 * Returns complete intermediate data structure for the LayerCard component.
 * This is used for snapshot testing to catch unintended changes.
 */
export function getAllLayerCardData() {
  var dimensions = getLayerCardDimensionsConfig();
  var colorBindings = getLayerCardColorBindings();
  var subComponentConfig = getLayerCardSubComponentConfig();
  var contentConfig = getLayerCardContentConfig();

  return {
    dimensions: dimensions,
    colorBindings: colorBindings,
    subComponents: subComponentConfig,
    content: contentConfig,
  };
}
