import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

/**
 * Web App Manifest - served at /manifest.webmanifest by Next.js.
 * Enables PWA install prompt and controls home screen appearance.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.theme.background,
    theme_color: siteConfig.theme.primary,
    lang: "vi",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["business", "productivity"],
  };
}
