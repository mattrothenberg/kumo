import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { cn } from "@cloudflare/kumo";
import { GitlabLogoSimple } from "@phosphor-icons/react";
import { BaseUIIcon } from "./icons/base-ui-icon";
import { StorybookIcon } from "./icons/storybook-icon";

interface OutletContext {
  sidebarOpen: boolean;
}

/** Height of the sticky header in pixels - matches h-12 Tailwind class (3rem) */
const STICKY_HEADER_HEIGHT = 48;

interface DocLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  /** Base UI component name (e.g., "combobox", "dialog") - will link to Base UI docs */
  baseUIComponent?: string;
  /** Path to the source file in the kumo package (e.g., "components/button") - will link to GitLab */
  sourceFile?: string;
  /** Storybook path (e.g., "story/components-button" or "docs/components-button") - will link to Storybook */
  storybookPath?: string;
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
  sourceFile,
  storybookPath,
}: DocLayoutProps) {
  const { sidebarOpen } = useOutletContext<OutletContext>();

  const baseUIUrl = baseUIComponent
    ? `https://base-ui.com/react/components/${baseUIComponent}`
    : null;
  // Extract the component name from the path (e.g., "components/button" -> "button")
  // and construct the direct file URL (e.g., "components/button/button.tsx")
  const gitlabSourceUrl = sourceFile
    ? (() => {
        const componentName = sourceFile.split("/").pop();
        return `https://gitlab.cfdata.org/cloudflare/fe/kumo/-/blob/main/packages/kumo/src/${sourceFile}/${componentName}.tsx`;
      })()
    : null;

  // Construct Storybook URL from storybookPath prop (e.g., "story/components-button" or "docs/components-button")
  const storybookUrl = storybookPath
    ? `https://storybook.kumo-ui.com/?path=/${storybookPath}`
    : null;

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const [showStickyTitle, setShowStickyTitle] = useState(false);

  useEffect(() => {
    const pageHeader = pageHeaderRef.current;
    if (!pageHeader) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky title when page header is not visible
        setShowStickyTitle(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: `-${STICKY_HEADER_HEIGHT}px 0px 0px 0px` },
    );

    observer.observe(pageHeader);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {/* Sticky title that appears when sidebar is collapsed - positioned to appear after "Kumo" */}
      {!sidebarOpen && (
        <div
          className={cn(
            "pointer-events-none fixed top-0 left-12 z-50 flex h-[49px] items-center font-medium transition-opacity duration-200 select-none",
            showStickyTitle ? "opacity-100" : "opacity-0",
          )}
          style={{ paddingLeft: "4.25rem" }} // Position after "Kumo" text (px-4 + "Kumo" width)
        >
          <span className="pointer-events-auto flex items-center gap-2 text-base">
            <span className="text-neutral-400">/ </span>
            <span className="font-semibold">{title}</span>
            {gitlabSourceUrl && (
              <a
                href={gitlabSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View source on GitLab"
                aria-label="View source on GitLab"
                tabIndex={showStickyTitle ? 0 : -1}
              >
                <GitlabLogoSimple size={18} weight="fill" />
              </a>
            )}
            {storybookUrl && (
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View in Storybook"
                aria-label="View in Storybook"
                tabIndex={showStickyTitle ? 0 : -1}
              >
                <StorybookIcon size={18} />
              </a>
            )}
            {baseUIUrl && (
              <a
                href={baseUIUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View Base UI documentation"
                aria-label="View Base UI documentation"
                tabIndex={showStickyTitle ? 0 : -1}
              >
                <BaseUIIcon size={18} />
              </a>
            )}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800">
        <div className="mx-auto flex h-12 items-center justify-between border-r border-neutral-200 px-4 dark:border-neutral-800">
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              showStickyTitle && sidebarOpen
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <span className="text-lg font-semibold text-surface">{title}</span>
            {gitlabSourceUrl && (
              <a
                href={gitlabSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View source on GitLab"
                aria-label="View source on GitLab"
                tabIndex={showStickyTitle && sidebarOpen ? 0 : -1}
              >
                <GitlabLogoSimple size={20} weight="fill" />
              </a>
            )}
            {storybookUrl && (
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View in Storybook"
                aria-label="View in Storybook"
                tabIndex={showStickyTitle && sidebarOpen ? 0 : -1}
              >
                <StorybookIcon size={20} />
              </a>
            )}
            {baseUIUrl && (
              <a
                href={baseUIUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                title="View Base UI documentation"
                aria-label="View Base UI documentation"
                tabIndex={showStickyTitle && sidebarOpen ? 0 : -1}
              >
                <BaseUIIcon size={20} />
              </a>
            )}
          </div>
          <a
            href="https://gitlab.cfdata.org/cloudflare/fe/kumo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-base text-neutral-500 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            @cloudflare/kumo
          </a>
        </div>
      </header>

      {/* Page Header */}
      <div
        ref={pageHeaderRef}
        className="border-b border-neutral-200 bg-surface-secondary pr-12 dark:border-neutral-800"
      >
        <div className="mx-auto border-r border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-8 py-12">
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-4xl font-bold text-surface">{title}</h1>
              {gitlabSourceUrl && (
                <a
                  href={gitlabSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  title="View source on GitLab"
                  aria-label="View source on GitLab"
                  tabIndex={showStickyTitle ? -1 : 0}
                >
                  <GitlabLogoSimple size={28} weight="fill" />
                </a>
              )}
              {storybookUrl && (
                <a
                  href={storybookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  title="View in Storybook"
                  aria-label="View in Storybook"
                  tabIndex={showStickyTitle ? -1 : 0}
                >
                  <StorybookIcon size={28} />
                </a>
              )}
              {baseUIUrl && (
                <a
                  href={baseUIUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  title="View Base UI documentation"
                  aria-label="View Base UI documentation"
                  tabIndex={showStickyTitle ? -1 : 0}
                >
                  <BaseUIIcon size={28} />
                </a>
              )}
            </div>
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
