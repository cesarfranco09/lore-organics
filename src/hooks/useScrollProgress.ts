import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * 0 → 1 progress of the viewport through an element.
 * `mode: "sticky"` measures how far a tall wrapper has scrolled past the top
 * (for pinned sections); `mode: "pass"` measures from the element entering
 * the bottom of the viewport to leaving the top.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: "sticky" | "pass" = "sticky"
): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw =
        mode === "sticky"
          ? -rect.top / Math.max(1, rect.height - vh)
          : (vh - rect.top) / (vh + rect.height);
      const next = Math.min(1, Math.max(0, raw));
      setProgress((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode]);

  return [ref, progress];
}

/** Maps progress within [start, end] to 0 → 1. */
export const segment = (p: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (p - start) / (end - start)));
