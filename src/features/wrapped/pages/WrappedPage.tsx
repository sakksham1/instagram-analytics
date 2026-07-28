// src/features/wrapped/pages/WrappedPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useExportStore } from "@/app/exportStore";
import { followerComparisonEngine } from "@/analytics/comparisonEngine";
import { useWrappedSlides } from "@/features/wrapped/hooks/useWrappedSlides";
import { WrappedSlideView } from "@/features/wrapped/components/WrappedSlideView";
import { StoryProgress } from "@/features/wrapped/components/StoryProgress";

const SLIDE_DURATION_MS = 4200;

const EMPTY_COUNTS = {
  followers: 0,
  following: 0,
  mutual: 0,
  notFollowingBack: 0,
  notFollowedBack: 0,
};

/**
 * Full-screen, story-style reveal shown right after a successful upload.
 * Deliberately outside <AppLayout> (see router.tsx) so it can be truly
 * full-bleed instead of sitting inside the normal page chrome. Never the
 * only way to reach results — the X button and the tap-anywhere-forward
 * pattern both drop straight into /analysis.
 *
 * IMPORTANT: every hook below runs unconditionally, on every render,
 * regardless of whether parsedExport exists yet. The "no export loaded"
 * case is handled only in the returned JSX at the very end, never via
 * an early `return` before a hook call.
 */
export function WrappedPage() {
  const parsedExport = useExportStore((s) => s.parsedExport);
  const navigate = useNavigate();

  const result = useMemo(
    () =>
      parsedExport
        ? followerComparisonEngine.compare(parsedExport.followers, parsedExport.following)
        : null,
    [parsedExport],
  );

  const slides = useWrappedSlides(result?.counts ?? EMPTY_COUNTS);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);

  const isLast = index === slides.length - 1;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(next, slides.length - 1)));
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
    },
    [slides.length],
  );

  useEffect(() => {
    // No export loaded yet — nothing to animate through. Guarded inside
    // the effect body (not around the hook call itself) so hook order
    // never changes between renders.
    if (!parsedExport || !result) return;
    if (isLast) return; // CTA slide waits for a tap, never auto-advances past itself

    startRef.current = performance.now();

    const tick = (now: number) => {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = elapsedBeforePauseRef.current + (now - startRef.current);
      const pct = Math.min(elapsed / SLIDE_DURATION_MS, 1);
      setProgress(pct);

      if (pct >= 1) {
        goTo(index + 1);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isLast, parsedExport, result]);

  const handlePress = (paused: boolean) => {
    pausedRef.current = paused;
    if (paused) {
      elapsedBeforePauseRef.current += performance.now() - startRef.current;
    } else {
      startRef.current = performance.now();
    }
  };

  // Guard clause comes last — after every hook above has already run.
  if (!parsedExport || !result) return <Navigate to="/" replace />;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink-950">
      <StoryProgress count={slides.length} activeIndex={index} progress={progress} />

      <button
        onClick={() => navigate("/analysis")}
        aria-label="Skip to full breakdown"
        className="absolute right-4 top-6 text-ink-400 hover:text-ink-50"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative flex flex-1 select-none"
        onPointerDown={() => handlePress(true)}
        onPointerUp={() => handlePress(false)}
        onPointerLeave={() => handlePress(false)}
      >
        <button aria-label="Previous" className="w-1/3" onClick={() => goTo(index - 1)} />
        <button
          aria-label="Next"
          className="w-2/3"
          onClick={() => (isLast ? navigate("/analysis") : goTo(index + 1))}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto"
            >
              <WrappedSlideView
                slide={slides[index]}
                onContinue={() => navigate("/analysis")}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}