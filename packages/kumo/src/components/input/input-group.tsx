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

interface InputGroupContextValue extends InputGroupRootProps {
  inputId: string;
  descriptionId: string;
}

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

function Root({
  size,
  children,
  className,
}: PropsWithChildren<InputGroupRootProps>) {
  const inputId = React.useId();
  const descriptionId = React.useId();
  const contextValue = React.useMemo(
    () => ({ size, inputId, descriptionId }),
    [size, inputId, descriptionId],
  );

  return (
    <InputGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          inputVariants({ size, parentFocusIndicator: true }),
          "flex w-full gap-0 overflow-hidden border-0 px-0 shadow-xs ring ring-border focus-within:ring-active",
          className,
        )}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

function Label({ children }: PropsWithChildren<{}>) {
  const context = useContext(InputGroupContext);

  return (
    <label
      htmlFor={context?.inputId}
      className="flex h-full items-center p-0 px-2 text-muted"
    >
      {children}
    </label>
  );
}

function Input(props: InputProps) {
  const context = useContext(InputGroupContext);

  return (
    <InputExternal
      id={context?.inputId}
      aria-describedby={context?.descriptionId}
      size={context?.size}
      {...props}
      className={cn(
        "flex h-full items-center rounded-none border-0 bg-surface font-sans",
        "focus:border-color",
        "grow px-2",
        props.className,
      )}
    />
  );
}

function Description({ children }: PropsWithChildren<{}>) {
  const context = useContext(InputGroupContext);

  return (
    <span
      id={context?.descriptionId}
      className="flex h-full items-center p-0 px-2 text-muted"
    >
      {children}
    </span>
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
        "h-full! rounded-none disabled:bg-surface-secondary disabled:text-disabled!",
        className,
      )}
    >
      {children}
    </ButtonExternal>
  );
}

export const InputGroup = Object.assign(Root, { Label, Input, Button, Description });
