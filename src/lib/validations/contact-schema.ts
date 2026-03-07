import { z } from "zod";

/** Contact form validation schema - reusable on client + server */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Ten phai co it nhat 2 ky tu")
    .max(100, "Ten khong duoc vuot qua 100 ky tu"),
  email: z
    .string()
    .email("Email khong hop le"),
  phone: z
    .string()
    .max(20, "So dien thoai khong hop le")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Noi dung phai co it nhat 10 ky tu")
    .max(2000, "Noi dung khong duoc vuot qua 2000 ky tu"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
