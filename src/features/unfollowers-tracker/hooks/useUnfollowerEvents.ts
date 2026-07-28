import { useMemo } from "react";
import { diffSnapshots } from "@/analytics/snapshotDiffEngine";
import type { ExportSnapshot, UnfollowerEvent } from "@/types/results";

/**
 * Turns a chronological list of snapshots into a flat, newest-first list
 * of "who unfollowed you" events between each consecutive pair. Only
 * `lostFollowers` is surfaced here; the rest of `SnapshotDiffResult`
 * (new followers, following changes) is available for a future
 * "growth over time" view without any changes to the diff engine.
 */
export function useUnfollowerEvents(snapshots: ExportSnapshot[]): UnfollowerEvent[] {
  return useMemo(() => {
    const events: UnfollowerEvent[] = [];

    for (let i = 1; i < snapshots.length; i++) {
      const before = snapshots[i - 1];
      const after = snapshots[i];
      if (!before || !after) continue;
      const diff = diffSnapshots(before.parsedExport, after.parsedExport);

      for (const profile of diff.lostFollowers) {
        events.push({
          username: profile.username,
          profileUrl: profile.profileUrl,
          fromSnapshotId: before.id,
          toSnapshotId: after.id,
          toSnapshotCapturedAt: after.capturedAt,
        });
      }
    }

    return events.sort((a, b) => b.toSnapshotCapturedAt - a.toSnapshotCapturedAt);
  }, [snapshots]);
}
