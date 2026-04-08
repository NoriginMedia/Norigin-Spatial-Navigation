---
sidebar_position: 12
---

# Debugging

## Debug Logging

Enable `debug: true` in `init` to print navigation decisions to the browser console. Each key event logs:

- The direction pressed
- All candidate components and their distance scores
- The component selected as the next focus target

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: true, visualDebug: false });
```

Disable this in production, it generates a significant volume of log output.

---

## Visual Debugger

Enable `visualDebug: true` to render a canvas overlay on top of your application. The overlay draws:

- Bounding boxes of all registered focusable components
- The currently focused component highlighted
- Navigation candidate lines showing which elements are candidates in each direction

```typescript
init({ debug: false, visualDebug: true });
```

The visual debugger is the fastest way to diagnose unexpected navigation behavior because you can see exactly what the library "sees" in terms of component positions.

---

## Common Problems and Solutions

### Focus Does Not Move When Arrow Key Is Pressed

**Cause:** No focusable components are registered, or the initial focus was never set.

**Check:**

1. Confirm `init()` was called before any components mount.
2. Confirm `setFocus(ROOT_FOCUS_KEY)` or `setFocus('YOUR_CONTAINER')` is called after mount.
3. Enable `debug: true` and check the console for log output. If you see no navigation logs, key events are not reaching the library.

```typescript
import {
  init,
  setFocus,
  ROOT_FOCUS_KEY
} from '@noriginmedia/norigin-spatial-navigation-core';

init({ debug: true });

// In your root component:
useEffect(() => {
  setFocus(ROOT_FOCUS_KEY);
}, []);
```

---

### The Wrong Element Gets Focused

**Cause:** The distance calculation selects an unexpected element.

**Check:**

1. Enable `visualDebug: true` to see component bounding boxes. Are the positions what you expect?
2. Try a different `distanceCalculationMethod` (`'center'`, `'edges'`, `'corners'`) to see if it produces better results.
3. Check whether components are overlapping. Overlapping bounding boxes cause ambiguous scoring.

```typescript
init({ visualDebug: true, distanceCalculationMethod: 'edges' });
```

---

### Focus Escapes a Container That Should Be Bounded

**Cause:** `isFocusBoundary` is not set on the container, or it is set on the wrong component.

**Check:**

1. Ensure `isFocusBoundary: true` is on the direct container that wraps the focusable children.
2. Ensure the container provides `FocusContext.Provider` so children register under it.

```typescript
const { ref, focusKey } = useFocusable({
  isFocusBoundary: true, // must be on the container
  trackChildren: true
});

return (
  <FocusContext.Provider value={focusKey}>
    <div ref={ref}>{/* children */}</div>
  </FocusContext.Provider>
);
```

---

### Initial Focus Does Not Work

**Cause:** `setFocus` was called before `init`, or before the target component mounted.

**Check:**

1. Ensure `init()` is called at the module level (before `React.render`).
2. Call `setFocus` inside a `useEffect` (not during render), so the target component has had time to mount.

```typescript
// ✓ Correct: init at module level
init({ debug: false, visualDebug: false });

// ✓ Correct: setFocus inside useEffect
useEffect(() => {
  setFocus('MY_CONTAINER');
}, []);

// ✗ Wrong: setFocus during render
// setFocus('MY_CONTAINER'); // too early
```

---

### Component Position Is Measured Incorrectly

**Cause:** The component is CSS-transformed or inside a scaled container, and the default `offsetLeft/Top` measurement does not account for the transform.

**Solution:** Use the `getBoundingClientRect` layout adapter (replaces the deprecated `useGetBoundingClientRect: true` init flag):

```typescript
import {
  init,
  getBoundingClientRectAdapter
} from '@noriginmedia/norigin-spatial-navigation-core';

init({ layoutAdapter: getBoundingClientRectAdapter });
```

---

### Navigation Works in Browser but Not on TV

**Cause:** The TV remote sends different key codes than standard browser arrow keys.

**Solution:** Log the raw key codes on the device and configure `setKeyMap`:

```typescript
// Add this temporarily to discover TV key codes:
window.addEventListener('keydown', (e) => {
  console.log('keyCode:', e.keyCode, 'key:', e.key);
});

// Then configure:
import { setKeyMap } from '@noriginmedia/norigin-spatial-navigation-react';
setKeyMap({
  left: [402],
  right: [403],
  up: [400],
  down: [401],
  enter: [13]
});
```

---

### `ref` Warning in Console

**Cause:** The library prints a warning when `ref.current` is `null` at mount time.

This happens when `ref` is not attached to a DOM element, or the element has not rendered yet.

**Solution:** Make sure the `ref` returned by `useFocusable` is attached directly to a DOM element (not a React component wrapper):

```typescript
// ✓ Correct: ref on a DOM element
const { ref } = useFocusable();
return <div ref={ref}>...</div>;

// ✗ Wrong: ref on a React component (unless it forwards refs)
return <MyComponent ref={ref}>...</MyComponent>;
```

---

### Stale Callback Values

**Cause:** Callbacks (`onEnterPress`, `onFocus`, etc.) close over props that change after the first render.

**Solution:** Use `extraProps` to pass current prop values into callbacks:

```typescript
function Item({ id, isSelected }: { id: string; isSelected: boolean }) {
  const { ref } = useFocusable<{ id: string; isSelected: boolean }>({
    extraProps: { id, isSelected }, // always up to date
    onEnterPress: (props) => {
      console.log('Selected:', props.id, 'isSelected:', props.isSelected);
    }
  });

  return <div ref={ref} />;
}
```

---

## React DevTools

The `FocusContext` context is named `FocusContext` in React DevTools, making it easy to inspect the focus key hierarchy across your component tree.
