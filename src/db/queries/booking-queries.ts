import { eq, desc, and, gt, ne, sql } from "drizzle-orm";
import { getDb } from "../connection";
import { bookings, paymentTransactions } from "../schema";
import type {
  Booking,
  BookingLineItem,
  BookingServiceItem,
} from "@/lib/types/booking-types";

/** Cast raw DB row to typed Booking */
function toBooking(row: typeof bookings.$inferSelect): Booking {
  return {
    ...row,
    lineItems: (row.lineItems as BookingLineItem[]) ?? [],
    serviceItems: (row.serviceItems as BookingServiceItem[]) ?? [],
    paymentData: (row.paymentData as Record<string, unknown>) ?? null,
  } as Booking;
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "updatedAt">,
): Promise<Booking> {
  const result = await getDb().insert(bookings).values(data).returning();
  return toBooking(result[0]);
}

/** Find recent processing booking for same tour+email+date (dedup within 5 min) */
export async function findRecentProcessingBooking(
  tourSlug: string,
  email: string,
  departureDate: string,
): Promise<Booking | null> {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const rows = await getDb()
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.tourSlug, tourSlug),
        eq(bookings.customerEmail, email),
        eq(bookings.departureDate, departureDate),
        eq(bookings.status, "processing"),
        gt(bookings.createdAt, fiveMinAgo),
      ),
    )
    .limit(1);
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function getBookingByCode(code: string): Promise<Booking | null> {
  const rows = await getDb()
    .select()
    .from(bookings)
    .where(eq(bookings.code, code))
    .limit(1);
  return rows[0] ? toBooking(rows[0]) : null;
}

/** Atomic CAS: only updates if current status is NOT already 'success' */
export async function updateBookingStatus(
  code: string,
  status: string,
  paymentData?: Record<string, unknown>,
  transactionRef?: string,
): Promise<Booking | null> {
  const result = await getDb()
    .update(bookings)
    .set({ status, paymentData, transactionRef, updatedAt: new Date() })
    .where(and(eq(bookings.code, code), ne(bookings.status, "success")))
    .returning();
  return result[0] ? toBooking(result[0]) : null;
}

export async function getAllBookings(limit = 50, offset = 0) {
  const db = getDb();
  const [data, total] = await Promise.all([
    db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset),
    db.$count(bookings),
  ]);
  return { data: data.map(toBooking), total: Number(total) };
}

/** Filtered bookings for admin — supports status filter + pagination */
export async function getFilteredBookings(
  status: string | null,
  limit = 20,
  offset = 0,
): Promise<{ data: Booking[]; total: number }> {
  const db = getDb();
  const where = status ? eq(bookings.status, status) : undefined;

  const [data, total] = await Promise.all([
    where
      ? db
          .select()
          .from(bookings)
          .where(where)
          .orderBy(desc(bookings.createdAt))
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(bookings)
          .orderBy(desc(bookings.createdAt))
          .limit(limit)
          .offset(offset),
    where ? db.$count(bookings, where) : db.$count(bookings),
  ]);

  return { data: data.map(toBooking), total: Number(total) };
}

/** Count bookings per status — for admin dashboard badges */
export async function getBookingStatusCounts(): Promise<
  Record<string, number>
> {
  const db = getDb();
  const rows = await db
    .select({
      status: bookings.status,
      count: sql<number>`count(*)::int`,
    })
    .from(bookings)
    .groupBy(bookings.status);
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.status] = row.count;
  return counts;
}

export async function addPaymentTransaction(
  bookingCode: string,
  type: string,
  data: Record<string, unknown>,
) {
  await getDb()
    .insert(paymentTransactions)
    .values({ bookingCode, type, data });
}
