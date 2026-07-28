import { useCallback, useEffect, useState } from "react";
import * as snapshotStore from "@/app/snapshotStore";
import type { ExportSnapshot, ParsedExport } from "@/types/results";

type LoadState = "loading" | "ready" | "error";

/**
 * Thin view-state wrapper around `snapshotStore` (view state only —
 * persistence itself lives in the store, matching how
 * `useFollowerComparison` sits on top of the pure comparison engine).
 */
export function useSnapshots() {
  const [snapshots, setSnapshots] = useState<ExportSnapshot[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  const refresh = useCallback(async () => {
    try {
      setSnapshots(await snapshotStore.listSnapshots());
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (parsedExport: ParsedExport, label?: string) => {
      await snapshotStore.saveSnapshot(parsedExport, label);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await snapshotStore.deleteSnapshot(id);
      await refresh();
    },
    [refresh],
  );

  return { snapshots, state, save, remove, refresh };
}
