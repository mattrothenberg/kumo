import { CaretDownIcon } from "@phosphor-icons/react";
import { type PropsWithChildren, useCallback } from "react";
import { cn } from "../../utils/cn";

type ExpandableProps = PropsWithChildren<{
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}>;

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
        className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 select-none dark:text-blue-400"
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
