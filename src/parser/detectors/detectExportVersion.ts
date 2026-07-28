import { readZip } from "@/parser/zip/zipReader";
import { extractJsonFiles } from "@/parser/json/jsonExtractor";
import { parseWithBestMatch } from "@/parser/registry";
import type { ParsedExport } from "@/types/results";

/**
 * End-to-end pipeline: ZIP file in, parsed domain data out. This is the
 * single function feature code (e.g. the upload flow) should call — it
 * owns the order of operations (unzip -> extract JSON -> detect version ->
 * parse) so that order is never duplicated elsewhere.
 */
export async function parseInstagramExport(file: File): Promise<ParsedExport> {
  const entries = await readZip(file);
  const jsonFiles = await extractJsonFiles(entries);
  return parseWithBestMatch(jsonFiles);
}
