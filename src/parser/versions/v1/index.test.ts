import { describe, it, expect } from "vitest";
import { v1Parser } from "@/parser/versions/v1";
import followersFixture from "@/data/sample/followers_1.json";
import followingFixture from "@/data/sample/following.json";

function buildFileMap() {
  return new Map<string, unknown>([
    ["connections/followers_and_following/followers_1.json", followersFixture],
    ["connections/followers_and_following/following.json", followingFixture],
  ]);
}

describe("v1Parser", () => {
  it("detects a valid v1 export", () => {
    expect(v1Parser.canParse(buildFileMap())).toBe(true);
  });

  it("rejects a file map missing following.json", () => {
    const files = new Map<string, unknown>([
      ["followers_1.json", followersFixture],
    ]);
    expect(v1Parser.canParse(files)).toBe(false);
  });

  it("parses followers and following into domain profiles", async () => {
    const result = await v1Parser.parse(buildFileMap());
    expect(result.parserVersion).toBe("v1");
    expect(result.followers.map((p) => p.username)).toEqual(["alice", "bob", "carol"]);
    expect(result.following.map((p) => p.username)).toEqual(["alice", "dave"]);
  });
});
