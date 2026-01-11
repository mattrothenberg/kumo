import { logComplete } from "../logger";
/**
 * Pagination Component Generator
 *
 * Generates a Pagination ComponentSet in Figma showing page navigation controls.
 * Structure: "Showing X-Y of Z" text + InputGroup with navigation buttons.
 *
 * NOTE: Layout constants are specific to Figma display and not directly from React component.
 * The React Pagination component uses Button and Input primitives, but the generator creates
 * a custom layout for demonstration purposes.
 */

import {
  createTextNode,
  bindFillToVariable,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindTextColorToVariable,
  bindStrokeToVariable,
  SECTION_PADDING,
  SECTION_GAP,
  SECTION_LAYOUT,
} from "./shared";
import { createIconInstance, bindIconColor } from "./icon-utils";

// Import component metadata from registry
import registry from "../../../../ai/component-registry.json";

const paginationComponent = registry.components.Pagination;
const paginationProps = paginationComponent.props;
const paginationColors = paginationComponent.colors;

/**
 * Pagination layout constants
 * NOTE: These are Figma display-specific dimensions for showing the navigation control variants.
 * The React component uses Button (h-9, 36px) and Input components, which have their own sizing.
 */
var PAGINATION_HEIGHT = 36;
var BUTTON_SIZE = 36;
var INPUT_WIDTH = 50;
var ICON_SIZE = 16;
var GAP = 0; // InputGroup buttons are flush against each other
var BORDER_RADIUS = 6;



/**
 * ============================================================================
 * TESTABLE EXPORTS - Pure functions for testing (no Figma API calls)
 * ============================================================================
 */

/**
 * Get registry data for Pagination component
 */
export function getPaginationRegistryData() {
  return {
    name: paginationComponent.name,
    description: paginationComponent.description,
    category: paginationComponent.category,
    colors: paginationColors,
    props: {
      controls: paginationProps.controls,
    },
  };
}

/**
 * Get pagination layout dimensions configuration
 * NOTE: These are Figma display-specific, not directly from React component
 */
export function getPaginationDimensionsConfig() {
  return {
    paginationHeight: PAGINATION_HEIGHT,
    buttonSize: BUTTON_SIZE,
    inputWidth: INPUT_WIDTH,
    iconSize: ICON_SIZE,
    gap: GAP,
    borderRadius: BORDER_RADIUS,
  };
}

/**
 * Get page state configurations
 * Demonstrates first page (prev disabled), middle page (all enabled), last page (next disabled)
 */
export function getPaginationStateConfig() {
  return [
    { page: 1, label: "state=first" },
    { page: 5, label: "state=middle" },
    { page: 10, label: "state=last" },
  ];
}

/**
 * Get pagination color bindings (semantic tokens)
 * Maps visual elements to Kumo semantic color tokens
 */
export function getPaginationColorBindings() {
  return {
    buttonBackground: "color-surface-2", // bg-secondary
    buttonBorder: "color-border", // ring-border
    iconEnabled: "text-color-surface",
    iconDisabled: "text-color-disabled",
    inputBackground: "color-surface-2", // bg-secondary
    inputBorder: "color-border", // ring-border
    inputText: "text-color-surface",
    showingTextLabel: "text-color-label", // From registry.colors: text-label
  };
}

/**
 * Calculate showing range text data
 */
export function calculateShowingRange(
  page: number,
  perPage: number,
  totalCount: number,
) {
  var lower = page * perPage - perPage + 1;
  var upper = Math.min(page * perPage, totalCount);
  var maxPage = Math.ceil(totalCount / perPage);
  return {
    lower: lower,
    upper: upper,
    maxPage: maxPage,
    text: "Showing " + lower + "-" + upper + " of " + totalCount,
  };
}

/**
 * Get button states for a given page
 */
export function getButtonStates(page: number, maxPage: number) {
  var isFirstPage = page <= 1;
  var isLastPage = page >= maxPage;
  return {
    isFirstPage: isFirstPage,
    isLastPage: isLastPage,
    buttons: [
      {
        iconId: "ph-caret-double-left",
        ariaLabel: "First page",
        position: "first" as "first" | "middle" | "last" | "single",
        disabled: isFirstPage,
      },
      {
        iconId: "ph-caret-left",
        ariaLabel: "Previous page",
        position: "middle" as "first" | "middle" | "last" | "single",
        disabled: isFirstPage,
      },
      {
        iconId: "ph-caret-right",
        ariaLabel: "Next page",
        position: "middle" as "first" | "middle" | "last" | "single",
        disabled: isLastPage,
      },
      {
        iconId: "ph-caret-double-right",
        ariaLabel: "Last page",
        position: "last" as "first" | "middle" | "last" | "single",
        disabled: isLastPage,
      },
    ],
  };
}

/**
 * Get all pagination intermediate data (for snapshot testing)
 */
export function getAllPaginationData() {
  var registry = getPaginationRegistryData();
  var dimensions = getPaginationDimensionsConfig();
  var states = getPaginationStateConfig();
  var colors = getPaginationColorBindings();
  var perPage = 10;
  var totalCount = 100;

  return {
    registry: registry,
    dimensions: dimensions,
    colors: colors,
    states: states.map(function (state) {
      var showingRange = calculateShowingRange(
        state.page,
        perPage,
        totalCount,
      );
      var buttonStates = getButtonStates(state.page, showingRange.maxPage);
      return {
        label: state.label,
        page: state.page,
        perPage: perPage,
        totalCount: totalCount,
        showingRange: showingRange,
        buttonStates: buttonStates,
      };
    }),
  };
}

/**
 * Create a navigation button with icon
 */
async function createNavButton(
  iconId: string,
  ariaLabel: string,
  position: "first" | "middle" | "last" | "single",
  disabled: boolean,
): Promise<FrameNode> {
  var button = figma.createFrame();
  button.name = ariaLabel;
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.primaryAxisSizingMode = "FIXED";
  button.counterAxisSizingMode = "FIXED";
  button.resize(BUTTON_SIZE, BUTTON_SIZE);

  // Apply corner radius based on position
  if (position === "first") {
    button.topLeftRadius = BORDER_RADIUS;
    button.bottomLeftRadius = BORDER_RADIUS;
    button.topRightRadius = 0;
    button.bottomRightRadius = 0;
  } else if (position === "last") {
    button.topLeftRadius = 0;
    button.bottomLeftRadius = 0;
    button.topRightRadius = BORDER_RADIUS;
    button.bottomRightRadius = BORDER_RADIUS;
  } else if (position === "single") {
    button.cornerRadius = BORDER_RADIUS;
  } else {
    button.cornerRadius = 0;
  }

  // Background: bg-secondary (color-surface-2)
  var bgVar = getVariableByName("color-surface-2");
  if (bgVar) {
    bindFillToVariable(button, bgVar.id);
  }

  // Border: ring-border
  var borderVar = getVariableByName("color-border");
  if (borderVar) {
    bindStrokeToVariable(button, borderVar.id, 1);
  }

  // Create icon
  var icon = createIconInstance(iconId, ICON_SIZE);
  if (icon) {
    // Icon color: text-color-surface for enabled, text-color-disabled for disabled
    var iconColorVar = disabled ? "text-color-disabled" : "text-color-surface";
    bindIconColor(icon, iconColorVar);
    button.appendChild(icon);
  }

  return button;
}

/**
 * Create the page number input field
 */
async function createPageInput(pageNumber: string): Promise<FrameNode> {
  var input = figma.createFrame();
  input.name = "Page Input";
  input.layoutMode = "HORIZONTAL";
  input.primaryAxisAlignItems = "CENTER";
  input.counterAxisAlignItems = "CENTER";
  input.primaryAxisSizingMode = "FIXED";
  input.counterAxisSizingMode = "FIXED";
  input.resize(INPUT_WIDTH, BUTTON_SIZE);
  input.cornerRadius = 0;

  // Background: bg-secondary (color-surface-2)
  var bgVar = getVariableByName("color-surface-2");
  if (bgVar) {
    bindFillToVariable(input, bgVar.id);
  }

  // Border: ring-border
  var borderVar = getVariableByName("color-border");
  if (borderVar) {
    bindStrokeToVariable(input, borderVar.id, 1);
  }

  // Page number text
  var text = await createTextNode(pageNumber, 14, 400);
  text.name = "Page Number";
  text.textAlignHorizontal = "CENTER";

  var textColorVar = getVariableByName("text-color-surface");
  if (textColorVar) {
    bindTextColorToVariable(text, textColorVar.id);
  }

  input.appendChild(text);

  return input;
}

/**
 * Create the "Showing X-Y of Z" text
 */
async function createShowingText(
  lower: number,
  upper: number,
  total: number,
): Promise<TextNode> {
  var text = await createTextNode(
    "Showing " + lower + "-" + upper + " of " + total,
    14,
    400,
  );
  text.name = "Showing Text";

  var labelVar = getVariableByName("text-color-label");
  if (labelVar) {
    bindTextColorToVariable(text, labelVar.id);
  }

  return text;
}

/**
 * Create the InputGroup container with navigation buttons
 */
async function createInputGroup(
  currentPage: number,
  maxPage: number,
): Promise<FrameNode> {
  var group = figma.createFrame();
  group.name = "InputGroup";
  group.layoutMode = "HORIZONTAL";
  group.primaryAxisAlignItems = "MIN";
  group.counterAxisAlignItems = "CENTER";
  group.primaryAxisSizingMode = "AUTO";
  group.counterAxisSizingMode = "AUTO";
  group.itemSpacing = GAP;
  group.fills = [];

  var isFirstPage = currentPage <= 1;
  var isLastPage = currentPage >= maxPage;

  // First page button
  var firstBtn = await createNavButton(
    "ph-caret-double-left",
    "First page",
    "first",
    isFirstPage,
  );
  group.appendChild(firstBtn);

  // Previous page button
  var prevBtn = await createNavButton(
    "ph-caret-left",
    "Previous page",
    "middle",
    isFirstPage,
  );
  group.appendChild(prevBtn);

  // Page input
  var pageInput = await createPageInput(String(currentPage));
  group.appendChild(pageInput);

  // Next page button
  var nextBtn = await createNavButton(
    "ph-caret-right",
    "Next page",
    "middle",
    isLastPage,
  );
  group.appendChild(nextBtn);

  // Last page button
  var lastBtn = await createNavButton(
    "ph-caret-double-right",
    "Last page",
    "last",
    isLastPage,
  );
  group.appendChild(lastBtn);

  return group;
}

/**
 * Create a single Pagination component
 */
async function createPaginationComponent(
  page: number,
  perPage: number,
  totalCount: number,
  variantLabel: string,
): Promise<ComponentNode> {
  var component = figma.createComponent();
  component.name = variantLabel;
  component.description = "Pagination at page " + page;

  // Set up auto-layout (horizontal: showing text + input group)
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "SPACE_BETWEEN";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 8;
  component.resize(400, PAGINATION_HEIGHT);
  component.fills = [];

  // Calculate showing range
  var lower = page * perPage - perPage + 1;
  var upper = Math.min(page * perPage, totalCount);
  var maxPage = Math.ceil(totalCount / perPage);

  // Create "Showing X-Y of Z" text
  var showingText = await createShowingText(lower, upper, totalCount);
  component.appendChild(showingText);

  // Create InputGroup with navigation
  var inputGroup = await createInputGroup(page, maxPage);
  component.appendChild(inputGroup);

  return component;
}

/**
 * Generate Pagination ComponentSet with different page states
 *
 * Creates variants for: first page, middle page, last page
 * Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generatePaginationComponents(
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

  // Page states to demonstrate
  var pageStates = [
    { page: 1, label: "state=first" }, // First page (prev disabled)
    { page: 5, label: "state=middle" }, // Middle page (all enabled)
    { page: 10, label: "state=last" }, // Last page (next disabled)
  ];

  var perPage = 10;
  var totalCount = 100;

  var components: ComponentNode[] = [];
  var rowLabels: { y: number; text: string }[] = [];

  // Layout spacing
  var rowGap = 48;
  var labelColumnWidth = 180;
  var currentY = 0;

  for (var i = 0; i < pageStates.length; i++) {
    var state = pageStates[i];
    var component = await createPaginationComponent(
      state.page,
      perPage,
      totalCount,
      state.label,
    );

    // Record row label
    rowLabels.push({ y: currentY, text: state.label });

    // Position each component vertically
    component.x = labelColumnWidth;
    component.y = currentY;
    currentY += component.height + rowGap;
    components.push(component);
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, componentsPage);
  componentSet.name = "Pagination";
  componentSet.description =
    "Pagination component showing page navigation at different states";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height;

  // Create light mode section
  var lightSection = createModeSection(componentsPage, "Pagination", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(componentsPage, "Pagination", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section frame
  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING + labelColumnWidth;
  componentSet.y = SECTION_PADDING;

  // Add row labels to light section
  for (var j = 0; j < rowLabels.length; j++) {
    var label = rowLabels[j];
    var labelNode = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y + 10,
    );
    lightSection.frame.appendChild(labelNode);
  }

  // Create instances for dark section
  for (var k = 0; k < components.length; k++) {
    var comp = components[k];
    var instance = comp.createInstance();
    instance.x = comp.x + SECTION_PADDING + labelColumnWidth;
    instance.y = comp.y + SECTION_PADDING;
    darkSection.frame.appendChild(instance);
  }

  // Add row labels to dark section
  for (var m = 0; m < rowLabels.length; m++) {
    var darkLabel = rowLabels[m];
    var darkLabelNode = await createRowLabel(
      darkLabel.text,
      SECTION_PADDING,
      SECTION_PADDING + darkLabel.y + 10,
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
    "✅ Generated Pagination ComponentSet with " +
      pageStates.length +
      " states (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}
