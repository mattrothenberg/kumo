import { Tooltip, TooltipProvider, Button } from "@cloudflare/kumo";
import { PlusIcon, TranslateIcon } from "@phosphor-icons/react";

export function TooltipBasicDemo() {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip content="Add item" asChild>
          <Button shape="square" icon={PlusIcon} />
        </Tooltip>
        <Tooltip content="Change language" asChild>
          <Button shape="square" icon={TranslateIcon} />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
