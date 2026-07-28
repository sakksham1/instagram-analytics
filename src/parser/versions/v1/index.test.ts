import { describe, it, expect } from "vitest";
import { v1Parser } from "@/parser/versions/v1";
import followersFixture from "@/data/sample/followers_1.json";
import followingFixture from "@/data/sample/following.json";

const PATHS = [
  "connections/followers_and_following/followers_1.json",
  "connections/followers_and_following/following.json",
];

function buildFileMap() {
  return new Map<string, unknown>([
    ["followers", followersFixture],
    ["following", followingFixture],
  ]);
}

describe("v1Parser", () => {
  it("detects a valid v1 export by filename", () => {
    expect(v1Parser.selectFiles(PATHS)).toEqual({
      followers: PATHS[0],
      following: PATHS[1],
    });
  });

  it("returns null when following.json is missing", () => {
    expect(v1Parser.selectFiles(["followers_1.json"])).toBeNull();
  });

  it("parses followers and following into domain profiles", async () => {
    const result = await v1Parser.parse(buildFileMap());
    expect(result.parserVersion).toBe("v1");
    expect(result.followers.map((p) => p.username)).toEqual(["alice", "bob", "carol"]);
    expect(result.following.map((p) => p.username)).toEqual(["alice", "dave"]);
  });
});