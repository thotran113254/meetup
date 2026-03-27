"use client";

import { useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";

type WishlistItem = {
  id: string;
  title: string;
  image: string;
};

type WishlistDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemove: (id: string) => void;
};

/**
 * WishlistDrawer — Slide-in panel from right showing saved tour items.
 * Figma: PC 550x800, header with X close, scrollable list of items (80px each).
 */
export function WishlistDrawer({ open, onClose, items, onRemove }: WishlistDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[550px] max-w-full bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-lg text-[#1D1D1D]">Wishlist</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close wishlist">
            <X className="w-5 h-5 text-[#828282]" />
          </button>
        </div>

        {/* Item list */}
        <div className="overflow-y-auto h-[calc(100%-65px)] px-6 py-4">
          {items.length === 0 ? (
            <p className="text-center text-[#828282] text-sm py-12">Your wishlist is empty</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-[12px] hover:bg-[#F8F8F8] transition-colors">
                  {/* Thumbnail */}
                  <div className="relative w-[80px] h-[80px] rounded-[8px] overflow-hidden flex-none">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" />
                  </div>
                  {/* Tour name */}
                  <p className="flex-1 text-sm font-medium text-[#1D1D1D] line-clamp-2">{item.title}</p>
                  {/* Delete button */}
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-full hover:bg-red-50 text-[#828282] hover:text-red-500 transition-colors flex-none"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
