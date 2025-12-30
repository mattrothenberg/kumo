/**
 * Kumo Component Variant Definitions
 *
 * This file mirrors the KUMO_*_VARIANTS objects from the component source files.
 * It's kept separate to avoid JSX/React dependencies in the Figma plugin.
 *
 * IMPORTANT: Keep this in sync with:
 * - src/components/badge/badge.tsx (KUMO_BADGE_VARIANTS)
 * - src/components/button/button.tsx (KUMO_BUTTON_VARIANTS)
 *
 * TODO: Generate this file automatically from component source files
 * using a build script that extracts the variant objects.
 */

/**
 * Badge variant definitions
 * Source: src/components/badge/badge.tsx
 */
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
      classes: "bg-error text-white",
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

/**
 * Badge base styles from badgeVariants()
 * Source: src/components/badge/badge.tsx
 */
export const BADGE_BASE_STYLES =
  "inline-flex w-fit flex-none shrink-0 items-center justify-self-start rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap";

/**
 * Button variant definitions
 * Source: src/components/button/button.tsx
 */
export const KUMO_BUTTON_VARIANTS = {
  shape: {
    base: {
      classes: "",
      description: "Default rectangular button shape",
    },
    square: {
      classes: "items-center justify-center p-0",
      description: "Square button for icon-only actions",
    },
    circle: {
      classes: "items-center justify-center p-0 rounded-full",
      description: "Circular button for icon-only actions",
    },
  },
  size: {
    xs: {
      classes: "h-5 gap-1 rounded-sm px-1.5 text-xs",
      description: "Extra small button for compact UIs",
    },
    sm: {
      classes: "h-6.5 gap-1 rounded-md px-2 text-xs",
      description: "Small button for secondary actions",
    },
    base: {
      classes: "h-9 gap-1.5 rounded-lg px-3 text-base",
      description: "Default button size",
    },
    lg: {
      classes: "h-10 gap-2 rounded-lg px-4 text-base",
      description: "Large button for primary CTAs",
    },
  },
  compactSize: {
    xs: { classes: "size-3.5" },
    sm: { classes: "size-6.5" },
    base: { classes: "size-9" },
    lg: { classes: "size-10" },
  },
  variant: {
    primary: {
      classes:
        "bg-primary !text-white hover:bg-primary/70 disabled:bg-primary/50",
      description: "High-emphasis button for primary actions",
    },
    secondary: {
      classes:
        "bg-secondary !text-surface ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-surface/70 ring-border data-[state=open]:bg-subtle",
      description: "Default button style for most actions",
    },
    ghost: {
      classes: "text-surface hover:bg-accent shadow-none bg-inherit",
      description: "Minimal button with no background",
    },
    destructive: {
      classes: "bg-error !text-white hover:bg-error/70",
      description: "Danger button for destructive actions like delete",
    },
    "secondary-destructive": {
      classes:
        "bg-secondary !text-error ring not-disabled:hover:border-subtle! not-disabled:hover:bg-subtle disabled:bg-secondary/50 disabled:!text-error/70 ring-border data-[state=open]:bg-subtle",
      description:
        "Secondary button with destructive text for less prominent dangerous actions",
    },
    outline: {
      classes: "bg-surface text-surface ring ring-border",
      description: "Bordered button with transparent background",
    },
  },
} as const;

/**
 * Button base styles from buttonVariants()
 * Source: src/components/button/button.tsx
 */
export const BUTTON_BASE_STYLES =
  "group flex w-max shrink-0 items-center font-medium select-none border-0 shadow-xs cursor-pointer disabled:cursor-not-allowed disabled:text-muted";

// Type exports for use in generators
export type BadgeVariant = keyof typeof KUMO_BADGE_VARIANTS.variant;
export type ButtonVariant = keyof typeof KUMO_BUTTON_VARIANTS.variant;
export type ButtonSize = keyof typeof KUMO_BUTTON_VARIANTS.size;
export type ButtonShape = keyof typeof KUMO_BUTTON_VARIANTS.shape;
