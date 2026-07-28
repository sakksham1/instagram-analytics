import JSZip from "jszip";

export interface ZipEntry {
  path: string;
  /** Lazily read on demand so large exports don't all sit in memory at once. */
  text(): Promise<string>;
}

/**
 * Thin abstraction over JSZip so the rest of the app depends on this
 * interface, not on JSZip's API directly — if the ZIP library ever needs
 * to change, only this file changes.
 */
export async function readZip(file: File | Blob): Promise<ZipEntry[]> {
  const zip = await JSZip.loadAsync(file);
  const entries: ZipEntry[] = [];

  zip.forEach((relativePath, zipObject) => {
    if (zipObject.dir) return;
    entries.push({
      path: relativePath,
      text: () => zipObject.async("string"),
    });
  });

  return entries;
}
