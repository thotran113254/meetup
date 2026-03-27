import { Radio, MessageCircle, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site-config";

/**
 * FloatingSocial — Fixed right-side social buttons stack.
 * Three circular buttons: MeetUp LIVE (red), WhatsApp (green), Instagram (gradient).
 * Server component — no hooks or state needed.
 */
export function FloatingSocial() {
  const { socials } = siteConfig;

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col items-center gap-3">
      {/* MeetUp LIVE — button (no link target yet) */}
      <button
        type="button"
        aria-label="MeetUp Live"
        className="flex h-12 w-12 flex-col items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ backgroundColor: "#EF4444" }}
      >
        <Radio className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="text-white font-bold leading-none" style={{ fontSize: "8px" }}>
          LIVE
        </span>
      </button>

      {/* WhatsApp */}
      <a
        href={socials.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="h-6 w-6 text-white" aria-hidden="true" />
      </a>

      {/* Instagram */}
      <a
        href={socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        }}
      >
        <Instagram className="h-6 w-6 text-white" aria-hidden="true" />
      </a>
    </div>
  );
}
