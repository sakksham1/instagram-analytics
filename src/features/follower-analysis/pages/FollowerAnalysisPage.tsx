import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { useExportStore } from "@/app/exportStore";
import { useFollowerComparison, type ResultTab } from "@/features/follower-analysis/hooks/useFollowerComparison";
import { SummaryCards } from "@/features/follower-analysis/components/SummaryCards";
import { SearchBar } from "@/features/follower-analysis/components/SearchBar";
import { ResultsList } from "@/features/follower-analysis/components/ResultsList";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { exportProfilesAsCsv, exportProfilesAsTxt } from "@/services/exportService";

const TABS: { key: ResultTab; label: string }[] = [
  { key: "notFollowingBack", label: "You don't follow back" },
  { key: "notFollowedBack", label: "Not following you back" },
  { key: "mutual", label: "Mutual 🤝" },
];

export function FollowerAnalysisPage() {
  const parsedExport = useExportStore((s) => s.parsedExport);

  // Hooks must run unconditionally, so the comparison hook always runs —
  // with empty arrays when nothing is loaded — and the redirect happens
  // in the render output, not before the hook call.
  const { result, activeTab, setActiveTab, query, setQuery, activeList } =
    useFollowerComparison(
      parsedExport?.followers ?? [],
      parsedExport?.following ?? [],
    );

  // No export loaded (e.g. direct navigation or a page refresh, since the
  // export store is intentionally in-memory-only for privacy) -> back to upload.
  if (!parsedExport) return <Navigate to="/" replace />;

  const headline =
    result.counts.notFollowingBack === 0
      ? "Everyone follows you back. Clean sheet. 🎉"
      : `${result.counts.notFollowingBack} people don't follow you back 👀`;

  return (
    <div className="flex flex-col gap-6">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-2xl text-ink-50 sm:text-3xl"
      >
        {headline}
      </motion.h1>
      <SummaryCards counts={result.counts} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          items={TABS.map((tab) => ({ ...tab, count: result[tab.key].length }))}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportProfilesAsCsv(activeList, `${activeTab}.csv`)}
          >
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportProfilesAsTxt(activeList, `${activeTab}.txt`)}
          >
            <FileText className="h-4 w-4" /> TXT
          </Button>
        </div>
      </div>

      <SearchBar value={query} onChange={setQuery} />
      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ResultsList profiles={activeList} />
      </motion.div>
    </div>
  );
}
