---
"@noriginmedia/norigin-spatial-navigation-core": patch
---

Fix for a race condition where `onIntermediateNodeBecameBlurred` and `onIntermediateNodeBecameFocused` functions could throw a _TypeError_ if the component no longer existed once promises resolve.
