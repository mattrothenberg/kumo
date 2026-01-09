import { useEffect, useState } from "react";
import { cn } from "@cloudflare/kumo";
import { GitlabIcon } from "./icons/GitlabIcon";
import { StorybookIcon } from "./icons/StorybookIcon";
import { BaseUIIcon } from "./icons/BaseUIIcon";

/** Height of the sticky header in pixels - matches h-12 Tailwind class (3rem) */
const STICKY_HEADER_HEIGHT = 48;

interface StickyDocHeaderProps {
  title: string;
  gitlabSourceUrl?: string | null;
  storybookUrl?: string | null;
  baseUIUrl?: string | null;
}

export function StickyDocHeader({
  title,
  gitlabSourceUrl,
  storybookUrl,
  baseUIUrl,
}: StickyDocHeaderProps) {
  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Watch for sidebar state changes
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector("aside[data-sidebar-open]");
      if (sidebar) {
        const isOpen = sidebar.getAttribute("data-sidebar-open") === "true";
        setSidebarOpen(isOpen);
      }
    };

    // Check initially
    checkSidebarState();

    // Watch for attribute changes
    const sidebar = document.querySelector("aside[data-sidebar-open]");
    if (!sidebar) return;

    const observer = new MutationObserver(checkSidebarState);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["data-sidebar-open"],
    });

    return () => observer.disconnect();
  }, []);

  // Watch for page header visibility
  useEffect(() => {
    const pageHeader = document.getElementById("page-header");
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
    <>
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
            <span className="text-muted">/ </span>
            <span className="font-semibold">{title}</span>
            {gitlabSourceUrl && (
              <a
                href={gitlabSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-label"
                title="View source on GitLab"
                aria-label="View source on GitLab"
                tabIndex={showStickyTitle ? 0 : -1}
              >
                <GitlabIcon size={18} />
              </a>
            )}
            {storybookUrl && (
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-label"
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
                className="text-muted transition-colors hover:text-label"
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

      {/* Sticky header bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface-secondary pr-12">
        <div className="mx-auto flex h-12 items-center justify-between border-r border-border px-4">
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
                className="text-muted transition-colors hover:text-label"
                title="View source on GitLab"
                aria-label="View source on GitLab"
                tabIndex={showStickyTitle && sidebarOpen ? 0 : -1}
              >
                <GitlabIcon size={20} />
              </a>
            )}
            {storybookUrl && (
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-label"
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
                className="text-muted transition-colors hover:text-label"
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
            className="font-mono text-base text-muted transition-colors hover:text-label"
          >
            @cloudflare/kumo
          </a>
        </div>
      </header>
    </>
  );
}
