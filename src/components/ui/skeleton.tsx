import { cn } from "@/lib/utils";

/** Simple pulsing placeholder block. Compose with width/height utility
 * classes at the call site, e.g. `<Skeleton className="h-5 w-40" />`. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-ink-800", className)} />;
}
