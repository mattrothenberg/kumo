import { logComplete } from "../logger";
import registry from "../../../../ai/component-registry.json";

/**
 * DateRangePicker Component Generator
 *
 * Generates a DateRangePicker ComponentSet in Figma that matches
 * the DateRangePicker component props:
 *
 * - size: sm, base, lg
 * - variant: default, subtle
 * - selected: false, true (whether a date range is selected)
 *
 * The DateRangePicker displays two side-by-side calendars with:
 * - Navigation buttons (prev/next month)
 * - Month/Year header
 * - Day-of-week headers (Su Mo Tu We Th Fr Sa)
 * - 42 day cells (6 rows × 7 columns) per calendar
 * - Footer with timezone and reset button
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/kumo/src/components/date-range-picker/date-range-picker.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  createColumnHeaders,
  bindFillToVariable,
  bindTextColorToVariable,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";

/**
 * Extract DateRangePicker configuration from registry
 */
var dateRangePickerComponent = registry.components.DateRangePicker;
var dateRangePickerProps = dateRangePickerComponent.props;
var sizeProp = dateRangePickerProps.size as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};
var variantProp = dateRangePickerProps.variant as {
  values: string[];
  classes: Record<string, string>;
  descriptions: Record<string, string>;
  default: string;
};



/**
 * Size values (from registry)
 */
var SIZE_VALUES = sizeProp.values;

/**
 * Variant values (from registry)
 */
var VARIANT_VALUES = variantProp.values;

/**
 * Selected state values
 */
var SELECTED_VALUES = [false, true];

/**
 * Size-specific configurations (from date-range-picker.tsx)
 * 
 * TODO: These values should ideally come from registry when KUMO_DATE_RANGE_PICKER_VARIANTS
 * is extracted with full size metadata (cellHeight, cellWidth, calendarWidth, textSize, iconSize).
 * For now, these values match the React component's KUMO_DATE_RANGE_PICKER_VARIANTS exactly.
 */
var SIZE_CONFIG: Record<
  string,
  {
    calendarWidth: number;
    cellHeight: number;
    cellWidth: number;
    textSize: number;
    iconSize: number;
    padding: number;
    gap: number;
  }
> = {
  sm: {
    calendarWidth: 168,
    cellHeight: 22,
    cellWidth: 24,
    textSize: 12,
    iconSize: 14,
    padding: 12,
    gap: 8,
  },
  base: {
    calendarWidth: 196,
    cellHeight: 26,
    cellWidth: 28,
    textSize: 14,
    iconSize: 16,
    padding: 16,
    gap: 10,
  },
  lg: {
    calendarWidth: 252,
    cellHeight: 32,
    cellWidth: 36,
    textSize: 16,
    iconSize: 18,
    padding: 20,
    gap: 12,
  },
};

/**
 * Variant-specific background colors (from registry)
 */
function getVariantBackground(variant: string): string {
  var classes = variantProp.classes[variant] || variantProp.classes.default;
  // Extract semantic token from class (e.g., "bg-calendar" -> "color-calendar")
  if (classes.indexOf("bg-calendar") >= 0) {
    return "color-calendar";
  } else if (classes.indexOf("bg-surface") >= 0) {
    return "color-surface";
  }
  return "color-calendar"; // fallback
}

var VARIANT_CONFIG: Record<string, { bgVariable: string }> = {};
for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
  var v = VARIANT_VALUES[vi];
  VARIANT_CONFIG[v] = { bgVariable: getVariantBackground(v) };
}

/**
 * Day-of-week labels
 */
var DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Create day-of-week header row
 */
async function createDayHeaders(
  size: string,
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var headerRow = figma.createFrame();
  headerRow.name = "Day Headers";
  headerRow.layoutMode = "HORIZONTAL";
  headerRow.primaryAxisSizingMode = "AUTO";
  headerRow.counterAxisSizingMode = "AUTO";
  headerRow.itemSpacing = 4;
  headerRow.fills = [];

  for (var i = 0; i < DAYS_OF_WEEK.length; i++) {
    var dayLabel = await createTextNode(
      DAYS_OF_WEEK[i],
      sizeConfig.textSize,
      400,
    );
    dayLabel.name = DAYS_OF_WEEK[i];
    dayLabel.textAlignHorizontal = "CENTER";
    dayLabel.resize(sizeConfig.cellWidth, 22);

    // Apply muted text color
    var mutedVar = getVariableByName("text-color-muted");
    if (mutedVar) {
      bindTextColorToVariable(dayLabel, mutedVar.id);
    }

    headerRow.appendChild(dayLabel);
  }

  return headerRow;
}

/**
 * Create a single day cell
 */
async function createDayCell(
  dayNumber: number,
  mode: "normal" | "selected" | "start" | "end" | "outOfRange",
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var cell = figma.createFrame();
  cell.name = "Day " + dayNumber;
  cell.layoutMode = "HORIZONTAL";
  cell.primaryAxisAlignItems = "CENTER";
  cell.counterAxisAlignItems = "CENTER";
  cell.primaryAxisSizingMode = "FIXED";
  cell.counterAxisSizingMode = "FIXED";
  cell.resize(sizeConfig.cellWidth, sizeConfig.cellHeight);
  cell.fills = [];

  // Apply background based on mode
  // Note: "outOfRange" has NO background - just muted text
  // "selectedOutOfRange" would have bg-calendar-day-range-selected-out-of-range but we don't use that state
  if (mode === "selected") {
    var selectedVar = getVariableByName("color-calendar-day-range-selected");
    if (selectedVar) {
      bindFillToVariable(cell, selectedVar.id);
    }
  } else if (mode === "start" || mode === "end") {
    var endpointVar = getVariableByName(
      "color-calendar-day-range-selected-endpoints",
    );
    if (endpointVar) {
      bindFillToVariable(cell, endpointVar.id);
    }
    // Apply border radius
    if (mode === "start") {
      cell.topLeftRadius = 5;
      cell.bottomLeftRadius = 5;
    } else {
      cell.topRightRadius = 5;
      cell.bottomRightRadius = 5;
    }
  }
  // outOfRange mode: no background fill, just muted text (applied below)

  // Create day number text
  var dayText = await createTextNode(
    String(dayNumber),
    sizeConfig.textSize,
    400,
  );
  dayText.name = "Day Number";
  dayText.textAlignHorizontal = "CENTER";

  // Apply text color based on mode
  if (mode === "start" || mode === "end") {
    var inverseVar = getVariableByName("text-color-surface-inverse");
    if (inverseVar) {
      bindTextColorToVariable(dayText, inverseVar.id);
    }
  } else if (mode === "outOfRange") {
    var labelVar = getVariableByName("text-color-label");
    if (labelVar) {
      bindTextColorToVariable(dayText, labelVar.id);
    }
  } else {
    var surfaceVar = getVariableByName("text-color-surface");
    if (surfaceVar) {
      bindTextColorToVariable(dayText, surfaceVar.id);
    }
  }

  cell.appendChild(dayText);
  return cell;
}

/**
 * Month configuration for realistic calendar display
 * December 2025 starts on Monday (index 1), has 31 days
 * January 2026 starts on Thursday (index 4), has 31 days
 */
var MONTH_CONFIG: Record<
  string,
  { startDay: number; daysInMonth: number; prevMonthDays: number }
> = {
  December: { startDay: 1, daysInMonth: 31, prevMonthDays: 30 }, // Mon, Nov has 30
  January: { startDay: 4, daysInMonth: 31, prevMonthDays: 31 }, // Thu, Dec has 31
};

/**
 * Create calendar grid with 42 day cells (6 rows × 7 columns)
 * Shows realistic dates with previous/next month overflow
 */
async function createCalendarGrid(
  monthName: string,
  selected: boolean,
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var grid = figma.createFrame();
  grid.name = "Calendar Grid";
  grid.layoutMode = "VERTICAL";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = 2;
  grid.fills = [];

  var config = MONTH_CONFIG[monthName] || MONTH_CONFIG["January"];
  var startDay = config.startDay; // 0=Sun, 1=Mon, etc.
  var daysInMonth = config.daysInMonth;
  var prevMonthDays = config.prevMonthDays;

  // Create 6 rows of 7 days each
  for (var row = 0; row < 6; row++) {
    var rowFrame = figma.createFrame();
    rowFrame.name = "Row " + (row + 1);
    rowFrame.layoutMode = "HORIZONTAL";
    rowFrame.primaryAxisSizingMode = "AUTO";
    rowFrame.counterAxisSizingMode = "AUTO";
    rowFrame.itemSpacing = 0;
    rowFrame.fills = [];

    for (var col = 0; col < 7; col++) {
      var cellIndex = row * 7 + col;
      var dayNumber: number;
      var isOutOfRange = false;

      if (cellIndex < startDay) {
        // Previous month's trailing days
        dayNumber = prevMonthDays - startDay + cellIndex + 1;
        isOutOfRange = true;
      } else if (cellIndex >= startDay + daysInMonth) {
        // Next month's leading days
        dayNumber = cellIndex - startDay - daysInMonth + 1;
        isOutOfRange = true;
      } else {
        // Current month
        dayNumber = cellIndex - startDay + 1;
      }

      // Determine cell mode
      var cellMode: "normal" | "selected" | "start" | "end" | "outOfRange" =
        isOutOfRange ? "outOfRange" : "normal";

      // Apply selection only to current month days (not overflow)
      if (selected && !isOutOfRange) {
        // Show selected range from 15th to 22nd
        if (dayNumber === 15) {
          cellMode = "start";
        } else if (dayNumber === 22) {
          cellMode = "end";
        } else if (dayNumber > 15 && dayNumber < 22) {
          cellMode = "selected";
        }
      }

      var cell = await createDayCell(dayNumber, cellMode, sizeConfig);
      rowFrame.appendChild(cell);
    }

    grid.appendChild(rowFrame);
  }

  return grid;
}

/**
 * Create month header with navigation
 */
async function createMonthHeader(
  monthName: string,
  year: string,
  showLeftNav: boolean,
  showRightNav: boolean,
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var header = figma.createFrame();
  header.name = "Month Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.resize(sizeConfig.calendarWidth, 32);
  header.fills = [];

  // Left navigation button (if applicable)
  if (showLeftNav) {
    var leftButton = figma.createFrame();
    leftButton.name = "Prev Month";
    leftButton.layoutMode = "HORIZONTAL";
    leftButton.primaryAxisAlignItems = "CENTER";
    leftButton.counterAxisAlignItems = "CENTER";
    leftButton.primaryAxisSizingMode = "AUTO";
    leftButton.counterAxisSizingMode = "AUTO";
    leftButton.paddingLeft = 6;
    leftButton.paddingRight = 6;
    leftButton.paddingTop = 6;
    leftButton.paddingBottom = 6;
    leftButton.cornerRadius = BORDER_RADIUS.md;

    var selectedOpacityVar = getVariableByName(
      "color-calendar-day-range-selected/85",
    );
    if (selectedOpacityVar) {
      bindFillToVariable(leftButton, selectedOpacityVar.id);
    }

    var leftIcon = getButtonIcon("ph-caret-left", "sm");
    bindIconColor(leftIcon, "text-surface");
    leftButton.appendChild(leftIcon);
    header.appendChild(leftButton);
  } else {
    var spacer = figma.createFrame();
    spacer.resize(1, 1);
    spacer.fills = [];
    header.appendChild(spacer);
  }

  // Month and year text
  var titleText = await createTextNode(
    monthName + " " + year,
    sizeConfig.textSize,
    600,
  );
  titleText.name = "Month Year";
  titleText.textAlignHorizontal = "CENTER";

  var surfaceVar = getVariableByName("text-color-surface");
  if (surfaceVar) {
    bindTextColorToVariable(titleText, surfaceVar.id);
  }

  header.appendChild(titleText);

  // Right navigation button (if applicable)
  if (showRightNav) {
    var rightButton = figma.createFrame();
    rightButton.name = "Next Month";
    rightButton.layoutMode = "HORIZONTAL";
    rightButton.primaryAxisAlignItems = "CENTER";
    rightButton.counterAxisAlignItems = "CENTER";
    rightButton.primaryAxisSizingMode = "AUTO";
    rightButton.counterAxisSizingMode = "AUTO";
    rightButton.paddingLeft = 6;
    rightButton.paddingRight = 6;
    rightButton.paddingTop = 6;
    rightButton.paddingBottom = 6;
    rightButton.cornerRadius = BORDER_RADIUS.md;

    var selectedOpacityVar2 = getVariableByName(
      "color-calendar-day-range-selected/85",
    );
    if (selectedOpacityVar2) {
      bindFillToVariable(rightButton, selectedOpacityVar2.id);
    }

    var rightIcon = getButtonIcon("ph-caret-right", "sm");
    bindIconColor(rightIcon, "text-surface");
    rightButton.appendChild(rightIcon);
    header.appendChild(rightButton);
  } else {
    var spacer2 = figma.createFrame();
    spacer2.resize(1, 1);
    spacer2.fills = [];
    header.appendChild(spacer2);
  }

  return header;
}

/**
 * Create single calendar (left or right)
 */
async function createCalendar(
  monthName: string,
  year: string,
  showLeftNav: boolean,
  showRightNav: boolean,
  selected: boolean,
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var calendar = figma.createFrame();
  calendar.name = monthName + " Calendar";
  calendar.layoutMode = "VERTICAL";
  calendar.primaryAxisSizingMode = "AUTO";
  calendar.counterAxisSizingMode = "AUTO";
  calendar.itemSpacing = 12;
  calendar.fills = [];

  var monthHeader = await createMonthHeader(
    monthName,
    year,
    showLeftNav,
    showRightNav,
    sizeConfig,
  );
  calendar.appendChild(monthHeader);

  var dayHeaders = await createDayHeaders("base", sizeConfig);
  calendar.appendChild(dayHeaders);

  var grid = await createCalendarGrid(monthName, selected, sizeConfig);
  calendar.appendChild(grid);

  return calendar;
}

/**
 * Create footer with timezone and reset button
 */
async function createFooter(
  sizeConfig: (typeof SIZE_CONFIG)["base"],
): Promise<FrameNode> {
  var footer = figma.createFrame();
  footer.name = "Footer";
  footer.layoutMode = "HORIZONTAL";
  footer.primaryAxisAlignItems = "SPACE_BETWEEN";
  footer.counterAxisAlignItems = "CENTER";
  footer.primaryAxisSizingMode = "FIXED";
  footer.counterAxisSizingMode = "AUTO";
  footer.resize(sizeConfig.calendarWidth * 2 + 16, 32);
  footer.itemSpacing = 8;
  footer.fills = [];

  // Timezone section with icon
  var timezoneSection = figma.createFrame();
  timezoneSection.name = "Timezone";
  timezoneSection.layoutMode = "HORIZONTAL";
  timezoneSection.primaryAxisAlignItems = "MIN";
  timezoneSection.counterAxisAlignItems = "CENTER";
  timezoneSection.primaryAxisSizingMode = "AUTO";
  timezoneSection.counterAxisSizingMode = "AUTO";
  timezoneSection.itemSpacing = 8;
  timezoneSection.fills = [];

  var globeIcon = getButtonIcon("ph-globe-hemisphere-west", "sm");
  bindIconColor(globeIcon, "text-label");
  timezoneSection.appendChild(globeIcon);

  var timezoneText = await createTextNode(
    "Timezone: New York, NY, USA (GMT-4)",
    sizeConfig.textSize,
    400,
  );
  timezoneText.name = "Timezone Text";

  var labelVar = getVariableByName("text-color-label");
  if (labelVar) {
    bindTextColorToVariable(timezoneText, labelVar.id);
  }

  timezoneSection.appendChild(timezoneText);
  footer.appendChild(timezoneSection);

  // Reset button
  var resetButton = await createTextNode(
    "Reset Dates",
    sizeConfig.textSize,
    600,
  );
  resetButton.name = "Reset Button";
  resetButton.textDecoration = "UNDERLINE";

  var surfaceVar = getVariableByName("text-color-surface");
  if (surfaceVar) {
    bindTextColorToVariable(resetButton, surfaceVar.id);
  }

  footer.appendChild(resetButton);

  return footer;
}

/**
 * Create a single DateRangePicker component variant
 */
async function createDateRangePickerComponent(
  size: string,
  variant: string,
  selected: boolean,
): Promise<ComponentNode> {
  var sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG["base"];
  var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];

  var component = figma.createComponent();
  component.name =
    "size=" + size + ", variant=" + variant + ", selected=" + selected;
  component.description =
    "DateRangePicker " +
    size +
    " " +
    variant +
    " " +
    (selected ? "with selected range" : "no selection");

  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = sizeConfig.gap;
  component.paddingLeft = sizeConfig.padding;
  component.paddingRight = sizeConfig.padding;
  component.paddingTop = sizeConfig.padding;
  component.paddingBottom = sizeConfig.padding;
  component.cornerRadius = BORDER_RADIUS.lg;

  // Apply background
  var bgVar = getVariableByName(variantConfig.bgVariable);
  if (bgVar) {
    bindFillToVariable(component, bgVar.id);
  }

  // Create calendars container
  var calendarsContainer = figma.createFrame();
  calendarsContainer.name = "Calendars";
  calendarsContainer.layoutMode = "HORIZONTAL";
  calendarsContainer.primaryAxisSizingMode = "AUTO";
  calendarsContainer.counterAxisSizingMode = "AUTO";
  calendarsContainer.itemSpacing = 16;
  calendarsContainer.fills = [];

  // Left calendar (December 2025) - shows selection when selected=true
  var leftCalendar = await createCalendar(
    "December",
    "2025",
    true,
    false,
    selected,
    sizeConfig,
  );
  calendarsContainer.appendChild(leftCalendar);

  // Right calendar (January 2026) - never shows selection (range is in December)
  var rightCalendar = await createCalendar(
    "January",
    "2026",
    false,
    true,
    false,
    sizeConfig,
  );
  calendarsContainer.appendChild(rightCalendar);

  component.appendChild(calendarsContainer);

  // Footer
  var footer = await createFooter(sizeConfig);
  component.appendChild(footer);

  return component;
}

/**
 * Generate DateRangePicker ComponentSet
 *
 * Creates a "DateRangePicker" ComponentSet with base size only (for performance).
 * Other sizes (sm, lg) are available in code but not generated here.
 *
 * Variants generated:
 * - variant: default, subtle
 * - selected: false, true
 *
 * Creates both light and dark mode sections.
 *
 * @param page - Page to create components on
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateDateRangePickerComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Only generate base size for performance (sm, lg available in code)
  var sizesToGenerate = ["base"];

  // Generate combinations
  var components: ComponentNode[] = [];
  var rowLabels: { y: number; text: string }[] = [];
  var columnHeaders: { x: number; text: string }[] = [];

  var componentGapX = 24;
  var componentGapY = 40;
  var headerRowHeight = 24;
  var labelColumnWidth = 150;

  // Track layout by row (size)
  var rowComponents: Map<number, ComponentNode[]> = new Map();

  // Generate components for each combination
  for (var si = 0; si < sizesToGenerate.length; si++) {
    var size = sizesToGenerate[si];
    rowComponents.set(si, []);

    for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
      var variant = VARIANT_VALUES[vi];

      for (var seli = 0; seli < SELECTED_VALUES.length; seli++) {
        var selected = SELECTED_VALUES[seli];
        var component = await createDateRangePickerComponent(
          size,
          variant,
          selected,
        );
        var row = rowComponents.get(si);
        if (row) {
          row.push(component);
        }
        components.push(component);
      }
    }
  }

  // First pass: calculate max width per column and max height per row
  var columnWidths: number[] = [];
  var rowHeights: number[] = [];

  var numColumns = VARIANT_VALUES.length * SELECTED_VALUES.length;

  for (var colIdx = 0; colIdx < numColumns; colIdx++) {
    var maxColWidth = 0;
    for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
      var row = rowComponents.get(rowIdx);
      if (row) {
        var comp = row[colIdx];
        if (comp && comp.width > maxColWidth) {
          maxColWidth = comp.width;
        }
      }
    }
    columnWidths.push(maxColWidth);
  }

  for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
    var row = rowComponents.get(rowIdx);
    if (row) {
      var maxRowHeight = 0;
      for (var colIdx = 0; colIdx < row.length; colIdx++) {
        var comp = row[colIdx];
        if (comp && comp.height > maxRowHeight) {
          maxRowHeight = comp.height;
        }
      }
      rowHeights.push(maxRowHeight);
    }
  }

  // Second pass: position components
  var yOffset = headerRowHeight;

  for (var rowIdx = 0; rowIdx < sizesToGenerate.length; rowIdx++) {
    var row = rowComponents.get(rowIdx);
    if (row) {
      var xOffset = labelColumnWidth;
      var sizeValue = sizesToGenerate[rowIdx];

      rowLabels.push({
        y: yOffset,
        text: "size=" + sizeValue,
      });

      for (var colIdx = 0; colIdx < row.length; colIdx++) {
        var comp = row[colIdx];
        comp.x = xOffset;
        comp.y = yOffset;

        if (rowIdx === 0) {
          var variantIdx = Math.floor(colIdx / SELECTED_VALUES.length);
          var selectedIdx = colIdx % SELECTED_VALUES.length;
          var variantVal = VARIANT_VALUES[variantIdx];
          var selectedVal = SELECTED_VALUES[selectedIdx];
          columnHeaders.push({
            x: xOffset,
            text: "variant=" + variantVal + ", selected=" + selectedVal,
          });
        }

        xOffset = xOffset + columnWidths[colIdx] + componentGapX;
      }

      yOffset = yOffset + rowHeights[rowIdx] + componentGapY;
    }
  }

  // Combine into ComponentSet
  // @ts-ignore - combineAsVariants works at runtime
  var componentSet = figma.combineAsVariants(components, page);
  componentSet.name = "DateRangePicker";
  componentSet.description =
    "DateRangePicker component with variant and selected properties. " +
    "Showing base size only. Additional sizes (sm, lg) available in code.";
  componentSet.layoutMode = "NONE";

  // Calculate dimensions
  var contentWidth = componentSet.width + labelColumnWidth;
  var contentHeight = componentSet.height + headerRowHeight;

  // Create light mode section
  var lightSection = createModeSection(page, "DateRangePicker", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2,
  );

  // Create dark mode section
  var darkSection = createModeSection(page, "DateRangePicker", "dark");
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

  // Add note about other sizes
  var noteText = await createTextNode(
    "Note: sm and lg sizes also available in code",
    12,
    400,
  );
  noteText.name = "Size Note";
  var mutedVar = getVariableByName("text-color-muted");
  if (mutedVar) {
    bindTextColorToVariable(noteText, mutedVar.id);
  }
  noteText.x = SECTION_PADDING;
  noteText.y = SECTION_PADDING + yOffset + 16;
  lightSection.frame.appendChild(noteText);

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

  // Add note about other sizes to dark section
  var darkNoteText = await createTextNode(
    "Note: sm and lg sizes also available in code",
    12,
    400,
  );
  darkNoteText.name = "Size Note";
  if (mutedVar) {
    bindTextColorToVariable(darkNoteText, mutedVar.id);
  }
  darkNoteText.x = SECTION_PADDING;
  darkNoteText.y = SECTION_PADDING + yOffset + 16;
  darkSection.frame.appendChild(darkNoteText);

  // Resize sections (add extra height for note)
  var totalWidth = contentWidth + SECTION_PADDING * 2;
  var totalHeight = contentHeight + SECTION_PADDING * 2 + 40;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  // Position sections side by side
  lightSection.section.x = 100;
  lightSection.section.y = startY;

  darkSection.section.x = 100 + totalWidth + 50;
  darkSection.section.y = startY;

  logComplete(
    "✅ Generated DateRangePicker ComponentSet with " +
      components.length +
      " variants (base size only, light + dark)",
  );

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Exports for tests and backwards compatibility
 */
export var DATE_RANGE_PICKER_SIZE_VALUES = SIZE_VALUES;
export var DATE_RANGE_PICKER_VARIANT_VALUES = VARIANT_VALUES;
export var DATE_RANGE_PICKER_SELECTED_VALUES = SELECTED_VALUES;

/**
 * TESTABLE EXPORTS - Pure functions for testing without Figma API
 *
 * These exports enable structural + snapshot testing pattern.
 * They return intermediate data structures BEFORE Figma API calls.
 */

/**
 * Returns size configuration from SIZE_CONFIG (values from registry)
 */
export function getDateRangePickerSizeConfig() {
  return {
    values: SIZE_VALUES, // from registry
    config: SIZE_CONFIG, // hardcoded (TODO: extract from KUMO_DATE_RANGE_PICKER_VARIANTS)
    registryClasses: sizeProp.classes,
    registryDescriptions: sizeProp.descriptions,
  };
}

/**
 * Returns variant configuration from VARIANT_CONFIG (derived from registry)
 */
export function getDateRangePickerVariantConfig() {
  return {
    values: VARIANT_VALUES, // from registry
    config: VARIANT_CONFIG, // derived from registry classes
    registryClasses: variantProp.classes,
    registryDescriptions: variantProp.descriptions,
  };
}

/**
 * Returns selected state configuration
 */
export function getDateRangePickerSelectedConfig() {
  return {
    values: SELECTED_VALUES,
  };
}

/**
 * Returns size-specific dimensions for a given size
 */
export function getDateRangePickerSizeDimensions(size: string) {
  var sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG["base"];
  return {
    size: size,
    calendarWidth: sizeConfig.calendarWidth,
    cellHeight: sizeConfig.cellHeight,
    cellWidth: sizeConfig.cellWidth,
    textSize: sizeConfig.textSize,
    iconSize: sizeConfig.iconSize,
    padding: sizeConfig.padding,
    gap: sizeConfig.gap,
  };
}

/**
 * Returns variant-specific background variable
 */
export function getDateRangePickerVariantBackground(variant: string) {
  var variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG["default"];
  return {
    variant: variant,
    bgVariable: variantConfig.bgVariable,
  };
}

/**
 * Returns day-of-week labels
 */
export function getDateRangePickerDayLabels() {
  return DAYS_OF_WEEK;
}

/**
 * Returns month configuration for calendar display
 */
export function getDateRangePickerMonthConfig() {
  return MONTH_CONFIG;
}

/**
 * Returns complete intermediate data for all size/variant/selected combinations
 */
export function getAllDateRangePickerVariantData() {
  var allData: {
    size: string;
    variant: string;
    selected: boolean;
    sizeConfig: ReturnType<typeof getDateRangePickerSizeDimensions>;
    variantConfig: ReturnType<typeof getDateRangePickerVariantBackground>;
  }[] = [];

  for (var si = 0; si < SIZE_VALUES.length; si++) {
    var size = SIZE_VALUES[si];
    for (var vi = 0; vi < VARIANT_VALUES.length; vi++) {
      var variant = VARIANT_VALUES[vi];
      for (var seli = 0; seli < SELECTED_VALUES.length; seli++) {
        var selected = SELECTED_VALUES[seli];
        allData.push({
          size: size,
          variant: variant,
          selected: selected,
          sizeConfig: getDateRangePickerSizeDimensions(size),
          variantConfig: getDateRangePickerVariantBackground(variant),
        });
      }
    }
  }

  return {
    sizeConfig: getDateRangePickerSizeConfig(),
    variantConfig: getDateRangePickerVariantConfig(),
    selectedConfig: getDateRangePickerSelectedConfig(),
    dayLabels: getDateRangePickerDayLabels(),
    monthConfig: getDateRangePickerMonthConfig(),
    variants: allData,
  };
}
