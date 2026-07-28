import type { InstagramProfile } from "@/types/results";

export function sortByUsername(
  profiles: InstagramProfile[],
  direction: "asc" | "desc" = "asc",
): InstagramProfile[] {
  const sorted = [...profiles].sort((a, b) =>
    a.username.localeCompare(b.username, undefined, { sensitivity: "base" }),
  );
  return direction === "asc" ? sorted : sorted.reverse();
}
