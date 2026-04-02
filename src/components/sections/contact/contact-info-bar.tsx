import Image from "next/image";
import { siteConfig } from "@/config/site-config";

/**
 * ContactInfoBar — "Got questions about your trip?" card with timezone + WhatsApp links.
 * Matches Figma design node 13925:88709.
 */
export function ContactInfoBar() {
  const { whatsapp } = siteConfig.navigation.footer.contact;

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-[40px]">
      <div className="bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        {/* Left: Title */}
        <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] shrink-0">
          Got questions
          <br />
          about your trip?
        </h2>

        {/* Right: Info cards */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:justify-end">
          {/* Timezone card */}
          <div className="bg-[#EBF8F8] rounded-xl p-4 sm:p-6 flex items-start gap-3 flex-1 sm:max-w-[320px]">
            <div className="relative shrink-0 w-6 h-6 mt-0.5">
              <Image
                src="/images/feature-customized-itinerary.svg"
                alt="Timezone"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 text-[#194F4D]">
              <p className="text-[14px] sm:text-[16px] leading-[1.5]">Asia/Saigon, GMT+7</p>
              <p className="text-[14px] sm:text-[16px] leading-[1.5]">
                Mon-Sun:{" "}
                <span className="font-bold">06:00 AM - 12:00 AM</span>
              </p>
            </div>
          </div>

          {/* WhatsApp card */}
          <div className="bg-[#EBF8F8] rounded-xl p-4 sm:p-6 flex items-start gap-3 flex-1 sm:max-w-[380px]">
            <div className="relative shrink-0 w-6 h-6 mt-0.5">
              <Image
                src="/images/feature-zero-language.svg"
                alt="Support"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 text-[#194F4D]">
              {whatsapp.map((contact) => (
                <p key={contact.name} className="text-[14px] sm:text-[16px] leading-[1.5]">
                  Support Contact ({contact.name}):{" "}
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    className="font-bold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.phone} [WhatsApp]
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
