import type { ParsedExport } from "@/types/results";

/**
 * Contract every export parser must satisfy. New Instagram export formats
 * become new implementations of this interface — never edits to an
 * existing one, so old exports never silently break.
 */
export interface ExportParser {
  /** Unique, stable id, e.g. "v1", "v2". Never reuse or repurpose an id. */
  readonly id: string;
  /** Human-readable label for diagnostics/UI ("Instagram export, 2024 format"). */
  readonly label: string;

  /**
   * Cheap, synchronous-feeling check: can this parser handle the given set
   * of files? Should inspect filenames/shape, not fully parse content.
   * Detection must never throw.
   */
  canParse(files: Map<string, unknown>): boolean;

  /** Full parse. May throw a ParserError; callers should catch it. */
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
