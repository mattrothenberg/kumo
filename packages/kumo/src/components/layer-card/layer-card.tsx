import type { FC, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type LayerCardProps = PropsWithChildren<{ className?: string }>;

function LayerCardRoot({ children, className }: LayerCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-lg bg-neutral-25 text-base ring ring-neutral-950/10 dark:bg-surface dark:ring-neutral-800",
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
        "flex items-center gap-2 p-2 text-base font-medium text-neutral-500",
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
        "flex flex-col gap-2 rounded-lg bg-surface p-4 pr-3 text-inherit no-underline ring ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800",
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
