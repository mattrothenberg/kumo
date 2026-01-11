import { logComplete } from "../logger";
/**
 * SensitiveInput Component Generator
 *
 * Generates a SensitiveInput ComponentSet in Figma that matches
 * the SensitiveInput component props:
 *
 * - size: xs, sm, base, lg
 * - variant: default, error
 * - state: default, focus, disabled
 * - mode: masked, revealed
 * - withLabel: false, true
 *
 * The SensitiveInput shows masked dots (●●●●●●●●) or revealed text,
 * with eye icon toggle and copy button on hover.
 *
 * @see packages/kumo/src/components/sensitive-input/sensitive-input.tsx
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
import registry from "../../../../ai/component-registry.json";



/**
 * Extract Input component data from registry
 * SensitiveInput uses Input's size and variant configuration
 */
var inputComponent = registry.components.Input;
var inputProps = inputComponent.props;
var inputStyling = inputComponent.styling;

var sizeProp = inputProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

var variantProp = inputProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};

/**
 * Size values from Input registry
 */
var SIZE_VALUES = sizeProp.values;

/**
 * Variant values from Input registry
 */
var VARIANT_VALUES = variantProp.values;

/**
 * Width mapping for SensitiveInput (layout-specific)
 */
var SIZE_WIDTHS: Record<string, number> = {
  xs: 200,
  sm: 220,
  base: 280,
  lg: 320,
};

/**
 * Icon size mapping for SensitiveInput (layout-specific)
 */
var ICON_SIZES: Record<string, string> = {
  xs: "sm",
  sm: "sm",
  base: "base",
  lg: "base",
};

/**
 * Get size configuration from Input registry styling
 */
function getSizeConfigFromRegistry(
  size: string,
): {
  height: number;
  paddingX: number;
  fontSize: number;
  borderRadius: number;
  width: number;
  iconSize: string;
} {
  var sizeVariants = inputStyling.sizeVariants as Record<
    string,
    {
      height: number;
      classes: string;
      dimensions: {
        paddingX: number;
        fontSize: number;
        borderRadius: number;
      };
    }
  >;
  var sizeVariant = sizeVariants[size] || sizeVariants["base"];

  return {
    height: sizeVariant.height,
    paddingX: sizeVariant.dimensions.paddingX,
    fontSize: sizeVariant.dimensions.fontSize,
    borderRadius: sizeVariant.dimensions.borderRadius,
    width: SIZE_WIDTHS[size] || SIZE_WIDTHS["base"],
    iconSize: ICON_SIZES[size] || ICON_SIZES["base"],
  };
}

/**
 * Size configuration from registry (dynamically computed)
 */
var SIZE_CONFIG: Record<
  string,
  {
    height: number;
    paddingX: number;
    fontSize: number;
    borderRadius: number;
    width: number;
    iconSize: string;
  }
> = {};

// Populate SIZE_CONFIG from registry at generator init time
for (var i = 0; i < SIZE_VALUES.length; i++) {
  var sizeKey = SIZE_VALUES[i];
  SIZE_CONFIG[sizeKey] = getSizeConfigFromRegistry(sizeKey);
}

/**
 * State values
 */
var STATE_VALUES = ["default", "focus", "disabled"];

/**
 * Mode values - masked shows dots, revealed shows text
 */
var MODE_VALUES = ["masked", "revealed"];

/**
 * WithLabel values - whether to show Field wrapper
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
    ringVariable: string;
    label?: string;
    description?: string;
    errorMessage?: string;
  }
> = {
  default: {
    ringVariable: "color-border",
    label: "API Key",
    description: "Keep this key secure",
  },
  error: {
    ringVariable: "color-error",
    label: "API Key",
    errorMessage: "This API key is not valid",
  },
};

/**
 * Create a single SensitiveInput component variant
 */
async function createSensitiveInputComponent(
  size: string,
  variant: string,
  state: string,
  mode: string,
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
    ", mode=" +
    mode +
    ", withLabel=" +
    withLabel;
  component.description =
    "SensitiveInput " +
    size +
    " " +
    variant +
    " in " +
    state +
    " state, " +
    mode +
    (withLabel ? " with Field wrapper" : " bare");

  // Set up vertical auto-layout
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = 4;
  component.fills = [];

  // Apply disabled opacity
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

  // Create input container frame
  var inputFrame = figma.createFrame();
  inputFrame.name = "Input";
  inputFrame.layoutMode = "HORIZONTAL";
  inputFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  inputFrame.counterAxisAlignItems = "CENTER";
  inputFrame.primaryAxisSizingMode = "FIXED";
  inputFrame.counterAxisSizingMode = "FIXED";
  inputFrame.resize(sizeConfig.width, sizeConfig.height);
  inputFrame.itemSpacing = 8;
  inputFrame.paddingLeft = sizeConfig.paddingX;
  inputFrame.paddingRight = sizeConfig.paddingX;
  inputFrame.paddingTop = 0;
  inputFrame.paddingBottom = 0;
  inputFrame.cornerRadius = sizeConfig.borderRadius;

  // Apply background fill (bg-secondary)
  var bgVar = getVariableByName("color-secondary");
  if (bgVar) {
    bindFillToVariable(inputFrame, bgVar.id);
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
    bindStrokeToVariable(inputFrame, ringVar.id, 1);
  }

  // Create content based on mode
  if (mode === "masked") {
    // Show masked dots
    var maskedText = await createTextNode("●●●●●●●●", sizeConfig.fontSize, 400);
    maskedText.name = "MaskedValue";
    maskedText.textAutoResize = "WIDTH_AND_HEIGHT";

    var maskedTextVar = getVariableByName("text-color-surface");
    if (maskedTextVar) {
      bindTextColorToVariable(maskedText, maskedTextVar.id);
    }

    inputFrame.appendChild(maskedText);
  } else {
    // Show revealed text
    var revealedText = await createTextNode(
      "sk_live_abc123",
      sizeConfig.fontSize,
      400,
    );
    revealedText.name = "Value";
    revealedText.textAutoResize = "WIDTH_AND_HEIGHT";

    var revealedTextVar = getVariableByName("text-color-surface");
    if (revealedTextVar) {
      bindTextColorToVariable(revealedText, revealedTextVar.id);
    }

    inputFrame.appendChild(revealedText);
  }

  // Create eye icon (EyeSlash when revealed, Eye when masked)
  var eyeIconName = mode === "revealed" ? "ph-eye-slash" : "ph-eye";
  var eyeIcon = getButtonIcon(eyeIconName, sizeConfig.iconSize);
  eyeIcon.name = "EyeIcon";

  var iconColorToken = state === "disabled" ? "text-disabled" : "text-muted";
  bindIconColor(eyeIcon, iconColorToken);

  inputFrame.appendChild(eyeIcon);
  component.appendChild(inputFrame);

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
 * Generate SensitiveInput ComponentSet
 *
 * Creates a "SensitiveInput" ComponentSet with all combinations of:
 * - size: xs, sm, base, lg
 * - variant: default, error
 * - state: default, focus, disabled
 * - mode: masked, revealed
 * - withLabel: false, true
 *
 * Layout:
 * - Rows: size x withLabel combinations (8 rows)
 * - Columns: variant x state x mode combinations (12 columns)
 *
 * Creates both light and dark mode sections.
 */
export async function generateSensitiveInputComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  var components: ComponentNode[] = [];
  var rowLabels: { y: number; text: string }[] = [];
  var columnHeaders: { x: number; text: string }[] = [];

  var componentGapX = 24;
  var componentGapY = 40;
  var headerRowHeight = 24;
  var labelColumnWidth = 220;

  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components
  // Rows = size x withLabel, Columns = variant x state x mode
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

          for (var mi = 0; mi < MODE_VALUES.length; mi++) {
            var mode = MODE_VALUES[mi];
            var component = await createSensitiveInputComponent(
              size,
              variant,
              state,
              mode,
              withLabel,
            );
            rowComponents.get(rowIndex)!.push(component);
            components.push(component);
          }
        }
      }

      rowIndex++;
    }
  }

  // Calculate column widths and row heights
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  var numColumns =
    VARIANT_VALUES.length * STATE_VALUES.length * MODE_VALUES.length;
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

  // Position components
  var yOffset = headerRowHeight;

  var currentRowIndex = 0;
  for (var si2 = 0; si2 < SIZE_VALUES.length; si2++) {
    var sizeValue = SIZE_VALUES[si2];

    for (var wli2 = 0; wli2 < WITH_LABEL_VALUES.length; wli2++) {
      var withLabelValue = WITH_LABEL_VALUES[wli2];
      var row = rowComponents.get(currentRowIndex) || [];
      var xOffset = labelColumnWidth;

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
          var variantIdx = Math.floor(
            colIdx / (STATE_VALUES.length * MODE_VALUES.length),
          );
          var stateIdx = Math.floor(
            (colIdx % (STATE_VALUES.length * MODE_VALUES.length)) /
              MODE_VALUES.length,
          );
          var modeIdx = colIdx % MODE_VALUES.length;
          var variantVal = VARIANT_VALUES[variantIdx];
          var stateVal = STATE_VALUES[stateIdx];
          var modeVal = MODE_VALUES[modeIdx];
          columnHeaders.push({
            x: xOffset,
            text:
              "variant=" +
              variantVal +
              ", state=" +
              stateVal +
              ", mode=" +
              modeVal,
          });
        }

        xOffset += columnWidths[colIdx] + componentGapX;
      }

      yOffset += rowHeights[currentRowIndex] + componentGapY;
      currentRowIndex++;
    }
  }

  // Combine into ComponentSet
  // @ts-ignore
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "SensitiveInput";
  componentSet.description =
    "SensitiveInput component for passwords and API keys. " +
    "Shows masked dots or revealed text with eye toggle.";
  componentSet.layoutMode = "NONE";

  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create sections
  var lightSection = createModeSection(page, "SensitiveInput", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  var darkSection = createModeSection(page, "SensitiveInput", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Move ComponentSet into light section
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

  // Resize and position sections
  var totalWidth = contentWidth + SECTION_PADDING * 2;
  var totalHeight = contentHeight + SECTION_PADDING * 2;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  lightSection.section.x = SECTION_LAYOUT.startX;
  lightSection.section.y = startY;

  darkSection.section.x = lightSection.section.x + totalWidth + SECTION_LAYOUT.modeGap;
  darkSection.section.y = startY;

  logComplete(
    "Generated SensitiveInput ComponentSet with " +
      components.length +
      " variants (light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Testable exports
 */

/**
 * Get size configuration from Input registry
 */
export function getSensitiveInputSizeConfig() {
  return {
    values: SIZE_VALUES,
    config: SIZE_CONFIG,
    registrySource: "Input.props.size.values",
    registryStyling: inputStyling.sizeVariants,
  };
}

/**
 * Get variant configuration from Input registry
 */
export function getSensitiveInputVariantConfig() {
  return {
    values: VARIANT_VALUES,
    config: VARIANT_CONFIG,
    registrySource: "Input.props.variant.values",
  };
}

/**
 * Get state configuration (generator-specific)
 */
export function getSensitiveInputStateConfig() {
  return {
    values: STATE_VALUES,
    styles: STATE_STYLES,
  };
}

/**
 * Get mode configuration (SensitiveInput-specific)
 */
export function getSensitiveInputModeConfig() {
  return {
    values: MODE_VALUES,
  };
}

/**
 * Get withLabel configuration (generator-specific)
 */
export function getSensitiveInputWithLabelConfig() {
  return {
    values: WITH_LABEL_VALUES,
  };
}

/**
 * Get computed size dimensions for a specific size
 */
export function getSensitiveInputSizeDimensions(size: string) {
  return SIZE_CONFIG[size] || SIZE_CONFIG["base"];
}

/**
 * Get complete intermediate data
 */
export function getAllSensitiveInputVariantData() {
  return {
    sizeConfig: getSensitiveInputSizeConfig(),
    variantConfig: getSensitiveInputVariantConfig(),
    stateConfig: getSensitiveInputStateConfig(),
    modeConfig: getSensitiveInputModeConfig(),
    withLabelConfig: getSensitiveInputWithLabelConfig(),
    registryMetadata: {
      component: inputComponent.name,
      description: inputComponent.description,
      colors: inputComponent.colors,
    },
  };
}

/**
 * Legacy exports for backward compatibility
 */
export var SENSITIVE_INPUT_SIZE_VALUES = SIZE_VALUES;
export var SENSITIVE_INPUT_VARIANT_VALUES = VARIANT_VALUES;
export var SENSITIVE_INPUT_STATE_VALUES = STATE_VALUES;
export var SENSITIVE_INPUT_MODE_VALUES = MODE_VALUES;
