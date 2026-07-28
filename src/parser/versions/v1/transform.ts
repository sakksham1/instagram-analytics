import type { InstagramListItem } from "@/types/instagram";
import type { InstagramProfile } from "@/types/results";

/** Converts raw v1 list items into the stable InstagramProfile domain type. */
export function toProfiles(items: InstagramListItem[]): InstagramProfile[] {
  return items
    .map((item) => item.string_list_data[0])
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry?.value))
    .map((entry) => ({
      username: entry.value,
      profileUrl: entry.href,
      followedOrFollowingSince: entry.timestamp,
    }));
}
