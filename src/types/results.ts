/**
 * Stable, parser-agnostic domain types. Every parser version must produce
 * these shapes. Analytics, UI, and export code should only ever depend on
 * this file — never on raw Instagram JSON shapes.
 */

export interface InstagramProfile {
  username: string;
  profileUrl?: string;
  /** Unix seconds, if the export included one. */
  followedOrFollowingSince?: number;
}

export interface ParsedExport {
  followers: InstagramProfile[];
  following: InstagramProfile[];
  /** Which parser produced this, for debugging/telemetry-free diagnostics. */
  parserVersion: string;
}

export interface FollowerComparisonResult {
  notFollowingBack: InstagramProfile[]; // I follow them, they don't follow me
  notFollowedBack: InstagramProfile[]; // They follow me, I don't follow them
  mutual: InstagramProfile[];
  counts: {
    followers: number;
    following: number;
    mutual: number;
    notFollowingBack: number;
    notFollowedBack: number;
  };
}

/**
 * A user-initiated, point-in-time capture of a ParsedExport, persisted
 * locally (see `src/app/snapshotStore.ts`) so the unfollowers-tracker
 * feature can diff "then" vs "now". Nothing about this is automatic —
 * a snapshot only exists because someone clicked "Save snapshot".
 */
export interface ExportSnapshot {
  id: string;
  /** User-facing label; defaults to a formatted timestamp if not set. */
  label: string;
  /** Unix milliseconds. */
  capturedAt: number;
  parsedExport: ParsedExport;
}

/** Set-difference between two ParsedExport snapshots, by username. */
export interface SnapshotDiffResult {
  newFollowers: InstagramProfile[]; // started following you
  lostFollowers: InstagramProfile[]; // unfollowed you
  newFollowing: InstagramProfile[]; // you started following
  lostFollowing: InstagramProfile[]; // you unfollowed
}

/** A single "this person unfollowed you" event, anchored to the snapshot
 * pair it was detected between, for display in a chronological list. */
export interface UnfollowerEvent {
  username: string;
  profileUrl?: string;
  fromSnapshotId: string;
  toSnapshotId: string;
  toSnapshotCapturedAt: number;
}
