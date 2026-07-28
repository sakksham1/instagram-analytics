// src/features/follower-analysis/components/SummaryCards.tsx
import { motion } from "framer-motion";
import { Users, UserCheck, Repeat, UserMinus, UserPlus } from "lucide-react";
import { Card, CardDescription } from "@/components/ui/card";
import { useCountUp } from "@/hooks/useCountUp";
import { formatCount } from "@/utils/formatters";
import type { FollowerComparisonResult } from "@/types/results";

const SMALL_ITEMS = [
  { key: "followers", label: "Followers", icon: Users, tone: "text-ink-50" },
  { key: "following", label: "Following", icon: UserCheck, tone: "text-ink-50" },
  { key: "notFollowingBack", label: "Don't follow back", icon: UserMinus, tone: "text-signal-lost" },
  { key: "notFollowedBack", label: "Not followed back", icon: UserPlus, tone: "text-signal-gained" },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function AnimatedStat({ value, className }: { value: number; className?: string }) {
  const animated = useCountUp(value);
  return <span className={className}>{formatCount(animated)}</span>;
}

export function SummaryCards({ counts }: { counts: FollowerComparisonResult["counts"] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {/* Mutual gets the big hero tile — it's the "good news" stat */}
      <motion.div variants={item} className="col-span-2 sm:col-span-1 sm:row-span-2">
        <Card className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-ink-900 to-ink-800 py-8 text-center">
          <Repeat className="h-6 w-6 text-signal-mutual" aria-hidden />
          <AnimatedStat
            value={counts.mutual}
            className="font-display text-4xl text-signal-mutual"
          />
          <CardDescription className="text-sm">Mutual follows</CardDescription>
        </Card>
      </motion.div>

      {SMALL_ITEMS.map(({ key, label, icon: Icon, tone }) => (
        <motion.div key={key} variants={item}>
          <Card className="flex flex-col items-center gap-1 py-4 text-center">
            <Icon className={`h-4 w-4 ${tone}`} aria-hidden />
            <AnimatedStat
              value={counts[key]}
              className={`font-mono font-display text-2xl ${tone}`}
            />
            <CardDescription>{label}</CardDescription>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}