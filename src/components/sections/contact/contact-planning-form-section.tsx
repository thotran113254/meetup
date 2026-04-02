"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlanningFormData {
  name: string;
  visitDate: string;
  occasion: string;
  whatsapp: string;
  email: string;
  passengers: string;
  duration: string;
  budget: "4star" | "5star";
  note: string;
  finalizeDate: string;
  packages: string;
}

const inputClass =
  "w-full h-10 px-3 py-2.5 border border-[#BDBDBD] rounded-xl text-[12px] text-[#1D1D1D] placeholder-[#BDBDBD] bg-white focus:outline-none focus:border-[#3BBCB7] transition-colors";

const labelClass = "block text-[12px] text-[#828282] leading-[1.4] mb-1.5 pl-0.5";

/**
 * ContactPlanningFormSection — "For planning your next trip" form with decorative photo.
 * Matches Figma design node 13925:89558.
 */
export function ContactPlanningFormSection() {
  const [form, setForm] = useState<PlanningFormData>({
    name: "",
    visitDate: "",
    occasion: "",
    whatsapp: "",
    email: "",
    passengers: "",
    duration: "",
    budget: "4star",
    note: "",
    finalizeDate: "",
    packages: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof PlanningFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real implementation, this would call a server action
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-10 pb-0">
      <div className="relative">
        {/* Form card */}
        <div className="relative z-10 bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 w-full lg:max-w-[708px]">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] mb-5">
            For planing your next trip
          </h2>

          {submitted && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm bg-[#EBF8F8] text-[#194F4D] border border-[#C2EAE9]">
              Thank you! We will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Row 1: name + visit date */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>Your name</label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>When will you come to Vietnam?</label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.visitDate}
                  onChange={(e) => handleChange("visitDate", e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: occasion + whatsapp */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>Special Occasion?</label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.occasion}
                  onChange={(e) => handleChange("occasion", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>
                  WhatsApp Number{" "}
                  <span className="text-[#F60E0E]">(please include country code)</span>
                </label>
                <input
                  type="text"
                  placeholder="Example for Vietnam: +84 999888222"
                  className={inputClass}
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: email + passengers */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>Your email</label>
                <input
                  type="email"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Number of passengers</label>
                <input
                  type="text"
                  placeholder="Example: 2 adults, 1 kid (7 years), 1 infant"
                  className={inputClass}
                  value={form.passengers}
                  onChange={(e) => handleChange("passengers", e.target.value)}
                />
              </div>
            </div>

            {/* Row 4: duration + budget */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>How long do you plan to stay in Vietnam?</label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                />
              </div>
              <div className="flex-1 sm:max-w-[330px]">
                <label className={labelClass}>Budget</label>
                <div className="flex gap-2">
                  {/* 4 Star option */}
                  <button
                    type="button"
                    onClick={() => handleChange("budget", "4star")}
                    className={cn(
                      "flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[12px] border transition-colors px-3",
                      form.budget === "4star"
                        ? "bg-[#EBF8F8] border-[#C2EAE9] text-[#36ABA7]"
                        : "bg-white border-[#ECECEC] text-[#A9A9A9]"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0",
                        form.budget === "4star" ? "border-[#3BBCB7]" : "border-[#C4CADA]"
                      )}
                    >
                      {form.budget === "4star" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3BBCB7]" />
                      )}
                    </span>
                    4 Star (from $150)
                  </button>
                  {/* 5 Star option */}
                  <button
                    type="button"
                    onClick={() => handleChange("budget", "5star")}
                    className={cn(
                      "flex-1 h-10 flex items-center justify-center gap-2 rounded-xl text-[12px] border transition-colors px-3",
                      form.budget === "5star"
                        ? "bg-[#EBF8F8] border-[#C2EAE9] text-[#36ABA7]"
                        : "bg-white border-[#ECECEC] text-[#A9A9A9]"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0",
                        form.budget === "5star" ? "border-[#3BBCB7]" : "border-[#C4CADA]"
                      )}
                    >
                      {form.budget === "5star" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3BBCB7]" />
                      )}
                    </span>
                    5 Star (from $180)
                  </button>
                </div>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className={labelClass}>
                Note (if you have any special requests such as vegetarian meals, needing an extra quite space,...)
              </label>
              <input
                type="text"
                placeholder="Enter"
                className={inputClass}
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
              />
            </div>

            {/* Row 5: finalize + packages */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>When would you like to finalize your booking?</label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={inputClass}
                  value={form.finalizeDate}
                  onChange={(e) => handleChange("finalizeDate", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Which packages you want to get more?</label>
                <div className="relative">
                  <select
                    className={cn(inputClass, "appearance-none pr-8")}
                    value={form.packages}
                    onChange={(e) => handleChange("packages", e.target.value)}
                  >
                    <option value="" disabled>Enter</option>
                    <option value="day-tour">Day Tour</option>
                    <option value="multi-day">Multi-day Tour</option>
                    <option value="custom">Custom Package</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D] pointer-events-none"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 h-10 px-6 bg-[#3BBCB7] text-white text-[14px] font-bold rounded-xl hover:bg-[#2CBCB3] transition-colors self-start"
            >
              Send information
            </button>
          </form>
        </div>

        {/* Decorative photo — hidden on mobile, shown from lg */}
        <div className="hidden lg:block absolute top-0 right-0 h-full w-[calc(100%-730px)] pointer-events-none overflow-hidden rounded-xl">
          <Image
            src="/images/about-team-photo.png"
            alt="Meetup Travel team"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1600px) 50vw"
          />
        </div>
      </div>
    </section>
  );
}
