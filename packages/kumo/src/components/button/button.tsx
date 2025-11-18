import React from "react";
import { ArrowsClockwiseIcon, type Icon } from "@phosphor-icons/react";
import { Loader } from "../loader/loader";
import { cn } from "../../utils/cn";
import { useLinkComponent } from "../../utils/link-provider";

interface KumoButtonVariantsProps {
  shape?: "base" | "square" | "circle";
  size?: "base" | "xs" | "sm" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
}

const sizeStyles = {
  xs: "h-5 gap-1 rounded-sm px-1.5 text-xs",
  sm: "h-6.5 gap-1 rounded-md px-2 text-xs",
  base: "h-9 gap-1.5 rounded-lg px-3 text-base",
  lg: "h-10 gap-2 rounded-lg px-4 text-base",
};

export function buttonVariants({
  variant = "secondary",
  size = "base",
  shape = "base",
}: KumoButtonVariantsProps = {}) {
  // Variant-specific styles
  const variantStyles = {
    primary:
      "bg-kumo-primary !text-kumo-primary hover:bg-kumo-primary/70 disabled:bg-kumo-primary/50 disabled:!text-kumo-primary/70",
    secondary: cn(
      "bg-kumo-secondary !text-kumo-secondary ring not-disabled:hover:border-kumo-subtle!",
      "not-disabled:hover:bg-kumo-subtle disabled:bg-kumo-secondary/50 disabled:!text-kumo-secondary/70",
      'data-[state="open"]:bg-kumo-subtle ring-kumo-border'
    ),
    ghost: "text-kumo-surface hover:bg-kumo-accent shadow-none bg-inherit",
    destructive:
      "bg-kumo-destructive !text-kumo-destructive hover:bg-kumo-destructive/70",
    outline: "bg-kumo-surface text-kumo-surface ring ring-kumo-border",
  };

  const isCompactShape = shape === "square" || shape === "circle";

  // Compact shape size mappings
  const compactSizeStyles = {
    xs: "size-3.5",
    sm: "size-6.5",
    base: "size-9",
    lg: "size-10",
  };

  return cn(
    // Base styles
    "group flex w-max shrink-0 items-center font-medium select-none",
    "border-0 shadow-xs",
    "cursor-pointer",
    // Disabled state
    "disabled:text-kumo-muted disabled:cursor-not-allowed",
    // Apply variant, size styles
    variantStyles[variant],
    sizeStyles[size],
    // Apply shape-specific styles
    isCompactShape && compactSizeStyles[size],
    isCompactShape && "p-0 items-center justify-center",
    shape === "circle" && "rounded-full"
  );
}

// Normalize icon prop to support both React elements and component types
const renderIconNode = (IconComponent?: Icon | React.ReactNode) => {
  if (!IconComponent) return null;
  if (React.isValidElement(IconComponent)) return IconComponent;
  const Comp = IconComponent as React.ComponentType<Record<string, unknown>>;
  return <Comp />;
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  KumoButtonVariantsProps & {
    children?: React.ReactNode;
    className?: string;
    icon?: Icon | React.ReactNode;
    loading?: boolean;
  };

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  KumoButtonVariantsProps & {
    children?: React.ReactNode;
    className?: string;
    icon?: Icon | React.ReactNode;
    external?: boolean;
    linksExternal?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      loading,
      shape = "base",
      size = "base",
      variant = "secondary",
      icon: IconComponent,
      ...props
    },
    ref
  ) => {
    const { type, ...restProps } = props;
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, shape }),
          "focus-visible:ring-kumo-active outline-none focus:opacity-100 focus-visible:ring-1 *:in-focus:opacity-100", // Focus styles
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={loading || disabled}
        type={type ?? "button"}
        {...restProps}
      >
        {loading && <Loader size={size === "lg" ? 16 : 14} />}
        {!loading && renderIconNode(IconComponent)}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const RefreshButton = ({
  "aria-label": ariaLabel = "Refresh",
  loading,
  ...props
}: ButtonProps) => (
  <Button shape="square" aria-label={ariaLabel} {...props}>
    <ArrowsClockwiseIcon
      className={cn({
        "animate-refresh": loading,
        "size-4.5": props.size === "base" || !props.size,
        "size-4": props.size === "sm",
        "size-5": props.size === "lg",
      })}
    />
  </Button>
);

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      children,
      className,
      external,
      href,
      shape = "base",
      size = "base",
      variant = "ghost",
      icon: IconComponent,
      // linksExternal = false,
      ...props
    },
    ref
  ) => {
    const LinkComponent = useLinkComponent();
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <LinkComponent
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, shape }),
          "flex items-center no-underline!",
          className
        )}
        href={href}
        to={typeof href === "string" ? href : undefined}
        {...externalProps}
        {...props}
      >
        {renderIconNode(IconComponent)}
        {children}
      </LinkComponent>
    );
  }
);

LinkButton.displayName = "LinkButton";
