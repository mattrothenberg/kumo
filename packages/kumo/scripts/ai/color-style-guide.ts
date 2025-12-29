/**
 * Kumo Color Style Guide Generator
 *
 * Dynamically analyzes kumo-theme.css and component source files to generate
 * a comprehensive, data-driven color style guide for AI agents.
 *
 * This module:
 * 1. Parses kumo-theme.css to extract all semantic color tokens
 * 2. Categorizes tokens by purpose (text, background, border, state, etc.)
 * 3. Scans component files to find actual usage patterns
 * 4. Generates markdown documentation with usage context
 *
 * Run: pnpm build:ai-metadata
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const themePath = join(__dirname, "../../src/styles/kumo-theme.css");
const bindingPath = join(__dirname, "../../src/styles/kumo-binding.css");
const srcDir = join(__dirname, "../../src");

// =============================================================================
// Types
// =============================================================================

interface SemanticToken {
  /** CSS variable name without -- prefix (e.g., "color-surface") */
  cssVar: string;
  /** Token name for Tailwind usage (e.g., "surface") */
  name: string;
  /** Category: text, background, border, state, etc. */
  category: TokenCategory;
  /** Whether this is a text color (--text-color-*) or general color (--color-*) */
  isTextColor: boolean;
  /** Light mode value (extracted from light-dark()) */
  lightValue: string;
  /** Dark mode value (extracted from light-dark()) */
  darkValue: string;
  /** Inferred purpose based on name and usage */
  purpose: string;
}

type TokenCategory =
  | "surface" // Page/card backgrounds
  | "text" // Text colors
  | "border" // Borders and dividers
  | "state" // Error, alert, info, success states
  | "interactive" // Hover, active, focus states
  | "component"; // Component-specific tokens (calendar, toast, etc.)

interface ColorUsageStats {
  /** Tailwind class (e.g., "bg-surface", "text-error") */
  className: string;
  /** Number of components using this class */
  componentCount: number;
  /** List of component names using this class */
  components: string[];
}

interface ThemeOverride {
  name: string;
  selector: string;
  tokens: string[];
}

// =============================================================================
// Parse kumo-theme.css
// =============================================================================

/**
 * Extract light and dark values from a light-dark() CSS function.
 */
function parseLightDark(value: string): { light: string; dark: string } | null {
  const match = value.match(/light-dark\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/);
  if (!match) return null;
  return {
    light: match[1].trim(),
    dark: match[2].trim(),
  };
}

/**
 * Infer the purpose of a token based on its name.
 */
function inferPurpose(name: string, isTextColor: boolean): string {
  // Text colors
  if (isTextColor) {
    if (name === "surface") return "Primary text on surfaces";
    if (name === "surface-inverse") return "Text on inverse/dark surfaces";
    if (name === "label") return "Form labels and secondary headings";
    if (name === "muted") return "Placeholder text and disabled states";
    if (name === "disabled") return "Disabled text";
    if (name === "brand") return "Brand-colored text (Cloudflare orange)";
    if (name === "error") return "Error messages and validation";
    if (name === "alert") return "Warning messages";
    if (name === "info") return "Informational text and links";
    if (name === "green") return "Success indicators";
    return "Text color";
  }

  // Surface/background colors
  if (name === "surface") return "Main page/card background";
  if (name === "surface-2") return "Secondary surface layer";
  if (name === "surface-3") return "Tertiary surface layer";
  if (name === "surface-elevated")
    return "Elevated surfaces (modals, dropdowns)";
  if (name === "surface-secondary") return "Secondary background areas";
  if (name === "surface-inverse") return "Inverse background (dark on light)";
  if (name === "layer-card-primary") return "Primary card layer background";

  // Interactive states
  if (name === "secondary") return "Secondary/default button background";
  if (name === "primary") return "Primary action background";
  if (name === "accent") return "Selected/active state background";
  if (name === "subtle") return "Subtle hover background";
  if (name === "hover") return "Hover state background";
  if (name === "hover-border") return "Hover state border";
  if (name === "hover-selected") return "Hover on selected items";
  if (name === "active") return "Active/focus ring color";
  if (name === "muted") return "Muted/disabled background";

  // Borders
  if (name === "border") return "Default border color";
  if (name === "border-2") return "Secondary border color";
  if (name.startsWith("color")) return "Border/divider color";

  // State colors
  if (name === "error") return "Error state background";
  if (name === "error-selection") return "Error state selection";
  if (name === "alert") return "Warning state background";
  if (name === "alert-selection") return "Warning state selection";
  if (name === "info") return "Info state background";
  if (name === "info-selection") return "Info state selection";

  // Component-specific
  if (name.startsWith("calendar")) return "Calendar component styling";
  if (name.startsWith("toast")) return "Toast notification styling";
  if (name.includes("icon")) return "Icon styling";

  return "General styling";
}

/**
 * Categorize a token based on its name.
 */
function categorizeToken(name: string, isTextColor: boolean): TokenCategory {
  if (isTextColor) return "text";

  if (
    name.includes("surface") ||
    name.includes("layer") ||
    name === "secondary" ||
    name === "primary"
  ) {
    return "surface";
  }

  if (name.includes("border") || name.startsWith("color")) {
    return "border";
  }

  if (
    name.includes("error") ||
    name.includes("alert") ||
    name.includes("info")
  ) {
    return "state";
  }

  if (
    name.includes("hover") ||
    name.includes("active") ||
    name.includes("accent") ||
    name.includes("subtle") ||
    name.includes("muted")
  ) {
    return "interactive";
  }

  if (
    name.includes("calendar") ||
    name.includes("toast") ||
    name.includes("icon")
  ) {
    return "component";
  }

  return "surface";
}

/**
 * Parse kumo-theme.css to extract all semantic color tokens.
 */
export function parseSemanticTokens(): SemanticToken[] {
  const content = readFileSync(themePath, "utf-8");
  const tokens: SemanticToken[] = [];

  // Match semantic color definitions that use light-dark()
  // Pattern: --text-color-<name>: light-dark(...) or --color-<name>: light-dark(...)
  const tokenPattern =
    /--(text-)?color-([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*(light-dark\s*\([^;]+\))/g;

  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(content)) !== null) {
    const isTextColor = match[1] === "text-";
    const name = match[2];
    const value = match[3];

    // Skip raw palette colors (2-3 digit numeric suffixes like -650, -50)
    // But keep semantic tokens with single-digit suffixes like surface-2, color-3
    const lastSegment = name.split("-").pop() || "";
    if (/^\d{2,3}$/.test(lastSegment)) continue;

    const lightDark = parseLightDark(value);
    if (!lightDark) continue;

    tokens.push({
      cssVar: isTextColor ? `text-color-${name}` : `color-${name}`,
      name,
      category: categorizeToken(name, isTextColor),
      isTextColor,
      lightValue: lightDark.light,
      darkValue: lightDark.dark,
      purpose: inferPurpose(name, isTextColor),
    });
  }

  return tokens;
}

/**
 * Parse kumo-binding.css to extract theme overrides (data-theme selectors).
 */
export function parseThemeOverrides(): ThemeOverride[] {
  const content = readFileSync(bindingPath, "utf-8");
  const overrides: ThemeOverride[] = [];

  // Match [data-theme="..."] blocks
  const themePattern = /\[data-theme="([^"]+)"\]\s*\{([^}]+)\}/g;

  let match: RegExpExecArray | null;
  while ((match = themePattern.exec(content)) !== null) {
    const themeName = match[1];
    const block = match[2];

    // Extract token names from the block
    const tokenPattern = /--(text-)?color-([a-zA-Z][a-zA-Z0-9-]*)\s*:/g;
    const tokens: string[] = [];
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenPattern.exec(block)) !== null) {
      tokens.push(tokenMatch[2]);
    }

    overrides.push({
      name: themeName,
      selector: `[data-theme="${themeName}"]`,
      tokens,
    });
  }

  return overrides;
}

// =============================================================================
// Scan component files for color usage
// =============================================================================

/**
 * Recursively find all .tsx files in a directory.
 */
function findTsxFiles(dir: string): string[] {
  const files: string[] = [];

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .storybook, etc.
      if (!entry.startsWith(".") && entry !== "node_modules") {
        files.push(...findTsxFiles(fullPath));
      }
    } else if (entry.endsWith(".tsx") && !entry.endsWith(".stories.tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract component name from file path.
 */
function getComponentName(filePath: string): string {
  const parts = filePath.split("/");
  const fileName = parts[parts.length - 1];
  // Convert kebab-case to PascalCase
  return fileName
    .replace(".tsx", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Scan a file for Tailwind color class usage.
 */
function scanFileForColors(
  filePath: string,
  validTokenNames: Set<string>,
): Map<string, string> {
  const content = readFileSync(filePath, "utf-8");
  const componentName = getComponentName(filePath);
  const found = new Map<string, string>();

  // Utility prefixes that use color tokens
  const prefixes = ["bg", "text", "border", "ring", "fill", "outline"];

  for (const prefix of prefixes) {
    for (const tokenName of validTokenNames) {
      // Match the class with optional modifiers (hover:, focus:, etc.)
      const pattern = new RegExp(
        `(?:[\\w\\[\\]=_-]+:)*(${prefix}-${tokenName})(?![a-zA-Z0-9-])`,
        "g",
      );
      if (pattern.test(content)) {
        found.set(`${prefix}-${tokenName}`, componentName);
      }
    }
  }

  return found;
}

/**
 * Analyze color usage across all component files.
 */
export function analyzeColorUsage(
  tokens: SemanticToken[],
): Map<string, string[]> {
  const validTokenNames = new Set(tokens.map((t) => t.name));
  const usageMap = new Map<string, Set<string>>();

  // Scan components directory
  const componentsDir = join(srcDir, "components");
  const blocksDir = join(srcDir, "blocks");
  const layoutsDir = join(srcDir, "layouts");

  const allFiles = [
    ...findTsxFiles(componentsDir),
    ...findTsxFiles(blocksDir),
    ...findTsxFiles(layoutsDir),
  ];

  for (const file of allFiles) {
    const fileColors = scanFileForColors(file, validTokenNames);
    for (const [className, componentName] of fileColors) {
      if (!usageMap.has(className)) {
        usageMap.set(className, new Set());
      }
      usageMap.get(className)!.add(componentName);
    }
  }

  // Convert to array format
  const result = new Map<string, string[]>();
  for (const [className, components] of usageMap) {
    result.set(className, [...components].sort());
  }

  return result;
}

/**
 * Get usage statistics sorted by frequency.
 */
export function getUsageStats(
  usageMap: Map<string, string[]>,
): ColorUsageStats[] {
  const stats: ColorUsageStats[] = [];

  for (const [className, components] of usageMap) {
    stats.push({
      className,
      componentCount: components.length,
      components,
    });
  }

  return stats.sort((a, b) => b.componentCount - a.componentCount);
}

// =============================================================================
// Generate markdown style guide
// =============================================================================

/**
 * Generate the complete markdown style guide.
 */
export function generateStyleGuideMarkdown(
  _componentColors: Map<string, string[]>,
): string {
  const tokens = parseSemanticTokens();
  const themeOverrides = parseThemeOverrides();
  const usageMap = analyzeColorUsage(tokens);
  const usageStats = getUsageStats(usageMap);

  // Group tokens by category
  const tokensByCategory = new Map<TokenCategory, SemanticToken[]>();
  for (const token of tokens) {
    if (!tokensByCategory.has(token.category)) {
      tokensByCategory.set(token.category, []);
    }
    tokensByCategory.get(token.category)!.push(token);
  }

  // Get most used tokens for quick reference
  const topBgTokens = usageStats
    .filter((s) => s.className.startsWith("bg-"))
    .slice(0, 6);
  const topTextTokens = usageStats
    .filter((s) => s.className.startsWith("text-"))
    .slice(0, 6);
  const topBorderTokens = usageStats
    .filter(
      (s) =>
        s.className.startsWith("border-") || s.className.startsWith("ring-"),
    )
    .slice(0, 4);

  let md = `## Kumo Color System

**Critical Rule:** Only use Kumo semantic tokens. Never use raw Tailwind colors like \`bg-gray-500\` or \`text-blue-600\`.

### Quick Reference (Most Used)

| Purpose | Token | Usage |
|---------|-------|-------|
`;

  // Add most used tokens to quick reference
  for (const stat of topBgTokens.slice(0, 4)) {
    const tokenName = stat.className.replace(/^bg-/, "");
    // Find the non-text token with this name
    const token = tokens.find((t) => t.name === tokenName && !t.isTextColor);
    if (token) {
      md += `| ${token.purpose} | \`${stat.className}\` | ${stat.componentCount} components |\n`;
    }
  }
  for (const stat of topTextTokens.slice(0, 4)) {
    const tokenName = stat.className.replace(/^text-/, "");
    // Find the text token with this name
    const token = tokens.find((t) => t.name === tokenName && t.isTextColor);
    if (token) {
      md += `| ${token.purpose} | \`${stat.className}\` | ${stat.componentCount} components |\n`;
    }
  }
  for (const stat of topBorderTokens.slice(0, 2)) {
    const tokenName = stat.className.replace(/^(border|ring)-/, "");
    const token = tokens.find((t) => t.name === tokenName && !t.isTextColor);
    if (token) {
      md += `| ${token.purpose} | \`${stat.className}\` | ${stat.componentCount} components |\n`;
    }
  }

  md += `
### Dark Mode & Theming

Kumo uses CSS custom properties with \`light-dark()\` for automatic dark mode support.

**Mode Control (\`data-mode\`):**
\`\`\`html
<html data-mode="light">  <!-- Light mode -->
<html data-mode="dark">   <!-- Dark mode -->
\`\`\`

**Theme Variants (\`data-theme\`):**
`;

  if (themeOverrides.length > 0) {
    for (const theme of themeOverrides) {
      md += `- \`data-theme="${theme.name}"\` - Overrides: ${theme.tokens.join(", ")}\n`;
    }
  } else {
    md += `- Default theme (no \`data-theme\` attribute needed)\n`;
  }

  md += `
**Never use \`dark:\` variants** - semantic tokens handle dark mode automatically.

### Surface Tokens (Backgrounds)

| Token | Purpose | Tailwind Classes |
|-------|---------|------------------|
`;

  const surfaceTokens = tokensByCategory.get("surface") || [];
  for (const token of surfaceTokens) {
    md += `| \`${token.name}\` | ${token.purpose} | \`bg-${token.name}\` |\n`;
  }

  md += `
### Text Tokens

| Token | Purpose | Tailwind Class |
|-------|---------|----------------|
`;

  const textTokens = tokensByCategory.get("text") || [];
  for (const token of textTokens) {
    md += `| \`${token.name}\` | ${token.purpose} | \`text-${token.name}\` |\n`;
  }

  md += `
### State Tokens (Error, Warning, Info)

| Token | Purpose | Background | Text | Selection |
|-------|---------|------------|------|-----------|
`;

  const stateTokens = tokensByCategory.get("state") || [];
  // Group by base state name
  const stateGroups = new Map<string, SemanticToken[]>();
  for (const token of stateTokens) {
    const baseName = token.name.replace("-selection", "");
    if (!stateGroups.has(baseName)) {
      stateGroups.set(baseName, []);
    }
    stateGroups.get(baseName)!.push(token);
  }

  for (const [baseName, group] of stateGroups) {
    const bgToken = group.find((t) => !t.name.includes("selection"));
    const selToken = group.find((t) => t.name.includes("selection"));

    md += `| ${baseName} | ${bgToken?.purpose || "State"} | \`bg-${baseName}\` | \`text-${baseName}\` | ${selToken ? `\`bg-${selToken.name}\`` : "—"} |\n`;
  }

  md += `
### Interactive Tokens (Hover, Focus, Active)

| Token | Purpose | Usage |
|-------|---------|-------|
`;

  const interactiveTokens = tokensByCategory.get("interactive") || [];
  for (const token of interactiveTokens) {
    const usage = usageMap.get(`bg-${token.name}`);
    const usageCount = usage ? usage.length : 0;
    md += `| \`${token.name}\` | ${token.purpose} | \`bg-${token.name}\`, \`ring-${token.name}\` (${usageCount} uses) |\n`;
  }

  md += `
### Border & Ring Tokens

| Token | Purpose | Border | Ring |
|-------|---------|--------|------|
`;

  const borderTokens = tokensByCategory.get("border") || [];
  for (const token of borderTokens) {
    md += `| \`${token.name}\` | ${token.purpose} | \`border-${token.name}\` | \`ring-${token.name}\` |\n`;
  }

  md += `
### Usage Patterns

**Most common color combinations in Kumo components:**

\`\`\`tsx
// Card/container pattern
<div className="bg-surface border border-border rounded-lg">

// Button patterns
<button className="bg-primary text-white">Primary</button>
<button className="bg-secondary text-surface ring ring-border">Secondary</button>

// Form input pattern
<input className="bg-secondary text-surface ring ring-border focus:ring-active" />

// Error state pattern
<div className="bg-error/20 border-error text-error">Error message</div>

// Hover state pattern
<div className="bg-surface hover:bg-subtle">Hoverable item</div>
\`\`\`

`;

  // Add component-specific tokens if any
  const componentTokens = tokensByCategory.get("component") || [];
  if (componentTokens.length > 0) {
    md += `### Component-Specific Tokens

These tokens are used by specific components:

| Token | Purpose | Component |
|-------|---------|-----------|
`;
    for (const token of componentTokens) {
      const componentName = token.name.split("-")[0];
      md += `| \`${token.name}\` | ${token.purpose} | ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} |\n`;
    }
    md += "\n";
  }

  return md;
}

// =============================================================================
// Legacy exports for backwards compatibility
// =============================================================================

export interface ParsedTokens {
  textColors: string[];
  bgColors: string[];
  borderColors: string[];
  ringColors: string[];
  fillColors: string[];
}

/**
 * @deprecated Use parseSemanticTokens() instead
 */
export function parseSemanticTokensLegacy(): ParsedTokens {
  const tokens = parseSemanticTokens();

  const textColors = tokens
    .filter((t) => t.isTextColor)
    .map((t) => `text-${t.name}`);

  const bgColors = tokens
    .filter((t) => !t.isTextColor)
    .map((t) => `bg-${t.name}`);

  const borderColors = tokens
    .filter(
      (t) =>
        !t.isTextColor &&
        (t.category === "border" || t.category === "interactive"),
    )
    .map((t) => `border-${t.name}`);

  const ringColors = tokens
    .filter(
      (t) =>
        !t.isTextColor &&
        (t.name.includes("active") ||
          t.name.includes("border") ||
          t.name.includes("error")),
    )
    .map((t) => `ring-${t.name}`);

  const fillColors = tokens
    .filter((t) => t.name.includes("icon"))
    .map((t) => `fill-${t.name}`);

  return {
    textColors: [...new Set(textColors)].sort(),
    bgColors: [...new Set(bgColors)].sort(),
    borderColors: [...new Set(borderColors)].sort(),
    ringColors: [...new Set(ringColors)].sort(),
    fillColors: [...new Set(fillColors)].sort(),
  };
}
