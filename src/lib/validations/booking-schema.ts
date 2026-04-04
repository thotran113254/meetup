import { z } from "zod";

const lineItemSchema = z.object({
  label: z.string().min(1),
  price: z.number().min(0),
  count: z.number().int().min(0),
});

const serviceItemSchema = z.object({
  label: z.string().min(1),
  price: z.number().min(0),
  count: z.number().int().min(0),
  description: z.string(),
});

/** Full checkout submission schema — validated server-side before booking creation */
export const createBookingSchema = z.object({
  tourSlug: z.string().min(1, "Tour is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(5, "WhatsApp number is required"),
  promotionCode: z.string().optional().or(z.literal("")),
  messenger: z.string().min(10, "Message must be at least 10 characters"),
  departureDate: z
    .string()
    .min(1, "Departure date is required")
    .refine(
      (d) => {
        const date = new Date(d + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Departure date cannot be in the past" },
    ),
  pickupPoint: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  tourOption: z.string().optional().or(z.literal("")),
  lineItems: z.array(lineItemSchema).min(1, "At least one guest required"),
  serviceItems: z.array(serviceItemSchema),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
