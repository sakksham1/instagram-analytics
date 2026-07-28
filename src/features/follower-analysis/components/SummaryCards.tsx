import { Users, UserCheck, Repeat, UserMinus, UserPlus } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/utils/formatters";
import type { FollowerComparisonResult } from "@/types/results";

const ITEMS = [
  { key: "followers", label: "Followers", icon: Users, tone: "text-ink-50" },
  { key: "following", label: "Following", icon: UserCheck, tone: "text-ink-50" },
  { key: "mutual", label: "Mutual", icon: Repeat, tone: "text-signal-mutual" },
  { key: "notFollowingBack", label: "Don't follow back", icon: UserMinus, tone: "text-signal-lost" },
  { key: "notFollowedBack", label: "Not followed back", icon: UserPlus, tone: "text-signal-gained" },
] as const;

export function SummaryCards({ counts }: { counts: FollowerComparisonResult["counts"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ITEMS.map(({ key, label, icon: Icon, tone }) => (
        <Card key={key} className="flex flex-col items-center gap-1 text-center">
          <Icon className={`h-4 w-4 ${tone}`} aria-hidden />
          <CardTitle className={`font-mono ${tone}`}>{formatCount(counts[key])}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </Card>
      ))}
    </div>
  );
}
