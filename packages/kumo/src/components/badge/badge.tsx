import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "beta";

export function Badge({
  variant = "primary",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit flex-none shrink-0 items-center justify-self-start rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        variant === "outline"
          ? "border border-kumo-color bg-transparent text-kumo-surface"
          : "",
        variant === "primary"
          ? "bg-kumo-surface-inverse text-kumo-surface-inverse"
          : "",
        variant === "secondary" ? "bg-kumo-color text-kumo-surface" : "",
        variant === "destructive" ? "bg-kumo-destructive text-kumo-white" : "",
        variant === "beta"
          ? "border border-dashed border-kumo-primary bg-transparent text-kumo-beta"
          : "",
        className,
      )}
    >
      {children}
    </span>
  );
}
