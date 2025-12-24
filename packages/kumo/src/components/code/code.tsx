import { type CSSProperties } from "react";
import { cn } from "../../utils/cn";

export const KUMO_CODE_VARIANTS = {
  lang: {
    ts: {
      classes: "",
      description: "TypeScript code",
    },
    tsx: {
      classes: "",
      description: "TypeScript JSX code",
    },
    jsonc: {
      classes: "",
      description: "JSON with comments",
    },
    bash: {
      classes: "",
      description: "Shell/Bash commands",
    },
    css: {
      classes: "",
      description: "CSS styles",
    },
  },
} as const;

export const KUMO_CODE_DEFAULT_VARIANTS = {
  lang: "ts",
} as const;

// Derived types from KUMO_CODE_VARIANTS
export type KumoCodeLang = keyof typeof KUMO_CODE_VARIANTS.lang;

export interface KumoCodeVariantsProps {
  lang?: KumoCodeLang;
}

export function codeVariants({
  lang = KUMO_CODE_DEFAULT_VARIANTS.lang,
}: KumoCodeVariantsProps = {}) {
  return cn(
    // Base styles
    "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-label",
    // Apply lang-specific styles (currently none, but extensible)
    KUMO_CODE_VARIANTS.lang[lang].classes,
  );
}

// Legacy type alias for backwards compatibility
export type CodeLang = KumoCodeLang;

/** @deprecated Use CodeLang instead */
export type BundledLanguage = CodeLang;

export interface CodeProps extends KumoCodeVariantsProps {
  /** The code content to display */
  code: string;
  /** Template values for interpolation */
  values?: Record<
    string,
    {
      value: string;
      highlight?: boolean;
    }
  >;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

/**
 * Simple code component without syntax highlighting
 */
export function Code({
  code,
  lang = KUMO_CODE_DEFAULT_VARIANTS.lang,
  className,
  style,
}: CodeProps) {
  return (
    <pre className={cn(codeVariants({ lang }), className)} style={style}>
      {code}
    </pre>
  );
}

export interface CodeBlockProps {
  /** The code content to display */
  code: string;
  /** Language for syntax highlighting metadata */
  lang?: CodeLang;
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  return (
    <div className="min-w-0 rounded-md border border-color bg-surface [&>pre]:p-2.5!">
      <Code lang={lang} code={code} />
    </div>
  );
}
