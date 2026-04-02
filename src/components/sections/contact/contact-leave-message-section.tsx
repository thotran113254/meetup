"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/app/contact/contact-form-action";

const inputClass =
  "w-full h-10 px-3 py-2.5 border border-[#BDBDBD] rounded-xl text-[12px] text-[#1D1D1D] placeholder-[#BDBDBD] bg-white focus:outline-none focus:border-[#3BBCB7] transition-colors";

const labelClass = "block text-[12px] text-[#828282] leading-[1.4] mb-1.5 pl-0.5";

const ISSUE_OPTIONS = [
  "Booking Tours",
  "General Inquiry",
  "Tour Guides",
  "Payment & Refunds",
  "Safety & Security",
  "Other",
];

const REASON_OPTIONS = [
  "General Question",
  "Booking Support",
  "Complaint",
  "Feedback",
  "Partnership",
];

/**
 * ContactLeaveMessageSection — Group photo on left + "Leave us a message" form on right.
 * Matches Figma design node 13925:89722.
 */
export function ContactLeaveMessageSection() {
  const [issue, setIssue] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !description) return;
    setSubmitting(true);
    setResult(null);
    const res = await submitContactForm({
      name: "Contact Form",
      email,
      phone: "",
      message: `[Issue: ${issue}] [Reason: ${reason}]\n${description}`,
    });
    setResult(res);
    setSubmitting(false);
    if (res?.success) {
      setIssue("");
      setEmail("");
      setReason("");
      setDescription("");
      setFileName("");
    }
  }

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-[100px] pt-6 sm:pt-10">
      <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-0 min-h-[592px]">
        {/* Left: decorative group photo */}
        <div className="relative lg:w-[55%] h-64 sm:h-80 lg:h-auto rounded-xl overflow-hidden">
          <Image
            src="/images/about-us.png"
            alt="Meetup Travel team planning"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Right: form card */}
        <div className="lg:absolute lg:right-0 lg:top-0 lg:w-[708px] bg-white rounded-xl shadow-[0px_0px_40px_0px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-5 z-10">
          <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#1D1D1D] leading-[1.2]">
            Leave us a message
          </h2>

          {result && (
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm border",
                result.success
                  ? "bg-[#EBF8F8] text-[#194F4D] border-[#C2EAE9]"
                  : "bg-red-50 text-red-700 border-red-200"
              )}
            >
              {result.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Issue selector */}
            <div>
              <label className={labelClass}>Please choose your issue below</label>
              <div className="relative">
                <select
                  className={cn(inputClass, "appearance-none pr-8")}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {ISSUE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D] pointer-events-none" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Email + Reason row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className={labelClass}>
                  Your email address <span className="text-[#F60E0E]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>
                  Reason for Contact <span className="text-[#F60E0E]">*</span>
                </label>
                <div className="relative">
                  <select
                    className={cn(inputClass, "appearance-none pr-8")}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="" disabled>Select</option>
                    {REASON_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D] pointer-events-none" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Description <span className="text-[#F60E0E]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Please enter the details of your request. A member of our support staff will respond as soon as possible."
                className={cn(inputClass, "h-auto resize-none py-2.5")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Attachments */}
            <div>
              <label className={labelClass}>Attachments</label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-[114px] border border-[#BDBDBD] rounded-xl flex flex-col items-center justify-center gap-2 bg-white hover:border-[#3BBCB7] transition-colors"
              >
                <svg className="w-6 h-6 text-[#3BBCB7]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0l-3 3m3-3l3 3M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12px] text-[#BDBDBD]">
                  {fileName || "Add file or drop files here"}
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-6 bg-[#3BBCB7] text-white text-[14px] font-bold rounded-xl hover:bg-[#2CBCB3] transition-colors self-start disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
