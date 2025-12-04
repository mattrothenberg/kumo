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
 * For KUMO theme, returns KUMO colors directly.
 * For other themes, returns KUMO colors with theme-specific overrides applied.
 */
function getColorsForTheme(theme: string, display: DisplayMode): KumoColor[] {
  const kumoColors_ = kumoColors.filter(
    (c) => c.theme === "kumo" && matchesDisplay(c.name, display),
  );

  if (theme === "kumo") {
    return kumoColors_;
  }

  const themeOverrides = kumoColors.filter(
    (c) => c.theme === theme && matchesDisplay(c.name, display),
  );

  // Create a map of overrides for quick lookup
  const overrideMap = new Map(themeOverrides.map((c) => [c.name, c]));

  // Replace KUMO colors with overrides where they exist
  return kumoColors_.map((base) => overrideMap.get(base.name) ?? base);
}

export const TailwindColorTokens: FC<TailwindColorTokensProps> = ({
  display = "colors",
}) => {
  const currentTheme = useCurrentTheme();
  const filtered = getColorsForTheme(currentTheme, display);
  const themeOverrideCount =
    currentTheme !== "kumo"
      ? kumoColors.filter(
          (c) => c.theme === currentTheme && matchesDisplay(c.name, display),
        ).length
      : 0;

  return (
    <div className="flex flex-col gap-4 bg-surface p-6 text-surface">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">
          {display === "text-colors" ? "Text Colors" : "Colors"}
        </h1>
      </div>
      <div className="text-sm text-surface">
        Displaying {filtered.length} tokens for <code>{display}</code>
        {currentTheme !== "kumo" && (
          <span className="ml-1">
            ({themeOverrideCount} overridden by{" "}
            <code className="rounded bg-primary p-1">{currentTheme}</code>)
          </span>
        )}
      </div>
      <div className="text-xs leading-relaxed text-surface">
        <p>
          <span className="font-mono">--text-color-*</span> tokens map to
          Tailwind text utilities, and other tokens can be used with background,
          border, ring, outline, and fill utilities.
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>
            Text colors:
            <span className="font-mono"> text-surface</span>,
            <span className="font-mono"> text-muted</span>
          </li>
          <li>
            Backgrounds:
            <span className="font-mono"> bg-surface</span>
          </li>
          <li>
            Borders & rings:
            <span className="font-mono"> border-subtle</span>,
            <span className="font-mono"> ring-border</span>
          </li>
          <li>
            Outline & fill:
            <span className="font-mono"> outline-active</span>,
            <span className="font-mono"> fill-primary</span>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((token: KumoColor) => (
          <div
            key={token.name}
            className={`flex items-center gap-3 rounded-md border bg-surface px-3 py-2 text-xs ${
              token.theme !== "kumo"
                ? "border-2 border-info-border ring-1 ring-info-border/30"
                : "border-color"
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="font-mono text-xs font-medium">{token.name}</div>
              <ColorSwatch label="Light" value={token.light} />
              <ColorSwatch label="Dark" value={token.dark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
