import type { CSSProperties, FC, ReactNode } from "react";
import { Dialog as DialogBase } from "@base-ui-components/react";
import { Surface } from "../surface";
import { cn } from "../../utils/cn";

type DialogProps = {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

function DialogContent({ className, children, style }: DialogProps) {
  return (
    <DialogBase.Portal>
      <DialogBase.Backdrop className="z-modal fixed inset-0 bg-kumo-color-3 opacity-80 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <Surface
        as={DialogBase.Popup}
        className={cn(
          `shadow-m z-modal fixed top-1/2 left-1/2 max-w-[calc(100vw-3rem)] min-w-96 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-kumo-surface text-kumo-secondary duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0`,
          className,
        )}
        style={
          {
            transitionProperty: "scale, opacity",
            transitionTimingFunction:
              "var(--default-transition-timing-function)",
            "--tw-shadow":
              "0 20px 25px -5px rgb(0 0 0 / 0.03), 0 8px 10px -6px rgb(0 0 0 / 0.03)",
            ...style,
          } as CSSProperties
        }
      >
        {children}
      </Surface>
    </DialogBase.Portal>
  );
}

type DialogComponent = FC<DialogProps> & {
  Root: typeof DialogBase.Root;
  Trigger: typeof DialogBase.Trigger;
  Title: typeof DialogBase.Title;
  Description: typeof DialogBase.Description;
  Close: typeof DialogBase.Close;
};

const Dialog = Object.assign(DialogContent, {
  Root: DialogBase.Root,
  Trigger: DialogBase.Trigger,
  Title: DialogBase.Title,
  Description: DialogBase.Description,
  Close: DialogBase.Close,
}) as DialogComponent;

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogTitle = Dialog.Title;
const DialogDescription = Dialog.Description;
const DialogClose = Dialog.Close;

export {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
