import { CaretDownIcon } from "@phosphor-icons/react";
import { type PropsWithChildren, useCallback } from "react";
import { cn } from "../../utils/cn";

export const KUMO_EXPANDABLE_VARIANTS = {
  // Expandable currently has no variant options but structure is ready for future additions
} as const;

export const KUMO_EXPANDABLE_DEFAULT_VARIANTS = {} as const;

// Derived types from KUMO_EXPANDABLE_VARIANTS
export interface KumoExpandableVariantsProps {}

export function expandableVariants(_props: KumoExpandableVariantsProps = {}) {
  return cn(
    // Base styles for the trigger
    "flex cursor-pointer items-center gap-1 text-sm text-success select-none",
  );
}

export type ExpandableProps = PropsWithChildren<
  KumoExpandableVariantsProps & {
    title: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
  }
>;

export function Expandable({
  title,
  open,
  onOpenChange,
  children,
  className,
}: ExpandableProps) {
  const handleOpen = useCallback(() => {
    onOpenChange?.(!open);
  }, [open, onOpenChange]);

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-1 text-sm text-success select-none"
        onClick={handleOpen}
      >
        {title}{" "}
        <CaretDownIcon
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </div>
      {open && (
        <div
          className={cn(
            "my-2 space-y-4 border-l-2 border-color pl-4",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
