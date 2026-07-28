import type { ExportParser, FileSelection } from "@/parser/types";
import { NoMatchingParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";
import type { Archive } from "@/parser/zip/zipReader";
import { v1Parser } from "@/parser/versions/v1";
import { v2Parser } from "@/parser/versions/v2";

/**
 * All available parsers, newest-first. Adding support for a new Instagram
 * export format means: implement ExportParser in `src/parser/versions/vN/`,
 * then add one line here.
 */
const PARSERS: ExportParser[] = [v2Parser, v1Parser];

/** Filename-only candidate check — no file contents read yet. */
function findCandidates(
  paths: string[],
): { parser: ExportParser; selection: FileSelection }[] {
  const candidates: { parser: ExportParser; selection: FileSelection }[] = [];
  for (const parser of PARSERS) {
    const selection = parser.selectFiles(paths);
    if (selection) candidates.push({ parser, selection });
  }
  return candidates;
}

/** Reads and JSON.parses only the files a candidate parser asked for. */
async function readSelection(
  archive: Archive,
  selection: FileSelection,
): Promise<Map<string, unknown>> {
  const files = new Map<string, unknown>();
  for (const [logicalName, path] of Object.entries(selection)) {
    const text = await archive.readText(path);
    files.set(logicalName, JSON.parse(text));
  }
  return files;
}

/**
 * Detects the right parser and parses the export — selectively. Only the
 * handful of files a matching parser actually needs ever get decompressed
 * out of the archive, no matter how large the rest of the export is.
 */
export async function parseWithBestMatch(archive: Archive): Promise<ParsedExport> {
  const paths = archive.entries.map((entry) => entry.path);
  const candidates = findCandidates(paths);
  if (candidates.length === 0) throw new NoMatchingParserError();

  let lastError: unknown;
  for (const { parser, selection } of candidates) {
    try {
      const files = await readSelection(archive, selection);
      return await parser.parse(files);
    } catch (err) {
      // Filenames matched but content didn't (e.g. a v1-shaped export
      // that happens to reuse v2's filenames) — try the next candidate.
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new NoMatchingParserError();
}

export function listRegisteredParsers(): Pick<ExportParser, "id" | "label">[] {
  return PARSERS.map(({ id, label }) => ({ id, label }));
}