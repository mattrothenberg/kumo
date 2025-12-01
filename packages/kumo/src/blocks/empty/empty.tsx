import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../../components/button";
import { cn } from "../../utils/cn";

export interface EmptyProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  commandLine?: string;
  contents?: React.ReactNode;
}

export function Empty({
  icon,
  title,
  description,
  commandLine,
  contents,
}: EmptyProps) {
  const [emptyStateCopied, setEmptyStateCopied] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-xl border border-kumo-color bg-kumo-secondary px-10 py-16">
      {icon}
      <h2 className="text-2xl font-semibold">{title}</h2>

      {description && (
        <p className="max-w-140 text-center text-kumo-label">{description}</p>
      )}

      {commandLine && (
        <div
          className={cn(
            "group/cmd relative inline-flex h-10 max-w-8/10 transform-gpu items-center gap-2 rounded-lg font-mono shadow-sm",
            "bg-kumo-surface-secondary pr-2 pl-3",
            "transition-all duration-300 hover:border-kumo-hover-border hover:shadow-md",
            "border border-kumo-border-2",
          )}
        >
          <span className="text-xs text-kumo-label-inverse select-none">$</span>
          <span className="no-scrollbar overflow-scroll text-[14px] whitespace-nowrap text-kumo-brand">
            {commandLine}
          </span>
          <Button
            className="group"
            size="sm"
            variant="ghost"
            shape="square"
            aria-label="Copy command"
            onClick={async () => {
              setEmptyStateCopied(true);
              setTimeout(() => {
                setEmptyStateCopied(false);
              }, 1000);
              await navigator.clipboard.writeText(commandLine);
            }}
          >
            {emptyStateCopied ? (
              <CheckIcon
                size={16}
                className="animate-bounce-in text-kumo-green"
              />
            ) : (
              <CopyIcon
                size={16}
                className="text-kumo-label-inverse group-hover:text-kumo-brand"
              />
            )}
          </Button>
        </div>
      )}

      {contents}
    </div>
  );
}
