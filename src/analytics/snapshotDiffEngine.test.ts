import { describe, it, expect } from "vitest";
import { diffSnapshots } from "@/analytics/snapshotDiffEngine";
import type { InstagramProfile, ParsedExport } from "@/types/results";

function profile(username: string): InstagramProfile {
  return { username };
}

function exportOf(followers: string[], following: string[]): ParsedExport {
  return {
    followers: followers.map(profile),
    following: following.map(profile),
    parserVersion: "v1",
  };
}

describe("diffSnapshots", () => {
  it("detects lost followers between two snapshots", () => {
    const before = exportOf(["alice", "bob", "carol"], ["alice"]);
    const after = exportOf(["alice", "carol"], ["alice"]);
    const diff = diffSnapshots(before, after);
    expect(diff.lostFollowers.map((p) => p.username)).toEqual(["bob"]);
    expect(diff.newFollowers).toEqual([]);
  });

  it("detects new followers between two snapshots", () => {
    const before = exportOf(["alice"], []);
    const after = exportOf(["alice", "dave"], []);
    const diff = diffSnapshots(before, after);
    expect(diff.newFollowers.map((p) => p.username)).toEqual(["dave"]);
  });

  it("detects changes to who you follow independently of followers", () => {
    const before = exportOf([], ["alice", "bob"]);
    const after = exportOf([], ["alice"]);
    const diff = diffSnapshots(before, after);
    expect(diff.lostFollowing.map((p) => p.username)).toEqual(["bob"]);
    expect(diff.newFollowing).toEqual([]);
  });

  it("is case-insensitive when matching usernames", () => {
    const before = exportOf(["Alice"], []);
    const after = exportOf(["alice"], []);
    const diff = diffSnapshots(before, after);
    expect(diff.lostFollowers).toEqual([]);
    expect(diff.newFollowers).toEqual([]);
  });

  it("returns empty diffs for identical snapshots", () => {
    const snap = exportOf(["alice", "bob"], ["alice"]);
    const diff = diffSnapshots(snap, snap);
    expect(diff.newFollowers).toEqual([]);
    expect(diff.lostFollowers).toEqual([]);
    expect(diff.newFollowing).toEqual([]);
    expect(diff.lostFollowing).toEqual([]);
  });
});
