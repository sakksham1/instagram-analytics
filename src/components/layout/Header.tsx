import { Link, NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Upload", end: true },
  { to: "/analysis", label: "Analysis", end: false },
  { to: "/unfollowers", label: "Unfollowers", end: false },
];

/**
 * App-wide header. Deliberately says what the product does NOT do
 * (no login, no upload to a server) right in the chrome — this is the
 * product's core trust claim, not just a tagline.
 */
export function Header() {
  return (
    <header className="border-b border-ink-800">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="font-display text-lg tracking-tight text-ink-50">
          instagram-analytics
        </Link>

        <nav className="flex items-center gap-1 rounded-md bg-ink-900 p-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-sm px-3 py-1.5 text-sm transition-colors",
                  isActive ? "bg-ink-700 text-ink-50" : "text-ink-400 hover:text-ink-50",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-xs text-ink-400">
          <ShieldCheck className="h-4 w-4 text-signal-mutual" aria-hidden />
          <span>Runs locally. Nothing is uploaded.</span>
        </div>
      </div>
    </header>
  );
}
