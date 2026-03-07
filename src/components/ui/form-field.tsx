"use client";

import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

/** Shared input styles - single source of truth for all form elements */
export const inputStyles =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] disabled:opacity-50 disabled:cursor-not-allowed";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

/** Reusable form field wrapper with label + error display */
export function FormField({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
        {required && <span className="text-[var(--color-destructive)] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[var(--color-destructive)]">{error.message}</p>
      )}
    </div>
  );
}
