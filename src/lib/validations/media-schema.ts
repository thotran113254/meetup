import { z } from "zod";

export const mediaSchema = z.object({
  url: z.string().min(1, "URL khong duoc trong"),
  alt: z.string().optional().or(z.literal("")),
  type: z.enum(["image", "video", "document"]).default("image"),
  filename: z.string().min(1, "Ten file khong duoc trong"),
  size: z.number().int().min(0).optional(),
});

export type MediaData = z.infer<typeof mediaSchema>;
