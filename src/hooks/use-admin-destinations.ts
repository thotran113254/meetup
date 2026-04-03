"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { DestinationItem, DestinationsPageContent } from "@/lib/types/destinations-cms-types";

export type { DestinationItem, DestinationsPageContent };

type DestinationsState = {
  content: DestinationsPageContent;
  destinations: DestinationItem[];
};

export const DEFAULT_CONTENT: DestinationsPageContent = {
  introTitle: "Introduce about",
  introCity: "Hanoi",
  introDescription: "",
  gridTitle: "Where is your favorite place?",
};

const INITIAL: DestinationsState = {
  content: DEFAULT_CONTENT,
  destinations: [],
};

export function useAdminDestinations() {
  const [state, setState] = useState<DestinationsState>(INITIAL);
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
        content: (m.destinations_page_content && typeof m.destinations_page_content === "object" && !Array.isArray(m.destinations_page_content))
          ? (m.destinations_page_content as DestinationsPageContent) : DEFAULT_CONTENT,
        destinations: Array.isArray(m.destinations_list) ? (m.destinations_list as DestinationItem[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveContent = useCallback(async (data: DestinationsPageContent) => {
    setSaving("content");
    await upsertSetting("destinations_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSaving(null);
  }, []);

  const saveDestinations = useCallback(async (items: DestinationItem[]) => {
    setSaving("destinations");
    await upsertSetting("destinations_list", items);
    setState((p) => ({ ...p, destinations: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveContent, saveDestinations };
}
