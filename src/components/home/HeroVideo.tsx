"use client";

import { useEffect, useRef } from "react";

/** Decorative looping backdrop; stays on its poster frame when the user prefers reduced motion. */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) video.pause();
      else video.play().catch(() => {});
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      className="hero-video"
      muted
      loop
      playsInline
      preload="none"
      poster="/videos/hero-waves-poster.webp"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>
  );
}
