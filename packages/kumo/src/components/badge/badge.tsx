import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { defineSchema, COMMON_PROPS } from "../../utils/schema-helpers";

// =============================================================================
// KUMO_BADGE_VARIANTS - Single source of truth for all badge prop options
// =============================================================================

export const KUMO_BADGE_VARIANTS = {
  variant: {
    primary: {
      classes: "bg-kumo-surface-inverse text-kumo-surface-inverse",
      description: "Default high-emphasis badge for important labels",
    },
    secondary: {
      classes: "bg-kumo-color text-kumo-surface",
      description: "Subtle badge for secondary information",
    },
    destructive: {
      classes: "bg-kumo-destructive text-kumo-white",
      description: "Error or danger state indicator",
    },
    outline: {
      classes: "border border-kumo-color bg-transparent text-kumo-surface",
      description: "Bordered badge with transparent background",
    },
    beta: {
      classes:
        "border border-dashed border-kumo-primary bg-transparent text-kumo-beta",
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

// =============================================================================
// badgeVariants - Computes class names from KUMO_BADGE_VARIANTS
// =============================================================================

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

export function Badge({
  variant = KUMO_BADGE_DEFAULT_VARIANTS.variant,
  className,
  children,
}: {
  variant?: KumoBadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

// =============================================================================
// BADGE_SCHEMA - Machine-readable component metadata for AI/agent consumption
// =============================================================================

export const BADGE_SCHEMA = defineSchema({
  component: Badge,
  description: "Small badge for labels and status indicators",
  category: "Display",
  variants: KUMO_BADGE_VARIANTS,
  defaults: KUMO_BADGE_DEFAULT_VARIANTS,
  additionalProps: {
    className: COMMON_PROPS.className,
    children: COMMON_PROPS.children,
  },
  examples: [
    '<Badge variant="primary">New</Badge>',
    '<Badge variant="destructive">Error</Badge>',
    '<Badge variant="beta">Beta</Badge>',
  ],
});
