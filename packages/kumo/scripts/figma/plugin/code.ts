/**
 * Kumo UI Kit Generator - Main Plugin Entry Point
 *
 * Generates Figma components from Kumo component definitions.
 * Runs destructive sync - purges and recreates all components on each run.
 *
 * Target file: sKKZc6pC6W1TtzWBLxDGSU (kumo-ai)
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - __html__ is provided by Figma plugin API
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type === "generate") {
    try {
      figma.notify("Kumo UI Kit Generator loaded successfully!");

      // TODO Phase 1: Parse component-registry.json
      // TODO Phase 1: Extract opacity modifiers from source files
      // TODO Phase 1: Generate opacity-* variables

      // TODO Phase 2: Generate Badge components
      // TODO Phase 3: Generate Button (text) components
      // TODO Phase 4: Generate Button (icon) components

      figma.closePlugin("Generation complete");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      figma.notify(`Error: ${message}`, { error: true });
      figma.closePlugin();
    }
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
