import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ExportSnapshot } from "@/types/results";

export function SnapshotList({
  snapshots,
  onSave,
  onDelete,
  canSave,
}: {
  snapshots: ExportSnapshot[];
  onSave: () => void;
  onDelete: (id: string) => void;
  canSave: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>Saved snapshots</CardTitle>
        <Button size="sm" onClick={onSave} disabled={!canSave}>
          <Camera className="h-4 w-4" /> Save current export
        </Button>
      </div>

      {snapshots.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No snapshots yet"
          description="Save a snapshot of your current export, then come back and upload a newer export later to see who unfollowed you in between."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {snapshots.map((snap) => (
            <li key={snap.id}>
              <Card className="flex flex-row items-center justify-between py-3">
                <div>
                  <p className="text-sm text-ink-50">{snap.label}</p>
                  <CardDescription>
                    {snap.parsedExport.followers.length} followers ·{" "}
                    {snap.parsedExport.following.length} following
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(snap.id)}
                  aria-label={`Delete snapshot ${snap.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
