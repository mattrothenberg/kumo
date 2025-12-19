#!/usr/bin/env node
/**
 * Kumo CLI - Component registry access for AI agents
 *
 * Usage:
 *   kumo ls              List all components
 *   kumo doc <name>      Get documentation for a component
 *   kumo help            Show this help message
 */

import { ls } from "./commands/ls.js";
import { doc } from "./commands/doc.js";

const HELP = `
Kumo CLI - Component registry for AI agents

Usage:
  kumo ls              List all components with categories
  kumo doc <name>      Get detailed documentation for a component
  kumo help            Show this help message

Examples:
  kumo ls
  kumo doc Button
  kumo doc Dialog
`;

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  switch (command) {
    case "ls":
    case "list":
      ls();
      break;

    case "doc":
    case "docs":
      doc(args[1]);
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
