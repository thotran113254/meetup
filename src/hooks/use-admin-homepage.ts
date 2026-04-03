"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import { DEFAULT_SECTIONS_CONFIG } from "@/lib/constants/homepage-section-defaults";
import type {
  SectionConfig, ExperienceData, AboutData, NewsletterData, EticketsData,
} from "@/lib/types/homepage-cms-types";
import type { TourCardProps } from "@/components/ui/tour-card";
import type { ServiceItem } from "@/components/sections/homepage/services-carousel";
import type { ReviewItem } from "@/components/sections/homepage/reviews-carousel";
import type { VideoItem } from "@/components/sections/homepage/youtube-grid";

export type { TourCardProps, ServiceItem, ReviewItem, VideoItem };

/** Array-based section data */
type ArrayData = {
  tours: TourCardProps[];
  services: ServiceItem[];
  reviews: ReviewItem[];
  videos: VideoItem[];
};

/** All homepage CMS data loaded in a single fetch */
type HomepageState = {
  arrays: ArrayData;
  experience: ExperienceData;
  config: SectionConfig[];
  about: AboutData;
  newsletter: NewsletterData;
  etickets: EticketsData;
};

const ARRAY_KEYS = {
  tours: "homepage_tours",
  services: "homepage_services",
  reviews: "homepage_reviews",
  videos: "homepage_videos",
} as const;

export type SectionKey = keyof typeof ARRAY_KEYS;

/** Default values for single-object sections */
export const DEFAULT_ABOUT: AboutData = {
  title: "", quote: "", mobilePhotos: [],
  desktopImage: "", teamImage: "", dragonImage: "", templeImage: "", cloudImage: "",
};
export const DEFAULT_NEWSLETTER: NewsletterData = { title: "", description: "" };
export const DEFAULT_ETICKETS: EticketsData = { title: "", cities: [], passengers: [] };

const INITIAL: HomepageState = {
  arrays: { tours: [], services: [], reviews: [], videos: [] },
  experience: {},
  config: DEFAULT_SECTIONS_CONFIG,
  about: DEFAULT_ABOUT,
  newsletter: DEFAULT_NEWSLETTER,
  etickets: DEFAULT_ETICKETS,
};

/**
 * Single hook for ALL homepage CMS data — one fetch, one state tree.
 * Eliminates duplicate fetchAdminSettings calls.
 */
export function useAdminHomepage() {
  const [state, setState] = useState<HomepageState>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  /* Single fetch on mount — parse ALL homepage keys once */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAdminSettings().then((rows) => {
      const m: Record<string, unknown> = {};
      for (const r of rows) m[r.key] = r.value;
      setState({
        arrays: {
          tours: Array.isArray(m.homepage_tours) ? (m.homepage_tours as TourCardProps[]) : [],
          services: Array.isArray(m.homepage_services) ? (m.homepage_services as ServiceItem[]) : [],
          reviews: Array.isArray(m.homepage_reviews) ? (m.homepage_reviews as ReviewItem[]) : [],
          videos: Array.isArray(m.homepage_videos) ? (m.homepage_videos as VideoItem[]) : [],
        },
        experience: (m.homepage_experience && typeof m.homepage_experience === "object" && !Array.isArray(m.homepage_experience))
          ? (m.homepage_experience as ExperienceData) : {},
        config: Array.isArray(m.homepage_sections_config) ? (m.homepage_sections_config as SectionConfig[]) : DEFAULT_SECTIONS_CONFIG,
        about: (m.homepage_about && typeof m.homepage_about === "object") ? (m.homepage_about as AboutData) : DEFAULT_ABOUT,
        newsletter: (m.homepage_newsletter && typeof m.homepage_newsletter === "object") ? (m.homepage_newsletter as NewsletterData) : DEFAULT_NEWSLETTER,
        etickets: (m.homepage_etickets && typeof m.homepage_etickets === "object") ? (m.homepage_etickets as EticketsData) : DEFAULT_ETICKETS,
      });
      setLoading(false);
    });
  }, []);

  /* ── Array sections CRUD ── */
  const saveArraySection = useCallback(async (section: SectionKey, items: unknown[]) => {
    setSaving(section);
    await upsertSetting(ARRAY_KEYS[section], items);
    setState((p) => ({ ...p, arrays: { ...p.arrays, [section]: items } }));
    setSaving(null);
  }, []);

  const addItem = useCallback(async (section: SectionKey, item: Record<string, unknown>) => {
    setState((prev) => {
      const list = prev.arrays[section] as Array<Record<string, unknown>>;
      const maxId = list.reduce((m, x) => Math.max(m, (x.id as number) ?? 0), 0);
      const updated = [...list, { ...item, id: maxId + 1 }];
      // Trigger save outside setState
      queueMicrotask(() => saveArraySection(section, updated));
      return { ...prev, arrays: { ...prev.arrays, [section]: updated } };
    });
  }, [saveArraySection]);

  const editItem = useCallback(async (section: SectionKey, item: Record<string, unknown>) => {
    setState((prev) => {
      const list = prev.arrays[section] as Array<Record<string, unknown>>;
      const updated = list.map((x) => (x.id === item.id ? item : x));
      queueMicrotask(() => saveArraySection(section, updated));
      return { ...prev, arrays: { ...prev.arrays, [section]: updated } };
    });
  }, [saveArraySection]);

  const removeItem = useCallback(async (section: SectionKey, id: number) => {
    setState((prev) => {
      const list = prev.arrays[section] as Array<Record<string, unknown>>;
      const updated = list.filter((x) => x.id !== id);
      queueMicrotask(() => saveArraySection(section, updated));
      return { ...prev, arrays: { ...prev.arrays, [section]: updated } };
    });
  }, [saveArraySection]);

  /* ── Experience section ── */
  const saveExperience = useCallback(async (expData: ExperienceData) => {
    setSaving("experience");
    await upsertSetting("homepage_experience", expData);
    setState((p) => ({ ...p, experience: expData }));
    setSaving(null);
  }, []);

  /* ── Section config ── */
  const updateConfig = useCallback(async (newConfig: SectionConfig[]) => {
    setSaving("config");
    await upsertSetting("homepage_sections_config", newConfig);
    setState((p) => ({ ...p, config: newConfig }));
    setSaving(null);
  }, []);

  /* ── Single-object sections (about, newsletter, etickets) ── */
  const saveAbout = useCallback(async (data: AboutData) => {
    setSaving("about");
    await upsertSetting("homepage_about", data);
    setState((p) => ({ ...p, about: data }));
    setSaving(null);
  }, []);

  const saveNewsletter = useCallback(async (data: NewsletterData) => {
    setSaving("newsletter");
    await upsertSetting("homepage_newsletter", data);
    setState((p) => ({ ...p, newsletter: data }));
    setSaving(null);
  }, []);

  const saveEtickets = useCallback(async (data: EticketsData) => {
    setSaving("etickets");
    await upsertSetting("homepage_etickets", data);
    setState((p) => ({ ...p, etickets: data }));
    setSaving(null);
  }, []);

  return {
    /* Array sections (tours/services/reviews/videos) */
    data: state.arrays,
    addItem, editItem, removeItem,
    /* Experience */
    experience: state.experience, saveExperience,
    /* Section config */
    config: state.config, updateConfig,
    /* Single sections */
    about: state.about, saveAbout,
    newsletter: state.newsletter, saveNewsletter,
    etickets: state.etickets, saveEtickets,
    /* Status */
    loading, saving,
  };
}
