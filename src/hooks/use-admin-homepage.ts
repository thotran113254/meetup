"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { TourCardProps } from "@/components/ui/tour-card";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

export type { TourCardProps, ServiceItem, ReviewItem, VideoItem };

type HomepageData = {
  tours: TourCardProps[];
  services: ServiceItem[];
  reviews: ReviewItem[];
  videos: VideoItem[];
};

const SETTING_KEYS = {
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
} as const;

export type SectionKey = keyof typeof SETTING_KEYS;

/**
 * Hook for managing all homepage CMS sections stored as JSON in siteSettings.
 * Uses the existing server-action infrastructure (no extra API routes needed).
 */
export function useAdminHomepage() {
  const [data, setData] = useState<HomepageData>({ tours: [], services: [], reviews: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionKey | null>(null);

  useEffect(() => {
    fetchAdminSettings().then((rows) => {
      const map: Record<string, unknown> = {};
      for (const s of rows) map[s.key] = s.value;
      setData({
        tours: Array.isArray(map.homepage_tours) ? (map.homepage_tours as TourCardProps[]) : [],
        services: Array.isArray(map.homepage_services) ? (map.homepage_services as ServiceItem[]) : [],
        reviews: Array.isArray(map.homepage_reviews) ? (map.homepage_reviews as ReviewItem[]) : [],
        videos: Array.isArray(map.homepage_videos) ? (map.homepage_videos as VideoItem[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveSection = useCallback(async (section: SectionKey, items: unknown[]) => {
    setSaving(section);
    await upsertSetting(SETTING_KEYS[section], items);
    setData((prev) => ({ ...prev, [section]: items }));
    setSaving(null);
  }, []);

  // Generic helpers — each item must have a numeric `id` field for keying
  const addItem = useCallback(async (section: SectionKey, item: Record<string, unknown>) => {
    const list = data[section] as Array<Record<string, unknown>>;
    const maxId = list.reduce((m, x) => Math.max(m, (x.id as number) ?? 0), 0);
    await saveSection(section, [...list, { ...item, id: maxId + 1 }]);
  }, [data, saveSection]);

  const editItem = useCallback(async (section: SectionKey, item: Record<string, unknown>) => {
    const list = data[section] as Array<Record<string, unknown>>;
    await saveSection(section, list.map((x) => (x.id === item.id ? item : x)));
  }, [data, saveSection]);

  const removeItem = useCallback(async (section: SectionKey, id: number) => {
    const list = data[section] as Array<Record<string, unknown>>;
    await saveSection(section, list.filter((x) => x.id !== id));
  }, [data, saveSection]);

  return { data, loading, saving, addItem, editItem, removeItem };
}
