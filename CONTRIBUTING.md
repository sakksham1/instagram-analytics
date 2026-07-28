# Contributing

Thanks for considering a contribution.

## Setup

```bash
npm install
npm run dev
```

## Before opening a PR

```bash
npm run lint
npm run test
npm run build
```

All three must pass — CI runs the same checks on every PR.

## Adding support for a new Instagram export format

This is the most likely reason to touch `src/parser/`:

1. Add `src/parser/versions/vN/index.ts` implementing the `ExportParser`
   interface (`src/parser/types.ts`). Copy `versions/v1/` as a starting
   point — same shape, new detection/parsing logic.
2. Add zod schemas for the new raw JSON shape, and keep raw types in
   `src/types/instagram.ts` only if they're genuinely shared; otherwise
   keep them local to the new version's folder.
3. Translate into the *existing* `ParsedExport` shape
   (`src/types/results.ts`) — don't change that shape unless the new
   format has fields no format could represent before, and if so, add
   optional fields rather than breaking existing parsers.
4. Register it in `src/parser/registry.ts`.
5. Add fixture data under `src/data/sample/` and a test mirroring
   `src/parser/versions/v1/index.test.ts`.

## Adding a new feature module

See `src/features/_future/README.md` for the expected shape
(`components/`, `hooks/`, `pages/`) and how to reuse `src/analytics` and
`src/parser` instead of duplicating logic.

## Code style

Enforced by ESLint + Prettier (`npm run lint`, `npm run format`). Strict
TypeScript — avoid `any`, prefer narrow types.

## Privacy principle

No backend, no telemetry, no third-party scripts, no network calls of any
kind. Any PR that would send user data anywhere — including "just for
analytics" — will be declined regardless of how the export data is
handled otherwise.
