"use client";

import { useState, useEffect } from "react";
import {
  fetchAdminNavigation,
  createNavItem,
  updateNavItem,
  deleteNavItem,
  type NavRow,
} from "@/app/admin/_actions/navigation-actions";

export function useAdminNavigation() {
  const [items, setItems] = useState<NavRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminNavigation().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const addItem = async (data: unknown) => {
    const result = await createNavItem(data);
    if (result.data) setItems((prev) => [...prev, result.data!]);
    return result;
  };

  const editItem = async (id: string, data: unknown) => {
    const result = await updateNavItem(id, data);
    if (result.data) setItems((prev) => prev.map((n) => (n.id === id ? result.data! : n)));
    return result;
  };

  const removeItem = async (id: string) => {
    const result = await deleteNavItem(id);
    if (!result.error) setItems((prev) => prev.filter((n) => n.id !== id));
    return result;
  };

  return { items, loading, addItem, editItem, removeItem };
}
