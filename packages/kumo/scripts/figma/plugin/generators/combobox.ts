/**
 * Combobox Component Generator
 *
 * Generates a Combobox ComponentSet in Figma that matches
 * the Combobox component props:
 *
 * - variant: default, withLabel, withError
 * - open: false, true
 * - state: default, focus, disabled
 *
 * NOTE: The React component has no variants prop, but the generator creates
 * Figma-specific display variants (default, withLabel, withError) to showcase
 * different Field wrapper configurations in Figma.
 *
 * The Combobox has a TriggerInput (input-like field) and when open,
 * displays a dropdown panel with sample items.
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/combobox/combobox.tsx
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
  SECTION_LAYOUT,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";
import registry from "../../../../ai/component-registry.json";

/**
 * Extract Combobox component data from registry (for metadata)
 */
var comboboxComponent = registry.components.Combobox;

/**
 * Base styles for TriggerInput container
 * "bg-secondary ring ring-border rounded-lg"
 */
var TRIGGER_BASE_STYLES = "bg-secondary ring ring-border rounded-lg";

/**
 * Dropdown panel styles
 * "bg-surface border border-border"
 */
var DROPDOWN_PANEL_STYLES = "bg-surface border border-border";



/**
 * Variant types
 */
var VARIANT_VALUES = ["default", "withLabel", "withError"];

/**
 * Open state values
 */
var OPEN_VALUES = [false, true];

/**
 * Interaction state values
 */
var STATE_VALUES = ["default", "focus", "disabled"];

/**
 * State-specific style overrides for the trigger
 */
var STATE_STYLES: Record<
  string,
  {
    ringVariable?: string;
    opacity?: number;
  }
> = {
  default: {
    ringVariable: "color-border",
  },
  focus: {
    ringVariable: "color-active",
  },
  disabled: {
    ringVariable: "color-border",
    opacity: 0.5,
  },
};

/**
 * Variant-specific configuration
 */
var VARIANT_CONFIG: Record<
  string,
  {
    label?: string;
    description?: string;
    errorMessage?: string;
    useErrorRing?: boolean;
  }
> = {
  default: {},
  withLabel: {
    label: "Country",
    description: "Select your country of residence",
  },
  withError: {
    label: "Subscription Plan",
    errorMessage: "Please select a plan to continue",
    useErrorRing: true,
  },
};

/**
 * ========================================
 * TESTABLE EXPORTS - Pure functions for testing
 * ========================================
 */

/**
 * Get variant configuration from generator constants
 * @returns Object with variants, open states, interaction states, and configuration
 */
export function getComboboxVariantConfig() {
  return {
    variants: VARIANT_VALUES,
    openStates: OPEN_VALUES,
    interactionStates: STATE_VALUES,
    variantConfig: VARIANT_CONFIG,
    stateStyles: STATE_STYLES,
  };
}

/**
 * Get parsed base styles for TriggerInput
 * @returns Parsed Tailwind classes for trigger base styles
 */
export function getComboboxParsedTriggerStyles() {
  return {
    raw: TRIGGER_BASE_STYLES,
    parsed: parseTailwindClasses(TRIGGER_BASE_STYLES),
  };
}

/**
 * Get parsed dropdown panel styles
 * @returns Parsed Tailwind classes for dropdown panel
 */
export function getComboboxParsedDropdownStyles() {
  return {
    raw: DROPDOWN_PANEL_STYLES,
    parsed: parseTailwindClasses(DROPDOWN_PANEL_STYLES),
  };
}

/**
 * Get computed layout data for a specific variant + state combination
 * @param variant - Variant type (default, withLabel, withError)
 * @param open - Whether dropdown is open
 * @param state - Interaction state (default, focus, disabled)
 * @returns Object with computed layout properties
 */
export function getComboboxLayoutData(
  variant: string,
  open: boolean,
  state: string,
) {
  var config = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];
  var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

  return {
    variant,
    open,
    state,
    hasLabel: !!config.label,
    hasDescription: !!config.description,
    hasError: !!config.errorMessage,
    ringVariable: config.useErrorRing
      ? "color-error"
      : stateStyle.ringVariable || "color-border",
    opacity: stateStyle.opacity,
    trigger: {
      width: 280,
      height: 36,
      borderRadius: BORDER_RADIUS.lg,
      paddingX: 12,
      itemSpacing: 8,
    },
    dropdown: open
      ? {
          width: 280,
          height: 120,
          borderRadius: BORDER_RADIUS.lg,
          paddingY: 4,
          itemHeight: 32,
          itemPaddingX: 12,
          itemPaddingY: 8,
        }
      : null,
  };
}

/**
 * Get all combobox variant data (complete intermediate data structure)
 * @returns Complete data structure for all variants
 */
/**
 * Get combobox registry metadata
 *
 * Returns component metadata from component-registry.json.
 * Note: React component has no variants prop, but generator creates
 * Figma-specific display variants (default, withLabel, withError).
 */
export function getComboboxRegistryData() {
  return {
    component: comboboxComponent.name,
    description: comboboxComponent.description,
    colors: comboboxComponent.colors,
    note: "Generator uses Figma-specific display variants (default, withLabel, withError) to showcase different Field wrapper configurations",
  };
}

export function getAllComboboxVariantData() {
  var triggerStyles = getComboboxParsedTriggerStyles();
  var dropdownStyles = getComboboxParsedDropdownStyles();
  var config = getComboboxVariantConfig();

  var variants: any[] = [];

  for (var vi = 0; vi < config.variants.length; vi++) {
    var variant = config.variants[vi];
    for (var oi = 0; oi < config.openStates.length; oi++) {
      var open = config.openStates[oi];
      for (var si = 0; si < config.interactionStates.length; si++) {
        var state = config.interactionStates[si];
        variants.push(getComboboxLayoutData(variant, open, state));
      }
    }
  }

  return {
    triggerStyles,
    dropdownStyles,
    config,
    variants,
    registryData: getComboboxRegistryData(),
  };
}

/**
 * ========================================
 * END TESTABLE EXPORTS
 * ========================================
 */

/**
 * Create a single Combobox component variant
 *
 * @param variant - Variant type (default, withLabel, withError)
 * @param open - Whether the dropdown is open
 * @param state - Interaction state (default, focus, disabled)
 * @returns ComponentNode for the combobox
 */
async function createComboboxComponent(
  variant: string,
  open: boolean,
  state: string,
): Promise<ComponentNode> {
  // Parse base styles (for potential future use)
  var _triggerStyles = parseTailwindClasses(TRIGGER_BASE_STYLES);
  var _dropdownStyles = parseTailwindClasses(DROPDOWN_PANEL_STYLES);

  // Get variant config
  var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];

  // Create component
  var component = figma.createComponent();
  component.name = "variant=" + variant + ", open=" + open + ", state=" + state;
  component.description =
    "Combobox " +
    variant +
    " " +
    (open ? "open" : "closed") +
    " in " +
    state +
    " state";

  // Set up vertical auto-layout for the entire component
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "MIN"; // Left-align all children (label, trigger, dropdown)
  component.itemSpacing = 4; // Small gap between label and trigger, trigger and description/error
  component.fills = [];

  // Get state-specific styles
  var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

  // Apply disabled opacity to entire component
  if (stateStyle.opacity !== undefined) {
    component.opacity = stateStyle.opacity;
  }

  // Create label if needed
  if (variantConfig.label) {
    var labelText = await createTextNode(variantConfig.label, 14, 500);
    labelText.name = "Label";
    labelText.textAutoResize = "WIDTH_AND_HEIGHT";

    // Apply label text color (text-label)
    var labelVar = getVariableByName("text-color-label");
    if (labelVar) {
      bindTextColorToVariable(labelText, labelVar.id);
    }

    component.appendChild(labelText);
  }

  // Create trigger input frame
  var trigger = figma.createFrame();
  trigger.name = "TriggerInput";
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN"; // Text left, icon right
  trigger.counterAxisAlignItems = "CENTER";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "FIXED";
  trigger.resize(280, 36); // h-9 = 36px
  trigger.itemSpacing = 8;
  trigger.paddingLeft = 12;
  trigger.paddingRight = 12;
  trigger.paddingTop = 0;
  trigger.paddingBottom = 0;
  trigger.cornerRadius = BORDER_RADIUS.lg;

  // Apply background fill (bg-secondary)
  var bgVar = getVariableByName("color-secondary");
  if (bgVar) {
    bindFillToVariable(trigger, bgVar.id);
  }

  // Apply ring (stroke) - use error ring if error variant
  var ringVarName = variantConfig.useErrorRing
    ? "color-error"
    : stateStyle.ringVariable || "color-border";
  var ringVar = getVariableByName(ringVarName);
  if (ringVar) {
    bindStrokeToVariable(trigger, ringVar.id, 1);
  }

  // Create placeholder text
  var placeholderText = await createTextNode("Select item...", 16, 400);
  placeholderText.name = "Placeholder";
  placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";

  // Apply text color (text-muted for placeholder)
  var mutedVar = getVariableByName("text-color-muted");
  if (mutedVar) {
    bindTextColorToVariable(placeholderText, mutedVar.id);
  }

  trigger.appendChild(placeholderText);

  // Create chevron down icon
  var chevronIconName = "ph-caret-down";
  var chevron = getButtonIcon(chevronIconName, "sm");
  chevron.name = "Chevron";

  // Rotate chevron 180° when open (pointing up)
  if (open) {
    chevron.rotation = 180;
  }

  // Apply icon color based on state
  var iconColorToken = state === "disabled" ? "text-disabled" : "text-surface";
  bindIconColor(chevron, iconColorToken);

  trigger.appendChild(chevron);
  component.appendChild(trigger);

  // Create description or error message if needed
  if (variantConfig.description) {
    var descText = await createTextNode(variantConfig.description, 12, 400);
    descText.name = "Description";
    descText.textAutoResize = "WIDTH_AND_HEIGHT";

    // Apply description text color (text-muted)
    var descVar = getVariableByName("text-color-muted");
    if (descVar) {
      bindTextColorToVariable(descText, descVar.id);
    }

    component.appendChild(descText);
  }

  if (variantConfig.errorMessage) {
    var errorText = await createTextNode(variantConfig.errorMessage, 12, 400);
    errorText.name = "Error";
    errorText.textAutoResize = "WIDTH_AND_HEIGHT";

    // Apply error text color (text-error)
    var errorVar = getVariableByName("text-color-error");
    if (errorVar) {
      bindTextColorToVariable(errorText, errorVar.id);
    }

    component.appendChild(errorText);
  }

  // Create dropdown panel (only when open)
  if (open) {
    var dropdownPanel = figma.createFrame();
    dropdownPanel.name = "Dropdown";
    dropdownPanel.layoutMode = "VERTICAL";
    dropdownPanel.primaryAxisSizingMode = "FIXED";
    dropdownPanel.counterAxisSizingMode = "AUTO";
    dropdownPanel.resize(280, 120); // Match trigger width
    dropdownPanel.itemSpacing = 0;
    dropdownPanel.paddingLeft = 0;
    dropdownPanel.paddingRight = 0;
    dropdownPanel.paddingTop = 4;
    dropdownPanel.paddingBottom = 4;
    dropdownPanel.cornerRadius = BORDER_RADIUS.lg;

    // Apply background fill (bg-secondary) - matches Content/Popup in combobox.tsx
    var dropdownBgVar = getVariableByName("color-secondary");
    if (dropdownBgVar) {
      bindFillToVariable(dropdownPanel, dropdownBgVar.id);
    }

    // Apply border
    var borderVar = getVariableByName("color-border");
    if (borderVar) {
      bindStrokeToVariable(dropdownPanel, borderVar.id, 1);
    }

    // Create 3 sample items
    var itemLabels = ["Option 1", "Option 2", "Option 3"];
    for (var i = 0; i < itemLabels.length; i++) {
      var itemFrame = figma.createFrame();
      itemFrame.name = "Item " + (i + 1);
      itemFrame.layoutMode = "HORIZONTAL";
      itemFrame.primaryAxisAlignItems = "MIN"; // Text left-aligned
      itemFrame.counterAxisAlignItems = "CENTER";
      itemFrame.primaryAxisSizingMode = "FIXED";
      itemFrame.counterAxisSizingMode = "AUTO";
      itemFrame.resize(280, 32);
      itemFrame.itemSpacing = 8;
      itemFrame.paddingLeft = 12;
      itemFrame.paddingRight = 12;
      itemFrame.paddingTop = 8;
      itemFrame.paddingBottom = 8;
      itemFrame.fills = [];

      // Highlight second item (selected/hover state) - matches data-highlighted:bg-color-3
      if (i === 1) {
        var accentVar = getVariableByName("color-color-3");
        if (accentVar) {
          bindFillToVariable(itemFrame, accentVar.id);
        }
      }

      // Create item text
      var itemText = await createTextNode(itemLabels[i], 14, 400);
      itemText.name = "Label";
      itemText.textAutoResize = "WIDTH_AND_HEIGHT";

      // Apply text color
      var textVar = getVariableByName("text-color-surface");
      if (textVar) {
        bindTextColorToVariable(itemText, textVar.id);
      }

      itemFrame.appendChild(itemText);
      dropdownPanel.appendChild(itemFrame);
    }

    component.appendChild(dropdownPanel);
  }

  return component;
}

/**
 * Generate Combobox ComponentSet with variant, open, and state properties
 *
 * Creates a "Combobox" ComponentSet with all combinations of:
 * - variant: default, withLabel, withError
 * - open: false, true
 * - state: default, focus, disabled
 *
 * Layout:
 * - Rows: variant (default, withLabel, withError)
 * - Columns: open × state combinations (6 columns total)
 *
 * Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateComboboxComponents(
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
  var labelColumnWidth = 150; // Wider for variant labels

  // Track layout by row (variant)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  // Rows = variants, Columns = open × state
  for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
    var variant = VARIANT_VALUES[vi];
    rowComponents.set(vi, []);

    for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
      var open = OPEN_VALUES[oi];

      for (var si = 0; si < STATE_VALUES.length; si++) {
        var state = STATE_VALUES[si];
        var component = await createComboboxComponent(variant, open, state);
        rowComponents.get(vi)!.push(component);
        components.push(component);
      }
    }
  }

  // First pass: calculate max width per column and max height per row
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  var numColumns = OPEN_VALUES.length * STATE_VALUES.length;

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
        var openIdx = Math.floor(colIdx / STATE_VALUES.length);
        var stateIdx = colIdx % STATE_VALUES.length;
        var openVal = OPEN_VALUES[openIdx];
        var stateVal = STATE_VALUES[stateIdx];
        columnHeaders.push({
          x: xOffset,
          text: "open=" + openVal + ", state=" + stateVal,
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
  componentSet.name = "Combobox";
  componentSet.description =
    "Combobox component with variant, open, and state properties. " +
    "Use for searchable select dropdowns with filtering.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(componentsPage, "Combobox", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(componentsPage, "Combobox", "dark");
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
    "Generated Combobox ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var COMBOBOX_VARIANT_VALUES = VARIANT_VALUES;
export var COMBOBOX_OPEN_VALUES = OPEN_VALUES;
export var COMBOBOX_STATE_VALUES = STATE_VALUES;
