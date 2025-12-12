import { inputVariants } from "./input";
import { cn } from "../../utils/cn";
import { useCallback, type ReactNode } from "react";
import * as React from "react";
import { Field as KumoField, type FieldErrorMatch } from "../field/field";

export const InputArea = React.forwardRef<HTMLTextAreaElement, InputAreaProps>(
  (props, ref) => {
    const {
      className,
      onValueChange,
      size = "base",
      variant = "default",
      onChange,
      label,
      description,
      error,
      ...inputProps
    } = props;
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
      },
      [onChange, onValueChange],
    );

    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          inputVariants({ size, variant, focusIndicator: true }),
          "h-auto py-2", // Input variant always come with size, but it does not apply for textarea
          className,
        )}
        onChange={handleChange}
        {...inputProps}
      />
    );

    // Render with Field wrapper if label is provided
    if (label) {
      return (
        <KumoField
          label={label}
          description={description}
          error={
            error
              ? typeof error === "string"
                ? { message: error, match: true }
                : error
              : undefined
          }
        >
          {textarea}
        </KumoField>
      );
    }

    // Render bare textarea without Field wrapper
    return textarea;
  },
);

InputArea.displayName = "InputArea";

/**
 * InputArea component props
 * @property {string} [label] - Label text for the textarea (enables Field wrapper)
 * @property {ReactNode} [description] - Helper text displayed below the textarea
 * @property {string | { message: ReactNode, match: FieldErrorMatch }} [error] - Error message or validation error object
 */
export type InputAreaProps = {
  onValueChange?: (value: string) => void;
  variant?: "default" | "error";
  size?: "xs" | "sm" | "base" | "lg";
  // Then other custom props
  children?: React.ReactNode;
  className?: string;
  /** Label text for the textarea (enables Field wrapper) */
  label?: string;
  /** Helper text displayed below the textarea */
  description?: ReactNode;
  /** Error message or validation error object */
  error?: string | { message: ReactNode; match: FieldErrorMatch };

  // Finally, spread the native input props (least important)
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;
