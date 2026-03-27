"use client";

import { useRef, useCallback } from "react";

/**
 * Shared hook for horizontal snap-scroll carousels.
 * Provides a ref for the scrollable container and a scroll function.
 */
export function useHorizontalScroll(amount = 300) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      ref.current?.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    },
    [amount]
  );

  return { ref, scroll };
}
