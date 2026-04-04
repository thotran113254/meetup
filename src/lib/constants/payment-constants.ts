/** VND per 1 USD */
export const VND_RATE = 16500;

/** Booking status enum */
export const BOOKING_STATUS = {
  PROCESSING: "processing",
  SUCCESS: "success",
  PAYFAIL: "payfail",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

/** OnePay vpc_TxnResponseCode: 0 = approved */
export const ONEPAY_SUCCESS_CODE = "0";
