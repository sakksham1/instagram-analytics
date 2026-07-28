import { useExportStore } from "@/app/exportStore";
import { useSnapshots } from "@/features/unfollowers-tracker/hooks/useSnapshots";
import { useUnfollowerEvents } from "@/features/unfollowers-tracker/hooks/useUnfollowerEvents";
import { SnapshotList } from "@/features/unfollowers-tracker/components/SnapshotList";
import { UnfollowerEventsList } from "@/features/unfollowers-tracker/components/UnfollowerEventsList";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UnfollowersPage() {
  const parsedExport = useExportStore((s) => s.parsedExport);
  const { snapshots, state, save, remove } = useSnapshots();
  const events = useUnfollowerEvents(snapshots);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-ink-50">Unfollowers over time</h1>
        <p className="mt-1 text-sm text-ink-400">
          Save a snapshot each time you analyze an export. Next time you upload a newer
          one, come back here to see who unfollowed you in between — snapshots are
          stored locally in this browser only and never leave your device.
        </p>
      </div>

      <Card>
        {state === "loading" ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        ) : (
          <SnapshotList
            snapshots={snapshots}
            canSave={Boolean(parsedExport)}
            onSave={() => parsedExport && save(parsedExport)}
            onDelete={remove}
          />
        )}
      </Card>

      <div>
        <CardTitle className="mb-3">Unfollow history</CardTitle>
        <UnfollowerEventsList events={events} />
      </div>
    </div>
  );
}
