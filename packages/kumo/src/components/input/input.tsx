import { cn } from "../../utils/cn";
import { forwardRef, type ComponentPropsWithoutRef, useId } from "react";
import { Input as BaseInput } from "@base-ui-components/react/input";

export const KUMO_INPUT_VARIANTS = {
  size: {
    xs: {
      classes: "h-5 gap-1 rounded-sm px-1.5 text-xs",
      description: "Extra small input for compact UIs",
    },
    sm: {
      classes: "h-6.5 gap-1 rounded-md px-2 text-xs",
      description: "Small input for secondary fields",
    },
    base: {
      classes: "h-9 gap-1.5 rounded-lg px-3 text-base",
      description: "Default input size",
    },
    lg: {
      classes: "h-10 gap-2 rounded-lg px-4 text-base",
      description: "Large input for prominent fields",
    },
  },
  variant: {
    default: {
      classes: "focus:ring-active",
      description: "Default input appearance",
    },
    error: {
      classes: "!ring-destructive focus:ring-destructive",
      description: "Error state for validation failures",
    },
  },
} as const;

export const KUMO_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

// Derived types from KUMO_INPUT_VARIANTS
export type KumoInputSize = keyof typeof KUMO_INPUT_VARIANTS.size;
export type KumoInputVariant = keyof typeof KUMO_INPUT_VARIANTS.variant;

export interface KumoInputVariantsProps {
  size?: KumoInputSize;
  variant?: KumoInputVariant;
  parentFocusIndicator?: boolean;
  focusIndicator?: boolean;
}

// Omit native `size` attribute (number) to avoid conflict with our custom `size` variant
type BaseInputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "size">;

export function inputVariants({
  variant = KUMO_INPUT_DEFAULT_VARIANTS.variant,
  size = KUMO_INPUT_DEFAULT_VARIANTS.size,
  parentFocusIndicator = false,
  focusIndicator = false,
}: KumoInputVariantsProps = {}) {
  return cn(
    // Base styles
    "border-0 bg-secondary text-surface ring ring-border",
    // Disabled state and placeholder styles
    "outline-none placeholder:text-muted disabled:text-muted",
    // Apply size styles from KUMO_INPUT_VARIANTS
    KUMO_INPUT_VARIANTS.size[size].classes,
    // Apply variant styles from KUMO_INPUT_VARIANTS
    KUMO_INPUT_VARIANTS.variant[variant].classes,
    // Focus state handling
    parentFocusIndicator && "[&:has(:focus-within)]:ring-active",
    focusIndicator && "focus:ring-active",
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
            hideLabel ? "sr-only" : "block text-sm font-medium text-surface"
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
