/**
 * Tabs Component Generator
 *
 * Generates a Tabs ComponentSet in Figma that matches
 * the Tabs component structure from tabs.tsx.
 *
 * Structure:
 * - Horizontal container with rounded background (bg-accent)
 * - Active tab has elevated white pill indicator (bg-surface-elevated with shadow)
 * - Inactive tabs show muted text
 * - Active tab has dark text
 *
 * @see packages/kumo/src/components/tabs/tabs.tsx
 * @see packages/kumo/src/components/tabs/tabs.stories.tsx
 */

import {
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindFillToVariable,
  bindStrokeToVariable,
  createTextNode,
  bindTextColorToVariable,
  SECTION_PADDING,
  SECTION_GAP,
  SHADOWS,
} from "./shared";
import { logComplete, logStart, logProgress } from "../logger";



/**
 * Tabs dimensions and styling
 * Based on tabs.tsx:
 * - Container: h-8.5 (34px), rounded-lg (8px), bg-accent, px-px (1px)
 * - Tab buttons: my-px (1px vertical margin), px-2.5 (10px horizontal), rounded-lg
 * - Indicator: rounded-lg, bg-surface-elevated, shadow-sm, ring ring-color-2
 */
var TABS_CONFIG = {
  /** Height of tabs container (h-8.5 = 34px) */
  containerHeight: 34,
  /** Border radius for container (rounded-lg = 8px) */
  borderRadius: 8,
  /** Horizontal padding inside container (px-px = 1px on each side) */
  containerPadding: 1,
  /** Vertical margin on tabs (my-px = 1px) */
  tabVerticalMargin: 1,
  /** Horizontal padding on tabs (px-2.5 = 10px) */
  tabHorizontalPadding: 10,
  /** Tab text size (text-base = 16px) */
  tabFontSize: 16,
  /** Tab font weight (font-medium = 500) */
  tabFontWeight: 500,
};

/**
 * Default tab items to display (matches Storybook Default story)
 */
var DEFAULT_TABS = ["Tab 1", "Tab 2", "Tab 3"];

/**
 * Testable export functions for testing
 * These enable testing without Figma runtime
 */

/**
 * Get container configuration from TABS_CONFIG
 * Used for testing and validation
 */
export function getContainerConfig() {
  return {
    height: TABS_CONFIG.containerHeight,
    borderRadius: TABS_CONFIG.borderRadius,
    padding: TABS_CONFIG.containerPadding,
  };
}

/**
 * Get tab configuration from TABS_CONFIG
 * Used for testing and validation
 */
export function getTabConfig() {
  return {
    paddingX: TABS_CONFIG.tabHorizontalPadding,
    verticalMargin: TABS_CONFIG.tabVerticalMargin,
    fontSize: TABS_CONFIG.tabFontSize,
    fontWeight: TABS_CONFIG.tabFontWeight,
    borderRadius: TABS_CONFIG.borderRadius,
  };
}

/**
 * Get indicator configuration
 * Used for testing and validation
 */
export function getIndicatorConfig() {
  return {
    borderRadius: TABS_CONFIG.borderRadius,
    // Note: Colors and shadow are applied via Figma variables at runtime
    // These are semantic tokens: color-surface-elevated, color-color-2, shadow-sm
  };
}

/**
 * Get all variant data for testing
 * Returns complete data structure for snapshot testing
 */
export function getAllVariantData() {
  return {
    config: TABS_CONFIG,
    defaultTabs: DEFAULT_TABS,
    container: getContainerConfig(),
    tab: getTabConfig(),
    indicator: getIndicatorConfig(),
    variants: DEFAULT_TABS.map((tab, index) => ({
      value: tab,
      index,
      isActive: false, // Will be set based on activeIndex
    })),
  };
}

/**
 * Create a single tab button
 *
 * @param label - Tab label text
 * @param isActive - Whether this tab is active
 * @returns FrameNode representing the tab button
 */
async function createTabButton(
  label: string,
  isActive: boolean,
): Promise<FrameNode> {
  var button = figma.createFrame();
  button.name = isActive ? "Tab (active)" : "Tab";

  // Layout: horizontal, hug content
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.primaryAxisSizingMode = "AUTO"; // Hug width
  button.counterAxisSizingMode = "FIXED"; // Fixed height

  // Height accounts for vertical margin (34px container - 2px margin = 32px)
  var buttonHeight =
    TABS_CONFIG.containerHeight - TABS_CONFIG.tabVerticalMargin * 2;
  button.resize(100, buttonHeight); // Width will auto-resize

  // Padding: px-2.5 (10px horizontal)
  button.paddingLeft = TABS_CONFIG.tabHorizontalPadding;
  button.paddingRight = TABS_CONFIG.tabHorizontalPadding;
  button.paddingTop = 0;
  button.paddingBottom = 0;

  // Corner radius (rounded-lg = 8px)
  button.cornerRadius = TABS_CONFIG.borderRadius;

  // Background: transparent (indicator provides background for active)
  button.fills = [];

  // Create text label
  var text = await createTextNode(
    label,
    TABS_CONFIG.tabFontSize,
    TABS_CONFIG.tabFontWeight,
  );
  text.name = "Label";

  // Text color: text-surface for active, text-label for inactive
  if (isActive) {
    var surfaceTextVar = getVariableByName("text-color-surface");
    if (surfaceTextVar) {
      bindTextColorToVariable(text, surfaceTextVar.id);
    }
  } else {
    var labelTextVar = getVariableByName("text-color-label");
    if (labelTextVar) {
      bindTextColorToVariable(text, labelTextVar.id);
    }
  }

  button.appendChild(text);

  return button;
}

/**
 * Create the active tab indicator (animated pill background)
 *
 * @param activeIndex - Index of the active tab (for positioning)
 * @param tabWidths - Array of tab widths for positioning calculation
 * @returns FrameNode representing the indicator
 */
function createTabIndicator(
  activeIndex: number,
  tabWidths: number[],
): FrameNode {
  var indicator = figma.createFrame();
  indicator.name = "Indicator";

  // NOTE: layoutPositioning = "ABSOLUTE" must be set AFTER adding to parent
  // It will be set in createTabsComponent after insertChild

  // Calculate position and size based on active tab
  var indicatorHeight =
    TABS_CONFIG.containerHeight - TABS_CONFIG.tabVerticalMargin * 2;

  // Width matches the active tab
  var indicatorWidth = tabWidths[activeIndex];

  // X position is sum of previous tab widths + container padding
  var indicatorX = TABS_CONFIG.containerPadding;
  for (var i = 0; i < activeIndex; i++) {
    indicatorX = indicatorX + tabWidths[i];
  }

  // Y position accounts for vertical margin
  var indicatorY = TABS_CONFIG.tabVerticalMargin;

  indicator.resize(indicatorWidth, indicatorHeight);
  indicator.x = indicatorX;
  indicator.y = indicatorY;

  // Styling: rounded-lg, bg-surface-elevated
  indicator.cornerRadius = TABS_CONFIG.borderRadius;

  // Background: bg-surface-elevated
  var surfaceElevatedVar = getVariableByName("color-surface-elevated");
  if (surfaceElevatedVar) {
    bindFillToVariable(indicator, surfaceElevatedVar.id);
  }

  // Border: ring ring-color-2 (1px)
  var ringVar = getVariableByName("color-color-2");
  if (ringVar) {
    bindStrokeToVariable(indicator, ringVar.id, 1);
  }

  // Shadow: shadow-sm using centralized shadow preset
  indicator.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: SHADOWS.subtle.opacity },
      offset: { x: SHADOWS.subtle.offsetX, y: SHADOWS.subtle.offsetY },
      radius: SHADOWS.subtle.blur,
      spread: SHADOWS.subtle.spread,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  return indicator;
}

/**
 * Create a Tabs component with specified active index
 *
 * @param activeIndex - Index of the active tab (0-based)
 * @returns ComponentNode for the Tabs
 */
async function createTabsComponent(
  activeIndex: number,
): Promise<ComponentNode> {
  var component = figma.createComponent();
  component.name = "active=" + DEFAULT_TABS[activeIndex];
  component.description =
    "Tabs navigation component. " +
    "Active tab shows elevated white pill indicator with shadow. " +
    "Tabs: Tab 1, Tab 2, Tab 3.";

  // Container layout: horizontal, hug contents
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO"; // Hug width
  component.counterAxisSizingMode = "FIXED"; // Fixed height
  component.resize(100, TABS_CONFIG.containerHeight); // Will auto-resize width
  component.itemSpacing = 0; // No gap between tabs
  component.paddingLeft = TABS_CONFIG.containerPadding;
  component.paddingRight = TABS_CONFIG.containerPadding;
  component.paddingTop = 0;
  component.paddingBottom = 0;

  // Styling: rounded-lg, bg-accent
  component.cornerRadius = TABS_CONFIG.borderRadius;

  // Background: bg-accent
  var accentVar = getVariableByName("color-accent");
  if (accentVar) {
    bindFillToVariable(component, accentVar.id);
  }

  // Create tab buttons and add to component
  var tabButtons: FrameNode[] = [];
  var tabWidths: number[] = [];

  for (var i = 0; i < DEFAULT_TABS.length; i++) {
    var tab = DEFAULT_TABS[i];
    var isActive = i === activeIndex;
    var button = await createTabButton(tab, isActive);
    tabButtons.push(button);
    component.appendChild(button);
    // Width is calculated after appendChild due to auto-layout
    tabWidths.push(button.width);
  }

  // Create indicator and insert at index 0 (behind tabs)
  // In Figma, lower index = further back in z-order
  var indicator = createTabIndicator(activeIndex, tabWidths);

  // Insert indicator at the beginning so it appears behind tabs
  // In Figma, lower index = further back in z-order
  component.insertChild(0, indicator);

  // CRITICAL: Set layoutPositioning AFTER adding to parent with layoutMode !== NONE
  // This makes the indicator absolutely positioned so it doesn't affect tab layout
  indicator.layoutPositioning = "ABSOLUTE";

  return component;
}

/**
 * Generate Tabs ComponentSet
 *
 * Creates a "Tabs" ComponentSet with active state variants.
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateTabsComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  logStart("Tabs", "Y=" + startY);

  try {
    figma.currentPage = page;

    var components: ComponentNode[] = [];
    var rowLabels: { y: number; text: string }[] = [];

    var labelColumnWidth = 160;
    var rowGap = 24;
    var currentY = 0;

    // Create a component for each active state
    for (var i = 0; i < DEFAULT_TABS.length; i++) {
      var tab = DEFAULT_TABS[i];
      logProgress("Tabs", "Creating active=" + tab);

      var component = await createTabsComponent(i);
      component.x = labelColumnWidth;
      component.y = currentY;

      rowLabels.push({ y: currentY, text: "active=" + tab });
      components.push(component);

      currentY = currentY + TABS_CONFIG.containerHeight + rowGap;
    }

    logProgress("Tabs", "Combining as variants...");
    // @ts-ignore - combineAsVariants works at runtime
    var componentSet = figma.combineAsVariants(components, page);
    componentSet.name = "Tabs";
    componentSet.description =
      "Tabs - Horizontal tab navigation. " +
      "Shows active state with elevated pill indicator. " +
      "Tabs: Tab 1, Tab 2, Tab 3.";
    componentSet.layoutMode = "NONE";

    // Calculate content dimensions
    var contentWidth = componentSet.width + labelColumnWidth;
    var contentHeight = componentSet.height;

    // Create light mode section
    var lightSection = createModeSection(page, "Tabs", "light");
    lightSection.frame.resize(
      contentWidth + SECTION_PADDING * 2,
      contentHeight + SECTION_PADDING * 2,
    );

    // Create dark mode section
    var darkSection = createModeSection(page, "Tabs", "dark");
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
        SECTION_PADDING + label.y + 12, // Center vertically with tabs
      );
      lightSection.frame.appendChild(labelNode);
    }

    // Create instances for dark section
    for (var k = 0; k < components.length; k++) {
      var origComp = components[k];
      var instance = origComp.createInstance();
      instance.x = SECTION_PADDING + labelColumnWidth;
      instance.y = origComp.y + SECTION_PADDING;
      darkSection.frame.appendChild(instance);
    }

    // Add row labels to dark section
    for (var di = 0; di < rowLabels.length; di++) {
      var darkLabel = rowLabels[di];
      var darkLabelNode = await createRowLabel(
        darkLabel.text,
        SECTION_PADDING,
        SECTION_PADDING + darkLabel.y + 12,
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

    logComplete(
      "Generated Tabs ComponentSet with " +
        DEFAULT_TABS.length +
        " variants (light + dark)",
    );

    return startY + totalHeight + SECTION_GAP;
  } catch (error) {
    var errorMessage = error instanceof Error ? error.message : String(error);
    var errorStack = error instanceof Error ? error.stack : "";
    console.error("Tabs generation failed: " + errorMessage);
    console.error("Stack: " + errorStack);
    throw error;
  }
}
