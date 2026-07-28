import { useSyncExternalStore } from "react";
import type { ParsedExport } from "@/types/results";

/**
 * Minimal in-memory store holding the currently-loaded export, shared
 * between the `upload` feature (writes) and `follower-analysis` feature
 * (reads). Lives at the app level — not inside either feature — because
 * more than one feature module depends on it, and future features
 * (compare-two-exports, growth-over-time) will too.
 *
 * Deliberately NOT persisted to localStorage/IndexedDB in V1: keeping
 * parsed data in memory only, cleared on refresh, is a stronger privacy
 * default. A future "save analysis locally" feature should be an
 * explicit opt-in, not silent persistence.
 */
let currentExport: ParsedExport | null = null;
const listeners = new Set<() => void>();

function setParsedExport(next: ParsedExport | null) {
  currentExport = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentExport;
}

export function useExportStore<T>(selector: (state: {
  parsedExport: ParsedExport | null;
  setParsedExport: (next: ParsedExport | null) => void;
}) => T): T {
  const parsedExport = useSyncExternalStore(subscribe, getSnapshot);
  return selector({ parsedExport, setParsedExport });
}
