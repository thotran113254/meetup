import { z } from "zod";

/** Blog post form validation schema — content is stored as Markdown */
export const postFormSchema = z.object({
  title: z.string().min(2, "Tiêu đề cần ít nhất 2 ký tự").max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ chứa chữ thường, số và dấu -"),
  excerpt: z.string().max(500, "Tóm tắt không được vượt quá 500 ký tự").optional().or(z.literal("")),
  content: z.string().min(10, "Nội dung cần ít nhất 10 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  coverImage: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
  metaTitle: z.string().max(70, "Meta title không được vượt quá 70 ký tự").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Meta description không được vượt quá 160 ký tự").optional().or(z.literal("")),
  published: z.boolean(),
});

export type PostFormData = z.infer<typeof postFormSchema>;
