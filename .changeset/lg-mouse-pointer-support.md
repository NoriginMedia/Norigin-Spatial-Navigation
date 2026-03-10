---
'@noriginmedia/norigin-spatial-navigation-core': minor
'@noriginmedia/norigin-spatial-navigation-react': minor
---

Add mouse/pointer support for LG WebOS magic remote and desktop browsers

Introduces an opt-in `mouseSupport` option to `init()` that enables spatial
navigation focus and click handling via mouse/pointer events.

**New `init()` option:**
- `mouseSupport: boolean` (default `false`) — when enabled:
  - `mouseenter` on a focusable element moves spatial focus to it
  - `click` on a focusable element triggers `onEnterPress` (equivalent to the OK/Enter key on a TV remote)

**New `useFocusable()` callbacks** (require `mouseSupport: true`):
- `onMouseEnter(props, { event })` — pointer entered the element
- `onMouseLeave(props, { event })` — pointer left the element
- `onClick(props, { event })` — element was clicked

**New exported types:**
- `PointerDetails` — `{ event: MouseEvent }`
- `MouseEnterHandler`, `MouseLeaveHandler`, `ClickHandler`

**New method on `SpatialNavigation`:**
- `isMouseSupportEnabled()` — returns whether mouse support is active

All changes are fully backwards compatible. Existing apps without `mouseSupport` are unaffected.
