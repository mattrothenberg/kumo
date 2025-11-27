import { Field as FieldBase } from "@base-ui-components/react/field";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BaseErrorProps = ComponentPropsWithoutRef<typeof FieldBase.Error>;

export function Field({
  children,
  label,
  error,
  description,
}: {
  children: ReactNode;
  label: string;
  error?: {
    message: ReactNode;
    match: BaseErrorProps["match"];
  };
  description?: ReactNode;
}) {
  return (
    <FieldBase.Root className="grid gap-2">
      <FieldBase.Label className="text-base font-medium">
        {label}
      </FieldBase.Label>
      {children}
      {error && (
        <FieldBase.Error
          className="text-sm text-kumo-error"
          match={error.match}
        >
          {error.message}
        </FieldBase.Error>
      )}
      {description && (
        <FieldBase.Description className="text-sm leading-snug text-kumo-muted">
          {description}
        </FieldBase.Description>
      )}
    </FieldBase.Root>
  );
}
