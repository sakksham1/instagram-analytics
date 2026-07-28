import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  key: T;
  label: string;
  count?: number;
}

/** Segmented tab bar. Generic over the tab-key union so callers get
 * exhaustiveness checking on `active`/`onChange` (see ResultTab in
 * useFollowerComparison for the pattern this was extracted from). */
export function Tabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md bg-ink-900 p-1">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-sm transition-colors",
            active === item.key ? "bg-ink-700 text-ink-50" : "text-ink-400 hover:text-ink-50",
          )}
        >
          {item.label}
          {item.count !== undefined && ` (${item.count})`}
        </button>
      ))}
    </div>
  );
}
