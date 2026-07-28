import { describe, it, expect } from "vitest";
import { profilesToCsv, profilesToTxt } from "@/utils/csv";

describe("profilesToCsv", () => {
  it("escapes commas in fields", () => {
    const csv = profilesToCsv([{ username: "a,b" }]);
    expect(csv).toContain('"a,b"');
  });

  it("includes a header row", () => {
    const csv = profilesToCsv([]);
    expect(csv.split("\n")[0]).toBe("username,profile_url,timestamp");
  });
});

describe("profilesToTxt", () => {
  it("joins usernames with newlines", () => {
    expect(profilesToTxt([{ username: "a" }, { username: "b" }])).toBe("a\nb");
  });
});
