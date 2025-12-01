import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../../components/button";

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
    <div className="flex w-full flex-col items-center gap-6 rounded-xl border border-neutral-200 bg-white px-10 py-16 dark:border-neutral-800 dark:bg-neutral-900">
      {icon}
      <h2 className="text-2xl font-semibold">{title}</h2>

      {description && (
        <p className="max-w-140 text-center text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      {commandLine && (
        <div className="group/cmd relative inline-flex h-10 max-w-8/10 transform-gpu items-center gap-2 rounded-lg border border-neutral-200/60 bg-neutral-50 pr-2 pl-3 font-mono shadow-sm transition-all duration-300 hover:border-neutral-300/80 hover:shadow-md dark:border-neutral-800/60 dark:bg-black dark:hover:border-neutral-700/80">
          <span className="text-xs text-neutral-400 select-none dark:text-neutral-600">
            $
          </span>
          <span className="no-scrollbar overflow-scroll text-[14px] whitespace-nowrap text-[#f6821f]">
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
                className="animate-bounce-in text-green-500"
              />
            ) : (
              <CopyIcon
                size={16}
                className="text-neutral-400 group-hover:text-[#f6821f] dark:text-neutral-600"
              />
            )}
          </Button>
        </div>
      )}

      {contents && contents}
    </div>
  );
}
