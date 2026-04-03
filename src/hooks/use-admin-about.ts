"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { AboutTeamMember, AboutCoreValue, AboutPageContent } from "@/lib/types/about-cms-types";

export type { AboutTeamMember, AboutCoreValue, AboutPageContent };

type AboutState = {
  content: AboutPageContent;
  team: AboutTeamMember[];
  values: AboutCoreValue[];
};

export const DEFAULT_CONTENT: AboutPageContent = {
  heroTitle: "Chung toi la YourBrand",
  heroDescription: "Thanh lap nam 2018, YourBrand la cong ty thiet ke va phat trien website chuyen nghiep voi doi ngu hon 15 chuyen gia. Chung toi da giup hon 500 doanh nghiep tu khap noi tren the gioi xay dung su hien dien truc tuyen manh me.",
  mission: "Su menh cua chung toi la giup moi doanh nghiep Viet Nam co the canh tranh binh dang tren san choi quoc te thong qua cong nghe va thiet ke dang cap.",
  valuesHeading: "Gia tri cot loi",
  teamHeading: "Doi ngu cua chung toi",
  ctaTitle: "Hay cung nhau xay dung dieu gi tuyet voi",
  ctaDescription: "Chung toi luon san sang lang nghe va dong hanh cung ban tren hanh trinh so hoa.",
};

const INITIAL: AboutState = {
  content: DEFAULT_CONTENT,
  team: [],
  values: [],
};

export function useAdminAbout() {
  const [state, setState] = useState<AboutState>(INITIAL);
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
        content: (m.about_page_content && typeof m.about_page_content === "object" && !Array.isArray(m.about_page_content))
          ? (m.about_page_content as AboutPageContent) : DEFAULT_CONTENT,
        team: Array.isArray(m.about_page_team) ? (m.about_page_team as AboutTeamMember[]) : [],
        values: Array.isArray(m.about_page_values) ? (m.about_page_values as AboutCoreValue[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveContent = useCallback(async (data: AboutPageContent) => {
    setSaving("content");
    await upsertSetting("about_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSaving(null);
  }, []);

  const saveTeam = useCallback(async (items: AboutTeamMember[]) => {
    setSaving("team");
    await upsertSetting("about_page_team", items);
    setState((p) => ({ ...p, team: items }));
    setSaving(null);
  }, []);

  const saveValues = useCallback(async (items: AboutCoreValue[]) => {
    setSaving("values");
    await upsertSetting("about_page_values", items);
    setState((p) => ({ ...p, values: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveContent, saveTeam, saveValues };
}
