/**
 * AboutSectionContent — "About us" heading, clothesline gallery, team composite.
 * Figma: mobile 13489:8182, desktop 13289:45217.
 * Receives all data as props from server wrapper (about-section.tsx).
 */
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-animations";
import type { AboutData } from "@/lib/types/homepage-cms-types";

type Props = { data: AboutData };

export function AboutSectionContent({ data }: Props) {
  return (
    <section className="bg-[var(--color-background)] overflow-hidden">
      {/* --- Heading + quote --- */}
      <ScrollReveal className="text-center pt-0 md:pt-12 lg:pt-14 mb-2 md:mb-3 max-w-[343px] md:max-w-[524px] mx-auto px-4">
        <h2 className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] mb-2 md:mb-3 leading-[1.2] tracking-[0.05px] md:tracking-[0.08px]">
          {data.title}
        </h2>
        <p className="text-[#828282] text-sm md:text-base leading-[1.5] tracking-[0.035px] md:tracking-[0.04px]">
          &ldquo;{data.quote}&rdquo;
        </p>
      </ScrollReveal>

      {/* --- Mobile clothesline: individual photos on curved wire --- */}
      <div className="md:hidden mt-3">
        <div className="relative w-[123%] -ml-[11.5%] h-[62vw]">
          <svg
            className="absolute top-[30%] left-[8%] w-[84%] h-[8%]"
            viewBox="0 0 388 15"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M0,12 Q194,2 388,8" stroke="#3bbcb7" strokeWidth="1.5" />
          </svg>

          {data.mobilePhotos.map((p) => (
            <div
              key={p.src}
              className="absolute flex flex-col items-center"
              style={{
                left: p.left,
                top: p.top,
                transform: `translateX(-50%) rotate(${p.deg}deg)`,
                transformOrigin: "top center",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#3bbcb7]" />
              <div className="w-[1.5px] bg-[#3bbcb7]" style={{ height: p.stringH }} />
              <div
                className={`border-2 border-[#3bbcb7] rounded-xl overflow-hidden relative aspect-[84/101] ${
                  p.wide ? "w-[26vw]" : "w-[22vw]"
                }`}
              >
                <Image src={p.src} fill className="object-cover" sizes="84px" alt={p.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Desktop clothesline: composite pre-rendered image --- */}
      <ScrollReveal delay={0.2} className="hidden md:block w-full mt-6 px-2">
        <Image
          src={data.desktopImage}
          alt="Meetup Travel team photo gallery"
          width={1600}
          height={517}
          className="w-full h-auto"
          sizes="100vw"
          priority
        />
      </ScrollReveal>

      {/* --- Bottom composite: dragon + team + temple + clouds --- */}
      <div className="relative w-full h-[290px] sm:h-[350px] md:h-[435px]">
        <div
          className="absolute left-[4%] bottom-0 w-[29%] h-[84%] overflow-hidden"
          style={{ transform: "scaleX(-1)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.dragonImage}
            alt=""
            className="absolute max-w-none object-cover"
            style={{ left: "0%", top: "-171%", width: "140%", height: "309%" }}
            aria-hidden="true"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[140%] sm:w-[90%] md:w-[54%] h-[107%] overflow-hidden z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.teamImage}
            alt="Meetup Travel team"
            className="absolute max-w-none object-cover"
            style={{ left: 0, top: "-130%", width: "100%", height: "230%" }}
          />
        </div>

        <div className="absolute left-[64%] top-[13%] w-[32%] h-[78%] overflow-hidden z-[5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.templeImage}
            alt=""
            className="absolute max-w-none object-cover"
            style={{ left: "-50%", top: "-59%", width: "210%", height: "212%" }}
            aria-hidden="true"
          />
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[55%] z-20">
          <div className="relative size-full">
            <Image src={data.cloudImage} alt="" fill sizes="100vw" className="object-cover object-top" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute bottom-[3%] left-0 w-full h-[50%] z-20 opacity-90" style={{ transform: "scaleX(-1)" }}>
          <div className="relative size-full">
            <Image src={data.cloudImage} alt="" fill sizes="100vw" className="object-cover object-top" aria-hidden="true" />
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-[37%] z-30 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
