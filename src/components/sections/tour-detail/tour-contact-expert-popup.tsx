"use client";

import { useState, useEffect } from "react";
import { X, Phone, Mail, User, MessageSquare } from "lucide-react";

interface ContactExpertPopupProps {
  onClose: () => void;
}

export function ContactExpertPopup({ onClose }: ContactExpertPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      <div className={`relative bg-white rounded-none md:rounded-xl w-full md:w-[480px] max-h-[100dvh] md:max-h-[90vh] overflow-y-auto p-6 md:p-8 mx-0 md:mx-4 transition-transform duration-200 ${isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}>
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#828282] hover:text-[#1D1D1D] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

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
          /* Form */
          <>
            <h3 className="text-[20px] font-bold text-[#1D1D1D] mb-1">Contact Expert</h3>
            <p className="text-[13px] text-[#828282] mb-5">
              Fill in your details and our travel expert will get back to you.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#828282]">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full h-[40px] border border-[#ECECEC] rounded-[12px] pl-9 pr-3 text-[13px] text-[#1D1D1D] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#3BBCB7]"
                  />
                </div>
              </div>

              {/* Email + Phone side by side */}
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[12px] text-[#828282]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="w-full h-[40px] border border-[#ECECEC] rounded-[12px] pl-9 pr-3 text-[13px] text-[#1D1D1D] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#3BBCB7]"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-[12px] text-[#828282]">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
                    <input
                      type="tel"
                      placeholder="+84..."
                      className="w-full h-[40px] border border-[#ECECEC] rounded-[12px] pl-9 pr-3 text-[13px] text-[#1D1D1D] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#3BBCB7]"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#828282]">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#BDBDBD]" />
                  <textarea
                    rows={3}
                    placeholder="I'd like to know more about this tour..."
                    className="w-full border border-[#ECECEC] rounded-[12px] pl-9 pr-3 py-2.5 text-[13px] text-[#1D1D1D] placeholder:text-[#BDBDBD] focus:outline-none focus:border-[#3BBCB7] resize-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-[6px] mt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-[40px] border border-[#ECECEC] text-[#828282] rounded-[12px] text-[14px] font-bold hover:bg-[#F8F8F8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[40px] bg-[#3BBCB7] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2fa9a4] transition-colors cursor-pointer"
                >
                  Send message
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
