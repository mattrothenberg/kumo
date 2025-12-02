import { Select as SelectBase } from "@base-ui-components/react/select";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { buttonVariants } from "../button";
import { SkeletonLine } from "../loader";

type SelectProps<
  T,
  Multiple extends boolean | undefined = false,
> = SelectBase.Root.Props<T, Multiple> & {
  multiple?: Multiple;
  renderValue?: (value: Multiple extends true ? T[] : T) => ReactNode;
  className?: string;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  loading?: boolean;
};

export function Select<T, Multiple extends boolean | undefined = false>({
  children,
  className,
  renderValue,
  label,
  hideLabel = true,
  placeholder,
  loading,
  ...props
}: SelectProps<T, Multiple>) {
  const labelId = useId();
  const propLookup = props as Record<string, unknown>;
  const ariaLabel = propLookup["aria-label"] as string | undefined;
  const ariaLabelledby = propLookup["aria-labelledby"] as string | undefined;
  const fallbackLabel = label ?? placeholder;
  const triggerLabelledBy = ariaLabelledby ?? (label ? labelId : undefined);
  const triggerAriaLabel =
    ariaLabel ?? (!triggerLabelledBy ? fallbackLabel : undefined);

  // Placeholder must be provide via the items props
  // We need to fake the items or do some transformation
  let items = props.items;
  if (placeholder) {
    if (!items) {
      items = [
        {
          value: null as T,
          label: placeholder,
        },
      ];
    } else if (typeof items === "object") {
      items = [
        {
          value: null as T,
          label: placeholder,
        },
        ...Object.entries(items).map(([key, value]) => ({
          value: key as T,
          label: value,
        })),
      ];
    } else if (Array.isArray(items)) {
      items = [
        {
          value: null as T,
          label: placeholder,
        },
        ...items,
      ];
    }
  }

  return (
    <>
      {label && (
        <span
          id={labelId}
          className={
            hideLabel
              ? "sr-only"
              : "block text-sm font-medium text-kumo-surface"
          }
        >
          {label}
        </span>
      )}
      <SelectBase.Root
        {...props}
        items={items}
        disabled={loading || props.disabled}
      >
        <SelectBase.Trigger
          className={cn(
            buttonVariants(),
            "justify-between font-normal",
            "outline-none focus:opacity-100 focus-visible:ring-1 focus-visible:ring-kumo-active *:in-focus:opacity-100",
            className,
          )}
          aria-label={triggerAriaLabel}
          aria-labelledby={triggerLabelledBy}
        >
          {loading ? (
            <SkeletonLine />
          ) : (
            <SelectBase.Value>{renderValue}</SelectBase.Value>
          )}
          <SelectBase.Icon>
            <CaretUpDownIcon />
          </SelectBase.Icon>
        </SelectBase.Trigger>
        <SelectBase.Portal>
          <SelectBase.Positioner>
            <SelectBase.Popup
              className={cn(
                "z-50 overflow-hidden bg-kumo-secondary text-kumo-surface", // background
                "rounded-lg shadow-lg ring ring-kumo-border", // border part
                // 3px adjustment to account for padding + border differences
                "min-w-[calc(var(--anchor-width)+3px)] p-1.5", // spacing
              )}
            >
              {children}
            </SelectBase.Popup>
          </SelectBase.Positioner>
        </SelectBase.Portal>
      </SelectBase.Root>
    </>
  );
}

type OptionProps<T> = {
  children: ReactNode;
  value: T;
};

function Option<T>({ children, value }: OptionProps<T>) {
  return (
    <SelectBase.Item
      value={value}
      className="group flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-base data-highlighted:bg-kumo-color-3"
    >
      <SelectBase.ItemText>{children}</SelectBase.ItemText>
      <SelectBase.ItemIndicator>
        <CheckIcon />
      </SelectBase.ItemIndicator>
    </SelectBase.Item>
  );
}

Select.Option = Option;
