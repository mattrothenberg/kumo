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
  var config = LAYER_CARD_CONFIG;

  // Create component
  var component = figma.createComponent();
  component.name = "default";
  component.description =
    "LayerCard - A layered card component with secondary header and primary content area";

  // Set up vertical auto-layout for root
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(config.width, 1); // Height will auto-size
  component.itemSpacing = 0;
  component.cornerRadius = config.borderRadius;

  // Apply root background (bg-surface-2)
  var rootBgVar = getVariableByName("color-surface-2");
  if (rootBgVar) {
    bindFillToVariable(component, rootBgVar.id);
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
  secondaryFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  secondaryFrame.counterAxisAlignItems = "CENTER";
  secondaryFrame.layoutSizingHorizontal = "FILL";
  secondaryFrame.primaryAxisSizingMode = "FIXED";
  secondaryFrame.counterAxisSizingMode = "AUTO";
  secondaryFrame.paddingLeft = config.secondary.paddingX;
  secondaryFrame.paddingRight = config.secondary.paddingX;
  secondaryFrame.paddingTop = config.secondary.paddingY;
  secondaryFrame.paddingBottom = config.secondary.paddingY;
  secondaryFrame.itemSpacing = config.secondary.gap;
  secondaryFrame.fills = [];

  // Secondary text
  var secondaryText = await createTextNode(
    "Next Steps",
    config.secondary.fontSize,
    config.secondary.fontWeight,
  );
  secondaryText.name = "Title";
  secondaryText.textAutoResize = "WIDTH_AND_HEIGHT";

  var secondaryTextVar = getVariableByName("text-color-label");
  if (secondaryTextVar) {
    bindTextColorToVariable(secondaryText, secondaryTextVar.id);
  }

  // Placeholder for action button (just a small square)
  var actionPlaceholder = figma.createFrame();
  actionPlaceholder.name = "Action";
  actionPlaceholder.resize(24, 24);
  actionPlaceholder.cornerRadius = 4;
  actionPlaceholder.fills = [];

  var actionBorderVar = getVariableByName("color-border");
  if (actionBorderVar) {
    bindStrokeToVariable(actionPlaceholder, actionBorderVar.id, 1);
  }

  secondaryFrame.appendChild(secondaryText);
  secondaryFrame.appendChild(actionPlaceholder);
  component.appendChild(secondaryFrame);

  // Create Primary section (main content)
  var primaryFrame = figma.createFrame();
  primaryFrame.name = "Primary";
  primaryFrame.layoutMode = "VERTICAL";
  primaryFrame.primaryAxisAlignItems = "MIN";
  primaryFrame.counterAxisAlignItems = "MIN";
  primaryFrame.layoutSizingHorizontal = "FILL";
  primaryFrame.primaryAxisSizingMode = "AUTO";
  primaryFrame.counterAxisSizingMode = "AUTO";
  primaryFrame.paddingLeft = config.primary.paddingX;
  primaryFrame.paddingRight = config.primary.paddingRight;
  primaryFrame.paddingTop = config.primary.paddingY;
  primaryFrame.paddingBottom = config.primary.paddingY;
  primaryFrame.itemSpacing = config.primary.gap;
  primaryFrame.cornerRadius = config.primary.borderRadius;

  // Apply primary background (bg-layer-card-primary)
  var primaryBgVar = getVariableByName("color-layer-card-primary");
  if (primaryBgVar) {
    bindFillToVariable(primaryFrame, primaryBgVar.id);
  }

  // Apply primary ring (ring-color)
  var primaryRingVar = getVariableByName("color-color");
  if (primaryRingVar) {
    bindStrokeToVariable(primaryFrame, primaryRingVar.id, 1);
  }

  // Primary text content
  var primaryText = await createTextNode(
    "Get started with Kumo",
    config.primary.fontSize,
    config.primary.fontWeight,
  );
  primaryText.name = "Content";
  primaryText.textAutoResize = "WIDTH_AND_HEIGHT";

  var primaryTextVar = getVariableByName("text-color-surface");
  if (primaryTextVar) {
    bindTextColorToVariable(primaryText, primaryTextVar.id);
  }

  primaryFrame.appendChild(primaryText);
  component.appendChild(primaryFrame);

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

  figma.currentPage = page;

  // Generate single component (no variants)
  var components: ComponentNode[] = [];
  var rowLabels: { y: number; text: string }[] = [];

  var component = await createLayerCardComponent();
  component.x = 160; // Label column width
  component.y = 0;
  rowLabels.push({ y: 0, text: "LayerCard" });
  components.push(component);

  // Combine into ComponentSet (even with single variant for consistency)
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "LayerCard";
  componentSet.description =
    "LayerCard - A layered card component with Secondary (header) and Primary (content) sections. " +
    "Use LayerCard.Secondary for the header area and LayerCard.Primary for the main content.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var labelColumnWidth = 160;
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

  return startY + totalHeight + SECTION_GAP;
}
