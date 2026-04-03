"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import { DEFAULT_ABOUT, DEFAULT_NEWSLETTER, DEFAULT_ETICKETS } from "@/hooks/use-admin-homepage";
import type { AboutData, NewsletterData, EticketsData } from "@/lib/types/homepage-cms-types";

type SavingKey = "about" | "newsletter" | "etickets" | null;

/**
 * Hook for single-object homepage CMS sections: about, newsletter, etickets.
 * These sections store one config object (not an array of items).
 */
export function useAdminHomepageSingle() {
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [newsletter, setNewsletter] = useState<NewsletterData>(DEFAULT_NEWSLETTER);
  const [etickets, setEtickets] = useState<EticketsData>(DEFAULT_ETICKETS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SavingKey>(null);

  useEffect(() => {
    fetchAdminSettings().then((rows) => {
      const map: Record<string, unknown> = {};
      for (const s of rows) map[s.key] = s.value;

      if (map.homepage_about && typeof map.homepage_about === "object" && !Array.isArray(map.homepage_about)) {
        setAbout(map.homepage_about as AboutData);
      }
      if (map.homepage_newsletter && typeof map.homepage_newsletter === "object" && !Array.isArray(map.homepage_newsletter)) {
        setNewsletter(map.homepage_newsletter as NewsletterData);
      }
      if (map.homepage_etickets && typeof map.homepage_etickets === "object" && !Array.isArray(map.homepage_etickets)) {
        setEtickets(map.homepage_etickets as EticketsData);
      }
      setLoading(false);
    });
  }, []);

  const saveAbout = useCallback(async (data: AboutData) => {
    setSaving("about");
    await upsertSetting("homepage_about", data);
    setAbout(data);
    setSaving(null);
  }, []);

  const saveNewsletter = useCallback(async (data: NewsletterData) => {
    setSaving("newsletter");
    await upsertSetting("homepage_newsletter", data);
    setNewsletter(data);
    setSaving(null);
  }, []);

  const saveEtickets = useCallback(async (data: EticketsData) => {
    setSaving("etickets");
    await upsertSetting("homepage_etickets", data);
    setEtickets(data);
    setSaving(null);
  }, []);

  return { about, newsletter, etickets, loading, saving, saveAbout, saveNewsletter, saveEtickets };
}
