/**
 * Icon Library Generator
 *
 * Generates an "Icon Library" page in Figma with all icons from sprite.svg.
 * Creates Figma components for each icon using figma.createNodeFromSvg().
 *
 * Features:
 * - Forward-slash naming: "Icon/ph-check", "Icon/cf-workers-outline"
 * - Vector constraints set to SCALE for proper resizing
 * - Fill color bound to semantic token (text/surface) if available
 * - Grid layout: 20 icons per row, 48px spacing, 24px icon size
 * - Size examples frame: 16px, 20px, 24px variants
 *
 * IMPORTANT: Run `npx tsx scripts/figma/plugin/build-icon-data.ts` before
 * building the plugin to generate the icon data JSON.
 *
 * @see packages/kumo/scripts/figma/plugin/build-icon-data.ts
 */

// Icon data is generated at build time by build-icon-data.ts
// esbuild will inline this JSON into the bundle
import iconData from "../generated/icon-data.json";
import {
  getVariableByName,
  bindFillToVariable,
  SECTION_LAYOUT,
  COLORS,
} from "./shared";

/**
 * Icon data extracted from sprite.svg
 */
export type IconData = {
  /** Icon ID (e.g., "ph-arrow-right", "cf-workers-outline") */
  id: string;
  /** SVG viewBox attribute (e.g., "0 0 256 256") */
  viewBox: string;
  /** Inner SVG content (paths, groups, etc.) */
  content: string;
};

/**
 * Configuration for icon library generation
 */
export type IconLibraryConfig = {
  /** Name of the page to create (default: "Icon Library") */
  pageName?: string;
  /** Number of icons per row in grid (default: 20) */
  iconsPerRow?: number;
  /** Spacing between icons in pixels (default: 48) */
  iconSpacing?: number;
  /** Default icon size in pixels (default: 24) */
  defaultIconSize?: number;
  /** Show size examples frame (default: true) */
  showSizeExamples?: boolean;
  /** Size example dimensions in pixels (default: [16, 20, 24]) */
  sizeExampleDimensions?: number[];
};

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<IconLibraryConfig> = {
  pageName: "Icon Library",
  iconsPerRow: 20,
  iconSpacing: 48,
  defaultIconSize: 24,
  showSizeExamples: true,
  sizeExampleDimensions: [16, 20, 24],
};

/**
 * Create a Figma component from an icon's SVG data
 *
 * Follows UIPrep best practices:
 * - Frame → Vector structure (frame defines bounds, vector defines shape)
 * - 2px internal padding for visual consistency
 * - Vector constraints set to SCALE
 * - Fill bound to text/surface semantic token
 *
 * @param iconData - Icon data from sprite parser
 * @param size - Icon size in pixels
 * @returns Figma component node
 */
async function createIconComponent(
  iconData: IconData,
  size: number,
): Promise<ComponentNode> {
  // Create wrapper frame for component
  const component = figma.createComponent();
  component.name = `Icon/${iconData.id}`;
  component.description = `Icon: ${iconData.id}`;

  // Set fixed size (frame defines bounds)
  component.resize(size, size);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";

  // Transparent background
  component.fills = [];

  // UIPrep: 2px internal padding
  const padding = 2;
  component.paddingTop = padding;
  component.paddingRight = padding;
  component.paddingBottom = padding;
  component.paddingLeft = padding;

  // Create SVG node from icon content
  // Wrap content in <svg> tag with viewBox from iconData
  const svgString = `<svg viewBox="${iconData.viewBox}" xmlns="http://www.w3.org/2000/svg">${iconData.content}</svg>`;

  try {
    const svgNode = figma.createNodeFromSvg(svgString);
    svgNode.name = "Vector";

    // Calculate vector size (accounting for padding)
    const vectorSize = size - padding * 2;
    svgNode.resize(vectorSize, vectorSize);

    // Set constraints to SCALE for proper resizing
    svgNode.constraints = {
      horizontal: "SCALE",
      vertical: "SCALE",
    };

    // Apply all constraints to child vectors recursively
    if ("children" in svgNode) {
      const applyScaleConstraints = (node: SceneNode) => {
        if ("constraints" in node) {
          node.constraints = {
            horizontal: "SCALE",
            vertical: "SCALE",
          };
        }
        if ("children" in node && Array.isArray((node as any).children)) {
          for (const child of (node as any).children as SceneNode[]) {
            applyScaleConstraints(child);
          }
        }
      };
      applyScaleConstraints(svgNode);
    }

    // Bind fill to semantic token (text/surface)
    const textColorVar = getVariableByName("text-color-surface");
    if (textColorVar && "fills" in svgNode) {
      // Try to bind fill to first vector child
      const bindFillRecursive = (node: SceneNode) => {
        if ("fills" in node && node.type === "VECTOR") {
          try {
            bindFillToVariable(node, textColorVar.id);
          } catch (e) {
            console.warn(`Failed to bind fill for ${iconData.id}:`, e);
          }
        }
        if ("children" in node && Array.isArray((node as any).children)) {
          for (const child of (node as any).children as SceneNode[]) {
            bindFillRecursive(child);
          }
        }
      };
      bindFillRecursive(svgNode);
    }

    // Add SVG node to component
    component.appendChild(svgNode);

    return component;
  } catch (error) {
    console.error(`Failed to create SVG node for ${iconData.id}:`, error);
    // Return component with error text
    component.name = `Icon/${iconData.id} (ERROR)`;
    return component;
  }
}

/**
 * Create a "Size Examples" frame showing icon at different sizes
 *
 * @param sampleIcon - Icon to use for examples
 * @param sizes - Array of sizes to show
 * @returns Frame containing size examples
 */
async function createSizeExamplesFrame(
  sampleIcon: IconData,
  sizes: number[],
): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = "Size Examples";
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  frame.itemSpacing = 32;
  frame.paddingTop = 24;
  frame.paddingRight = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.fills = [
    {
      type: "SOLID",
      color: COLORS.lightGrayBg, // Light gray background
    },
  ];
  frame.cornerRadius = 8;

  // Create icon component for each size
  for (const size of sizes) {
    const exampleComponent = await createIconComponent(sampleIcon, size);
    const instance = exampleComponent.createInstance();

    // Add to frame
    frame.appendChild(instance);

    // Add label below icon
    const label = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    label.characters = `${size}px`;
    label.fontSize = 12;
    label.fills = [
      {
        type: "SOLID",
        color: COLORS.spinnerStroke, // Muted text color
      },
    ];

    // Remove component from page (we only need the instance)
    exampleComponent.remove();
  }

  return frame;
}

/**
 * Generate Icon Library page with all icons from sprite.svg
 *
 * Creates:
 * 1. "Icon Library" page (separate from components page)
 * 2. Figma component for each icon using createNodeFromSvg()
 * 3. Grid layout (20 per row, 48px spacing)
 * 4. "Size Examples" frame showing 16px, 20px, 24px variants
 *
 * @param config - Optional configuration
 * @returns Promise that resolves when generation is complete
 *
 * @example
 * await generateIconLibrary();
 *
 * @example
 * await generateIconLibrary({
 *   pageName: "Icons",
 *   iconsPerRow: 25,
 *   iconSpacing: 40,
 * });
 */
/**
 * Count existing icon components on the Icon Library page
 */
function countExistingIcons(pageName: string): number {
  const iconPage = figma.root.children.find(
    (page) => page.type === "PAGE" && page.name === pageName,
  ) as PageNode | undefined;

  if (!iconPage) {
    return 0;
  }

  // Find the Icons container frame
  const iconsFrame = iconPage.children.find(
    (node) => node.type === "FRAME" && node.name === "Icons",
  ) as FrameNode | undefined;

  if (!iconsFrame) {
    return 0;
  }

  // Count components (icons are named "Icon/...")
  let count = 0;
  for (const child of iconsFrame.children) {
    if (child.type === "COMPONENT" && child.name.startsWith("Icon/")) {
      count++;
    }
  }

  return count;
}

export async function generateIconLibrary(
  config?: IconLibraryConfig,
): Promise<void> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Get icons from pre-generated JSON (built by build-icon-data.ts)
  console.log("📖 Loading icon data...");
  const icons: IconData[] = iconData;
  console.log(`✅ Found ${icons.length} icons in sprite`);

  // Check if we can skip regeneration
  const existingCount = countExistingIcons(finalConfig.pageName);
  if (existingCount === icons.length) {
    console.log(
      `⏭️ Skipping Icon Library generation - ${existingCount} icons already exist`,
    );
    figma.notify(`Icon Library up to date (${existingCount} icons)`, {
      timeout: 2000,
    });
    return;
  }

  console.log(
    `🔄 Regenerating Icon Library: ${existingCount} existing → ${icons.length} icons`,
  );

  // Create or find "Icon Library" page
  let iconPage = figma.root.children.find(
    (page) => page.type === "PAGE" && page.name === finalConfig.pageName,
  ) as PageNode | undefined;

  if (!iconPage) {
    iconPage = figma.createPage();
    iconPage.name = finalConfig.pageName;
    console.log(`✅ Created page: ${finalConfig.pageName}`);
  } else {
    console.log(`✅ Found existing page: ${finalConfig.pageName}`);
  }

  // Switch to icon page
  figma.currentPage = iconPage;

  // Clear existing content on the page
  const existingChildren = [...iconPage.children];
  for (const child of existingChildren) {
    child.remove();
  }

  // Create main container frame with white background
  const containerFrame = figma.createFrame();
  containerFrame.name = "Icons";
  containerFrame.fills = [
    {
      type: "SOLID",
      color: COLORS.fallbackWhite, // White background
    },
  ];

  // Calculate grid dimensions
  const gridWidth =
    finalConfig.iconsPerRow *
      (finalConfig.defaultIconSize + finalConfig.iconSpacing) -
    finalConfig.iconSpacing +
    200; // padding
  const numRows = Math.ceil(icons.length / finalConfig.iconsPerRow);
  const gridHeight =
    numRows * (finalConfig.defaultIconSize + finalConfig.iconSpacing) -
    finalConfig.iconSpacing +
    400; // padding + space for size examples

  containerFrame.resize(gridWidth, gridHeight);
  containerFrame.x = 0;
  containerFrame.y = 0;

  // Add container to page
  iconPage.appendChild(containerFrame);

  // Create size examples frame first (at top)
  if (finalConfig.showSizeExamples && icons.length > 0) {
    console.log("🎨 Creating size examples...");
    const sampleIcon =
      icons.find((icon: IconData) => icon.id === "ph-check") || icons[0];
    const sizeExamplesFrame = await createSizeExamplesFrame(
      sampleIcon,
      finalConfig.sizeExampleDimensions,
    );
    sizeExamplesFrame.x = SECTION_LAYOUT.startX;
    sizeExamplesFrame.y = SECTION_LAYOUT.startY;
    containerFrame.appendChild(sizeExamplesFrame);
    console.log("✅ Size examples created");
  }

  // Calculate starting Y position (after size examples)
  const startY = finalConfig.showSizeExamples ? 300 : 100;

  // Generate icon components in grid layout
  console.log(`🎨 Generating ${icons.length} icon components...`);
  const components: ComponentNode[] = [];
  let currentX = 100;
  let currentY = startY;
  let iconsInCurrentRow = 0;

  for (let i = 0; i < icons.length; i++) {
    const iconData = icons[i];

    try {
      const component = await createIconComponent(
        iconData,
        finalConfig.defaultIconSize,
      );

      // Position in grid
      component.x = currentX;
      component.y = currentY;

      components.push(component);
      containerFrame.appendChild(component);

      // Update position for next icon
      iconsInCurrentRow++;
      if (iconsInCurrentRow >= finalConfig.iconsPerRow) {
        // Move to next row
        currentX = 100;
        currentY += finalConfig.defaultIconSize + finalConfig.iconSpacing;
        iconsInCurrentRow = 0;
      } else {
        // Move to next column
        currentX += finalConfig.defaultIconSize + finalConfig.iconSpacing;
      }

      // Progress logging every 50 icons
      if ((i + 1) % 50 === 0) {
        console.log(`  Generated ${i + 1}/${icons.length} icons...`);
      }
    } catch (error) {
      console.error(`❌ Failed to create icon ${iconData.id}:`, error);
    }
  }

  console.log(`✅ Generated ${components.length} icon components`);
  figma.notify(
    `✅ Icon Library generated: ${components.length} icons on "${finalConfig.pageName}" page`,
  );
}
