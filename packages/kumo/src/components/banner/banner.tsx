import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

/**
 * Base styles applied to all banner variants.
 * Used by bannerVariants() and consumed by Figma plugin for component generation.
 */
export const KUMO_BANNER_BASE_STYLES =
  "flex w-full items-center gap-2 rounded-lg border px-4 py-1.5 text-base";

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
    // Base styles (exported as KUMO_BANNER_BASE_STYLES for Figma plugin)
    KUMO_BANNER_BASE_STYLES,
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
  children?: ReactNode;
  /**
   * @deprecated Use `children` instead. Will be removed in a future major version.
   */
  text?: ReactNode;
  variant?: KumoBannerVariant;
  className?: string;
}

export function Banner({
  icon,
  children,
  text,
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
  className,
}: BannerProps) {
  // Prefer children over deprecated text prop
  const value = children ?? text;

  const content =
    typeof value === "string" || typeof value === "number" ? (
      <p>{value}</p>
    ) : (
      value
    );

  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      {icon}
      {content}
    </div>
  );
}
