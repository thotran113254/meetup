import { getOnepayConfig } from "./onepay-config";
import { verifyOnepayHash } from "./onepay-hash";
import {
  getBookingByCode,
  updateBookingStatus,
  addPaymentTransaction,
} from "@/db/queries/booking-queries";
import {
  BOOKING_STATUS,
  ONEPAY_SUCCESS_CODE,
} from "@/lib/constants/payment-constants";

export type OnepayProcessResult = {
  verified: boolean;
  bookingCode: string | null;
  bookingFound: boolean;
  newStatus: string | null;
};

/**
 * Process OnePay callback params:
 * 1. Log transaction (audit)
 * 2. Verify hash
 * 3. Update booking if not already success
 */
export async function processOnepayCallback(
  params: Record<string, string>,
): Promise<OnepayProcessResult> {
  const bookingCode = params.vpc_OrderInfo || null;

  // Always log transaction for audit
  if (bookingCode) {
    await addPaymentTransaction(bookingCode, "onepay", params);
  }

  // Verify hash
  const config = getOnepayConfig();
  const verified = verifyOnepayHash(params, config.secureSecret);
  if (!verified) {
    return { verified: false, bookingCode, bookingFound: false, newStatus: null };
  }

  // Find booking
  if (!bookingCode) {
    return { verified: true, bookingCode: null, bookingFound: false, newStatus: null };
  }
  const booking = await getBookingByCode(bookingCode);
  if (!booking) {
    return { verified: true, bookingCode, bookingFound: false, newStatus: null };
  }

  // Atomic CAS update: DB WHERE clause prevents overwriting 'success'
  const newStatus =
    params.vpc_TxnResponseCode === ONEPAY_SUCCESS_CODE
      ? BOOKING_STATUS.SUCCESS
      : BOOKING_STATUS.PAYFAIL;
  const updated = await updateBookingStatus(
    bookingCode,
    newStatus,
    params,
    params.vpc_MerchTxnRef,
  );

  return {
    verified: true,
    bookingCode,
    bookingFound: true,
    newStatus: updated ? newStatus : booking.status,
  };
}
