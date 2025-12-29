import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export const KUMO_BANNER_VARIANTS = {
  variant: {
    default: {
      classes: "bg-info/20 border-info text-info selection:bg-info-selection",
      description: "Informational banner for general messages",
    },
    alert: {
      classes:
        "bg-alert/20 border-alert text-alert selection:bg-alert-selection",
      description: "Warning banner for cautionary messages",
    },
    error: {
      classes:
        "bg-error/20 border-error text-error selection:bg-error-selection",
      description: "Error banner for critical issues",
    },
  },
} as const;

export const KUMO_BANNER_DEFAULT_VARIANTS = {
  variant: "default",
} as const;

// Derived types from KUMO_BANNER_VARIANTS
export type KumoBannerVariant = keyof typeof KUMO_BANNER_VARIANTS.variant;

export interface KumoBannerVariantsProps {
  variant?: KumoBannerVariant;
}

export function bannerVariants({
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
}: KumoBannerVariantsProps = {}) {
  return cn(
    // Base styles
    "flex w-full items-center gap-2 rounded-lg border px-4 py-1.5 text-base",
    // Apply variant styles from KUMO_BANNER_VARIANTS
    KUMO_BANNER_VARIANTS.variant[variant].classes,
  );
}

// Legacy enum for backwards compatibility
export enum BannerVariant {
  DEFAULT,
  ALERT,
  ERROR,
}

export interface BannerProps {
  icon?: ReactNode;
  text: string;
  variant?: KumoBannerVariant;
  className?: string;
}

export function Banner({
  icon,
  text,
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
  className,
}: BannerProps) {
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      {icon}
      <p>{text}</p>
    </div>
  );
}
