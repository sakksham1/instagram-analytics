import type { ZipEntry } from "@/parser/zip/zipReader";

/**
 * Reads and JSON.parses every *.json entry in the export into a
 * `Map<path, parsedContent>`. Parsers then look up files by name pattern
 * (see each version's `find*File` helpers) rather than the caller needing
 * to know Instagram's folder layout.
 *
 * Files that fail to parse as JSON are skipped rather than throwing, since
 * an export ZIP legitimately contains non-JSON files (images, HTML, etc.)
 * that parsers simply don't care about.
 */
export async function extractJsonFiles(
  entries: ZipEntry[],
): Promise<Map<string, unknown>> {
  const files = new Map<string, unknown>();

  const jsonEntries = entries.filter((e) => e.path.toLowerCase().endsWith(".json"));

  await Promise.all(
    jsonEntries.map(async (entry) => {
      try {
        const text = await entry.text();
        files.set(entry.path, JSON.parse(text));
      } catch {
        // Not valid JSON, or unreadable — ignore, it's not a file our
        // parsers are looking for.
      }
    }),
  );

  return files;
}
