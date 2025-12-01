import { cn } from "../../utils/cn";
import { forwardRef, type ComponentPropsWithoutRef, useId } from "react";
import { Input as BaseInput } from "@base-ui-components/react/input";

interface KumoInputVariantsProps {
  variant?: "default" | "error";
  size?: "xs" | "sm" | "base" | "lg";
  parentFocusIndicator?: boolean;
  focusIndicator?: boolean;
}

// Omit native `size` attribute (number) to avoid conflict with our custom `size` variant
type BaseInputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "size">;

const sizeStyles = {
  xs: "h-5 gap-1 rounded-sm px-1.5 text-xs",
  sm: "h-6.5 gap-1 rounded-md px-2 text-xs",
  base: "h-9 gap-1.5 rounded-lg px-3 text-base",
  lg: "h-10 gap-2 rounded-lg px-4 text-base",
};

const variantStyles = {
  default: "focus:ring-kumo-active",
  error: "!ring-kumo-destructive focus:ring-kumo-destructive",
};

export function inputVariants({
  variant = "default",
  size = "base",
  parentFocusIndicator = false,
  focusIndicator = false,
}: KumoInputVariantsProps = {}) {
  return cn(
    // Base styles
    "border-0 bg-kumo-secondary text-kumo-surface ring ring-kumo-border",
    // Disabled state and placeholder styles
    "outline-none placeholder:text-kumo-muted disabled:text-kumo-muted",
    // Apply size styles
    sizeStyles[size],
    // Apply variant styles
    variantStyles[variant],
    // Focus state handling
    parentFocusIndicator && "[&:has(:focus-within)]:ring-kumo-active",
    focusIndicator && "focus:ring-kumo-active",
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    size = "base",
    variant = "default",
    label,
    hideLabel = true,
    id,
    ...inputProps
  } = props;
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <>
      {label && (
        <label
          htmlFor={inputId}
          className={
            hideLabel
              ? "sr-only"
              : "block text-sm font-medium text-kumo-surface"
          }
        >
          {label}
        </label>
      )}
      <BaseInput
        ref={ref}
        id={inputId}
        className={cn(
          inputVariants({ size, variant, focusIndicator: true }),
          className,
        )}
        {...inputProps}
      />
    </>
  );
});

Input.displayName = "Input";

export type InputProps = Pick<KumoInputVariantsProps, "size" | "variant"> &
  BaseInputProps & {
    label?: string;
    hideLabel?: boolean;
  };
