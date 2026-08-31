---
'@noriginmedia/norigin-spatial-navigation-svelte': minor
---

Initial release of Svelte 5 spatial navigation components.

Adds `<SpatialRoot>` and `<SpatialNode>` components with full feature parity to the React binding. Key features:

- Renderless `<SpatialNode>` with `use:spatial` action (no wrapper div), a 1:1 port of `useFocusable`
- Automatic parent context (no manual Provider needed)
- `initialFocusKey` prop on `<SpatialRoot>` for timing-safe initial focus
- Full TypeScript types
- All core features: boundaries, callbacks, `nextFocusResolver`, accessibility labels, RTL, throttle, `focusOnPresetKey`, and the `layoutAdapter` API
