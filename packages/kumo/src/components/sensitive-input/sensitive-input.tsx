import { Eye, EyeSlash } from "@phosphor-icons/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "../../utils/cn";
import {
  inputVariants,
  KUMO_INPUT_VARIANTS,
  type KumoInputSize,
  type KumoInputVariant,
} from "../input/input";

export const KUMO_SENSITIVE_INPUT_VARIANTS = KUMO_INPUT_VARIANTS;

export const KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

type Mode = "masked" | "revealed" | "editing";

export interface SensitiveInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "size" | "type" | "value" | "defaultValue"
  > {
  /** Controlled value */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Simplified change handler receiving just the value */
  onValueChange?: (value: string) => void;
  /** Callback fired after value is copied to clipboard */
  onCopy?: () => void;
  /** Size variant */
  size?: KumoInputSize;
  /** Style variant */
  variant?: KumoInputVariant;
  /** Accessible label */
  label?: string;
  /** Hide label visually (still accessible to screen readers) */
  hideLabel?: boolean;
}

export const SensitiveInput = forwardRef<HTMLInputElement, SensitiveInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onValueChange,
      onCopy,
      size = KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS.size,
      variant = KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS.variant,
      label,
      hideLabel = true,
      disabled = false,
      readOnly = false,
      id,
      autoComplete = "off",
      className,
      ...inputProps
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;
    const hasValue = value.length > 0;

    const [mode, setMode] = useState<Mode>(() =>
      hasValue ? "masked" : "editing",
    );

    const [copied, setCopied] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Reset copied state after 2 seconds
    useEffect(() => {
      if (copied) {
        const timeoutId = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timeoutId);
      }
    }, [copied]);

    const copyToClipboard = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
          if (
            typeof navigator !== "undefined" &&
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === "function"
          ) {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            onCopy?.();
            return;
          }
        } catch {
          // Fall through to manual fallback
        }

        if (typeof document !== "undefined") {
          const textarea = document.createElement("textarea");
          textarea.value = value;
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
            onCopy?.();
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
      },
      [value, onCopy],
    );

    // Sync mode when value changes externally
    const prevHasValueRef = useRef(hasValue);
    if (prevHasValueRef.current !== hasValue) {
      prevHasValueRef.current = hasValue;
      if (!hasValue && mode === "masked") {
        setMode("editing");
      }
    }

    const handleContainerClick = useCallback(() => {
      if (disabled) return;
      if (mode === "masked" && hasValue) {
        setMode("revealed");
        if (!readOnly) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    }, [mode, hasValue, disabled, readOnly]);

    const handleToggleVisibility = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (mode === "revealed") {
          setMode("masked");
        } else if (mode === "editing" && hasValue) {
          setMode("revealed");
        }
      },
      [mode, hasValue],
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(e);
        onValueChange?.(newValue);
      },
      [isControlled, onChange, onValueChange],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        // Don't mask if focus is moving to a button inside the container (copy/eye buttons)
        if (
          containerRef.current &&
          e.relatedTarget instanceof Node &&
          containerRef.current.contains(e.relatedTarget)
        ) {
          return;
        }
        if (hasValue) {
          setMode("masked");
        }
      },
      [hasValue],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (mode === "masked" && hasValue) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMode("revealed");
            if (!readOnly) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }
        if (mode === "revealed" && e.key === "Escape") {
          setMode("masked");
        }
      },
      [mode, hasValue, disabled, readOnly],
    );

    const isMaskedWithValue = mode === "masked" && hasValue;
    const showEyeButton =
      !disabled && (mode === "revealed" || (mode === "editing" && hasValue));

    // Icon sizes matching input sizes
    const iconSize = size === "xs" || size === "sm" ? "size-3" : "size-4";

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className={
              hideLabel ? "sr-only" : "block text-sm font-medium text-surface"
            }
          >
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          className={cn(
            inputVariants({ size, variant, parentFocusIndicator: true }),
            "group/container relative flex w-full items-center",
            isMaskedWithValue && !disabled && "cursor-pointer",
            disabled && "cursor-not-allowed",
            className,
          )}
          onClick={handleContainerClick}
          onKeyDown={handleKeyDown}
          role={isMaskedWithValue ? "button" : undefined}
          tabIndex={isMaskedWithValue && !disabled ? 0 : undefined}
          aria-label={
            isMaskedWithValue
              ? `${label ?? "Sensitive value"}, masked. Click to reveal`
              : undefined
          }
        >
          {/* Input - defines the width, always rendered */}
          <input
            ref={mergedRef}
            id={inputId}
            type={mode === "revealed" ? "text" : "password"}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly || isMaskedWithValue}
            autoComplete={autoComplete}
            tabIndex={isMaskedWithValue ? -1 : 0}
            className={cn(
              "w-full border-0 bg-transparent p-0 text-secondary outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:text-muted",
              size === "xs" && "pr-5",
              size === "sm" && "pr-6",
              size === "base" && "pr-8",
              size === "lg" && "pr-10",
              isMaskedWithValue && "pointer-events-none text-transparent",
            )}
            aria-label={hideLabel ? label : undefined}
            aria-hidden={isMaskedWithValue}
            {...inputProps}
          />

          {/* Mask overlay - absolutely positioned, doesn't affect layout */}
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden select-none",
              // Match input pr padding (space for icon)
              size === "xs" && "right-5",
              size === "sm" && "right-6",
              size === "base" && "right-8",
              size === "lg" && "right-10",
              // Match the padding from inputVariants
              size === "xs" && "px-1.5",
              size === "sm" && "px-2",
              size === "base" && "px-3",
              size === "lg" && "px-4",
              // Hidden when not masked
              !isMaskedWithValue && "invisible",
              // When masked: enable pointer events
              isMaskedWithValue && "pointer-events-auto",
              // Text color - use text-secondary to contrast with bg-secondary input background
              "text-secondary",
              // Hover state - pure CSS, no React state (group for children)
              "group/mask",
            )}
            aria-hidden="true"
          >
            {/* Both texts rendered, stacked. Visibility toggled on hover to prevent layout shift */}
            <span className="relative">
              <span
                className={cn(
                  isMaskedWithValue &&
                    !disabled &&
                    "group-hover/mask:invisible",
                )}
              >
                ●●●●●●●●
              </span>
              {isMaskedWithValue && !disabled && (
                <span className="invisible absolute inset-0 text-muted group-hover/mask:visible">
                  Click to reveal
                </span>
              )}
            </span>
          </span>

          {/* Eye button - absolutely positioned to the right */}
          <button
            type="button"
            onClick={handleToggleVisibility}
            aria-label={mode === "revealed" ? "Hide value" : "Show value"}
            aria-pressed={mode === "revealed"}
            tabIndex={showEyeButton ? 0 : -1}
            className={cn(
              "absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-muted outline-none hover:text-secondary focus:text-secondary",
              // Match right padding from inputVariants
              size === "xs" && "right-1.5",
              size === "sm" && "right-2",
              size === "base" && "right-3",
              size === "lg" && "right-4",
              iconSize,
              !showEyeButton && "pointer-events-none opacity-0",
            )}
          >
            {mode === "revealed" ? (
              <EyeSlash className="size-full" />
            ) : (
              <Eye className="size-full" />
            )}
          </button>

          {/* Copy tab - appears on hover at top right */}
          {hasValue && (
            <button
              type="button"
              onClick={copyToClipboard}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              className={cn(
                "absolute -top-px right-2 -translate-y-full cursor-pointer rounded-t-md bg-primary px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover/container:opacity-100 hover:brightness-120 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-active",
              )}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>

        <span className="sr-only" aria-live="polite">
          {mode === "revealed" && "Value revealed"}
          {mode === "masked" && hasValue && "Value hidden"}
          {copied && "Copied to clipboard"}
        </span>
      </div>
    );
  },
);

SensitiveInput.displayName = "SensitiveInput";
