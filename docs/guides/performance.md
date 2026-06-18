---
sidebar_position: 11
---

# Performance Tuning

## Throttling Key Presses

On Smart TVs, holding down a direction key fires many `keydown` events per second. Without throttling, the library processes each event, potentially moving focus dozens of times per second and causing janky animations.

### `throttle`

Sets a minimum number of milliseconds between navigation events. When a key is held, only one navigation event fires per `throttle` period.

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

init({
  throttle: 150 // navigate at most once every 150ms
});
```

A value of `0` (the default) disables throttling.

### `throttleKeypresses`

When `true`, the throttle also applies to key repeat events (the repeated `keydown` fired by the OS when a key is held):

```typescript
init({
  throttle: 100,
  throttleKeypresses: true
});
```

Set both when you want to prevent rapid-fire navigation while a key is held.

### Adjusting Throttle at Runtime

Use `setThrottle` to change throttle settings without reinitializing:

```typescript
import { setThrottle } from '@noriginmedia/norigin-spatial-navigation-core';

// Slow down while a video is scrubbing
setThrottle({ throttle: 300, throttleKeypresses: true });

// Remove throttle when done
setThrottle({ throttle: 0 });
```

---

## Layout Measurement

The library measures each component's position and size to calculate navigation distances. The measurement method affects both accuracy and performance.

### Default: `offsetLeft` / `offsetTop` (faster)

By default the library reads `element.offsetLeft`, `element.offsetTop`, `element.offsetWidth`, and `element.offsetHeight`. This is fast and unaffected by CSS transforms.

### Viewport-relative measurement (`getBoundingClientRect`)

Pass the bundled **`GetBoundingClientRectAdapter`** class to `init` (see [Layout adapter](../api-reference/SpatialNavigation.md#layout-adapter) in the API reference):

```typescript
import { init, GetBoundingClientRectAdapter } from '@noriginmedia/norigin-spatial-navigation-core';

init({ layoutAdapter: GetBoundingClientRectAdapter });
```

Alternatively, use a **partial** `layoutAdapter` with a custom `measureLayout`, or temporarily keep the deprecated `useGetBoundingClientRect: true` init flag until you migrate.

Use viewport-relative layout when:

- Elements are CSS-transformed (e.g., `transform: scale(0.9)`)
- Elements are inside a scaled or rotated container
- You need coordinates relative to the viewport rather than the document

`getBoundingClientRect` is slightly slower because it triggers a layout reflow, but it accounts for CSS transforms that `offsetLeft/Top` ignores.

### Async work ordering

The core engine runs navigation- and layout-related async work through an internal **scheduler**, so operations are serialized instead of interleaving arbitrarily. When you need logic to run after focus or navigation completes, use **`await setFocus`** / **`await navigateByDirection`** (see [Programmatic focus](./programmatic-focus.md)).

---

## DOM Node Focus (`shouldFocusDOMNode`)

By default, the library manages focus entirely in JavaScript without calling `HTMLElement.focus()`. Enabling `shouldFocusDOMNode` makes the library also call `.focus()` on the underlying DOM node.

```typescript
init({ shouldFocusDOMNode: true });
```

This is useful when:

- You need native browser focus behavior (`:focus` CSS, screen reader compatibility).
- The focused element should receive native browser events.
- WCAG screen reader compatibility.

### `domNodeFocusOptions`

Pass options to the underlying `HTMLElement.focus()` call:

```typescript
init({
  shouldFocusDOMNode: true,
  domNodeFocusOptions: { preventScroll: true }
});
```

The `preventScroll` option is particularly useful on Smart TVs where browser auto-scrolling on focus conflicts with your custom scroll logic.

---

## Reducing Component Count

The library stores a flat map of all registered focusable components and iterates through it on every key event. Keeping the number of registered components reasonable (in the hundreds, not thousands) helps maintain performance on lower-powered TV hardware.

**Tips:**

- Use `focusable: false` or conditional rendering to exclude off-screen items.
- For very long lists, consider virtualizing the list and only rendering visible rows.
- Nested `FocusContext.Provider` boundaries help the library prune the candidate set faster.

---

## Pausing Navigation

Temporarily stop processing key events when they are not needed (e.g., while a full-screen video plays):

```typescript
import { pause, resume } from '@noriginmedia/norigin-spatial-navigation-react';

function onVideoPlay() {
  pause();
}

function onVideoEnd() {
  resume();
}
```

`pause()` and `resume()` are instant and have no overhead.
