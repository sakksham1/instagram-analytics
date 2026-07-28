// src/components/ui/share-button.tsx
import { useState } from "react";
import { Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadImageBlob } from "@/services/shareCardService";

/**
 * Fires an async PNG-generation callback and downloads the result.
 * Generic over what it renders (stat card vs summary card) — callers
 * just pass a function that produces a Blob.
 */
export function ShareButton({
  onGenerate,
  filename,
  label = "Share",
  className,
}: {
  onGenerate: () => Promise<Blob>;
  filename: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    try {
      const blob = await onGenerate();
      downloadImageBlob(blob, filename);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={cn(
        "flex items-center gap-2 rounded-md bg-ink-800 px-4 py-2 text-sm text-ink-50",
        "transition-colors hover:bg-ink-700 disabled:opacity-60",
        className,
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
      {busy ? "Rendering…" : label}
    </button>
  );
}