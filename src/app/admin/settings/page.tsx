"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { useAdminSettings } from "@/hooks/use-admin-settings";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";

type SettingsFormData = {
  siteName: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  seoTitle: string;
  seoDescription: string;
};

const SETTING_KEYS: Record<keyof SettingsFormData, string> = {
  siteName: "site_name",
  description: "site_description",
  email: "contact_email",
  phone: "contact_phone",
  address: "address",
  facebook: "facebook_url",
  instagram: "instagram_url",
  tiktok: "tiktok_url",
  youtube: "youtube_url",
  whatsapp: "whatsapp_url",
  seoTitle: "seo_default_title",
  seoDescription: "seo_default_description",
};

export default function AdminSettingsPage() {
  const { loading, getValue, saveSetting } = useAdminSettings();
  const initialized = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>({
    defaultValues: {
      siteName: siteConfig.name,
      description: siteConfig.description,
      email: siteConfig.email,
      phone: siteConfig.phone,
      address: "",
      facebook: siteConfig.socials.facebook,
      instagram: siteConfig.socials.instagram,
      tiktok: siteConfig.socials.tiktok,
      youtube: siteConfig.socials.youtube,
      whatsapp: siteConfig.socials.whatsapp,
      seoTitle: siteConfig.seo.defaultTitle,
      seoDescription: siteConfig.description,
    },
  });

  // Pre-fill from DB exactly once after initial load completes
  useEffect(() => {
    if (!loading && !initialized.current) {
      initialized.current = true;
      reset({
        siteName: getValue("site_name", siteConfig.name),
        description: getValue("site_description", siteConfig.description),
        email: getValue("contact_email", siteConfig.email),
        phone: getValue("contact_phone", siteConfig.phone),
        address: getValue("address"),
        facebook: getValue("facebook_url", siteConfig.socials.facebook),
        instagram: getValue("instagram_url", siteConfig.socials.instagram),
        tiktok: getValue("tiktok_url", siteConfig.socials.tiktok),
        youtube: getValue("youtube_url", siteConfig.socials.youtube),
        whatsapp: getValue("whatsapp_url", siteConfig.socials.whatsapp),
        seoTitle: getValue("seo_default_title", siteConfig.seo.defaultTitle),
        seoDescription: getValue("seo_default_description", siteConfig.description),
      });
    }
  }, [loading, getValue, reset]);

  async function onSubmit(data: SettingsFormData) {
    const entries = Object.entries(data) as [keyof SettingsFormData, string][];
    await Promise.all(entries.map(([field, value]) => saveSetting(SETTING_KEYS[field], value)));
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Quản lý thông tin và cấu hình trang web
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-[var(--color-muted-foreground)]">Đang tải...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          {/* Site Info */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
              Thông tin website
            </h2>
            <FormField label="Tên website" htmlFor="siteName" required>
              <input id="siteName" className={inputStyles} {...register("siteName")} />
            </FormField>
            <FormField label="Mô tả" htmlFor="description" required>
              <textarea id="description" rows={3} className={cn(inputStyles, "resize-none")} {...register("description")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Email liên hệ" htmlFor="email" required>
                <input id="email" type="email" className={inputStyles} {...register("email")} />
              </FormField>
              <FormField label="Số điện thoại" htmlFor="phone">
                <input id="phone" className={inputStyles} {...register("phone")} />
              </FormField>
            </div>
            <FormField label="Địa chỉ" htmlFor="address">
              <input id="address" className={inputStyles} placeholder="Số nhà, đường, quận/huyện, thành phố" {...register("address")} />
            </FormField>
          </section>

          {/* Social Links */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
              Mạng xã hội
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Facebook" htmlFor="facebook">
                <input id="facebook" className={inputStyles} placeholder="https://facebook.com/..." {...register("facebook")} />
              </FormField>
              <FormField label="Instagram" htmlFor="instagram">
                <input id="instagram" className={inputStyles} placeholder="https://instagram.com/..." {...register("instagram")} />
              </FormField>
              <FormField label="TikTok" htmlFor="tiktok">
                <input id="tiktok" className={inputStyles} placeholder="https://tiktok.com/..." {...register("tiktok")} />
              </FormField>
              <FormField label="YouTube" htmlFor="youtube">
                <input id="youtube" className={inputStyles} placeholder="https://youtube.com/..." {...register("youtube")} />
              </FormField>
            </div>
            <FormField label="WhatsApp" htmlFor="whatsapp">
              <input id="whatsapp" className={inputStyles} placeholder="https://wa.me/..." {...register("whatsapp")} />
            </FormField>
          </section>

          {/* SEO Defaults */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
              Mặc định SEO
            </h2>
            <FormField label="SEO Title mặc định" htmlFor="seoTitle">
              <input id="seoTitle" className={inputStyles} {...register("seoTitle")} />
            </FormField>
            <FormField label="SEO Description mặc định" htmlFor="seoDescription">
              <textarea id="seoDescription" rows={3} className={cn(inputStyles, "resize-none")} {...register("seoDescription")} />
            </FormField>
          </section>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
