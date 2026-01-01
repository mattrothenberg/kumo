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
import { generateLayerCardComponents } from "./generators/layer-card";
import { generateLoaderComponents } from "./generators/loader";
import { generateLinkButtonComponents } from "./generators/link-button";
import { generateMenuBarComponents } from "./generators/menubar";
import { generateMeterComponents } from "./generators/meter";
import { generatePaginationComponents } from "./generators/pagination";
import { generateRefreshButtonComponents } from "./generators/refresh-button";
import { generateSelectComponents } from "./generators/select";
import { generateSensitiveInputComponents } from "./generators/sensitive-input";
import { generateSurfaceComponents } from "./generators/surface";
import {
  generateSwitchComponents,
  generateSwitchGroupComponents,
} from "./generators/switch";
import { generateTabsComponents } from "./generators/tabs";
import { generateTextComponents } from "./generators/text";
import { generateIconLibrary } from "./generators/icon-library";
import { logInfo, logError } from "./logger";

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
    logInfo("✅ Found existing Components page");
  } else {
    logInfo("📄 Creating new Components page");
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
    logInfo(`🗑️ Purging ${children.length} items from Components page`);
    for (const node of children) {
      node.remove();
    }
  }

  logInfo("✅ Purged existing generated content");
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

      // Total component count for progress indicator
      const TOTAL_COMPONENTS = 28;
      let componentIndex = 0;

      // Step 3: Generate Badge components
      componentIndex++;
      figma.notify(
        `Generating Badge (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateBadgeComponents(nextY);

      // Step 4: Generate Banner components
      componentIndex++;
      figma.notify(
        `Generating Banner (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateBannerComponents(nextY);

      // Step 5: Generate Icon Library first (other components depend on it)
      componentIndex++;
      figma.notify(
        `Generating Icon Library (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      await generateIconLibrary();

      // Step 6: Generate Button components (all variants, sizes, shapes, disabled, loading)
      componentIndex++;
      figma.notify(
        `Generating Button (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateButtonComponents(componentsPage, nextY);

      // Step 7: Generate LinkButton components
      componentIndex++;
      figma.notify(
        `Generating LinkButton (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateLinkButtonComponents(componentsPage, nextY);

      // Step 8: Generate RefreshButton components
      componentIndex++;
      figma.notify(
        `Generating RefreshButton (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateRefreshButtonComponents(componentsPage, nextY);

      // Step 9: Generate Checkbox components
      componentIndex++;
      figma.notify(
        `Generating Checkbox (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateCheckboxComponents(componentsPage, nextY);

      // Step 10: Generate Text components (typography variants)
      componentIndex++;
      figma.notify(
        `Generating Text (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateTextComponents(componentsPage, nextY);

      // Step 11: Generate ClipboardText components
      componentIndex++;
      figma.notify(
        `Generating ClipboardText (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateClipboardTextComponents(nextY);

      // Step 12: Generate Code components
      componentIndex++;
      figma.notify(
        `Generating Code (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateCodeComponents(componentsPage, nextY);

      // Step 13: Generate CodeBlock components
      componentIndex++;
      figma.notify(
        `Generating CodeBlock (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateCodeBlockComponents(componentsPage, nextY);

      // Step 14: Generate Collapsible components
      componentIndex++;
      figma.notify(
        `Generating Collapsible (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateCollapsibleComponents(nextY);

      // Step 15: Generate Combobox components
      componentIndex++;
      figma.notify(
        `Generating Combobox (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateComboboxComponents(nextY);

      // Step 16: Generate DateRangePicker components
      componentIndex++;
      figma.notify(
        `Generating DateRangePicker (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateDateRangePickerComponents(componentsPage, nextY);

      // Step 17: Generate Dialog components
      componentIndex++;
      figma.notify(
        `Generating Dialog (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateDialogComponents(componentsPage, nextY);

      // Step 18: Generate Dropdown components
      componentIndex++;
      figma.notify(
        `Generating Dropdown (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateDropdownComponents(componentsPage, nextY);

      // Step 19: Generate Input components
      componentIndex++;
      figma.notify(
        `Generating Input (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateInputComponents(componentsPage, nextY);

      // Step 20: Generate InputArea components
      componentIndex++;
      figma.notify(
        `Generating InputArea (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateInputAreaComponents(componentsPage, nextY);

      // Step 21: Generate LayerCard components
      componentIndex++;
      figma.notify(
        `Generating LayerCard (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateLayerCardComponents(componentsPage, nextY);

      // Step 22: Generate Loader components
      componentIndex++;
      figma.notify(
        `Generating Loader (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateLoaderComponents(componentsPage, nextY);

      // Step 23: Generate MenuBar components
      componentIndex++;
      figma.notify(
        `Generating MenuBar (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateMenuBarComponents(componentsPage, nextY);

      // Step 24: Generate Meter components
      componentIndex++;
      figma.notify(
        `Generating Meter (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateMeterComponents(nextY);

      // Step 25: Generate Pagination components
      componentIndex++;
      figma.notify(
        `Generating Pagination (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generatePaginationComponents(nextY);

      // Step 26: Generate Select components
      componentIndex++;
      figma.notify(
        `Generating Select (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateSelectComponents(componentsPage, nextY);

      // Step 27: Generate SensitiveInput components
      componentIndex++;
      figma.notify(
        `Generating SensitiveInput (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateSensitiveInputComponents(componentsPage, nextY);

      // Step 28: Generate Surface components
      componentIndex++;
      figma.notify(
        `Generating Surface (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateSurfaceComponents(componentsPage, nextY);

      // Step 29: Generate Switch components
      componentIndex++;
      figma.notify(
        `Generating Switch (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateSwitchComponents(componentsPage, nextY);

      // Step 30: Generate Switch.Group components
      componentIndex++;
      figma.notify(
        `Generating Switch.Group (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateSwitchGroupComponents(componentsPage, nextY);

      // Step 31: Generate Tabs components
      componentIndex++;
      figma.notify(
        `Generating Tabs (${componentIndex}/${TOTAL_COMPONENTS})...`,
      );
      nextY = await generateTabsComponents(componentsPage, nextY);

      figma.notify("✅ Generation complete!", { timeout: 3000 });
      figma.closePlugin(
        "Generation complete - created Badge, Banner, Button, Checkbox, ClipboardText, Code, CodeBlock, Collapsible, Combobox, DateRangePicker, Dialog, Dropdown, Input, InputArea, LayerCard, Loader, LinkButton, MenuBar, Meter, Pagination, RefreshButton, Select, SensitiveInput, Surface, Switch, Switch.Group, Tabs, Text components, and Icon Library",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logError("Generation error:", error);

      // Provide specific error guidance based on error type
      let errorNotification = `Error: ${message}`;

      // Check for missing kumo-colors collection
      if (message.includes("kumo-colors") || message.includes("collection")) {
        errorNotification =
          "Missing kumo-colors collection. Run token sync first: npx tsx sync-tokens-to-figma.ts";
        logError(
          "Kumo semantic color tokens not found. Please sync tokens from CSS to Figma variables.",
        );
      }
      // Check for missing font
      else if (message.includes("font") || message.includes("Inter")) {
        errorNotification =
          "Missing Inter font. Please install the Inter font family and restart Figma.";
        logError(
          "Inter font family not available. Install from https://rsms.me/inter/",
        );
      }
      // Generic mid-generation failure
      else {
        logError(
          `Generation failed during component creation. Partial state may exist on Components page.`,
        );
      }

      figma.notify(errorNotification, { error: true, timeout: 5000 });
      figma.closePlugin();
    }
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
