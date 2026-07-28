import type { ExportSnapshot, ParsedExport } from "@/types/results";

/**
 * Opt-in local persistence for export snapshots, used by the
 * unfollowers-tracker feature to diff "who changed" between two points
 * in time. Deliberately separate from `exportStore.ts` (today's
 * in-memory, cleared-on-refresh export) — snapshots are the one thing in
 * this app that *do* persist, and only because the user explicitly asked
 * to save one (see `saveSnapshot`). Nothing here runs automatically or in
 * the background, and nothing here ever leaves the browser: it's plain
 * IndexedDB, no server, no sync. See the Privacy notes in the README.
 */

const DB_NAME = "instagram-analytics";
const DB_VERSION = 1;
const STORE_NAME = "snapshots";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const request = run(tx.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `snap_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/** Persists a new snapshot of the given export. This is the only place
 * data is written to disk in the whole app — always a direct result of
 * a user action, never triggered implicitly. */
export async function saveSnapshot(
  parsedExport: ParsedExport,
  label?: string,
): Promise<ExportSnapshot> {
  const snapshot: ExportSnapshot = {
    id: makeId(),
    label: label?.trim() || new Date().toLocaleString(),
    capturedAt: Date.now(),
    parsedExport,
  };
  await withStore("readwrite", (store) => store.put(snapshot));
  return snapshot;
}

/** All saved snapshots, oldest first (the order the diff engine expects). */
export async function listSnapshots(): Promise<ExportSnapshot[]> {
  const all = await withStore<ExportSnapshot[]>("readonly", (store) => store.getAll());
  return all.sort((a, b) => a.capturedAt - b.capturedAt);
}

export async function deleteSnapshot(id: string): Promise<void> {
  await withStore("readwrite", (store) => store.delete(id));
}

/** Full opt-out: wipes every locally-stored snapshot. */
export async function clearAllSnapshots(): Promise<void> {
  await withStore("readwrite", (store) => store.clear());
}
