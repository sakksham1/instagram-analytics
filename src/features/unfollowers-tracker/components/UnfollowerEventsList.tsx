import { UserMinus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import type { UnfollowerEvent } from "@/types/results";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UnfollowerEventsList({ events }: { events: UnfollowerEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={UserMinus}
        title="No unfollows detected yet"
        description="Once you've saved two or more snapshots over time, anyone who stopped following you between them shows up here."
      />
    );
  }

  return (
    <ul className="divide-y divide-ink-800">
      {events.map((event, i) => (
        <li
          key={`${event.username}-${event.toSnapshotId}-${i}`}
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <Badge tone="lost">unfollowed</Badge>
            {event.profileUrl ? (
              <a
                href={event.profileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-ink-50 hover:underline"
              >
                @{event.username}
              </a>
            ) : (
              <span className="text-sm text-ink-50">@{event.username}</span>
            )}
          </div>
          <span className="text-xs text-ink-400">{formatDate(event.toSnapshotCapturedAt)}</span>
        </li>
      ))}
    </ul>
  );
}
