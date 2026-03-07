"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact-schema";
import { submitContactForm, type ContactFormState } from "@/app/contact/contact-form-action";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

/** Contact form with react-hook-form + zod validation + server action */
export function ContactForm() {
  const [result, setResult] = useState<ContactFormState>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(data: ContactFormData) {
    setResult(null);
    const response = await submitContactForm(data);
    setResult(response);
    if (response?.success) reset();
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
      <h2 className="text-2xl font-bold mb-6">Gui tin nhan</h2>

      {result && (
        <div
          className={cn(
            "mb-5 rounded-lg px-4 py-3 text-sm",
            result.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Ho va ten" htmlFor="name" required error={errors.name}>
            <input
              id="name"
              type="text"
              placeholder="Nguyen Van A"
              className={cn(inputStyles, errors.name && "border-[var(--color-destructive)]")}
              {...register("name")}
            />
          </FormField>

          <FormField label="So dien thoai" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              placeholder="+84 123 456 789"
              className={cn(inputStyles, errors.phone && "border-[var(--color-destructive)]")}
              {...register("phone")}
            />
          </FormField>
        </div>

        <FormField label="Email" htmlFor="email" required error={errors.email}>
          <input
            id="email"
            type="email"
            placeholder="ban@email.com"
            className={cn(inputStyles, errors.email && "border-[var(--color-destructive)]")}
            {...register("email")}
          />
        </FormField>

        <FormField label="Noi dung" htmlFor="message" required error={errors.message}>
          <textarea
            id="message"
            rows={5}
            placeholder="Mo ta nhu cau du an cua ban..."
            className={cn(inputStyles, "resize-none", errors.message && "border-[var(--color-destructive)]")}
            {...register("message")}
          />
        </FormField>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Dang gui..." : "Gui tin nhan"}
        </Button>
      </form>
    </div>
  );
}
