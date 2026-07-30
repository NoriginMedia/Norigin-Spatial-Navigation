---
sidebar_position: 9
---

# Next Focus Resolver

[Distance Calculation](./distance-calculation.md) explains how the library picks the next
sibling by default: it scores every candidate and focuses the lowest-scoring one. `nextFocusResolver`
lets a container replace that entirely with your own logic.

## `nextFocusResolver`

Set on the **container**, `nextFocusResolver` is called whenever an arrow key would move focus
between its direct children. Its return value decides which child (if any) gets focused —
default coordinate-based navigation for that container is bypassed completely.

```typescript
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';

const resolver: NextFocusResolver = (direction, currentFocusKey, siblings) => {
  const currentIndex = siblings.findIndex(
    (sibling) => sibling.focusKey === currentFocusKey
  );

  if (direction === 'right') {
    return siblings[currentIndex + 1] ?? null;
  }

  if (direction === 'left') {
    return siblings[currentIndex - 1] ?? null;
  }

  return null; // fall through to the parent container for up/down
};

function Carousel() {
  const { ref, focusKey } = useFocusable({ nextFocusResolver: resolver });

  // ...
}
```

### Signature

```typescript
type NextFocusResolver = (
  direction: Direction,
  currentFocusKey: string,
  siblings: FocusableComponent[]
) => FocusableComponent | null;
```

- `direction` — the arrow key that was pressed.
- `currentFocusKey` — the focus key of the currently focused child.
- `siblings` — every **focusable** direct child of the container the resolver is set on (not
  grandchildren, and not children filtered by direction or position — that filtering is now your
  responsibility).

### Return value

- Return one of the objects from `siblings` to focus it.
- Return `null` to decline the navigation for this direction. The library then falls through to
  the container's own parent, exactly as it would if no sibling qualified under default
  navigation.

Returning an object that isn't a member of the `siblings` array you were given results in lost
focus. In development (`debug: true`), the library warns to the console when this happens,
naming the container's `focusKey`.

---

## `measureChildrenLayout`

By default, every registered component's on-screen position is re-measured as needed to support
coordinate-based navigation and the [distance calculation](./distance-calculation.md) algorithm.
Once a container supplies its own `nextFocusResolver`, that measurement is often unnecessary —
your resolver already knows what the next component should be without consulting layout.

Set `measureChildrenLayout: false` on the same container to skip measuring its **direct
children** during navigation and `updateAllLayouts()`. See
[Performance Tuning](./performance.md#skipping-layout-measurement) for the perf motivation and
exactly which measurements are skipped.

```typescript
const { ref, focusKey } = useFocusable({
  nextFocusResolver: resolver,
  measureChildrenLayout: false
});
```

### The staleness caveat

`measureChildrenLayout: false` does not clear the `layout` already stored on each child — it
leaves it as whatever was last measured. If your `nextFocusResolver` reads `sibling.layout` (for
example, to pick the visually nearest child), those coordinates will silently go stale as the app
scrolls or re-renders, since nothing is refreshing them anymore.

Only opt out of measurement when your resolver decides purely from `direction`, `currentFocusKey`,
and the shape of `siblings` (order, count, custom data you attach elsewhere) — not from
`sibling.layout`.

Because default navigation is coordinate-based, `measureChildrenLayout: false` is only meaningful
paired with a `nextFocusResolver` on the same container. In development (`debug: true`), the
library warns to the console if a container has the flag set, no resolver, and more than one
focusable child — that combination reliably breaks arrow-key navigation between its children.

`measureChildrenLayout` only affects **direct** children. A nested container underneath one that
sets it to `false` still measures its own children normally unless it also opts out.
