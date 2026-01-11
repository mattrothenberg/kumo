/**
 * Breadcrumbs Component Generator
 *
 * Generates Breadcrumbs ComponentSet in Figma with size variants.
 * Reads variant definitions from component-registry.json (the source of truth).
 */

import {
  createTextNode,
  bindTextColorToVariable,
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

const breadcrumbsComponent = registry.components.Breadcrumbs;
const breadcrumbsProps = breadcrumbsComponent.props;
const sizeProp = breadcrumbsProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 * These functions compute data without calling Figma APIs, enabling snapshot tests.
 */

/**
 * Get size configuration from registry
 */
export function getBreadcrumbsSizeConfig() {
  return {
    values: sizeProp.values,
    classes: sizeProp.classes,
    descriptions: sizeProp.descriptions,
    default: sizeProp.default,
  };
}

/**
 * Get parsed size styles for a specific size
 */
export function getBreadcrumbsParsedSizeStyles(size: string) {
  const classes = sizeProp.classes[size] || "";
  return {
    size,
    classes,
    description: sizeProp.descriptions[size] || "",
    parsed: parseTailwindClasses(classes),
  };
}

/**
 * Get color bindings for breadcrumb elements
 */
export function getBreadcrumbsColorBindings() {
  return {
    link: "text-color-muted", // Links use text-muted
    current: "text-color-surface", // Current page uses default text color
    separator: "text-color-disabled", // Separator uses disabled color
  };
}

/**
 * Get separator icon configuration
 */
export function getBreadcrumbsSeparatorConfig() {
  return {
    iconName: "ph-caret-right",
    size: 20, // Separator icon size
  };
}

/**
 * Get all breadcrumbs data (for snapshot testing)
 */
export function getAllBreadcrumbsData() {
  const sizeConfig = getBreadcrumbsSizeConfig();
  const colorBindings = getBreadcrumbsColorBindings();
  const separatorConfig = getBreadcrumbsSeparatorConfig();

  return {
    sizeConfig,
    sizes: sizeConfig.values.map((size) => {
      const sizeData = getBreadcrumbsParsedSizeStyles(size);
      return {
        ...sizeData,
        // Layout calculations
        layout: {
          height: sizeData.parsed.height ?? (size === "sm" ? 40 : 48),
          gap: sizeData.parsed.gap ?? (size === "sm" ? 2 : 4),
          fontSize: sizeData.parsed.fontSize ?? (size === "sm" ? 14 : 16),
          itemGap: 4, // gap-1 between icon and text within item
        },
      };
    }),
    colorBindings,
    separatorConfig,
  };
}

/**
 * Create a single Breadcrumbs component with the specified size
 */
async function createBreadcrumbsComponent(size: string): Promise<ComponentNode> {
  const classes = sizeProp.classes[size] || "";
  const description = sizeProp.descriptions[size] || "";

  // Parse size styles
  const sizeStyles = parseTailwindClasses(classes);

  // Create component
  const component = figma.createComponent();
  component.name = `size=${size}`;
  component.description = description;

  // Set up auto-layout (horizontal layout for breadcrumb items)
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";

  // Apply height from parsed styles with fallback
  const height = sizeStyles.height ?? (size === "sm" ? 40 : 48);
  component.resize(component.width, height);

  // Apply gap between items (link, separator, link, separator, current)
  const gap = sizeStyles.gap ?? (size === "sm" ? 2 : 4);
  component.itemSpacing = gap;

  // Get font size for text elements
  const fontSize = sizeStyles.fontSize ?? (size === "sm" ? 14 : 16);

  // Get color variables
  const linkTextVar = getVariableByName("text-color-muted");
  const currentTextVar = getVariableByName("text-color-surface");
  const separatorTextVar = getVariableByName("text-color-disabled");

  // Create breadcrumb structure: Link > Separator > Link > Separator > Current
  // 1. First Link
  const link1 = figma.createFrame();
  link1.name = "Link";
  link1.layoutMode = "HORIZONTAL";
  link1.primaryAxisAlignItems = "CENTER";
  link1.counterAxisAlignItems = "CENTER";
  link1.itemSpacing = 4; // gap-1
  link1.primaryAxisSizingMode = "AUTO";
  link1.counterAxisSizingMode = "AUTO";
  link1.fills = [];

  const link1Text = await createTextNode("Home", fontSize, 400);
  if (linkTextVar) {
    bindTextColorToVariable(link1Text, linkTextVar.id);
  }
  link1.appendChild(link1Text);

  component.appendChild(link1);

  // 2. First Separator
  const sep1 = await createSeparatorIcon(separatorTextVar?.id);
  component.appendChild(sep1);

  // 3. Second Link
  const link2 = figma.createFrame();
  link2.name = "Link";
  link2.layoutMode = "HORIZONTAL";
  link2.primaryAxisAlignItems = "CENTER";
  link2.counterAxisAlignItems = "CENTER";
  link2.itemSpacing = 4;
  link2.primaryAxisSizingMode = "AUTO";
  link2.counterAxisSizingMode = "AUTO";
  link2.fills = [];

  const link2Text = await createTextNode("Projects", fontSize, 400);
  if (linkTextVar) {
    bindTextColorToVariable(link2Text, linkTextVar.id);
  }
  link2.appendChild(link2Text);

  component.appendChild(link2);

  // 4. Second Separator
  const sep2 = await createSeparatorIcon(separatorTextVar?.id);
  component.appendChild(sep2);

  // 5. Current (bold, different color)
  const current = figma.createFrame();
  current.name = "Current";
  current.layoutMode = "HORIZONTAL";
  current.primaryAxisAlignItems = "CENTER";
  current.counterAxisAlignItems = "CENTER";
  current.itemSpacing = 4;
  current.primaryAxisSizingMode = "AUTO";
  current.counterAxisSizingMode = "AUTO";
  current.fills = [];

  const currentText = await createTextNode("Current Project", fontSize, 500); // medium weight
  if (currentTextVar) {
    bindTextColorToVariable(currentText, currentTextVar.id);
  }
  current.appendChild(currentText);

  component.appendChild(current);

  return component;
}

/**
 * Create separator icon (caret-right chevron)
 */
async function createSeparatorIcon(textVariableId?: string): Promise<FrameNode> {
  const separatorFrame = figma.createFrame();
  separatorFrame.name = "Separator";
  separatorFrame.resize(24, 24);
  separatorFrame.fills = [];
  separatorFrame.layoutMode = "HORIZONTAL";
  separatorFrame.primaryAxisAlignItems = "CENTER";
  separatorFrame.counterAxisAlignItems = "CENTER";

  // Create SVG with explicit stroke color (not currentColor) so Figma can parse it
  // This matches the SVG path from breadcrumbs.tsx: "M10.75 8.75L14.25 12L10.75 15.25"
  const disabledGray = "#999999"; // text-disabled equivalent
  const svgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="${disabledGray}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  try {
    const svgNode = figma.createNodeFromSvg(svgString);
    svgNode.name = "chevron";
    
    // Try to bind stroke color to variable on the path children
    if (textVariableId && "children" in svgNode) {
      for (const child of svgNode.children) {
        if ("strokes" in child && child.strokes && child.strokes.length > 0) {
          try {
            const variable = figma.variables.getVariableById(textVariableId);
            if (variable) {
              // Use setBoundVariable with field name only (Figma plugin API)
              (child as SceneNode & { setBoundVariable: (field: string, variable: Variable) => void })
                .setBoundVariable("strokes", variable);
            }
          } catch {
            // Keep the solid color fallback
          }
        }
      }
    }

    separatorFrame.appendChild(svgNode);
  } catch (error) {
    logWarn(`Failed to create separator icon: ${error}`);
    // Fallback: create a simple text chevron
    const fallbackText = await createTextNode(">", 16, 400);
    separatorFrame.appendChild(fallbackText);
  }

  return separatorFrame;
}

/**
 * Generate Breadcrumbs ComponentSet with size property
 *
 * Creates a "Breadcrumbs" ComponentSet with variants derived from
 * component-registry.json. Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateBreadcrumbsComponents(
  startY: number
): Promise<number> {
  if (startY === undefined) startY = 100;

  // Find or create Components page
  let componentsPage = figma.root.children.find(function (page) {
    return page.type === "PAGE" && page.name === "Components";
  }) as PageNode | undefined;

  if (!componentsPage) {
    componentsPage = figma.createPage();
    componentsPage.name = "Components";
  }

  figma.currentPage = componentsPage;

  // Get size keys from the registry
  const sizes = sizeProp.values;
  const components: ComponentNode[] = [];

  // Track row labels: { y, text }
  const rowLabels: { y: number; text: string }[] = [];

  // Layout spacing - vertical layout with labels
  const rowGap = 40;
  const labelColumnWidth = 180; // Space for labels on the left

  // Track position for laying out components vertically
  let currentY = 0;

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const component = await createBreadcrumbsComponent(size);

    // Record row label
    rowLabels.push({ y: currentY, text: `size=${size}` });

    // Position each component vertically with label offset
    component.x = labelColumnWidth;
    component.y = currentY;
    currentY += component.height + rowGap;
    components.push(component);
  }

  // Combine all variants into a single ComponentSet
  const componentSet = figma.combineAsVariants(components, componentsPage);
  componentSet.name = "Breadcrumbs";
  componentSet.description = "Breadcrumbs component with size variants";

  // Calculate content dimensions (add label column width)
  const contentWidth = componentSet.width + labelColumnWidth;
  const contentHeight = componentSet.height;

  // Create light mode section
  const lightSection = createModeSection(
    componentsPage,
    "Breadcrumbs",
    "light"
  );
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2
  );

  // Create dark mode section
  const darkSection = createModeSection(componentsPage, "Breadcrumbs", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2
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
      SECTION_PADDING + label.y + 10 // Center vertically with breadcrumbs
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
      SECTION_PADDING + label.y + 10
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
    `✅ Generated Breadcrumbs ComponentSet with ${sizes.length} sizes (light + dark)`
  );

  return startY + totalHeight + SECTION_GAP;
}
