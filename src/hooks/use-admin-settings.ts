"use client";

import { useState, useEffect } from "react";
import {
  fetchAdminSettings,
  upsertSetting,
  type SettingRow,
} from "@/app/admin/_actions/settings-actions";

export function useAdminSettings() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  /** Get setting value by key, with an optional fallback */
  const getValue = (key: string, fallback = "") => {
    const row = settings.find((s) => s.key === key);
    if (!row) return fallback;
    return typeof row.value === "string" ? row.value : String(row.value ?? fallback);
  };

  const saveSetting = async (key: string, value: unknown) => {
    const result = await upsertSetting(key, value);
    if (result.data) {
      setSettings((prev) => {
        const exists = prev.some((s) => s.key === key);
        return exists ? prev.map((s) => (s.key === key ? result.data! : s)) : [...prev, result.data!];
      });
    }
    return result;
  };

  return { settings, loading, getValue, saveSetting };
}
