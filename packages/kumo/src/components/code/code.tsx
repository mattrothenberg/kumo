import { type CSSProperties } from "react";
import { cn } from "../../utils/cn";

export type BundledLanguage = "ts" | "tsx" | "jsonc" | "bash" | "css";

/**
 * Simple code component without syntax highlighting
 */
export function Code({
  lang,
  code,
  values,
  className,
  style,
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
        "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-neutral-700 dark:text-neutral-300",
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
    <div className="min-w-0 rounded-md border border-neutral-200 bg-surface dark:border-neutral-800 [&>pre]:p-2.5!">
      <Code lang={lang} code={code} />
    </div>
  );
}
