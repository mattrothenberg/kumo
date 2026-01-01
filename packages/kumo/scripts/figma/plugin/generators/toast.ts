/**
 * Toast Component Generator
 *
 * Generates a Toast ComponentSet in Figma that matches
 * the Toast component styling:
 *
 * - Static visual representation of an open toast notification
 * - Title + Description + Close button layout
 * - No variants (single appearance)
 *
 * The Toast has:
 * - Container with bg-toast, border-color, rounded-lg, shadow-lg
 * - Title text (text-surface, font-medium)
 * - Description text (text-muted)
 * - Close button with X icon (text-muted)
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/toast/toast.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindFillToVariable,
  bindTextColorToVariable,
  bindStrokeToVariable,
  BORDER_RADIUS,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";

/**
 * Section padding for component display
 */
var SECTION_PADDING = 48;

/**
 * Gap between sections on the page
 */
var SECTION_GAP = 160;

/**
 * Toast dimensions (matches sm:w-[300px] from viewport)
 */
var TOAST_WIDTH = 300;

/**
 * Create a single Toast component
 *
 * Layout structure:
 * - Component (vertical auto-layout)
 *   - Header (horizontal: title + spacer + close button)
 *   - Description
 *
 * @returns ComponentNode for the toast
 */
async function createToastComponent(): Promise<ComponentNode> {
  // Create component
  var component = figma.createComponent();
  component.name = "Toast";
  component.description = "Toast notification component for transient messages";

  // Set up vertical auto-layout
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(TOAST_WIDTH, 100); // Height will auto-adjust
  component.itemSpacing = 4; // Small gap between header and description
  component.paddingLeft = 16; // p-4 = 16px
  component.paddingRight = 16;
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.cornerRadius = BORDER_RADIUS.lg; // rounded-lg = 8px

  // Apply background fill (bg-toast)
  var bgVar = getVariableByName("color-toast");
  if (bgVar) {
    bindFillToVariable(component, bgVar.id);
  }

  // Apply border (border-color)
  var borderVar = getVariableByName("color-color");
  if (borderVar) {
    bindStrokeToVariable(component, borderVar.id, 1);
  }

  // Apply shadow effect (shadow-lg)
  component.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 10 },
      radius: 15,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 6,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  // Create header frame (title + close button with SPACE_BETWEEN)
  var header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.resize(TOAST_WIDTH - 32, 20); // Full width minus padding
  header.layoutAlign = "STRETCH";
  header.fills = [];
  header.itemSpacing = 8;

  // Create title text
  // text-[0.975rem] = ~15.6px, font-medium = 500
  var title = await createTextNode("Toast created", 16, 500);
  title.name = "Title";
  title.textAutoResize = "WIDTH_AND_HEIGHT";
  title.layoutGrow = 1; // Take remaining space

  // Apply title text color (text-surface)
  var titleVar = getVariableByName("text-color-surface");
  if (titleVar) {
    bindTextColorToVariable(title, titleVar.id);
  }

  header.appendChild(title);

  // Create close button
  // h-5 w-5 = 20x20px
  var closeButton = figma.createFrame();
  closeButton.name = "Close Button";
  closeButton.layoutMode = "HORIZONTAL";
  closeButton.primaryAxisAlignItems = "CENTER";
  closeButton.counterAxisAlignItems = "CENTER";
  closeButton.resize(20, 20);
  closeButton.cornerRadius = 4; // rounded
  closeButton.fills = []; // bg-transparent

  // Create close icon (ph-x) - 16x16 inside 20x20 button
  var closeIconName = "ph-x";
  var closeIcon = getButtonIcon(closeIconName, "sm"); // sm = 16px
  closeIcon.name = "Icon";

  // Apply icon color (text-muted)
  bindIconColor(closeIcon, "text-muted");

  closeButton.appendChild(closeIcon);
  header.appendChild(closeButton);

  component.appendChild(header);

  // Create description text
  // text-[0.925rem] = ~14.8px, normal weight
  var description = await createTextNode(
    "This is a toast notification.",
    15,
    400,
  );
  description.name = "Description";
  description.textAutoResize = "HEIGHT";
  description.layoutAlign = "STRETCH";
  description.resize(TOAST_WIDTH - 32, description.height); // Full width minus padding

  // Apply description text color (text-muted)
  var descVar = getVariableByName("text-color-muted");
  if (descVar) {
    bindTextColorToVariable(description, descVar.id);
  }

  component.appendChild(description);

  return component;
}

/**
 * Generate Toast ComponentSet
 *
 * Creates a "Toast" ComponentSet with a single variant (no variants).
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateToastComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Generate the toast component
  var components: ComponentNode[] = [];

  // Track row labels: { y, text }
  var rowLabels: { y: number; text: string }[] = [];

  // Layout spacing
  var labelColumnWidth = 120;

  // Create the toast component
  var component = await createToastComponent();

  // Position component
  component.x = labelColumnWidth;
  component.y = 0;

  // Record row label
  rowLabels.push({
    y: 0,
    text: "Toast",
  });

  components.push(component);

  // Combine into ComponentSet (even with single variant for consistency)
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Toast";
  componentSet.description =
    "Toast notification component. " +
    "Use for transient messages, confirmations, and alerts.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height;

  // Create light mode section
  var lightSection = createModeSection(page, "Toast", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "Toast", "dark");
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

  console.log("Generated Toast ComponentSet (light + dark)");

  return startY + totalHeight + SECTION_GAP;
}
