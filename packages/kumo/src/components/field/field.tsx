import { Field as FieldBase } from "@base-ui/react/field";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export const KUMO_FIELD_VARIANTS = {
  // Field currently has no variant options but structure is ready for future additions
} as const;

export const KUMO_FIELD_DEFAULT_VARIANTS = {} as const;

// Derived types from KUMO_FIELD_VARIANTS
export interface KumoFieldVariantsProps {}

export function fieldVariants(_props: KumoFieldVariantsProps = {}) {
  return cn(
    // Base styles
    "grid gap-2",
  );
}

/**
 * Match type for field validation errors.
 * Can be a boolean or a key from the browser's ValidityState interface.
 * Source: BaseErrorProps["match"] (ComponentPropsWithoutRef<typeof FieldBase.Error>)
 */
type FieldErrorMatch =
  | boolean
  | "badInput"
  | "customError"
  | "patternMismatch"
  | "rangeOverflow"
  | "rangeUnderflow"
  | "stepMismatch"
  | "tooLong"
  | "tooShort"
  | "typeMismatch"
  | "valid"
  | "valueMissing";

export interface FieldProps extends KumoFieldVariantsProps {
  children: ReactNode;
  label: string;
  error?: {
    message: ReactNode;
    match: FieldErrorMatch;
  };
  description?: ReactNode;
}

export function Field({ children, label, error, description }: FieldProps) {
  return (
    <FieldBase.Root className={fieldVariants()}>
      <FieldBase.Label className="text-base font-medium">
        {label}
      </FieldBase.Label>
      {children}
      {error && (
        <FieldBase.Error className="text-sm text-error" match={error.match}>
          {error.message}
        </FieldBase.Error>
      )}
      {description && (
        <FieldBase.Description className="text-sm leading-snug text-muted">
          {description}
        </FieldBase.Description>
      )}
    </FieldBase.Root>
  );
}
