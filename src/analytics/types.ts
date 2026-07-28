import type { InstagramProfile, FollowerComparisonResult } from "@/types/results";

/**
 * Contract for a comparison/analytics engine. V1 ships one implementation
 * (follower vs following). Future modules (growth-over-time, engagement,
 * story interactions, etc. — see README) should each define their own
 * narrow interface here rather than overloading this one.
 */
export interface ComparisonEngine {
  compare(followers: InstagramProfile[], following: InstagramProfile[]): FollowerComparisonResult;
}
