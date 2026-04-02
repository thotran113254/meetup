"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminMedia,
  createMedia,
  deleteMedia,
  type MediaRow,
  type PaginationMeta,
} from "@/app/admin/_actions/media-actions";

export function useAdminMedia(initialPage = 1, limit = 20) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: initialPage, limit, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  const load = useCallback(
    async (page: number, type?: string) => {
      setLoading(true);
      const result = await fetchAdminMedia(page, limit, type);
      setItems(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [limit]
  );

  useEffect(() => {
    load(initialPage, typeFilter);
  }, [load, initialPage, typeFilter]);

  const setPage = (page: number) => load(page, typeFilter);

  const filterByType = (type?: string) => {
    setTypeFilter(type);
    load(1, type);
  };

  const addMedia = async (data: unknown) => {
    const result = await createMedia(data);
    if (result.data) {
      setItems((prev) => [result.data!, ...prev]);
      setPagination((p) => ({ ...p, total: p.total + 1 }));
    }
    return result;
  };

  const removeMedia = async (id: string) => {
    const result = await deleteMedia(id);
    if (!result.error) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
    }
    return result;
  };

  return { items, pagination, loading, typeFilter, setPage, filterByType, addMedia, removeMedia };
}
