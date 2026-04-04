"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Booking } from "@/lib/types/booking-types";
import { TourCheckoutResultStatusCard } from "./tour-checkout-result-status-card";

type Props = {
  booking: Booking | null;
  errorType?: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1">
      <span className="text-[#828282] shrink-0">{label}:</span>
      <span className="text-[#1D1D1D] break-all">{value}</span>
    </div>
  );
}

export function TourCheckoutResultContent({ booking, errorType }: Props) {
  const status = errorType ? "error" : booking?.status || "error";

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/tours"
        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Tours
      </Link>

      <TourCheckoutResultStatusCard status={status} />

      {booking && (
        <div className="bg-white rounded-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.06)] flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#1D1D1D]">
            Chi tiết booking
          </h2>
          <div className="h-px bg-[#ECECEC]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
            <DetailRow label="Mã booking" value={booking.code} />
            <DetailRow label="Tour" value={booking.tourTitle} />
            <DetailRow label="Ngày khởi hành" value={booking.departureDate} />
            <DetailRow label="Họ tên" value={booking.customerName} />
            <DetailRow label="Email" value={booking.customerEmail} />
            <DetailRow label="WhatsApp" value={booking.customerWhatsapp} />
            {booking.pickupPoint && (
              <DetailRow label="Điểm đón" value={booking.pickupPoint} />
            )}
            {booking.tourOption && (
              <DetailRow label="Gói tour" value={booking.tourOption} />
            )}
          </div>
          <div className="h-px bg-[#ECECEC]" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#828282]">Tổng thanh toán</span>
            <div className="text-right">
              <span className="text-[16px] font-bold text-[#1D1D1D]">
                ${(booking.totalUsd / 100).toFixed(2)}
              </span>
              <span className="text-[12px] text-[#828282] ml-2">
                ({booking.totalVnd.toLocaleString("en-US")} VND)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {status === "payfail" && booking && (
          <Link
            href={`/tours/checkout?slug=${booking.tourSlug}`}
            className="flex-1 text-center h-10 leading-10 bg-[var(--color-primary)] text-white text-[14px] font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Thử lại
          </Link>
        )}
        <Link
          href="/tours"
          className="flex-1 text-center h-10 leading-10 border border-[var(--color-border)] text-[14px] font-medium rounded-xl hover:bg-[var(--color-muted)] transition-colors"
        >
          Xem tour khác
        </Link>
      </div>
    </div>
  );
}
