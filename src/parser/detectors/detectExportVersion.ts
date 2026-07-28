import { openArchive } from "@/parser/zip/zipReader";
import { parseWithBestMatch } from "@/parser/registry";
import type { ParsedExport } from "@/types/results";

/**
 * End-to-end pipeline: ZIP file in, parsed domain data out. Opening the
 * archive only reads its central directory (fast, no decompression);
 * parseWithBestMatch then decompresses only the specific files the
 * matching parser needs.
 */
export async function parseInstagramExport(file: File): Promise<ParsedExport> {
  const archive = await openArchive(file);
  try {
    return await parseWithBestMatch(archive);
  } finally {
    await archive.close();
  }
}