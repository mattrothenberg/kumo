import type { ReactNode } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "../../utils/cn";

export const KUMO_TABS_VARIANTS = {
  // Tabs currently has no variant options but structure is ready for future additions
} as const;

export const KUMO_TABS_DEFAULT_VARIANTS = {} as const;

// Derived types from KUMO_TABS_VARIANTS
export interface KumoTabsVariantsProps {}

export function tabsVariants(_props: KumoTabsVariantsProps = {}) {
  return cn(
    // Base styles
    "relative min-w-0 font-medium",
  );
}

export type TabsItem = {
  value: string;
  label: ReactNode;
  className?: string;
};

export type TabsProps = KumoTabsVariantsProps & {
  tabs?: TabsItem[];
  value?: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  listClassName?: string;
  indicatorClassName?: string;
};

export function Tabs({
  tabs,
  value,
  selectedValue,
  onValueChange,
  className,
  listClassName,
  indicatorClassName,
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

  return (
    <TabsPrimitive.Root
      {...rootProps}
      className={cn("relative min-w-0 font-medium", className)}
      onValueChange={(nextValue) => {
        const stringValue = String(nextValue);
        onValueChange?.(stringValue);
      }}
    >
      <div className="absolute inset-x-0 top-1/2 -z-10 h-8.5 -translate-y-1/2 rounded-lg bg-accent" />
      <TabsPrimitive.List
        className={cn(
          "scrollbar-hide relative flex h-8.5 min-w-0 shrink items-stretch overflow-x-auto rounded-lg bg-accent px-px",
          listClassName,
        )}
      >
        {items.map((tab) => (
          <TabsPrimitive.Tab
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative z-10 my-px flex cursor-pointer items-center rounded-lg bg-transparent px-2.5 text-base whitespace-nowrap text-muted-2 transition-colors focus-visible:outline-none",
              "data-selected:text-surface",
              tab.className,
            )}
          >
            {tab.label}
          </TabsPrimitive.Tab>
        ))}
        <TabsPrimitive.Indicator
          className={cn(
            "absolute z-0 rounded-lg bg-surface-elevated shadow ring ring-border transition-[left,width,transform] duration-200 ease-out",
            "data-[rendered=false]:scale-90 data-[rendered=false]:opacity-0",
            "top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width)",
            indicatorClassName,
          )}
        />
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
