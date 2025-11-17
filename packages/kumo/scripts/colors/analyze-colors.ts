import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import ts from "typescript";
import { IGNORE_FILES } from "./constants.js";

// Run with:
// pnpm dlx tsx packages/kumo/scripts/colors/analyze-colors.ts \
//   packages/kumo/src/styles/kumo-binding.css \
//   packages/kumo/src/components

type MatchItem = { match: string; source: string; snippet: string };
type GroupedBySource = Record<string, MatchItem[]>; // src -> [ { match, snippet } ]

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css"]);
export const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".cache",
  "coverage",
  ".turbo",
  ".wrangler",
]);

function parseRootsFromArgs(argv: string[]): string[] {
  const roots: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) continue;
    roots.push(arg.trim());
  }
  return roots;
}

// Unified token matcher based on requested criteria:
// - prefixes: bg-, border-, text-, ring-, fill-
// - variant prefixes: e.g., hover:, focus:, active:, dark:, group-hover: (zero or more)
// - colors: provided lists (tailwind palettes + semantic names)
// - optional numeric shade -DD or -DDD, optional opacity /NN
// Capture groups:
//   1: full token (e.g., dark:hover:text-neutral-800)
//   2: variant prefixes (may be empty), e.g., "dark:hover:"
//   3: rest after utility (family-and-maybe-shade base), used for allowlist filtering
// Expanded utilities: bg, border, text, ring, ring-offset, fill, stroke, placeholder, caret, accent, decoration, divide, outline, from, via, to
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
  // common utility color keywords
  "black",
  "white",
  "transparent",
  "current",
  "inherit",
]);

// Semantic colors from app/kumo-binding.css (allow list)
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

function isAllowedColorFamily(family: string): boolean {
  return TAILWIND_COLOR_FAMILIES.has(family) || SEMANTIC_COLORS.has(family);
}

async function walk(dir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      await walk(full, files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.has(ext)) files.push(full);
    }
  }
  return files;
}

async function collectFilesFromRoots(roots: string[]): Promise<string[]> {
  const files: string[] = [];
  for (const root of roots) {
    const abs = path.resolve(process.cwd(), root);
    try {
      // If this succeeds, treat the path as a directory and walk it.
      await walk(abs, files);
    } catch {
      // If walking fails, treat it as a single file path.
      const ext = path.extname(abs);
      if (EXTENSIONS.has(ext)) {
        files.push(abs);
      }
    }
  }
  return files;
}

async function analyzeFile(filePath: string): Promise<MatchItem[]> {
  try {
    const content = await readFile(filePath, "utf8");
    const out: MatchItem[] = [];
    for (const m of content.matchAll(TOKEN_RE)) {
      const cls = m[1];
      const rest = m[3];
      if (!cls || !rest) continue;

      // Strip trailing punctuation
      const normalized = cls.replace(/[,:;)]$/, "");

      // Determine family (portion before trailing numeric shade if present)
      const parts = rest.split("-");
      const lastPart = parts[parts.length - 1];
      const family = /^\d{2,3}$/.test(lastPart)
        ? parts.slice(0, -1).join("-")
        : rest;

      if (!isAllowedColorFamily(family)) continue;
      const rel = path.posix.normalize(
        path.relative(process.cwd(), filePath).replace(/\\/g, "/")
      );
      // Determine the index of the captured class token in the file to extract a snippet
      const overallIdx = m.index ?? 0;
      const relInMatch = m[0]?.indexOf(m[1]) ?? 0;
      const tokenPos = overallIdx + Math.max(0, relInMatch);
      const snippet = extractSnippet(content, tokenPos);
      // Keep occurrences per (class, snippet) pair so the same utility
      // can be associated with multiple different snippets within a file.
      const key = `${normalized}::${snippet}`;
      if (out.some((item) => `${item.match}::${item.snippet}` === key)) {
        continue;
      }
      out.push({ match: normalized, source: rel, snippet });
    }
    return out;
  } catch {
    return [];
  }
}

function extractSnippet(content: string, pos: number): string {
  try {
    // 1) Use TS AST and try to find the most specific StringLiteral-like node at the position
    const ast = ts.createSourceFile(
      "file.tsx",
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );
    let found: string | null = null;

    function visit(node: ts.Node) {
      if (found) return; // early exit once found
      const start = node.getFullStart();
      const end = node.getEnd();
      if (pos < start || pos > end) return;

      // If the cursor is inside a StringLiteral-like node, return its text directly.
      if (
        (ts.isStringLiteral(node) ||
          ts.isNoSubstitutionTemplateLiteral(node)) &&
        pos >= node.getStart(ast) &&
        pos <= node.getEnd()
      ) {
        found = node.text.trim();
        return;
      }

      if (ts.isJsxAttribute(node)) {
        const name = node.name.getText(ast);
        if (name === "className" || name === "class") {
          const init = node.initializer;
          if (init) {
            // Prefer to dive deeper to locate the specific string literal at position
            ts.forEachChild(init, visit);
            if (found) return;

            // Fallbacks when no specific string literal was matched
            if (
              ts.isStringLiteral(init) ||
              ts.isNoSubstitutionTemplateLiteral(init)
            ) {
              found = init.text.trim();
            } else {
              const text = init.getText(ast);
              const cleaned = text.replace(/^\{\s*/, "").replace(/\s*\}$/, "");
              const m = /^(["'`])(.*)\1$/s.exec(cleaned);
              found = (m ? m[2] : cleaned).replace(/\s+/g, " ").trim();
            }
            return; // stop at first matching attribute that contains the pos
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    if (found) return found;

    // 2) Fallback heuristic window + attribute search
    const windowRadius = 600;
    const start = Math.max(0, pos - windowRadius);
    const end = Math.min(content.length, pos + windowRadius);
    const win = content.slice(start, end);
    const localPos = pos - start;

    // Find the last class or className attribute before the token
    const attrRe = /(className|class)\s*=\s*(["'`])/g;
    let attrMatch: RegExpExecArray | null = null;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(win))) {
      if (m.index < localPos) attrMatch = m;
      else break;
    }
    if (attrMatch) {
      const quote = attrMatch[2];
      const valueStart = attrMatch.index + attrMatch[0].length;
      // Find the closing matching quote after valueStart
      const after = win.slice(valueStart);
      const closeIdx = after.indexOf(quote);
      if (closeIdx > -1) {
        const snippet = after.slice(0, closeIdx);
        return snippet.replace(/\s+/g, " ").trim();
      }
    }

    // Heuristic fallback: take the current line containing the token
    const lineStart = content.lastIndexOf("\n", pos) + 1;
    const lineEnd = content.indexOf("\n", pos);
    const line = content.slice(
      lineStart,
      lineEnd === -1 ? content.length : lineEnd
    );
    return line.replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

async function run(): Promise<GroupedBySource> {
  const envRoot = process.env.ROOT_DIR?.trim();
  const rootsFromArgs = parseRootsFromArgs(process.argv);
  const roots =
    rootsFromArgs.length > 0
      ? rootsFromArgs
      : [envRoot && envRoot.length ? envRoot : "."];
  const files = await collectFilesFromRoots(roots);
  const grouped = new Map<string, MatchItem[]>();
  await Promise.all(
    files.map(async (f) => {
      const rel = path.posix.normalize(
        path.relative(process.cwd(), f).replace(/\\/g, "/")
      );
      if (IGNORE_FILES.has(rel)) return;
      const items = await analyzeFile(f);
      if (!items.length) return;
      const arr = grouped.get(items[0].source) ?? [];
      // Keep all MatchItem entries so the same class can be associated
      // with multiple snippets within the same file.
      arr.push(...items);
      grouped.set(items[0].source, arr);
    })
  );
  const out: GroupedBySource = {};
  const sources = Array.from(grouped.keys()).sort();
  for (const src of sources) {
    const items = grouped.get(src)!;
    // Deterministic ordering per source for stability
    items.sort((a, b) => {
      if (a.snippet === b.snippet) {
        return a.match < b.match ? -1 : a.match > b.match ? 1 : 0;
      }
      return a.snippet < b.snippet ? -1 : 1;
    });
    out[src] = items;
  }
  return out;
}

function parseCssColorVars(
  css: string
): Record<string, string | Record<string, string>> {
  const out: Record<string, string | Record<string, string>> = {};
  const re = /--color-([a-z-]+)(?:-(\d{2,3}))?:\s*([^;]+);/gim;
  for (const m of css.matchAll(re)) {
    const family = m[1];
    const shade = m[2];
    const value = m[3].trim();
    if (!family || !value) continue;
    if (shade) {
      const famMap = (
        typeof out[family] === "object" && out[family] !== null
          ? (out[family] as Record<string, string>)
          : {}
      ) as Record<string, string>;
      famMap[shade] = value;
      out[family] = famMap;
    } else {
      out[family] = value;
    }
  }
  return out;
}

async function readCssColorObject(): Promise<
  Record<string, string | Record<string, string>>
> {
  const cssPath = path.resolve(__dirname, "_tailwind-colors.css");
  try {
    const css = await readFile(cssPath, "utf8");
    return parseCssColorVars(css);
  } catch {
    return {};
  }
}

type SemanticModeColors = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

function parseKumoBinding(css: string): SemanticModeColors {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  // Extract :root block for light mode
  const rootMatch = /:root\s*\{([\s\S]*?)\}/m.exec(css);
  if (rootMatch) {
    const block = rootMatch[1];
    for (const m of block.matchAll(/--kumo-([a-z0-9-]+):\s*([^;]+);/gim)) {
      const name = m[1];
      const value = m[2].trim();
      if (!name || !value) continue;
      light[name] = value;
    }
  }

  // Extract .dark-mode block for dark mode
  const darkMatch = /\.dark-mode\s*\{([\s\S]*?)\}/m.exec(css);
  if (darkMatch) {
    const block = darkMatch[1];
    for (const m of block.matchAll(/--kumo-([a-z0-9-]+):\s*([^;]+);/gim)) {
      const name = m[1];
      const value = m[2].trim();
      if (!name || !value) continue;
      dark[name] = value;
    }
  }

  // Provide semantic aliases that are exposed via @theme as --color-* variables.
  // These are used by Tailwind utilities like ring-active and border-color,
  // but their underlying values live in kumo-border* variables in kumo-binding.css.
  const applyBorderAliases = (target: Record<string, string>) => {
    if (target["border-active"] && !target["active"]) {
      target["active"] = target["border-active"];
    }
    if (target["border"] && !target["color"]) {
      target["color"] = target["border"];
    }
  };

  applyBorderAliases(light);
  applyBorderAliases(dark);

  return { light, dark };
}

async function readSemanticColorObject(): Promise<SemanticModeColors> {
  const bindingPath = path.resolve(__dirname, "..", "app", "kumo-binding.css");
  try {
    const css = await readFile(bindingPath, "utf8");
    return parseKumoBinding(css);
  } catch {
    return { light: {}, dark: {} };
  }
}

run()
  .then(async (items) => {
    const cssColors = await readCssColorObject();
    const semanticColors = await readSemanticColorObject();

    function applyOpacity(base: string, alpha: number): string {
      const a = Math.max(0, Math.min(1, alpha));
      if (/^oklch\(/i.test(base)) {
        if (/\/\s*\d*\.?\d+\s*\)$/i.test(base)) {
          return base.replace(/\/(.*)\)$/i, `/ ${a})`);
        }
        return base.replace(/\)$/i, ` / ${a})`);
      }
      if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(base)) {
        let r = 0,
          g = 0,
          b = 0;
        const hex = base.replace("#", "");
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      if (/^rgba?\(/i.test(base)) {
        // replace existing alpha or append
        const rgba = base.replace(/rgba?\(([^)]+)\)/i, (m, inner) => {
          const comps = inner.split(",").map((s: string) => s.trim());
          const [r, g, b] = comps;
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        });
        return rgba;
      }
      return base;
    }

    function lookupColorForClass(
      cls: string,
      colors: Record<string, string | Record<string, string>>,
      semantic: SemanticModeColors
    ): string {
      const last = cls.split(":").pop() ?? cls;
      let token = last.startsWith("!") ? last.slice(1) : last;

      // Extract explicit opacity suffix /NN
      let explicitAlpha: number | undefined;
      const opMatch = /\/(\d{1,3})$/.exec(token);
      if (opMatch) {
        const nn = Math.max(0, Math.min(100, parseInt(opMatch[1], 10)));
        explicitAlpha = nn / 100;
        token = token.slice(0, token.length - opMatch[0].length);
      }

      const m =
        /^(?:bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-(.+)$/.exec(
          token
        );
      if (!m) return "";
      const rest = m[1];

      const parts = rest.split("-");
      let family: string;
      let shade: string | undefined;
      const lastPart = parts[parts.length - 1];
      if (/^\d{2,3}$/.test(lastPart)) {
        shade = lastPart;
        family = parts.slice(0, -1).join("-");
      } else {
        family = rest;
      }

      const isDarkVariant = /(^|:)dark:/.test(cls);

      // Semantic families that are backed by kumo-binding.css
      if (SEMANTIC_COLORS.has(family)) {
        // In kumo-binding.css we parse variables like `--kumo-surface` into
        // semantic.light["surface"] / semantic.dark["surface"].
        const lightVal = semantic.light[family];
        const darkVal = semantic.dark[family];

        const base = isDarkVariant
          ? (darkVal ?? lightVal)
          : (lightVal ?? darkVal);
        if (base) {
          if (explicitAlpha === undefined) return base;
          return applyOpacity(base, explicitAlpha);
        }
        // Fall through to standard lookup if we didn't find a semantic mapping.
      }

      if (
        family === "inherit" ||
        family === "transparent" ||
        family === "current" ||
        family === "currentColor"
      ) {
        const base = family;
        if (explicitAlpha === undefined) return base;
        return applyOpacity(base, explicitAlpha);
      }

      const entry = colors[family];
      if (!entry) return "";
      let base = "";
      if (typeof entry === "string") {
        base = entry;
      } else {
        if (!shade) return "";
        base = entry[shade] ?? "";
      }
      if (!base) return "";
      if (explicitAlpha === undefined) return base;
      return applyOpacity(base, explicitAlpha);
    }

    // Determine a grouping key for a given class token, based on utility and interaction variants
    function groupingKeyForClass(cls: string): string {
      // Take last segment after last ':' to identify utility
      const last = cls.split(":").pop() ?? cls;
      const token = last.startsWith("!") ? last.slice(1) : last;
      const utilMatch =
        /^(bg|border|text|ring(?:-offset)?|fill|stroke|placeholder|caret|accent|decoration|divide|outline|from|via|to)-/.exec(
          token
        );
      const utility = utilMatch ? utilMatch[1] : "";

      const variants = cls
        .split(":")
        .slice(0, -1) // everything before the utility segment
        .filter(Boolean);
      // Known interaction/state variants to preserve in grouping keys
      const INTERACTION = new Set([
        "hover",
        "focus",
        "focus-within",
        "active",
        "group-hover",
        "selection",
        "disabled",
      ]);
      const interaction = variants.find((v) => INTERACTION.has(v));

      if (interaction && utility) return `${interaction}:${utility}`;
      return utility || "";
    }

    // Output type: src -> [ { snippet -> { groupKey -> { class -> {value} } } } ]
    const finalOut: Record<
      string,
      Array<Record<string, Record<string, Record<string, { value: string }>>>>
    > = {};
    for (const [src, matchItems] of Object.entries(items)) {
      // Build groups: snippet -> groupKey -> classes map
      const groups = new Map<
        string,
        Map<string, Map<string, { value: string }>>
      >();
      for (const { match: cls, snippet } of matchItems as MatchItem[]) {
        const sn = snippet ?? "";
        const grpKey = groupingKeyForClass(cls);
        const snippetMap =
          groups.get(sn) ?? new Map<string, Map<string, { value: string }>>();
        const classMapForGroup =
          snippetMap.get(grpKey) ?? new Map<string, { value: string }>();
        classMapForGroup.set(cls, {
          value: lookupColorForClass(cls, cssColors, semanticColors),
        });
        snippetMap.set(grpKey, classMapForGroup);
        groups.set(sn, snippetMap);
      }

      // Deterministic ordering
      const ordered: Record<
        string,
        Record<string, Record<string, { value: string }>>
      > = {};
      const snippetKeys = Array.from(groups.keys()).sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0
      );
      for (const sn of snippetKeys) {
        const byGroup = groups.get(sn)!;
        const groupKeys = Array.from(byGroup.keys()).sort((a, b) =>
          a < b ? -1 : a > b ? 1 : 0
        );
        const groupedObj: Record<
          string,
          Record<string, { value: string }>
        > = {};
        for (const gk of groupKeys) {
          const classEntries = Array.from(byGroup.get(gk)!.entries()).sort(
            (a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
          );
          groupedObj[gk] = Object.fromEntries(classEntries);
        }
        ordered[sn] = groupedObj;
      }

      finalOut[src] = [ordered];
    }

    // Build unique light/dark value pairs across all sources/snippets/groups
    const pairMap = new Map<string, { light: string; dark: string }>();
    // For each pair key, track the set of group types (bg, text, hover:text, etc.)
    const pairTypes = new Map<string, Set<string>>();
    // For each pair key, track per-source the set of snippet keys in which it appears
    const pairSourceSnippets = new Map<string, Map<string, Set<string>>>();
    for (const [src, arr] of Object.entries(finalOut)) {
      for (const ordered of arr) {
        // ordered: snippet -> (groupKey -> (class -> { value }))
        for (const [snippetKey, groupedObj] of Object.entries(ordered)) {
          for (const [groupKey, classes] of Object.entries(groupedObj)) {
            const lightVals: string[] = [];
            const darkVals: string[] = [];
            for (const [cls, obj] of Object.entries(classes)) {
              const val = obj?.value ?? "";
              if (!val) continue;
              if (/(^|:)dark:/.test(cls)) darkVals.push(val);
              else lightVals.push(val);
            }
            // Create pairings between any light and dark values present in the same group
            for (const lv of lightVals) {
              for (const dv of darkVals) {
                const key = `${lv}__${dv}`;
                if (!pairMap.has(key)) {
                  pairMap.set(key, { light: lv, dark: dv });
                }
                const typeSet = pairTypes.get(key) ?? new Set<string>();
                typeSet.add(groupKey);
                pairTypes.set(key, typeSet);

                const srcMap =
                  pairSourceSnippets.get(key) ?? new Map<string, Set<string>>();
                const snippetSetForSrc = srcMap.get(src) ?? new Set<string>();
                if (snippetKey) snippetSetForSrc.add(snippetKey);
                srcMap.set(src, snippetSetForSrc);
                pairSourceSnippets.set(key, srcMap);
              }
            }
            // If there are light-only classes (no dark variant in this group), include them as singulars
            if (darkVals.length === 0) {
              for (const lv of lightVals) {
                const key = `${lv}__`;
                if (!pairMap.has(key)) {
                  pairMap.set(key, { light: lv, dark: "" });
                }
                const typeSet = pairTypes.get(key) ?? new Set<string>();
                typeSet.add(groupKey);
                pairTypes.set(key, typeSet);

                const srcMap =
                  pairSourceSnippets.get(key) ?? new Map<string, Set<string>>();
                const snippetSetForSrc = srcMap.get(src) ?? new Set<string>();
                if (snippetKey) snippetSetForSrc.add(snippetKey);
                srcMap.set(src, snippetSetForSrc);
                pairSourceSnippets.set(key, srcMap);
              }
            }
            // If there are dark-only classes (no light variant in this group), include them as singulars
            if (lightVals.length === 0) {
              for (const dv of darkVals) {
                const key = `__${dv}`;
                if (!pairMap.has(key)) {
                  pairMap.set(key, { light: "", dark: dv });
                }
                const typeSet = pairTypes.get(key) ?? new Set<string>();
                typeSet.add(groupKey);
                pairTypes.set(key, typeSet);

                const srcMap =
                  pairSourceSnippets.get(key) ?? new Map<string, Set<string>>();
                const snippetSetForSrc = srcMap.get(src) ?? new Set<string>();
                if (snippetKey) snippetSetForSrc.add(snippetKey);
                srcMap.set(src, snippetSetForSrc);
                pairSourceSnippets.set(key, srcMap);
              }
            }
          }
        }
      }
    }

    const theme = Array.from(pairMap.values()).sort((a, b) =>
      a.light === b.light
        ? a.dark < b.dark
          ? -1
          : a.dark > b.dark
            ? 1
            : 0
        : a.light < b.light
          ? -1
          : 1
    );

    // Count total leaf nodes: number of class entries at the deepest level
    function countLeaves(data: typeof finalOut): number {
      let count = 0;
      for (const arr of Object.values(data)) {
        for (const ordered of arr) {
          for (const groupedObj of Object.values(ordered)) {
            for (const classes of Object.values(groupedObj)) {
              count += Object.keys(classes).length;
            }
          }
        }
      }
      return count;
    }

    const tokensObj: Record<
      string,
      {
        light: string;
        dark: string;
        source: Record<
          string,
          Record<string, Record<string, Record<string, { value: string }>>>
        >;
        type: string[];
      }
    > = {};
    for (let i = 0; i < theme.length; i++) {
      const name = `kumo-${i + 1}`;
      const t = theme[i];
      const key = `${t.light}__${t.dark}`;
      const srcMap =
        pairSourceSnippets.get(key) ?? new Map<string, Set<string>>();
      const source: Record<
        string,
        Record<string, Record<string, Record<string, { value: string }>>>
      > = {};
      const srcKeys = Array.from(srcMap.keys()).sort();
      for (const src of srcKeys) {
        const snippetKeys = Array.from(
          srcMap.get(src) ?? new Set<string>()
        ).sort();
        const snippetObj: Record<
          string,
          Record<string, Record<string, { value: string }>>
        > = {};
        const srcDataArray = finalOut[src] ?? [];
        const srcData = srcDataArray[0] ?? {};

        for (const sn of snippetKeys) {
          const entry = (
            srcData as Record<
              string,
              Record<string, Record<string, { value: string }>>
            >
          )[sn];
          if (!entry) continue;

          // Filter groups/classes so this token only references classes whose
          // value matches the token's light or dark value.
          const filteredGroups: Record<
            string,
            Record<string, { value: string }>
          > = {};
          for (const [groupKey, classes] of Object.entries(entry)) {
            const filteredClassesEntries = Object.entries(classes).filter(
              ([, obj]) =>
                !!obj &&
                (obj.value === t.light || (t.dark && obj.value === t.dark))
            );
            if (!filteredClassesEntries.length) continue;
            filteredGroups[groupKey] = Object.fromEntries(
              filteredClassesEntries
            );
          }

          if (Object.keys(filteredGroups).length > 0) {
            snippetObj[sn] = filteredGroups;
          }
        }

        if (Object.keys(snippetObj).length > 0) {
          source[src] = snippetObj;
        }
      }

      const typeSet = pairTypes.get(key) ?? new Set<string>();
      const type = Array.from(typeSet).sort();
      tokensObj[name] = { ...t, source, type };
    }

    const wrapped: {
      tokenLength: number;
      dataLength: number;
      tokens: Record<
        string,
        {
          light: string;
          dark: string;
          source: Record<
            string,
            Record<string, Record<string, Record<string, { value: string }>>>
          >;
          type: string[];
        }
      >;
      data: typeof finalOut;
    } = {
      tokenLength: theme.length,
      dataLength: countLeaves(finalOut),
      tokens: tokensObj,
      data: finalOut,
    };

    // Write tokens.css alongside JSON output, using the same kumo-* indices
    // as the JSON token IDs so that --color-kumo-N matches tokens.kumo-N.
    const cssLines: string[] = [":root {"];
    const tokenNames = Object.keys(tokensObj).sort((a, b) => {
      const na = parseInt(a.split("-")[1] ?? "0", 10);
      const nb = parseInt(b.split("-")[1] ?? "0", 10);
      return na - nb;
    });

    for (const name of tokenNames) {
      const t = tokensObj[name];
      const a = t.light || t.dark || "";
      const b = t.dark || t.light || "";
      if (!a && !b) continue;
      const suffix = name.split("-")[1] ?? name;
      cssLines.push(`  --color-kumo-${suffix}: light-dark(${a}, ${b});`);
    }
    cssLines.push("}");
    const cssOut = cssLines.join("\n") + "\n";
    const cssOutPath = path.resolve(__dirname, "_output", "analyze-tokens.css");
    await mkdir(path.dirname(cssOutPath), { recursive: true });
    await writeFile(cssOutPath, cssOut, "utf8");

    // Also write a copy to the top-level dist directory for tools that
    // expect the CSS variables file at dist/analyze-tokens.css.
    const distCssOutPath = path.resolve(
      process.cwd(),
      "dist",
      "analyze-tokens.css"
    );
    await mkdir(path.dirname(distCssOutPath), { recursive: true });
    await writeFile(distCssOutPath, cssOut, "utf8");

    // Also write the JSON to scripts/analyze-tokens.json
    const jsonOutPath = path.resolve(
      __dirname,
      "_output",
      "analyze-tokens.json"
    );
    await writeFile(
      jsonOutPath,
      JSON.stringify(wrapped, null, 2) + "\n",
      "utf8"
    );

    process.stdout.write(JSON.stringify(wrapped, null, 2) + "\n");
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
