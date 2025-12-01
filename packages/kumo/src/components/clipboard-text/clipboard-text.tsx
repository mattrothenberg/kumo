import { CheckIcon, ClipboardIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../button";
import { inputVariants } from "../input";
import { cn } from "../../utils/cn";

export function ClipboardText({ text, className }: ClipboardTextProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        return;
      }
    } catch {
      // Fall through to manual fallback
    }

    if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      const selection = document.getSelection();
      const previousRange = selection?.rangeCount
        ? selection.getRangeAt(0)
        : null;
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch (error) {
        console.warn("Clipboard copy failed", error);
      } finally {
        document.body.removeChild(textarea);
        if (previousRange) {
          selection?.removeAllRanges();
          selection?.addRange(previousRange);
        }
      }
    }
  }, [text]);

  const mergedClassName = cn(
    inputVariants({
      size: "lg",
    }),
    "flex items-center overflow-hidden bg-kumo-surface px-0 font-mono text-sm",
    className,
  );

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  return (
    <div className={mergedClassName}>
      <span className="grow px-4">{text}</span>
      <Button
        size="lg"
        variant="ghost"
        className="rounded-none border-l! border-kumo-color! px-3"
        onClick={copyToClipboard}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        aria-pressed={copied}
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}

interface ClipboardTextProps {
  text: string;
  className?: string;
}
