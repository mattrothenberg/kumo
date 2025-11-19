import { Combobox as ComboboxBase } from "@base-ui-components/react";
import { CaretDownIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { Fragment, type PropsWithChildren } from "react";
import { inputVariants } from "../input/input";
import { cn } from "../../utils/cn";

function Root<
  ItemValue,
  SelectedValue = ItemValue,
  Multiple extends boolean | undefined = false
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
            "min-w-(--anchor-width) max-h-[min(var(--available-height),24rem)] max-w-(--available-width) overflow-y-auto scroll-pt-2 scroll-pb-2 overscroll-contain p-1.5",
            "z-50 bg-surface dark:bg-neutral-900 text-surface overflow-hidden", // background
            "ring ring-neutral-950/10 dark:ring-neutral-800 shadow-lg rounded-lg", // border part
            className
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
        "relative pr-8 flex items-center",
        className
      )}
    >
      <ComboboxBase.Value>{props.children}</ComboboxBase.Value>
      <ComboboxBase.Icon className="absolute top-1/2 -translate-y-1/2 right-2">
        <CaretDownIcon />
      </ComboboxBase.Icon>
    </ComboboxBase.Trigger>
  );
}

function TriggerInput(props: ComboboxBase.Input.Props) {
  return (
    <div className="relative">
      <ComboboxBase.Input {...props} className={cn(inputVariants(), "pr-8")} />
      <ComboboxBase.Clear className="absolute top-1/2 -translate-y-1/2 right-8 cursor-pointer">
        <XIcon />
      </ComboboxBase.Clear>
      <ComboboxBase.Trigger>
        <ComboboxBase.Icon className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer">
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
      className="data-highlighted:bg-neutral-100 dark:data-highlighted:bg-neutral-800 px-2 rounded py-1.5 text-base grid grid-cols-[16px_1fr] gap-2 group cursor-pointer"
    >
      <ComboboxBase.ItemIndicator className="col-start-1 flex items-center">
        <CheckIcon />
      </ComboboxBase.ItemIndicator>
      <div className="col-start-2">{children}</div>
    </ComboboxBase.Item>
  );
}

function Empty(props: ComboboxBase.Empty.Props) {
  return (
    <ComboboxBase.Empty
      {...props}
      className={cn(
        "px-4 py-2 text-[0.925rem] leading-4 text-gray-600 empty:m-0 empty:p-0"
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
      className="text-sm font-medium py-1.5 px-4 ml-[16px]"
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
      className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg flex items-center gap-1"
    >
      {props.children}
      <ComboboxBase.ChipRemove className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1 rounded-lg">
        <XIcon size={12} weight="bold" />
      </ComboboxBase.ChipRemove>
    </ComboboxBase.Chip>
  );
}

function TriggerMultipleWithInput<ValueType>(props: {
  placeholder?: string;
  renderItem: (value: ValueType) => React.ReactNode;
}) {
  return (
    <ComboboxBase.Chips
      className={cn(
        inputVariants(),
        "flex items-center overflow-hidden gap-1 px-1"
      )}
    >
      <ComboboxBase.Value>
        {(value: ValueType[]) => (
          <Fragment>
            {value.map((item) => props.renderItem(item))}{" "}
            <ComboboxBase.Input
              placeholder={props.placeholder}
              className="flex-1 h-full outline-none px-2"
            />
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
