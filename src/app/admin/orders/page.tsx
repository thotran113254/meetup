"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { AdminOrdersDetailDialog } from "@/components/admin/admin-orders-detail-dialog";
import type { Booking } from "@/lib/types/booking-types";

export default function AdminOrdersPage() {
  const orders = useAdminOrders();
  const [selected, setSelected] = useState<Booking | null>(null);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Quản lý đơn hàng và thanh toán tour
        </p>
      </div>

      <AdminOrdersTable {...orders} onRowClick={setSelected} />

      {selected && (
        <AdminOrdersDetailDialog
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={orders.handleCancel}
          cancelling={orders.cancelling}
        />
      )}
    </div>
  );
}
