import { defineRule } from "oxlint";

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
  // "black",
  // "white",
]);

// Semantic color families that are backed by kumo-binding.css
export const SEMANTIC_COLORS = new Set([
  "surface",
  "surface-secondary",
  "surface-active",
  "primary",
  "secondary",
  "secondary-hover",
  "accent",
  "destructive",
  "muted",
  "input",
  "active",
  "border-hover",
  "color",
  "color-surface",
  "color-primary",
  "color-secondary",
  "color-destructive",
  "color-error",
]);

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

function hasPrimitiveOrSemanticColor(str) {
  if (!str) return false;

  TOKEN_RE.lastIndex = 0;
  let match;
  while ((match = TOKEN_RE.exec(str))) {
    const fullToken = match[1];
    const colorFamily = match[3];

    if (!fullToken || !colorFamily) continue;

    // Flag both Tailwind primitive families (e.g. blue, slate, red)
    // and legacy semantic families (e.g. surface, primary, active).
    // Tailwind utilities often use a numeric shade suffix (e.g. neutral-500).
    // Our TAILWIND_COLOR_FAMILIES set only tracks the base family name
    // (e.g. "neutral"), so strip off a trailing -NN or -NNN segment when
    // checking for primitive families.
    const primitiveFamily = colorFamily.split("-")[0];

    if (TAILWIND_COLOR_FAMILIES.has(primitiveFamily)) return true;

    // Semantic color families in SEMANTIC_COLORS may legitimately contain
    // hyphens (e.g. surface-secondary), so we check the full token here
    // without normalization.
    if (SEMANTIC_COLORS.has(colorFamily)) return true;
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
        if (hasPrimitiveOrSemanticColor(s)) {
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
      Literal(node) {
        if (
          typeof node.value === "string" &&
          hasPrimitiveOrSemanticColor(node.value)
        ) {
          context.report({ node, messageId: RULE_NAME });
        }
      },
      TemplateLiteral(node) {
        const strings = extractStrings(node);
        if (strings.some(hasPrimitiveOrSemanticColor)) {
          context.report({ node, messageId: RULE_NAME });
        }
      },
    };
  },
});
