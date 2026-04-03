"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { ContactFaqCategory, ContactPageInfo } from "@/lib/types/contact-cms-types";

export type { ContactFaqCategory, ContactPageInfo };

type ContactState = {
  info: ContactPageInfo;
  faq: ContactFaqCategory[];
};

export const DEFAULT_INFO: ContactPageInfo = {
  timezone: "Asia/Saigon, GMT+7",
  operatingHours: "Mon-Sun: 06:00 AM - 12:00 AM",
  infoTitle: "Got questions\nabout your trip?",
};

const INITIAL: ContactState = {
  info: DEFAULT_INFO,
  faq: [],
};

export function useAdminContact() {
  const [state, setState] = useState<ContactState>(INITIAL);
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
        info: (m.contact_page_info && typeof m.contact_page_info === "object" && !Array.isArray(m.contact_page_info))
          ? (m.contact_page_info as ContactPageInfo) : DEFAULT_INFO,
        faq: Array.isArray(m.contact_page_faq) ? (m.contact_page_faq as ContactFaqCategory[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveInfo = useCallback(async (data: ContactPageInfo) => {
    setSaving("info");
    await upsertSetting("contact_page_info", data);
    setState((p) => ({ ...p, info: data }));
    setSaving(null);
  }, []);

  const saveFaq = useCallback(async (items: ContactFaqCategory[]) => {
    setSaving("faq");
    await upsertSetting("contact_page_faq", items);
    setState((p) => ({ ...p, faq: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveInfo, saveFaq };
}
