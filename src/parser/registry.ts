import type { ExportParser } from "@/parser/types";
import { NoMatchingParserError } from "@/parser/types";
import type { ParsedExport } from "@/types/results";
import { v1Parser } from "@/parser/versions/v1";
import { v2Parser } from "@/parser/versions/v2";

/**
 * All available parsers, newest-first. Adding support for a new Instagram
 * export format means: implement ExportParser in
 * `src/parser/versions/vN/`, then add one line here. Nothing else in the
 * app needs to change — see src/parser/versions/v2 for a stub showing the
 * exact shape a new version should take.
 */
const PARSERS: ExportParser[] = [v2Parser, v1Parser];

export function detectParser(files: Map<string, unknown>): ExportParser | null {
  return PARSERS.find((parser) => parser.canParse(files)) ?? null;
}

export async function parseWithBestMatch(
  files: Map<string, unknown>,
): Promise<ParsedExport> {
  const parser = detectParser(files);
  if (!parser) throw new NoMatchingParserError();
  return parser.parse(files);
}

export function listRegisteredParsers(): Pick<ExportParser, "id" | "label">[] {
  return PARSERS.map(({ id, label }) => ({ id, label }));
}
