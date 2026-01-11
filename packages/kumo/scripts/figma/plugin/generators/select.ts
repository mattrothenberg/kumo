/**
 * Select Component Generator
 *
 * Generates a Select ComponentSet in Figma that matches
 * the Select component props:
 *
 * - variant: default, withLabel, withError
 * - open: false, true
 * - state: default, focus, disabled, loading
 *
 * The Select has a trigger button with caret icon and when open,
 * displays a dropdown panel with sample options.
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/select/select.tsx
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
  OPACITY,
  COLORS,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";
import { logComplete } from "../logger";
import registry from "../../../../ai/component-registry.json";

// Extract Select component data from registry
var selectRegistry = registry.components.Select;
var selectRegistryStyling = (registry.components.Select as any).styling;

// Styling configuration - reads from registry with semantic token additions
var selectStyling = {
  trigger: {
    height: selectRegistryStyling?.trigger?.height ?? 36, // h-9
    paddingX: selectRegistryStyling?.trigger?.paddingX ?? 12, // px-3
    borderRadius: selectRegistryStyling?.trigger?.borderRadius ?? 8, // rounded-lg
    background: "color-secondary",
    text: "text-color-surface",
    ring: "color-border",
    fontSize: selectRegistryStyling?.trigger?.fontSize ?? 16, // text-base
    fontWeight: selectRegistryStyling?.trigger?.fontWeight ?? 400, // font-normal
  },
  stateTokens: {
    focus: { ring: "color-active" },
    disabled: { opacity: OPACITY.disabled },
  },
  popup: {
    background: "color-secondary",
    ring: "color-border",
    borderRadius: selectRegistryStyling?.popup?.borderRadius ?? 8, // rounded-lg
    padding: selectRegistryStyling?.popup?.padding ?? 6, // p-1.5
    width: selectRegistryStyling?.popup?.width ?? 280,
  },
  option: {
    paddingX: selectRegistryStyling?.option?.paddingX ?? 8, // px-2
    paddingY: selectRegistryStyling?.option?.paddingY ?? 6, // py-1.5
    borderRadius: selectRegistryStyling?.option?.borderRadius ?? 4, // rounded
    fontSize: selectRegistryStyling?.option?.fontSize ?? 16, // text-base
    highlightBackground: "color-color-3",
  },
};



/**
 * Variant types (generator-specific display variants)
 * Note: These are presentation variants for Figma, not React component variants
 */
var VARIANT_VALUES = ["default", "withLabel", "withError"];

/**
 * Open state values
 */
var OPEN_VALUES = [false, true];

/**
 * Interaction state values
 */
var STATE_VALUES = ["default", "focus", "disabled", "loading"];

/**
 * State-specific style overrides for the trigger
 * Reads from selectStyling (source of truth)
 */
var STATE_STYLES: Record<
  string,
  {
    ringVariable?: string;
    opacity?: number;
  }
> = {
  default: {
    ringVariable: selectStyling.trigger.ring,
  },
  focus: {
    ringVariable: selectStyling.stateTokens.focus.ring,
  },
  disabled: {
    ringVariable: selectStyling.trigger.ring,
    opacity: selectStyling.stateTokens.disabled.opacity,
  },
  loading: {
    ringVariable: selectStyling.trigger.ring,
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
    description: "Choose your country of residence",
  },
  withError: {
    label: "Account Type",
    errorMessage: "Please select an account type to continue",
    useErrorRing: true,
  },
};

/**
 * Create a skeleton loading line (matches SkeletonLine component)
 */
function createSkeletonLine(width: number, height: number): FrameNode {
  var skeleton = figma.createFrame();
  skeleton.name = "SkeletonLine";
  skeleton.resize(width, height);
  skeleton.cornerRadius = 4;

  // Use a subtle background color for skeleton
  var bgVar = getVariableByName("color-color-3");
  if (bgVar) {
    bindFillToVariable(skeleton, bgVar.id);
  } else {
    skeleton.fills = [{ type: "SOLID", color: COLORS.skeletonGray }];
  }

  return skeleton;
}

/**
 * Create a single Select component variant
 *
 * @param variant - Variant type (default, withLabel, withError)
 * @param open - Whether the dropdown is open
 * @param state - Interaction state (default, focus, disabled, loading)
 * @returns ComponentNode for the select
 */
async function createSelectComponent(
  variant: string,
  open: boolean,
  state: string,
): Promise<ComponentNode> {
  // Get variant config
  var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];

  // Create component
  var component = figma.createComponent();
  component.name = "variant=" + variant + ", open=" + open + ", state=" + state;
  component.description =
    "Select " +
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
  component.counterAxisAlignItems = "MIN"; // Left-align all children
  component.itemSpacing = 4;
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

  // Create trigger button frame (matches buttonVariants() styling)
  var trigger = figma.createFrame();
  trigger.name = "Trigger";
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN"; // Text left, icon right
  trigger.counterAxisAlignItems = "CENTER";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "FIXED";
  trigger.resize(280, selectStyling.trigger.height);
  trigger.itemSpacing = 8;
  trigger.paddingLeft = selectStyling.trigger.paddingX;
  trigger.paddingRight = selectStyling.trigger.paddingX;
  trigger.paddingTop = 0;
  trigger.paddingBottom = 0;
  trigger.cornerRadius = selectStyling.trigger.borderRadius;

  // Apply background fill (from selectStyling)
  var bgVar = getVariableByName(selectStyling.trigger.background);
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

  // Create content based on state
  if (state === "loading") {
    // Show skeleton line when loading
    var skeleton = createSkeletonLine(128, 16);
    trigger.appendChild(skeleton);
  } else {
    // Create placeholder/value text (from selectStyling)
    var placeholderText = await createTextNode(
      "Select an option",
      selectStyling.trigger.fontSize,
      selectStyling.trigger.fontWeight,
    );
    placeholderText.name = "Value";
    placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";

    // Apply text color (from selectStyling)
    var textVar = getVariableByName(selectStyling.trigger.text);
    if (textVar) {
      bindTextColorToVariable(placeholderText, textVar.id);
    }

    trigger.appendChild(placeholderText);
  }

  // Create caret up/down icon
  var caretIconName = "ph-caret-up-down";
  var caret = getButtonIcon(caretIconName, "sm");
  caret.name = "Caret";

  // Apply icon color based on state
  var iconColorToken = state === "disabled" ? "text-disabled" : "text-surface";
  bindIconColor(caret, iconColorToken);

  trigger.appendChild(caret);
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

  // Create dropdown panel (only when open and not loading/disabled)
  if (open && state !== "loading" && state !== "disabled") {
    var dropdownPanel = figma.createFrame();
    dropdownPanel.name = "Popup";
    dropdownPanel.layoutMode = "VERTICAL";
    dropdownPanel.primaryAxisSizingMode = "AUTO";
    dropdownPanel.counterAxisSizingMode = "FIXED";
    dropdownPanel.resize(280, 1); // Width matches trigger, height auto
    dropdownPanel.itemSpacing = 0;
    dropdownPanel.paddingLeft = selectStyling.popup.padding;
    dropdownPanel.paddingRight = selectStyling.popup.padding;
    dropdownPanel.paddingTop = selectStyling.popup.padding;
    dropdownPanel.paddingBottom = selectStyling.popup.padding;
    dropdownPanel.cornerRadius = selectStyling.popup.borderRadius;

    // Apply background fill (from selectStyling)
    var dropdownBgVar = getVariableByName(selectStyling.popup.background);
    if (dropdownBgVar) {
      bindFillToVariable(dropdownPanel, dropdownBgVar.id);
    }

    // Apply border (from selectStyling)
    var borderVar = getVariableByName(selectStyling.popup.ring);
    if (borderVar) {
      bindStrokeToVariable(dropdownPanel, borderVar.id, 1);
    }

    // Create 3 sample options
    var optionLabels = ["Option 1", "Option 2", "Option 3"];
    for (var i = 0; i < optionLabels.length; i++) {
      var optionFrame = figma.createFrame();
      optionFrame.name = "Option " + (i + 1);
      optionFrame.layoutMode = "HORIZONTAL";
      optionFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
      optionFrame.counterAxisAlignItems = "CENTER";
      optionFrame.primaryAxisSizingMode = "FIXED";
      optionFrame.counterAxisSizingMode = "AUTO";
      optionFrame.resize(268, 1); // Width matches dropdown minus padding
      optionFrame.itemSpacing = 8;
      optionFrame.paddingLeft = selectStyling.option.paddingX;
      optionFrame.paddingRight = selectStyling.option.paddingX;
      optionFrame.paddingTop = selectStyling.option.paddingY;
      optionFrame.paddingBottom = selectStyling.option.paddingY;
      optionFrame.cornerRadius = selectStyling.option.borderRadius;
      optionFrame.fills = [];

      // Highlight second item (selected/hover state) - from selectStyling
      if (i === 1) {
        var accentVar = getVariableByName(selectStyling.option.highlightBackground);
        if (accentVar) {
          bindFillToVariable(optionFrame, accentVar.id);
        }
      }

      // Create option text (from selectStyling)
      var optionText = await createTextNode(
        optionLabels[i],
        selectStyling.option.fontSize,
        400,
      );
      optionText.name = "Label";
      optionText.textAutoResize = "WIDTH_AND_HEIGHT";

      // Apply text color
      var optionTextVar = getVariableByName("text-color-surface");
      if (optionTextVar) {
        bindTextColorToVariable(optionText, optionTextVar.id);
      }

      optionFrame.appendChild(optionText);

      // Add check icon to selected item (second item)
      if (i === 1) {
        var checkIcon = getButtonIcon("ph-check", "sm");
        checkIcon.name = "Check";
        bindIconColor(checkIcon, "text-surface");
        optionFrame.appendChild(checkIcon);
      }

      dropdownPanel.appendChild(optionFrame);
    }

    component.appendChild(dropdownPanel);
  }

  return component;
}

/**
 * Generate Select ComponentSet with variant, open, and state properties
 *
 * Creates a "Select" ComponentSet with all combinations of:
 * - variant: default, withLabel, withError
 * - open: false, true
 * - state: default, focus, disabled, loading
 *
 * Layout:
 * - Rows: variant (default, withLabel, withError)
 * - Columns: open x state combinations (8 columns total)
 *
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateSelectComponents(
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

  // Layout spacing
  var componentGapX = 24;
  var componentGapY = 40;
  var headerRowHeight = 24;
  var labelColumnWidth = 150; // Wider for variant labels

  // Track layout by row (variant)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  // Rows = variants, Columns = open x state
  for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
    var variant = VARIANT_VALUES[vi];
    rowComponents.set(vi, []);

    for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
      var open = OPEN_VALUES[oi];

      for (var si = 0; si < STATE_VALUES.length; si++) {
        var state = STATE_VALUES[si];
        var component = await createSelectComponent(variant, open, state);
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
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "Select";
  componentSet.description =
    "Select component with variant, open, and state properties. " +
    "Use for dropdown selection from a list of options.";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(page, "Select", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "Select", "dark");
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
    "Generated Select ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var SELECT_VARIANT_VALUES = VARIANT_VALUES;
export var SELECT_OPEN_VALUES = OPEN_VALUES;
export var SELECT_STATE_VALUES = STATE_VALUES;

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 * These functions compute data without calling Figma APIs, enabling snapshot tests.
 */

/**
 * Get trigger configuration from selectStyling (source of truth)
 */
export function getTriggerConfig() {
  return {
    height: selectStyling.trigger.height,
    paddingX: selectStyling.trigger.paddingX,
    paddingY: 0, // Not in styling (layout-specific)
    borderRadius: selectStyling.trigger.borderRadius,
    fontSize: selectStyling.trigger.fontSize,
    fontWeight: selectStyling.trigger.fontWeight,
    background: selectStyling.trigger.background,
    text: selectStyling.trigger.text,
    ring: selectStyling.trigger.ring,
  };
}

/**
 * Get popup configuration from selectStyling (source of truth)
 */
export function getPopupConfig() {
  return {
    background: selectStyling.popup.background,
    ring: selectStyling.popup.ring,
    borderRadius: selectStyling.popup.borderRadius,
    padding: selectStyling.popup.padding,
    width: 280, // Layout-specific (matches trigger width)
  };
}

/**
 * Get option configuration from selectStyling (source of truth)
 */
export function getOptionConfig() {
  return {
    paddingX: selectStyling.option.paddingX,
    paddingY: selectStyling.option.paddingY,
    borderRadius: selectStyling.option.borderRadius,
    fontSize: selectStyling.option.fontSize,
    fontWeight: 400, // Not in styling (standard)
    text: "text-color-surface",
    highlightBackground: selectStyling.option.highlightBackground,
  };
}

/**
 * Get all variant data (for snapshot testing)
 * Returns intermediate data before Figma API calls
 */
export function getAllVariantData() {
  var triggerConfig = getTriggerConfig();
  var popupConfig = getPopupConfig();
  var optionConfig = getOptionConfig();

  var variants = [];
  for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
    var variant = VARIANT_VALUES[vi];
    var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];

    for (var oi = 0; oi < OPEN_VALUES.length; oi++) {
      var open = OPEN_VALUES[oi];

      for (var si = 0; si < STATE_VALUES.length; si++) {
        var state = STATE_VALUES[si];
        var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

        variants.push({
          variant: variant,
          open: open,
          state: state,
          label: variantConfig.label,
          description: variantConfig.description,
          errorMessage: variantConfig.errorMessage,
          useErrorRing: variantConfig.useErrorRing || false,
          stateStyle: stateStyle,
        });
      }
    }
  }

  return {
    triggerConfig: triggerConfig,
    popupConfig: popupConfig,
    optionConfig: optionConfig,
    variants: variants,
    variantCount: variants.length,
  };
}
