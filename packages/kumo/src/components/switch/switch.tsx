import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { type ButtonHTMLAttributes, type Ref, useId } from "react";
import { cn } from "../../utils/cn";

type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  onClick: () => void;
  size?: "sm" | "base" | "lg";
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
          "interactive flex items-center gap-2 rounded-full border border-transparent bg-kumo-surface-3 p-1 transition-colors",
          {
            "h-5.5 w-8.5": size === "sm",
            "h-6.5 w-10.5": size === "base",
            "h-7.5 w-12.5": size === "lg",
            "bg-kumo-selected": state.checked,
            "hover:bg-kumo-hover-selected": state.checked && !transitioning,
            "hover:bg-kumo-hover": !state.checked && !transitioning,
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
                  hideLabel
                    ? "sr-only"
                    : "text-sm font-medium text-kumo-surface",
                )}
              >
                {label}
              </span>
            )}
            <BaseSwitch.Thumb
              className={cn(
                "pointer-events-none aspect-square h-full rounded-full bg-kumo-white transition-all",
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
