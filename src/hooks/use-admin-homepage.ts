"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import { DEFAULT_SECTIONS_CONFIG } from "@/lib/constants/homepage-section-defaults";
import type { SectionConfig, ExperienceData, AboutData, NewsletterData, EticketsData } from "@/lib/types/homepage-cms-types";
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
  experience: ExperienceData;
};

const SETTING_KEYS = {
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
  experience: "homepage_experience",
} as const;

export type SectionKey = keyof typeof SETTING_KEYS;

const DEFAULT_DATA: HomepageData = {
  tours: [], services: [], reviews: [], videos: [],
  experience: {},
};

/**
 * Hook for managing array-based homepage CMS sections.
 * Single-object sections (about, newsletter, etickets, config) use separate hooks.
 */
export function useAdminHomepage() {
  const [data, setData] = useState<HomepageData>(DEFAULT_DATA);
  const [config, setConfig] = useState<SectionConfig[]>(DEFAULT_SECTIONS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionKey | "config" | null>(null);

  useEffect(() => {
    fetchAdminSettings().then((rows) => {
      const map: Record<string, unknown> = {};
      for (const s of rows) map[s.key] = s.value;
      setData({
        tours: Array.isArray(map.homepage_tours) ? (map.homepage_tours as TourCardProps[]) : [],
        services: Array.isArray(map.homepage_services) ? (map.homepage_services as ServiceItem[]) : [],
        reviews: Array.isArray(map.homepage_reviews) ? (map.homepage_reviews as ReviewItem[]) : [],
        videos: Array.isArray(map.homepage_videos) ? (map.homepage_videos as VideoItem[]) : [],
        experience: (map.homepage_experience && typeof map.homepage_experience === "object" && !Array.isArray(map.homepage_experience))
          ? (map.homepage_experience as ExperienceData) : {},
      });
      const rawConfig = map.homepage_sections_config;
      setConfig(Array.isArray(rawConfig) ? (rawConfig as SectionConfig[]) : DEFAULT_SECTIONS_CONFIG);
      setLoading(false);
    });
  }, []);

  const saveSection = useCallback(async (section: SectionKey, items: unknown[]) => {
    setSaving(section);
    await upsertSetting(SETTING_KEYS[section], items);
    setData((prev) => ({ ...prev, [section]: items }));
    setSaving(null);
  }, []);

  const saveExperience = useCallback(async (expData: ExperienceData) => {
    setSaving("experience");
    await upsertSetting(SETTING_KEYS.experience, expData);
    setData((prev) => ({ ...prev, experience: expData }));
    setSaving(null);
  }, []);

  const updateConfig = useCallback(async (newConfig: SectionConfig[]) => {
    setSaving("config");
    await upsertSetting("homepage_sections_config", newConfig);
    setConfig(newConfig);
    setSaving(null);
  }, []);

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

  return { data, config, loading, saving, addItem, editItem, removeItem, saveExperience, updateConfig };
}

/** Default values for single-object sections */
export const DEFAULT_ABOUT: AboutData = {
  title: "", quote: "", mobilePhotos: [],
  desktopImage: "", teamImage: "", dragonImage: "", templeImage: "", cloudImage: "",
};
export const DEFAULT_NEWSLETTER: NewsletterData = { title: "", description: "" };
export const DEFAULT_ETICKETS: EticketsData = { title: "", cities: [], passengers: [] };
