import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  integer,
  bigint,
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
  // Upload system fields (nullable for backward compat with URL-only records)
  storagePath: text("storage_path"),   // physical key in storage adapter
  mimeType: text("mime_type"),         // e.g. "image/webp"
  width: integer("width"),             // pixel width after optimization
  height: integer("height"),           // pixel height after optimization
  folder: text("folder"),              // folder name for organization (null = root)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Tour packages — first-class CMS entities for the Tours page sections */
export const tourPackages = pgTable("tour_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  image: text("image").notNull().default(""),
  price: integer("price").notNull().default(0),
  duration: text("duration").notNull().default(""),
  spots: integer("spots").notNull().default(0),
  tags: jsonb("tags").notNull().default([]),
  flights: integer("flights").notNull().default(0),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("general"),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  // Detail page fields
  gallery: jsonb("gallery").notNull().default([]),           // string[] — extra gallery images
  groupSize: text("group_size").notNull().default(""),       // e.g. "Min 2 - Max 24"
  tripType: text("trip_type").notNull().default(""),         // e.g. "Group Tours"
  rangeLabel: text("range_label").notNull().default(""),     // e.g. "Signature Journeys"
  tourPace: text("tour_pace").notNull().default(""),         // e.g. "Medium"
  physicalRating: integer("physical_rating").notNull().default(1), // 1–5
  places: jsonb("places").notNull().default([]),             // string[] — places visited
  itinerary: jsonb("itinerary").notNull().default([]),       // ItineraryDay[]
  pricingOptions: jsonb("pricing_options").notNull().default([]), // PricingGroup[]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Tour bookings / orders */
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  tourPackageId: uuid("tour_package_id").notNull(),
  tourSlug: text("tour_slug").notNull().default(""),
  tourTitle: text("tour_title").notNull(),
  status: text("status").notNull().default("processing"),
  // Customer info
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerWhatsapp: text("customer_whatsapp").notNull(),
  customerMessage: text("customer_message"),
  promotionCode: text("promotion_code"),
  // Service details
  departureDate: text("departure_date").notNull(),
  pickupPoint: text("pickup_point"),
  address: text("address"),
  tourOption: text("tour_option"),
  // Pricing
  lineItems: jsonb("line_items").notNull().default([]),
  serviceItems: jsonb("service_items").notNull().default([]),
  totalUsd: integer("total_usd").notNull(), // cents (e.g. 2800 = $28.00)
  totalVnd: bigint("total_vnd", { mode: "number" }).notNull(),
  totalPax: integer("total_pax").notNull().default(0),
  // Payment
  paymentData: jsonb("payment_data"),
  transactionRef: text("transaction_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Payment transaction log — audit trail of all OnePay callbacks */
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingCode: text("booking_code").notNull(),
  type: text("type").notNull().default("onepay"),
  data: jsonb("data").notNull(),
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
