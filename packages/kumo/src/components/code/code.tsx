import { type CSSProperties } from "react";
import { cn } from "../../utils/cn";

export type BundledLanguage = "ts" | "tsx" | "jsonc" | "bash" | "css";

/**
 * Simple code component without syntax highlighting
 */
export function Code({
  code,
  className,
  style,
  // values,
  // lang,
}: {
  lang: BundledLanguage;
  code: string;
  values?: Record<
    string,
    {
      value: string;
      highlight?: boolean;
    }
  >;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <pre
      className={cn(
        "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-kumo-neutral-subtle",
        className,
      )}
      style={style}
    >
      {code}
    </pre>
  );
}

export function CodeBlock({
  lang,
  code,
}: {
  lang: BundledLanguage;
  code: string;
}) {
  return (
    <div className="min-w-0 rounded-md border border-kumo-color bg-kumo-surface [&>pre]:p-2.5!">
      <Code lang={lang} code={code} />
    </div>
  );
}
