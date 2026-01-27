import type { ComponentProps, ReactNode } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../../utils/cn";

export const KUMO_TABS_VARIANTS = {
  variant: ["segmented", "underline"],
} as const;

export const KUMO_TABS_DEFAULT_VARIANTS = {
  variant: "segmented",
} as const;

export const KUMO_TABS_STYLING = {
  container: {
    height: 34,
    borderRadius: 8,
    background: "color-accent",
    padding: 1,
  },
  tab: {
    paddingX: 10,
    verticalMargin: 1,
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 8,
    activeColor: "text-color-surface",
    inactiveColor: "text-color-label",
  },
  indicator: {
    background: "color-surface-elevated",
    ring: "color-color-2",
    borderRadius: 6,
    shadow: "shadow-sm",
  },
} as const;

// Derived types from KUMO_TABS_VARIANTS
export interface KumoTabsVariantsProps {
  variant?: (typeof KUMO_TABS_VARIANTS.variant)[number];
}

export type TabsItem = {
  value: string;
  label: ReactNode;
  /** Custom render function for the tab. Allows rendering as a different element (e.g., a link). */
  render?: ComponentProps<typeof TabsPrimitive.Tab>["render"];
  className?: string;
};

export type TabsProps = KumoTabsVariantsProps & {
  /** Array of tab items to render */
  tabs?: TabsItem[];
  /** Controlled value. When set, component becomes controlled. */
  value?: string;
  /** Default selected value for uncontrolled mode. Ignored when `value` is set. */
  selectedValue?: string;
  /** Callback fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /**
   * When true, tabs are activated immediately upon receiving focus via arrow keys.
   * When false (default), tabs receive focus but require Enter/Space to activate.
   * Set to true for better keyboard UX in most cases.
   */
  activateOnFocus?: boolean;
  /** Additional class name for the root element */
  className?: string;
  /** Additional class name for the tab list element */
  listClassName?: string;
  /** Additional class name for the indicator element */
  indicatorClassName?: string;
};

export function Tabs({
  tabs,
  value,
  selectedValue,
  onValueChange,
  activateOnFocus,
  className,
  listClassName,
  indicatorClassName,
  variant = KUMO_TABS_DEFAULT_VARIANTS.variant,
}: TabsProps) {
  const items: TabsItem[] = tabs ?? [];

  if (items.length === 0) {
    return null;
  }

  const fallbackValue = items[0]?.value;
  const isControlled = value !== undefined;
  const rootProps = {
    value: isControlled ? value : undefined,
    defaultValue: isControlled ? undefined : (selectedValue ?? fallbackValue),
  };

  const isSegmented = variant === "segmented";
  const isUnderline = variant === "underline";

  return (
    <TabsPrimitive.Root
      {...rootProps}
      className={cn("relative min-w-0 font-medium", className)}
      onValueChange={(nextValue) => {
        const stringValue = String(nextValue);
        onValueChange?.(stringValue);
      }}
    >
      {/* Background element for segmented variant */}
      {isSegmented && (
        <div className="absolute inset-x-0 top-1/2 -z-10 h-8.5 -translate-y-1/2 rounded-lg bg-accent" />
      )}
      <TabsPrimitive.List
        activateOnFocus={activateOnFocus}
        className={cn(
          "no-scrollbar relative flex min-w-0 shrink items-stretch",
          isSegmented && "h-8.5 rounded-lg bg-accent px-px",
          isUnderline && "h-7 gap-4 border-b border-border pb-2",
          listClassName,
        )}
      >
        {items.map((tab) => (
          <TabsPrimitive.Tab
            key={tab.value}
            value={tab.value}
            render={tab.render}
            nativeButton={tab.render === undefined}
            className={cn(
              "relative z-10 flex cursor-pointer items-center rounded bg-transparent text-base whitespace-nowrap hover:border-accent focus-visible:rounded-none focus-visible:ring-active focus-visible:outline-offset-3",
              isSegmented &&
                "my-px rounded-lg px-2.5 text-label aria-selected:text-surface",
              isUnderline &&
                "mb-2 text-label hover:text-muted aria-selected:font-medium aria-selected:text-surface",
              tab.className,
            )}
          >
            {tab.label}
          </TabsPrimitive.Tab>
        ))}
        <TabsPrimitive.Indicator
          className={cn(
            "absolute z-0 transition-[left,width,transform] duration-200 ease-out",
            "data-[rendered=false]:scale-90 data-[rendered=false]:opacity-0",
            "left-(--active-tab-left) w-(--active-tab-width)",
            isSegmented &&
              "top-(--active-tab-top) h-(--active-tab-height) rounded-md bg-surface-elevated shadow-sm ring ring-color-2",
            isUnderline && "bottom-0 h-0.5 bg-primary",
            indicatorClassName,
          )}
        />
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
