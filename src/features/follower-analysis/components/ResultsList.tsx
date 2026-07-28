import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InstagramProfile } from "@/types/results";

function CopyButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(username);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      aria-label={`Copy ${username}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function ResultsList({ profiles }: { profiles: InstagramProfile[] }) {
  if (profiles.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-400">No matches.</p>;
  }

  return (
    <ul className="divide-y divide-ink-800">
      {profiles.map((profile) => (
        <li key={profile.username} className="flex items-center justify-between py-2">
          {profile.profileUrl ? (
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-ink-50 hover:underline"
            >
              @{profile.username}
            </a>
          ) : (
            <span className="text-sm text-ink-50">@{profile.username}</span>
          )}
          <CopyButton username={profile.username} />
        </li>
      ))}
    </ul>
  );
}
