import { useMemo, useState } from "react";
import { followerComparisonEngine } from "@/analytics/comparisonEngine";
import { sortByUsername } from "@/utils/sorting";
import type { InstagramProfile } from "@/types/results";

export type ResultTab = "notFollowingBack" | "notFollowedBack" | "mutual";

/**
 * Derives comparison results plus the search/sort UI state layered on top
 * of them. Comparison itself is delegated to the pure analytics engine;
 * this hook only owns view state (active tab, search query).
 */
export function useFollowerComparison(
  followers: InstagramProfile[],
  following: InstagramProfile[],
) {
  const [activeTab, setActiveTab] = useState<ResultTab>("notFollowingBack");
  const [query, setQuery] = useState("");

  const result = useMemo(
    () => followerComparisonEngine.compare(followers, following),
    [followers, following],
  );

  const activeList = useMemo(() => {
    const list = result[activeTab];
    const filtered = query
      ? list.filter((p) => p.username.toLowerCase().includes(query.toLowerCase()))
      : list;
    return sortByUsername(filtered);
  }, [result, activeTab, query]);

  return { result, activeTab, setActiveTab, query, setQuery, activeList };
}
