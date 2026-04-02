import { z } from "zod";

export const navigationSchema = z.object({
  label: z.string().min(1, "Nhan khong duoc trong"),
  href: z.string().min(1, "Duong dan khong duoc trong"),
  sortOrder: z.number().int().min(0).default(0),
  parentId: z.string().uuid().nullable().optional(),
  isExternal: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type NavigationData = z.infer<typeof navigationSchema>;
