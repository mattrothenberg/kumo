import { logComplete } from "../logger";
/**
 * Dropdown Component Generator
 *
 * Generates a Dropdown ComponentSet in Figma that matches
 * the DropdownMenu component structure:
 *
 * - open: false, true
 * - variant: default, withIcons, withDanger, withGroups, withCheckbox, withShortcuts
 *
 * INTENTIONAL DIVERGENCE: Figma variants differ from React variants
 *
 * React Component Variants:
 * - variant: "default" | "danger"
 *
 * Figma Display Variants (for demonstration):
 * - default: Basic dropdown menu
 * - withIcons: Menu items with leading icons
 * - withDanger: Menu with destructive option
 * - withGroups: Menu with grouped sections
 * - withCheckbox: Menu with checkable items
 * - withShortcuts: Menu items with keyboard shortcuts
 *
 * The Figma variants show different visual configurations
 * for design exploration, not React component variants.
 *
 * The Dropdown has a Trigger (Button) and when open,
 * displays a dropdown panel with menu items.
 *
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/dropdown/dropdown.tsx
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
  createComponentInstance,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
  SECTION_LAYOUT,
  OPACITY,
  SPACING,
  FONT_SIZE,
  FALLBACK_VALUES,
} from "./shared";
import themeData from "../generated/theme-data.json";
import { getButtonIcon, bindIconColor } from "./icon-utils";
import registry from "../../../../ai/component-registry.json";

/**
 * Extract DropdownMenu component data from registry (for metadata)
 */
var dropdownComponent = registry.components.DropdownMenu;



/**
 * Open state values
 */
var OPEN_VALUES = [false, true];

/**
 * Variant types for different dropdown configurations
 */
var VARIANT_VALUES = [
  "default",
  "withIcons",
  "withDanger",
  "withGroups",
  "withCheckbox",
  "withShortcuts",
];

/**
 * Dropdown panel width
 */
var DROPDOWN_WIDTH = 200;

/**
 * Create a menu item frame
 */
async function createMenuItem(
  label: string,
  options?: {
    icon?: string;
    variant?: "default" | "danger";
    disabled?: boolean;
    shortcut?: string;
    highlighted?: boolean;
  },
): Promise<FrameNode> {
  var opts = options || {};
  var itemFrame = figma.createFrame();
  itemFrame.name = "Item: " + label;
  itemFrame.layoutMode = "HORIZONTAL";
  // Use SPACE_BETWEEN only when there's a shortcut, otherwise left-align
  itemFrame.primaryAxisAlignItems = opts.shortcut ? "SPACE_BETWEEN" : "MIN";
  itemFrame.counterAxisAlignItems = "CENTER";
  itemFrame.primaryAxisSizingMode = "FIXED";
  itemFrame.counterAxisSizingMode = "AUTO";
  itemFrame.layoutAlign = "STRETCH";
  itemFrame.resize(DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], themeData.tailwind.spacing.scale["8"]); // width - 12px, height 32px
  itemFrame.itemSpacing = SPACING.base; // gap-2 = 8px
  itemFrame.paddingLeft = SPACING.base; // px-2 = 8px
  itemFrame.paddingRight = SPACING.base;
  itemFrame.paddingTop = themeData.tailwind.spacing.scale["1.5"]; // py-1.5 = 6px
  itemFrame.paddingBottom = themeData.tailwind.spacing.scale["1.5"];
  itemFrame.cornerRadius = BORDER_RADIUS.md; // rounded-md = 6px
  itemFrame.fills = [];

  // Apply highlight background if highlighted
  if (opts.highlighted) {
    var highlightVar = getVariableByName("color-color-3");
    if (highlightVar) {
      bindFillToVariable(itemFrame, highlightVar.id);
    }
  }

  // Apply disabled opacity
  if (opts.disabled) {
    itemFrame.opacity = OPACITY.disabled;
  }

  // Left side container (icon + label)
  var leftContainer = figma.createFrame();
  leftContainer.name = "Left";
  leftContainer.layoutMode = "HORIZONTAL";
  leftContainer.primaryAxisSizingMode = "AUTO";
  leftContainer.counterAxisSizingMode = "AUTO";
  leftContainer.counterAxisAlignItems = "CENTER";
  leftContainer.itemSpacing = SPACING.base; // gap-2 = 8px
  leftContainer.fills = [];

  // Add icon if provided
  if (opts.icon) {
    var icon = getButtonIcon(opts.icon, "sm");
    icon.name = "Icon";
    var iconColorToken =
      opts.variant === "danger" ? "text-error" : "text-surface";
    bindIconColor(icon, iconColorToken);
    leftContainer.appendChild(icon);
  }

  // Create label text
  var labelText = await createTextNode(label, FONT_SIZE.base, FALLBACK_VALUES.fontWeight.normal);
  labelText.name = "Label";
  labelText.textAutoResize = "WIDTH_AND_HEIGHT";

  // Apply text color based on variant
  var textColorToken =
    opts.variant === "danger" ? "text-color-error" : "text-color-surface";
  var textVar = getVariableByName(textColorToken);
  if (textVar) {
    bindTextColorToVariable(labelText, textVar.id);
  }

  leftContainer.appendChild(labelText);
  itemFrame.appendChild(leftContainer);

  // Add shortcut if provided
  if (opts.shortcut) {
    var shortcutText = await createTextNode(opts.shortcut, FONT_SIZE.xs, FALLBACK_VALUES.fontWeight.normal);
    shortcutText.name = "Shortcut";
    shortcutText.textAutoResize = "WIDTH_AND_HEIGHT";
    shortcutText.opacity = OPACITY.shortcut;

    var shortcutVar = getVariableByName("text-color-muted");
    if (shortcutVar) {
      bindTextColorToVariable(shortcutText, shortcutVar.id);
    }

    itemFrame.appendChild(shortcutText);
  }

  return itemFrame;
}

/**
 * Create a checkbox menu item using the real Checkbox component
 */
async function createCheckboxItem(
  label: string,
  checked: boolean,
): Promise<FrameNode> {
  var itemFrame = figma.createFrame();
  itemFrame.name = "CheckboxItem: " + label;
  itemFrame.layoutMode = "HORIZONTAL";
  itemFrame.primaryAxisAlignItems = "MIN";
  itemFrame.counterAxisAlignItems = "CENTER";
  itemFrame.primaryAxisSizingMode = "FIXED";
  itemFrame.counterAxisSizingMode = "AUTO";
  itemFrame.layoutAlign = "STRETCH";
  itemFrame.resize(DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], themeData.tailwind.spacing.scale["8"]); // width - 12px, height 32px
  itemFrame.itemSpacing = SPACING.base; // gap-2 = 8px
  itemFrame.paddingLeft = SPACING.base; // px-2 = 8px
  itemFrame.paddingRight = SPACING.base;
  itemFrame.paddingTop = themeData.tailwind.spacing.scale["1.5"]; // py-1.5 = 6px
  itemFrame.paddingBottom = themeData.tailwind.spacing.scale["1.5"];
  itemFrame.cornerRadius = BORDER_RADIUS.md; // rounded-md = 6px
  itemFrame.fills = [];

  // Use the real Checkbox component from the ComponentSet
  // Checkbox variant format: "state=checked, variant=default, disabled=false"
  var checkboxState = checked ? "checked" : "unchecked";
  var checkboxInstance = createComponentInstance("Checkbox", {
    state: checkboxState,
    variant: "default",
    disabled: "false",
  });

  if (checkboxInstance) {
    checkboxInstance.name = "Checkbox";
    itemFrame.appendChild(checkboxInstance);
  } else {
    // Fallback: create a simple checkbox indicator if component not found
    var checkboxFrame = figma.createFrame();
    checkboxFrame.name = "Checkbox";
    checkboxFrame.resize(themeData.tailwind.spacing.scale["4"], themeData.tailwind.spacing.scale["4"]); // size-4 = 16px
    checkboxFrame.cornerRadius = BORDER_RADIUS.sm; // rounded = 4px

    if (checked) {
      var primaryVar = getVariableByName("color-primary");
      if (primaryVar) {
        bindFillToVariable(checkboxFrame, primaryVar.id);
      }
      var checkIcon = getButtonIcon("ph-check", "xs");
      checkIcon.name = "Check";
      bindIconColor(checkIcon, "text-white");
      checkboxFrame.layoutMode = "HORIZONTAL";
      checkboxFrame.primaryAxisAlignItems = "CENTER";
      checkboxFrame.counterAxisAlignItems = "CENTER";
      checkboxFrame.appendChild(checkIcon);
    } else {
      var borderVar = getVariableByName("color-border");
      if (borderVar) {
        bindStrokeToVariable(checkboxFrame, borderVar.id, 1);
      }
      checkboxFrame.fills = [];
    }

    itemFrame.appendChild(checkboxFrame);
  }

  // Create label text
  var labelText = await createTextNode(label, FONT_SIZE.base, FALLBACK_VALUES.fontWeight.normal);
  labelText.name = "Label";
  labelText.textAutoResize = "WIDTH_AND_HEIGHT";

  var textVar = getVariableByName("text-color-surface");
  if (textVar) {
    bindTextColorToVariable(labelText, textVar.id);
  }

  itemFrame.appendChild(labelText);

  return itemFrame;
}

/**
 * Create a separator line
 */
function createSeparator(): FrameNode {
  var separator = figma.createFrame();
  separator.name = "Separator";
  separator.layoutMode = "HORIZONTAL";
  separator.primaryAxisSizingMode = "FIXED";
  separator.counterAxisSizingMode = "FIXED";
  separator.layoutAlign = "STRETCH";
  separator.resize(DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], 9); // width - 12px
  separator.fills = [];

  // Create the line
  var line = figma.createFrame();
  line.name = "Line";
  line.layoutMode = "HORIZONTAL";
  line.primaryAxisSizingMode = "FIXED";
  line.counterAxisSizingMode = "FIXED";
  line.layoutAlign = "STRETCH";
  line.resize(DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], 1); // width - 12px

  var mutedVar = getVariableByName("color-muted");
  if (mutedVar) {
    bindFillToVariable(line, mutedVar.id);
  }

  separator.appendChild(line);
  separator.paddingTop = SPACING.xs; // py-1 = 4px
  separator.paddingBottom = SPACING.xs;

  return separator;
}

/**
 * Create a group label
 */
async function createGroupLabel(label: string): Promise<FrameNode> {
  var labelFrame = figma.createFrame();
  labelFrame.name = "GroupLabel: " + label;
  labelFrame.layoutMode = "HORIZONTAL";
  labelFrame.primaryAxisSizingMode = "FIXED";
  labelFrame.counterAxisSizingMode = "AUTO";
  labelFrame.layoutAlign = "STRETCH";
  labelFrame.resize(DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], themeData.tailwind.spacing.scale["6"]); // width - 12px, height 24px
  labelFrame.paddingLeft = SPACING.base; // px-2 = 8px
  labelFrame.paddingRight = SPACING.base;
  labelFrame.paddingTop = themeData.tailwind.spacing.scale["1.5"]; // py-1.5 = 6px
  labelFrame.paddingBottom = themeData.tailwind.spacing.scale["0.5"]; // py-0.5 = 2px
  labelFrame.fills = [];

  var labelText = await createTextNode(label, FONT_SIZE.base, FALLBACK_VALUES.fontWeight.semiBold);
  labelText.name = "Label";
  labelText.textAutoResize = "WIDTH_AND_HEIGHT";

  var textVar = getVariableByName("text-color-surface");
  if (textVar) {
    bindTextColorToVariable(labelText, textVar.id);
  }

  labelFrame.appendChild(labelText);

  return labelFrame;
}

/**
 * Create the trigger button
 */
async function createTriggerButton(label: string): Promise<FrameNode> {
  var button = figma.createFrame();
  button.name = "Trigger";
  button.layoutMode = "HORIZONTAL";
  button.primaryAxisAlignItems = "CENTER";
  button.counterAxisAlignItems = "CENTER";
  button.primaryAxisSizingMode = "AUTO";
  button.counterAxisSizingMode = "AUTO";
  button.itemSpacing = SPACING.base; // gap-2 = 8px
  button.paddingLeft = themeData.tailwind.spacing.scale["3"]; // px-3 = 12px
  button.paddingRight = themeData.tailwind.spacing.scale["3"];
  button.paddingTop = SPACING.base; // py-2 = 8px
  button.paddingBottom = SPACING.base;
  button.cornerRadius = BORDER_RADIUS.lg;

  // Apply secondary button styles
  var bgVar = getVariableByName("color-secondary");
  if (bgVar) {
    bindFillToVariable(button, bgVar.id);
  }

  var borderVar = getVariableByName("color-border");
  if (borderVar) {
    bindStrokeToVariable(button, borderVar.id, 1);
  }

  // Create button text
  var buttonText = await createTextNode(label, FONT_SIZE.base, FALLBACK_VALUES.fontWeight.medium);
  buttonText.name = "Label";
  buttonText.textAutoResize = "WIDTH_AND_HEIGHT";

  var textVar = getVariableByName("text-color-surface");
  if (textVar) {
    bindTextColorToVariable(buttonText, textVar.id);
  }

  button.appendChild(buttonText);

  return button;
}

/**
 * Create the dropdown panel with items based on variant
 */
async function createDropdownPanel(variant: string): Promise<FrameNode> {
  var panel = figma.createFrame();
  panel.name = "Dropdown";
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.counterAxisAlignItems = "MIN"; // Left-align children
  panel.resize(DROPDOWN_WIDTH, 100); // Height will auto-adjust
  panel.itemSpacing = themeData.tailwind.spacing.scale["0.5"]; // gap-0.5 = 2px
  panel.paddingLeft = themeData.tailwind.spacing.scale["1.5"]; // p-1.5 = 6px
  panel.paddingRight = themeData.tailwind.spacing.scale["1.5"];
  panel.paddingTop = themeData.tailwind.spacing.scale["1.5"];
  panel.paddingBottom = themeData.tailwind.spacing.scale["1.5"];
  panel.cornerRadius = BORDER_RADIUS.lg;

  // Apply background (bg-secondary)
  var bgVar = getVariableByName("color-secondary");
  if (bgVar) {
    bindFillToVariable(panel, bgVar.id);
  }

  // Apply border (ring ring-border)
  var borderVar = getVariableByName("color-border");
  if (borderVar) {
    bindStrokeToVariable(panel, borderVar.id, 1);
  }

  // Add items based on variant
  if (variant === "default") {
    var item1 = await createMenuItem("Item 1");
    var item2 = await createMenuItem("Item 2", { highlighted: true });
    var item3 = await createMenuItem("Item 3");
    panel.appendChild(item1);
    panel.appendChild(item2);
    panel.appendChild(item3);
  } else if (variant === "withIcons") {
    var editItem = await createMenuItem("Edit", { icon: "ph-pencil" });
    var copyItem = await createMenuItem("Copy", {
      icon: "ph-copy",
      highlighted: true,
    });
    var shareItem = await createMenuItem("Share", { icon: "ph-share" });
    var downloadItem = await createMenuItem("Download", {
      icon: "ph-download",
    });
    panel.appendChild(editItem);
    panel.appendChild(copyItem);
    panel.appendChild(shareItem);
    panel.appendChild(downloadItem);
  } else if (variant === "withDanger") {
    var editItem2 = await createMenuItem("Edit", { icon: "ph-pencil" });
    var duplicateItem = await createMenuItem("Duplicate", { icon: "ph-copy" });
    var sep1 = createSeparator();
    var deleteItem = await createMenuItem("Delete", {
      icon: "ph-trash",
      variant: "danger",
    });
    panel.appendChild(editItem2);
    panel.appendChild(duplicateItem);
    panel.appendChild(sep1);
    panel.appendChild(deleteItem);
  } else if (variant === "withGroups") {
    var accountLabel = await createGroupLabel("Account");
    var profileItem = await createMenuItem("Profile", { icon: "ph-user" });
    var settingsItem = await createMenuItem("Settings", { icon: "ph-gear" });
    var sep2 = createSeparator();
    var signOutItem = await createMenuItem("Sign out", {
      icon: "ph-sign-out",
      variant: "danger",
    });
    panel.appendChild(accountLabel);
    panel.appendChild(profileItem);
    panel.appendChild(settingsItem);
    panel.appendChild(sep2);
    panel.appendChild(signOutItem);
  } else if (variant === "withCheckbox") {
    var displayLabel = await createGroupLabel("Display");
    var sidebarItem = await createCheckboxItem("Show sidebar", true);
    var lineNumItem = await createCheckboxItem("Show line numbers", false);
    var wrapItem = await createCheckboxItem("Word wrap", true);
    panel.appendChild(displayLabel);
    panel.appendChild(sidebarItem);
    panel.appendChild(lineNumItem);
    panel.appendChild(wrapItem);
  } else if (variant === "withShortcuts") {
    var copyShortcut = await createMenuItem("Copy", {
      icon: "ph-copy",
      shortcut: "\u2318C",
    });
    var editShortcut = await createMenuItem("Edit", {
      icon: "ph-pencil",
      shortcut: "\u2318E",
      highlighted: true,
    });
    var sep3 = createSeparator();
    var deleteShortcut = await createMenuItem("Delete", {
      icon: "ph-trash",
      variant: "danger",
      shortcut: "\u2318\u232B",
    });
    panel.appendChild(copyShortcut);
    panel.appendChild(editShortcut);
    panel.appendChild(sep3);
    panel.appendChild(deleteShortcut);
  }

  return panel;
}

/**
 * Create a single Dropdown component variant
 */
async function createDropdownComponent(
  open: boolean,
  variant: string,
): Promise<ComponentNode> {
  var component = figma.createComponent();
  component.name = "open=" + open + ", variant=" + variant;
  component.description =
    "Dropdown " + variant + " " + (open ? "open" : "closed");

  // Set up vertical auto-layout
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = SPACING.xs; // gap-1 = 4px
  component.fills = [];

  // Create trigger button
  var triggerLabel =
    variant === "withCheckbox"
      ? "View Options"
      : variant === "withGroups"
        ? "User Menu"
        : variant === "withShortcuts"
          ? "Edit"
          : "Open Menu";
  var trigger = await createTriggerButton(triggerLabel);
  component.appendChild(trigger);

  // Create dropdown panel if open
  if (open) {
    var panel = await createDropdownPanel(variant);
    component.appendChild(panel);
  }

  return component;
}

/**
 * Generate Dropdown ComponentSet with open and variant properties
 *
 * Creates a "Dropdown" ComponentSet with all combinations of:
 * - open: false, true
 * - variant: default, withIcons, withDanger, withGroups, withCheckbox, withShortcuts
 *
 * Layout:
 * - Rows: variants
 * - Columns: open states
 *
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateDropdownComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Generate all combinations
  var components: ComponentNode[] = [];

  // Track row labels: { y, text }
  var rowLabels: { y: number; text: string }[] = [];

  // Track column headers: { x, text }
  var columnHeaders: { x: number; text: string }[] = [];

  // Layout spacing - using centralized constants
  var componentGapX = GRID_LAYOUT.componentGapX.standard;
  var componentGapY = GRID_LAYOUT.componentGapY.standard;
  var headerRowHeight = GRID_LAYOUT.headerRowHeight;
  var labelColumnWidth = GRID_LAYOUT.labelColumnWidth.medium;

  // Track layout by row (variant)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  // Rows = variants, Columns = open states
  for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
    var variant = VARIANT_VALUES[vi];
    rowComponents.set(vi, []);

    for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
      var open = OPEN_VALUES[oi];
      var component = await createDropdownComponent(open, variant);
      rowComponents.get(vi)!.push(component);
      components.push(component);
    }
  }

  // First pass: calculate max width per column and max height per row
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  var numColumns = OPEN_VALUES.length;

  for (var colIdx = 0; colIdx < numColumns; colIdx++) {
    var maxColWidth = 0;
    for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
      var row = rowComponents.get(rowIdx) || [];
      var comp = row[colIdx];
      if (comp && comp.width > maxColWidth) {
        maxColWidth = comp.width;
      }
    }
    columnWidths.push(maxColWidth);
  }

  for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
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

  for (var rowIdx = 0; rowIdx < VARIANT_VALUES.length; rowIdx++) {
    var row = rowComponents.get(rowIdx) || [];
    var xOffset = labelColumnWidth;
    var variantValue = VARIANT_VALUES[rowIdx];

    // Record row label
    rowLabels.push({
      y: yOffset,
      text: "variant=" + variantValue,
    });

    for (var colIdx = 0; colIdx < row.length; colIdx++) {
      var comp = row[colIdx];
      comp.x = xOffset;
      comp.y = yOffset;

      // Record column headers from first row
      if (rowIdx === 0) {
        var openVal = OPEN_VALUES[colIdx];
        columnHeaders.push({
          x: xOffset,
          text: "open=" + openVal,
        });
      }

      // Use consistent column width for positioning
      xOffset += columnWidths[colIdx] + componentGapX;
    }

    yOffset += rowHeights[rowIdx] + componentGapY;
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Dropdown";
  componentSet.description =
    "Dropdown menu component with trigger button and menu items. " +
    "Supports icons, danger variants, groups, checkboxes, and keyboard shortcuts.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(page, "Dropdown", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "Dropdown", "dark");
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
      SECTION_PADDING + label.y + GRID_LAYOUT.labelVerticalOffset.md,
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
      SECTION_PADDING + darkLabel.y + GRID_LAYOUT.labelVerticalOffset.md,
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
    "Generated Dropdown ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var DROPDOWN_OPEN_VALUES = OPEN_VALUES;
export var DROPDOWN_VARIANT_VALUES = VARIANT_VALUES;

// ============================================================================
// TESTABLE EXPORTS - Pure functions for testing (no Figma API calls)
// ============================================================================

/**
 * Get dropdown variant configuration
 * Returns the variants used for Figma display purposes
 */
export function getDropdownVariantConfig() {
  return {
    openValues: OPEN_VALUES,
    variantValues: VARIANT_VALUES,
    descriptions: {
      default: "Basic dropdown with simple menu items",
      withIcons: "Dropdown with icons for each menu item",
      withDanger: "Dropdown with destructive action item",
      withGroups: "Dropdown with grouped menu sections",
      withCheckbox: "Dropdown with checkbox menu items",
      withShortcuts: "Dropdown with keyboard shortcuts",
    },
  };
}

/**
 * Get dropdown panel dimensions
 */
export function getDropdownPanelDimensions() {
  return {
    width: DROPDOWN_WIDTH,
    itemHeight: themeData.tailwind.spacing.scale["8"], // h-8 = 32px
    padding: themeData.tailwind.spacing.scale["1.5"], // p-1.5 = 6px
    itemSpacing: themeData.tailwind.spacing.scale["0.5"], // gap-0.5 = 2px
    cornerRadius: BORDER_RADIUS.lg,
  };
}

/**
 * Get menu item layout properties
 */
export function getMenuItemLayout(hasShortcut: boolean) {
  return {
    mode: "HORIZONTAL",
    alignment: hasShortcut ? "SPACE_BETWEEN" : "MIN",
    width: DROPDOWN_WIDTH - themeData.tailwind.spacing.scale["3"], // width - 12px
    height: themeData.tailwind.spacing.scale["8"], // h-8 = 32px
    paddingX: SPACING.base, // px-2 = 8px
    paddingY: themeData.tailwind.spacing.scale["1.5"], // py-1.5 = 6px
    itemSpacing: SPACING.base, // gap-2 = 8px
    cornerRadius: BORDER_RADIUS.md, // rounded-md = 6px
  };
}

/**
 * Get dropdown registry metadata
 *
 * Returns component metadata from component-registry.json.
 * Note: React component has simple variants (default, danger),
 * but generator creates Figma-specific display variants.
 */
export function getDropdownRegistryData() {
  return {
    component: dropdownComponent.name,
    description: dropdownComponent.description,
    reactVariants: (
      dropdownComponent.props.variant as { values: string[]; default: string }
    ).values,
    colors: dropdownComponent.colors,
    note: "Generator uses Figma-specific display variants (withIcons, withDanger, etc.) for demonstration purposes",
  };
}

/**
 * Get all dropdown variant data
 * Returns complete intermediate data structure for snapshot testing
 */
export function getAllDropdownVariantData() {
  var config = getDropdownVariantConfig();
  var panelDims = getDropdownPanelDimensions();
  var descriptions = config.descriptions as Record<string, string>;

  return {
    config: config,
    panelDimensions: panelDims,
    menuItems: {
      withShortcut: getMenuItemLayout(true),
      withoutShortcut: getMenuItemLayout(false),
    },
    variants: config.variantValues.map(function (variant) {
      return {
        variant: variant,
        description: descriptions[variant] || "",
        openStates: config.openValues,
      };
    }),
    registryData: getDropdownRegistryData(),
  };
}
