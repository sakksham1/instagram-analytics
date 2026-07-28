/**
 * Shapes of the *raw* JSON files inside an Instagram "Download your
 * information" export. These have changed across Instagram's export
 * versions and will change again — that's exactly why nothing outside
 * `src/parser/**` should import these directly. Parsers translate raw
 * shapes like these into the stable domain types in `results.ts`.
 */

export interface InstagramStringListEntry {
  href?: string;
  value: string;
  timestamp?: number;
}

export interface InstagramListItem {
  title?: string;
  media_list_data?: unknown[];
  string_list_data: InstagramStringListEntry[];
}

/** followers_1.json (and similar): a bare array of list items. */
export type RawFollowersFile = InstagramListItem[];

/** following.json: list items wrapped under relationships_following. */
export interface RawFollowingFile {
  relationships_following: InstagramListItem[];
}
