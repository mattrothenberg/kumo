import { logComplete } from "../logger";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
/**
 * Tooltip Component Generator
 *
 * Generates a Tooltip component in Figma that matches
 * the Tooltip component popup styling:
 *
 * - Static visual representation of an OPEN tooltip popup
 * - Tooltip has bg-black-icon, text-white, rounded-md, px-2.5 py-1.5 padding
 * - Includes an arrow/pointer with shadow
 *
 * The Tooltip has:
 * - Container with bg-black-icon, text-white, rounded-md, px-2.5 py-1.5
 * - Arrow pointing down (for a top-positioned tooltip)
 * - Text content with text-sm
 *
 * Uses semantic tokens bound to Figma variables:
 * - bg-black-icon → color-black-icon
 * - text-white → (hardcoded white)
 * - Arrow uses fill-black-icon and fill-icon-path
 *
 * @see packages/kumo/src/components/tooltip/tooltip.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  bindFillToVariable,
  setWhiteTextColor,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
  SECTION_LAYOUT,
  FONT_SIZE,
  FALLBACK_VALUES,
} from "./shared";
import themeData from "../generated/theme-data.json";

// Import registry as source of truth
import registry from "../../../../ai/component-registry.json";



/**
 * Tooltip dimensions
 * FIGMA-SPECIFIC: Arrow dimensions are for Figma canvas rendering only,
 * not derived from design tokens (no CSS equivalent for tooltip arrows)
 */
var ARROW_WIDTH = 20;
var ARROW_HEIGHT = 10;

/**
 * Tooltip styling - read from React component
 * Matches the actual Tooltip.Popup styles from tooltip.tsx:
 * "rounded-md bg-black-icon px-2.5 py-1.5 text-sm text-white"
 */
var tooltipComponent = registry.components.Tooltip;

// Tooltip popup styles from tooltip.tsx
var TOOLTIP_BOX_STYLES = "rounded-md bg-black-icon px-2.5 py-1.5 text-sm text-white";
// Use centralized values from shared.ts to prevent drift
var TOOLTIP_TEXT_SIZE = FONT_SIZE.sm; // text-sm from theme-data.json
var TOOLTIP_TEXT_WEIGHT = FALLBACK_VALUES.fontWeight.normal; // font-normal from theme-data.json

/**
 * Create a tooltip arrow as a simple triangle pointing down using vector path
 *
 * Uses a vector network to draw a downward-pointing triangle.
 * This avoids rotation issues with polygons.
 *
 * @returns VectorNode for the arrow
 */
function createTooltipArrow(): VectorNode {
  var arrow = figma.createVector();
  arrow.name = "Arrow";

  // Create a downward-pointing triangle using vector network
  // Points: top-left (0,0), top-right (width,0), bottom-center (width/2, height)
  arrow.vectorNetwork = {
    vertices: [
      { x: 0, y: 0 },
      { x: ARROW_WIDTH, y: 0 },
      { x: ARROW_WIDTH / 2, y: ARROW_HEIGHT },
    ],
    segments: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 0 },
    ],
    regions: [
      {
        windingRule: "NONZERO",
        loops: [[0, 1, 2]],
      },
    ],
  };

  // Bind arrow fill to bg-black-icon variable (matches tooltip box)
  var bgVar = getVariableByName("color-black-icon");
  if (bgVar) {
    bindFillToVariable(arrow as unknown as SceneNode, bgVar.id);
  }

  // Remove stroke
  arrow.strokes = [];

  return arrow;
}

/**
 * Create a single Tooltip component
 *
 * Layout structure:
 * - Component (frame with no auto-layout for manual positioning)
 *   - Tooltip box (with bg, padding, rounded corners)
 *     - Text content
 *   - Arrow (positioned below the box)
 *
 * NOTE: We use layoutMode = "NONE" because:
 * 1. layoutAlign = "CENTER" is deprecated in Figma
 * 2. layoutPositioning = "ABSOLUTE" requires parent to have layoutMode !== NONE
 * 3. Manual positioning is simpler and more reliable for this use case
 *
 * @returns ComponentNode for the tooltip
 */
async function createTooltipComponent(): Promise<ComponentNode> {
  // Create component (no auto-layout - manual positioning)
  var component = figma.createComponent();
  component.name = "Tooltip";
  component.description = "Tooltip popup component for contextual help";
  component.layoutMode = "NONE";
  component.fills = []; // Transparent - the inner box has the fill

  // Create the tooltip box (the rounded rectangle with text)
  var tooltipBox = figma.createFrame();
  tooltipBox.name = "Tooltip Box";
  tooltipBox.layoutMode = "VERTICAL";
  tooltipBox.primaryAxisSizingMode = "AUTO";
  tooltipBox.counterAxisSizingMode = "AUTO";
  tooltipBox.paddingLeft = themeData.tailwind.spacing.scale["2.5"]; // px-2.5 = 10px
  tooltipBox.paddingRight = themeData.tailwind.spacing.scale["2.5"];
  tooltipBox.paddingTop = themeData.tailwind.spacing.scale["1.5"]; // py-1.5 = 6px
  tooltipBox.paddingBottom = themeData.tailwind.spacing.scale["1.5"];
  tooltipBox.cornerRadius = BORDER_RADIUS.md; // rounded-md = 6px
  tooltipBox.x = 0;
  tooltipBox.y = 0;

  // Apply background fill (bg-black-icon)
  var bgVar = getVariableByName("color-black-icon");
  if (bgVar) {
    bindFillToVariable(tooltipBox, bgVar.id);
  }

  // Create tooltip text content
  // text-sm = 14px, normal weight = 400
  var text = await createTextNode("Tooltip text", FONT_SIZE.sm, FALLBACK_VALUES.fontWeight.normal);
  text.name = "Text";
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  // Apply text color (text-white - hardcoded white)
  // White text is hardcoded in the React component, not using a semantic token
  setWhiteTextColor(text);

  tooltipBox.appendChild(text);
  component.appendChild(tooltipBox);

  // Create arrow and position below the box
  var arrow = createTooltipArrow();
  // Center arrow horizontally under the box
  arrow.x = (tooltipBox.width - ARROW_WIDTH) / 2;
  // Position directly at bottom of box (no gap)
  arrow.y = tooltipBox.height;

  component.appendChild(arrow as unknown as SceneNode);

  // Resize component to fit box + arrow
  component.resize(tooltipBox.width, tooltipBox.height + ARROW_HEIGHT);

  return component;
}

/**
 * Generate Tooltip ComponentSet
 *
 * Creates a "Tooltip" ComponentSet with a single variant (no variants).
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateTooltipComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Generate the tooltip component
  var components: ComponentNode[] = [];

  // Create the tooltip component
  var component = await createTooltipComponent();

  // Position component
  component.x = 0;
  component.y = 0;

  components.push(component);

  // Combine into ComponentSet (even with single variant for consistency)
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Tooltip";
  componentSet.description =
    "Tooltip popup component. " +
    "Use for contextual help and additional information on hover.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width;
  var contentHeight = componentSet.height;

  // Create light mode section
  var lightSection = createModeSection(page, "Tooltip", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "Tooltip", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section frame
  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING;
  componentSet.y = SECTION_PADDING;

  // Create instances for dark section
  for (var k = 0; k < components.length; k++) {
    var origComp = components[k];
    var instance = origComp.createInstance();
    instance.x = origComp.x + SECTION_PADDING;
    instance.y = origComp.y + SECTION_PADDING;
    darkSection.frame.appendChild(instance);
  }

  // Resize sections to fit content with padding
  var totalWidth = contentWidth + SECTION_PADDING * 2;
  var totalHeight = contentHeight + SECTION_PADDING * 2;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  // Position sections side by side
  lightSection.section.x = SECTION_LAYOUT.startX;
  lightSection.section.y = startY;

  darkSection.section.x = lightSection.section.x + totalWidth + SECTION_LAYOUT.modeGap;
  darkSection.section.y = startY;

  logComplete("Generated Tooltip ComponentSet (light + dark)");

  return startY + totalHeight + SECTION_GAP;
}

/**
 * ============================================================================
 * TESTABLE EXPORTS - Pure functions for testing (no Figma API calls)
 * ============================================================================
 */

/**
 * Get Tooltip configuration from registry
 * 
 * @returns Side variant configuration
 */
export function getTooltipSideConfig() {
  var props = tooltipComponent.props;
  var sideProp = props.side as {
    values: string[];
    descriptions: Record<string, string>;
    default: string;
  };

  return {
    values: sideProp.values,
    descriptions: sideProp.descriptions,
    default: sideProp.default,
  };
}

/**
 * Get Tooltip styling configuration from React component
 * Matches the actual Tooltip.Popup classes from tooltip.tsx
 * 
 * @returns Tooltip styling configuration
 */
export function getTooltipStylingConfig() {
  return {
    popup: {
      // From tooltip.tsx Popup className
      background: "bg-black-icon",
      text: "text-white",
      paddingX: "px-2.5", // 10px
      paddingY: "py-1.5", // 6px
      fontSize: "text-sm", // 14px
      borderRadius: "rounded-md",
      shadow: "shadow-lg shadow-icon-path",
    },
    arrow: {
      // Arrow uses same background as popup
      fill: "fill-black-icon",
      path: "fill-icon-path",
      width: ARROW_WIDTH,
      height: ARROW_HEIGHT,
    },
  };
}

/**
 * Get parsed styles for Tooltip box
 * 
 * @returns Parsed Tailwind styles
 */
export function getTooltipParsedBoxStyles() {
  return parseTailwindClasses(TOOLTIP_BOX_STYLES);
}

/**
 * Get Tooltip box layout data
 * 
 * @returns Layout dimensions and styling
 */
export function getTooltipBoxLayout() {
  var parsed = parseTailwindClasses(TOOLTIP_BOX_STYLES);

  return {
    // Padding
    paddingX: parsed.paddingX,
    paddingY: parsed.paddingY,
    // Border radius
    borderRadius: parsed.borderRadius,
    // Typography
    fontSize: TOOLTIP_TEXT_SIZE,
    fontWeight: TOOLTIP_TEXT_WEIGHT,
    // Fill
    fillVariable: parsed.fillVariable,
    // Text
    textVariable: parsed.textVariable,
    isWhiteText: parsed.isWhiteText,
  };
}

/**
 * Get Tooltip arrow dimensions
 * 
 * @returns Arrow dimensions
 */
export function getTooltipArrowDimensions() {
  return {
    width: ARROW_WIDTH,
    height: ARROW_HEIGHT,
  };
}

/**
 * Get complete Tooltip intermediate data
 * 
 * @returns All intermediate data for Tooltip component
 */
export function getAllTooltipData() {
  var sideConfig = getTooltipSideConfig();
  var stylingConfig = getTooltipStylingConfig();
  var boxLayout = getTooltipBoxLayout();
  var arrowDimensions = getTooltipArrowDimensions();
  var parsedStyles = getTooltipParsedBoxStyles();

  return {
    sideConfig,
    stylingConfig,
    boxStyles: {
      raw: TOOLTIP_BOX_STYLES,
      parsed: parsedStyles,
    },
    boxLayout,
    arrowDimensions,
    text: {
      fontSize: TOOLTIP_TEXT_SIZE,
      fontWeight: TOOLTIP_TEXT_WEIGHT,
    },
  };
}
