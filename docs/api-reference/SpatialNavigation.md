---
sidebar_position: 1
---

# SpatialNavigation

The `SpatialNavigation` singleton is the core engine of the library. In most React applications you interact with it through `useFocusable` and named function exports. This reference documents all public methods.

## Importing

### Named exports

```typescript
import {
  init,
  destroy,
  setFocus,
  navigateByDirection,
  pause,
  resume,
  getCurrentFocusKey,
  doesFocusableExist,
  updateAllLayouts,
  setKeyMap,
  setThrottle,
  updateRtl,
  ROOT_FOCUS_KEY,
  defaultLayoutAdapter,
  getBoundingClientRectAdapter
} from '@noriginmedia/norigin-spatial-navigation-core';

import type { LayoutAdapterOptions } from '@noriginmedia/norigin-spatial-navigation-core';
```

---

## `init(config?)`

Initializes the spatial navigation service. Must be called once before any components mount, typically at the top of your application module.

```typescript
init(config?: {
  debug?: boolean;
  visualDebug?: boolean;
  nativeMode?: boolean;
  throttle?: number;
  throttleKeypresses?: boolean;
  /**
   * @deprecated Use `layoutAdapter: getBoundingClientRectAdapter` instead.
   */
  useGetBoundingClientRect?: boolean;
  shouldFocusDOMNode?: boolean;
  domNodeFocusOptions?: FocusOptions;
  shouldUseNativeEvents?: boolean;
  rtl?: boolean;
  layoutAdapter?: Partial<LayoutAdapterOptions>;
  distanceCalculationMethod?: 'center' | 'edges' | 'corners';
  customDistanceCalculationFunction?: (
    refCorners: Corners,
    siblingCorners: Corners,
    isVerticalDirection: boolean,
    distanceCalculationMethod: string
  ) => number;
}): void
```

### Config options

| Option                              | Type                               | Default                | Description                                                                                                                   |
| ----------------------------------- | ---------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `debug`                             | `boolean`                          | `false`                | Log navigation decisions to the browser console.                                                                              |
| `visualDebug`                       | `boolean`                          | `false`                | Draw a canvas overlay showing component bounding boxes and navigation paths.                                                  |
| `nativeMode`                        | `boolean`                          | `false`                | **Deprecated.** Disable DOM key event listeners (for React Native). You must drive navigation manually.                       |
| `throttle`                          | `number`                           | `0`                    | Milliseconds to wait between processing repeated key presses. `0` means no throttle.                                          |
| `throttleKeypresses`                | `boolean`                          | `false`                | When `true` and `throttle > 0`, throttle key repeat events while a key is held down.                                          |
| `layoutAdapter`                     | `Partial<LayoutAdapterOptions>`    | `defaultLayoutAdapter` | Overrides for layout measurement and DOM focus. Merged with the default adapter. See [Layout adapter](#layout-adapter) below. |
| `useGetBoundingClientRect`          | `boolean`                          | `false`                | **Deprecated.** Use `layoutAdapter: getBoundingClientRectAdapter` instead. If `true`, the service logs a deprecation warning. |
| `shouldFocusDOMNode`                | `boolean`                          | `false`                | Call `HTMLElement.focus()` on the focused component's DOM node, enabling native browser focus behavior and accessibility.     |
| `domNodeFocusOptions`               | `FocusOptions`                     | `undefined`            | Options passed to `HTMLElement.focus()` when `shouldFocusDOMNode` is `true`.                                                  |
| `shouldUseNativeEvents`             | `boolean`                          | `false`                | Do not call `preventDefault()` on key events, allowing the browser to handle them natively as well.                           |
| `rtl`                               | `boolean`                          | `false`                | Enable right-to-left layout mode. Left and right navigation directions are swapped.                                           |
| `distanceCalculationMethod`         | `'center' \| 'edges' \| 'corners'` | `'corners'`            | Algorithm used to calculate distance between components. See [Distance Calculation](../guides/distance-calculation.md).       |
| `customDistanceCalculationFunction` | `function`                         | `undefined`            | Override the secondary-axis distance calculation. See [Distance Calculation](../guides/distance-calculation.md).              |

### Example

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

init({
  debug: false,
  visualDebug: false,
  distanceCalculationMethod: 'center',
  throttle: 150,
  throttleKeypresses: true
});
```

---

## Layout adapter

Layout is supplied by a **`layoutAdapter`**: an object with:

- **`measureLayout(component)`** — Must return a **`Promise`** resolving to the focusable component’s layout (position and size). The default uses offset-based measurement; **`getBoundingClientRectAdapter`** uses `getBoundingClientRect()`.
- **`focusNode(component)`** — Called to move native focus when applicable (default: `component.node.focus()`).

Exported adapters:

| Export                         | Role                                                                   |
| ------------------------------ | ---------------------------------------------------------------------- |
| `defaultLayoutAdapter`         | Offset-based measurement (fast; ignores CSS transforms on ancestors).  |
| `getBoundingClientRectAdapter` | Viewport-relative rects; use when transforms or scaling affect layout. |

`init` merges `layoutAdapter` **partially** over `defaultLayoutAdapter`, so you can override only `measureLayout` or only `focusNode`.

**Migration from `useGetBoundingClientRect: true`:**

```typescript
import {
  init,
  getBoundingClientRectAdapter
} from '@noriginmedia/norigin-spatial-navigation-core';

init({
  layoutAdapter: getBoundingClientRectAdapter
});
```

**Custom async measurement** — Implement `measureLayout` as an async function (or return `Promise.resolve(...)` for synchronous work). The library awaits layout before navigating or focusing.

---

## `destroy()`

Disables the service, removes all event listeners, and clears all registered components. Call this when tearing down the application.

```typescript
destroy(): void
```

```typescript
import { destroy } from '@noriginmedia/norigin-spatial-navigation-core';

// In a test afterEach or app cleanup:
destroy();
```

---

## `setFocus(focusKey, focusDetails?)`

Programmatically move focus to the component with the given focus key. This method is **asynchronous** because it may re-measure layout via the configured `layoutAdapter`.

```typescript
setFocus(focusKey: string, focusDetails?: FocusDetails): Promise<void>
```

| Parameter      | Description                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `focusKey`     | The focus key of the target component. Use `ROOT_FOCUS_KEY` to focus the root, which routes to the first eligible child. |
| `focusDetails` | Optional object passed through to the target component's `onFocus` handler.                                              |

Use **`await`** when you need to run code after focus has settled. In `useEffect` or fire-and-forget call sites, `void setFocus('KEY')` is a common pattern to satisfy linters that flag floating promises.

```typescript
import {
  setFocus,
  ROOT_FOCUS_KEY
} from '@noriginmedia/norigin-spatial-navigation-core';

await setFocus('PLAY_BUTTON');
await setFocus(ROOT_FOCUS_KEY);
await setFocus('MENU_ITEM_3', { event: someEvent });
```

---

## `navigateByDirection(direction, focusDetails?)`

Simulate a directional key press, moving focus in the specified direction from the currently focused component. **Asynchronous** (layout may be updated first).

```typescript
navigateByDirection(
  direction: 'up' | 'down' | 'left' | 'right',
  focusDetails?: FocusDetails
): Promise<void>
```

```typescript
import { navigateByDirection } from '@noriginmedia/norigin-spatial-navigation-core';

await navigateByDirection('right');
await navigateByDirection('down', { source: 'programmatic' });
```

---

## `pause()`

Suspend all key event handling. Navigation stops until `resume()` is called. Focus state is preserved.

```typescript
pause(): void
```

```typescript
import { pause } from '@noriginmedia/norigin-spatial-navigation-core';

// While a video is playing full-screen:
pause();
```

---

## `resume()`

Resume key event handling after a `pause()`.

```typescript
resume(): void
```

```typescript
import { resume } from '@noriginmedia/norigin-spatial-navigation-core';

resume();
```

---

## `getCurrentFocusKey()`

Return the focus key of the currently focused component.

```typescript
getCurrentFocusKey(): string
```

```typescript
import { getCurrentFocusKey } from '@noriginmedia/norigin-spatial-navigation-core';

const currentKey = getCurrentFocusKey();
console.log('Currently focused:', currentKey);
```

---

## `doesFocusableExist(focusKey)`

Return `true` if a component with the given focus key is currently registered. Use this before calling `setFocus` to avoid errors when a component may or may not be mounted.

```typescript
doesFocusableExist(focusKey: string): boolean
```

```typescript
import {
  doesFocusableExist,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

if (doesFocusableExist('SIDEBAR_ITEM_2')) {
  await setFocus('SIDEBAR_ITEM_2');
}
```

---

## `updateAllLayouts()`

Force the library to re-measure the screen positions of all registered components. Call this after layout changes that are invisible to React (e.g., after a CSS animation completes or after a window resize that changes element positions). **Asynchronous.**

```typescript
updateAllLayouts(): Promise<void>
```

```typescript
import { updateAllLayouts } from '@noriginmedia/norigin-spatial-navigation-core';

// After a scale animation finishes:
setTimeout(() => {
  updateAllLayouts();
}, 300);
```

---

## `setKeyMap(keyMap)`

Override the default keyboard mapping. Accepts key codes (numbers) or key event names (strings).

```typescript
setKeyMap(keyMap: {
  left?: number | string | (number | string)[];
  right?: number | string | (number | string)[];
  up?: number | string | (number | string)[];
  down?: number | string | (number | string)[];
  enter?: number | string | (number | string)[];
}): void
```

See [Key Mapping](../guides/key-mapping.md) for full documentation and examples.

---

## `setThrottle(options?)`

Update throttle settings at runtime without reinitializing.

```typescript
setThrottle(options?: {
  throttle?: number;
  throttleKeypresses?: boolean;
}): void
```

```typescript
import { setThrottle } from '@noriginmedia/norigin-spatial-navigation-core';

// Slow down navigation for a video scrubber
setThrottle({ throttle: 200, throttleKeypresses: true });

// Remove throttling
setThrottle({ throttle: 0 });
```

---

## `updateRtl(rtl)`

Toggle right-to-left mode at runtime. Useful when the user switches the application language.

```typescript
updateRtl(rtl: boolean): void
```

```typescript
import { updateRtl } from '@noriginmedia/norigin-spatial-navigation-core';

updateRtl(true); // enable RTL
updateRtl(false); // revert to LTR
```

See [RTL Support](../guides/rtl-support.md) for more.

---

## `ROOT_FOCUS_KEY`

A constant string (`'SN:ROOT'`) representing the root of the focus tree. Pass it to `setFocus` to boot navigation.

```typescript
import {
  ROOT_FOCUS_KEY,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

await setFocus(ROOT_FOCUS_KEY);
```
