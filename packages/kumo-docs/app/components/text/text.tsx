import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ForwardedRef,
  forwardRef,
  useMemo,
} from "react";
import { cn } from "../utils";

type Heading = "h1" | "h2" | "h3";
type Copy = "body" | "secondary" | "success" | "error";
type Monospace = "mono" | "mono-secondary";

type TextSize = "base" | "sm" | "xs" | "lg";
type TextVariant = Heading | Copy | Monospace;

type BaseTextProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "className" | "style"
> & {
  DANGEROUS_className?: string;
  DANGEROUS_style?: CSSProperties;
  as?: "span";
};

type TextProps<Variant extends TextVariant = "body"> = BaseTextProps &
  (Variant extends Copy
    ? {
        variant?: Variant;
        bold?: boolean;
        size?: TextSize;
      }
    : Variant extends Monospace
      ? {
          variant?: Variant;
          bold?: never;
          size?: "lg";
        }
      : {
          variant?: Variant;
          bold?: never;
          size?: never;
        });

// Variant-specific styles
const variantStyles: Record<TextVariant, string> = {
  // Headings
  h1: "text-3xl font-semibold",
  h2: "text-2xl font-semibold",
  h3: "text-lg font-semibold",

  // Copy variants
  body: "",
  secondary: "text-muted",
  success: "text-blue-600 dark:text-blue-500",
  error: "text-error",

  // Monospace variants
  mono: "font-mono",
  "mono-secondary": "font-mono text-muted",
};

// Size styles (only apply to Copy variants)
const sizeStyles: Record<TextSize, string> = {
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
  lg: "text-lg",
};

function _Text<Variant extends TextVariant = "body">(
  {
    variant = "body" as Variant,
    bold = false,
    size = "base",
    children,
    DANGEROUS_className,
    DANGEROUS_style,
    as,
    ...props
  }: TextProps<Variant>,
  ref: ForwardedRef<HTMLHeadingElement>
) {
  const isCopy = ["body", "secondary", "success", "error"].includes(variant);
  const isMono = ["mono", "mono-secondary"].includes(variant);

  const Component = useMemo(() => {
    if (as) return as;
    if (["h1", "h2", "h3"].includes(variant))
      return variant as "h1" | "h2" | "h3";
    if (["mono", "mono-secondary"].includes(variant)) return "span";
    return "p";
  }, [variant, as]);

  return (
    <Component
      ref={ref}
      className={cn(
        variantStyles[variant],
        isCopy ? sizeStyles[size] : "",
        isCopy && bold ? "font-medium" : "",
        // Monospace fonts need to be 1pt smaller than body text to optically match
        isMono && (size === "lg" ? sizeStyles.base : sizeStyles.sm),
        DANGEROUS_className
      )}
      style={DANGEROUS_style}
      {...props}
    >
      {children}
    </Component>
  );
}

export const Text = forwardRef(_Text) as <Variant extends TextVariant = "body">(
  props: TextProps<Variant> & { ref?: ForwardedRef<ElementRef<"span">> }
) => React.ReactElement;
