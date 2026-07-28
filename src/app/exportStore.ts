import { useSyncExternalStore } from "react";
import type { ParsedExport } from "@/types/results";

/**
 * Minimal in-memory store holding the currently-loaded export, shared
 * between `upload` (writes) and `follower-analysis` (reads).
 *
 * Also retains the original source File — not its contents, just the
 * handle — so future features that need other parts of the export
 * (message history, growth-over-time snapshots, etc.) can reopen it with
 * `openArchive` (src/parser/zip/zipReader.ts) and selectively read
 * whatever new files they need, without asking the user to re-upload.
 * See src/parser/registry.ts for the selective-read pattern to follow
 * when adding a new reader.
 *
 * Deliberately NOT persisted to localStorage/IndexedDB in V1: cleared on
 * refresh, same as before.
 */
interface ExportState {
  parsedExport: ParsedExport | null;
  sourceFile: File | null;
}

let state: ExportState = { parsedExport: null, sourceFile: null };
const listeners = new Set<() => void>();

function setParsedExport(next: ParsedExport | null, sourceFile: File | null = null) {
  state = { parsedExport: next, sourceFile: next ? sourceFile : null };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useExportStore<T>(
  selector: (state: {
    parsedExport: ParsedExport | null;
    sourceFile: File | null;
    setParsedExport: (next: ParsedExport | null, sourceFile?: File | null) => void;
  }) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  return selector({ ...snapshot, setParsedExport });
}