import { getSetting } from "@/db/queries/settings-queries";
import type { NewsletterData } from "@/lib/types/homepage-cms-types";
import { NewsletterSectionContent } from "./newsletter-section-content";

const FALLBACK: NewsletterData = {
  title: "Like a travel expert\nin your inbox",
  description:
    "Friendship, integrity and a spirit of self-improvement forge the strength of an organization that continues to grow.",
};

/**
 * NewsletterSection — Server component that loads newsletter text from CMS.
 * Falls back to FALLBACK when DB is unavailable or setting not set.
 */
export async function NewsletterSection() {
  let data = FALLBACK;
  try {
    const cms = await getSetting<NewsletterData>("homepage_newsletter");
    if (cms) data = { ...FALLBACK, ...cms };
  } catch {
    // DB unavailable — use fallback
  }
  return <NewsletterSectionContent title={data.title} description={data.description} />;
}
