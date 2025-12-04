import React from "react";
import { cn } from "@cloudflare/kumo";

interface DocLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard layout for component documentation pages
 */
export function DocLayout({
  title,
  description,
  children,
  className,
}: DocLayoutProps) {
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
