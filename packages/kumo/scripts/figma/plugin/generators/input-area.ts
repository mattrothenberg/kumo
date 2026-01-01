/**
 * InputArea Component Generator
 *
 * Generates an InputArea ComponentSet in Figma that matches
 * the InputArea component props:
 *
 * - size: xs, sm, base, lg
 * - variant: default, error
 * - state: default, focus, disabled
 * - withLabel: false (bare textarea), true (with Field wrapper)
 *
 * The InputArea is a multi-line textarea with optional label, description, and error states.
 *
 * @see packages/kumo/src/components/input/input-area.tsx
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
 * Size configuration matching KUMO_INPUT_VARIANTS (shared with Input)
 * InputArea uses the same sizing but with variable height for multi-line content
 */
var SIZE_CONFIG: Record<
  string,
  {
    minHeight: number;
    paddingX: number;
    paddingY: number;
    fontSize: number;
    borderRadius: number;
    width: number;
  }
> = {
  xs: {
    minHeight: 60, // Taller than input for multi-line
    paddingX: 6, // px-1.5
    paddingY: 8, // py-2
    fontSize: 12, // text-xs
    borderRadius: BORDER_RADIUS.sm,
    width: 200,
  },
  sm: {
    minHeight: 72, // Taller than input for multi-line
    paddingX: 8, // px-2
    paddingY: 8, // py-2
    fontSize: 12, // text-xs
    borderRadius: BORDER_RADIUS.md,
    width: 240,
  },
  base: {
    minHeight: 88, // Taller than input for multi-line
    paddingX: 12, // px-3
    paddingY: 8, // py-2
    fontSize: 16, // text-base
    borderRadius: BORDER_RADIUS.lg,
    width: 320,
  },
  lg: {
    minHeight: 100, // Taller than input for multi-line
    paddingX: 16, // px-4
    paddingY: 8, // py-2
    fontSize: 16, // text-base
    borderRadius: BORDER_RADIUS.lg,
    width: 360,
  },
};

/**
 * Size values
 */
var SIZE_VALUES = ["xs", "sm", "base", "lg"];

/**
 * Variant values
 */
var VARIANT_VALUES = ["default", "error"];

/**
 * State values
 */
var STATE_VALUES = ["default", "focus", "disabled"];

/**
 * WithLabel values - whether to show Field wrapper (label, description, error)
 */
var WITH_LABEL_VALUES = [false, true];

/**
 * State-specific style overrides
 */
var STATE_STYLES: Record<
  string,
  {
    ringVariable?: string;
    opacity?: number;
    textColorVariable?: string;
  }
> = {
  default: {
    ringVariable: "color-border",
    textColorVariable: "text-color-muted",
  },
  focus: {
    ringVariable: "color-active",
    textColorVariable: "text-color-muted",
  },
  disabled: {
    ringVariable: "color-border",
    opacity: 0.5,
    textColorVariable: "text-color-muted",
  },
};

/**
 * Variant-specific configuration
 */
var VARIANT_CONFIG: Record<
  string,
  {
    ringVariable: string;
    label?: string;
    description?: string;
    errorMessage?: string;
  }
> = {
  default: {
    ringVariable: "color-border",
    label: "Message",
    description: "Enter your message here",
  },
  error: {
    ringVariable: "color-error",
    label: "Message",
    errorMessage: "Please enter a valid message",
  },
};

/**
 * Create a single InputArea component variant
 *
 * @param size - Size (xs, sm, base, lg)
 * @param variant - Variant type (default, error)
 * @param state - Interaction state (default, focus, disabled)
 * @param withLabel - Whether to show Field wrapper (label, description, error)
 * @returns ComponentNode for the textarea
 */
async function createInputAreaComponent(
  size: string,
  variant: string,
  state: string,
  withLabel: boolean,
): Promise<ComponentNode> {
  var sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG["base"];
  var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];
  var stateStyle = STATE_STYLES[state] || STATE_STYLES["default"];

  // Create component
  var component = figma.createComponent();
  component.name =
    "size=" +
    size +
    ", variant=" +
    variant +
    ", state=" +
    state +
    ", withLabel=" +
    withLabel;
  component.description =
    "InputArea " +
    size +
    " " +
    variant +
    " in " +
    state +
    " state" +
    (withLabel ? " with Field wrapper" : " bare");

  // Set up vertical auto-layout for the entire component (label + textarea + description/error)
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 4;
  component.fills = [];

  // Apply disabled opacity to entire component
  if (stateStyle.opacity !== undefined) {
    component.opacity = stateStyle.opacity;
  }

  // Create label (only if withLabel is true)
  if (withLabel && variantConfig.label) {
    var labelText = await createTextNode(variantConfig.label, 14, 500);
    labelText.name = "Label";
    labelText.textAutoResize = "WIDTH_AND_HEIGHT";

    var labelVar = getVariableByName("text-color-label");
    if (labelVar) {
      bindTextColorToVariable(labelText, labelVar.id);
    }

    component.appendChild(labelText);
  }

  // Create textarea frame
  var textareaFrame = figma.createFrame();
  textareaFrame.name = "Textarea";
  textareaFrame.layoutMode = "HORIZONTAL";
  textareaFrame.primaryAxisAlignItems = "MIN";
  textareaFrame.counterAxisAlignItems = "MIN"; // Top-align text in textarea
  textareaFrame.primaryAxisSizingMode = "FIXED";
  textareaFrame.counterAxisSizingMode = "FIXED";
  textareaFrame.resize(sizeConfig.width, sizeConfig.minHeight);
  textareaFrame.itemSpacing = 8;
  textareaFrame.paddingLeft = sizeConfig.paddingX;
  textareaFrame.paddingRight = sizeConfig.paddingX;
  textareaFrame.paddingTop = sizeConfig.paddingY;
  textareaFrame.paddingBottom = sizeConfig.paddingY;
  textareaFrame.cornerRadius = sizeConfig.borderRadius;

  // Apply background fill (bg-secondary)
  var bgVar = getVariableByName("color-secondary");
  if (bgVar) {
    bindFillToVariable(textareaFrame, bgVar.id);
  }

  // Apply ring (stroke) - use variant ring in default state, state ring for focus
  var ringVarName = variantConfig.ringVariable;
  if (state === "focus" && variant === "default") {
    ringVarName = "color-active";
  } else if (state === "focus" && variant === "error") {
    ringVarName = "color-error";
  }
  var ringVar = getVariableByName(ringVarName);
  if (ringVar) {
    bindStrokeToVariable(textareaFrame, ringVar.id, 1);
  }

  // Create placeholder text (multi-line for textarea)
  var placeholderValue =
    variant === "error"
      ? "Invalid content here..."
      : "Enter your message here...";
  var placeholderText = await createTextNode(
    placeholderValue,
    sizeConfig.fontSize,
    400,
  );
  placeholderText.name = "Placeholder";
  placeholderText.textAutoResize = "WIDTH_AND_HEIGHT";

  // Apply text color (text-muted for placeholder, text-surface for value in error)
  var textColorVar =
    variant === "error"
      ? getVariableByName("text-color-surface")
      : getVariableByName("text-color-muted");
  if (textColorVar) {
    bindTextColorToVariable(placeholderText, textColorVar.id);
  }

  textareaFrame.appendChild(placeholderText);
  component.appendChild(textareaFrame);

  // Create description or error message (only if withLabel is true)
  if (withLabel && variantConfig.description && variant === "default") {
    var descText = await createTextNode(variantConfig.description, 12, 400);
    descText.name = "Description";
    descText.textAutoResize = "WIDTH_AND_HEIGHT";

    var descVar = getVariableByName("text-color-muted");
    if (descVar) {
      bindTextColorToVariable(descText, descVar.id);
    }

    component.appendChild(descText);
  }

  if (withLabel && variantConfig.errorMessage && variant === "error") {
    var errorText = await createTextNode(variantConfig.errorMessage, 12, 400);
    errorText.name = "Error";
    errorText.textAutoResize = "WIDTH_AND_HEIGHT";

    var errorVar = getVariableByName("text-color-error");
    if (errorVar) {
      bindTextColorToVariable(errorText, errorVar.id);
    }

    component.appendChild(errorText);
  }

  return component;
}

/**
 * Generate InputArea ComponentSet with size, variant, state, and withLabel properties
 *
 * Creates an "InputArea" ComponentSet with all combinations of:
 * - size: xs, sm, base, lg
 * - variant: default, error
 * - state: default, focus, disabled
 * - withLabel: false (bare textarea), true (with Field wrapper)
 *
 * Layout:
 * - Rows: size × withLabel combinations (8 rows total)
 * - Columns: variant × state combinations (6 columns total)
 *
 * Creates both light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateInputAreaComponents(
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
  var labelColumnWidth = 200; // Wider for size + withLabel labels

  // Track layout by row (size × withLabel)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  // Rows = size × withLabel, Columns = variant × state
  var rowIndex = 0;
  for (var si = 0; si < SIZE_VALUES.length; si++) {
    var size = SIZE_VALUES[si];

    for (var wli = 0; wli < WITH_LABEL_VALUES.length; wli++) {
      var withLabel = WITH_LABEL_VALUES[wli];
      rowComponents.set(rowIndex, []);

      for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
        var variant = VARIANT_VALUES[vi];

        for (var sti = 0; sti < STATE_VALUES.length; sti++) {
          var state = STATE_VALUES[sti];
          var component = await createInputAreaComponent(
            size,
            variant,
            state,
            withLabel,
          );
          rowComponents.get(rowIndex)!.push(component);
          components.push(component);
        }
      }

      rowIndex++;
    }
  }

  // First pass: calculate max width per column and max height per row
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  var numColumns = VARIANT_VALUES.length * STATE_VALUES.length;
  var totalRows = SIZE_VALUES.length * WITH_LABEL_VALUES.length;

  for (var colIdx = 0; colIdx < numColumns; colIdx++) {
    var maxColWidth = 0;
    for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
      var row = rowComponents.get(rowIdx) || [];
      var comp = row[colIdx];
      if (comp && comp.width > maxColWidth) {
        maxColWidth = comp.width;
      }
    }
    columnWidths.push(maxColWidth);
  }

  for (var rowIdx = 0; rowIdx < totalRows; rowIdx++) {
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

  var currentRowIndex = 0;
  for (var si2 = 0; si2 < SIZE_VALUES.length; si2++) {
    var sizeValue = SIZE_VALUES[si2];

    for (var wli2 = 0; wli2 < WITH_LABEL_VALUES.length; wli2++) {
      var withLabelValue = WITH_LABEL_VALUES[wli2];
      var row = rowComponents.get(currentRowIndex) || [];
      var xOffset = labelColumnWidth;

      // Record row label
      rowLabels.push({
        y: yOffset,
        text: "size=" + sizeValue + ", withLabel=" + withLabelValue,
      });

      for (var colIdx = 0; colIdx < row.length; colIdx++) {
        var comp = row[colIdx];
        comp.x = xOffset;
        comp.y = yOffset;

        // Record column headers from first row
        if (currentRowIndex === 0) {
          var variantIdx = Math.floor(colIdx / STATE_VALUES.length);
          var stateIdx = colIdx % STATE_VALUES.length;
          var variantVal = VARIANT_VALUES[variantIdx];
          var stateVal = STATE_VALUES[stateIdx];
          columnHeaders.push({
            x: xOffset,
            text: "variant=" + variantVal + ", state=" + stateVal,
          });
        }

        // Use consistent column width for positioning
        xOffset += columnWidths[colIdx] + componentGapX;
      }

      yOffset += rowHeights[currentRowIndex] + componentGapY;
      currentRowIndex++;
    }
  }

  // Combine all variants into a single ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "InputArea";
  componentSet.description =
    "InputArea (textarea) component with size, variant, state, and withLabel properties. " +
    "Use withLabel=false for bare textareas, withLabel=true for textareas with Field wrapper (label, description, error).";
  componentSet.layoutMode = "NONE";

  // Calculate content dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(page, "InputArea", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "InputArea", "dark");
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
  lightSection.section.x = 100;
  lightSection.section.y = startY;

  darkSection.section.x = 100 + totalWidth + 50;
  darkSection.section.y = startY;

  console.log(
    "Generated InputArea ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var INPUT_AREA_SIZE_VALUES = SIZE_VALUES;
export var INPUT_AREA_VARIANT_VALUES = VARIANT_VALUES;
export var INPUT_AREA_STATE_VALUES = STATE_VALUES;
