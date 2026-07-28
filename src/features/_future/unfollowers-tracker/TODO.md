# Unfollowers over time

Needs: local snapshot storage (opt-in — see privacy note in
src/app/exportStore.ts) + a diff engine comparing two ParsedExport
snapshots by username. Reuse `src/analytics/comparisonEngine.ts` as a
reference for how a pure, testable comparison function should look.
