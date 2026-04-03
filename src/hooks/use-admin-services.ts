"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { ServiceCard, ServiceFeature, ServicesPageContent } from "@/lib/types/services-cms-types";

export type { ServiceCard, ServiceFeature, ServicesPageContent };

type ServicesState = {
  content: ServicesPageContent;
  cards: ServiceCard[];
  features: ServiceFeature[];
};

export const DEFAULT_CONTENT: ServicesPageContent = {
  gridTitle: "Introduce About Travel Services",
  gridDescription: "Meetup Travel offers a comprehensive range of services to enhance your journey in Vietnam",
  featuresTitle: "Why Choose Us",
};

const INITIAL: ServicesState = {
  content: DEFAULT_CONTENT,
  cards: [],
  features: [],
};

export function useAdminServices() {
  const [state, setState] = useState<ServicesState>(INITIAL);
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
        content: (m.services_page_content && typeof m.services_page_content === "object" && !Array.isArray(m.services_page_content))
          ? (m.services_page_content as ServicesPageContent) : DEFAULT_CONTENT,
        cards: Array.isArray(m.services_page_cards) ? (m.services_page_cards as ServiceCard[]) : [],
        features: Array.isArray(m.services_page_features) ? (m.services_page_features as ServiceFeature[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveContent = useCallback(async (data: ServicesPageContent) => {
    setSaving("content");
    await upsertSetting("services_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSaving(null);
  }, []);

  const saveCards = useCallback(async (items: ServiceCard[]) => {
    setSaving("cards");
    await upsertSetting("services_page_cards", items);
    setState((p) => ({ ...p, cards: items }));
    setSaving(null);
  }, []);

  const saveFeatures = useCallback(async (items: ServiceFeature[]) => {
    setSaving("features");
    await upsertSetting("services_page_features", items);
    setState((p) => ({ ...p, features: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveContent, saveCards, saveFeatures };
}
