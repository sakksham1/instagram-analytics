# instagram-analytics

Privacy-first Instagram analytics. No login, no scraping, no backend.
You export your own data from Instagram, drop the ZIP into this app,
and everything is parsed and analyzed **inside your browser tab**. Nothing
is ever uploaded anywhere.

## V1 scope

- Drag & drop your Instagram data export ZIP
- Compare followers vs following:
  - People you follow who don't follow you back
  - Followers you don't follow back
  - Mutual followers
  - Totals and counts
- Search, sort, copy usernames
- Export any result list as CSV or TXT

That's it for V1 — deliberately. Everything else below is architecture
built to support features that don't exist yet, without needing a rewrite
to add them.

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
  components/
    ui/           Generic, reusable primitives (Button, Card, Input…) —
                   no feature knowledge lives here
    layout/       Page chrome (header, shell) shared by every route
  features/
    upload/        The "drop a ZIP" screen and its flow
    follower-analysis/  The comparison results screen and its flow
    _future/       Placeholders + TODOs for planned features (see below) —
                   not real code, just pre-agreed homes for it
  parser/         Turns a ZIP + raw Instagram JSON into stable domain data
    types.ts        The ExportParser contract every version implements
    registry.ts      Where parsers are listed/selected — the ONE file you
                     touch to add support for a new Instagram export format
    versions/v1/     Today's Instagram export format
    versions/v2/     Stub showing the shape a future format parser takes
    zip/            ZIP-reading abstraction (wraps JSZip)
    json/           JSON extraction from a ZIP's entries
    detectors/      The end-to-end "file in, parsed data out" pipeline
  analytics/      Pure comparison/analytics logic — no UI, no I/O
  services/       Side-effecting operations (triggering a file download)
  types/
    instagram.ts    Raw, version-specific Instagram JSON shapes
    results.ts       Stable domain types everything else depends on
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

**Why analytics is pure:** `analytics/comparisonEngine.ts` takes two
lists of profiles and returns a comparison — no fetching, no parsing, no
React. That makes it trivial to unit test and easy to reuse from a future
"compare two exports over time" feature without dragging in the upload
flow.

**Why `_future/` exists instead of just a roadmap doc:** giving planned
features a real (if empty) folder, with a short TODO describing what
they'll need from the rest of the system, means the *next* contributor
building "growth charts" doesn't have to guess where it goes or whether
it should reuse the existing comparison engine.

## Future features

Architecture is in place for (not built yet):

- Unfollowers over time — `src/features/_future/unfollowers-tracker`
- Compare two exports — `src/features/_future/multi-export-compare`
- Follower growth charts — `src/features/_future/growth-charts`
- Timeline analytics, account growth, story/likes/comments/reel analytics,
  saved-posts stats, messaging analytics (export-dependent), an activity
  dashboard, upload history, AI insights, exportable reports, multi-account
  support, localization, themes, and a plugin system

None of these are stubbed as folders yet beyond the three above — add
them the same way: a feature folder with `components/`, `hooks/`,
`pages/`, plus reuse of `parser/` and `analytics/` rather than parallel
implementations.

## Privacy notes for contributors

- The parsed export is held in memory only (`src/app/exportStore.ts`),
  cleared on refresh. Any future persistence (e.g. for growth-over-time)
  should be local storage (IndexedDB) and explicitly opt-in — never
  silent, and never a network call.
- There is intentionally no backend, no analytics/telemetry SDK, and no
  third-party script in `index.html`. Keep it that way.

## Tech stack

React, TypeScript, Vite, Tailwind CSS, React Router, shadcn/ui-style
primitives, JSZip, Zod, Vitest, ESLint, Prettier.

## License

MIT
