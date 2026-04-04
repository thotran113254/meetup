"use client";

import { X } from "lucide-react";
import type { Booking } from "@/lib/types/booking-types";
import { BOOKING_STATUS } from "@/lib/constants/payment-constants";

type Props = {
  booking: Booking;
  onClose: () => void;
  onCancel: (code: string) => void;
  cancelling: string | null;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-1 text-sm">
      <span className="text-[var(--color-muted-foreground)] shrink-0">{label}</span>
      <span className="text-right break-all">{value}</span>
    </div>
  );
}

export function AdminOrdersDetailDialog({ booking, onClose, onCancel, cancelling }: Props) {
  const canCancel =
    booking.status === BOOKING_STATUS.PROCESSING &&
    cancelling !== booking.code;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[var(--color-card)] rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold">Chi tiết đơn hàng</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Booking info */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Thông tin booking</h3>
            <Row label="Mã" value={booking.code} />
            <Row label="Trạng thái" value={booking.status} />
            <Row label="Tour" value={booking.tourTitle} />
            <Row label="Ngày khởi hành" value={booking.departureDate} />
            {booking.pickupPoint && <Row label="Điểm đón" value={booking.pickupPoint} />}
            {booking.tourOption && <Row label="Gói tour" value={booking.tourOption} />}
            {booking.address && <Row label="Địa chỉ" value={booking.address} />}
          </div>

          {/* Customer info */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Khách hàng</h3>
            <Row label="Họ tên" value={booking.customerName} />
            <Row label="Email" value={booking.customerEmail} />
            <Row label="WhatsApp" value={booking.customerWhatsapp} />
            {booking.customerMessage && <Row label="Tin nhắn" value={booking.customerMessage} />}
            {booking.promotionCode && <Row label="Mã khuyến mãi" value={booking.promotionCode} />}
          </div>

          {/* Line items */}
          {booking.lineItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Dịch vụ đặt</h3>
              {booking.lineItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span>{item.label} x{item.count}</span>
                  <span>${(item.price * item.count).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Service items */}
          {booking.serviceItems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Dịch vụ thêm</h3>
              {booking.serviceItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-0.5">
                  <span>{item.label} x{item.count}</span>
                  <span>${(item.price * item.count).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex justify-between font-bold">
              <span>Tổng</span>
              <span>
                ${(booking.totalUsd / 100).toFixed(2)}{" "}
                <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                  ({booking.totalVnd.toLocaleString("en-US")} VND)
                </span>
              </span>
            </div>
          </div>

          {/* Cancel button */}
          {canCancel && (
            <button onClick={() => onCancel(booking.code)}
              className="w-full h-10 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
              Hủy đơn hàng
            </button>
          )}
          {cancelling === booking.code && (
            <p className="text-sm text-center text-[var(--color-muted-foreground)]">Đang hủy...</p>
          )}
        </div>
      </div>
    </div>
  );
}
