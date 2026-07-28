import type { InstagramProfile } from "@/types/results";
import { profilesToCsv, profilesToTxt } from "@/utils/csv";

/**
 * Triggers a browser-side file download. No network, no backend — the
 * Blob is constructed and downloaded entirely client-side, consistent
 * with the "data never leaves your computer" principle.
 */
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportProfilesAsCsv(profiles: InstagramProfile[], filename: string) {
  downloadBlob(profilesToCsv(profiles), filename, "text/csv;charset=utf-8");
}

export function exportProfilesAsTxt(profiles: InstagramProfile[], filename: string) {
  downloadBlob(profilesToTxt(profiles), filename, "text/plain;charset=utf-8");
}
