import type { FC } from "react";
import { kumoColors } from "../../scripts/color/dist/storybook-colors";

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

export const TailwindColorTokens: FC<TailwindColorTokensProps> = ({
  display = "colors",
}) => {
  const filtered = kumoColors.filter((color) =>
    matchesDisplay(color.name, display),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold">
          {display === "text-colors" ? "Text Colors" : "Colors"}
        </h1>
      </div>
      <div className="text-muted-foreground text-sm">
        Displaying {filtered.length} tokens for <code>{display}</code>.
      </div>
      <div className="text-muted-foreground text-xs leading-relaxed">
        <p>
          <span className="font-mono">--text-color-*</span> tokens map to
          Tailwind text utilities, and other tokens can be used with background,
          border, ring, outline, and fill utilities.
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>
            Text colors:
            <span className="font-mono"> text-kumo-surface</span>,
            <span className="font-mono"> text-kumo-muted</span>
          </li>
          <li>
            Backgrounds:
            <span className="font-mono"> bg-kumo-surface</span>
          </li>
          <li>
            Borders & rings:
            <span className="font-mono"> border-kumo-subtle</span>,
            <span className="font-mono"> ring-kumo-border</span>
          </li>
          <li>
            Outline & fill:
            <span className="font-mono"> outline-kumo-active</span>,
            <span className="font-mono"> fill-kumo-primary</span>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((token) => (
          <div
            key={token.name}
            className="flex items-center gap-3 rounded-md border border-kumo-color bg-kumo-surface px-3 py-2 text-xs"
          >
            <div className="flex flex-col gap-1">
              <div className="font-mono text-xs font-medium">{token.name}</div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-8 w-8 rounded border border-kumo-color"
                  style={{ background: token.light }}
                />
                <div className="text-muted-foreground flex flex-col text-xs">
                  <span className="text-[10px] tracking-wide uppercase opacity-70">
                    Light
                  </span>
                  <span>{token.light}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-8 w-8 rounded border border-kumo-color"
                  style={{ background: token.dark }}
                />
                <div className="text-muted-foreground flex flex-col text-xs">
                  <span className="text-[10px] tracking-wide uppercase opacity-70">
                    Dark
                  </span>
                  <span>{token.dark}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
