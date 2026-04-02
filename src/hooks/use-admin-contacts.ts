"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminContacts,
  toggleContactRead,
  deleteContact,
  type ContactRow,
  type PaginationMeta,
} from "@/app/admin/_actions/contacts-actions";

export function useAdminContacts(initialPage = 1, limit = 10) {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: initialPage, limit, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [readFilter, setReadFilter] = useState<boolean | undefined>();

  const load = useCallback(
    async (page: number, read?: boolean) => {
      setLoading(true);
      const result = await fetchAdminContacts(page, limit, read);
      setContacts(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [limit]
  );

  useEffect(() => {
    load(initialPage, readFilter);
  }, [load, initialPage, readFilter]);

  const setPage = (page: number) => load(page, readFilter);

  const filterByRead = (val?: boolean) => {
    setReadFilter(val);
    load(1, val);
  };

  const toggleRead = async (id: string) => {
    const result = await toggleContactRead(id);
    if (result.data) {
      setContacts((prev) => prev.map((c) => (c.id === id ? result.data! : c)));
    }
    return result;
  };

  const remove = async (id: string) => {
    const result = await deleteContact(id);
    if (!result.error) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
    }
    return result;
  };

  return { contacts, pagination, loading, readFilter, setPage, filterByRead, toggleRead, remove };
}
