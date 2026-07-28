import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";

/**
 * Metadata for one file inside the archive. Cheap to obtain — the full
 * entry list only requires reading the ZIP's central directory (a small
 * structure at the end of the file), never the compressed file data.
 */
export interface ArchiveEntry {
  path: string;
  uncompressedSize: number;
}

/**
 * A handle onto an opened archive that supports true random access:
 * `readText` decompresses only the one entry requested. Nothing else in
 * the archive is ever read into memory. This is what makes a
 * multi-gigabyte "all data" Instagram export safe to open in a browser
 * tab — we never load the whole archive, only the handful of files a
 * given feature actually needs.
 *
 * Adding a feature that needs other parts of the export (message
 * history, story interactions, etc.)? Don't add a new eager "extract
 * everything" step — write a small reader that lists the paths it wants
 * (see src/parser/registry.ts for the pattern) and calls `readText` only
 * for those. The archive stays open and cheap to query for as long as
 * the underlying File reference is alive.
 */
export interface Archive {
  readonly entries: ArchiveEntry[];
  /** Decompress and read a single entry's contents as text. */
  readText(path: string): Promise<string>;
  /** Release the underlying reader. Safe to call more than once. */
  close(): Promise<void>;
}

/**
 * Opens a ZIP file/blob for selective reading. Resolves once the entry
 * list has been read (fast — no decompression happens here); call
 * `readText` afterwards, per entry, for whatever a given feature needs.
 */
export async function openArchive(file: File | Blob): Promise<Archive> {
  const zipReader = new ZipReader(new BlobReader(file));
  const rawEntries = await zipReader.getEntries();
  const byPath = new Map(rawEntries.map((entry) => [entry.filename, entry]));

  return {
    entries: rawEntries
      .filter((entry) => !entry.directory)
      .map((entry) => ({
        path: entry.filename,
        uncompressedSize: entry.uncompressedSize ?? 0,
      })),

    async readText(path: string) {
      const entry = byPath.get(path);
      if (!entry || entry.directory || !entry.getData) {
        throw new Error(`Archive entry not found or unreadable: ${path}`);
      }
      return entry.getData(new TextWriter());
    },

    async close() {
      await zipReader.close();
    },
  };
}