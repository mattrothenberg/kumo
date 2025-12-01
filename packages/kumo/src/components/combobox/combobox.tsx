import { Combobox as ComboboxBase } from "@base-ui-components/react";
import { CaretDownIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { Fragment, type PropsWithChildren } from "react";
import { inputVariants } from "../input/input";
import { cn } from "../../utils/cn";

function Root<
  ItemValue,
  SelectedValue = ItemValue,
  Multiple extends boolean | undefined = false,
>(props: ComboboxBase.Root.Props<ItemValue, SelectedValue, Multiple>) {
  return <ComboboxBase.Root {...props} />;
}

function Content({
  children,
  className,
  align = "start",
  sideOffset = 4,
  alignOffset,
  side,
}: PropsWithChildren<{
  className?: string;
  align?: ComboboxBase.Positioner.Props["align"];
  alignOffset?: ComboboxBase.Positioner.Props["alignOffset"];
  side?: ComboboxBase.Positioner.Props["side"];
  sideOffset?: ComboboxBase.Positioner.Props["sideOffset"];
}>) {
  return (
    <ComboboxBase.Portal>
      <ComboboxBase.Positioner
        className="z-50 outline-none"
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        side={side}
      >
        <ComboboxBase.Popup
          className={cn(
            "max-h-[min(var(--available-height),24rem)] max-w-(--available-width) min-w-(--anchor-width) scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain p-1.5",
            "z-50 overflow-hidden bg-surface text-surface dark:bg-neutral-900", // background
            "rounded-lg shadow-lg ring ring-neutral-950/10 dark:ring-neutral-800", // border part
            className,
          )}
        >
          {children}
        </ComboboxBase.Popup>
      </ComboboxBase.Positioner>
    </ComboboxBase.Portal>
  );
}

function TriggerValue({
  className,
  ...props
}: ComboboxBase.Value.Props & { className?: string }) {
  return (
    <ComboboxBase.Trigger
      className={cn(
        inputVariants(),
        "relative flex items-center pr-8",
        className,
      )}
    >
      <ComboboxBase.Value>{props.children}</ComboboxBase.Value>
      <ComboboxBase.Icon className="absolute top-1/2 right-2 -translate-y-1/2">
        <CaretDownIcon />
      </ComboboxBase.Icon>
    </ComboboxBase.Trigger>
  );
}

function TriggerInput(props: ComboboxBase.Input.Props) {
  return (
    <div className={cn("relative inline-block", props.className)}>
      <ComboboxBase.Input
        {...props}
        className={cn(inputVariants(), "w-full pr-12")}
      />
      <ComboboxBase.Clear className="absolute top-1/2 right-8 -translate-y-1/2 cursor-pointer">
        <XIcon />
      </ComboboxBase.Clear>
      <ComboboxBase.Trigger>
        <ComboboxBase.Icon className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer">
          <CaretDownIcon />
        </ComboboxBase.Icon>
      </ComboboxBase.Trigger>
    </div>
  );
}

function Item({ children, ...props }: ComboboxBase.Item.Props) {
  return (
    <ComboboxBase.Item
      {...props}
      className="group grid cursor-pointer grid-cols-[1fr_16px] gap-2 rounded px-2 py-1.5 text-base data-highlighted:bg-neutral-100 dark:data-highlighted:bg-neutral-800"
    >
      <div className="col-start-1">{children}</div>
      <ComboboxBase.ItemIndicator className="col-start-2 flex items-center">
        <CheckIcon />
      </ComboboxBase.ItemIndicator>
    </ComboboxBase.Item>
  );
}

function Empty(props: ComboboxBase.Empty.Props) {
  return (
    <ComboboxBase.Empty
      {...props}
      className={cn(
        "px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0",
      )}
      children={props.children ?? "No labels found."}
    />
  );
}

function Input(props: ComboboxBase.Input.Props) {
  return (
    <ComboboxBase.Input
      {...props}
      className={cn(inputVariants(), "w-full first:mb-2", props.className)}
    />
  );
}

function GroupLabel(props: ComboboxBase.GroupLabel.Props) {
  return (
    <ComboboxBase.GroupLabel
      {...props}
      className="ml-[16px] px-4 py-1.5 text-sm font-medium"
    />
  );
}

function Group(props: ComboboxBase.Group.Props) {
  return <ComboboxBase.Group {...props} className="mt-2 first:mt-0" />;
}

function Chip(props: ComboboxBase.Chip.Props) {
  return (
    <ComboboxBase.Chip
      {...props}
      className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 dark:bg-neutral-800"
    >
      {props.children}
      <ComboboxBase.ChipRemove className="cursor-pointer rounded-md p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">
        <XIcon size={12} weight="bold" />
      </ComboboxBase.ChipRemove>
    </ComboboxBase.Chip>
  );
}

function TriggerMultipleWithInput<ValueType>({
  placeholder,
  renderItem,
  className,
  inputSide = "right",
}: {
  placeholder?: string;
  renderItem: (value: ValueType) => React.ReactNode;
  className?: string;
  inputSide?: "right" | "top";
}) {
  return (
    <ComboboxBase.Chips
      className={cn(
        inputVariants(),
        cn(
          "flex flex-wrap items-center overflow-hidden", // Base layout and overflow handling
          "gap-1 p-1", // Consistent spacing for chips and padding
          "min-h-9", // Match standard Kumo component height
          "h-auto", // Allow height expansion for multi-line chip wrapping
        ),
        className,
      )}
    >
      <ComboboxBase.Value>
        {(value: ValueType[]) => (
          <Fragment>
            {inputSide === "top" && (
              <ComboboxBase.Input
                placeholder={placeholder}
                className="h-full w-full px-2 py-1 outline-none"
              />
            )}
            {value.map((item) => renderItem(item))}
            {inputSide === "right" && (
              <ComboboxBase.Input
                placeholder={placeholder}
                className="h-full flex-1 px-2 py-1 outline-none"
              />
            )}
          </Fragment>
        )}
      </ComboboxBase.Value>
    </ComboboxBase.Chips>
  );
}

Root.displayName = "Combobox.Root";
Content.displayName = "Combobox.Content";
TriggerValue.displayName = "Combobox.TriggerValue";
TriggerInput.displayName = "Combobox.TriggerInput";
Item.displayName = "Combobox.Item";
Chip.displayName = "Combobox.Chip";
TriggerMultipleWithInput.displayName = "Combobox.TriggerMultipleWithInput";

export const Combobox = Object.assign(Root, {
  // Helper components
  Content,
  TriggerValue,
  TriggerInput,
  TriggerMultipleWithInput,

  // Slightly modified BaseUI
  Chip,
  Item,

  // Styled BaseUI
  Input,
  Empty,
  GroupLabel,
  Group,

  // BaseUI
  List: ComboboxBase.List,
  Collection: ComboboxBase.Collection,
});
