import { z } from "zod";

export const pageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chi chua chu thuong, so va dau -"),
  title: z.string().min(1, "Tieu de khong duoc trong"),
  sections: z.array(z.record(z.string(), z.unknown())).default([]),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

export type PageData = z.infer<typeof pageSchema>;
