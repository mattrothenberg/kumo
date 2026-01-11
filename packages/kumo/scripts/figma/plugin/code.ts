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
import { generateBreadcrumbsComponents } from "./generators/breadcrumbs";
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
import { generateEmptyComponents } from "./generators/empty";
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
import { generateToastComponents } from "./generators/toast";
import { generateTooltipComponents } from "./generators/tooltip";
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

/**
 * Component generator configuration
 * Each entry defines a component generator with its display name and execution function
 */
type GeneratorConfig = {
  name: string;
  execute: (
    page: PageNode,
    currentY: number,
  ) => Promise<{ nextY: number } | void>;
};

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

      /**
       * Generator registry - add new generators here in any order.
       * They will be auto-sorted alphabetically at runtime.
       *
       * Set `priority: true` for generators that must run before others
       * (e.g., Icon Library creates icons that other generators reference).
       */
      const GENERATORS: (GeneratorConfig & { priority?: boolean })[] = [
        {
          name: "Icon Library",
          priority: true, // Must run first - other generators depend on icons
          execute: async () => {
            await generateIconLibrary();
          },
        },
        {
          name: "Badge",
          execute: async (_page, y) => {
            const result = await generateBadgeComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Banner",
          execute: async (_page, y) => {
            const result = await generateBannerComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Breadcrumbs",
          execute: async (_page, y) => {
            const result = await generateBreadcrumbsComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Button",
          execute: async (page, y) => {
            const result = await generateButtonComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Checkbox",
          execute: async (page, y) => {
            const result = await generateCheckboxComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "ClipboardText",
          execute: async (_page, y) => {
            const result = await generateClipboardTextComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Code",
          execute: async (page, y) => {
            const result = await generateCodeComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "CodeBlock",
          execute: async (page, y) => {
            const result = await generateCodeBlockComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Collapsible",
          execute: async (_page, y) => {
            const result = await generateCollapsibleComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Combobox",
          execute: async (_page, y) => {
            const result = await generateComboboxComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "DateRangePicker",
          execute: async (page, y) => {
            const result = await generateDateRangePickerComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Dialog",
          execute: async (page, y) => {
            const result = await generateDialogComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Dropdown",
          execute: async (page, y) => {
            const result = await generateDropdownComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Empty",
          execute: async (_page, y) => {
            const result = await generateEmptyComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Input",
          execute: async (page, y) => {
            const result = await generateInputComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "InputArea",
          execute: async (page, y) => {
            const result = await generateInputAreaComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "LayerCard",
          execute: async (page, y) => {
            const result = await generateLayerCardComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "LinkButton",
          execute: async (page, y) => {
            const result = await generateLinkButtonComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Loader",
          execute: async (page, y) => {
            const result = await generateLoaderComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "MenuBar",
          execute: async (page, y) => {
            const result = await generateMenuBarComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Meter",
          execute: async (_page, y) => {
            const result = await generateMeterComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "Pagination",
          execute: async (_page, y) => {
            const result = await generatePaginationComponents(y);
            return { nextY: result };
          },
        },
        {
          name: "RefreshButton",
          execute: async (page, y) => {
            const result = await generateRefreshButtonComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Select",
          execute: async (page, y) => {
            const result = await generateSelectComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "SensitiveInput",
          execute: async (page, y) => {
            const result = await generateSensitiveInputComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Surface",
          execute: async (page, y) => {
            const result = await generateSurfaceComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Switch",
          execute: async (page, y) => {
            const result = await generateSwitchComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Switch.Group",
          execute: async (page, y) => {
            const result = await generateSwitchGroupComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Tabs",
          execute: async (page, y) => {
            const result = await generateTabsComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Text",
          execute: async (page, y) => {
            const result = await generateTextComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Toast",
          execute: async (page, y) => {
            const result = await generateToastComponents(page, y);
            return { nextY: result };
          },
        },
        {
          name: "Tooltip",
          execute: async (page, y) => {
            const result = await generateTooltipComponents(page, y);
            return { nextY: result };
          },
        },
      ];

      // Sort generators: priority items first, then alphabetically by name
      const sortedGenerators = [...GENERATORS].sort((a, b) => {
        // Priority items come first
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      });

      // Dynamically calculated total from generator array
      const TOTAL_COMPONENTS = sortedGenerators.length;

      // Step 3: Execute all generators sequentially (sorted alphabetically, priority first)
      for (let i = 0; i < sortedGenerators.length; i++) {
        const generator = sortedGenerators[i];
        const componentIndex = i + 1;

        figma.notify(
          `Generating ${generator.name} (${componentIndex}/${TOTAL_COMPONENTS})...`,
        );

        const result = await generator.execute(componentsPage, nextY);

        // Update nextY if generator returns a new position
        if (result && result.nextY !== undefined) {
          nextY = result.nextY;
        }
      }

      figma.notify("✅ Generation complete!", { timeout: 3000 });
      figma.closePlugin(
        "Generation complete - created Badge, Banner, Button, Checkbox, ClipboardText, Code, CodeBlock, Collapsible, Combobox, DateRangePicker, Dialog, Dropdown, Input, InputArea, LayerCard, Loader, LinkButton, MenuBar, Meter, Pagination, RefreshButton, Select, SensitiveInput, Surface, Switch, Switch.Group, Tabs, Text, Toast, Tooltip components, and Icon Library",
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
