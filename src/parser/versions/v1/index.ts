import { z } from "zod";
import type { ExportParser } from "@/parser/types";
import { ParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";
import type {
  RawFollowersFile,
  RawFollowingFile,
} from "@/types/instagram";
import { toProfiles } from "@/parser/versions/v1/transform";

/**
 * Parser V1: the export format Instagram has shipped since the "followers
 * and following" JSON structure was introduced (a bare array for
 * followers, a `relationships_following` wrapper for following).
 *
 * Detection is filename-based first (cheap), with a content shape check
 * as a fallback for renamed files, since Instagram has used slightly
 * different filenames (e.g. followers_1.json vs followers.json) across
 * export batches that are otherwise structurally identical.
 */

const listEntrySchema = z.object({
  href: z.string().optional(),
  value: z.string(),
  timestamp: z.number().optional(),
});

const listItemSchema = z.object({
  title: z.string().optional(),
  media_list_data: z.array(z.unknown()).optional(),
  string_list_data: z.array(listEntrySchema),
});

const followersFileSchema = z.array(listItemSchema);
const followingFileSchema = z.object({
  relationships_following: z.array(listItemSchema),
});

function findFollowersFile(files: Map<string, unknown>): unknown | undefined {
  for (const [name, content] of files) {
    if (/followers.*\.json$/i.test(name)) return content;
  }
  return undefined;
}

function findFollowingFile(files: Map<string, unknown>): unknown | undefined {
  for (const [name, content] of files) {
    if (/following\.json$/i.test(name)) return content;
  }
  return undefined;
}

export const v1Parser: ExportParser = {
  id: "v1",
  label: "Instagram export (followers/following JSON)",

  canParse(files) {
    const followers = findFollowersFile(files);
    const following = findFollowingFile(files);
    if (!followers || !following) return false;
    return (
      followersFileSchema.safeParse(followers).success &&
      followingFileSchema.safeParse(following).success
    );
  },

  parse(files): ParsedExport {
    const rawFollowers = findFollowersFile(files);
    const rawFollowing = findFollowingFile(files);

    const followersResult = followersFileSchema.safeParse(rawFollowers);
    if (!followersResult.success) {
      throw new ParserError("followers file did not match expected shape", "v1");
    }
    const followingResult = followingFileSchema.safeParse(rawFollowing);
    if (!followingResult.success) {
      throw new ParserError("following file did not match expected shape", "v1");
    }

    const followers = followersResult.data as RawFollowersFile;
    const following = (followingResult.data as RawFollowingFile)
      .relationships_following;

    return {
      followers: toProfiles(followers),
      following: toProfiles(following),
      parserVersion: "v1",
    };
  },
};
