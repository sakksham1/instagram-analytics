// src/hooks/useCountUp.ts
import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 (or its previous value) to `target` over
 * `durationMs`. Skips straight to the target if the user has
 * prefers-reduced-motion enabled — see src/styles/globals.css, which
 * already does the same for CSS transitions.
 */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutCubic — quick start, gentle settle
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + delta * eased);
      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}