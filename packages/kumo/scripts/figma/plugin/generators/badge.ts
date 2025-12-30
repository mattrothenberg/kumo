/**
 * Badge Component Generator
 *
 * Generates 5 Badge ComponentSets in Figma:
 * - Primary, Secondary, Destructive, Outline, Beta
 *
 * Each ComponentSet contains a single component (no state variants).
 * Structure: Horizontal auto-layout with text label.
 */

import {
  createTextNode,
  bindFillToVariable,
  bindStrokeToVariable,
  getVariableByName,
  getOrCreateSection,
  BORDER_RADIUS,
  FONT_SIZE,
} from "./shared";

/**
 * Badge variant specifications from badge.tsx KUMO_BADGE_VARIANTS
 */
const BADGE_VARIANTS = {
  primary: {
    fillVariable: "surface-inverse",
    textVariable: "surface-inverse",
    description: "Default high-emphasis badge for important labels",
    border: null,
  },
  secondary: {
    fillVariable: "color",
    textVariable: "surface",
    description: "Subtle badge for secondary information",
    border: null,
  },
  destructive: {
    fillVariable: "error",
    textVariable: null, // white color, not a variable
    description: "Error or danger state indicator",
    border: null,
  },
  outline: {
    fillVariable: null, // transparent
    textVariable: "surface",
    description: "Bordered badge with transparent background",
    border: { variable: "color", style: "solid" as const },
  },
  beta: {
    fillVariable: null, // transparent
    textVariable: "info",
    description: "Indicates beta or experimental features",
    border: { variable: "primary", style: "dashed" as const },
  },
} as const;

/**
 * Badge size specifications from badgeVariants() base styles
 */
const BADGE_SIZE = {
  paddingX: 8,
  paddingY: 2,
  borderRadius: BORDER_RADIUS.full, // 9999px - full rounded
  fontSize: FONT_SIZE.xs, // 12px
  fontWeight: 500, // medium
} as const;

/**
 * Helper to set white text color (not a variable)
 */
function setWhiteTextColor(textNode: TextNode): void {
  const fill: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 },
  };

  textNode.fills = [fill];
}

/**
 * Helper to bind text color to a variable
 */
function bindTextColorToVariable(textNode: TextNode, variableId: string): void {
  const fill: SolidPaint = {
    type: "SOLID",
    color: { r: 1, g: 1, b: 1 }, // Fallback color
  };

  textNode.setBoundVariable("fills", {
    type: "VARIABLE_ALIAS",
    id: variableId,
  });

  textNode.fills = [fill];
}

/**
 * Create a single Badge component with the specified variant
 */
async function createBadgeComponent(
  variant: keyof typeof BADGE_VARIANTS,
): Promise<ComponentNode> {
  const spec = BADGE_VARIANTS[variant];

  // Create component
  const component = figma.createComponent();
  component.name = `Badge ${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  component.description = spec.description;

  // Set up auto-layout
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = BADGE_SIZE.paddingX;
  component.paddingRight = BADGE_SIZE.paddingX;
  component.paddingTop = BADGE_SIZE.paddingY;
  component.paddingBottom = BADGE_SIZE.paddingY;
  component.primaryAxisSizingMode = "AUTO"; // Hug contents
  component.counterAxisSizingMode = "AUTO"; // Hug contents
  component.cornerRadius = BADGE_SIZE.borderRadius;

  // Apply fill
  if (spec.fillVariable) {
    const fillVar = getVariableByName(spec.fillVariable);
    if (fillVar) {
      bindFillToVariable(component, fillVar.id);
    }
  } else {
    // Transparent background
    component.fills = [];
  }

  // Apply border if specified
  if (spec.border) {
    const borderVar = getVariableByName(spec.border.variable);
    if (borderVar) {
      bindStrokeToVariable(component, borderVar.id, 1);

      // Set dashed pattern for beta variant
      if (spec.border.style === "dashed") {
        component.dashPattern = [4, 4]; // 4px dash, 4px gap
      }
    }
  }

  // Create text label
  const textNode = await createTextNode(
    "Badge",
    BADGE_SIZE.fontSize,
    BADGE_SIZE.fontWeight,
  );
  textNode.name = "Label";

  // Apply text color
  if (spec.textVariable) {
    const textVar = getVariableByName(spec.textVariable);
    if (textVar) {
      bindTextColorToVariable(textNode, textVar.id);
    }
  } else {
    // White text (destructive variant)
    setWhiteTextColor(textNode);
  }

  // Add text to component
  component.appendChild(textNode);

  return component;
}

/**
 * Generate all Badge components in a section on the Components page
 */
export async function generateBadgeComponents(): Promise<void> {
  // Find or create Components page
  let componentsPage = figma.root.children.find(
    (page) => page.type === "PAGE" && page.name === "Components",
  ) as PageNode | undefined;

  if (!componentsPage) {
    componentsPage = figma.createPage();
    componentsPage.name = "Components";
  }

  // Switch to Components page
  figma.currentPage = componentsPage;

  // Create Badge section
  const section = getOrCreateSection(componentsPage, "Badge");

  // Generate each variant
  const variants = Object.keys(BADGE_VARIANTS) as Array<
    keyof typeof BADGE_VARIANTS
  >;
  const components: ComponentNode[] = [];

  for (const variant of variants) {
    const component = await createBadgeComponent(variant);
    section.appendChild(component);
    components.push(component);
  }

  // Position components horizontally with spacing
  let xOffset = 0;
  const spacing = 24;

  for (const component of components) {
    component.x = xOffset;
    component.y = 0;
    xOffset += component.width + spacing;
  }

  // Position section on page
  section.x = 100;
  section.y = 100;

  console.log(`✅ Generated ${variants.length} Badge components`);
}
