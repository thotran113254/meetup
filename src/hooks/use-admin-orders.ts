"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchBookings,
  cancelBooking,
} from "@/app/admin/_actions/booking-actions";
import type { Booking } from "@/lib/types/booking-types";

export function useAdminOrders() {
  const [data, setData] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchBookings(page, limit, statusFilter);
    setData(result.data);
    setTotal(result.total);
    setStatusCounts(result.statusCounts);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (code: string) => {
    setCancelling(code);
    await cancelBooking(code);
    setCancelling(null);
    await load();
  };

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    totalPages,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    statusCounts,
    loading,
    cancelling,
    handleCancel,
    refresh: load,
  };
}
