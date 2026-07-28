import type { InstagramProfile, ParsedExport, SnapshotDiffResult } from "@/types/results";

/**
 * Diffs two ParsedExport snapshots by username. Pure and synchronous,
 * same spirit as `comparisonEngine.ts` — no I/O, no React, easy to unit
 * test, and reusable outside the unfollowers-tracker feature (e.g. a
 * future "growth over time" view) since it only depends on the stable
 * ParsedExport shape.
 */
function byUsername(profiles: InstagramProfile[]): Map<string, InstagramProfile> {
  return new Map(profiles.map((p) => [p.username.toLowerCase(), p]));
}

function diffSet(
  before: Map<string, InstagramProfile>,
  after: Map<string, InstagramProfile>,
): { added: InstagramProfile[]; removed: InstagramProfile[] } {
  const added: InstagramProfile[] = [];
  const removed: InstagramProfile[] = [];

  for (const [username, profile] of after) {
    if (!before.has(username)) added.push(profile);
  }
  for (const [username, profile] of before) {
    if (!after.has(username)) removed.push(profile);
  }

  return { added, removed };
}

export function diffSnapshots(before: ParsedExport, after: ParsedExport): SnapshotDiffResult {
  const followers = diffSet(byUsername(before.followers), byUsername(after.followers));
  const following = diffSet(byUsername(before.following), byUsername(after.following));

  return {
    newFollowers: followers.added,
    lostFollowers: followers.removed,
    newFollowing: following.added,
    lostFollowing: following.removed,
  };
}
