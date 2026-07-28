import type { InstagramProfile } from "@/types/results";

/** Escapes a field for CSV per RFC 4180 (quotes doubled, wrapped if needed). */
function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function profilesToCsv(profiles: InstagramProfile[]): string {
  const header = "username,profile_url,timestamp";
  const rows = profiles.map((p) =>
    [p.username, p.profileUrl ?? "", p.followedOrFollowingSince ?? ""]
      .map((field) => escapeCsvField(String(field)))
      .join(","),
  );
  return [header, ...rows].join("\n");
}

export function profilesToTxt(profiles: InstagramProfile[]): string {
  return profiles.map((p) => p.username).join("\n");
}
