import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

/** Blog posts / articles */
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image"),
  category: text("category").notNull().default("general"),
  author: text("author").notNull().default("Admin"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImage: text("og_image"),
});

/** Contact form submissions */
export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Site settings (key-value store for dynamic config) */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Hero slides / banners */
export const slides = pgTable("slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  link: text("link"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Dynamic CMS pages */
export const pages = pgTable("pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  sections: jsonb("sections").notNull().default([]),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Media library (images, videos, documents) */
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  alt: text("alt"),
  type: text("type").notNull().default("image"), // image | video | document
  filename: text("filename").notNull(),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Site navigation items */
export const navigation = pgTable("navigation", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  parentId: uuid("parent_id"), // self-reference, nullable
  isExternal: boolean("is_external").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
