---
'@noriginmedia/norigin-spatial-navigation-svelte': minor
---

Initial release of Svelte 5 spatial navigation components.

Adds `<SpatialRoot>`, `<SpatialNode>`, and `<Focusable>` components with full feature parity to the React binding. Key features:

- Renderless `<SpatialNode>` with `use:spatial` action (no wrapper div)
- Automatic parent context (no manual Provider needed)
- `<Focusable>` convenience component for simple leaf nodes
- `initialFocusKey` prop on `<SpatialRoot>` for timing-safe initial focus
- `autoFocus` prop on `<SpatialNode>` for dynamic content
- Full TypeScript types
- All core features: boundaries, callbacks, accessibility labels, RTL, throttle
