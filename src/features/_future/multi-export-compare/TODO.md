# Compare two exports

Needs: loading two ParsedExport objects at once, which means
src/app/exportStore.ts grows from a single slot to a keyed/multi-slot
store. Design that expansion before writing this feature so
upload/follower-analysis don't need breaking changes.
