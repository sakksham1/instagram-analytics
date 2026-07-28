import { z } from "zod";
import type { ExportParser, FileSelection } from "@/parser/types";
import { ParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";

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

function findPath(paths: string[], pattern: RegExp): string | undefined {
  return paths.find((path) => pattern.test(path));
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
        profileUrl:
          entry?.value && entry.href ? entry.href : `https://www.instagram.com/${username}`,
        followedOrFollowingSince: entry?.timestamp,
      };
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export const v2Parser: ExportParser = {
  id: "v2",
  label: "Instagram export (2026 format)",

  selectFiles(paths): FileSelection | null {
    const followers = findPath(paths, /followers.*\.json$/i);
    const following = findPath(paths, /following\.json$/i);
    if (!followers || !following) return null;
    return { followers, following };
  },

  parse(files): ParsedExport {
    const followersResult = followersFileSchema.safeParse(files.get("followers"));
    if (!followersResult.success) {
      throw new ParserError("followers file did not match expected shape", "v2");
    }
    const followingResult = followingFileSchema.safeParse(files.get("following"));
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