"use client";

import { FormField, inputStyles } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/validations/checkout-schema";

/** Contact information form section */
export function TourCheckoutInformationForm({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}) {
  return (
    <div className="bg-white rounded-[12px] p-4 md:p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-4 md:gap-5">
      <h2 className="text-[20px] font-bold leading-[1.2] text-[#1D1D1D]">
        Information
      </h2>

      {/* 4-column input row */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-2">
          <FormField label="Name" htmlFor="checkout-name" required error={errors.name}>
            <input
              id="checkout-name"
              type="text"
              placeholder="Your name"
              className={cn(inputStyles, "!text-[14px]", errors.name && "border-[var(--color-destructive)]")}
              {...register("name")}
            />
          </FormField>
          <FormField label="Email" htmlFor="checkout-email" required error={errors.email}>
            <input
              id="checkout-email"
              type="email"
              placeholder="your@email.com"
              className={cn(inputStyles, "!text-[14px]", errors.email && "border-[var(--color-destructive)]")}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Whatsapp number"
            htmlFor="checkout-whatsapp"
            required
            error={errors.whatsapp}
          >
            <input
              id="checkout-whatsapp"
              type="tel"
              placeholder="0999 888 222"
              className={cn(inputStyles, "!text-[14px]", errors.whatsapp && "border-[var(--color-destructive)]")}
              {...register("whatsapp")}
            />
          </FormField>
          <FormField label="Promotion code" htmlFor="checkout-promo">
            <input
              id="checkout-promo"
              type="text"
              placeholder="Your promotion code"
              className={cn(inputStyles, "!text-[14px]")}
              {...register("promotionCode")}
            />
          </FormField>
        </div>

        {/* Messenger textarea */}
        <FormField
          label="Messenger"
          htmlFor="checkout-messenger"
          required
          error={errors.messenger}
        >
          <textarea
            id="checkout-messenger"
            rows={4}
            placeholder="Please enter the details of your messenger..."
            className={cn(
              inputStyles,
              "!text-[14px] resize-none min-h-[120px]",
              errors.messenger && "border-[var(--color-destructive)]"
            )}
            {...register("messenger")}
          />
        </FormField>
      </div>
    </div>
  );
}
