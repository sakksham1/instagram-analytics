import { z } from "zod";
import type { ExportParser } from "@/parser/types";
import { ParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";

/**
 * Parser V2: Instagram's export format as of 2026. Same overall layout
 * as v1 (bare array for followers, `relationships_following` wrapper
 * for following), but `string_list_data` entries no longer always
 * include `value` — the username now lives on the item's `title`, and
 * `href` points through an `/_u/<username>` redirect instead of
 * straight at the profile.
 */

const listEntrySchema = z.object({
  href: z.string().optional(),
  value: z.string().optional(),
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

type ListItem = z.infer<typeof listItemSchema>;

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

function usernameFromHref(href?: string): string | undefined {
  if (!href) return undefined;
  return href.match(/instagram\.com\/(?:_u\/)?([^/?#]+)/i)?.[1];
}

function toProfiles(items: ListItem[]) {
  return items
    .map((item) => {
      const entry = item.string_list_data[0];
      const username = entry?.value || item.title || usernameFromHref(entry?.href);
      if (!username) return undefined;
      return {
        username,
        // Only trust the raw href when it's an old-style direct link
        // (i.e. `value` was present); otherwise build a clean profile URL
        // instead of the `/_u/` redirect link.
        profileUrl: entry?.value && entry.href ? entry.href : `https://www.instagram.com/${username}`,
        followedOrFollowingSince: entry?.timestamp,
      };
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export const v2Parser: ExportParser = {
  id: "v2",
  label: "Instagram export (2026 format)",

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
      throw new ParserError("followers file did not match expected shape", "v2");
    }
    const followingResult = followingFileSchema.safeParse(rawFollowing);
    if (!followingResult.success) {
      throw new ParserError("following file did not match expected shape", "v2");
    }

    return {
      followers: toProfiles(followersResult.data),
      following: toProfiles(followingResult.data.relationships_following),
      parserVersion: "v2",
    };
  },
};