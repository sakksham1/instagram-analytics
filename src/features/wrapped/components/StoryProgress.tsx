// src/features/wrapped/components/StoryProgress.tsx
export function StoryProgress({
  count,
  activeIndex,
  progress,
}: {
  count: number;
  activeIndex: number;
  /** 0–1 fill amount of the currently active segment. */
  progress: number;
}) {
  return (
    <div className="flex gap-1 px-4 pt-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full bg-ink-50"
            style={{
              width: i < activeIndex ? "100%" : i === activeIndex ? `${progress * 100}%` : "0%",
              transition: i === activeIndex ? "none" : "width 0.2s",
            }}
          />
        </div>
      ))}
    </div>
  );
}