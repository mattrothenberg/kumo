import { Meter as BaseMeter } from "@base-ui-components/react/meter";
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

type RootProps = ComponentPropsWithoutRef<typeof BaseMeter.Root>;

interface MeterProps extends RootProps {
  customValue?: string;
  label: string;
  showValue?: boolean;
  trackClassName?: string;
  indicatorClassName?: string;
}

export function Meter({
  value,
  customValue,
  label,
  showValue = true,
  className,
  trackClassName,
  indicatorClassName,
  ...props
}: MeterProps) {
  return (
    <BaseMeter.Root
      value={value}
      {...props}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <BaseMeter.Label className="text-xs text-kumo-label">
          {label}
        </BaseMeter.Label>
        {customValue ? (
          <span className="text-sm font-medium text-kumo-secondary tabular-nums">
            {customValue}
          </span>
        ) : (
          <>
            {showValue && (
              <BaseMeter.Value className="text-sm font-medium text-kumo-secondary tabular-nums" />
            )}
          </>
        )}
      </div>
      <BaseMeter.Track
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-kumo-color",
          trackClassName,
        )}
      >
        <BaseMeter.Indicator
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-blue-500 via-blue-500 to-blue-600 transition-[width] duration-300 ease-out",
            indicatorClassName,
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
