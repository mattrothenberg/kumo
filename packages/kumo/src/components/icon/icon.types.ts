import type { ComponentProps } from "react";

/**
 * Phosphor icon glyph names with ph- prefix
 * @example "ph-check", "ph-arrow-right"
 */
export type PhosphorIcon =
  | "ph-arrow-right"
  | "ph-arrows-clockwise"
  | "ph-bell"
  | "ph-caret-double-left"
  | "ph-caret-double-right"
  | "ph-caret-down"
  | "ph-caret-left"
  | "ph-caret-right"
  | "ph-caret-up-down"
  | "ph-check"
  | "ph-clipboard"
  | "ph-cloud-slash"
  | "ph-copy"
  | "ph-database"
  | "ph-download"
  | "ph-eye"
  | "ph-eye-slash"
  | "ph-file"
  | "ph-folder"
  | "ph-folder-open"
  | "ph-gear"
  | "ph-globe-hemisphere-west"
  | "ph-house"
  | "ph-info"
  | "ph-magnifying-glass"
  | "ph-minus"
  | "ph-pencil"
  | "ph-plus"
  | "ph-share"
  | "ph-sign-out"
  | "ph-trash"
  | "ph-user"
  | "ph-warning"
  | "ph-x";

/**
 * Cloudflare brand icon glyph names with cf- prefix
 * @example "cf-workers", "cf-pages"
 */
export type BrandIcon =
  | "cf-placeholder";

/**
 * All available icon glyphs (Phosphor + Brand)
 */
export type IconGlyph = PhosphorIcon | BrandIcon;

/**
 * Array of all icon glyphs for validation and autocomplete
 */
export const ALL_ICON_GLYPHS: readonly IconGlyph[] = [
  "ph-arrow-right",
  "ph-arrows-clockwise",
  "ph-bell",
  "ph-caret-double-left",
  "ph-caret-double-right",
  "ph-caret-down",
  "ph-caret-left",
  "ph-caret-right",
  "ph-caret-up-down",
  "ph-check",
  "ph-clipboard",
  "ph-cloud-slash",
  "ph-copy",
  "ph-database",
  "ph-download",
  "ph-eye",
  "ph-eye-slash",
  "ph-file",
  "ph-folder",
  "ph-folder-open",
  "ph-gear",
  "ph-globe-hemisphere-west",
  "ph-house",
  "ph-info",
  "ph-magnifying-glass",
  "ph-minus",
  "ph-pencil",
  "ph-plus",
  "ph-share",
  "ph-sign-out",
  "ph-trash",
  "ph-user",
  "ph-warning",
  "ph-x",
] as const;

/**
 * Icon size variants
 */
export type KumoIconSize = "xs" | "sm" | "base" | "lg" | "xl";

/**
 * Props for icon variant configuration
 */
export interface KumoIconVariantsProps {
  size?: KumoIconSize;
}

/**
 * Props for the Icon component
 *
 * Color is controlled via className (e.g., fill-primary, fill-error).
 * Icons use fill-current by default, inheriting from parent text color.
 */
export type IconProps = ComponentProps<"svg"> &
  KumoIconVariantsProps & {
    /**
     * Icon glyph identifier (e.g., "ph-check", "cf-workers")
     */
    glyph: IconGlyph;
    /**
     * Accessible title for the icon (makes it non-decorative)
     */
    title?: string;
  };
