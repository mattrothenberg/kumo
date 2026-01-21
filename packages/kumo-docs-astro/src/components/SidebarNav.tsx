import { useState, useEffect } from "react";
import { cn, Button } from "@cloudflare/kumo";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { KumoMenuIcon } from "./KumoMenuIcon";
import { SearchDialog } from "./SearchDialog";

interface NavItem {
  label: string;
  href: string;
}

const staticPages: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Installation", href: "/installation" },
  { label: "Contributing", href: "/contributing" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Figma Resources", href: "/figma" },
];

const componentItems: NavItem[] = [
  { label: "Text", href: "/components/text" },
  { label: "Button", href: "/components/button" },
  { label: "Badge", href: "/components/badge" },
  { label: "Banner", href: "/components/banner" },
  { label: "Checkbox", href: "/components/checkbox" },
  { label: "Clipboard Text", href: "/components/clipboard-text" },
  { label: "Code", href: "/components/code" },
  { label: "Combobox", href: "/components/combobox" },
  { label: "Dialog", href: "/components/dialog" },
  { label: "Dropdown", href: "/components/dropdown" },
  { label: "Collapsible", href: "/components/collapsible" },
  { label: "Input", href: "/components/input" },
  { label: "Label", href: "/components/label" },
  { label: "Sensitive Input", href: "/components/sensitive-input" },
  { label: "Layer Card", href: "/components/layer-card" },
  { label: "Loader", href: "/components/loader" },
  { label: "MenuBar", href: "/components/menubar" },
  { label: "Popover", href: "/components/popover" },
  { label: "Radio", href: "/components/radio" },
  { label: "Select", href: "/components/select" },
  { label: "Skeleton Line", href: "/components/skeleton-line" },
  { label: "Surface", href: "/components/surface" },
  { label: "Switch", href: "/components/switch" },
  { label: "Tooltip", href: "/components/tooltip" },
];

const blockItems: NavItem[] = [
  { label: "Breadcrumbs", href: "/blocks/breadcrumbs" },
  { label: "Empty State", href: "/blocks/empty" },
  { label: "Page Header", href: "/blocks/page-header" },
];

const layoutItems: NavItem[] = [
  { label: "Resource List", href: "/layouts/resource-list" },
];

const LI_STYLE =
  "block rounded-lg text-label hover:text-surface hover:bg-subtle p-2 my-[.05rem] cursor-pointer transition-colors no-underline relative z-10";
const LI_ACTIVE_STYLE = "font-semibold text-surface bg-subtle";

interface SidebarNavProps {
  currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);
  const [blocksOpen, setBlocksOpen] = useState(true);
  const [layoutsOpen, setLayoutsOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Left rail that always stays put */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-12 bg-surface-secondary",
          "border-r border-border",
        )}
      >
        <div className="relative h-[49px] border-b border-border">
          <div className="absolute top-2 right-1">
            <Button
              variant="ghost"
              shape="square"
              aria-label="Toggle sidebar"
              aria-pressed={sidebarOpen}
              onClick={toggleSidebar}
            >
              <KumoMenuIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Kumo brand label: only visible when sidebar is closed */}
      <div
        className={cn(
          "pointer-events-none fixed top-0 left-12 z-50 flex h-[49px] items-center px-4 font-medium transition-opacity duration-300 select-none",
          sidebarOpen ? "opacity-0" : "opacity-100",
        )}
      >
        <h1 className="flex gap-2 text-base">
          <span>Kumo</span>
        </h1>
      </div>

      {/* Sliding panel that opens to the right of the rail */}
      <aside
        data-sidebar-open={sidebarOpen}
        className={cn(
          "fixed inset-y-0 left-12 z-40 flex w-64 flex-col bg-surface-secondary backdrop-blur",
          "transition-transform duration-300 will-change-transform",
          sidebarOpen
            ? "translate-x-0 border-r border-border"
            : "-translate-x-full",
        )}
      >
        {/* Panel header with Kumo title and search button */}
        <div
          className={cn(
            "flex h-[49px] flex-none items-center gap-3 px-3",
            "border-b border-border",
          )}
        >
          <h1 className="shrink-0 text-base font-medium">Kumo</h1>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-secondary px-2 py-1 text-sm text-muted transition-colors hover:bg-subtle"
          >
            <MagnifyingGlassIcon size={14} className="shrink-0" />
            <span className="flex-1 truncate text-left text-xs">Search...</span>
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-surface px-1 py-0.5 text-[10px] sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="min-h-0 grow overflow-y-auto overscroll-contain p-4 text-sm text-label">
          <div>
            <ul className="flex flex-col">
              {staticPages.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      LI_STYLE,
                      currentPath === item.href && LI_ACTIVE_STYLE,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            {/* Components Section */}
            <h4
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-muted uppercase transition-colors select-none hover:text-surface"
              onClick={() => setComponentsOpen(!componentsOpen)}
            >
              <span>Components</span>
              <CaretDownIcon
                size={12}
                weight="bold"
                className={cn(
                  "transition-transform duration-200",
                  componentsOpen && "rotate-180",
                )}
              />
            </h4>
            <ul
              className={cn(
                "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                componentsOpen
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0",
              )}
            >
              {componentItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      LI_STYLE,
                      currentPath === item.href && LI_ACTIVE_STYLE,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Blocks Section */}
            <h4
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-muted uppercase transition-colors select-none hover:text-surface"
              onClick={() => setBlocksOpen(!blocksOpen)}
            >
              <span>Blocks</span>
              <CaretDownIcon
                size={12}
                weight="bold"
                className={cn(
                  "transition-transform duration-200",
                  blocksOpen && "rotate-180",
                )}
              />
            </h4>
            <ul
              className={cn(
                "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                blocksOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {blockItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      LI_STYLE,
                      currentPath === item.href && LI_ACTIVE_STYLE,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Layouts Section */}
            <h4
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-muted uppercase transition-colors select-none hover:text-surface"
              onClick={() => setLayoutsOpen(!layoutsOpen)}
            >
              <span>Layouts</span>
              <CaretDownIcon
                size={12}
                weight="bold"
                className={cn(
                  "transition-transform duration-200",
                  layoutsOpen && "rotate-180",
                )}
              />
            </h4>
            <ul
              className={cn(
                "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                layoutsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
              )}
            >
              {layoutItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      LI_STYLE,
                      currentPath === item.href && LI_ACTIVE_STYLE,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Version badge at bottom of sidebar */}
        <div className="flex-none border-t border-border p-3 text-xs text-muted">
          <span title={`Built: ${__BUILD_DATE__}`}>
            v{__BUILD_VERSION__} ({__BUILD_COMMIT__})
          </span>
        </div>
      </aside>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
