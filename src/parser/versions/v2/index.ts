// STUB — not registered yet.
//
// This file exists to show the exact shape a future export-format parser
// should take when Instagram changes their export structure again.
//
// TODO(future export format):
//   1. Copy the pattern in `src/parser/versions/v1/index.ts`.
//   2. Implement `canParse` using cheap filename/shape checks first.
//   3. Implement `parse`, translating raw JSON into the SAME
//      `ParsedExport` domain shape defined in `src/types/results.ts` —
//      do not change that shape; extend it in a backwards-compatible way
//      if a genuinely new field is needed.
//   4. Add zod schemas for the new raw shape (see v1 for the pattern).
//   5. Register it in `src/parser/registry.ts` — one line, nothing else.
//
// import type { ExportParser } from "@/parser/types";
//
// export const v2Parser: ExportParser = {
//   id: "v2",
//   label: "Instagram export (future format)",
//   canParse(files) { ... },
//   parse(files) { ... },
// };
export {};
