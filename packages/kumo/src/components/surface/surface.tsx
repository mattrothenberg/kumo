import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ElementType,
  type PropsWithChildren,
} from "react";
import { cn } from "../../utils/cn";

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
>;

type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>["ref"];

const defaultElement = "div";

type SurfaceProps<E extends ElementType = typeof defaultElement> =
  PolymorphicProps<E> & {
    color?: "primary" | "secondary";
  };

type SurfaceComponent = <E extends ElementType = typeof defaultElement>(
  props: SurfaceProps<E> & { ref?: PolymorphicRef<E> }
) => JSX.Element;

const SurfaceImpl = function Surface<
  E extends ElementType = typeof defaultElement,
>(
  { as, children, className, ...restProps }: SurfaceProps<E>,
  ref: PolymorphicRef<E>
) {
  const Component = as ?? defaultElement;
  return (
    <Component
      ref={ref}
      {...restProps}
      className={cn("ring shadow-xs ring-kumo-border", className)}
    >
      {children}
    </Component>
  );
};

export const Surface = forwardRef(
  SurfaceImpl as any
) as unknown as SurfaceComponent;
