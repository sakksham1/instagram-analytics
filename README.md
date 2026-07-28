# instagram-analytics

Privacy-first Instagram analytics. No login, no scraping, no backend.
You export your own data from Instagram, drop the ZIP into this app,
and everything is parsed and analyzed **inside your browser tab**. Nothing
is ever uploaded anywhere.

## Scope

- Drag & drop your Instagram data export ZIP
- Compare followers vs following:
  - People you follow who don't follow you back
  - Followers you don't follow back
  - Mutual followers
  - Totals and counts
- Search, sort, copy usernames
- Export any result list as CSV or TXT
- **Unfollowers over time** — save a snapshot of an export, upload a
  newer export later, and see who unfollowed you in between. Snapshots
  are opt-in and stored locally via IndexedDB (see Privacy notes below);
  nothing is saved unless you click "Save current export".

Everything else below is architecture built to support features that
don't exist yet, without needing a rewrite to add them.

## Getting your export

Instagram → Settings → Accounts Center → Your information and permissions
→ Download your information → format **JSON** → request the download →
you'll get a ZIP. Drop that ZIP into the app.

## Running locally

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run test      # run the test suite
npm run lint      # eslint
```

No environment variables, no API keys, no server to stand up — `npm run
build` produces a static `dist/` folder that can be opened as a local
file or hosted anywhere static files are served.

## Why it's structured this way

```
src/
  app/            Composition root: router, providers, cross-feature state
    exportStore.ts     In-memory, cleared-on-refresh export (today's data)
    snapshotStore.ts   Opt-in, IndexedDB-persisted export snapshots
                       (used by the unfollowers tracker — see Privacy notes)
  components/
    ui/           Generic, reusable primitives (Button, Card, Input,
                   Badge, Tabs, EmptyState, Skeleton…) — no feature
                   knowledge lives here
    layout/       Page chrome (header, shell) shared by every route
  features/
    upload/                 The "drop a ZIP" screen and its flow
    follower-analysis/      The comparison results screen and its flow
    unfollowers-tracker/    Snapshot management + the unfollow-event feed
    _future/                Placeholders + TODOs for planned features (see
                             below) — not real code, just pre-agreed homes
  parser/         Turns a ZIP + raw Instagram JSON into stable domain data
    types.ts        The ExportParser contract every version implements
    registry.ts      Where parsers are listed/selected — the ONE file you
                     touch to add support for a new Instagram export format
    versions/v1/     Today's Instagram export format
    versions/v2/     2026-era export format (username moved to `title`)
    zip/            ZIP-reading abstraction (wraps JSZip)
    json/           JSON extraction from a ZIP's entries
    detectors/      The end-to-end "file in, parsed data out" pipeline
  analytics/      Pure comparison/diff logic — no UI, no I/O
    comparisonEngine.ts    Followers-vs-following comparison (one export)
    snapshotDiffEngine.ts  Diffs two ParsedExport snapshots by username
                           (powers the unfollowers tracker)
  services/       Side-effecting operations (triggering a file download)
  types/
    instagram.ts    Raw, version-specific Instagram JSON shapes
    results.ts       Stable domain types everything else depends on
                     (ParsedExport, FollowerComparisonResult,
                     ExportSnapshot, SnapshotDiffResult, UnfollowerEvent)
  utils/          Small, pure, dependency-free helpers (CSV, sorting…)
  config/         App-wide constants
  lib/            Cross-cutting low-level helpers (the shadcn `cn` util)
  hooks/          Small reusable hooks with no feature ownership
  data/sample/    Fixture data for tests and local development
  test/           Vitest setup
```

**Why parsers are isolated behind an interface:** Instagram has changed
its export format before and will again. `src/parser/types.ts` defines
`ExportParser` (`canParse` + `parse`); `src/parser/registry.ts` holds an
ordered list of implementations. Adding support for a new format means
writing one new file under `src/parser/versions/vN/` and adding one line
to the registry — nothing in `analytics/`, `features/`, or `components/`
needs to know a new format exists, because every parser normalizes into
the same `ParsedExport` shape from `types/results.ts`.

**Why raw types and domain types are separate:** `types/instagram.ts`
describes what Instagram's JSON actually looks like today (and will stop
matching reality the moment they change it). `types/results.ts` describes
what the rest of the app can rely on forever. Only `parser/**` is allowed
to know about the former.

**Why analytics is pure:** both `comparisonEngine.ts` and
`snapshotDiffEngine.ts` take plain data in and return plain data out — no
fetching, no parsing, no React. That makes them trivial to unit test and
easy to reuse (the diff engine already powers the unfollowers tracker
without knowing anything about snapshots or storage — it just diffs two
`ParsedExport` values).

**Why `_future/` exists instead of just a roadmap doc:** giving planned
features a real (if empty) folder, with a short TODO describing what
they'll need from the rest of the system, means the *next* contributor
building a new feature doesn't have to guess where it goes or whether
it should reuse the existing comparison engine.

## Future features

Architecture is in place for (not built yet):

- Compare two exports — `src/features/_future/multi-export-compare`
- Follower growth charts — `src/features/_future/growth-charts`
- Timeline analytics, account growth, story/likes/comments/reel analytics,
  saved-posts stats, messaging analytics (export-dependent), an activity
  dashboard, upload history, AI insights, exportable reports, multi-account
  support, localization, themes, and a plugin system

(Unfollowers over time has shipped — see `src/features/unfollowers-tracker`
— so its placeholder under `_future/` can be deleted.)

## Privacy notes for contributors

- The parsed export itself is held in memory only
  (`src/app/exportStore.ts`), cleared on refresh.
- Export **snapshots** (used by the unfollowers tracker) are the one
  exception: they're persisted locally via IndexedDB
  (`src/app/snapshotStore.ts`) so they survive a refresh. This is
  explicit opt-in — a snapshot is only ever written because someone
  clicked "Save current export" — and it's still 100% local; nothing is
  ever synced or sent anywhere. Any future persistence should follow the
  same pattern: opt-in, never silent, never a network call.
- There is intentionally no backend, no analytics/telemetry SDK, and no
  third-party script in `index.html`. Keep it that way.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui-style
primitives, JSZip, Zod, Vitest, ESLint, Prettier.

## License

MIT
