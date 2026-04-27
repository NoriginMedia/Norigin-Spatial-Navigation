---
name: norigin-spatial-navigation-react
description: Use when building or modifying UIs that need directional focus (arrow keys, TV remotes, gamepads) with the Norigin Spatial Navigation library. Covers `useFocusable`, `FocusContext`, programmatic focus, and common Smart TV / set-top-box patterns.
---

# Norigin Spatial Navigation

Library for arrow-key / remote-control focus management in React apps (Smart TVs, set-top boxes, browsers). It calculates the next focusable element based on spatial position, so you don't wire up directional logic manually.

**Full documentation:** https://github.com/NoriginMedia/Norigin-Spatial-Navigation/tree/main/docs

When you need details beyond this skill, read the relevant page directly:

- Concepts & hierarchy: `docs/guides/concepts.md`, `docs/guides/focus-hierarchy.md`
- Quick start & install: `docs/guides/quick-start.md`, `docs/guides/installation.md`
- `useFocusable` API: `docs/api-reference/useFocusable.md`
- `SpatialNavigation` API (init, setFocus, pause, etc.): `docs/api-reference/SpatialNavigation.md`
- Boundaries / modals: `docs/guides/focus-boundaries.md`
- Programmatic focus: `docs/guides/programmatic-focus.md`
- Distance calculation tuning: `docs/guides/distance-calculation.md`
- Key mapping (custom remotes): `docs/guides/key-mapping.md`
- Event callbacks: `docs/guides/event-callbacks.md`
- Performance: `docs/guides/performance.md`
- Debugging: `docs/guides/debugging.md`
- Recipes (lists, grids, virtualization): `docs/guides/recipes.md`
- Accessibility labels: `docs/guides/accessibility-labels.md`
- RTL: `docs/guides/rtl-support.md`

## Mental model

Two component shapes exist:

1. **Leaf** — interactive element that actually receives focus. Reads `focused` from `useFocusable`.
2. **Container** — wraps focusable children. Reads `focusKey` and provides it via `FocusContext.Provider` so the children participate in the hierarchy. Optionally reads `hasFocusedChild` (requires `trackChildren: true`).

Every focusable component **must** attach the returned `ref` to a real DOM element. Containers **must** wrap children in `<FocusContext.Provider value={focusKey}>` — otherwise children are orphaned at the root and navigation across them breaks.

## Initialization

Call `init` once at app startup (e.g. in `App.tsx`):

```tsx
import { init as initNavigation } from '@noriginmedia/norigin-spatial-navigation-core';

initNavigation({
  debug: false,
  visualDebug: false,
  throttle: 0,
  distanceCalculationMethod: 'corners' // 'center' | 'edges' | 'corners'
});
```

If you ship custom remote keys, also configure key mapping (see `docs/guides/key-mapping.md`).

## Patterns

### Leaf (button, menu item)

```tsx
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';

function Button({ label, onPress }: Props) {
  const { ref, focused } = useFocusable({ onEnterPress: onPress });
  return (
    <div ref={ref} className={focused ? 'focused' : ''}>
      {label}
    </div>
  );
}
```

### Container

```tsx
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function Menu({ items }: Props) {
  const { ref, focusKey, hasFocusedChild } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={hasFocusedChild ? 'active' : ''}>
        {items.map((i) => (
          <MenuItem key={i.id} {...i} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}
```

### Modal / popup (trap focus + grab on mount)

```tsx
function Popup() {
  const { ref, focusKey, focusSelf } = useFocusable({ isFocusBoundary: true });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>{/* buttons */}</div>
    </FocusContext.Provider>
  );
}
```

For partial trapping (e.g. block only horizontal), use `focusBoundaryDirections`. See `docs/guides/focus-boundaries.md`.

### Programmatic focus from anywhere

```tsx
import {
  setFocus,
  doesFocusableExist
} from '@noriginmedia/norigin-spatial-navigation-core';

const KEY = 'primary-cta';
useFocusable({ focusKey: KEY });

if (doesFocusableExist(KEY)) setFocus(KEY);
```

### Conditional focusability

```tsx
const { ref } = useFocusable({ focusable: !disabled });
```

### Blocking / overriding directional input

`onArrowPress(direction, props)` — return `true` to allow default navigation, `false` to block it. Useful for paginated rows, custom carousels, or refusing to leave the current container at edges.

## `useFocusable` — params worth knowing

| Param                                               | Purpose                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `focusable`                                         | Toggle whether element participates in navigation. Default `true`.         |
| `trackChildren`                                     | Enables `hasFocusedChild`. Has a perf cost — only enable when you read it. |
| `saveLastFocusedChild`                              | Container restores last focused child when re-entered. Default `true`.     |
| `isFocusBoundary` / `focusBoundaryDirections`       | Trap focus inside the container.                                           |
| `focusKey`                                          | Stable key for `setFocus` / `doesFocusableExist`.                          |
| `preferredChildFocusKey`                            | Which child gets initial focus when container is entered.                  |
| `onEnterPress`, `onArrowPress`, `onFocus`, `onBlur` | Event hooks. See `docs/guides/event-callbacks.md`.                         |
| `extraProps`                                        | Arbitrary payload forwarded to callbacks (e.g. item id).                   |

Returned: `ref` (required), `focusKey`, `focused` (leaf), `hasFocusedChild` (container), `focusSelf()`.

## Top-level API surface

```tsx
import {
  init,
  setFocus,
  getCurrentFocusKey,
  doesFocusableExist,
  navigateByDirection,
  pause,
  resume,
  setKeyMap,
  setThrottle,
  destroy
} from '@noriginmedia/norigin-spatial-navigation-core';
```

See `docs/api-reference/SpatialNavigation.md` for the full list and signatures.

## Best practices

**Do**

- Always attach `ref` to a DOM element.
- Wrap container children in `<FocusContext.Provider value={focusKey}>`.
- Enable `trackChildren` only when you actually consume `hasFocusedChild`.
- Use stable `focusKey`s for elements you target programmatically.
- Guard `setFocus` calls with `doesFocusableExist`, especially around route changes / async data.
- Use `isFocusBoundary` for modals, drawers, and overlays.
- Set `focusable: false` on disabled or hidden items rather than unmounting if they may toggle frequently.

**Don't**

- Don't read `focused` on a container — use `hasFocusedChild` instead.
- Don't omit `FocusContext.Provider` on containers; children become unreachable from siblings.
- Don't blindly call `setFocus` on keys that may not be mounted (causes silent focus loss).
- Don't generate `focusKey`s that change on every render — focus state will be lost.
- Don't enable `debug` / `visualDebug` in production builds.

## Debugging

Turn on diagnostics in `init`:

```tsx
init({ debug: true, visualDebug: true });
```

Common issues:

- **Element won't focus** — `ref` not attached, or `focusable: false`, or ancestor missing `FocusContext.Provider`.
- **Focus jumps to wrong neighbor** — try a different `distanceCalculationMethod` (`corners` / `center` / `edges`); enable `visualDebug` to see hitboxes.
- **Focus lost on re-render** — `focusKey` is unstable, or the previously focused node unmounted without a fallback. Use `preferredChildFocusKey` or `setFocus` after the new tree mounts.
- **Modal leaks focus** — missing `isFocusBoundary` on the modal container.

More: `docs/guides/debugging.md`, `docs/guides/performance.md`.

## Quick reference

```tsx
// Leaf
const { ref, focused } = useFocusable();

// Container
const { ref, focusKey } = useFocusable();
<FocusContext.Provider value={focusKey}>
  <div ref={ref}>{children}</div>
</FocusContext.Provider>;

// Focus on mount
const { focusSelf } = useFocusable({ isFocusBoundary: true });
useEffect(() => {
  focusSelf();
}, [focusSelf]);

// Manual focus
if (doesFocusableExist('my-key')) setFocus('my-key');
```
