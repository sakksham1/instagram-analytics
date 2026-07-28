import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/utils/formatters";
import type { FollowerComparisonResult } from "@/types/results";

export function SummaryCards({ counts }: { counts: FollowerComparisonResult["counts"] }) {
  const items = [
    { label: "Followers", value: counts.followers },
    { label: "Following", value: counts.following },
    { label: "Mutual", value: counts.mutual },
    { label: "Don't follow back", value: counts.notFollowingBack },
    { label: "Not followed back", value: counts.notFollowedBack },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <CardTitle className="font-mono">{formatCount(item.value)}</CardTitle>
          <CardDescription>{item.label}</CardDescription>
        </Card>
      ))}
    </div>
  );
}
