"use client";

/**
 * NewsletterSection — Email subscription card.
 * Figma node 13713:14439.
 * Card: bg-[#EBF8F8] rounded-[12px] p-[60px], max-w-[928px] centered.
 * Left: bold title + italic quote. Right: stacked name/email inputs + subscribe button.
 * Client component for form state.
 */

import { useState } from "react";
import { SubscribePopup } from "@/components/ui/subscribe-popup";
import { ScrollReveal } from "@/components/ui/scroll-animations";

export function NewsletterSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [popup, setPopup] = useState<{ open: boolean; variant: "success" | "fail" | "unsubscribe" }>({ open: false, variant: "success" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email format — show success or fail popup
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    setPopup({ open: true, variant: isValid ? "success" : "fail" });
  };

  // White inputs, no border — sit cleanly on the light teal card
  const inputClass =
    "w-full bg-white h-10 rounded-xl px-3 py-2 text-xs text-[var(--color-foreground)] placeholder:text-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]";

  return (
    <section className="section-padding bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Card — max 928px, light teal bg, 60px padding per Figma */}
        <ScrollReveal>
        <div
          className="max-w-[928px] mx-auto rounded-xl p-3 md:px-4 md:py-8 sm:p-[60px] bg-[var(--color-secondary)] overflow-hidden relative"
        >
          {/* Decorative airplane icon — top right */}
          <img
            src="/images/newsletter-airplane.png"
            alt=""
            className="absolute top-2 right-2 md:hidden w-[46px] h-[40px] -scale-y-100 object-contain opacity-80 animate-float"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-5">

            {/* Title + quote */}
            <div className="flex flex-col gap-2">
              <h2
                className="text-xl md:text-[32px] font-bold text-[var(--color-foreground)] leading-[1.2] tracking-[0.05px] md:tracking-[0.08px]"
              >
                Like a travel expert<br />
                in your inbox
                {/* Decorative airplane icon per Figma — desktop only */}
                <img
                  src="/images/newsletter-airplane.png"
                  alt=""
                  className="hidden md:inline-block w-[46px] h-[40px] ml-1 align-middle -scale-y-100 rotate-[-174deg] object-contain"
                  aria-hidden="true"
                />
              </h2>
              <p
                className="text-[var(--color-muted-foreground)] text-xs md:text-base leading-[1.5] tracking-[0.04px] max-w-[243px] md:max-w-[323px]"
              >
                &ldquo;Friendship, integrity and a spirit of self-improvement
                forge the strength of an organization that continues to grow.&rdquo;
              </p>
            </div>

            {/* Subscription form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
              {/* First name + Last name side by side on mobile per Figma */}
              <div className="flex gap-2">
                <label htmlFor="nl-first" className="sr-only">First name</label>
                <input
                  id="nl-first"
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className={inputClass}
                />
                <label htmlFor="nl-last" className="sr-only">Last name</label>
                <input
                  id="nl-last"
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="nl-email" className="sr-only">Email address</label>
                <input
                  id="nl-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your e-mail address"
                  required
                  className={inputClass}
                />
              </div>

              {/* Subscribe button — full width on mobile per Figma */}
              <button
                type="submit"
                className="h-10 rounded-xl px-8 text-white font-bold text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors w-full md:self-start md:w-auto cursor-pointer"
              >
                Subcribe
              </button>
            </form>

          </div>
        </div>
        </ScrollReveal>
      </div>

      <SubscribePopup
        variant={popup.variant}
        open={popup.open}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
    </section>
  );
}
