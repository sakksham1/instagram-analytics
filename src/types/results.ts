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
