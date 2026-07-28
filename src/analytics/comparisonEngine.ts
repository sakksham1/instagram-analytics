import type { InstagramProfile, FollowerComparisonResult } from "@/types/results";
import type { ComparisonEngine } from "@/analytics/types";

/**
 * Pure, synchronous set comparison. Deliberately has no knowledge of
 * parsing, UI, or export — feed it two profile lists, get counts and
 * buckets back. Kept pure so it's trivial to unit test and to reuse from
 * a future "compare two exports over time" feature.
 */
function byUsername(profiles: InstagramProfile[]): Map<string, InstagramProfile> {
  return new Map(profiles.map((p) => [p.username.toLowerCase(), p]));
}

export const followerComparisonEngine: ComparisonEngine = {
  compare(followers, following): FollowerComparisonResult {
    const followerMap = byUsername(followers);
    const followingMap = byUsername(following);

    const notFollowingBack: InstagramProfile[] = [];
    const mutual: InstagramProfile[] = [];
    for (const [username, profile] of followingMap) {
      if (followerMap.has(username)) {
        mutual.push(profile);
      } else {
        notFollowingBack.push(profile);
      }
    }

    const notFollowedBack: InstagramProfile[] = [];
    for (const [username, profile] of followerMap) {
      if (!followingMap.has(username)) {
        notFollowedBack.push(profile);
      }
    }

    return {
      notFollowingBack,
      notFollowedBack,
      mutual,
      counts: {
        followers: followers.length,
        following: following.length,
        mutual: mutual.length,
        notFollowingBack: notFollowingBack.length,
        notFollowedBack: notFollowedBack.length,
      },
    };
  },
};
