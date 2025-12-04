/**
 * Extract examples from Storybook stories for AI consumption
 *
 * This script parses .stories.tsx files and extracts usable code examples,
 * filtering out propTester-based stories (which are for visual QA, not AI examples).
 *
 * Run: pnpm tsx scripts/ai/extract-story-examples.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, "../../src/components");
const blocksDir = join(__dirname, "../../src/blocks");

// =============================================================================
// Types
// =============================================================================

interface ExtractedExample {
  storyName: string;
  type: "render" | "args" | "propTester";
  code: string;
  /** If true, this example uses propTester and should be skipped for AI */
  usesPropTester: boolean;
  /** If true, this is a simple args-based story */
  isArgsOnly: boolean;
}

interface PropTesterCall {
  /** The prop values array (e.g., ["default", "alert", "error"]) */
  propValues: string[];
  /** The prop name being tested (e.g., "variant") */
  propName: string;
  /** The component name (e.g., "Banner") */
  componentName: string;
  /** Base props on the component (e.g., { text: '"Message"' }) */
  baseProps: Record<string, string>;
  /** Children content if any */
  children?: string;
}

interface StoryFileExamples {
  componentName: string;
  filePath: string;
  examples: ExtractedExample[];
}

// =============================================================================
// AST Parsing Helpers
// =============================================================================

function getNodeText(node: ts.Node, sourceFile: ts.SourceFile): string {
  return node.getText(sourceFile);
}

/**
 * Extract variant keys from imports like KUMO_BADGE_VARIANTS
 * Returns a map of variant constant name -> variant keys
 */
function extractVariantImports(
  sourceFile: ts.SourceFile,
): Map<string, string[]> {
  const variantMap = new Map<string, string[]>();

  // We need to actually import and evaluate the variants
  // For now, we'll parse the import and load the module dynamically
  // This is handled at runtime by the component-registry.ts which has access to the actual values

  return variantMap;
}

/**
 * Parse a propTester call and extract its arguments
 */
function parsePropTesterCall(
  callExpr: ts.CallExpression,
  sourceFile: ts.SourceFile,
  variantConstants: Map<string, string[]>,
): PropTesterCall | null {
  const args = callExpr.arguments;
  if (args.length < 3) return null;

  // First arg: Object.keys(KUMO_*_VARIANTS.variant) or array literal
  let propValues: string[] = [];
  const firstArg = args[0];

  if (ts.isCallExpression(firstArg)) {
    // Object.keys(...) pattern
    const innerArgs = firstArg.arguments;
    if (innerArgs.length > 0) {
      const propAccess = innerArgs[0];
      if (ts.isPropertyAccessExpression(propAccess)) {
        // Get the full property access path (e.g., "KUMO_BUTTON_VARIANTS.variant")
        const fullPath = getNodeText(propAccess, sourceFile);
        // Store for later resolution
        propValues = variantConstants.get(fullPath) || [];
      }
    }
  } else if (ts.isArrayLiteralExpression(firstArg)) {
    // Direct array literal
    propValues = firstArg.elements
      .filter(ts.isStringLiteral)
      .map((el) => el.text);
  }

  // Second arg: prop name (string literal)
  const secondArg = args[1];
  if (!ts.isStringLiteral(secondArg)) return null;
  const propName = secondArg.text;

  // Third arg: JSX element
  const thirdArg = args[2];
  if (!ts.isJsxElement(thirdArg) && !ts.isJsxSelfClosingElement(thirdArg)) {
    return null;
  }

  // Extract component name and props from JSX
  let componentName = "";
  const baseProps: Record<string, string> = {};
  let children: string | undefined;

  if (ts.isJsxSelfClosingElement(thirdArg)) {
    componentName = getNodeText(thirdArg.tagName, sourceFile);
    extractJsxAttributes(thirdArg.attributes, sourceFile, baseProps);
  } else if (ts.isJsxElement(thirdArg)) {
    componentName = getNodeText(thirdArg.openingElement.tagName, sourceFile);
    extractJsxAttributes(
      thirdArg.openingElement.attributes,
      sourceFile,
      baseProps,
    );
    // Extract children - preserve original formatting including newlines
    // JsxText nodes with only whitespace return empty from getText(), so use .text property
    const childrenText = thirdArg.children
      .map((c) => {
        if (ts.isJsxText(c)) {
          return c.text;
        }
        return getNodeText(c, sourceFile);
      })
      .join("");
    // Trim leading/trailing whitespace but preserve internal structure
    const trimmedChildren = childrenText.trim();
    if (trimmedChildren) {
      children = trimmedChildren;
    }
  }

  return {
    propValues,
    propName,
    componentName,
    baseProps,
    children,
  };
}

/**
 * Escape a string value for use in JSX attribute (for propTester extraction).
 * Uses template literal syntax {`...`} if the string contains quotes or newlines.
 */
function escapeJsxAttrString(value: string): string {
  const hasDoubleQuote = value.includes('"');
  const hasSingleQuote = value.includes("'");
  const hasNewline = value.includes("\n");

  // If string contains newlines or both quote types, use template literal
  if (hasNewline || (hasDoubleQuote && hasSingleQuote)) {
    // Escape backticks and ${} in template literals
    const escaped = value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    return "{`" + escaped + "`}";
  }

  // If string contains double quotes, use single quotes
  if (hasDoubleQuote) {
    return `'${value}'`;
  }

  // Default: use double quotes
  return `"${value}"`;
}

/**
 * Extract JSX attributes into a props object
 */
function extractJsxAttributes(
  attributes: ts.JsxAttributes,
  sourceFile: ts.SourceFile,
  props: Record<string, string>,
): void {
  for (const attr of attributes.properties) {
    if (ts.isJsxAttribute(attr) && attr.name) {
      const attrName = attr.name.getText(sourceFile);
      if (attr.initializer) {
        if (ts.isStringLiteral(attr.initializer)) {
          props[attrName] = escapeJsxAttrString(attr.initializer.text);
        } else if (ts.isJsxExpression(attr.initializer)) {
          // Capture JSX expression values (e.g., icon={PlusIcon})
          if (attr.initializer.expression) {
            const exprText = getNodeText(
              attr.initializer.expression,
              sourceFile,
            );
            props[attrName] = `{${exprText}}`;
          }
        }
      } else {
        // Boolean shorthand like `disabled` - store with braces for proper JSX
        props[attrName] = "{true}";
      }
    }
  }
}

/**
 * Find all propTester calls in a node and extract their info
 */
function findPropTesterCalls(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  variantConstants: Map<string, string[]>,
): PropTesterCall[] {
  const calls: PropTesterCall[] = [];

  function visit(n: ts.Node) {
    if (
      ts.isCallExpression(n) &&
      ts.isIdentifier(n.expression) &&
      n.expression.text === "propTester"
    ) {
      const parsed = parsePropTesterCall(n, sourceFile, variantConstants);
      if (parsed) {
        calls.push(parsed);
      }
    }
    ts.forEachChild(n, visit);
  }

  visit(node);
  return calls;
}

/**
 * Format JSX with proper indentation for multi-line content.
 * Preserves the structure of the original JSX while adding the tested prop.
 */
function formatJsxWithProp(
  componentName: string,
  propName: string,
  propValue: string,
  baseProps: Record<string, string>,
  children?: string,
): string {
  // Build props string
  const allProps: Record<string, string> = {
    [propName]: `"${propValue}"`,
    ...baseProps,
  };

  const propsString = Object.entries(allProps)
    .map(([key, val]) => `${key}=${val}`)
    .join(" ");

  if (!children) {
    return `<${componentName} ${propsString} />`;
  }

  // Check if children is multi-line
  const trimmedChildren = children.trim();
  const isMultiLine = trimmedChildren.includes("\n");

  if (!isMultiLine) {
    return `<${componentName} ${propsString}>${trimmedChildren}</${componentName}>`;
  }

  // For multi-line children, format with proper indentation
  // Normalize the children indentation
  const lines = trimmedChildren.split("\n");

  // Find minimum indentation (excluding empty lines and the first line which may have been trimmed)
  const nonEmptyLines = lines.filter((l) => l.trim().length > 0);
  // Skip first line when calculating minIndent since it may have been trimmed
  const linesToCheck =
    nonEmptyLines.length > 1 ? nonEmptyLines.slice(1) : nonEmptyLines;
  const minIndent = linesToCheck.reduce((min, line) => {
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  // Re-indent children with 2 spaces
  const reindentedLines = lines.map((line, index) => {
    if (line.trim().length === 0) return "";
    // First line may not have leading whitespace due to trim, just add indent
    if (index === 0) {
      return "  " + line.trim();
    }
    const stripped = line.slice(minIndent);
    return "  " + stripped;
  });

  return `<${componentName} ${propsString}>\n${reindentedLines.join("\n")}\n</${componentName}>`;
}

/**
 * Generate string examples from a propTester call
 */
function generatePropTesterExamples(call: PropTesterCall): string[] {
  const { propValues, propName, componentName, baseProps, children } = call;

  return propValues.map((value) =>
    formatJsxWithProp(componentName, propName, value, baseProps, children),
  );
}

/**
 * Extract the JSX from a render function, cleaning up hooks and state setup
 */
function extractRenderJSX(
  renderNode: ts.Node,
  sourceFile: ts.SourceFile,
  componentName: string,
): {
  code: string;
  usesPropTester: boolean;
  usesArgsSpread: boolean;
  isWrapperComponent: boolean;
} {
  const fullText = getNodeText(renderNode, sourceFile);
  const usesPropTester = fullText.includes("propTester");
  let usesArgsSpread = false;
  let isWrapperComponent = false;

  // For arrow functions with block body, try to extract just the return JSX
  if (ts.isArrowFunction(renderNode) && ts.isBlock(renderNode.body)) {
    // Find the return statement
    let returnJSX = "";
    ts.forEachChild(renderNode.body, (child) => {
      if (ts.isReturnStatement(child) && child.expression) {
        returnJSX = getNodeText(child.expression, sourceFile);
      }
    });

    if (returnJSX) {
      // Clean up the JSX - remove fragments if they just wrap a single element
      returnJSX = cleanupJSX(returnJSX);
      // Check if this is a wrapper component (not the actual component)
      isWrapperComponent = isWrapperComponentJSX(returnJSX, componentName);
      return {
        code: returnJSX,
        usesPropTester,
        usesArgsSpread,
        isWrapperComponent,
      };
    }
  }

  // For arrow functions with expression body (implicit return)
  if (ts.isArrowFunction(renderNode) && !ts.isBlock(renderNode.body)) {
    let jsx = getNodeText(renderNode.body, sourceFile);
    jsx = cleanupJSX(jsx);
    // Check for {...args} spread pattern
    usesArgsSpread = jsx.includes("{...args}");
    // Check if this is a wrapper component
    isWrapperComponent = isWrapperComponentJSX(jsx, componentName);
    return { code: jsx, usesPropTester, usesArgsSpread, isWrapperComponent };
  }

  return { code: fullText, usesPropTester, usesArgsSpread, isWrapperComponent };
}

/**
 * Check if JSX is rendering a wrapper component instead of the actual component.
 * Wrapper components are typically PascalCase names that don't match the component name.
 */
function isWrapperComponentJSX(jsx: string, componentName: string): boolean {
  // Extract the tag name from JSX like "<DefaultMenuBar />" or "<Wrapper>...</Wrapper>"
  const tagMatch = jsx.match(/^<([A-Z][a-zA-Z0-9]*)/);
  if (!tagMatch) return false;

  const tagName = tagMatch[1];
  // It's a wrapper if the tag doesn't match the component name and doesn't start with component name
  // e.g., "DefaultMenuBar" is a wrapper for "MenuBar", "ToastTriggerButton" is a wrapper for "Toasty"
  return tagName !== componentName && !tagName.includes(componentName);
}

/**
 * Clean up JSX for better readability
 */
function cleanupJSX(jsx: string): string {
  jsx = jsx.trim();

  // Remove wrapping parentheses (common in render functions)
  if (jsx.startsWith("(") && jsx.endsWith(")")) {
    jsx = jsx.slice(1, -1).trim();
  }

  // Remove outer fragment if it's just wrapping a single element
  if (jsx.startsWith("<>") && jsx.endsWith("</>")) {
    const inner = jsx.slice(2, -3).trim();
    // Only unwrap if it's a single element (not multiple children)
    if (!inner.includes("<>") && (inner.match(/<[A-Z]/g) || []).length <= 1) {
      jsx = inner;
    }
  }

  return jsx;
}

/**
 * Check if a string looks like a JavaScript identifier (variable/component name)
 */
function isIdentifier(str: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);
}

/**
 * Check if a string looks like JSX (starts with < and ends with > or />)
 */
function isJSXLike(str: string): boolean {
  const trimmed = str.trim();
  return (
    trimmed.startsWith("<") && (trimmed.endsWith(">") || trimmed.endsWith("/>"))
  );
}

/**
 * Check if value is a JSX marker object from parseArgsObject
 */
function isJsxMarker(value: unknown): value is { __jsx: string } {
  return typeof value === "object" && value !== null && "__jsx" in value;
}

/**
 * Escape a string value for use in JSX attribute.
 * Uses template literal syntax {`...`} if the string contains quotes or newlines.
 */
function escapeJsxStringValue(value: string): string {
  const hasDoubleQuote = value.includes('"');
  const hasSingleQuote = value.includes("'");
  const hasNewline = value.includes("\n");
  const hasBacktick = value.includes("`");

  // If string contains newlines or both quote types, use template literal
  if (hasNewline || (hasDoubleQuote && hasSingleQuote)) {
    // Escape backticks and ${} in template literals
    const escaped = value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
    return "{`" + escaped + "`}";
  }

  // If string contains double quotes, use single quotes
  if (hasDoubleQuote) {
    return `'${value}'`;
  }

  // Default: use double quotes
  return `"${value}"`;
}

/**
 * Convert args object to inline JSX props
 */
function argsToJSX(
  componentName: string,
  args: Record<string, unknown>,
): string {
  const propsStr = Object.entries(args)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => {
      // Handle JSX marker objects from parseArgsObject
      if (isJsxMarker(value)) {
        return `${key}={${value.__jsx}}`;
      }
      if (typeof value === "string") {
        // Check if this looks like an identifier (e.g., PlusIcon, handleClick)
        // or JSX element - these should be wrapped in {}
        if (isIdentifier(value) && /^[A-Z]/.test(value)) {
          // PascalCase identifier - likely a component reference
          return `${key}={${value}}`;
        }
        if (isJSXLike(value)) {
          // JSX element
          return `${key}={${value}}`;
        }
        // Regular string value - properly escape quotes
        return `${key}=${escapeJsxStringValue(value)}`;
      }
      if (typeof value === "boolean") {
        // Always use explicit JSX syntax for booleans: prop={true} or prop={false}
        return `${key}={${value}}`;
      }
      if (typeof value === "number") {
        return `${key}={${value}}`;
      }
      // For complex values (functions, objects), use placeholder
      return `${key}={/* ${typeof value} */}`;
    })
    .join(" ");

  const children = args.children;
  if (children && typeof children === "string") {
    return `<${componentName} ${propsStr}>${children}</${componentName}>`;
  }
  return `<${componentName} ${propsStr} />`;
}

/**
 * Parse args object literal from AST
 */
function parseArgsObject(
  node: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
): Record<string, unknown> {
  const args: Record<string, unknown> = {};

  for (const prop of node.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const key = prop.name.text;
      const valueNode = prop.initializer;

      if (ts.isStringLiteral(valueNode)) {
        args[key] = valueNode.text;
      } else if (
        valueNode.kind === ts.SyntaxKind.TrueKeyword ||
        valueNode.kind === ts.SyntaxKind.FalseKeyword
      ) {
        args[key] = valueNode.kind === ts.SyntaxKind.TrueKeyword;
      } else if (ts.isNumericLiteral(valueNode)) {
        args[key] = Number(valueNode.text);
      } else if (
        ts.isJsxElement(valueNode) ||
        ts.isJsxSelfClosingElement(valueNode)
      ) {
        // JSX element - mark it specially so argsToJSX handles it correctly
        args[key] = { __jsx: getNodeText(valueNode, sourceFile) };
      } else if (ts.isParenthesizedExpression(valueNode)) {
        // Parenthesized expression - unwrap and check if it's JSX
        const inner = valueNode.expression;
        if (ts.isJsxElement(inner) || ts.isJsxSelfClosingElement(inner)) {
          args[key] = { __jsx: getNodeText(inner, sourceFile) };
        } else {
          args[key] = getNodeText(valueNode, sourceFile);
        }
      } else {
        // For complex values, store the source text
        args[key] = getNodeText(valueNode, sourceFile);
      }
    }
  }

  return args;
}

// =============================================================================
// Story File Parser
// =============================================================================

function parseStoryFile(
  filePath: string,
  variantConstants: Map<string, string[]>,
): StoryFileExamples | null {
  const content = readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  // Extract component name from file path (e.g., button.stories.tsx -> Button)
  const fileName = basename(filePath, ".stories.tsx");
  const componentName = fileName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const examples: ExtractedExample[] = [];

  // Find all exported story objects
  ts.forEachChild(sourceFile, (node) => {
    // Look for: export const StoryName: Story = { ... }
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.initializer &&
          ts.isObjectLiteralExpression(decl.initializer)
        ) {
          const storyName = decl.name.text;

          // Skip 'default' export (that's the meta)
          if (storyName === "default") continue;

          const storyObj = decl.initializer;
          let renderCode: string | null = null;
          let argsObj: Record<string, unknown> | null = null;
          let usesPropTester = false;

          let usesArgsSpread = false;
          let isWrapperComponent = false;

          // Look for render and args properties
          for (const prop of storyObj.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
              if (prop.name.text === "render") {
                const result = extractRenderJSX(
                  prop.initializer,
                  sourceFile,
                  componentName,
                );
                renderCode = result.code;
                usesPropTester = result.usesPropTester;
                usesArgsSpread = result.usesArgsSpread;
                isWrapperComponent = result.isWrapperComponent;
              } else if (
                prop.name.text === "args" &&
                ts.isObjectLiteralExpression(prop.initializer)
              ) {
                argsObj = parseArgsObject(prop.initializer, sourceFile);
              }
            }
          }

          // Skip wrapper components - they're not useful as examples
          if (isWrapperComponent) {
            continue;
          }

          // Handle render with args spread: render: (args) => <Component {...args} />
          // Combine with args object to generate a concrete example
          if (renderCode && usesArgsSpread && argsObj) {
            const concreteExample = argsToJSX(componentName, argsObj);
            examples.push({
              storyName,
              type: "render",
              code: concreteExample,
              usesPropTester: false,
              isArgsOnly: false,
            });
          } else if (renderCode && !usesPropTester && !usesArgsSpread) {
            // Regular render function with concrete JSX
            examples.push({
              storyName,
              type: "render",
              code: renderCode,
              usesPropTester: false,
              isArgsOnly: false,
            });
          } else if (renderCode && usesPropTester) {
            // Parse propTester calls and generate examples
            const propTesterCalls = findPropTesterCalls(
              storyObj,
              sourceFile,
              variantConstants,
            );

            for (const call of propTesterCalls) {
              const generatedExamples = generatePropTesterExamples(call);
              for (const code of generatedExamples) {
                examples.push({
                  storyName,
                  type: "propTester",
                  code,
                  usesPropTester: true,
                  isArgsOnly: false,
                });
              }
            }
          } else if (argsObj && !renderCode) {
            // Pure args-based story
            examples.push({
              storyName,
              type: "args",
              code: argsToJSX(componentName, argsObj),
              usesPropTester: false,
              isArgsOnly: true,
            });
          }
        }
      }
    }
  });

  if (examples.length === 0) return null;

  return {
    componentName,
    filePath,
    examples,
  };
}

// =============================================================================
// Directory Scanner
// =============================================================================

function findStoryFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findStoryFiles(fullPath));
    } else if (entry.endsWith(".stories.tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

// =============================================================================
// Main Export Function
// =============================================================================

export interface ComponentExamples {
  componentName: string;
  /** Examples suitable for AI consumption (no propTester) */
  aiExamples: string[];
  /** All examples including propTester ones */
  allExamples: ExtractedExample[];
}

export function extractAllExamples(
  variantConstants?: Map<string, string[]>,
): Map<string, ComponentExamples> {
  // Scan both components and blocks directories
  const componentStoryFiles = findStoryFiles(componentsDir);
  const blockStoryFiles = findStoryFiles(blocksDir);
  const storyFiles = [...componentStoryFiles, ...blockStoryFiles];
  const results = new Map<string, ComponentExamples>();
  const variants = variantConstants || new Map<string, string[]>();

  for (const file of storyFiles) {
    const parsed = parseStoryFile(file, variants);
    if (!parsed) continue;

    // Include both non-propTester examples AND propTester-generated examples
    const aiExamples = parsed.examples
      .filter((ex) => !ex.usesPropTester || ex.type === "propTester")
      .map((ex) => ex.code);

    results.set(parsed.componentName, {
      componentName: parsed.componentName,
      aiExamples,
      allExamples: parsed.examples,
    });
  }

  return results;
}

/**
 * Get examples for a specific component
 */
export function getComponentExamples(
  componentName: string,
  variantConstants?: Map<string, string[]>,
): ComponentExamples | undefined {
  const all = extractAllExamples(variantConstants);
  return all.get(componentName);
}

// =============================================================================
// CLI Output (only runs when executed directly, not when imported)
// =============================================================================

function main() {
  console.log("Extracting examples from story files...\n");

  const allExamples = extractAllExamples();

  for (const [name, data] of allExamples) {
    console.log(`\n## ${name}`);
    console.log(`  AI-suitable examples: ${data.aiExamples.length}`);
    console.log(`  Total stories: ${data.allExamples.length}`);

    const skipped = data.allExamples.filter((ex) => ex.usesPropTester);
    if (skipped.length > 0) {
      console.log(
        `  Skipped (propTester): ${skipped.map((s) => s.storyName).join(", ")}`,
      );
    }

    console.log("\n  Examples:");
    for (const ex of data.aiExamples.slice(0, 2)) {
      // Show first 2
      const preview = ex.length > 100 ? `${ex.slice(0, 100)}...` : ex;
      console.log(`    - ${preview.replace(/\n/g, " ")}`);
    }
  }

  // Summary
  console.log("\n\n=== Summary ===");
  console.log(`Total components with stories: ${allExamples.size}`);

  let totalAI = 0;
  let totalSkipped = 0;
  for (const data of allExamples.values()) {
    totalAI += data.aiExamples.length;
    totalSkipped += data.allExamples.filter((ex) => ex.usesPropTester).length;
  }
  console.log(`Total AI-suitable examples: ${totalAI}`);
  console.log(`Total skipped (propTester): ${totalSkipped}`);
}

// Only run main() when executed directly (not when imported)
const isDirectRun = process.argv[1]?.includes("extract-story-examples");
if (isDirectRun) {
  main();
}
