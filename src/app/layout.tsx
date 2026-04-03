import type { Metadata } from "next";
import { Inter, Dancing_Script, Phudu } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site-config";


const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-script",
});

const phudu = Phudu({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-phudu",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.seo.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dancingScript.variable} ${phudu.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[var(--color-background)] text-[var(--color-foreground)]">
        {children}
      </body>
    </html>
  );
}
