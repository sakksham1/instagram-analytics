import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

/**
 * App-wide header. Deliberately says what the product does NOT do
 * (no login, no upload to a server) right in the chrome — this is the
 * product's core trust claim, not just a tagline.
 */
export function Header() {
  return (
    <header className="border-b border-ink-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg tracking-tight">
          instagram-analytics
        </Link>
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <ShieldCheck className="h-4 w-4 text-signal-mutual" aria-hidden />
          <span>Runs locally. Nothing is uploaded.</span>
        </div>
      </div>
    </header>
  );
}
