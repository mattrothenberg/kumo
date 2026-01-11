/**
 * Collapsible Component Generator
 *
 * Generates a Collapsible ComponentSet in Figma that matches
 * the Collapsible component props:
 *
 * - open: true, false
 * - state: default, hover, focus, disabled
 *
 * The Collapsible has a trigger (label + chevron icon) and when open,
 * displays a content panel with a left border.
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/collapsible/collapsible.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  createColumnHeaders,
  bindFillToVariable,
  bindStrokeToVariable,
  bindTextColorToVariable,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
  FALLBACK_VALUES,
  SECTION_LAYOUT,
  OPACITY,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";
import registry from "../../../../ai/component-registry.json";

// Extract Collapsible component data from registry
var collapsibleComponent = registry.components.Collapsible;
var collapsibleColors = collapsibleComponent.colors as string[];

/**
 * Base styles from collapsibleVariants() in collapsible.tsx
 * Reading from React component source:
 * "flex cursor-pointer items-center gap-1 text-sm text-info select-none"
 * 
 * NOTE: Collapsible has no variants (KUMO_COLLAPSIBLE_VARIANTS is empty).
 * The collapsibleVariants() function returns a fixed set of base styles.
 * Using actual class string from collapsible.tsx collapsibleVariants().
 */
var TRIGGER_BASE_STYLES = "flex items-center gap-1 text-sm text-info";

/**
 * Content panel styles from collapsible.tsx
 * From the inline className in the content div:
 * "my-2 space-y-4 border-l-2 border-color pl-4"
 * 
 * These classes are directly in the JSX, not in a variant function.
 */
var CONTENT_PANEL_STYLES = "my-2 border-l-2 border-color pl-4";



/**
 * Open state values
 */
var OPEN_VALUES = [false, true];

/**
 * Interaction state values
 */
var STATE_VALUES = ["default", "hover", "focus", "disabled"];

/**
 * State-specific style overrides for the trigger
 */
var STATE_STYLES: Record<
  string,
  {
    textVariable?: string;
    addRing?: boolean;
    opacity?: number;
  }
> = {
  default: {
    textVariable: "text-color-info",
  },
  hover: {
    textVariable: "text-color-info",
    // Could add underline or different color on hover
  },
  focus: {
    textVariable: "text-color-info",
    addRing: true,
  },
  disabled: {
    textVariable: "text-color-disabled",
    opacity: OPACITY.disabled,
  },
};

/**
 * Create a single Collapsible component variant
 *
 * @param open - Whether the collapsible is expanded
 * @param state - Interaction state (default, hover, focus, disabled)
 * @returns ComponentNode for the collapsible
 */
async function createCollapsibleComponent(
  open: boolean,
  state: string,
): Promise<ComponentNode> {
  // Parse base styles
  var triggerStyles = parseTailwindClasses(TRIGGER_BASE_STYLES);
  var contentStyles = parseTailwindClasses(CONTENT_PANEL_STYLES);

  // Create component
  var component = figma.createComponent();
  component.name = "open=" + open + ", state=" + state;
  component.description =
    "Collapsible " +
    (open ? "expanded" : "collapsed") +
    " in " +
    state +
    " state";

  // Set up vertical auto-layout for the entire component
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 8; // my-2 translates to 8px spacing
  component.fills = [];

  // Get state-specific styles
  var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

  // Apply disabled opacity to entire component
  if (stateStyle.opacity !== undefined) {
    component.opacity = stateStyle.opacity;
  }

  // Create trigger frame (label + chevron)
  var trigger = figma.createFrame();
  trigger.name = "Trigger";
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisAlignItems = "CENTER";
  trigger.counterAxisAlignItems = "CENTER";
  trigger.primaryAxisSizingMode = "AUTO";
  trigger.counterAxisSizingMode = "AUTO";
  trigger.itemSpacing = triggerStyles.gap || FALLBACK_VALUES.gap.tight;
  trigger.fills = [];
  trigger.paddingTop = 4;
  trigger.paddingBottom = 4;
  trigger.paddingLeft = 4;
  trigger.paddingRight = 4;
  trigger.cornerRadius = BORDER_RADIUS.sm;

  // Add focus ring if in focus state
  if (stateStyle.addRing) {
    var ringVar = getVariableByName("color-active");
    if (ringVar) {
      bindStrokeToVariable(trigger, ringVar.id, 2);
    }
  }

  // Create label text
  var labelText = await createTextNode(
    "Click to expand",
    triggerStyles.fontSize || FALLBACK_VALUES.fontSize,
    400,
  );
  labelText.name = "Label";

  // Apply text color based on state
  var textVar = getVariableByName(stateStyle.textVariable || "text-color-info");
  if (textVar) {
    bindTextColorToVariable(labelText, textVar.id);
  }

  trigger.appendChild(labelText);

  // Create chevron icon (caret-down from Phosphor)
  var chevronIconName = "ph-caret-down";
  var chevron = getButtonIcon(chevronIconName, "sm");
  chevron.name = "Chevron";

  // Rotate chevron 180° when open (pointing up)
  if (open) {
    chevron.rotation = 180;
  }

  // Apply icon color based on state
  var iconColorToken = state === "disabled" ? "text-disabled" : "text-info";
  bindIconColor(chevron, iconColorToken);

  trigger.appendChild(chevron);
  component.appendChild(trigger);

  // Create content panel (always present, visibility controlled by open state)
  if (open) {
    var contentPanel = figma.createFrame();
    contentPanel.name = "Content";
    contentPanel.layoutMode = "VERTICAL";
    contentPanel.primaryAxisSizingMode = "AUTO";
    contentPanel.counterAxisSizingMode = "AUTO";
    contentPanel.itemSpacing = 16; // space-y-4
    contentPanel.paddingLeft = contentStyles.paddingX || FALLBACK_VALUES.padding.standard;
    contentPanel.paddingTop = 8;
    contentPanel.paddingBottom = 8;
    contentPanel.fills = [];

    // Add left border (border-l-2 border-color)
    var borderVar = getVariableByName("color-border");
    if (borderVar) {
      bindStrokeToVariable(contentPanel, borderVar.id, 2);
      // Set stroke to left side only
      contentPanel.strokeLeftWeight = 2;
      contentPanel.strokeTopWeight = 0;
      contentPanel.strokeRightWeight = 0;
      contentPanel.strokeBottomWeight = 0;
    }

    // Create placeholder content text
    var contentText = await createTextNode(
      "This is the collapsible content that can be shown or hidden.",
      14,
      400,
    );
    contentText.name = "Content Text";

    // Set content text width for wrapping
    contentText.layoutSizingHorizontal = "FIXED";
    contentText.resize(280, contentText.height);
    contentText.textAutoResize = "HEIGHT";

    var contentTextVar = getVariableByName("text-color-surface");
    if (contentTextVar) {
      bindTextColorToVariable(contentText, contentTextVar.id);
    }

    contentPanel.appendChild(contentText);
    component.appendChild(contentPanel);
  }

  return component;
}

/**
 * Generate Collapsible ComponentSet with open and state properties
 *
 * Creates a "Collapsible" ComponentSet with all combinations of:
 * - open: true, false
 * - state: default, hover, focus, disabled
 *
 * Layout:
 * - Rows: open=false, open=true
 * - Columns: state variations (default, hover, focus, disabled)
 *
 * Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateCollapsibleComponents(
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  // Find or create Components page
  var componentsPage = figma.root.children.find(function (page) {
    return page.type === "PAGE" && page.name === "Components";
  }) as PageNode | undefined;

  if (!componentsPage) {
    componentsPage = figma.createPage();
    componentsPage.name = "Components";
  }

  figma.currentPage = componentsPage;

  // Generate all combinations
  var components: ComponentNode[] = [];

  // Track row labels: { y, text }
  var rowLabels: { y: number; text: string }[] = [];

  // Track column headers: { x, text }
  var columnHeaders: { x: number; text: string }[] = [];

  // Layout spacing
  var componentGapX = 24;
  var componentGapY = 40;
  var headerRowHeight = 24;
  var labelColumnWidth = 120;

  // Track layout by row (open state)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
    var open = OPEN_VALUES[oi];
    rowComponents.set(oi, []);

    for (var si = 0; si < STATE_VALUES.length; si++) {
      var state = STATE_VALUES[si];
      var component = await createCollapsibleComponent(open, state);
      rowComponents.get(oi)!.push(component);
      components.push(component);
    }
  }

  // First pass: calculate max width per column and max height per row
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  for (var colIdx = 0; colIdx < STATE_VALUES.length; colIdx++) {
    var maxColWidth = 0;
    for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
      var row = rowComponents.get(rowIdx) || [];
      var comp = row[colIdx];
      if (comp && comp.width > maxColWidth) {
        maxColWidth = comp.width;
      }
    }
    columnWidths.push(maxColWidth);
  }

  for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
    var row = rowComponents.get(rowIdx) || [];
    var maxRowHeight = 0;
    for (var colIdx = 0; colIdx < row.length; colIdx++) {
      var comp = row[colIdx];
      if (comp && comp.height > maxRowHeight) {
        maxRowHeight = comp.height;
      }
    }
    rowHeights.push(maxRowHeight);
  }

  // Second pass: position components using consistent column widths
  var yOffset = headerRowHeight;

  for (var rowIdx = 0; rowIdx < OPEN_VALUES.length; rowIdx++) {
    var row = rowComponents.get(rowIdx) || [];
    var xOffset = labelColumnWidth;
    var openValue = OPEN_VALUES[rowIdx];

    // Record row label
    rowLabels.push({
      y: yOffset,
      text: "open=" + openValue,
    });

    for (var colIdx = 0; colIdx < row.length; colIdx++) {
      var comp = row[colIdx];
      comp.x = xOffset;
      comp.y = yOffset;

      // Record column headers from first row
      if (rowIdx === 0) {
        columnHeaders.push({
          x: xOffset,
          text: "state=" + STATE_VALUES[colIdx],
        });
      }

      // Use consistent column width for positioning
      xOffset += columnWidths[colIdx] + componentGapX;
    }

    yOffset += rowHeights[rowIdx] + componentGapY;
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, componentsPage);
  componentSet.name = "Collapsible";
  componentSet.description =
    "Collapsible component with open and state properties. " +
    "Use to show/hide content with an animated chevron indicator.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(componentsPage, "Collapsible", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(componentsPage, "Collapsible", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section frame
  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING + labelColumnWidth;
  componentSet.y = SECTION_PADDING + headerRowHeight;

  // Add column headers to light section
  await createColumnHeaders(
    columnHeaders.map(function (h) {
      return { x: h.x + SECTION_PADDING, text: h.text };
    }),
    SECTION_PADDING,
    lightSection.frame,
  );

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
    instance.y = origComp.y + SECTION_PADDING + headerRowHeight;
    darkSection.frame.appendChild(instance);
  }

  // Add column headers to dark section
  await createColumnHeaders(
    columnHeaders.map(function (h) {
      return { x: h.x + SECTION_PADDING, text: h.text };
    }),
    SECTION_PADDING,
    darkSection.frame,
  );

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
  lightSection.section.x = SECTION_LAYOUT.startX;
  lightSection.section.y = startY;

  darkSection.section.x = lightSection.section.x + totalWidth + SECTION_LAYOUT.modeGap;
  darkSection.section.y = startY;

  logComplete(
    "Generated Collapsible ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Testable exports for tests (pure functions, no Figma API calls)
 */

/**
 * Get collapsible component data from registry
 */
export function getCollapsibleRegistryData() {
  return {
    component: collapsibleComponent,
    colors: collapsibleColors,
  };
}

/**
 * Get open state configuration
 */
export function getCollapsibleOpenConfig() {
  return {
    values: OPEN_VALUES,
  };
}

/**
 * Get state configuration
 */
export function getCollapsibleStateConfig() {
  return {
    values: STATE_VALUES,
    styles: STATE_STYLES,
  };
}

/**
 * Get trigger base styles from React component
 */
export function getCollapsibleTriggerStyles() {
  return {
    raw: TRIGGER_BASE_STYLES,
    colors: collapsibleColors,
  };
}

/**
 * Get content panel styles from React component
 */
export function getCollapsibleContentStyles() {
  return {
    raw: CONTENT_PANEL_STYLES,
  };
}

/**
 * Get parsed trigger base styles
 */
export function getCollapsibleParsedTriggerStyles() {
  return parseTailwindClasses(TRIGGER_BASE_STYLES);
}

/**
 * Get parsed content panel styles
 */
export function getCollapsibleParsedContentStyles() {
  return parseTailwindClasses(CONTENT_PANEL_STYLES);
}

/**
 * Get computed layout data for a specific open/state combination
 */
export function getCollapsibleLayoutData(open: boolean, state: string) {
  var triggerStyles = parseTailwindClasses(TRIGGER_BASE_STYLES);
  var contentStyles = parseTailwindClasses(CONTENT_PANEL_STYLES);
  var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

  return {
    open: open,
    state: state,
    trigger: {
      gap: triggerStyles.gap || FALLBACK_VALUES.gap.tight,
      fontSize: triggerStyles.fontSize || FALLBACK_VALUES.fontSize,
      fontWeight: FALLBACK_VALUES.fontWeight.normal,
      textVariable: stateStyle.textVariable || "text-color-info",
      addRing: stateStyle.addRing || false,
      borderRadius: BORDER_RADIUS.sm,
    },
    content: open
      ? {
          paddingX: contentStyles.paddingX || FALLBACK_VALUES.padding.standard,
          paddingTop: 8,
          paddingBottom: 8,
          itemSpacing: 16,
          borderVariable: "color-border",
          borderWeight: 2,
        }
      : null,
    chevron: {
      iconName: "ph-caret-down",
      rotation: open ? 180 : 0,
      iconColorToken: state === "disabled" ? "text-disabled" : "text-info",
    },
    opacity: stateStyle.opacity,
  };
}

/**
 * Get all collapsible variant data (for snapshot testing)
 */
export function getAllCollapsibleVariantData() {
  var registryData = getCollapsibleRegistryData();
  var triggerStylesData = getCollapsibleTriggerStyles();
  var contentStylesData = getCollapsibleContentStyles();
  var triggerStyles = getCollapsibleParsedTriggerStyles();
  var contentStyles = getCollapsibleParsedContentStyles();
  var openConfig = getCollapsibleOpenConfig();
  var stateConfig = getCollapsibleStateConfig();

  return {
    registry: {
      component: registryData.component.name,
      colors: registryData.colors,
    },
    triggerStyles: {
      raw: triggerStylesData.raw,
      colors: triggerStylesData.colors,
      parsed: triggerStyles,
    },
    contentStyles: {
      raw: contentStylesData.raw,
      parsed: contentStyles,
    },
    openStates: openConfig.values,
    interactionStates: stateConfig.values,
    stateStyles: stateConfig.styles,
    variants: OPEN_VALUES.flatMap(function (open) {
      return STATE_VALUES.map(function (state) {
        return getCollapsibleLayoutData(open, state);
      });
    }),
  };
}

/**
 * Exports for tests and backwards compatibility
 */
export var COLLAPSIBLE_OPEN_VALUES = OPEN_VALUES;
export var COLLAPSIBLE_STATE_VALUES = STATE_VALUES;
