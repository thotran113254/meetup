"use server";

import { createBookingSchema } from "@/lib/validations/booking-schema";
import { getTourPackageBySlug } from "@/db/queries/tour-packages-queries";
import {
  createBooking,
  findRecentProcessingBooking,
} from "@/db/queries/booking-queries";
import { buildOnepayPaymentUrl } from "@/lib/payments/onepay-url-builder";
import { generateBookingCode } from "@/lib/payments/generate-booking-code";
import { VND_RATE, BOOKING_STATUS } from "@/lib/constants/payment-constants";
import type { CreateBookingInput } from "@/lib/validations/booking-schema";

export type CheckoutActionResult = {
  success: boolean;
  message: string;
  paymentUrl?: string;
};

export async function submitCheckout(
  data: CreateBookingInput,
): Promise<CheckoutActionResult> {
  // 1. Server-side validation
  const parsed = createBookingSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  try {
    // 2. Verify tour exists and is published
    const tour = await getTourPackageBySlug(parsed.data.tourSlug);
    if (!tour || !tour.published) {
      return {
        success: false,
        message: "Tour không tồn tại hoặc đã ngưng nhận booking.",
      };
    }

    // 3. Compute totals (totalUsd stored as cents)
    const lineTotal = parsed.data.lineItems.reduce(
      (s, i) => s + i.price * i.count,
      0,
    );
    const serviceTotal = parsed.data.serviceItems.reduce(
      (s, i) => s + i.price * i.count,
      0,
    );
    const totalUsdCents = Math.round((lineTotal + serviceTotal) * 100);
    const totalVnd = Math.round((totalUsdCents / 100) * VND_RATE);
    const totalPax = parsed.data.lineItems.reduce((s, i) => s + i.count, 0);

    if (totalUsdCents <= 0) {
      return { success: false, message: "Vui lòng chọn ít nhất 1 khách." };
    }

    // 4. Dedup: reuse recent processing booking for same tour+email+date
    const existing = await findRecentProcessingBooking(
      parsed.data.tourSlug,
      parsed.data.email,
      parsed.data.departureDate,
    );
    if (existing) {
      const paymentUrl = buildOnepayPaymentUrl({
        bookingCode: existing.code,
        amountVnd: existing.totalVnd,
      });
      return { success: true, message: "Đang chuyển đến trang thanh toán...", paymentUrl };
    }

    // 5. Generate unique booking code
    const code = generateBookingCode();

    // 6. Save booking to DB
    await createBooking({
      code,
      tourPackageId: tour.id,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      status: BOOKING_STATUS.PROCESSING,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      customerWhatsapp: parsed.data.whatsapp,
      customerMessage: parsed.data.messenger || null,
      promotionCode: parsed.data.promotionCode || null,
      departureDate: parsed.data.departureDate,
      pickupPoint: parsed.data.pickupPoint || null,
      address: parsed.data.address || null,
      tourOption: parsed.data.tourOption || null,
      lineItems: parsed.data.lineItems,
      serviceItems: parsed.data.serviceItems,
      totalUsd: totalUsdCents,
      totalVnd,
      totalPax,
      paymentData: null,
      transactionRef: null,
    });

    // 7. Build OnePay payment URL
    const paymentUrl = buildOnepayPaymentUrl({
      bookingCode: code,
      amountVnd: totalVnd,
    });

    return {
      success: true,
      message: "Đang chuyển đến trang thanh toán...",
      paymentUrl,
    };
  } catch (error) {
    console.error("[submitCheckout]", error);
    return { success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
