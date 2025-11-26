import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  type InputHTMLAttributes,
} from "react";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  variant?: "default" | "error";
  onValueChange?: (checked: boolean) => void;
};

const variantStyles = {
  default:
    "[&:focus-within>span]:ring-kumo-active [&:hover>span]:ring-kumo-active",
  error: "[&>span]:ring-kumo-destructive",
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
    ref
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
          "flex! m-0! items-center gap-2",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : [variantStyles[variant], "cursor-pointer"],
          className
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
            "flex items-center justify-center w-4 h-4 border-0 rounded-sm bg-kumo-surface ring ring-kumo-border",
            (checked || indeterminate) && "dark:bg-neutral-100 bg-neutral-900"
          )}
        >
          {Icon && (
            <Icon
              className="text-neutral-100 dark:text-neutral-900"
              weight="bold"
              size="12"
            />
          )}
        </span>
        {label}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
