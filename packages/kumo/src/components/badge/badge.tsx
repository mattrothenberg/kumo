import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export const KUMO_BADGE_VARIANTS = {
  variant: {
    primary: {
      classes: "bg-surface-inverse text-surface-inverse",
      description: "Default high-emphasis badge for important labels",
    },
    secondary: {
      classes: "bg-color text-surface",
      description: "Subtle badge for secondary information",
    },
    destructive: {
      classes: "bg-destructive text-white",
      description: "Error or danger state indicator",
    },
    outline: {
      classes: "border border-color bg-transparent text-surface",
      description: "Bordered badge with transparent background",
    },
    beta: {
      classes: "border border-dashed border-primary bg-transparent text-info",
      description: "Indicates beta or experimental features",
    },
  },
} as const;

export const KUMO_BADGE_DEFAULT_VARIANTS = {
  variant: "primary",
} as const;

// Derived types from KUMO_BADGE_VARIANTS
export type KumoBadgeVariant = keyof typeof KUMO_BADGE_VARIANTS.variant;

export interface KumoBadgeVariantsProps {
  variant?: KumoBadgeVariant;
}

export function badgeVariants({
  variant = KUMO_BADGE_DEFAULT_VARIANTS.variant,
}: KumoBadgeVariantsProps = {}) {
  return cn(
    // Base styles
    "inline-flex w-fit flex-none shrink-0 items-center justify-self-start rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
    // Apply variant styles from KUMO_BADGE_VARIANTS
    KUMO_BADGE_VARIANTS.variant[variant].classes,
  );
}

// Legacy type alias for backwards compatibility
export type BadgeVariant = KumoBadgeVariant;

export interface BadgeProps {
  variant?: KumoBadgeVariant;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = KUMO_BADGE_DEFAULT_VARIANTS.variant,
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
