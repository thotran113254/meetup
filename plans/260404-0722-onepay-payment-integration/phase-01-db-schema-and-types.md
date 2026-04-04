# Phase 1: DB Schema & Types

## Overview
- **Priority**: P1 (blocker for all other phases)
- **Status**: pending
- **Effort**: 1.5h

Add `bookings` and `payment_transactions` tables to Drizzle schema. Define TypeScript types and Zod validation for booking creation.

## Key Insights
- Existing schema uses `uuid` PKs, `jsonb` for flexible data, `timestamp` for dates
- Tour pricing is complex JSONB `pricingOptions` on `tourPackages` table
- `VND_RATE = 16500` used for USD->VND conversion (already in checkout content)
- Backend stores `line_item` and `extension` arrays — we simplify to single `lineItems` JSONB
- No user auth in frontend — bookings are anonymous (identified by email + booking code)

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/types/booking-types.ts` | Booking, PaymentTransaction, LineItem, BookingStatus types |
| `src/lib/validations/booking-schema.ts` | Zod schema for booking creation (extends checkout schema) |
| `src/db/queries/booking-queries.ts` | CRUD queries for bookings + transactions |
| `src/lib/constants/payment-constants.ts` | VND_RATE, booking statuses, OnePay response codes |

## Files to Modify

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `bookings` + `paymentTransactions` tables |
| `.env.example` | Add OnePay env vars |

## Implementation Steps

### Step 1: Add tables to `src/db/schema.ts`

Append after existing tables:

```typescript
/** Tour bookings / orders */
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),            // short unique code (e.g. "BK-a1b2c3d4")
  tourPackageId: uuid("tour_package_id").notNull(), // FK to tourPackages
  tourTitle: text("tour_title").notNull(),           // snapshot at booking time
  status: text("status").notNull().default("processing"), // processing | success | payfail | cancelled
  // Customer info
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerWhatsapp: text("customer_whatsapp").notNull(),
  customerMessage: text("customer_message"),
  promotionCode: text("promotion_code"),
  // Service details
  departureDate: text("departure_date").notNull(),   // ISO date string
  pickupPoint: text("pickup_point"),
  address: text("address"),
  tourOption: text("tour_option"),                    // e.g. "3 Days 2 Nights"
  // Pricing
  lineItems: jsonb("line_items").notNull().default([]),       // LineItem[]
  serviceItems: jsonb("service_items").notNull().default([]), // ServiceItem[]
  totalUsd: integer("total_usd").notNull(),           // cents (e.g. 2800 = $28.00)
  totalVnd: integer("total_vnd").notNull(),           // VND amount (no decimals)
  totalPax: integer("total_pax").notNull().default(0),
  // Payment
  paymentData: jsonb("payment_data"),                 // raw OnePay response on completion
  transactionRef: text("transaction_ref"),            // vpc_MerchTxnRef
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Payment transaction log — audit trail of all OnePay callbacks */
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingCode: text("booking_code").notNull(),       // links to bookings.code
  type: text("type").notNull().default("onepay"),    // payment gateway type
  data: jsonb("data").notNull(),                     // full OnePay response payload
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Design decisions:**
- `totalUsd` in cents to avoid floating-point issues
- `tourTitle` denormalized — snapshot at booking time so it survives tour edits
- `lineItems`/`serviceItems` as JSONB — flexible, mirrors checkout UI state
- `paymentTransactions` is append-only audit log, separate from booking status

### Step 2: Create `src/lib/constants/payment-constants.ts`

```typescript
/** VND per 1 USD */
export const VND_RATE = 16500;

/** Booking status enum */
export const BOOKING_STATUS = {
  PROCESSING: "processing",
  SUCCESS: "success",
  PAYFAIL: "payfail",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

/** OnePay vpc_TxnResponseCode: 0 = approved */
export const ONEPAY_SUCCESS_CODE = "0";
```

### Step 3: Create `src/lib/types/booking-types.ts`

```typescript
import type { BookingStatus } from "@/lib/constants/payment-constants";

/** A single guest line item in booking */
export type BookingLineItem = {
  label: string;   // "Adult", "Child", etc.
  price: number;   // USD price per unit
  count: number;
};

/** A single service add-on in booking */
export type BookingServiceItem = {
  label: string;
  price: number;
  count: number;
  description: string;
};

/** Full booking entity from DB */
export type Booking = {
  id: string;
  code: string;
  tourPackageId: string;
  tourTitle: string;
  status: BookingStatus;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  customerMessage: string | null;
  promotionCode: string | null;
  departureDate: string;
  pickupPoint: string | null;
  address: string | null;
  tourOption: string | null;
  lineItems: BookingLineItem[];
  serviceItems: BookingServiceItem[];
  totalUsd: number;     // cents
  totalVnd: number;
  totalPax: number;
  paymentData: Record<string, unknown> | null;
  transactionRef: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/** Input for creating a booking */
export type BookingInput = Omit<Booking, "id" | "createdAt" | "updatedAt" | "paymentData" | "transactionRef"> & {
  paymentData?: Record<string, unknown> | null;
  transactionRef?: string | null;
};
```

### Step 4: Create `src/lib/validations/booking-schema.ts`

Extend checkout form schema with service/pricing data for server-side validation:

```typescript
import { z } from "zod";

const lineItemSchema = z.object({
  label: z.string().min(1),
  price: z.number().min(0),
  count: z.number().int().min(0),
});

const serviceItemSchema = z.object({
  label: z.string().min(1),
  price: z.number().min(0),
  count: z.number().int().min(0),
  description: z.string(),
});

/** Full checkout submission schema — validated server-side before booking creation */
export const createBookingSchema = z.object({
  tourSlug: z.string().min(1, "Tour is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().min(5, "WhatsApp number is required"),
  promotionCode: z.string().optional().or(z.literal("")),
  messenger: z.string().min(10, "Message must be at least 10 characters"),
  departureDate: z.string().min(1, "Departure date is required"),
  pickupPoint: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  tourOption: z.string().optional().or(z.literal("")),
  lineItems: z.array(lineItemSchema).min(1, "At least one guest required"),
  serviceItems: z.array(serviceItemSchema),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
```

### Step 5: Create `src/db/queries/booking-queries.ts`

```typescript
import { eq, desc } from "drizzle-orm";
import { getDb } from "../connection";
import { bookings, paymentTransactions } from "../schema";
import type { Booking, BookingLineItem, BookingServiceItem } from "@/lib/types/booking-types";

/** Cast raw DB row to typed Booking */
function toBooking(row: typeof bookings.$inferSelect): Booking {
  return {
    ...row,
    lineItems: (row.lineItems as BookingLineItem[]) ?? [],
    serviceItems: (row.serviceItems as BookingServiceItem[]) ?? [],
    paymentData: (row.paymentData as Record<string, unknown>) ?? null,
  } as Booking;
}

export async function createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const result = await getDb().insert(bookings).values(data).returning();
  return toBooking(result[0]);
}

export async function getBookingByCode(code: string): Promise<Booking | null> {
  const rows = await getDb().select().from(bookings).where(eq(bookings.code, code)).limit(1);
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function updateBookingStatus(
  code: string,
  status: string,
  paymentData?: Record<string, unknown>,
  transactionRef?: string,
): Promise<Booking | null> {
  const result = await getDb()
    .update(bookings)
    .set({ status, paymentData, transactionRef, updatedAt: new Date() })
    .where(eq(bookings.code, code))
    .returning();
  return result[0] ? toBooking(result[0]) : null;
}

export async function getAllBookings(limit = 50, offset = 0) {
  const db = getDb();
  const [data, total] = await Promise.all([
    db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit).offset(offset),
    db.$count(bookings),
  ]);
  return { data: data.map(toBooking), total: Number(total) };
}

export async function addPaymentTransaction(bookingCode: string, type: string, data: Record<string, unknown>) {
  await getDb().insert(paymentTransactions).values({ bookingCode, type, data });
}
```

### Step 6: Update `.env.example`

Append OnePay config block:

```env
# OnePay Payment Gateway
ONEPAY_MERCHANT_ID=TESTONEPAY
ONEPAY_ACCESS_CODE=6BEB2546
ONEPAY_SECURE_SECRET=6D0870CDE5F24F34F3915FB0045120DB
ONEPAY_PAYMENT_URL=https://mtf.onepay.vn/paygate/vpcpay.op
ONEPAY_RETURN_URL=http://localhost:3000/api/payments/onepay/return
```

### Step 7: Push schema

```bash
pnpm db:push
```

## Todo

- [ ] Add `bookings` table to `src/db/schema.ts`
- [ ] Add `paymentTransactions` table to `src/db/schema.ts`
- [ ] Create `src/lib/constants/payment-constants.ts`
- [ ] Create `src/lib/types/booking-types.ts`
- [ ] Create `src/lib/validations/booking-schema.ts`
- [ ] Create `src/db/queries/booking-queries.ts`
- [ ] Update `.env.example` with OnePay vars
- [ ] Run `pnpm db:push` and verify tables created
- [ ] Run `pnpm typecheck` — zero errors

## Success Criteria

- `bookings` and `payment_transactions` tables exist in PostgreSQL
- All types importable without circular deps
- `pnpm typecheck` passes
- Booking CRUD queries work (tested via admin page later)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| JSONB type mismatch at runtime | Medium | Medium | Cast helper `toBooking()` with fallback defaults |
| `totalUsd` cents confusion | Low | High | Document clearly: "cents, not dollars" in type + constant |
| Schema push fails on existing data | Low | Low | No existing data in bookings tables (new) |

## Backwards Compatibility

- Zero impact: new tables only, no modifications to existing tables
- Checkout UI unchanged — still `console.log` until Phase 3 wires it
