import { z } from "zod";

export const slideSchema = z.object({
  title: z.string().min(1, "Tieu de khong duoc trong"),
  subtitle: z.string().optional().or(z.literal("")),
  image: z.string().min(1, "Anh khong duoc trong"),
  link: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type SlideData = z.infer<typeof slideSchema>;
