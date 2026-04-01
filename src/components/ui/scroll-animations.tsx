"use client";

/**
 * Shared scroll-triggered animation components using framer-motion.
 * Consistent pattern: fade-in-up on viewport entry, once only.
 */

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

/** Fade-in-up wrapper — triggers when element enters viewport */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 40,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** Parent container that staggers its motion children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Child item that fades in from below — use with staggerContainer parent */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
