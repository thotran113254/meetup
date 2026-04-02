"use client";

import { useEffect } from "react";
import { X, CheckCircle, Frown } from "lucide-react";

type SubscribePopupProps = {
  variant: "success" | "fail" | "unsubscribe";
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

/**
 * SubscribePopup — Modal dialog for subscribe success, fail, and unsubscribe confirmation.
 * Figma: success = green checkmark, fail = sad face, unsubscribe = confirm/cancel buttons.
 * Overlay backdrop with centered card.
 */
export function SubscribePopup({ variant, open, onClose, onConfirm }: SubscribePopupProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={variant === "success" ? "Subscription successful" : variant === "fail" ? "Subscription failed" : "Unsubscribe confirmation"}
    >
      <div
        className="relative w-[400px] max-w-[calc(100vw-32px)] rounded-[12px] p-8 shadow-xl"
        style={{ backgroundColor: variant === "success" ? "#E8F8F0" : variant === "fail" ? "#FFF5EE" : "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#828282]" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {variant === "success" && (
            <CheckCircle className="w-12 h-12 text-[#2CBCB3]" />
          )}
          {variant === "fail" && (
            <Frown className="w-12 h-12 text-[#C47A4A]" />
          )}
          {variant === "unsubscribe" && (
            <Frown className="w-12 h-12 text-[#828282]" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-center font-bold text-xl mb-2" style={{
          color: variant === "success" ? "#2CBCB3" : variant === "fail" ? "#8B5E3C" : "#1D1D1D"
        }}>
          {variant === "success" && "Subscribe Success"}
          {variant === "fail" && "Subscribe Fail"}
          {variant === "unsubscribe" && "Unsubcribe?"}
        </h3>

        {/* Body text */}
        <p className="text-center text-sm text-[#828282] leading-relaxed mb-4">
          {variant === "success" &&
            "Thank you for subscribing! Please check your Promotions or Spam folder if you don't see our email."}
          {variant === "fail" &&
            "Oops! That doesn't look like a valid email address. Please try again."}
          {variant === "unsubscribe" &&
            "Are you sure you want to unsubscribe from our newsletter? You'll miss out on travel tips and exclusive deals."}
        </p>

        {/* Unsubscribe buttons */}
        {variant === "unsubscribe" && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onConfirm}
              className="h-10 px-6 rounded-[12px] bg-[#3BBCB7] text-white text-sm font-bold hover:bg-[#2FA8A1] transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="h-10 px-6 rounded-[12px] border border-[#BDBDBD] text-[#828282] text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
