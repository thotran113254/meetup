"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { VietnamStat, ToursPageContent } from "@/lib/types/tours-cms-types";

export type { VietnamStat, ToursPageContent };

type ToursState = {
  content: ToursPageContent;
  stats: VietnamStat[];
};

export const DEFAULT_CONTENT: ToursPageContent = {
  introTitle: "Introduce about Vietnam",
  introDescription: "",
};

const INITIAL: ToursState = {
  content: DEFAULT_CONTENT,
  stats: [],
};

export function useAdminTours() {
  const [state, setState] = useState<ToursState>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAdminSettings().then((rows) => {
      const m: Record<string, unknown> = {};
      for (const r of rows) m[r.key] = r.value;
      setState({
        content: (m.tours_page_content && typeof m.tours_page_content === "object" && !Array.isArray(m.tours_page_content))
          ? (m.tours_page_content as ToursPageContent) : DEFAULT_CONTENT,
        stats: Array.isArray(m.tours_page_stats) ? (m.tours_page_stats as VietnamStat[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveContent = useCallback(async (data: ToursPageContent) => {
    setSaving("content");
    await upsertSetting("tours_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSaving(null);
  }, []);

  const saveStats = useCallback(async (items: VietnamStat[]) => {
    setSaving("stats");
    await upsertSetting("tours_page_stats", items);
    setState((p) => ({ ...p, stats: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveContent, saveStats };
}
