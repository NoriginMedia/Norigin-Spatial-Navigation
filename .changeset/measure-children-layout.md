---
'@noriginmedia/norigin-spatial-navigation-core': minor
'@noriginmedia/norigin-spatial-navigation-react': minor
'@noriginmedia/norigin-spatial-navigation': minor
---

Add `measureChildrenLayout` option to `useFocusable` (default `true`) to control whether a container's direct children are measured during navigation and `updateAllLayouts`. Set it to `false` on containers driven by their own `nextFocusResolver` to skip layout measurement that the resolver doesn't need.
