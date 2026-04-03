"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Mail } from "lucide-react";

interface ContactExpertPopupProps {
  onClose: () => void;
}

type BudgetOption = "4star" | "5star";

export function ContactExpertPopup({ onClose }: ContactExpertPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [budget, setBudget] = useState<BudgetOption>("4star");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setIsOpen(true));
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      {/* Modal */}
      <div className={`relative bg-white rounded-none md:rounded-[12px] w-full md:w-[740px] max-h-[100dvh] md:max-h-[90vh] overflow-y-auto p-5 md:p-5 mx-0 md:mx-4 shadow-[0_0_40px_rgba(0,0,0,0.06)] transition-transform duration-200 ${isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}>
        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-[#EBF8F8] flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#3BBCB7]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1D1D1D]">Thank you!</h3>
            <p className="text-[14px] text-[#828282] text-center">
              Our travel expert will contact you within 24 hours.
            </p>
            <button
              onClick={handleClose}
              className="h-[40px] px-8 bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[24px] md:text-[32px] font-bold text-[#1D1D1D] leading-[1.2] tracking-[0.08px]">
                Wanna Meet Our Local Experts
              </h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-[#828282] hover:text-[#1D1D1D] transition-colors cursor-pointer shrink-0 ml-4"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Row 1: Name + When coming */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                <FormField label="Your name" placeholder="Enter" />
                <FormField label="When will you come to Vietnam?" placeholder="Enter" />
              </div>

              {/* Row 2: Special Occasion + WhatsApp */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                <FormField label="Special Occasion?" placeholder="Enter" />
                <FormField
                  label={
                    <>
                      WhatsApp Number{" "}
                      <span className="text-[#F60E0E]">(please include country code)</span>
                    </>
                  }
                  placeholder="Example for Vietnam: +84 999888222"
                />
              </div>

              {/* Row 3: Email + Passengers */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                <FormField label="Your email" placeholder="Enter" type="email" />
                <FormField
                  label="Number of passengers"
                  placeholder="Example: 2 adults, 1 kid (7 years), 1 infant"
                />
              </div>

              {/* Row 4: Stay duration + Budget */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <FormField
                    label="How long do you plan to stay in Vietnam?"
                    placeholder="Enter"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:w-[330px] shrink-0">
                  <label className="text-[12px] text-[#828282] leading-[1.4] pl-0.5">
                    Budget
                  </label>
                  <div className="flex gap-2">
                    <BudgetRadio
                      label="4 Star (from $150)"
                      selected={budget === "4star"}
                      onClick={() => setBudget("4star")}
                    />
                    <BudgetRadio
                      label="5 Star (from $180)"
                      selected={budget === "5star"}
                      onClick={() => setBudget("5star")}
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Note (full width) */}
              <FormField
                label="Note (if you have any special requests such as vegetarian meals, needing an extra quite space,...)"
                placeholder="Enter"
                fullWidth
              />

              {/* Row 6: Finalize booking + Which packages */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-2">
                <FormField
                  label="When would you like to finalize your booking?"
                  placeholder="Enter"
                />
                <FormField
                  label="Which packages you want to get more?"
                  placeholder="Enter"
                  hasDropdown
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="h-[40px] px-6 bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer self-start mt-1"
              >
                Send information
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function FormField({
  label,
  placeholder,
  type = "text",
  fullWidth,
  hasDropdown,
}: {
  label: React.ReactNode;
  placeholder: string;
  type?: string;
  fullWidth?: boolean;
  hasDropdown?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : "flex-1"}`}>
      <label className="text-[12px] text-[#828282] leading-[1.4] pl-0.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-[40px] border border-[#BDBDBD] rounded-[12px] px-3 text-[12px] text-[#1D1D1D] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#3BBCB7] transition-colors"
        />
        {hasDropdown && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] pointer-events-none" />
        )}
      </div>
    </div>
  );
}

function BudgetRadio({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 h-[40px] flex items-center justify-center gap-2 rounded-[12px] border text-[12px] transition-colors cursor-pointer ${
        selected
          ? "bg-[#EBF8F8] border-[#C2EAE9] text-[#36ABA7]"
          : "bg-white border-[#ECECEC] text-[#A9A9A9]"
      }`}
    >
      {/* Radio circle */}
      <span
        className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
          selected ? "border-[#3BBCB7]" : "border-[#C4CADA]"
        }`}
      >
        {selected && <span className="w-[10px] h-[10px] rounded-full bg-[#3BBCB7]" />}
      </span>
      {label}
    </button>
  );
}
