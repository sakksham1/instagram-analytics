import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "mutual" | "lost" | "gained";
}) {
  const toneClass = {
    neutral: "bg-ink-800 text-ink-200",
    mutual: "bg-signal-mutual/15 text-signal-mutual",
    lost: "bg-signal-lost/15 text-signal-lost",
    gained: "bg-signal-gained/15 text-signal-gained",
  }[tone];

  return (
    <span
      className={cn("rounded-sm px-2 py-0.5 text-xs font-mono", toneClass, className)}
      {...props}
    />
  );
}
