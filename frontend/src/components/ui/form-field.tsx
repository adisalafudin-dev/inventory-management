import type { ReactNode } from "react";

interface FieldControlProps {
  id: string;
  "aria-labelledby": string;
  "aria-describedby"?: string;
  "aria-invalid": boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (props: FieldControlProps) => ReactNode;
}

export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label
        id={labelId}
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>

      {children({
        id,
        "aria-labelledby": labelId,
        "aria-describedby": describedBy,
        "aria-invalid": !!error,
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
