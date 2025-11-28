/**
 * Component Metadata Generator for AI/Agent Consumption
 *
 * This script reads the *_SCHEMA exports from Kumo components and generates
 * a unified JSON registry that can be consumed by AI agents, MCP servers,
 * or documentation systems.
 *
 * Run: pnpm build:ai-metadata
 * Output: dist/ai/component-registry.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Import schemas from components
import { BADGE_SCHEMA } from "../../src/components/badge/badge";
import { BANNER_SCHEMA } from "../../src/components/banner/banner";
import { BUTTON_SCHEMA } from "../../src/components/button/button";

const __dirname = dirname(fileURLToPath(import.meta.url));

// =============================================================================
// Types for the generated registry
// =============================================================================

interface PropSchema {
  type: string;
  required?: boolean;
  optional?: boolean;
  default?: string;
  description?: string;
  values?: readonly string[];
  descriptions?: Record<string, string>;
}

interface ComponentSchema {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropSchema>;
  examples: readonly string[];
}

interface ComponentRegistry {
  version: string;
  generatedAt: string;
  components: Record<string, ComponentSchema>;
  // MCP-friendly helpers
  search: {
    byCategory: Record<string, string[]>;
    byName: string[];
  };
}

// =============================================================================
// Collect all schemas
// =============================================================================

const ALL_SCHEMAS = [BADGE_SCHEMA, BANNER_SCHEMA, BUTTON_SCHEMA] as const;

// =============================================================================
// Generate the registry
// =============================================================================

function generateRegistry(): ComponentRegistry {
  const components: Record<string, ComponentSchema> = {};
  const byCategory: Record<string, string[]> = {};

  for (const schema of ALL_SCHEMAS) {
    components[schema.name] = schema as unknown as ComponentSchema;

    // Index by category
    if (!byCategory[schema.category]) {
      byCategory[schema.category] = [];
    }
    byCategory[schema.category].push(schema.name);
  }

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    components,
    search: {
      byCategory,
      byName: ALL_SCHEMAS.map((s) => s.name),
    },
  };
}

// =============================================================================
// Generate AI context string (markdown format for LLM consumption)
// =============================================================================

function generateAIContext(registry: ComponentRegistry): string {
  let context = `# Kumo Component Registry

> Auto-generated component metadata for AI/agent consumption.
> Generated: ${registry.generatedAt}

## Available Components

`;

  for (const [name, comp] of Object.entries(registry.components)) {
    context += `### ${name}\n\n`;
    context += `${comp.description}\n\n`;
    context += `**Import:** \`import { ${name} } from "${comp.importPath}";\`\n\n`;
    context += `**Category:** ${comp.category}\n\n`;

    context += `**Props:**\n`;
    for (const [propName, prop] of Object.entries(comp.props)) {
      const required = prop.required ? " (required)" : "";
      const defaultVal = prop.default ? ` [default: ${prop.default}]` : "";
      context += `- \`${propName}\`: ${prop.type}${required}${defaultVal}\n`;

      if (prop.values && prop.descriptions) {
        for (const val of prop.values) {
          const desc = prop.descriptions[val];
          if (desc) {
            context += `  - \`"${val}"\`: ${desc}\n`;
          }
        }
      } else if (prop.description) {
        context += `  ${prop.description}\n`;
      }
    }

    context += `\n**Examples:**\n`;
    for (const example of comp.examples) {
      context += `\`\`\`tsx\n${example}\n\`\`\`\n`;
    }
    context += "\n---\n\n";
  }

  context += `## Quick Reference

**Components by Category:**
`;
  for (const [category, names] of Object.entries(registry.search.byCategory)) {
    context += `- **${category}:** ${names.join(", ")}\n`;
  }

  return context;
}

// =============================================================================
// Main
// =============================================================================

function main() {
  const registry = generateRegistry();
  const aiContext = generateAIContext(registry);

  // Ensure output directory exists
  const outputDir = join(__dirname, "../../dist/ai");
  mkdirSync(outputDir, { recursive: true });

  // Write JSON registry
  const jsonPath = join(outputDir, "component-registry.json");
  writeFileSync(jsonPath, JSON.stringify(registry, null, 2));
  console.log(`✓ Generated ${jsonPath}`);

  // Write markdown context for LLMs
  const mdPath = join(outputDir, "component-registry.md");
  writeFileSync(mdPath, aiContext);
  console.log(`✓ Generated ${mdPath}`);

  // Also output to stdout for piping
  console.log("\n--- Generated Registry Summary ---");
  console.log(`Components: ${registry.search.byName.join(", ")}`);
  console.log(
    `Categories: ${Object.keys(registry.search.byCategory).join(", ")}`,
  );
}

main();
