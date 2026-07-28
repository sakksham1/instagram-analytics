import type { ParsedExport } from "@/types/results";

/**
 * Maps the logical file names a parser cares about (e.g. "followers",
 * "following") to the actual paths those files have inside the archive.
 * Returned by `selectFiles` so the pipeline knows exactly which entries
 * to decompress — and only those.
 */
export type FileSelection = Record<string, string>;

/**
 * Contract every export parser must satisfy. New Instagram export formats
 * become new implementations of this interface — never edits to an
 * existing one, so old exports never silently break.
 *
 * Detection is two cheap steps:
 *  1. `selectFiles` looks only at entry *paths* (no decompression) and
 *     says which files (if any, by logical name) this version needs.
 *  2. `parse` receives just the parsed JSON of those selected files and
 *     does the real shape validation — if it doesn't match, throw
 *     ParserError and the registry tries the next candidate.
 *
 * This is also the pattern any future reader (growth-charts, message
 * analytics, etc.) should follow when it needs other parts of the
 * export: declare exactly which files you need by path pattern, and only
 * those get pulled out of the archive.
 */
export interface ExportParser {
  /** Unique, stable id, e.g. "v1", "v2". Never reuse or repurpose an id. */
  readonly id: string;
  /** Human-readable label for diagnostics/UI. */
  readonly label: string;

  /**
   * Cheap, filename-only check: given every path in the archive, which
   * ones (if any) does this parser need? Return them keyed by logical
   * name, or `null` if the required files aren't present by name. Must
   * not read file contents — paths only. Must never throw.
   */
  selectFiles(paths: string[]): FileSelection | null;

  /**
   * Full parse using only the already-JSON-parsed content of the files
   * `selectFiles` asked for (keyed by the same logical names). May throw
   * a ParserError if the content doesn't match this version's expected
   * shape once actually inspected — the registry treats that as "this
   * candidate didn't match" and tries the next one.
   */
  parse(files: Map<string, unknown>): Promise<ParsedExport> | ParsedExport;
}

export class ParserError extends Error {
  constructor(
    message: string,
    public readonly parserId: string,
  ) {
    super(message);
    this.name = "ParserError";
  }
}

export class NoMatchingParserError extends Error {
  constructor() {
    super(
      "No parser recognized this export. It may be from an unsupported " +
        "or future Instagram export format.",
    );
    this.name = "NoMatchingParserError";
  }
}