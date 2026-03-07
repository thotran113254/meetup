import { z } from "zod";

/** Blog post form validation schema */
export const postFormSchema = z.object({
  title: z
    .string()
    .min(2, "Tieu de phai co it nhat 2 ky tu")
    .max(200, "Tieu de khong duoc vuot qua 200 ky tu"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi chua chu thuong, so va dau -"),
  excerpt: z
    .string()
    .max(500, "Tom tat khong duoc vuot qua 500 ky tu")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(10, "Noi dung phai co it nhat 10 ky tu"),
  category: z.string().min(1, "Vui long chon danh muc"),
  coverImage: z
    .string()
    .url("URL anh khong hop le")
    .optional()
    .or(z.literal("")),
  metaTitle: z
    .string()
    .max(70, "Meta title khong duoc vuot qua 70 ky tu")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description khong duoc vuot qua 160 ky tu")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
});

export type PostFormData = z.infer<typeof postFormSchema>;
