"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Booking } from "@/lib/types/booking-types";

const STATUS_TABS = [
  { label: "Tất cả", value: null },
  { label: "Đang xử lý", value: "processing" },
  { label: "Thành công", value: "success" },
  { label: "Thất bại", value: "payfail" },
  { label: "Đã hủy", value: "cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700",
  success: "bg-green-100 text-green-700",
  payfail: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.cancelled}`}
    >
      {status}
    </span>
  );
}

type Props = {
  data: Booking[];
  total: number;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  statusFilter: string | null;
  setStatusFilter: (s: string | null) => void;
  statusCounts: Record<string, number>;
  loading: boolean;
  onRowClick: (booking: Booking) => void;
};

export function AdminOrdersTable({
  data, total, totalPages, page, setPage,
  statusFilter, setStatusFilter, statusCounts, loading, onRowClick,
}: Props) {
  const allCount = Object.values(statusCounts).reduce((s, c) => s + c, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Status filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => {
          const count = tab.value ? statusCounts[tab.value] || 0 : allCount;
          const active = statusFilter === tab.value;
          return (
            <button key={tab.label} onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"}`}>
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted-foreground)] uppercase">
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Ngày đi</th>
              <th className="px-4 py-3 text-right">Tổng</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">Đang tải...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted-foreground)]">Chưa có đơn hàng nào</td></tr>
            ) : (
              data.map((b) => (
                <tr key={b.id} onClick={() => onRowClick(b)}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)] cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{b.tourTitle}</td>
                  <td className="px-4 py-3">{b.customerName}</td>
                  <td className="px-4 py-3">{b.departureDate}</td>
                  <td className="px-4 py-3 text-right font-medium">${(b.totalUsd / 100).toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted-foreground)]">
            Tổng {total} đơn hàng
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
              className="p-1.5 rounded hover:bg-[var(--color-muted)] disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3">Trang {page}/{totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-[var(--color-muted)] disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
