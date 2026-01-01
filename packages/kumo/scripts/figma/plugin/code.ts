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
import { generateClipboardTextComponents } from "./generators/clipboard-text";
import { generateCodeComponents } from "./generators/code";
import { generateCodeBlockComponents } from "./generators/code-block";
import { generateCollapsibleComponents } from "./generators/collapsible";
import { generateComboboxComponents } from "./generators/combobox";
import { generateDateRangePickerComponents } from "./generators/date-range-picker";
import { generateDialogComponents } from "./generators/dialog";
import { generateDropdownComponents } from "./generators/dropdown";
import { generateInputComponents } from "./generators/input";
import { generateInputAreaComponents } from "./generators/input-area";
import { generateLinkButtonComponents } from "./generators/link-button";
import { generateRefreshButtonComponents } from "./generators/refresh-button";
import { generateTextComponents } from "./generators/text";
import { generateIconLibrary } from "./generators/icon-library";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __html__ is provided by Figma plugin API
figma.showUI(__html__, { width: 320, height: 220 });

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

      // Step 5: Generate Icon Library first (other components depend on it)
      figma.notify("Generating Icon Library...");
      await generateIconLibrary();

      // Step 6: Generate Button components (all variants, sizes, shapes, disabled, loading)
      figma.notify("Generating Button components...");
      nextY = await generateButtonComponents(componentsPage, nextY);

      // Step 7: Generate LinkButton components
      figma.notify("Generating LinkButton components...");
      nextY = await generateLinkButtonComponents(componentsPage, nextY);

      // Step 8: Generate RefreshButton components
      figma.notify("Generating RefreshButton components...");
      nextY = await generateRefreshButtonComponents(componentsPage, nextY);

      // Step 9: Generate Checkbox components
      figma.notify("Generating Checkbox components...");
      nextY = await generateCheckboxComponents(componentsPage, nextY);

      // Step 10: Generate Text components (typography variants)
      figma.notify("Generating Text components...");
      nextY = await generateTextComponents(componentsPage, nextY);

      // Step 11: Generate ClipboardText components
      figma.notify("Generating ClipboardText components...");
      nextY = await generateClipboardTextComponents(nextY);

      // Step 12: Generate Code components
      figma.notify("Generating Code components...");
      nextY = await generateCodeComponents(componentsPage, nextY);

      // Step 13: Generate CodeBlock components
      figma.notify("Generating CodeBlock components...");
      nextY = await generateCodeBlockComponents(componentsPage, nextY);

      // Step 14: Generate Collapsible components
      figma.notify("Generating Collapsible components...");
      nextY = await generateCollapsibleComponents(nextY);

      // Step 15: Generate Combobox components
      figma.notify("Generating Combobox components...");
      nextY = await generateComboboxComponents(nextY);

      // Step 16: Generate DateRangePicker components
      figma.notify("Generating DateRangePicker components...");
      nextY = await generateDateRangePickerComponents(componentsPage, nextY);

      // Step 17: Generate Dialog components
      figma.notify("Generating Dialog components...");
      nextY = await generateDialogComponents(componentsPage, nextY);

      // Step 18: Generate Dropdown components
      figma.notify("Generating Dropdown components...");
      nextY = await generateDropdownComponents(componentsPage, nextY);

      // Step 19: Generate Input components
      figma.notify("Generating Input components...");
      nextY = await generateInputComponents(componentsPage, nextY);

      // Step 20: Generate InputArea components
      figma.notify("Generating InputArea components...");
      nextY = await generateInputAreaComponents(componentsPage, nextY);

      figma.notify("✅ Generation complete!", { timeout: 3000 });
      figma.closePlugin(
        "Generation complete - created Badge, Banner, Button, Checkbox, ClipboardText, Code, CodeBlock, Collapsible, Combobox, DateRangePicker, Dialog, Dropdown, Input, InputArea, LinkButton, RefreshButton, Text components, and Icon Library",
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
