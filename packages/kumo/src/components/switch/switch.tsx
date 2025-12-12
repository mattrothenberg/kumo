import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { type ButtonHTMLAttributes, type Ref, useId } from "react";
import { cn } from "../../utils/cn";

export const KUMO_SWITCH_VARIANTS = {
  size: {
    sm: {
      classes: "h-5.5 w-8.5",
      description: "Small switch for compact UIs",
    },
    base: {
      classes: "h-6.5 w-10.5",
      description: "Default switch size",
    },
    lg: {
      classes: "h-7.5 w-12.5",
      description: "Large switch for prominent toggles",
    },
  },
} as const;

export const KUMO_SWITCH_DEFAULT_VARIANTS = {
  size: "base",
} as const;

// Derived types from KUMO_SWITCH_VARIANTS
export type KumoSwitchSize = keyof typeof KUMO_SWITCH_VARIANTS.size;

export interface KumoSwitchVariantsProps {
  size?: KumoSwitchSize;
}

export function switchVariants({
  size = KUMO_SWITCH_DEFAULT_VARIANTS.size,
}: KumoSwitchVariantsProps = {}) {
  return cn(KUMO_SWITCH_VARIANTS.size[size].classes);
}

// Legacy type alias for backwards compatibility
export type SwitchSize = KumoSwitchSize;

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  onClick: () => void;
  size?: KumoSwitchSize;
  toggled: boolean;
  transitioning?: boolean;
  label?: string;
  hideLabel?: boolean;
};

export const Switch = ({
  onClick,
  size = "base",
  toggled,
  transitioning,
  className,
  label = "Switch",
  hideLabel = true,
  ...buttonProps
}: SwitchProps) => {
  const generatedLabelId = useId();
  const propsLookup = buttonProps as Record<string, unknown>;
  const ariaLabelFromProps = propsLookup["aria-label"] as string | undefined;
  const ariaLabelledbyFromProps = propsLookup["aria-labelledby"] as
    | string
    | undefined;

  const needsLabelledBy = !ariaLabelFromProps;
  const effectiveLabelId =
    ariaLabelledbyFromProps ??
    (needsLabelledBy && label ? generatedLabelId : undefined);
  const effectiveAriaLabel =
    ariaLabelFromProps ?? (!effectiveLabelId ? (label ?? "Switch") : undefined);

  return (
    <BaseSwitch.Root
      checked={toggled}
      onCheckedChange={() => {
        onClick();
      }}
      render={(rootProps, state) => {
        const {
          ref: rootRef,
          className: baseClassName,
          role: baseRole,
          "aria-checked": _ariaChecked,
          "aria-pressed": _ariaPressed,
          ...restRootProps
        } = rootProps as typeof rootProps & {
          ref?: Ref<HTMLButtonElement>;
          className?: string;
          role?: string;
          "aria-checked"?: boolean;
          "aria-pressed"?: boolean;
        };

        const mergedClassName = cn(
          "interactive flex items-center gap-2 rounded-full border border-transparent bg-surface-3 p-1 transition-colors",
          switchVariants({ size }),
          {
            "bg-selected": state.checked,
            "hover:bg-hover-selected": state.checked && !transitioning,
            "hover:bg-hover": !state.checked && !transitioning,
          },
          transitioning ? "cursor-wait" : "cursor-pointer",
          className,
          baseClassName,
        );

        const role =
          (buttonProps.role as string | undefined) ?? baseRole ?? "switch";
        const checkedA11yProps =
          role === "switch"
            ? { "aria-checked": state.checked }
            : { "aria-pressed": state.checked };

        return (
          <button
            {...restRootProps}
            {...buttonProps}
            ref={rootRef}
            type="button"
            role={role}
            {...checkedA11yProps}
            aria-busy={transitioning || undefined}
            aria-label={effectiveAriaLabel}
            aria-labelledby={effectiveLabelId}
            className={mergedClassName}
          >
            {needsLabelledBy && label && (
              <span
                id={effectiveLabelId}
                className={cn(
                  hideLabel ? "sr-only" : "text-sm font-medium text-surface",
                )}
              >
                {label}
              </span>
            )}
            <BaseSwitch.Thumb
              className={cn(
                "pointer-events-none aspect-square h-full rounded-full bg-white transition-all",
                {
                  "translate-x-full": state.checked,
                },
              )}
            />
          </button>
        );
      }}
    />
  );
};
