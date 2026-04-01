import { z } from "zod";

/** Checkout form validation schema */
export const checkoutFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(5, "WhatsApp number is required"),
  promotionCode: z.string().optional().or(z.literal("")),
  messenger: z.string().min(10, "Message must be at least 10 characters"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/** Quantity item for guests */
export type QuantityItem = {
  label: string;
  price: number;
  count: number;
};

/** Additional service item */
export type ServiceItem = {
  label: string;
  price: number;
  count: number;
  description: string;
};
