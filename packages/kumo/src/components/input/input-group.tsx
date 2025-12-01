import { type PropsWithChildren, useContext } from "react";
import * as React from "react";
import { cn } from "../../utils/cn";
import {
  Input as InputExternal,
  type InputProps,
  inputVariants,
} from "./input";
import { type ButtonProps, Button as ButtonExternal } from "../button/button";

interface InputGroupRootProps {
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | undefined;
}

const InputGroupContext = React.createContext<InputGroupRootProps | null>(null);

function Root({
  size,
  children,
  className,
}: PropsWithChildren<InputGroupRootProps>) {
  const contextValue = React.useMemo(() => ({ size }), [size]);

  return (
    <InputGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          inputVariants({ size, parentFocusIndicator: true }),
          "flex w-full gap-0 overflow-hidden border-0 px-0 shadow-xs ring ring-kumo-border focus-within:ring-kumo-active",
          className,
        )}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

function Label({ children }: PropsWithChildren<{}>) {
  // Using standard DOM API for direct access without React context
  // This approach allows us to maintain simplicity by avoiding unnecessary state management
  // while still providing the expected UX behavior when clicking on labels
  const onLabelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rootElement = event.currentTarget.parentElement;

    if (rootElement) {
      const inputElement = rootElement.querySelector("input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  return (
    <div
      className="flex h-full items-center p-0 px-2 text-kumo-muted"
      onClick={onLabelClick}
    >
      {children}
    </div>
  );
}

function Input(props: InputProps) {
  const context = useContext(InputGroupContext);

  return (
    <InputExternal
      size={context?.size}
      {...props}
      className={cn(
        "flex h-full items-center rounded-none border-0 bg-kumo-surface font-sans first:pl-2 last:pr-2",
        "focus:border-kumo-color",
        "grow px-0",
        props.className,
      )}
    />
  );
}

function Button({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const context = useContext(InputGroupContext);

  return (
    <ButtonExternal
      {...props}
      size={context?.size}
      className={cn(
        "h-full! rounded-none disabled:bg-kumo-surface-secondary disabled:text-kumo-disabled!",
        className,
      )}
    >
      {children}
    </ButtonExternal>
  );
}

export const InputGroup = Object.assign(Root, { Label, Input, Button });
