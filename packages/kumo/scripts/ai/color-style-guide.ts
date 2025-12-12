/**
 * Kumo Color Style Guide Generator
 *
 * Analyzes color usage patterns across components and extracts semantic color tokens
 * from kumo-theme.css to generate data-driven styling guidelines.
 *
 * This module is used by component-registry.ts to prepend style guidance
 * to the generated AI context.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = join(__dirname, "../../src/styles/kumo-theme.css");

// =============================================================================
// Types
// =============================================================================

interface ColorToken {
  name: string;
  category: "text" | "bg" | "border" | "ring" | "fill" | "other";
  fullClass: string;
}

interface ColorUsageStats {
  token: string;
  count: number;
  components: string[];
}

interface StyleGuide {
  /** Semantic color tokens extracted from kumo-theme.css */
  semanticTokens: {
    text: string[];
    background: string[];
    border: string[];
    ring: string[];
    fill: string[];
  };
  /** Color usage frequency across components */
  usageStats: ColorUsageStats[];
}

// =============================================================================
// Parse semantic tokens from kumo-theme.css
// =============================================================================

interface ParsedTokens {
  textColors: string[];
  bgColors: string[];
  borderColors: string[];
  ringColors: string[];
  fillColors: string[];
}

/**
 * Parse kumo-theme.css to extract all semantic color tokens.
 * Groups tokens by their utility prefix (text, bg, border, ring, fill).
 */
export function parseSemanticTokens(): ParsedTokens {
  const content = readFileSync(themePath, "utf-8");

  const textColors: string[] = [];
  const bgColors: string[] = [];

  // Match --text-color-* variables (text colors)
  const textColorPattern = /--text-color-([a-zA-Z][a-zA-Z0-9-]*)\s*:/g;
  let match: RegExpExecArray | null;

  while ((match = textColorPattern.exec(content)) !== null) {
    textColors.push(`text-${match[1]}`);
  }

  // Match --color-* variables (background/general colors)
  // Exclude raw palette colors (those with numeric suffixes like -650, -50)
  const bgColorPattern = /--color-([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*light-dark\(/g;

  while ((match = bgColorPattern.exec(content)) !== null) {
    const name = match[1];
    // Skip palette colors with numeric suffixes
    if (!/\d+$/.test(name)) {
      bgColors.push(`bg-${name}`);
    }
  }

  // Border and ring colors use the same --color-* tokens
  const borderColors = bgColors
    .filter(
      (c) =>
        c.includes("border") ||
        c.includes("color") ||
        c.includes("subtle") ||
        c.includes("hover"),
    )
    .map((c) => c.replace("bg-", "border-"));

  const ringColors = bgColors
    .filter(
      (c) =>
        c.includes("border") ||
        c.includes("active") ||
        c.includes("destructive") ||
        c.includes("color"),
    )
    .map((c) => c.replace("bg-", "ring-"));

  const fillColors = bgColors
    .filter((c) => c.includes("icon") || c.includes("active"))
    .map((c) => c.replace("bg-", "fill-"));

  return {
    textColors: [...new Set(textColors)].sort(),
    bgColors: [...new Set(bgColors)].sort(),
    borderColors: [...new Set(borderColors)].sort(),
    ringColors: [...new Set(ringColors)].sort(),
    fillColors: [...new Set(fillColors)].sort(),
  };
}

// =============================================================================
// Analyze color usage across components
// =============================================================================

/**
 * Analyze color usage frequency from component color data.
 * Returns sorted stats by usage count.
 */
export function analyzeColorUsage(
  componentColors: Map<string, string[]>,
): ColorUsageStats[] {
  const usageMap = new Map<string, Set<string>>();

  for (const [componentName, colors] of componentColors) {
    for (const color of colors) {
      if (!usageMap.has(color)) {
        usageMap.set(color, new Set());
      }
      usageMap.get(color)!.add(componentName);
    }
  }

  const stats: ColorUsageStats[] = [];
  for (const [token, components] of usageMap) {
    stats.push({
      token,
      count: components.size,
      components: [...components].sort(),
    });
  }

  return stats.sort((a, b) => b.count - a.count);
}

// =============================================================================
// Generate markdown style guide
// =============================================================================

/**
 * Generate the markdown style guide section for AI context.
 */
export function generateStyleGuideMarkdown(
  componentColors: Map<string, string[]>,
): string {
  const tokens = parseSemanticTokens();
  const usageStats = analyzeColorUsage(componentColors);

  // Group usage stats by prefix
  const bgStats = usageStats.filter((s) => s.token.startsWith("bg-"));
  const textStats = usageStats.filter((s) => s.token.startsWith("text-"));
  const ringStats = usageStats.filter((s) => s.token.startsWith("ring-"));
  const borderStats = usageStats.filter((s) => s.token.startsWith("border-"));

  // Categorize tokens by purpose for easier reference
  const surfaceTokens = tokens.bgColors.filter(
    (t) => t.includes("surface") || t === "bg-primary" || t === "bg-secondary",
  );
  const stateTokens = {
    error: [
      ...tokens.bgColors.filter(
        (t) => t.includes("error") || t.includes("destructive"),
      ),
      ...tokens.textColors.filter(
        (t) => t.includes("error") || t.includes("destructive"),
      ),
      ...tokens.ringColors.filter(
        (t) => t.includes("error") || t.includes("destructive"),
      ),
    ],
    alert: [
      ...tokens.bgColors.filter((t) => t.includes("alert")),
      ...tokens.textColors.filter((t) => t.includes("alert")),
    ],
    success: [
      ...tokens.bgColors.filter((t) => t.includes("success")),
      ...tokens.textColors.filter((t) => t.includes("success")),
    ],
    info: [
      ...tokens.bgColors.filter((t) => t.includes("info")),
      ...tokens.textColors.filter((t) => t.includes("info")),
    ],
  };

  let md = `
## Styling Guide

**Important:** Only use Kumo semantic tokens. Never use raw Tailwind colors like \`bg-gray-500\` or \`text-blue-600\`.

### Quick Reference

| Purpose | Token | Example Use |
|---------|-------|-------------|
| **Page/card background** | \`bg-surface\` | Main content areas |
| **Elevated surface** | \`bg-surface-elevated\` | Modals, dropdowns |
| **Interactive element** | \`bg-secondary\` | Buttons, inputs |
| **Hover state** | \`bg-subtle\` | Hover backgrounds |
| **Selected/active** | \`bg-accent\` | Active tabs, selections |
| **Primary text** | \`text-surface\` | Body text, headings |
| **Secondary text** | \`text-secondary\` | Descriptions, hints |
| **Muted text** | \`text-muted\` | Placeholders, disabled |
| **Card border** | \`border-color\` | Dividers, outlines |
| **Focus ring** | \`ring-active\` | Keyboard focus |
| **Error state** | \`text-error\` + \`ring-destructive\` | Validation errors |

### State Colors

| State | Background | Text | Border/Ring |
|-------|------------|------|-------------|
| **Error** | \`bg-error-surface\` | \`text-error\` | \`ring-destructive\` |
| **Warning** | \`bg-alert-surface\` | \`text-alert\` | \`ring-alert-border\` |
| **Success** | — | \`text-info\` | — |

### Surface Hierarchy

Use layered surfaces for visual depth:
\`\`\`
bg-surface → bg-surface-elevated → bg-surface-secondary
\`\`\`

### Dark Mode

All semantic tokens automatically adapt to dark mode. No manual \`dark:\` prefixes needed.

`;

  // Add usage patterns section (condensed)
  md += `### Token Usage in Components

Most frequently used tokens across Kumo components:

| Category | Top Tokens |
|----------|------------|
| **Background** | ${bgStats
    .slice(0, 5)
    .map((s) => `\`${s.token}\``)
    .join(", ")} |
| **Text** | ${textStats
    .slice(0, 5)
    .map((s) => `\`${s.token}\``)
    .join(", ")} |
| **Border/Ring** | ${[...ringStats, ...borderStats]
    .slice(0, 4)
    .map((s) => `\`${s.token}\``)
    .join(", ")} |

`;

  // Add complete token reference as an appendix section
  md += `---

### All Semantic Tokens (Reference)

> Use the Quick Reference table above for common cases. This section lists all available tokens.

**Text:** \`${tokens.textColors.slice(0, 8).join("\`, \`")}\`, and ${tokens.textColors.length - 8} more

**Background:** \`${tokens.bgColors.slice(0, 8).join("\`, \`")}\`, and ${tokens.bgColors.length - 8} more

**Border:** \`${tokens.borderColors.join("\`, \`")}\`

**Ring:** \`${tokens.ringColors.join("\`, \`")}\`

**Fill:** \`${tokens.fillColors.join("\`, \`")}\`

`;

  return md;
}
