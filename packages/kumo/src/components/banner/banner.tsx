import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { defineSchema, COMMON_PROPS } from "../../utils/schema-helpers";

// =============================================================================
// KUMO_BANNER_VARIANTS - Single source of truth for all banner prop options
// =============================================================================

export const KUMO_BANNER_VARIANTS = {
  variant: {
    default: {
      classes:
        "bg-kumo-info-surface border-kumo-info-border text-kumo-info selection:bg-kumo-info-selection",
      description: "Informational banner for general messages",
    },
    alert: {
      classes:
        "bg-kumo-alert-surface border-kumo-alert-border text-kumo-alert selection:bg-kumo-alert-selection",
      description: "Warning banner for cautionary messages",
    },
    error: {
      classes:
        "bg-kumo-error-surface border-kumo-error-border text-kumo-error selection:bg-kumo-error-selection",
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

// =============================================================================
// bannerVariants - Computes class names from KUMO_BANNER_VARIANTS
// =============================================================================

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

export function Banner({
  icon,
  text,
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
  className,
}: {
  icon?: ReactNode;
  text: string;
  variant?: KumoBannerVariant;
  className?: string;
}) {
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      {icon}
      <p>{text}</p>
    </div>
  );
}

// =============================================================================
// BANNER_SCHEMA - Machine-readable component metadata for AI/agent consumption
// =============================================================================

export const BANNER_SCHEMA = defineSchema({
  component: Banner,
  description: "Banner for notifications and alerts",
  category: "Feedback",
  variants: KUMO_BANNER_VARIANTS,
  defaults: KUMO_BANNER_DEFAULT_VARIANTS,
  additionalProps: {
    text: { type: "string", required: true },
    icon: { type: "ReactNode", optional: true },
    className: COMMON_PROPS.className,
  },
  examples: [
    '<Banner text="This is a notification" />',
    '<Banner text="Warning!" variant="alert" icon={<WarningIcon />} />',
    '<Banner text="Error occurred" variant="error" />',
  ],
});
