import type { BookingStatus } from "@/lib/constants/payment-constants";

/** A single guest line item in booking */
export type BookingLineItem = {
  label: string;
  price: number;
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
  tourSlug: string;
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
  totalUsd: number; // cents (e.g. 2800 = $28.00)
  totalVnd: number;
  totalPax: number;
  paymentData: Record<string, unknown> | null;
  transactionRef: string | null;
  createdAt: Date;
  updatedAt: Date;
};
