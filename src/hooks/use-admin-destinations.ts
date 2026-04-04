"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type {
  DestinationItem,
  DestinationsPageContent,
  DestinationsHeroContent,
  DestinationFeatureItem,
} from "@/lib/types/destinations-cms-types";

export type { DestinationItem, DestinationsPageContent, DestinationsHeroContent, DestinationFeatureItem };

type DestinationsState = {
  hero: DestinationsHeroContent;
  content: DestinationsPageContent;
  destinations: DestinationItem[];
  features: DestinationFeatureItem[];
};

export const DEFAULT_HERO: DestinationsHeroContent = {
  heroImage: "/images/destinations/hero-banner.png",
  marqueeText: "DESTINATION",
  breadcrumbLabel: "Destination",
};

export const DEFAULT_CONTENT: DestinationsPageContent = {
  introTitle: "Introduce about",
  introCity: "Hanoi",
  introDescription: "",
  gridTitle: "Where is your favorite place?",
};

const INITIAL: DestinationsState = {
  hero: DEFAULT_HERO,
  content: DEFAULT_CONTENT,
  destinations: [],
  features: [],
};

export function useAdminDestinations() {
  const [state, setState] = useState<DestinationsState>(INITIAL);
  // Track which keys actually exist in DB (vs using local defaults)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAdminSettings().then((rows) => {
      const m: Record<string, unknown> = {};
      for (const r of rows) m[r.key] = r.value;
      // Record which destination keys are saved in DB
      setSavedKeys(new Set(rows.map((r) => r.key).filter((k) => k.startsWith("destinations"))));
      setState({
        hero: (m.destinations_hero && typeof m.destinations_hero === "object" && !Array.isArray(m.destinations_hero))
          ? (m.destinations_hero as DestinationsHeroContent) : DEFAULT_HERO,
        content: (m.destinations_page_content && typeof m.destinations_page_content === "object" && !Array.isArray(m.destinations_page_content))
          ? (m.destinations_page_content as DestinationsPageContent) : DEFAULT_CONTENT,
        destinations: Array.isArray(m.destinations_list) ? (m.destinations_list as DestinationItem[]) : [],
        features: Array.isArray(m.destinations_features) ? (m.destinations_features as DestinationFeatureItem[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveHero = useCallback(async (data: DestinationsHeroContent) => {
    setSaving("hero");
    await upsertSetting("destinations_hero", data);
    setState((p) => ({ ...p, hero: data }));
    setSavedKeys((p) => new Set([...p, "destinations_hero"]));
    setSaving(null);
  }, []);

  const saveContent = useCallback(async (data: DestinationsPageContent) => {
    setSaving("content");
    await upsertSetting("destinations_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSavedKeys((p) => new Set([...p, "destinations_page_content"]));
    setSaving(null);
  }, []);

  const saveDestinations = useCallback(async (items: DestinationItem[]) => {
    setSaving("destinations");
    await upsertSetting("destinations_list", items);
    setState((p) => ({ ...p, destinations: items }));
    setSavedKeys((p) => new Set([...p, "destinations_list"]));
    setSaving(null);
  }, []);

  const saveFeatures = useCallback(async (items: DestinationFeatureItem[]) => {
    setSaving("features");
    await upsertSetting("destinations_features", items);
    setState((p) => ({ ...p, features: items }));
    setSavedKeys((p) => new Set([...p, "destinations_features"]));
    setSaving(null);
  }, []);

  /** Check if a CMS key has been explicitly saved to DB (vs showing fallback) */
  const isSaved = useCallback((key: string) => savedKeys.has(key), [savedKeys]);

  return { ...state, loading, saving, isSaved, saveHero, saveContent, saveDestinations, saveFeatures };
}
