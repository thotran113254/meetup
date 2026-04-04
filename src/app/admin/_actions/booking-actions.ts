"use server";

import {
  getFilteredBookings,
  getBookingStatusCounts,
  updateBookingStatus,
  getBookingByCode,
} from "@/db/queries/booking-queries";
import { BOOKING_STATUS } from "@/lib/constants/payment-constants";
import type { Booking } from "@/lib/types/booking-types";

export type BookingListResult = {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<string, number>;
};

export async function fetchBookings(
  page = 1,
  limit = 20,
  status: string | null = null,
): Promise<BookingListResult> {
  const offset = (page - 1) * limit;
  const [result, statusCounts] = await Promise.all([
    getFilteredBookings(status, limit, offset),
    getBookingStatusCounts(),
  ]);
  return { ...result, page, limit, statusCounts };
}

export async function fetchBookingDetail(
  code: string,
): Promise<Booking | null> {
  return getBookingByCode(code);
}

export async function cancelBooking(
  code: string,
): Promise<{ success: boolean; message: string }> {
  const booking = await getBookingByCode(code);
  if (!booking) return { success: false, message: "Booking không tồn tại" };
  if (booking.status === BOOKING_STATUS.SUCCESS) {
    return {
      success: false,
      message: "Không thể hủy booking đã thanh toán thành công",
    };
  }
  await updateBookingStatus(code, BOOKING_STATUS.CANCELLED);
  return { success: true, message: "Đã hủy booking" };
}
