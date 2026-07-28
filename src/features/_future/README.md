# Future feature modules

This directory holds **empty placeholders** for features listed in the
project README under "Future features" — not real code yet. Each
subfolder exists so the eventual feature has an obvious, pre-agreed home
and doesn't get bolted onto an unrelated module out of convenience.

When you start building one of these for real:

1. Give it the same internal shape as `follower-analysis/`:
   `components/`, `hooks/`, `pages/`, and an entry in `src/app/router.tsx`.
2. Reuse `src/analytics` and `src/parser` — don't duplicate comparison or
   parsing logic inside the feature folder.
3. Delete the placeholder `TODO.md` once real files replace it.

Planned modules (see main README for the full future-features list):
- `unfollowers-tracker/` — requires comparing two exports over time
- `growth-charts/` — requires storing snapshot history (opt-in, local only)
- `multi-export-compare/` — generalizes the comparison engine to N exports
