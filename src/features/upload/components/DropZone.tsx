import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

/**
 * Drag-and-drop + click-to-browse target for the exported ZIP. Accepts
 * only .zip by extension at this layer; actual content validation happens
 * in the parser (see src/parser), which is where it belongs since "is
 * this a valid Instagram export" is parser knowledge, not UI knowledge.
 */
export function DropZone({ onFileSelected, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed",
        "border-ink-700 bg-ink-900 px-6 py-16 text-center transition-colors cursor-pointer",
        isDragging && "border-signal-gained bg-ink-800",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <UploadCloud className="h-8 w-8 text-ink-400" aria-hidden />
      <p className="font-display text-lg text-ink-50">
        Drop your Instagram export ZIP here
      </p>
      <p className="text-sm text-ink-400">or click to browse — it never leaves this tab</p>
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </div>
  );
}
