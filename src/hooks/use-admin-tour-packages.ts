"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAllTourPackagesAction,
  createTourPackageAction,
  updateTourPackageAction,
  deleteTourPackageAction,
} from "@/app/admin/_actions/tour-package-actions";
import type { TourPackage, TourPackageInput } from "@/lib/types/tours-cms-types";

/** Hook for managing tour packages CRUD on the admin tours-list page. */
export function useAdminTourPackages() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAllTourPackagesAction().then((data) => {
      setTours(data);
      setLoading(false);
    });
  }, []);

  const addTour = useCallback(async (data: TourPackageInput) => {
    setSaving(true);
    const result = await createTourPackageAction(data);
    if (result.data) setTours((prev) => [...prev, result.data!]);
    setSaving(false);
    return result;
  }, []);

  const editTour = useCallback(async (slug: string, data: Partial<TourPackageInput>) => {
    setSaving(true);
    const result = await updateTourPackageAction(slug, data);
    if (result.data) {
      setTours((prev) => prev.map((t) => (t.slug === slug ? result.data! : t)));
    }
    setSaving(false);
    return result;
  }, []);

  const removeTour = useCallback(async (slug: string) => {
    setDeleting(true);
    const result = await deleteTourPackageAction(slug);
    if (!result.error) setTours((prev) => prev.filter((t) => t.slug !== slug));
    setDeleting(false);
    return result;
  }, []);

  return { tours, loading, saving, deleting, addTour, editTour, removeTour };
}
