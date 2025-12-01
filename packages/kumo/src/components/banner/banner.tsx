import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export enum BannerVariant {
  DEFAULT,
  ALERT,
  ERROR,
}

const DEFAULT_CLASS =
  "rounded-lg w-full bg-kumo-info-surface px-4 py-1.5 border border-kumo-info-border text-kumo-info flex items-center gap-2 selection:bg-kumo-info-selection";
const ALERT_CLASS =
  "rounded-lg w-full bg-kumo-alert-surface px-4 py-1.5 border border-kumo-alert-border text-kumo-alert flex items-center gap-2 selection:bg-kumo-alert-selection";
const ERROR_CLASS =
  "rounded-lg w-full bg-kumo-error-surface px-4 py-1.5 border border-kumo-error-border text-kumo-error flex items-center gap-2 selection:bg-kumo-error-selection";

export function Banner({
  icon,
  text,
  variant = BannerVariant.DEFAULT,
  className,
}: {
  icon?: ReactNode;
  text: string;
  variant?: BannerVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-base",
        variant === BannerVariant.DEFAULT && DEFAULT_CLASS,
        variant === BannerVariant.ALERT && ALERT_CLASS,
        variant === BannerVariant.ERROR && ERROR_CLASS,
        className,
      )}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}
