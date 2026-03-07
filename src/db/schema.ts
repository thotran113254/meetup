import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
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
