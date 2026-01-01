import { logComplete } from "../logger";
/**
 * Surface Component Generator
 *
 * Generates a Surface ComponentSet in Figma that matches
 * the Surface component styling:
 *
 * - A simple container with shadow and border
 * - Polymorphic (can be any element), but visually just a styled container
 *
 * The Surface is a layout primitive with shadow-xs and ring ring-border.
 *
 * @see packages/kumo/src/components/surface/surface.tsx
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
 * Create a single Surface component
 */
async function createSurfaceComponent(): Promise<ComponentNode> {
  var component = figma.createComponent();
  component.name = "Surface";
  component.description =
    "A container component with shadow and border for creating elevated surfaces.";

  // Set up the surface frame
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.itemSpacing = 8;
  component.cornerRadius = BORDER_RADIUS.lg;

  // Apply background fill (bg-surface for the container)
  var bgVar = getVariableByName("color-surface");
  if (bgVar) {
    bindFillToVariable(component, bgVar.id);
  }

  // Apply border (ring ring-border)
  var borderVar = getVariableByName("color-border");
  if (borderVar) {
    bindStrokeToVariable(component, borderVar.id, 1);
  }

  // Apply shadow effect (shadow-xs)
  component.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 1 },
      radius: 2,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  // Add sample content text
  var contentText = await createTextNode("Surface content", 14, 400);
  contentText.name = "Content";
  contentText.textAutoResize = "WIDTH_AND_HEIGHT";

  var textVar = getVariableByName("text-color-surface");
  if (textVar) {
    bindTextColorToVariable(contentText, textVar.id);
  }

  component.appendChild(contentText);

  return component;
}

/**
 * Generate Surface ComponentSet
 *
 * Creates a "Surface" ComponentSet with a single variant showing
 * the surface styling (shadow + border).
 *
 * Creates both light and dark mode sections.
 */
export async function generateSurfaceComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  var components: ComponentNode[] = [];
  var rowLabels: { y: number; text: string }[] = [];

  var labelColumnWidth = 100;

  // Create single surface component
  var component = await createSurfaceComponent();
  component.x = labelColumnWidth;
  component.y = 0;
  rowLabels.push({ y: 0, text: "default" });
  components.push(component);

  // Combine into ComponentSet (even with single variant for consistency)
  // @ts-ignore
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Surface";
  componentSet.description =
    "A polymorphic container component for creating elevated surfaces with shadow and border.";
  componentSet.layoutMode = "NONE";

  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height;

  // Create sections
  var lightSection = createModeSection(page, "Surface", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  var darkSection = createModeSection(page, "Surface", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section
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

  // Resize and position sections
  var totalWidth = contentWidth + SECTION_PADDING * 2;
  var totalHeight = contentHeight + SECTION_PADDING * 2;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  lightSection.section.x = 100;
  lightSection.section.y = startY;

  darkSection.section.x = 100 + totalWidth + 50;
  darkSection.section.y = startY;

  logComplete(
    "Generated Surface ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}
