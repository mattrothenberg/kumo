import type { FC, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type LayerCardProps = PropsWithChildren<{ className?: string }>;

function LayerCardRoot({ children, className }: LayerCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-lg bg-kumo-surface-2 text-base ring ring-kumo-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

function LayerCardSecondary({ children, className }: LayerCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 text-base font-medium text-kumo-neutral-dim",
        className,
      )}
    >
      {children}
    </div>
  );
}

function LayerCardPrimary({ children, className }: LayerCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-kumo-surface-2 p-4 pr-3 text-inherit no-underline ring ring-kumo-color",
        className,
      )}
    >
      {children}
    </div>
  );
}

type LayerCardComponent = FC<LayerCardProps> & {
  Primary: FC<LayerCardProps>;
  Secondary: FC<LayerCardProps>;
};

const LayerCard = Object.assign(LayerCardRoot, {
  Primary: LayerCardPrimary,
  Secondary: LayerCardSecondary,
}) as LayerCardComponent;

export { LayerCard };
