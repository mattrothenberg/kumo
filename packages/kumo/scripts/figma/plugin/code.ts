/**
 * Kumo UI Kit Generator - Main Plugin Entry Point
 *
 * Generates Figma components from Kumo component definitions.
 * Runs destructive sync - purges and recreates all components on each run.
 *
 * Target file: sKKZc6pC6W1TtzWBLxDGSU (kumo-ai)
 */

import { generateBadgeComponents } from "./generators/badge";
import { generateButtonTextComponents } from "./generators/button-text";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __html__ is provided by Figma plugin API
figma.showUI(__html__, { width: 400, height: 300 });

/**
 * Find or create the Components page
 */
function getOrCreateComponentsPage(): PageNode {
  let componentsPage = figma.root.children.find(
    (page) => page.type === "PAGE" && page.name === "Components",
  ) as PageNode | undefined;

  if (!componentsPage) {
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
  // Find and delete Components page sections
  const componentsPage = figma.root.children.find(
    (page) => page.type === "PAGE" && page.name === "Components",
  ) as PageNode | undefined;

  if (componentsPage) {
    // Remove all children (sections, component sets, etc.)
    const children = [...componentsPage.children];
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

      // Step 4: Generate Button components (all variants and sizes)
      figma.notify("Generating Button components...");
      await generateButtonTextComponents(componentsPage, nextY);

      figma.notify("✅ Generation complete!", { timeout: 3000 });
      figma.closePlugin(
        "Generation complete - created Badge and Button components",
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
