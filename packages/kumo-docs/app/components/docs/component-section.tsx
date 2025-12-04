import React from "react";
import { cn } from "@cloudflare/kumo";

interface ComponentSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A section wrapper for component documentation
 */
export function ComponentSection({
  children,
  className,
}: ComponentSectionProps) {
  return <section className={cn("mb-12", className)}>{children}</section>;
}
