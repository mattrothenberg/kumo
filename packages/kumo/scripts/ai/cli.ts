#!/usr/bin/env node
/**
 * Kumo CLI - Component registry and template system
 *
 * Usage:
 *   kumo ls                   List all components
 *   kumo doc <name>           Get documentation for a component
 *   kumo docs                 Get documentation for all components
 *   kumo templates [category] List available templates
 *   kumo add <template>       Add a template to your project
 *   kumo help                 Show this help message
 */

import { ls } from "./commands/ls.js";
import { doc } from "./commands/doc.js";
import { addTemplate } from "./commands/add-template.js";
import { listTemplates } from "./commands/list-templates.js";

const HELP = `
Kumo CLI - Component registry and template system

COMPONENT REGISTRY:
  kumo ls              List all Kumo components with categories
  kumo doc <name>      Get detailed documentation for a component
  kumo docs            Get documentation for all components

TEMPLATES:
  kumo templates [category]  List available templates (pages, layouts, blocks, flows)
  kumo add <template>        Copy a template to your project

GENERAL:
  kumo help            Show this help message

Examples:
  kumo ls
  kumo doc Button
  kumo templates
  kumo templates layouts
  kumo add layouts/centered-page-layout
`;

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  switch (command) {
    case "ls":
      // List components
      ls();
      break;

    case "templates":
      // List templates (optionally filtered by category)
      listTemplates(args[1]);
      break;

    case "doc":
    case "docs":
      // If no component name, show all docs; otherwise show specific component
      doc(args[1]);
      break;

    case "add":
      // Add a template to the project
      addTemplate(args[1]);
      break;

    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP.trim());
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP.trim());
      process.exit(1);
  }
}

main();
