// src/features/wrapped/components/WrappedSlideView.tsx
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCount } from "@/utils/formatters";
import type { WrappedSlide } from "@/features/wrapped/hooks/useWrappedSlides";

const TONE_CLASS: Record<string, string> = {
  mutual: "text-signal-mutual",
  lost: "text-signal-lost",
  gained: "text-signal-gained",
  neutral: "text-ink-50",
};

export function WrappedSlideView({
  slide,
  onContinue,
}: {
  slide: WrappedSlide;
  onContinue: () => void;
}) {
  if (slide.kind === "intro") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Sparkles className="h-10 w-10 text-signal-gained" aria-hidden />
        <h1 className="font-display text-3xl text-ink-50 sm:text-4xl">
          Your Instagram, unwrapped
        </h1>
        <p className="max-w-xs text-ink-400">Let's see who's really riding with you.</p>
      </div>
    );
  }

  if (slide.kind === "cta") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="font-display text-2xl text-ink-50 sm:text-3xl">That's the recap.</h2>
        <p className="max-w-xs text-ink-400">
          Want the full breakdown — searchable, sortable, exportable?
        </p>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-md bg-signal-mutual px-5 py-3 font-medium text-ink-950 transition-opacity hover:opacity-90"
        >
          See full breakdown <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return <StatSlide slide={slide} />;
}

function StatSlide({ slide }: { slide: Extract<WrappedSlide, { kind: "stat" }> }) {
  const value = useCountUp(slide.value, 1100);
  const tone = TONE_CLASS[slide.tone];

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <motion.span
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`font-display text-6xl sm:text-7xl ${tone}`}
      >
        {formatCount(value)}
      </motion.span>
      <p className="text-xl text-ink-50">{slide.label}</p>
      {slide.sublabel && <p className="max-w-xs text-sm text-ink-400">{slide.sublabel}</p>}
    </div>
  );
}