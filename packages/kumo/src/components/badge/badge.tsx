import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type BadgeVariant = "primary" | "secondary" | "destructive" | "outline" | "beta";

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
        "inline-flex items-center w-fit whitespace-nowrap flex-none shrink-0 justify-self-start text-xs font-medium px-2 py-0.5 rounded-full",
        variant === "outline"
          ? "border text-kumo-surface border-kumo-color bg-transparent"
          : "",
        variant === "primary"
          ? "bg-kumo-surface-inverse text-kumo-surface-inverse"
          : "",
        variant === "secondary" ? "text-kumo-surface bg-kumo-color" : "",
        variant === "destructive"
          ? "text-kumo-destructive bg-kumo-destructive"
          : "",
        variant === "beta"
          ? "border border-dashed bg-transparent border-kumo-primary text-kumo-beta"
          : "",
        className
      )}
    >
      {children}
    </span>
  );
}
