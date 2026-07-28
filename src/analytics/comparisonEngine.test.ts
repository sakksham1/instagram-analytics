import { describe, it, expect } from "vitest";
import { followerComparisonEngine } from "@/analytics/comparisonEngine";
import type { InstagramProfile } from "@/types/results";

function profile(username: string): InstagramProfile {
  return { username };
}

describe("followerComparisonEngine", () => {
  const followers = [profile("alice"), profile("bob"), profile("carol")];
  const following = [profile("alice"), profile("dave")];

  it("finds mutual follows", () => {
    const result = followerComparisonEngine.compare(followers, following);
    expect(result.mutual.map((p) => p.username)).toEqual(["alice"]);
  });

  it("finds people the user follows who don't follow back", () => {
    const result = followerComparisonEngine.compare(followers, following);
    expect(result.notFollowingBack.map((p) => p.username)).toEqual(["dave"]);
  });

  it("finds followers the user doesn't follow back", () => {
    const result = followerComparisonEngine.compare(followers, following);
    expect(result.notFollowedBack.map((p) => p.username).sort()).toEqual(["bob", "carol"]);
  });

  it("is case-insensitive when matching usernames", () => {
    const result = followerComparisonEngine.compare(
      [profile("Alice")],
      [profile("alice")],
    );
    expect(result.mutual).toHaveLength(1);
  });

  it("produces correct counts", () => {
    const result = followerComparisonEngine.compare(followers, following);
    expect(result.counts).toEqual({
      followers: 3,
      following: 2,
      mutual: 1,
      notFollowingBack: 1,
      notFollowedBack: 2,
    });
  });
});
