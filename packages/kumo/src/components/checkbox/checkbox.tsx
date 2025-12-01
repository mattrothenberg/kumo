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
          "m-0! flex! items-center gap-2",
          disabled
            ? "cursor-not-allowed opacity-50"
            : [variantStyles[variant], "cursor-pointer"],
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
            "flex h-4 w-4 items-center justify-center rounded-sm border-0 bg-kumo-surface ring ring-kumo-border",
            (checked || indeterminate) && "bg-kumo-surface-inverse",
          )}
        >
          {Icon && (
            <Icon
              className="text-kumo-surface-inverse"
              weight="bold"
              size="12"
            />
          )}
        </span>
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
