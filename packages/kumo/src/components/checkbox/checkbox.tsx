import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  type InputHTMLAttributes,
} from "react";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

export const KUMO_CHECKBOX_VARIANTS = {
  variant: {
    default: {
      classes: "[&:focus-within>span]:ring-active [&:hover>span]:ring-active",
      description: "Default checkbox appearance",
    },
    error: {
      classes: "[&>span]:ring-destructive",
      description: "Error state for validation failures",
    },
  },
} as const;

export const KUMO_CHECKBOX_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

// Derived types from KUMO_CHECKBOX_VARIANTS
export type KumoCheckboxVariant = keyof typeof KUMO_CHECKBOX_VARIANTS.variant;

export interface KumoCheckboxVariantsProps {
  variant?: KumoCheckboxVariant;
}

export function checkboxVariants({
  variant = KUMO_CHECKBOX_DEFAULT_VARIANTS.variant,
}: KumoCheckboxVariantsProps = {}) {
  return cn(KUMO_CHECKBOX_VARIANTS.variant[variant].classes);
}

// Legacy type alias for backwards compatibility
export type CheckboxVariant = KumoCheckboxVariant;

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Visual variant: "default" or "error" for validation failures */
  variant?: CheckboxVariant;
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      indeterminate,
      disabled,
      variant = "default",
      label,
      onValueChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const Icon = indeterminate ? MinusIcon : checked ? CheckIcon : undefined;

    useImperativeHandle(ref, () => internalRef.current!, []);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate === true;
      }
    }, [internalRef, indeterminate]);

    return (
      <label
        className={cn(
          "m-0! flex! items-center gap-2 text-surface",
          disabled
            ? "cursor-not-allowed opacity-50"
            : [checkboxVariants({ variant }), "cursor-pointer"],
          className,
        )}
      >
        <input
          ref={internalRef}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            onValueChange?.(e.target.checked);
            onChange?.(e);
          }}
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-sm border-0 bg-surface ring ring-border",
            (checked || indeterminate) && "bg-surface-inverse",
          )}
        >
          {Icon && (
            <Icon className="text-surface-inverse" weight="bold" size="12" />
          )}
        </span>
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
