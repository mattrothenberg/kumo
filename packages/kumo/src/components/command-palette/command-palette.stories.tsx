import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPalette } from "./command-palette";
import {
  GlobeIcon,
  DatabaseIcon,
  CodeIcon,
  ArrowLeftIcon,
  BrowserIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react";
import { Button } from "../button";
import { cn } from "../../utils/cn";

const meta: Meta = {
  title: "Components/CommandPalette",
};

export default meta;
type Story = StoryObj;

// Sample data
interface SearchItem {
  id: string;
  title: string;
  breadcrumbs?: string[];
  description?: string;
  icon?: React.ReactNode;
  external?: boolean;
  nonInteractive?: boolean;
}

interface SearchGroup {
  label: string;
  items: SearchItem[];
}

const sampleGroups: SearchGroup[] = [
  {
    label: "Go to",
    items: [
      {
        id: "workers",
        title: "Workers & Pages",
        breadcrumbs: ["Compute"],
        icon: <CodeIcon className="h-4 w-4" />,
      },
      {
        id: "r2",
        title: "R2 Storage",
        breadcrumbs: ["Storage"],
        icon: <DatabaseIcon className="h-4 w-4" />,
      },
      {
        id: "dns",
        title: "DNS Records",
        breadcrumbs: ["Websites", "example.com"],
        icon: <GlobeIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Search tips",
    items: [
      {
        id: "d1-tip",
        title: "d1:",
        description: "Search D1 databases",
        icon: <DatabaseIcon className="h-4 w-4" />,
        nonInteractive: true,
      },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [search, setSearch] = useState("");

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={sampleGroups}
          value={search}
          onValueChange={setSearch}
          itemToStringValue={(group) => group.label}
          getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
          onSelect={(item) => {
            console.log("Selected:", item);
            setOpen(false);
          }}
        >
          <CommandPalette.Input
            placeholder="Search..."
            trailing={
              <Button
                className="m-0 h-5 p-0"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
              >
                <Kbd>Esc</Kbd>
              </Button>
            }
          />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        breadcrumbs={item.breadcrumbs}
                        description={item.description}
                        icon={item.icon}
                        nonInteractive={item.nonInteractive}
                        onClick={() => {
                          console.log("Clicked:", item);
                          setOpen(false);
                        }}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
            <CommandPalette.Empty>No results found</CommandPalette.Empty>
          </CommandPalette.List>
          <CommandPalette.Footer>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                Select
              </span>
            </div>
          </CommandPalette.Footer>
        </CommandPalette.Root>
      </>
    );
  },
};

export const WithHighlights: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    const itemsWithHighlights: SearchGroup[] = [
      {
        label: "Go to",
        items: [
          { id: "1", title: "Workers & Pages", breadcrumbs: ["Compute"] },
          { id: "2", title: "Worker Routes", breadcrumbs: ["Compute"] },
        ],
      },
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={itemsWithHighlights}
          itemToStringValue={(group) => group.label}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        breadcrumbs={item.breadcrumbs}
                        titleHighlights={[[0, 5]]}
                        onClick={() => setOpen(false)}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={[]}
          itemToStringValue={() => ""}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Loading />
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={[]}
          itemToStringValue={() => ""}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Empty>
              No results found. Try a different search term.
            </CommandPalette.Empty>
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
    );
  },
};

export const WithExternalLinks: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    const groups: SearchGroup[] = [
      {
        label: "Documentation",
        items: [
          { id: "1", title: "Workers Docs", external: true },
          { id: "2", title: "R2 Docs", external: true },
          { id: "3", title: "Internal Page" },
        ],
      },
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette.Root
          open={open}
          onOpenChange={setOpen}
          items={groups}
          itemToStringValue={(group) => group.label}
        >
          <CommandPalette.Input placeholder="Search..." />
          <CommandPalette.List>
            <CommandPalette.Results>
              {(group: SearchGroup) => (
                <CommandPalette.Group key={group.label} items={group.items}>
                  <CommandPalette.GroupLabel>
                    {group.label}
                  </CommandPalette.GroupLabel>
                  <CommandPalette.Items>
                    {(item: SearchItem) => (
                      <CommandPalette.ResultItem
                        key={item.id}
                        value={item}
                        title={item.title}
                        external={item.external}
                        onClick={() => setOpen(false)}
                      />
                    )}
                  </CommandPalette.Items>
                </CommandPalette.Group>
              )}
            </CommandPalette.Results>
          </CommandPalette.List>
        </CommandPalette.Root>
      </>
    );
  },
};

/**
 * DrillDown demonstrates using Dialog + Panel separately for multi-step navigation.
 *
 * This pattern is useful when:
 * - You need to swap content inside the dialog without re-mounting
 * - You want smooth transitions between different "views" (e.g., search → zone picker)
 * - The dialog should stay open while content changes
 *
 * The key insight: Dialog handles the modal shell, Panel handles the autocomplete content.
 * By rendering different Panels conditionally inside Dialog, you get seamless transitions.
 */
export const DrillDown: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [search, setSearch] = useState("");
    const [drillDown, setDrillDown] = useState<{
      type: "zone-picker";
      featureTitle: string;
      featureUrl: string;
    } | null>(null);

    const isInDrillDown = drillDown !== null;

    // Main search results - products that require zone selection
    const mainGroups: SearchGroup[] = [
      {
        label: "Zone Features",
        items: [
          {
            id: "dns",
            title: "Records",
            breadcrumbs: ["DNS"],
            icon: <TreeStructureIcon className="h-4 w-4" />,
          },
          {
            id: "ssl",
            title: "Overview",
            breadcrumbs: ["SSL/TLS"],
            icon: <GlobeIcon className="h-4 w-4" />,
          },
          {
            id: "caching",
            title: "Configuration",
            breadcrumbs: ["Caching"],
            icon: <GlobeIcon className="h-4 w-4" />,
          },
        ],
      },
    ];

    // Zone picker results - realistic domain names
    const zoneGroups: SearchGroup[] = [
      {
        label: `Select a domain for ${drillDown?.featureTitle ?? ""}`,
        items: [
          {
            id: "z1",
            title: "123654.ga",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z2",
            title: "abgupta.site",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z3",
            title: "acc.theburritobot.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z4",
            title: "adepke.theburritobot.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z5",
            title: "alexaisfeelinggreat.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z6",
            title: "amazon.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z7",
            title: "anas.burritobot.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
          {
            id: "z8",
            title: "ana.test.new-zone.com",
            icon: <BrowserIcon className="h-4 w-4" />,
          },
        ],
      },
    ];

    // Format breadcrumbs as "DNS > Records" for display
    const formatBreadcrumbTitle = (item: SearchItem) => {
      if (item.breadcrumbs?.length) {
        return [...item.breadcrumbs, item.title].join(" > ");
      }
      return item.title;
    };

    const handleMainSelect = (item: SearchItem) => {
      // Trigger drill-down to zone picker
      setDrillDown({
        type: "zone-picker",
        featureTitle: formatBreadcrumbTitle(item),
        featureUrl: `/${item.id}`,
      });
      setSearch("");
    };

    const handleZoneSelect = (item: SearchItem) => {
      console.log(`Navigate to: /${item.title}${drillDown?.featureUrl}`);
      handleClose();
    };

    const handleBack = () => {
      setDrillDown(null);
      setSearch("");
    };

    const handleClose = () => {
      setOpen(false);
      setDrillDown(null);
      setSearch("");
    };

    const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen) {
        setDrillDown(null);
        setSearch("");
      }
      setOpen(newOpen);
    };

    // Custom keyboard handling for Backspace to go back
    const handleZoneKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && search === "") {
        e.preventDefault();
        handleBack();
      }
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <p className="mt-4 text-sm text-muted">
          Click a zone feature to drill down into zone selection. Press
          Backspace (when input is empty) to go back.
        </p>

        {/* Dialog stays mounted, Panel content swaps */}
        <CommandPalette.Dialog open={open} onOpenChange={handleOpenChange}>
          {isInDrillDown ? (
            // Zone Picker Panel
            <CommandPalette.Panel
              items={zoneGroups}
              value={search}
              onValueChange={setSearch}
              itemToStringValue={(group) => group.label}
              open={open}
              getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
              onSelect={(item) => handleZoneSelect(item)}
            >
              <CommandPalette.Input
                placeholder="Search for a domain..."
                onKeyDown={handleZoneKeyDown}
                leading={
                  <button
                    onClick={handleBack}
                    className="flex h-4 w-4 items-center justify-center rounded transition-colors hover:bg-accent"
                    aria-label="Back"
                  >
                    <ArrowLeftIcon
                      className="h-4 w-4 text-muted"
                      weight="bold"
                    />
                  </button>
                }
                trailing={
                  <Button
                    className="m-0 h-5 p-0"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    <Kbd>Esc</Kbd>
                  </Button>
                }
              />
              <CommandPalette.List>
                <CommandPalette.Results>
                  {(group: SearchGroup) => (
                    <CommandPalette.Group key={group.label} items={group.items}>
                      <CommandPalette.GroupLabel>
                        {group.label}
                      </CommandPalette.GroupLabel>
                      <CommandPalette.Items>
                        {(item: SearchItem) => (
                          <CommandPalette.ResultItem
                            key={item.id}
                            value={item}
                            title={item.title}
                            icon={item.icon}
                            onClick={() => handleZoneSelect(item)}
                          />
                        )}
                      </CommandPalette.Items>
                    </CommandPalette.Group>
                  )}
                </CommandPalette.Results>
                <CommandPalette.Empty>No domains found</CommandPalette.Empty>
              </CommandPalette.List>
              <CommandPalette.Footer>
                <div className="flex items-center gap-1.5 text-muted">
                  <TreeStructureIcon className="h-4 w-4" />
                  <span className="font-medium">{drillDown.featureTitle}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Kbd>⌫</Kbd>
                    to go back
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    to select
                  </span>
                </div>
              </CommandPalette.Footer>
            </CommandPalette.Panel>
          ) : (
            // Main Search Panel
            <CommandPalette.Panel
              items={mainGroups}
              value={search}
              onValueChange={setSearch}
              itemToStringValue={(group) => group.label}
              open={open}
              getSelectableItems={(groups) => groups.flatMap((g) => g.items)}
              onSelect={(item) => handleMainSelect(item)}
            >
              <CommandPalette.Input
                placeholder="Search..."
                trailing={
                  <Button
                    className="m-0 h-5 p-0"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    <Kbd>Esc</Kbd>
                  </Button>
                }
              />
              <CommandPalette.List>
                <CommandPalette.Results>
                  {(group: SearchGroup) => (
                    <CommandPalette.Group key={group.label} items={group.items}>
                      <CommandPalette.GroupLabel>
                        {group.label}
                      </CommandPalette.GroupLabel>
                      <CommandPalette.Items>
                        {(item: SearchItem) => (
                          <CommandPalette.ResultItem
                            key={item.id}
                            value={item}
                            title={item.title}
                            breadcrumbs={item.breadcrumbs}
                            icon={item.icon}
                            onClick={() => handleMainSelect(item)}
                          />
                        )}
                      </CommandPalette.Items>
                    </CommandPalette.Group>
                  )}
                </CommandPalette.Results>
                <CommandPalette.Empty>No results found</CommandPalette.Empty>
              </CommandPalette.List>
              <CommandPalette.Footer>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd>
                    to select
                  </span>
                </div>
              </CommandPalette.Footer>
            </CommandPalette.Panel>
          )}
        </CommandPalette.Dialog>
      </>
    );
  },
};

function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none",
        "bg-subtle text-label",
        "border border-border",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
