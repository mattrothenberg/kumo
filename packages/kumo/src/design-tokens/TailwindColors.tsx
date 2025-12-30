import { type FC, useMemo, useSyncExternalStore } from "react";
import {
  kumoColors,
  type KumoColor,
} from "../../dist/color/storybook-colors.js";

/**
 * Extract the actual color value from a CSS variable fallback.
 * e.g., "var(--color-neutral-900, oklch(21% 0.006 285.885))" -> "oklch(21% 0.006 285.885)"
 */
function extractColorValue(value: string): string {
  // Match var(--name, fallback) and extract the fallback
  const varMatch = value.match(/^var\([^,]+,\s*(.+)\)$/);
  return varMatch ? varMatch[1] : value;
}

/**
 * Convert a color string to hex.
 * Uses the browser's canvas API for accurate color conversion.
 */
function colorToHex(color: string): string | null {
  if (typeof document === "undefined") return null;

  const actualColor = extractColorValue(color);

  // Skip if already hex or simple values
  if (actualColor.startsWith("#") || actualColor === "transparent") return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = actualColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

/**
 * Displays a color swatch with both the original value and converted hex.
 */
const ColorSwatch: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const hex = useMemo(() => colorToHex(value), [value]);

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex h-8 w-8 shrink-0 rounded border border-color"
        style={{ background: value }}
      />
      <div className="flex flex-col text-xs text-surface">
        <span className="text-[10px] tracking-wide uppercase opacity-70">
          {label}
        </span>
        <span className="truncate text-[10px] opacity-60">
          {value}
          {hex && (
            <span className="ml-1 font-mono font-medium text-surface">
              {hex}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

// We only expose two public display modes, but reuse the same filtering logic
// internally to keep behavior consistent.
type DisplayMode = "colors" | "text-colors";

export type TailwindColorTokensProps = {
  display?: DisplayMode;
};

function matchesDisplay(name: string, display: DisplayMode): boolean {
  const lower = name.toLowerCase();

  if (display === "colors") {
    // Non-text tokens only
    return !lower.startsWith("--text-color-");
  }

  // "text-colors" mode
  return lower.startsWith("--text-color-");
}

// Subscribe to data-theme attribute changes on document.body
function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getTheme(): string {
  return document.body.getAttribute("data-theme") ?? "kumo";
}

function useCurrentTheme(): string {
  return useSyncExternalStore(subscribeToTheme, getTheme, () => "kumo");
}

/**
 * Get effective colors for the current theme.
 *
 * Returns:
 * - All semantic tokens (base kumo tokens)
 * - All global tokens (always shown - these are explicit opt-in classes like bg-fedramp-surface)
 * - Semantic overrides applied when theme !== "kumo"
 */
function getColorsForTheme(theme: string, display: DisplayMode): KumoColor[] {
  // Get base semantic tokens
  const semanticTokens = kumoColors.filter(
    (c) =>
      c.tokenType === "semantic" &&
      c.theme === "kumo" &&
      matchesDisplay(c.name, display),
  );

  // Get ALL global tokens (they're always available as explicit Tailwind classes)
  const globalTokens = kumoColors.filter(
    (c) => c.tokenType === "global" && matchesDisplay(c.name, display),
  );

  // For kumo theme, just return semantic + global tokens
  if (theme === "kumo") {
    return [...semanticTokens, ...globalTokens];
  }

  // For other themes, apply semantic overrides
  const overrideTokens = kumoColors.filter(
    (c) =>
      c.tokenType === "override" &&
      c.theme === theme &&
      matchesDisplay(c.name, display),
  );

  // Create a map of overrides for quick lookup
  const overrideMap = new Map(overrideTokens.map((c) => [c.name, c]));

  // Replace semantic tokens with overrides where they exist
  const effectiveSemanticTokens = semanticTokens.map(
    (base) => overrideMap.get(base.name) ?? base,
  );

  return [...effectiveSemanticTokens, ...globalTokens];
}

export const TailwindColorTokens: FC<TailwindColorTokensProps> = ({
  display = "colors",
}) => {
  const currentTheme = useCurrentTheme();
  const filtered = getColorsForTheme(currentTheme, display);

  // Count semantic tokens and global tokens separately
  const semanticCount = filtered.filter(
    (c) => c.tokenType === "semantic",
  ).length;
  const globalCount = filtered.filter((c) => c.tokenType === "global").length;
  const overrideCount =
    currentTheme !== "kumo"
      ? kumoColors.filter(
          (c) =>
            c.tokenType === "override" &&
            c.theme === currentTheme &&
            matchesDisplay(c.name, display),
        ).length
      : 0;

  return (
    <div className="flex flex-col gap-4 bg-surface p-8 text-surface">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">
          {display === "text-colors" ? "Text Colors" : "Colors"}
        </h1>
      </div>
      <div className="text-sm text-surface">
        Displaying {filtered.length} tokens ({semanticCount} semantic
        {globalCount > 0 && `, ${globalCount} global`})
        {overrideCount > 0 && (
          <span className="ml-1">
            — {overrideCount} overridden by{" "}
            <code className="rounded bg-primary p-1">{currentTheme}</code>
          </span>
        )}
      </div>
      <div className="text-xs leading-relaxed text-surface">
        <p className="font-medium">Tailwind Usage:</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>
            Text colors:
            <span className="font-mono"> text-surface</span>,
            <span className="font-mono"> text-muted</span>
          </li>
          <li>
            Backgrounds:
            <span className="font-mono"> bg-surface</span>,
            <span className="font-mono"> bg-fedramp-surface</span>
          </li>
          <li>
            Borders & rings:
            <span className="font-mono"> border-subtle</span>,
            <span className="font-mono"> ring-border</span>
          </li>
        </ul>

        <p className="mt-3 font-medium">Theme Types:</p>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          <li>
            <strong>Global tokens</strong> (e.g.,{" "}
            <span className="font-mono">bg-fedramp-surface</span>) — Explicit
            opt-in, use anywhere
          </li>
          <li>
            <strong>Semantic overrides</strong> (via{" "}
            <span className="font-mono">data-theme</span>) — Cascading, all
            children inherit theme colors
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((token: KumoColor) => (
          <div
            key={token.name}
            className={`flex items-center gap-3 rounded-md border bg-surface px-3 py-2 text-xs ${
              token.tokenType === "global"
                ? "border-2 border-info ring-1 ring-info/30"
                : "border-color"
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium">
                  {token.name}
                </span>
                {token.tokenType === "global" && (
                  <span className="rounded bg-info/20 px-1.5 py-0.5 text-[10px] font-medium text-info">
                    global
                  </span>
                )}
              </div>
              <ColorSwatch label="Light" value={token.light} />
              <ColorSwatch label="Dark" value={token.dark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
