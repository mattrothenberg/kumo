import { ReactNode } from "react";
import { Tabs, type TabsItem } from "../../components/tabs";
import { cn } from "../../utils/cn";

export interface PageHeaderProps {
  breadcrumbs: ReactNode;
  tabs?: TabsItem[];
  defaultTab?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  breadcrumbs,
  tabs,
  defaultTab,
  onValueChange,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="border-b border-kumo-color-4">{breadcrumbs}</div>

      {tabs && (
        <div className="flex w-full items-center justify-between border-b border-kumo-color-4 pt-1 pb-3 pl-3">
          <Tabs
            tabs={tabs}
            selectedValue={defaultTab}
            onValueChange={(nextValue) => {
              const stringValue = String(nextValue);
              onValueChange?.(stringValue);
            }}
          />

          <div className="flex items-center gap-2">{children}</div>
        </div>
      )}
    </div>
  );
}
