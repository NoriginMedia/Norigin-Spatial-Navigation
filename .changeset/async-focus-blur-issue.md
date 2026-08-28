---
"@noriginmedia/norigin-spatial-navigation-core": patch
---

Fixed a small race condition in  `onIntermediateNodeBecameBlurred` and `onIntermediateNodeBecameFocused` by checking the component still exists inside promise resolve.
