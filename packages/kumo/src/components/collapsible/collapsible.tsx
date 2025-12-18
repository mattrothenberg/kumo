import { CaretDownIcon } from "@phosphor-icons/react";
import { type PropsWithChildren, forwardRef, useCallback, useId } from "react";
import { cn } from "../../utils/cn";

export const KUMO_COLLAPSIBLE_VARIANTS = {
  // Collapsible currently has no variant options but structure is ready for future additions
} as const;

export const KUMO_COLLAPSIBLE_DEFAULT_VARIANTS = {} as const;

// Derived types from KUMO_COLLAPSIBLE_VARIANTS
export interface KumoCollapsibleVariantsProps {}

export function collapsibleVariants(_props: KumoCollapsibleVariantsProps = {}) {
  return cn(
    // Base styles for the trigger
    "flex cursor-pointer items-center gap-1 text-sm text-info select-none",
  );
}

export type CollapsibleProps = PropsWithChildren<
  KumoCollapsibleVariantsProps & {
    label: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
  }
>;

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ label, open, onOpenChange, children, className }, ref) => {
    const contentId = useId();

    const handleOpen = useCallback(() => {
      onOpenChange?.(!open);
    }, [open, onOpenChange]);

    return (
      <div ref={ref}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          className={collapsibleVariants()}
          onClick={handleOpen}
        >
          {label}{" "}
          <CaretDownIcon
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <div
            id={contentId}
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
  },
);

Collapsible.displayName = "Collapsible";
