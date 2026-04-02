"use client";

import { useState, useEffect } from "react";
import {
  fetchAdminSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  type SlideRow,
} from "@/app/admin/_actions/slides-actions";

export function useAdminSlides() {
  const [slides, setSlides] = useState<SlideRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSlides().then((data) => {
      setSlides(data);
      setLoading(false);
    });
  }, []);

  const addSlide = async (data: unknown) => {
    const result = await createSlide(data);
    if (result.data) setSlides((prev) => [...prev, result.data!]);
    return result;
  };

  const editSlide = async (id: string, data: unknown) => {
    const result = await updateSlide(id, data);
    if (result.data) setSlides((prev) => prev.map((s) => (s.id === id ? result.data! : s)));
    return result;
  };

  const removeSlide = async (id: string) => {
    const result = await deleteSlide(id);
    if (!result.error) setSlides((prev) => prev.filter((s) => s.id !== id));
    return result;
  };

  return { slides, loading, addSlide, editSlide, removeSlide };
}
