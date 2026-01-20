/**
 * CommandPalette Component Generator
 *
 * Generates a CommandPalette component in Figma that matches
 * the CommandPalette component structure:
 *
 * - Dialog container with rounded corners and shadow
 * - Search input header with magnifying glass icon
 * - Results list with grouped items (normal + highlighted states)
 * - ResultItem with breadcrumbs, icons, and arrows
 * - Footer with keyboard hints
 *
 * The CommandPalette is a compound component used for search/command interfaces.
 * Since it doesn't have traditional variants, we show the full structure.
 *
 * @see packages/kumo/src/components/command-palette/command-palette.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  bindFillToVariable,
  bindTextColorToVariable,
  bindStrokeToVariable,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
  SECTION_LAYOUT,
  FONT_SIZE,
  FALLBACK_VALUES,
  SPACING,
  SHADOWS,
} from "./shared";
import { getButtonIcon, bindIconColor } from "./icon-utils";
import { logComplete } from "../logger";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import themeData from "../generated/theme-data.json";

/**
 * Tailwind classes extracted from command-palette.tsx
 * These serve as the source of truth for styling
 */
const COMPONENT_CLASSES = {
  // Container: "flex max-h-[60vh] flex-col overflow-hidden rounded-lg bg-surface-2"
  container: "rounded-lg bg-surface-2",
  // Dialog popup: "fixed top-[10vh] left-1/2 w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-lg"
  dialog: "max-w-2xl rounded-lg",
  // Input header: "flex items-center gap-3 bg-surface-elevated px-4 py-3"
  inputHeader: "gap-3 bg-surface-elevated px-4 py-3",
  // Search icon: "h-4 w-4 text-muted"
  searchIcon: "h-4 w-4 text-muted",
  // Input: "flex-1 border-none bg-transparent text-base placeholder:text-muted"
  input: "text-base",
  // List: "z-10 min-h-0 flex-1 overflow-y-auto rounded-b-lg bg-surface-elevated px-2 py-2 ring-1 ring-border"
  list: "rounded-b-lg bg-surface-elevated px-2 py-2 ring-1 ring-border",
  // Group: "space-y-0.5"
  group: "space-y-0.5",
  // Group label: "mb-2 px-2 pt-1 text-xs font-semibold text-label"
  groupLabel: "px-2 pt-1 text-xs font-semibold text-label",
  // Item: "flex w-full items-center gap-3 px-2 py-1.5 text-left cursor-pointer data-[highlighted]:bg-subtle rounded-lg"
  item: "gap-3 px-2 py-1.5 rounded-lg",
  itemHighlighted: "bg-subtle",
  // ResultItem icon container: "flex flex-shrink-0 items-center text-muted"
  resultIcon: "text-muted",
  // ResultItem title: "text-base text-surface"
  resultTitle: "text-base text-surface",
  // ResultItem breadcrumb separator: "h-3 w-3 flex-shrink-0 text-muted"
  breadcrumbSeparator: "h-3 w-3 text-muted",
  // ResultItem arrow: "h-4 w-4 flex-shrink-0 text-muted opacity-0 transition-opacity group-data-[highlighted]:opacity-100"
  resultArrow: "h-4 w-4 text-muted",
  // External icon: "h-3.5 w-3.5 flex-shrink-0 text-muted"
  externalIcon: "h-3.5 w-3.5 text-muted",
  // Empty state: "p-8 text-center text-label"
  empty: "p-8 text-label",
  // Loading: "flex items-center justify-center p-8"
  loading: "p-8",
  // Footer: "flex items-center justify-between rounded-b-lg bg-surface-2 px-4 py-3 text-xs text-label"
  footer: "rounded-b-lg bg-surface-2 px-4 py-3 text-xs text-label",
  // Highlight mark: "rounded-sm bg-alert/50 text-surface"
  highlightMark: "rounded-sm bg-alert/50 text-surface",
};

/**
 * CommandPalette configuration derived from Tailwind classes
 * Uses parseTailwindClasses and theme-data for all values
 */
const CONFIG = {
  // max-w-2xl = 42rem = 672px (from Tailwind defaults)
  width: 42 * 16, // 672px
  // Approximate max height for Figma representation
  maxHeight: 400,
  // py-3 = 12px * 2 + icon height
  inputHeight:
    (themeData.tailwind.spacing.scale["3"] || 12) * 2 +
    (themeData.tailwind.spacing.scale["4"] || 16),
  // py-3 = 12px * 2 + text
  footerHeight:
    (themeData.tailwind.spacing.scale["3"] || 12) * 2 +
    (themeData.kumo.fontSize.xs || 12),
  // py-1.5 = 6px * 2 + content
  itemHeight:
    (themeData.tailwind.spacing.scale["1.5"] || 6) * 2 +
    (themeData.kumo.fontSize.base || 14),
  // text-xs + pt-1 + mb-2
  groupLabelHeight:
    (themeData.kumo.fontSize.xs || 12) +
    (themeData.tailwind.spacing.scale["1"] || 4) +
    (themeData.tailwind.spacing.scale["2"] || 8),
};

/**
 * Create the search input header
 * Styles from: "flex items-center gap-3 bg-surface-elevated px-4 py-3"
 */
async function createInputHeader(): Promise<FrameNode> {
  const styles = parseTailwindClasses(COMPONENT_CLASSES.inputHeader);

  const header = figma.createFrame();
  header.name = "Input Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "CENTER";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.resize(CONFIG.width, CONFIG.inputHeight);

  // px-4 py-3 from parsed classes
  header.paddingLeft = styles.paddingX || FALLBACK_VALUES.padding.standard;
  header.paddingRight = styles.paddingX || FALLBACK_VALUES.padding.standard;
  header.paddingTop = styles.paddingY || FALLBACK_VALUES.padding.horizontal;
  header.paddingBottom = styles.paddingY || FALLBACK_VALUES.padding.horizontal;
  // gap-3 from parsed classes
  header.itemSpacing = styles.gap || SPACING.lg;

  // bg-surface-elevated from parsed classes
  if (styles.fillVariable) {
    const bgVar = getVariableByName(styles.fillVariable);
    if (bgVar) {
      bindFillToVariable(header, bgVar.id);
    }
  }

  // Magnifying glass icon (h-4 w-4 text-muted)
  const iconStyles = parseTailwindClasses(COMPONENT_CLASSES.searchIcon);
  const searchIcon = getButtonIcon("ph-magnifying-glass", "sm");
  searchIcon.name = "Search Icon";
  bindIconColor(searchIcon, "text-muted");
  header.appendChild(searchIcon);

  // Search input placeholder text (text-base)
  const inputStyles = parseTailwindClasses(COMPONENT_CLASSES.input);
  const placeholder = await createTextNode(
    "Search...",
    inputStyles.fontSize || FONT_SIZE.base,
    FALLBACK_VALUES.fontWeight.normal,
  );
  placeholder.name = "Placeholder";
  placeholder.layoutGrow = 1;
  const mutedVar = getVariableByName("text-color-muted");
  if (mutedVar) {
    bindTextColorToVariable(placeholder, mutedVar.id);
  }
  header.appendChild(placeholder);

  return header;
}

/**
 * Create a result item
 * Styles from: "flex w-full items-center gap-3 px-2 py-1.5 text-left cursor-pointer rounded-lg"
 *
 * @param title - Item title text
 * @param highlighted - Whether to show highlighted (bg-subtle) state
 * @param showArrow - Whether to show the arrow indicator
 * @param breadcrumbs - Optional breadcrumb path before title
 * @param iconName - Icon to show (defaults to ph-file)
 */
async function createResultItem(
  title: string,
  highlighted: boolean = false,
  showArrow: boolean = true,
  breadcrumbs?: string[],
  iconName: string = "ph-file",
): Promise<FrameNode> {
  const styles = parseTailwindClasses(COMPONENT_CLASSES.item);

  const item = figma.createFrame();
  item.name = highlighted ? "Result Item (highlighted)" : "Result Item";
  item.layoutMode = "HORIZONTAL";
  item.primaryAxisAlignItems = "CENTER";
  item.counterAxisAlignItems = "CENTER";
  item.primaryAxisSizingMode = "AUTO";
  item.counterAxisSizingMode = "AUTO";
  item.layoutAlign = "STRETCH";

  // px-2 py-1.5 from parsed classes
  item.paddingLeft = styles.paddingX || SPACING.base;
  item.paddingRight = styles.paddingX || SPACING.base;
  item.paddingTop = styles.paddingY || SPACING.sm;
  item.paddingBottom = styles.paddingY || SPACING.sm;
  // gap-3 from parsed classes
  item.itemSpacing = styles.gap || SPACING.lg;
  // rounded-lg from parsed classes
  item.cornerRadius = styles.borderRadius || BORDER_RADIUS.lg;

  // Background: transparent normally, bg-subtle when highlighted
  if (highlighted) {
    const highlightStyles = parseTailwindClasses(
      COMPONENT_CLASSES.itemHighlighted,
    );
    if (highlightStyles.fillVariable) {
      const bgVar = getVariableByName(highlightStyles.fillVariable);
      if (bgVar) {
        bindFillToVariable(item, bgVar.id);
      }
    }
  } else {
    item.fills = [];
  }

  // Item icon (text-muted)
  const icon = getButtonIcon(iconName, "sm");
  icon.name = "Icon";
  bindIconColor(icon, "text-muted");
  item.appendChild(icon);

  // Content wrapper for breadcrumbs + title
  const contentWrapper = figma.createFrame();
  contentWrapper.name = "Content";
  contentWrapper.layoutMode = "HORIZONTAL";
  contentWrapper.primaryAxisSizingMode = "AUTO";
  contentWrapper.counterAxisSizingMode = "AUTO";
  contentWrapper.layoutGrow = 1;
  contentWrapper.itemSpacing = SPACING.base;
  contentWrapper.fills = [];

  // Add breadcrumbs if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    for (const crumb of breadcrumbs) {
      // Breadcrumb text
      const crumbText = await createTextNode(
        crumb,
        FONT_SIZE.base,
        FALLBACK_VALUES.fontWeight.normal,
      );
      crumbText.name = "Breadcrumb";
      const surfaceVar = getVariableByName("text-color-surface");
      if (surfaceVar) {
        bindTextColorToVariable(crumbText, surfaceVar.id);
      }
      contentWrapper.appendChild(crumbText);

      // Separator icon (CaretRightIcon)
      const separator = getButtonIcon("ph-caret-right", "xs");
      separator.name = "Separator";
      bindIconColor(separator, "text-muted");
      contentWrapper.appendChild(separator);
    }
  }

  // Title text (text-base text-surface)
  const titleStyles = parseTailwindClasses(COMPONENT_CLASSES.resultTitle);
  const titleText = await createTextNode(
    title,
    titleStyles.fontSize || FONT_SIZE.base,
    FALLBACK_VALUES.fontWeight.normal,
  );
  titleText.name = "Title";
  if (titleStyles.textVariable) {
    const textVar = getVariableByName(titleStyles.textVariable);
    if (textVar) {
      bindTextColorToVariable(titleText, textVar.id);
    }
  }
  contentWrapper.appendChild(titleText);

  item.appendChild(contentWrapper);

  // Arrow icon (shown when highlighted)
  if (showArrow && highlighted) {
    const arrowStyles = parseTailwindClasses(COMPONENT_CLASSES.resultArrow);
    const arrow = getButtonIcon("ph-arrow-right", "sm");
    arrow.name = "Arrow";
    bindIconColor(arrow, "text-muted");
    item.appendChild(arrow);
  }

  return item;
}

/**
 * Create a group label
 * Styles from: "mb-2 px-2 pt-1 text-xs font-semibold text-label"
 */
async function createGroupLabel(text: string): Promise<FrameNode> {
  const styles = parseTailwindClasses(COMPONENT_CLASSES.groupLabel);

  // Wrap in frame for padding
  const wrapper = figma.createFrame();
  wrapper.name = "Group Label";
  wrapper.layoutMode = "HORIZONTAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "AUTO";
  wrapper.paddingLeft = styles.paddingX || SPACING.base;
  wrapper.paddingRight = styles.paddingX || SPACING.base;
  wrapper.paddingTop = SPACING.xs; // pt-1
  wrapper.fills = [];

  const label = await createTextNode(
    text,
    styles.fontSize || FONT_SIZE.xs,
    styles.fontWeight || FALLBACK_VALUES.fontWeight.semiBold,
  );
  label.name = "Label Text";

  // text-label
  if (styles.textVariable) {
    const labelVar = getVariableByName(styles.textVariable);
    if (labelVar) {
      bindTextColorToVariable(label, labelVar.id);
    }
  }

  wrapper.appendChild(label);
  return wrapper;
}

/**
 * Create the results list
 * Styles from: "z-10 min-h-0 flex-1 overflow-y-auto rounded-b-lg bg-surface-elevated px-2 py-2 ring-1 ring-border"
 */
async function createResultsList(): Promise<FrameNode> {
  const styles = parseTailwindClasses(COMPONENT_CLASSES.list);

  const list = figma.createFrame();
  list.name = "Results List";
  list.layoutMode = "VERTICAL";
  list.primaryAxisSizingMode = "AUTO";
  list.counterAxisSizingMode = "FIXED";
  list.resize(CONFIG.width, 100);

  // px-2 py-2 from parsed classes
  list.paddingLeft = styles.paddingX || SPACING.base;
  list.paddingRight = styles.paddingX || SPACING.base;
  list.paddingTop = styles.paddingY || SPACING.base;
  list.paddingBottom = styles.paddingY || SPACING.base;
  // space-y-0.5 from group class
  list.itemSpacing = themeData.tailwind.spacing.scale["0.5"] || 2;

  // bg-surface-elevated from parsed classes
  if (styles.fillVariable) {
    const bgVar = getVariableByName(styles.fillVariable);
    if (bgVar) {
      bindFillToVariable(list, bgVar.id);
    }
  }

  // ring-1 ring-border from parsed classes
  if (styles.strokeVariable) {
    const borderVar = getVariableByName(styles.strokeVariable);
    if (borderVar) {
      bindStrokeToVariable(list, borderVar.id, styles.strokeWeight || 1);
    }
  }

  // rounded-b-lg - only bottom corners
  list.cornerRadius = styles.borderRadius || BORDER_RADIUS.lg;

  // Add first group with normal items
  const group1Frame = figma.createFrame();
  group1Frame.name = "Group: Recent";
  group1Frame.layoutMode = "VERTICAL";
  group1Frame.primaryAxisSizingMode = "AUTO";
  group1Frame.counterAxisSizingMode = "AUTO";
  group1Frame.layoutAlign = "STRETCH";
  group1Frame.itemSpacing = themeData.tailwind.spacing.scale["0.5"] || 2;
  group1Frame.fills = [];

  // Group label
  const groupLabel1 = await createGroupLabel("Recent");
  group1Frame.appendChild(groupLabel1);

  // Add sample items - first one highlighted to show the pattern
  const item1 = await createResultItem(
    "Dashboard",
    true,
    true,
    undefined,
    "ph-squares-four",
  );
  group1Frame.appendChild(item1);

  const item2 = await createResultItem(
    "Settings",
    false,
    true,
    undefined,
    "ph-gear",
  );
  group1Frame.appendChild(item2);

  list.appendChild(group1Frame);

  // Add second group with breadcrumb example
  const group2Frame = figma.createFrame();
  group2Frame.name = "Group: Navigation";
  group2Frame.layoutMode = "VERTICAL";
  group2Frame.primaryAxisSizingMode = "AUTO";
  group2Frame.counterAxisSizingMode = "AUTO";
  group2Frame.layoutAlign = "STRETCH";
  group2Frame.itemSpacing = themeData.tailwind.spacing.scale["0.5"] || 2;
  group2Frame.fills = [];

  const groupLabel2 = await createGroupLabel("Navigation");
  group2Frame.appendChild(groupLabel2);

  // Item with breadcrumbs
  const itemWithBreadcrumbs = await createResultItem(
    "VPC",
    false,
    true,
    ["Compute", "Workers"],
    "ph-cloud",
  );
  group2Frame.appendChild(itemWithBreadcrumbs);

  list.appendChild(group2Frame);

  return list;
}

/**
 * Create the footer with keyboard hints
 * Styles from: "flex items-center justify-between rounded-b-lg bg-surface-2 px-4 py-3 text-xs text-label"
 */
async function createFooter(): Promise<FrameNode> {
  const styles = parseTailwindClasses(COMPONENT_CLASSES.footer);

  const footer = figma.createFrame();
  footer.name = "Footer";
  footer.layoutMode = "HORIZONTAL";
  footer.primaryAxisAlignItems = "SPACE_BETWEEN";
  footer.counterAxisAlignItems = "CENTER";
  footer.primaryAxisSizingMode = "FIXED";
  footer.counterAxisSizingMode = "AUTO";
  footer.resize(CONFIG.width, CONFIG.footerHeight);

  // px-4 py-3 from parsed classes
  footer.paddingLeft = styles.paddingX || FALLBACK_VALUES.padding.standard;
  footer.paddingRight = styles.paddingX || FALLBACK_VALUES.padding.standard;
  footer.paddingTop = styles.paddingY || FALLBACK_VALUES.padding.horizontal;
  footer.paddingBottom = styles.paddingY || FALLBACK_VALUES.padding.horizontal;

  // rounded-b-lg from parsed classes
  footer.cornerRadius = styles.borderRadius || BORDER_RADIUS.lg;

  // bg-surface-2 from parsed classes
  if (styles.fillVariable) {
    const bgVar = getVariableByName(styles.fillVariable);
    if (bgVar) {
      bindFillToVariable(footer, bgVar.id);
    }
  }

  // Keyboard hints text (text-xs text-label)
  const hints = await createTextNode(
    "↑↓ Navigate  ↵ Select  ⌘↵ New tab  Esc Close",
    styles.fontSize || FONT_SIZE.xs,
    FALLBACK_VALUES.fontWeight.normal,
  );
  hints.name = "Hints";

  // text-label from parsed classes
  if (styles.textVariable) {
    const labelVar = getVariableByName(styles.textVariable);
    if (labelVar) {
      bindTextColorToVariable(hints, labelVar.id);
    }
  }
  footer.appendChild(hints);

  return footer;
}

/**
 * Create a single CommandPalette component
 * Container styles from: "flex max-h-[60vh] flex-col overflow-hidden rounded-lg bg-surface-2"
 */
async function createCommandPaletteComponent(): Promise<ComponentNode> {
  const containerStyles = parseTailwindClasses(COMPONENT_CLASSES.container);

  const component = figma.createComponent();
  component.name = "CommandPalette";
  component.description =
    "Command palette for search and navigation. Compound component with Input, List, Groups, Items, and Footer sub-components. Use for global search, command menus, and quick actions.";

  // Set up vertical auto-layout
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(CONFIG.width, 100);
  component.itemSpacing = 0;

  // rounded-lg from parsed classes
  component.cornerRadius = containerStyles.borderRadius || BORDER_RADIUS.lg;
  component.clipsContent = true;

  // bg-surface-2 from parsed classes
  if (containerStyles.fillVariable) {
    const bgVar = getVariableByName(containerStyles.fillVariable);
    if (bgVar) {
      bindFillToVariable(component, bgVar.id);
    }
  }

  // Apply dialog shadow (consistent with Dialog component)
  component.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: SHADOWS.dialog.opacity },
      offset: { x: SHADOWS.dialog.offsetX, y: SHADOWS.dialog.offsetY },
      radius: SHADOWS.dialog.blur,
      spread: SHADOWS.dialog.spread,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  // Create and add sections
  const inputHeader = await createInputHeader();
  component.appendChild(inputHeader);

  const resultsList = await createResultsList();
  component.appendChild(resultsList);

  const footer = await createFooter();
  component.appendChild(footer);

  return component;
}

/**
 * Generate CommandPalette component
 *
 * Creates a "CommandPalette" component with light and dark mode sections.
 *
 * @param page - The page to add components to
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateCommandPaletteComponents(
  page: PageNode,
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  figma.currentPage = page;

  // Create the component
  const component = await createCommandPaletteComponent();

  // Calculate content dimensions
  const contentWidth = component.width;
  const contentHeight = component.height;

  // Create light mode section
  const lightSection = createModeSection(page, "CommandPalette", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2 + 40, // Extra for title
  );

  // Create dark mode section
  const darkSection = createModeSection(page, "CommandPalette", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2 + 40,
  );

  // Move component into light section
  lightSection.frame.appendChild(component);
  component.x = SECTION_PADDING;
  component.y = SECTION_PADDING + 40;

  // Create instance for dark section
  const darkInstance = component.createInstance();
  darkInstance.x = SECTION_PADDING;
  darkInstance.y = SECTION_PADDING + 40;
  darkSection.frame.appendChild(darkInstance);

  // Position sections
  const totalWidth = contentWidth + SECTION_PADDING * 2;
  const totalHeight = contentHeight + SECTION_PADDING * 2 + 40;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  lightSection.frame.x = SECTION_LAYOUT.startX;
  lightSection.frame.y = startY;

  darkSection.frame.x =
    lightSection.frame.x + totalWidth + SECTION_LAYOUT.modeGap;
  darkSection.frame.y = startY;

  logComplete("Generated CommandPalette component (light + dark)");

  return startY + totalHeight + SECTION_GAP;
}

/**
 * Testable export functions for test suite
 */

/**
 * Get CommandPalette configuration derived from Tailwind classes
 * @returns Configuration object with layout dimensions
 */
export function getCommandPaletteConfig() {
  return CONFIG;
}

/**
 * Get the Tailwind classes used by the component
 * @returns Object with all component class strings
 */
export function getCommandPaletteClasses() {
  return COMPONENT_CLASSES;
}

/**
 * Get parsed styles for a specific component part
 * @param part - Component part key from COMPONENT_CLASSES
 * @returns Parsed styles from Tailwind classes
 */
export function getParsedStyles(part: keyof typeof COMPONENT_CLASSES) {
  return parseTailwindClasses(COMPONENT_CLASSES[part]);
}

/**
 * Get complete variant data for snapshot testing
 * @returns All configuration and parsed styles for the component
 */
export function getAllCommandPaletteData() {
  const parsedStyles: Record<
    string,
    ReturnType<typeof parseTailwindClasses>
  > = {};

  // Parse all component classes
  for (const [key, classes] of Object.entries(COMPONENT_CLASSES)) {
    parsedStyles[key] = parseTailwindClasses(classes);
  }

  return {
    config: CONFIG,
    classes: COMPONENT_CLASSES,
    parsedStyles,
    subComponents: [
      "Dialog",
      "Root",
      "Panel",
      "Input",
      "List",
      "Group",
      "GroupLabel",
      "Item",
      "ResultItem",
      "HighlightedText",
      "Empty",
      "Loading",
      "Footer",
      "Results",
      "Items",
    ],
  };
}

/**
 * Get base configuration for tests
 * @returns Base styling configuration
 */
export function getBaseConfig() {
  return {
    width: CONFIG.width,
    background: "color-surface-2",
    shadow: SHADOWS.dialog,
    borderRadius: BORDER_RADIUS.lg,
    sections: {
      inputHeader: {
        background: "color-surface-elevated",
        padding: parseTailwindClasses(COMPONENT_CLASSES.inputHeader),
      },
      list: {
        background: "color-surface-elevated",
        border: "color-border",
        padding: parseTailwindClasses(COMPONENT_CLASSES.list),
      },
      footer: {
        background: "color-surface-2",
        textColor: "text-color-label",
        padding: parseTailwindClasses(COMPONENT_CLASSES.footer),
      },
    },
    item: {
      normalBackground: null,
      highlightedBackground: "color-subtle",
      textColor: "text-color-surface",
      iconColor: "text-muted",
      padding: parseTailwindClasses(COMPONENT_CLASSES.item),
    },
  };
}
