/**
 * Meter Component Generator
 *
 * Generates a Meter ComponentSet in Figma showing progress bar at various fill levels.
 * Reads component definitions from component-registry.json.
 */

import {
  createTextNode,
  bindFillToVariable,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindTextColorToVariable,
} from "./shared";

/**
 * Meter base layout constants
 */
const METER_WIDTH = 240;
const METER_TRACK_HEIGHT = 8;
const METER_GAP = 8;

/**
 * Section padding for component display
 */
const SECTION_PADDING = 48;

/**
 * Gap between sections on the page
 */
const SECTION_GAP = 160;

/**
 * Create a single Meter component with the specified fill percentage
 */
async function createMeterComponent(
  label: string,
  fillPercentage: number,
): Promise<ComponentNode> {
  // Create component
  const component = figma.createComponent();
  component.name = "fill=" + fillPercentage;
  component.description = "Meter at " + fillPercentage + "% fill";

  // Set up auto-layout (vertical: label+value row, then track)
  component.layoutMode = "VERTICAL";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = METER_GAP;
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";

  // Create label+value row frame
  const headerRow = figma.createFrame();
  headerRow.name = "Header";
  headerRow.layoutMode = "HORIZONTAL";
  headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  headerRow.counterAxisAlignItems = "CENTER";
  headerRow.primaryAxisSizingMode = "FIXED";
  headerRow.counterAxisSizingMode = "AUTO";
  headerRow.resize(METER_WIDTH, 20);
  headerRow.fills = [];

  // Create label text
  const labelText = await createTextNode(label, 12, 400);
  labelText.name = "Label";
  const labelVar = getVariableByName("text-color-label");
  if (labelVar) {
    bindTextColorToVariable(labelText, labelVar.id);
  }

  // Create value text
  const valueText = await createTextNode(fillPercentage + "%", 14, 500);
  valueText.name = "Value";
  const surfaceTextVar = getVariableByName("text-color-surface");
  if (surfaceTextVar) {
    bindTextColorToVariable(valueText, surfaceTextVar.id);
  }

  headerRow.appendChild(labelText);
  headerRow.appendChild(valueText);

  // Create track frame (background)
  const track = figma.createFrame();
  track.name = "Track";
  track.layoutMode = "NONE";
  track.resize(METER_WIDTH, METER_TRACK_HEIGHT);
  track.cornerRadius = 9999; // fully rounded

  // Bind track background to bg-color variable
  const bgColorVar = getVariableByName("color-color-4");
  if (bgColorVar) {
    bindFillToVariable(track, bgColorVar.id);
  } else {
    // Fallback to gray
    track.fills = [
      {
        type: "SOLID",
        color: { r: 0.9, g: 0.9, b: 0.9 },
      },
    ];
  }

  // Create indicator (filled portion)
  const indicator = figma.createFrame();
  indicator.name = "Indicator";
  indicator.layoutMode = "NONE";

  // Calculate indicator width based on fill percentage
  const indicatorWidth = (METER_WIDTH * fillPercentage) / 100;
  indicator.resize(indicatorWidth, METER_TRACK_HEIGHT);
  indicator.cornerRadius = 9999; // fully rounded

  // Bind indicator background to primary variable
  const primaryVar = getVariableByName("color-primary");
  if (primaryVar) {
    bindFillToVariable(indicator, primaryVar.id);
  } else {
    // Fallback to blue
    indicator.fills = [
      {
        type: "SOLID",
        color: { r: 0.0, g: 0.5, b: 1.0 },
      },
    ];
  }

  // Position indicator inside track
  indicator.x = 0;
  indicator.y = 0;

  // Add indicator to track
  track.appendChild(indicator);

  // Add header and track to component
  component.appendChild(headerRow);
  component.appendChild(track);

  return component;
}

/**
 * Generate Meter ComponentSet with different fill levels
 *
 * Creates a single "Meter" ComponentSet with fill variants showing different states.
 * Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateMeterComponents(startY: number): Promise<number> {
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

  // Fill levels to demonstrate: 0%, 25%, 50%, 75%, 100%
  const fillLevels = [0, 25, 50, 75, 100];
  const components: ComponentNode[] = [];

  // Track row labels: { y, text }
  const rowLabels: { y: number; text: string }[] = [];

  // Layout spacing - vertical layout with labels
  const rowGap = 40;
  const labelColumnWidth = 180; // Space for labels on the left

  // Track position for laying out components vertically
  var currentY = 0;

  for (var i = 0; i < fillLevels.length; i++) {
    const fillLevel = fillLevels[i];
    const component = await createMeterComponent("Progress", fillLevel);

    // Record row label
    rowLabels.push({ y: currentY, text: "fill=" + fillLevel });

    // Position each component vertically with label offset
    component.x = labelColumnWidth;
    component.y = currentY;
    currentY += component.height + rowGap;
    components.push(component);
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  const componentSet = figma.combineAsVariants(components, componentsPage);
  componentSet.name = "Meter";
  componentSet.description =
    "Meter component showing progress at different fill levels";

  // Calculate content dimensions (add label column width)
  const contentWidth = componentSet.width + labelColumnWidth;
  const contentHeight = componentSet.height;

  // Create light mode section
  const lightSection = createModeSection(componentsPage, "Meter", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  const darkSection = createModeSection(componentsPage, "Meter", "dark");
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
    const label = rowLabels[j];
    const labelNode = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y + 8, // +8 to vertically center with meter
    );
    lightSection.frame.appendChild(labelNode);
  }

  // Create instances for dark section
  // Note: component positions are relative to ComponentSet after combineAsVariants
  // We need to add labelColumnWidth to match the light section layout
  for (var k = 0; k < components.length; k++) {
    const component = components[k];
    const instance = component.createInstance();
    instance.x = component.x + SECTION_PADDING + labelColumnWidth;
    instance.y = component.y + SECTION_PADDING;
    darkSection.frame.appendChild(instance);
  }

  // Add row labels to dark section
  for (var m = 0; m < rowLabels.length; m++) {
    const label = rowLabels[m];
    const labelNode = await createRowLabel(
      label.text,
      SECTION_PADDING,
      SECTION_PADDING + label.y + 8,
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

  console.log(
    "✅ Generated Meter ComponentSet with " +
      fillLevels.length +
      " fill levels (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}
