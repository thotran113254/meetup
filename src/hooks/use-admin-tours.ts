"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import { fetchAllTourPackagesAction } from "@/app/admin/_actions/tour-package-actions";
import type {
  VietnamStat,
  ToursPageContent,
  ToursHeroContent,
  TourFaqItem,
  MostLikedContent,
  TourPackageGridContent,
  TourPackage,
} from "@/lib/types/tours-cms-types";

export type { VietnamStat, ToursPageContent, ToursHeroContent, TourFaqItem, MostLikedContent, TourPackageGridContent, TourPackage };

type ToursState = {
  hero: ToursHeroContent;
  content: ToursPageContent;
  stats: VietnamStat[];
  faq: TourFaqItem[];
  mostLiked: MostLikedContent;
  packageGrid: TourPackageGridContent;
  availableTours: TourPackage[];
};

export const DEFAULT_HERO: ToursHeroContent = {
  heroImage: "/images/tours-hero-banner.jpg",
  marqueeText: "TOUR PACKAGES",
  breadcrumbLabel: "Tour Packages",
};

export const DEFAULT_CONTENT: ToursPageContent = {
  introTitle: "Introduce about Vietnam",
  introDescription: "",
};

export const DEFAULT_MOST_LIKED: MostLikedContent = {
  sectionTitle: "Most Liked Package",
  tourSlugs: [],
};

export const DEFAULT_PACKAGE_GRID: TourPackageGridContent = {
  sectionTitle: "Tour package",
  tourSlugs: [],
};

const TOURS_KEYS = [
  "tours_hero", "tours_page_content", "tours_page_stats", "tours_faq",
  "tours_most_liked", "tours_package_grid",
];

const INITIAL: ToursState = {
  hero: DEFAULT_HERO,
  content: DEFAULT_CONTENT,
  stats: [],
  faq: [],
  mostLiked: DEFAULT_MOST_LIKED,
  packageGrid: DEFAULT_PACKAGE_GRID,
  availableTours: [],
};

export function useAdminTours() {
  const [state, setState] = useState<ToursState>(INITIAL);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    Promise.all([fetchAdminSettings(), fetchAllTourPackagesAction()]).then(([rows, allTours]) => {
      const m: Record<string, unknown> = {};
      for (const r of rows) m[r.key] = r.value;
      setSavedKeys(new Set(rows.map((r) => r.key).filter((k) => TOURS_KEYS.includes(k))));
      setState({
        hero: (m.tours_hero && typeof m.tours_hero === "object" && !Array.isArray(m.tours_hero))
          ? (m.tours_hero as ToursHeroContent) : DEFAULT_HERO,
        content: (m.tours_page_content && typeof m.tours_page_content === "object" && !Array.isArray(m.tours_page_content))
          ? (m.tours_page_content as ToursPageContent) : DEFAULT_CONTENT,
        stats: Array.isArray(m.tours_page_stats) ? (m.tours_page_stats as VietnamStat[]) : [],
        faq: Array.isArray(m.tours_faq) ? (m.tours_faq as TourFaqItem[]) : [],
        // Validate shape — old DB data may have `tours[]` instead of `tourSlugs[]`
        mostLiked: (m.tours_most_liked && typeof m.tours_most_liked === "object" && !Array.isArray(m.tours_most_liked)
          && Array.isArray((m.tours_most_liked as MostLikedContent).tourSlugs))
          ? (m.tours_most_liked as MostLikedContent) : DEFAULT_MOST_LIKED,
        packageGrid: (m.tours_package_grid && typeof m.tours_package_grid === "object" && !Array.isArray(m.tours_package_grid)
          && Array.isArray((m.tours_package_grid as TourPackageGridContent).tourSlugs))
          ? (m.tours_package_grid as TourPackageGridContent) : DEFAULT_PACKAGE_GRID,
        availableTours: allTours,
      });
      setLoading(false);
    });
  }, []);

  const saveHero = useCallback(async (data: ToursHeroContent) => {
    setSaving("hero");
    await upsertSetting("tours_hero", data);
    setState((p) => ({ ...p, hero: data }));
    setSavedKeys((p) => new Set([...p, "tours_hero"]));
    setSaving(null);
  }, []);

  const saveContent = useCallback(async (data: ToursPageContent) => {
    setSaving("content");
    await upsertSetting("tours_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSavedKeys((p) => new Set([...p, "tours_page_content"]));
    setSaving(null);
  }, []);

  const saveStats = useCallback(async (items: VietnamStat[]) => {
    setSaving("stats");
    await upsertSetting("tours_page_stats", items);
    setState((p) => ({ ...p, stats: items }));
    setSavedKeys((p) => new Set([...p, "tours_page_stats"]));
    setSaving(null);
  }, []);

  const saveFaq = useCallback(async (items: TourFaqItem[]) => {
    setSaving("faq");
    await upsertSetting("tours_faq", items);
    setState((p) => ({ ...p, faq: items }));
    setSavedKeys((p) => new Set([...p, "tours_faq"]));
    setSaving(null);
  }, []);

  const saveMostLiked = useCallback(async (data: MostLikedContent) => {
    setSaving("mostLiked");
    await upsertSetting("tours_most_liked", data);
    setState((p) => ({ ...p, mostLiked: data }));
    setSavedKeys((p) => new Set([...p, "tours_most_liked"]));
    setSaving(null);
  }, []);

  const savePackageGrid = useCallback(async (data: TourPackageGridContent) => {
    setSaving("packageGrid");
    await upsertSetting("tours_package_grid", data);
    setState((p) => ({ ...p, packageGrid: data }));
    setSavedKeys((p) => new Set([...p, "tours_package_grid"]));
    setSaving(null);
  }, []);

  const isSaved = useCallback((key: string) => savedKeys.has(key), [savedKeys]);

  return { ...state, loading, saving, isSaved, saveHero, saveContent, saveStats, saveFaq, saveMostLiked, savePackageGrid };
}
