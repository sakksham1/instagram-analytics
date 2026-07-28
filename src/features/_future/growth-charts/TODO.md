# Follower growth charts

Needs: a chart library decision (kept out of V1 deps deliberately) and a
time-series data shape distinct from the current point-in-time
FollowerComparisonResult. Define it in a local `types.ts` here rather
than growing `src/types/results.ts` to cover cases V1 doesn't need.
