"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  motion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function NumberTicker({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const rounded = useTransform(motionValue, (latest) =>
    latest.toFixed(decimals)
  );

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [isInView, motionValue, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
