import React from "react";
import { cn } from "@cloudflare/kumo";
import { ArrowSquareOut } from "@phosphor-icons/react";

interface DocLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  /** Base UI component name (e.g., "combobox", "dialog") - will link to Base UI docs */
  baseUIComponent?: string;
}

/**
 * Standard layout for component documentation pages
 */
export function DocLayout({
  title,
  description,
  children,
  className,
  baseUIComponent,
}: DocLayoutProps) {
  const baseUIUrl = baseUIComponent
    ? `https://base-ui.com/react/components/${baseUIComponent}`
    : null;

  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800">
        <div className="mx-auto flex h-12 items-center border-r border-neutral-200 px-4 dark:border-neutral-800">
          <p className="ml-auto font-mono text-base text-neutral-500">
            @cloudflare/kumo
          </p>
        </div>
      </header>

      {/* Page Header */}
      <div className="border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800">
        <div className="mx-auto border-r border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-8 py-12">
            <h1 className="mb-3 text-4xl font-bold text-surface">{title}</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
            {baseUIUrl && (
              <a
                href={baseUIUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                <span>View Base UI documentation</span>
                <ArrowSquareOut size={14} weight="bold" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex grow flex-col pr-12">
        <div className="mx-auto w-full grow border-r border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-8 py-12">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
