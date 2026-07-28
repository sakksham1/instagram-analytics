import { z } from "zod";
import type { ExportParser, FileSelection } from "@/parser/types";
import { ParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";
import type { RawFollowersFile, RawFollowingFile } from "@/types/instagram";
import { toProfiles } from "@/parser/versions/v1/transform";

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

function findPath(paths: string[], pattern: RegExp): string | undefined {
  return paths.find((path) => pattern.test(path));
}

export const v1Parser: ExportParser = {
  id: "v1",
  label: "Instagram export (followers/following JSON)",

  selectFiles(paths): FileSelection | null {
    const followers = findPath(paths, /followers.*\.json$/i);
    const following = findPath(paths, /following\.json$/i);
    if (!followers || !following) return null;
    return { followers, following };
  },

  parse(files): ParsedExport {
    const followersResult = followersFileSchema.safeParse(files.get("followers"));
    if (!followersResult.success) {
      throw new ParserError("followers file did not match expected shape", "v1");
    }
    const followingResult = followingFileSchema.safeParse(files.get("following"));
    if (!followingResult.success) {
      throw new ParserError("following file did not match expected shape", "v1");
    }

    const followers = followersResult.data as RawFollowersFile;
    const following = (followingResult.data as RawFollowingFile).relationships_following;

    return {
      followers: toProfiles(followers),
      following: toProfiles(following),
      parserVersion: "v1",
    };
  },
};