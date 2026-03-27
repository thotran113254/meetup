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
    "w-full bg-white h-[40px] rounded-[12px] px-[12px] py-[8px] text-xs text-[var(--color-foreground)] placeholder:text-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#3BBCB7]";

  return (
    <section className="py-[50px] bg-[var(--color-background)]">
      <div className="container-wide">
        {/* Card — max 928px, light teal bg, 60px padding per Figma */}
        <div
          className="max-w-[928px] mx-auto rounded-[12px] px-4 py-8 sm:p-[60px]"
          style={{ background: "#EBF8F8" }}
        >
          <div className="flex flex-col md:flex-row gap-5 items-start">

            {/* Left: title + quote */}
            <div className="flex-1 min-w-0">
              <h2
                className="font-bold text-[#1D1D1D] mb-4"
                style={{
                  fontSize: "32px",
                  lineHeight: 1.2,
                  letterSpacing: "0.08px",
                }}
              >
                Like a travel expert<br />in your inbox
              </h2>
              <p
                className="text-[#828282] italic"
                style={{
                  fontSize: "16px",
                  lineHeight: 1.5,
                  letterSpacing: "0.04px",
                  maxWidth: "323px",
                }}
              >
                &ldquo;Friendship, integrity and a spirit of self-improvement
                forge the strength of an organization that continues to grow.&rdquo;
              </p>
            </div>

            {/* Right: subscription form */}
            <form onSubmit={handleSubmit} className="flex-1 w-full flex flex-col">
              {/* First name + Last name stacked with gap-[8px] */}
              <div className="flex flex-col gap-[8px]">
                <div>
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
                </div>
                <div>
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
              </div>

              {/* Email — gap-[12px] below name group */}
              <div className="mt-[12px]">
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

              {/* Subscribe button — teal bg, rounded-[12px], intentional Figma typo "Subcribe" */}
              <div className="mt-[12px]">
                <button
                  type="submit"
                  className="h-[40px] rounded-[12px] px-[32px] text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#3BBCB7" }}
                >
                  Subcribe
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <SubscribePopup
        variant={popup.variant}
        open={popup.open}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
    </section>
  );
}
