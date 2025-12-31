/**
 * Dialog Component Generator
 *
 * Generates a Dialog ComponentSet in Figma that matches
 * the Dialog component props:
 *
 * - size: sm, base, lg, xl
 *
 * The Dialog has:
 * - Header with title and close button (X icon)
 * - Description text
 * - Action buttons (Cancel + Primary)
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/dialog/dialog.tsx
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
import registry from "../../../../ai/component-registry.json";

/**
 * Extract props from registry
 */
var dialogProps = (registry as any).components.Dialog.props;
var sizeProp = dialogProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Section padding for component display
 */
var SECTION_PADDING = 48;

/**
 * Gap between sections on the page
 */
var SECTION_GAP = 160;

/**
 * Size values from registry
 */
var SIZE_VALUES = sizeProp.values;

/**
 * Size-specific configuration
 * Maps size to width, title font size, description font size, padding
 */
var SIZE_CONFIG: Record<
  string,
  {
    width: number;
    titleSize: number;
    titleWeight: number;
    descSize: number;
    padding: number;
    gap: number;
    iconSize: "sm" | "base" | "lg";
    buttonSize: "sm" | "base";
  }
> = {
  sm: {
    width: 350,
    titleSize: 20,
    titleWeight: 700,
    descSize: 16,
    padding: 16,
    gap: 8,
    iconSize: "sm",
    buttonSize: "sm",
  },
  base: {
    width: 384, // min-w-96 = 24rem = 384px
    titleSize: 20,
    titleWeight: 700,
    descSize: 16,
    padding: 24,
    gap: 16,
    iconSize: "base",
    buttonSize: "base",
  },
  lg: {
    width: 512, // min-w-[32rem] = 512px
    titleSize: 25,
    titleWeight: 700,
    descSize: 18,
    padding: 24,
    gap: 16,
    iconSize: "base",
    buttonSize: "base",
  },
  xl: {
    width: 768, // min-w-[48rem] = 768px
    titleSize: 25,
    titleWeight: 700,
    descSize: 18,
    padding: 24,
    gap: 16,
    iconSize: "base",
    buttonSize: "base",
  },
};

/**
 * Create a button frame for dialog actions
 *
 * @param label - Button label text
 * @param isPrimary - Whether this is the primary action button
 * @param size - Button size (sm or base)
 * @returns FrameNode for the button
 */
async function createButton(
  label: string,
  isPrimary: boolean,
  size: "sm" | "base",
): Promise<FrameNode> {
  var button = figma.createFrame();
  button.name = isPrimary ? "Primary Button" : "Secondary Button";
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.primaryAxisSizingMode = "AUTO";
  button.counterAxisSizingMode = "AUTO";

  // Size-specific dimensions
  if (size === "sm") {
    button.paddingLeft = 12;
    button.paddingRight = 12;
    button.paddingTop = 8;
    button.paddingBottom = 8;
    button.minWidth = 70;
  } else {
    button.paddingLeft = 16;
    button.paddingRight = 16;
    button.paddingTop = 8;
    button.paddingBottom = 8;
    button.minWidth = 100;
  }

  button.itemSpacing = size === "sm" ? 4 : 8;
  button.cornerRadius = BORDER_RADIUS.md;

  if (isPrimary) {
    // Primary button: bg-primary text-white
    var primaryBgVar = getVariableByName("color-primary");
    if (primaryBgVar) {
      bindFillToVariable(button, primaryBgVar.id);
    }
  } else {
    // Secondary button: bg-transparent border-border
    button.fills = [];
    var borderVar = getVariableByName("color-border");
    if (borderVar) {
      bindStrokeToVariable(button, borderVar.id, 1);
    }
  }

  // Create button label
  var fontSize = size === "sm" ? 14 : 16;
  var buttonLabel = await createTextNode(label, fontSize, 600);
  buttonLabel.name = "Label";
  buttonLabel.textAutoResize = "WIDTH_AND_HEIGHT";

  if (isPrimary) {
    // White text for primary
    buttonLabel.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  } else {
    // text-surface for secondary
    var textVar = getVariableByName("text-color-surface");
    if (textVar) {
      bindTextColorToVariable(buttonLabel, textVar.id);
    }
  }

  button.appendChild(buttonLabel);
  return button;
}

/**
 * Create a single Dialog component variant
 *
 * @param size - Size variant (sm, base, lg, xl)
 * @returns ComponentNode for the dialog
 */
async function createDialogComponent(size: string): Promise<ComponentNode> {
  // Get size config
  var config = SIZE_CONFIG[size] || SIZE_CONFIG["base"];

  // Create component
  var component = figma.createComponent();
  component.name = "size=" + size;
  component.description =
    sizeProp.descriptions[size] || "Dialog " + size + " variant";

  // Set up vertical auto-layout
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(config.width, 100); // Height will auto-adjust
  component.itemSpacing = config.gap;
  component.paddingLeft = config.padding;
  component.paddingRight = config.padding;
  component.paddingTop = config.padding;
  component.paddingBottom = config.padding;
  component.cornerRadius = 12; // rounded-xl = 12px

  // Apply background fill (bg-surface)
  var bgVar = getVariableByName("color-surface");
  if (bgVar) {
    bindFillToVariable(component, bgVar.id);
  }

  // Apply shadow effect
  component.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.16 },
      offset: { x: 0, y: 8 },
      radius: 32,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  // Create header frame (title + close button)
  var header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.layoutAlign = "STRETCH";
  header.layoutGrow = 0;
  header.fills = [];
  header.itemSpacing = 8;

  // Create title text
  var title = await createTextNode(
    "Dialog Title",
    config.titleSize,
    config.titleWeight,
  );
  title.name = "Title";
  title.textAutoResize = "WIDTH_AND_HEIGHT";
  title.layoutGrow = 1;

  // Apply title text color (text-surface - bold)
  var titleVar = getVariableByName("text-color-surface");
  if (titleVar) {
    bindTextColorToVariable(title, titleVar.id);
  }

  header.appendChild(title);

  // Create close button (X icon)
  var closeIconName = "ph-x";
  var closeIcon = getButtonIcon(closeIconName, config.iconSize);
  closeIcon.name = "Close";

  // Apply icon color
  bindIconColor(closeIcon, "text-surface");

  header.appendChild(closeIcon);
  component.appendChild(header);

  // Create description text
  var description = await createTextNode(
    "This is a dialog description with some content explaining the purpose of this dialog.",
    config.descSize,
    400,
  );
  description.name = "Description";
  description.textAutoResize = "HEIGHT";
  description.layoutAlign = "STRETCH";
  description.resize(config.width - config.padding * 2, description.height);

  // Apply description text color (text-muted)
  var descVar = getVariableByName("text-color-muted");
  if (descVar) {
    bindTextColorToVariable(description, descVar.id);
  }

  component.appendChild(description);

  // Create actions frame (buttons)
  var actions = figma.createFrame();
  actions.name = "Actions";
  actions.layoutMode = "HORIZONTAL";
  actions.primaryAxisAlignItems = "MAX"; // Right-align buttons
  actions.counterAxisAlignItems = "CENTER";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = "AUTO";
  actions.layoutAlign = "STRETCH";
  actions.layoutGrow = 0;
  actions.fills = [];
  actions.itemSpacing = size === "sm" ? 8 : 12;

  // Create Cancel button (secondary)
  var cancelButton = await createButton("Cancel", false, config.buttonSize);
  actions.appendChild(cancelButton);

  // Create primary action button
  var primaryButton = await createButton("Confirm", true, config.buttonSize);
  actions.appendChild(primaryButton);

  component.appendChild(actions);

  return component;
}

/**
 * Generate Dialog ComponentSet with size property
 *
 * Creates a "Dialog" ComponentSet with all size variants:
 * - sm, base, lg, xl
 *
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateDialogComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Generate all size variants
  var components: ComponentNode[] = [];

  // Track row labels: { y, text }
  var rowLabels: { y: number; text: string }[] = [];

  // Layout spacing
  var componentGapY = 40;
  var labelColumnWidth = 120;

  // Track layout
  var yOffset = 0;
  var maxWidth = 0;

  // Generate components for each size
  for (var i = 0; i < SIZE_VALUES.length; i++) {
    var size = SIZE_VALUES[i];
    var component = await createDialogComponent(size);

    // Position component
    component.x = labelColumnWidth;
    component.y = yOffset;

    // Record row label
    rowLabels.push({
      y: yOffset,
      text: "size=" + size,
    });

    // Track max width
    if (component.width > maxWidth) {
      maxWidth = component.width;
    }

    // Update y offset for next component
    yOffset += component.height + componentGapY;

    components.push(component);
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Dialog";
  componentSet.description =
    "Dialog component with size variants. " +
    "Use for modal dialogs, confirmations, and forms.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height;

  // Create light mode section
  var lightSection = createModeSection(page, "Dialog", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "Dialog", "dark");
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

  console.log(
    "Generated Dialog ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var DIALOG_SIZE_VALUES = SIZE_VALUES;
