// src/features/wrapped/hooks/useWrappedSlides.ts
import { useMemo } from "react";
import type { FollowerComparisonResult } from "@/types/results";

export type WrappedSlide =
  | { kind: "intro" }
  | {
      kind: "stat";
      key: string;
      value: number;
      label: string;
      sublabel?: string;
      tone: "mutual" | "lost" | "gained" | "neutral";
    }
  | { kind: "cta" };

/**
 * Turns comparison counts into a fixed sequence of story-style slides.
 * Slides for zero-count buckets are skipped — no one needs a slide
 * celebrating "0 people don't follow you back" or listening to us
 * pretend that's dramatic.
 */
export function useWrappedSlides(
  counts: FollowerComparisonResult["counts"],
): WrappedSlide[] {
  return useMemo(() => {
    const slides: WrappedSlide[] = [{ kind: "intro" }];

    slides.push({
      kind: "stat",
      key: "followers",
      value: counts.followers,
      label: "people follow you",
      tone: "neutral",
    });

    slides.push({
      kind: "stat",
      key: "following",
      value: counts.following,
      label: "accounts you follow",
      tone: "neutral",
    });

    slides.push({
      kind: "stat",
      key: "mutual",
      value: counts.mutual,
      label: counts.mutual === 1 ? "mutual follow" : "mutual follows",
      sublabel: "people who follow you back, for real",
      tone: "mutual",
    });

    if (counts.notFollowingBack > 0) {
      slides.push({
        kind: "stat",
        key: "notFollowingBack",
        value: counts.notFollowingBack,
        label:
          counts.notFollowingBack === 1
            ? "person doesn't follow you back"
            : "people don't follow you back",
        sublabel: "you follow them, they don't follow you",
        tone: "lost",
      });
    }

    if (counts.notFollowedBack > 0) {
      slides.push({
        kind: "stat",
        key: "notFollowedBack",
        value: counts.notFollowedBack,
        label:
          counts.notFollowedBack === 1
            ? "follower you haven't followed back"
            : "followers you haven't followed back",
        sublabel: "they follow you, you haven't followed back",
        tone: "gained",
      });
    }

    slides.push({ kind: "cta" });

    return slides;
  }, [counts]);
}