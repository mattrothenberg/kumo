/**
 * Kumo UI Kit Generator - Main Plugin Entry Point
 *
 * Generates Figma components from Kumo component definitions.
 * Runs destructive sync - purges and recreates all components on each run.
 *
 * Target file: sKKZc6pC6W1TtzWBLxDGSU (kumo-ai)
 */

import { generateBadgeComponents } from "./generators/badge";
import { generateBannerComponents } from "./generators/banner";
import { generateButtonComponents } from "./generators/button";
import { generateCheckboxComponents } from "./generators/checkbox";
import { generateLinkButtonComponents } from "./generators/link-button";
import { generateRefreshButtonComponents } from "./generators/refresh-button";
import { generatePlaceholderComponents } from "./generators/placeholders";
import { generateTextComponents } from "./generators/text";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __html__ is provided by Figma plugin API
figma.showUI(__html__, { width: 400, height: 300 });

/**
 * Find or create the Components page
 */
function getOrCreateComponentsPage(): PageNode {
  // Find existing Components page (case-insensitive, trimmed)
  let componentsPage = figma.root.children.find(
    (page) =>
      page.type === "PAGE" && page.name.trim().toLowerCase() === "components",
  ) as PageNode | undefined;

  if (componentsPage) {
    console.log("✅ Found existing Components page");
  } else {
    console.log("📄 Creating new Components page");
    componentsPage = figma.createPage();
    componentsPage.name = "Components";
  }

  return componentsPage;
}

/**
 * Purge existing generated content before regenerating
 * Deletes all children in Components page
 */
function purgeExistingContent(): void {
  // Find and delete Components page sections (case-insensitive)
  const componentsPage = figma.root.children.find(
    (page) =>
      page.type === "PAGE" && page.name.trim().toLowerCase() === "components",
  ) as PageNode | undefined;

  if (componentsPage) {
    // Remove all children (sections, component sets, etc.)
    const children = [...componentsPage.children];
    console.log(`🗑️ Purging ${children.length} items from Components page`);
    for (const node of children) {
      node.remove();
    }
  }

  console.log("✅ Purged existing generated content");
}

/**
 * Starting Y position for first section
 */
const START_Y = 100;

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === "generate") {
    try {
      figma.notify("Starting Kumo UI Kit generation...");

      // Step 1: Purge existing content (destructive sync)
      purgeExistingContent();

      // Step 2: Get or create Components page
      const componentsPage = getOrCreateComponentsPage();
      figma.currentPage = componentsPage;

      // Track Y position for sequential section placement
      let nextY = START_Y;

      // Step 3: Generate Badge components
      figma.notify("Generating Badge components...");
      nextY = await generateBadgeComponents(nextY);

      // Step 4: Generate Banner components
      figma.notify("Generating Banner components...");
      nextY = await generateBannerComponents(nextY);

      // Step 5: Generate placeholder components (icons, loader)
      figma.notify("Generating placeholder components...");
      const placeholders = generatePlaceholderComponents();

      // Step 6: Generate Button components (all variants, sizes, shapes, disabled, loading)
      figma.notify("Generating Button components...");
      nextY = await generateButtonComponents(
        componentsPage,
        placeholders,
        nextY,
      );

      // Step 7: Generate LinkButton components
      figma.notify("Generating LinkButton components...");
      nextY = await generateLinkButtonComponents(
        componentsPage,
        placeholders,
        nextY,
      );

      // Step 8: Generate RefreshButton components
      figma.notify("Generating RefreshButton components...");
      nextY = await generateRefreshButtonComponents(
        componentsPage,
        placeholders,
        nextY,
      );

      // Step 9: Generate Checkbox components
      figma.notify("Generating Checkbox components...");
      nextY = await generateCheckboxComponents(componentsPage, nextY);

      // Step 10: Generate Text components (typography variants)
      figma.notify("Generating Text components...");
      await generateTextComponents(componentsPage, nextY);

      figma.notify("✅ Generation complete!", { timeout: 3000 });
      figma.closePlugin(
        "Generation complete - created Badge, Banner, Button, Checkbox, LinkButton, RefreshButton, and Text components",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Generation error:", error);
      figma.notify(`Error: ${message}`, { error: true });
      figma.closePlugin();
    }
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
