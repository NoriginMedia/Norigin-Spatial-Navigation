---
'@noriginmedia/norigin-spatial-navigation-core': minor
---

- Measure layout methods are now async
- Deprecated `useGetBoundingClientRect` option in `init` method. Prefer `init({ layoutAdapter: GetBoundingClientRectAdapter })` or keep the flag until you migrate
- Added `Scheduler` class to manage asynchronous tasks in a strict sequence
- Export `BaseWebAdapter` and `GetBoundingClientRectAdapter` from `@noriginmedia/norigin-spatial-navigation-core`
