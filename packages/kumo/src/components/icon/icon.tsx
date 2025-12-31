import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";
import spriteUrl from "../../assets/icons/sprite.svg";
import type { IconProps, KumoIconVariantsProps } from "./icon.types";

/**
 * Icon component variants configuration
 */
export const KUMO_ICON_VARIANTS = {
  size: {
    xs: {
      classes: "size-3",
      description: "12px - small UI elements",
    },
    sm: {
      classes: "size-4",
      description: "16px - standard inline icons",
    },
    base: {
      classes: "size-5",
      description: "20px - default size",
    },
    lg: {
      classes: "size-6",
      description: "24px - prominent icons",
    },
    xl: {
      classes: "size-8",
      description: "32px - hero sections",
    },
  },
} as const;

/**
 * Default variant values for Icon component
 */
export const KUMO_ICON_DEFAULT_VARIANTS = {
  size: "base",
} as const;

/**
 * Generate className string for icon variants
 */
export function iconVariants({
  size = KUMO_ICON_DEFAULT_VARIANTS.size,
}: KumoIconVariantsProps = {}) {
  return cn(
    // Base styles - no default color, inherits currentColor from parent
    // This matches Phosphor icon behavior
    "inline-block shrink-0 fill-current",
    // Apply size variant
    KUMO_ICON_VARIANTS.size[size].classes,
  );
}

/**
 * Icon component using SVG sprite with <use> pattern
 *
 * Color is inherited from parent's text color (currentColor), matching
 * Phosphor icon behavior. Override with text-* classes when needed.
 *
 * @example
 * ```tsx
 * // Basic usage - inherits color from parent
 * <Icon glyph="ph-check" />
 *
 * // With explicit color and size
 * <Icon glyph="ph-arrow-right" className="text-brand" size="lg" />
 *
 * // Accessible icon with title
 * <Icon glyph="cf-cloudflare-workers-outline" title="Cloudflare Workers" />
 *
 * // Error state
 * <Icon glyph="ph-warning" className="text-error" />
 *
 * // Success state
 * <Icon glyph="ph-check" className="text-green" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      glyph,
      size = KUMO_ICON_DEFAULT_VARIANTS.size,
      title,
      className,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const ariaHidden = !title;

    // Development mode: warn on potentially missing glyph
    if (process.env.NODE_ENV !== "production") {
      if (!glyph.startsWith("ph-") && !glyph.startsWith("cf-")) {
        console.warn(
          `[Icon] Invalid glyph prefix: "${glyph}". Expected "ph-" (Phosphor) or "cf-" (Cloudflare brand).`,
        );
      }
    }

    return (
      <svg
        ref={ref}
        aria-hidden={ariaHidden}
        role={ariaHidden ? undefined : "img"}
        aria-labelledby={ariaHidden ? undefined : id}
        className={cn(iconVariants({ size }), className)}
        {...props}
      >
        {title && <title id={id}>{title}</title>}
        <use href={`${spriteUrl}#${glyph}`} />
      </svg>
    );
  },
);

Icon.displayName = "Icon";
