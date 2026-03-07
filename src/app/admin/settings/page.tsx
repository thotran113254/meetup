"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, inputStyles } from "@/components/ui/form-field";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";

type SettingsFormData = {
  siteName: string;
  description: string;
  email: string;
  phone: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  seoTitle: string;
  seoDescription: string;
};

// TODO: Pre-fill from siteSettings DB table (key-value store) and save on submit via server action
export default function AdminSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>({
    defaultValues: {
      siteName: siteConfig.name,
      description: siteConfig.description,
      email: siteConfig.email,
      phone: siteConfig.phone,
      twitter: siteConfig.socials.twitter,
      facebook: siteConfig.socials.facebook,
      linkedin: siteConfig.socials.linkedin,
      seoTitle: siteConfig.seo.defaultTitle,
      seoDescription: siteConfig.description,
    },
  });

  // TODO: Wire to server action that writes to siteSettings DB table
  async function onSubmit(data: SettingsFormData) {
    console.log("Save settings:", data);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Cai dat</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          Quan ly thong tin va cau hinh trang web
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Site Info */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
            Thong tin website
          </h2>
          <FormField label="Ten website" htmlFor="siteName" required>
            <input id="siteName" className={inputStyles} {...register("siteName")} />
          </FormField>
          <FormField label="Mo ta" htmlFor="description" required>
            <textarea
              id="description"
              rows={3}
              className={cn(inputStyles, "resize-none")}
              {...register("description")}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Email lien he" htmlFor="email" required>
              <input id="email" type="email" className={inputStyles} {...register("email")} />
            </FormField>
            <FormField label="So dien thoai" htmlFor="phone">
              <input id="phone" className={inputStyles} {...register("phone")} />
            </FormField>
          </div>
        </section>

        {/* Social Links */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
            Mang xa hoi
          </h2>
          <FormField label="Twitter / X" htmlFor="twitter">
            <input id="twitter" className={inputStyles} placeholder="https://twitter.com/..." {...register("twitter")} />
          </FormField>
          <FormField label="Facebook" htmlFor="facebook">
            <input id="facebook" className={inputStyles} placeholder="https://facebook.com/..." {...register("facebook")} />
          </FormField>
          <FormField label="LinkedIn" htmlFor="linkedin">
            <input id="linkedin" className={inputStyles} placeholder="https://linkedin.com/..." {...register("linkedin")} />
          </FormField>
        </section>

        {/* SEO Defaults */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold border-b border-[var(--color-border)] pb-2">
            Mac dinh SEO
          </h2>
          <FormField label="SEO Title mac dinh" htmlFor="seoTitle">
            <input id="seoTitle" className={inputStyles} {...register("seoTitle")} />
          </FormField>
          <FormField label="SEO Description mac dinh" htmlFor="seoDescription">
            <textarea
              id="seoDescription"
              rows={3}
              className={cn(inputStyles, "resize-none")}
              {...register("seoDescription")}
            />
          </FormField>
        </section>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Dang luu..." : "Luu cai dat"}
          </Button>
        </div>
      </form>
    </div>
  );
}
