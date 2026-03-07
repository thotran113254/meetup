"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface ParticlesBackgroundProps {
  color?: string;
  quantity?: number;
  size?: number;
  className?: string;
}

export function ParticlesBackground({
  color = "#6366f1",
  quantity = 60,
  size = 2,
  className,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: quantity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * size + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [color, quantity, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
