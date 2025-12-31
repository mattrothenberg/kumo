/**
 * Placeholder component generator for Kumo Figma plugin
 *
 * Generates utility components:
 * - Placeholder icons (12×12, 16×16, 20×20) for button instance swapping
 * - Loader component for button loading states
 */

/**
 * Generated placeholder components returned for use in button generators
 */
export type PlaceholderComponents = {
  /** 12×12 placeholder icon for xs buttons */
  placeholderIcon12: ComponentNode;
  /** 16×16 placeholder icon for sm/base buttons */
  placeholderIcon16: ComponentNode;
  /** 20×20 placeholder icon for lg buttons */
  placeholderIcon20: ComponentNode;
  /** Loader component for loading states */
  loader: ComponentNode;
};

/**
 * Creates a placeholder icon component
 * Uses a simple rounded rectangle that represents an icon slot
 *
 * @param size - Icon size in pixels (12, 16, or 20)
 * @param name - Component name
 * @returns ComponentNode with a simple icon placeholder
 */
function createPlaceholderIcon(size: number, name: string): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.resize(size, size);

  // Create a rounded rectangle as the icon placeholder
  const rect = figma.createRectangle();
  rect.resize(size, size);
  rect.x = 0;
  rect.y = 0;
  rect.cornerRadius = size * 0.2; // Slightly rounded corners

  // Use a medium gray fill
  rect.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.6 } }];

  component.appendChild(rect);

  return component;
}

/**
 * Creates a circular loader/spinner component
 *
 * @returns ComponentNode with a circular spinner shape
 */
function createLoader(): ComponentNode {
  const component = figma.createComponent();
  component.name = "Loader";
  component.resize(16, 16);

  // Create circle with stroke (spinner ring)
  const spinner = figma.createEllipse();
  spinner.resize(16, 16);
  spinner.x = 0;
  spinner.y = 0;

  // Transparent fill, visible stroke
  spinner.fills = [];
  spinner.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
  spinner.strokeWeight = 2;
  spinner.strokeAlign = "CENTER";

  // Dashed stroke to create spinner appearance
  spinner.dashPattern = [4, 4];

  component.appendChild(spinner);

  return component;
}

/**
 * Find or create the Utilities page
 * Reuses existing page if found, creates new one otherwise
 */
function getOrCreateUtilitiesPage(): PageNode {
  // Find existing Utilities page (case-insensitive, trimmed)
  let utilitiesPage = figma.root.children.find(
    (page) =>
      page.type === "PAGE" && page.name.trim().toLowerCase() === "utilities",
  ) as PageNode | undefined;

  if (utilitiesPage) {
    console.log("✅ Found existing Utilities page");
  } else {
    console.log("📄 Creating new Utilities page");
    utilitiesPage = figma.createPage();
    utilitiesPage.name = "Utilities";
  }

  return utilitiesPage;
}

/**
 * Purge all children from the Utilities page
 */
function purgeUtilitiesPage(): void {
  const utilitiesPage = figma.root.children.find(
    (page) =>
      page.type === "PAGE" && page.name.trim().toLowerCase() === "utilities",
  ) as PageNode | undefined;

  if (utilitiesPage) {
    const children = [...utilitiesPage.children];
    console.log(`🗑️ Purging ${children.length} items from Utilities page`);
    for (const node of children) {
      node.remove();
    }
  }
}

/**
 * Generates all placeholder components on a "Utilities" page
 *
 * Creates:
 * - Placeholder Icon 12 (12×12 circle)
 * - Placeholder Icon 16 (16×16 circle)
 * - Placeholder Icon 20 (20×20 circle)
 * - Loader (16×16 spinner)
 *
 * @returns Object containing references to all generated components
 */
export function generatePlaceholderComponents(): PlaceholderComponents {
  // Purge existing content first
  purgeUtilitiesPage();

  // Get or create Utilities page
  const page = getOrCreateUtilitiesPage();

  // Generate placeholder icons
  const placeholderIcon12 = createPlaceholderIcon(12, "Placeholder Icon 12");
  const placeholderIcon16 = createPlaceholderIcon(16, "Placeholder Icon 16");
  const placeholderIcon20 = createPlaceholderIcon(20, "Placeholder Icon 20");

  // Generate loader
  const loader = createLoader();

  // Add all components to page
  page.appendChild(placeholderIcon12);
  page.appendChild(placeholderIcon16);
  page.appendChild(placeholderIcon20);
  page.appendChild(loader);

  // Layout components in a row with spacing
  placeholderIcon12.x = 0;
  placeholderIcon12.y = 0;

  placeholderIcon16.x = 50;
  placeholderIcon16.y = 0;

  placeholderIcon20.x = 100;
  placeholderIcon20.y = 0;

  loader.x = 150;
  loader.y = 0;

  return {
    placeholderIcon12,
    placeholderIcon16,
    placeholderIcon20,
    loader,
  };
}
