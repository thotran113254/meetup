"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAdminSettings, upsertSetting } from "@/app/admin/_actions/settings-actions";
import type { RecruitmentJob, RecruitmentPageContent } from "@/lib/types/recruitment-cms-types";

export type { RecruitmentJob, RecruitmentPageContent };

type RecruitmentState = {
  content: RecruitmentPageContent;
  jobs: RecruitmentJob[];
};

export const DEFAULT_CONTENT: RecruitmentPageContent = {
  heading: "Current openings",
  subheading: "Thanks for checking out our job openings. See something that interests you? Apply here.",
  connectTitle: "Connect with us",
  connectDescription: "Follow us on social media to stay up to date with the latest travel inspiration, job openings, and behind-the-scenes stories from our team.",
  joinTitle: "Join our Team",
  joinDescription: "Ready to turn your passion for travel into a career? Send your CV to our team and let us know why you would be a great fit.",
};

const INITIAL: RecruitmentState = {
  content: DEFAULT_CONTENT,
  jobs: [],
};

export function useAdminRecruitment() {
  const [state, setState] = useState<RecruitmentState>(INITIAL);
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
        content: (m.recruitment_page_content && typeof m.recruitment_page_content === "object" && !Array.isArray(m.recruitment_page_content))
          ? (m.recruitment_page_content as RecruitmentPageContent) : DEFAULT_CONTENT,
        jobs: Array.isArray(m.recruitment_jobs) ? (m.recruitment_jobs as RecruitmentJob[]) : [],
      });
      setLoading(false);
    });
  }, []);

  const saveContent = useCallback(async (data: RecruitmentPageContent) => {
    setSaving("content");
    await upsertSetting("recruitment_page_content", data);
    setState((p) => ({ ...p, content: data }));
    setSaving(null);
  }, []);

  const saveJobs = useCallback(async (items: RecruitmentJob[]) => {
    setSaving("jobs");
    await upsertSetting("recruitment_jobs", items);
    setState((p) => ({ ...p, jobs: items }));
    setSaving(null);
  }, []);

  return { ...state, loading, saving, saveContent, saveJobs };
}
