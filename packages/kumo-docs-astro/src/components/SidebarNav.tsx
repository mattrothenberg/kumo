import { useState } from "react";
import { cn, Button } from "@cloudflare/kumo";
import { CaretDownIcon } from "@phosphor-icons/react";
import { KumoMenuIcon } from "./KumoMenuIcon";

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
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
  { label: "Code", href: "/components/code" },
  { label: "Combobox", href: "/components/combobox" },
  { label: "Dialog", href: "/components/dialog" },
  { label: "Dropdown", href: "/components/dropdown" },
  { label: "Collapsible", href: "/components/collapsible" },
  { label: "Input", href: "/components/input" },
  { label: "Sensitive Input", href: "/components/sensitive-input" },
  { label: "Layer Card", href: "/components/layer-card" },
  { label: "Loader", href: "/components/loader" },
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
  "block rounded-lg text-neutral-600 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200/30 dark:hover:bg-neutral-800/50 p-2 my-[.05rem] cursor-pointer transition-colors no-underline relative z-10";
const LI_ACTIVE_STYLE =
  "font-semibold text-neutral-800 dark:text-white bg-neutral-200/50 dark:bg-neutral-800";

interface SidebarNavProps {
  currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);
  const [blocksOpen, setBlocksOpen] = useState(true);
  const [layoutsOpen, setLayoutsOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <>
      {/* Left rail that always stays put */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-12 bg-surface-secondary",
          "border-r border-neutral-200 dark:border-neutral-800",
        )}
      >
        <div className="relative h-[49px] border-b border-neutral-200 dark:border-neutral-800">
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

      {/* Kumo brand label: fixed next to the rail */}
      <div className="pointer-events-none fixed top-0 left-12 z-50 flex h-[49px] items-center px-4 font-medium select-none">
        <h1 className="flex gap-2 text-base">
          <span>Kumo</span>
        </h1>
      </div>

      {/* Sliding panel that opens to the right of the rail */}
      <aside
        data-sidebar-open={sidebarOpen}
        className={cn(
          "fixed inset-y-0 left-12 z-40 flex w-64 flex-col backdrop-blur",
          "transition-transform duration-300 will-change-transform",
          sidebarOpen
            ? "translate-x-0 border-r border-neutral-200 dark:border-neutral-800"
            : "-translate-x-full",
        )}
      >
        {/* Panel header */}
        <div
          className={cn(
            "flex h-[49px] flex-none items-center px-4 font-medium",
            "border-b border-neutral-200 dark:border-neutral-800",
          )}
        />
        <div className="min-h-0 grow overflow-y-auto overscroll-contain p-4 text-sm text-neutral-600">
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
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-neutral-400 uppercase transition-colors select-none hover:text-neutral-700 dark:hover:text-neutral-300"
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
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-neutral-400 uppercase transition-colors select-none hover:text-neutral-700 dark:hover:text-neutral-300"
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
              className="mt-4 mb-2 ml-2 flex cursor-pointer items-center justify-between text-xs font-medium text-neutral-400 uppercase transition-colors select-none hover:text-neutral-700 dark:hover:text-neutral-300"
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
      </aside>
    </>
  );
}
