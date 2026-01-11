/**
 * PageHeader Component Generator
 *
 * Generates PageHeader components in Figma with spacing variants.
 * Reads variant definitions from component-registry.json (the source of truth).
 */

import {
  createTextNode,
  bindTextColorToVariable,
  bindStrokeToVariable,
  getVariableByName,
  createModeSection,
  createRowLabel,
  SECTION_PADDING,
  SECTION_GAP,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logInfo, logWarn } from "../logger";

// Import variant data from the registry
import registry from "../../../../ai/component-registry.json";

const pageHeaderComponent = registry.components.PageHeader;
const pageHeaderProps = pageHeaderComponent.props;
const spacingProp = pageHeaderProps.spacing as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * PageHeader base styles from pageHeaderVariants() in page-header.tsx
 */
const PAGE_HEADER_BASE_STYLES = "flex flex-col";

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 * These functions compute data without calling Figma APIs, enabling snapshot tests.
 */

/**
 * Get spacing configuration from registry
 */
export function getPageHeaderSpacingConfig() {
  return {
    values: spacingProp.values,
    classes: spacingProp.classes,
    descriptions: spacingProp.descriptions,
    default: spacingProp.default,
  };
}

/**
 * Get parsed base styles
 */
export function getPageHeaderParsedBaseStyles() {
  return parseTailwindClasses(PAGE_HEADER_BASE_STYLES);
}

/**
 * Get parsed styles for a specific spacing variant
 */
export function getPageHeaderParsedSpacingStyles(spacing: string) {
  const classes = spacingProp.classes[spacing] || "";
  return {
    spacing,
    classes,
    description: spacingProp.descriptions[spacing] || "",
    parsed: parseTailwindClasses(classes),
  };
}

/**
 * Get color bindings for PageHeader elements
 */
export function getPageHeaderColorBindings() {
  return {
    border: "color-border", // border-color
    titleText: "text-color-surface", // text-surface
    descriptionText: "text-color-muted", // text-muted
  };
}

/**
 * Get layout configuration for PageHeader sections
 */
export function getPageHeaderLayoutConfig() {
  return {
    breadcrumbs: {
      // Border bottom section with breadcrumbs
      paddingY: 12, // py-3 (approx)
      borderBottom: true,
    },
    titleSection: {
      // Title and description section
      gap: 8, // gap-2
      paddingY: 12, // py-3
      paddingLeft: 12, // pl-3
    },
    title: {
      fontSize: 30, // text-3xl
      fontWeight: 600, // font-semibold
      fontFamily: "heading", // font-heading
    },
    description: {
      fontSize: 16, // text-base
      fontWeight: 400, // normal
      maxWidth: 672, // max-w-prose (approx 672px)
    },
    tabsSection: {
      // Tabs with actions section
      paddingTop: 4, // pt-1
      paddingBottom: 12, // pb-3
      paddingLeft: 12, // pl-3
      borderBottom: true,
      actionGap: 8, // gap-2 for action buttons
    },
  };
}

/**
 * Get all PageHeader data (for snapshot testing)
 * Returns intermediate data before Figma API calls
 */
export function getAllPageHeaderData() {
  const baseStyles = getPageHeaderParsedBaseStyles();
  const spacingConfig = getPageHeaderSpacingConfig();
  const colorBindings = getPageHeaderColorBindings();
  const layoutConfig = getPageHeaderLayoutConfig();

  return {
    baseStyles: {
      raw: PAGE_HEADER_BASE_STYLES,
      parsed: baseStyles,
    },
    spacingConfig,
    spacings: spacingConfig.values.map((spacing) => {
      const spacingData = getPageHeaderParsedSpacingStyles(spacing);
      return {
        ...spacingData,
        // Layout calculations
        layout: {
          gap: spacingData.parsed.gap ?? 8, // Default to gap-2 (8px)
        },
      };
    }),
    colorBindings,
    layoutConfig,
  };
}

/**
 * Create a single PageHeader component with the specified spacing variant
 */
async function createPageHeaderComponent(
  spacing: string,
): Promise<ComponentNode> {
  const classes = spacingProp.classes[spacing] || "";
  const description = spacingProp.descriptions[spacing] || "";

  // Parse spacing styles
  const spacingStyles = parseTailwindClasses(classes);

  // Create component
  const component = figma.createComponent();
  component.name = `spacing=${spacing}`;
  component.description = description;

  // Set up auto-layout (vertical layout for page header sections)
  component.layoutMode = "VERTICAL";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";

  // Apply gap from parsed styles (compact: 4px, base: 8px, relaxed: 16px)
  const gap = spacingStyles.gap ?? 8;
  component.itemSpacing = gap;

  // Set fixed width
  const componentWidth = 800;
  component.resize(componentWidth, component.height);

  // Get color variables
  const borderVar = getVariableByName("color-border");
  const titleTextVar = getVariableByName("text-color-surface");
  const descriptionTextVar = getVariableByName("text-color-muted");

  const layoutConfig = getPageHeaderLayoutConfig();

  // --- Section 1: Breadcrumbs ---
  const breadcrumbsSection = figma.createFrame();
  breadcrumbsSection.name = "Breadcrumbs Section";
  breadcrumbsSection.layoutMode = "HORIZONTAL";
  breadcrumbsSection.primaryAxisAlignItems = "CENTER";
  breadcrumbsSection.counterAxisAlignItems = "CENTER";
  breadcrumbsSection.primaryAxisSizingMode = "FILL";
  breadcrumbsSection.counterAxisSizingMode = "AUTO";
  breadcrumbsSection.paddingTop = layoutConfig.breadcrumbs.paddingY;
  breadcrumbsSection.paddingBottom = layoutConfig.breadcrumbs.paddingY;
  breadcrumbsSection.itemSpacing = 4; // gap-1

  // Add border bottom
  breadcrumbsSection.strokes = [
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
  ];
  breadcrumbsSection.strokeWeight = 1;
  breadcrumbsSection.strokeAlign = "INSIDE";
  breadcrumbsSection.strokeTopWeight = 0;
  breadcrumbsSection.strokeRightWeight = 0;
  breadcrumbsSection.strokeLeftWeight = 0;
  breadcrumbsSection.strokeBottomWeight = 1;

  if (borderVar) {
    bindStrokeToVariable(breadcrumbsSection, borderVar);
  }

  // Add breadcrumbs placeholder text
  const breadcrumbsText = createTextNode(
    "Home / Projects / Current Project",
    14,
    400,
  );
  if (descriptionTextVar) {
    bindTextColorToVariable(breadcrumbsText, descriptionTextVar);
  }
  breadcrumbsSection.appendChild(breadcrumbsText);

  component.appendChild(breadcrumbsSection);

  // --- Section 2: Title and Description ---
  const titleSection = figma.createFrame();
  titleSection.name = "Title Section";
  titleSection.layoutMode = "VERTICAL";
  titleSection.primaryAxisAlignItems = "MIN";
  titleSection.counterAxisAlignItems = "MIN";
  titleSection.primaryAxisSizingMode = "AUTO";
  titleSection.counterAxisSizingMode = "FILL";
  titleSection.paddingTop = layoutConfig.titleSection.paddingY;
  titleSection.paddingBottom = layoutConfig.titleSection.paddingY;
  titleSection.paddingLeft = layoutConfig.titleSection.paddingLeft;
  titleSection.itemSpacing = layoutConfig.titleSection.gap;
  titleSection.fills = []; // Transparent

  // Title
  const titleText = createTextNode(
    "Page Title",
    layoutConfig.title.fontSize,
    layoutConfig.title.fontWeight,
  );
  if (titleTextVar) {
    bindTextColorToVariable(titleText, titleTextVar);
  }
  titleSection.appendChild(titleText);

  // Description
  const descriptionText = createTextNode(
    "Action-led, value-oriented description of what this page does.",
    layoutConfig.description.fontSize,
    layoutConfig.description.fontWeight,
  );
  descriptionText.resize(layoutConfig.description.maxWidth, descriptionText.height);
  descriptionText.textAutoResize = "HEIGHT";
  if (descriptionTextVar) {
    bindTextColorToVariable(descriptionText, descriptionTextVar);
  }
  titleSection.appendChild(descriptionText);

  component.appendChild(titleSection);

  // --- Section 3: Tabs with Actions ---
  const tabsSection = figma.createFrame();
  tabsSection.name = "Tabs Section";
  tabsSection.layoutMode = "HORIZONTAL";
  tabsSection.primaryAxisAlignItems = "CENTER";
  tabsSection.counterAxisAlignItems = "CENTER";
  tabsSection.primaryAxisSizingMode = "FILL";
  tabsSection.counterAxisSizingMode = "AUTO";
  tabsSection.paddingTop = layoutConfig.tabsSection.paddingTop;
  tabsSection.paddingBottom = layoutConfig.tabsSection.paddingBottom;
  tabsSection.paddingLeft = layoutConfig.tabsSection.paddingLeft;
  tabsSection.itemSpacing = layoutConfig.tabsSection.actionGap;

  // Add border bottom
  tabsSection.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  tabsSection.strokeWeight = 1;
  tabsSection.strokeAlign = "INSIDE";
  tabsSection.strokeTopWeight = 0;
  tabsSection.strokeRightWeight = 0;
  tabsSection.strokeLeftWeight = 0;
  tabsSection.strokeBottomWeight = 1;

  if (borderVar) {
    bindStrokeToVariable(tabsSection, borderVar);
  }

  // Tabs placeholder (left side)
  const tabsPlaceholder = figma.createFrame();
  tabsPlaceholder.name = "Tabs";
  tabsPlaceholder.layoutMode = "HORIZONTAL";
  tabsPlaceholder.primaryAxisAlignItems = "CENTER";
  tabsPlaceholder.counterAxisAlignItems = "CENTER";
  tabsPlaceholder.primaryAxisSizingMode = "AUTO";
  tabsPlaceholder.counterAxisSizingMode = "AUTO";
  tabsPlaceholder.itemSpacing = 8; // gap-2
  tabsPlaceholder.fills = []; // Transparent

  const tabsText = createTextNode("Overview | Analytics | Settings", 14, 400);
  if (descriptionTextVar) {
    bindTextColorToVariable(tabsText, descriptionTextVar);
  }
  tabsPlaceholder.appendChild(tabsText);

  tabsSection.appendChild(tabsPlaceholder);

  // Spacer to push actions to the right
  const spacer = figma.createFrame();
  spacer.name = "Spacer";
  spacer.layoutMode = "HORIZONTAL";
  spacer.layoutGrow = 1;
  spacer.fills = []; // Transparent
  tabsSection.appendChild(spacer);

  // Actions placeholder (right side)
  const actionsPlaceholder = figma.createFrame();
  actionsPlaceholder.name = "Actions";
  actionsPlaceholder.layoutMode = "HORIZONTAL";
  actionsPlaceholder.primaryAxisAlignItems = "CENTER";
  actionsPlaceholder.counterAxisAlignItems = "CENTER";
  actionsPlaceholder.primaryAxisSizingMode = "AUTO";
  actionsPlaceholder.counterAxisSizingMode = "AUTO";
  actionsPlaceholder.itemSpacing = layoutConfig.tabsSection.actionGap;
  actionsPlaceholder.fills = []; // Transparent

  const actionsText = createTextNode("Export | New Item", 12, 500);
  if (titleTextVar) {
    bindTextColorToVariable(actionsText, titleTextVar);
  }
  actionsPlaceholder.appendChild(actionsText);

  tabsSection.appendChild(actionsPlaceholder);

  component.appendChild(tabsSection);

  return component;
}

/**
 * Main generator function
 * Creates the PageHeader section with all spacing variants
 */
export async function generatePageHeaderComponents(
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  logInfo("Generating PageHeader components...");

  // Find or create Components page
  let componentsPage = figma.root.children.find(function (page) {
    return page.type === "PAGE" && page.name === "Components";
  }) as PageNode | undefined;

  if (!componentsPage) {
    componentsPage = figma.createPage();
    componentsPage.name = "Components";
  }

  figma.currentPage = componentsPage;

  const spacingConfig = getPageHeaderSpacingConfig();
  const components: ComponentNode[] = [];

  // Track row labels: { y, text }
  const rowLabels: { y: number; text: string }[] = [];

  // Layout spacing - vertical layout with labels
  const rowGap = 40;
  const labelColumnWidth = 180;

  // Track position for laying out components vertically
  let currentY = 0;

  // Create components for each spacing variant
  for (let i = 0; i < spacingConfig.values.length; i++) {
    const spacing = spacingConfig.values[i];
    const component = await createPageHeaderComponent(spacing);

    // Record row label
    rowLabels.push({ y: currentY, text: `spacing=${spacing}` });

    // Position each component vertically with label offset
    component.x = labelColumnWidth;
    component.y = currentY;
    currentY += component.height + rowGap;
    components.push(component);
  }

  // Combine all variants into a single ComponentSet
  const componentSet = figma.combineAsVariants(components, componentsPage);
  componentSet.name = "PageHeader";
  componentSet.description = "PageHeader component with spacing variants";

  // Calculate content dimensions (add label column width)
  const contentWidth = componentSet.width + labelColumnWidth;
  const contentHeight = componentSet.height;

  // Create light mode section
  const lightSection = createModeSection(componentsPage, "PageHeader", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  const darkSection = createModeSection(componentsPage, "PageHeader", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section frame
  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING + labelColumnWidth;
  componentSet.y = SECTION_PADDING;

  // Add row labels to light section
  for (const label of rowLabels) {
    const labelNode = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y + 20,
    );
    lightSection.frame.appendChild(labelNode);
  }

  // Create instances for dark section
  for (const component of components) {
    const instance = component.createInstance();
    instance.x = component.x + SECTION_PADDING + labelColumnWidth;
    instance.y = component.y + SECTION_PADDING;
    darkSection.frame.appendChild(instance);
  }

  // Add row labels to dark section
  for (const label of rowLabels) {
    const labelNode = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y + 20,
    );
    darkSection.frame.appendChild(labelNode);
  }

  // Resize sections to fit content with padding
  const totalWidth = contentWidth + SECTION_PADDING * 2;
  const totalHeight = contentHeight + SECTION_PADDING * 2;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  // Position sections side by side
  lightSection.section.x = 100;
  lightSection.section.y = startY;

  darkSection.section.x = 100 + totalWidth + 50;
  darkSection.section.y = startY;

  logInfo(
    `✅ Generated PageHeader ComponentSet with ${spacingConfig.values.length} spacing variants (light + dark)`,
  );

  return startY + totalHeight + SECTION_GAP;
}
