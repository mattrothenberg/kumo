import { defineRule } from "oxlint";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const RULE_NAME = "no-primitive-colors";

// We want to enforce use of Kumo semantic color tokens `--color-kumo-*`.
// Any Tailwind color utility (e.g. `bg-blue-500`) or legacy semantic
// utility (e.g. `bg-active`, `text-surface`) in class strings should be
// replaced by semantic tokens / component APIs.

// Matches Tailwind-like color utilities in class strings.
// Example matches: bg-blue-500, text-surface, border-primary/50, hover:bg-sky-100

export const TOKEN_RE =
  /(?:^|[^a-zA-Z0-9-])(((?:[a-z-]+:)*)?(?:bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-([a-z][a-z0-9-]*)(?:-\d{2,3})?(?:\/[0-9]{1,3})?)/gim;

export const TAILWIND_COLOR_FAMILIES = new Set([
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  // common utility color keywords (note: "transparent" is intentionally
  // excluded so utilities like bg-transparent / ring-transparent are allowed)
  "black",
  "white",
]);

// Parse kumo-theme.css to extract valid semantic color tokens.
// This ensures the allowlist stays in sync with the theme file.
function parseKumoSemanticColors() {
  const themePath = resolve(
    __dirname,
    "../../src/styles/kumo-theme.css"
  );
  const css = readFileSync(themePath, "utf-8");

  const tokens = new Set();

  // Match --color-<name> and --text-color-<name> custom properties.
  // Excludes Tailwind primitive colors (e.g. --color-red-650, --color-blue-400)
  // which have numeric suffixes indicating shade values.
  const colorPropRe = /--(?:text-)?color-([a-z][a-z0-9-]*)(?=\s*:)/gi;
  let match;
  while ((match = colorPropRe.exec(css))) {
    const name = match[1];
    // Skip Tailwind primitive color definitions (e.g. red-650, blue-400, neutral-50)
    // These have 2-3 digit shade values. Single digit suffixes like green-2 are valid semantic tokens.
    if (/^[a-z]+-\d{2,3}$/.test(name)) continue;
    tokens.add(name);
  }

  return tokens;
}

// Valid Kumo semantic color tokens derived from kumo-theme.css.
// These map to CSS custom properties like --color-surface, --text-color-secondary, etc.
export const VALID_KUMO_SEMANTIC_COLORS = parseKumoSemanticColors();

function extractStrings(node) {
  if (!node) return [];
  const out = [];

  switch (node.type) {
    case "Literal": {
      if (typeof node.value === "string") out.push(node.value);
      break;
    }
    case "TemplateLiteral": {
      for (const q of node.quasis) {
        if (typeof q.value.cooked === "string") out.push(q.value.cooked);
      }
      break;
    }
    case "BinaryExpression": {
      if (node.operator === "+") {
        out.push(...extractStrings(node.left));
        out.push(...extractStrings(node.right));
      }
      break;
    }
    case "ArrayExpression": {
      for (const el of node.elements) {
        if (el) {
          out.push(...extractStrings(el));
        }
      }
      break;
    }
    case "ObjectExpression": {
      for (const prop of node.properties) {
        if (prop.type === "Property") {
          out.push(...extractStrings(prop.key));
          out.push(...extractStrings(prop.value));
        }
      }
      break;
    }
    case "CallExpression": {
      for (const arg of node.arguments) {
        if (arg.type === "SpreadElement") continue;
        out.push(...extractStrings(arg));
      }
      break;
    }
    case "ConditionalExpression": {
      out.push(...extractStrings(node.consequent));
      out.push(...extractStrings(node.alternate));
      out.push(...extractStrings(node.test));
      break;
    }
    case "UnaryExpression": {
      out.push(...extractStrings(node.argument));
      break;
    }
    case "LogicalExpression": {
      out.push(...extractStrings(node.left));
      out.push(...extractStrings(node.right));
      break;
    }
    case "JSXText": {
      out.push(node.value);
      break;
    }
    case "JSXExpressionContainer": {
      out.push(...extractStrings(node.expression));
      break;
    }
  }

  return out;
}

function hasPrimitiveColor(str) {
  if (!str) return false;

  TOKEN_RE.lastIndex = 0;
  let match;
  while ((match = TOKEN_RE.exec(str))) {
    const fullToken = match[1];
    const colorFamily = match[3];

    if (!fullToken || !colorFamily) continue;

    // Skip valid Kumo semantic color tokens (e.g. bg-surface, text-secondary,
    // border-color, text-green-2). These are backed by kumo-theme.css custom properties.
    if (VALID_KUMO_SEMANTIC_COLORS.has(colorFamily)) continue;

    // Flag Tailwind primitive color families (e.g. blue, slate, red).
    // Tailwind utilities often use a numeric shade suffix (e.g. neutral-500).
    // The regex captures the color name which may include a trailing numeric
    // segment (e.g. "green-2" from text-green-2). Strip trailing -N segments
    // to get the base family name for checking against Tailwind primitives.
    const primitiveFamily = colorFamily.replace(/-\d+$/, "");

    // Only flag if it's a Tailwind primitive AND not a valid Kumo semantic token.
    // This handles cases like "green-2" where "green" is a Tailwind primitive
    // but "green-2" is a valid Kumo semantic token.
    if (TAILWIND_COLOR_FAMILIES.has(primitiveFamily) && !VALID_KUMO_SEMANTIC_COLORS.has(colorFamily)) return true;
  }

  return false;
}

export const noPrimitiveColorsRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow Tailwind primitive and legacy semantic color utilities in favor of `--color-kumo-*` tokens.",
    },
    messages: {
      [RULE_NAME]:
        "Avoid Tailwind color utilities (e.g. `bg-blue-500`, `border-red-500`). Use `--color-kumo-*` semantic tokens or component APIs instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  createOnce(context) {
    function reportIfPrimitiveColor(node, collected) {
      for (const s of collected) {
        if (hasPrimitiveColor(s)) {
          context.report({ node, messageId: RULE_NAME });
          return;
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name =
          node.name.type === "JSXIdentifier" ? node.name.name : undefined;
        if (name !== "className" && name !== "class") return;

        if (node.value) {
          const strings = extractStrings(node.value);
          reportIfPrimitiveColor(node, strings);
        }
      },
    };
  },
});
