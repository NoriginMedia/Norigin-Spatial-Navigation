---
sidebar_position: 5
---

# Event Callbacks

`useFocusable` exposes six event callbacks that let you respond to user interactions. All callbacks receive `extraProps` as their first argument, which avoids the stale-closure problems that come with referencing component props directly inside callback functions.

## Callback Overview

| Callback         | When it fires                          |
| ---------------- | -------------------------------------- |
| `onFocus`        | The component gains focus              |
| `onBlur`         | The component loses focus              |
| `onEnterPress`   | Enter key is pressed while focused     |
| `onEnterRelease` | Enter key is released while focused    |
| `onArrowPress`   | An arrow key is pressed while focused  |
| `onArrowRelease` | An arrow key is released while focused |

---

## Supporting Types

### `FocusableComponentLayout`

Passed to `onFocus` and `onBlur`. Contains the component's position and size at the moment focus changed.

```typescript
interface FocusableComponentLayout {
  left: number; // Distance from the left edge of the page
  top: number; // Distance from the top edge of the page
  width: number; // Element width
  height: number; // Element height
  x: number; // Same as left
  y: number; // Same as top
  readonly right: number; // left + width
  readonly bottom: number; // top + height
  node: NodeType;
}
```

`NodeType` is exported from `@noriginmedia/norigin-spatial-navigation-core` and defaults to **`HTMLElement`** on the web. On React Native TV, types are augmented so `node` matches the native host ref. See [SpatialNavigation](../api-reference/SpatialNavigation.md#node-type-and-node-type-overrides) and [React Native TV](./react-native-tv.md).

### `FocusDetails`

Passed to `onFocus` and `onBlur`. Contains optional context about how focus changed.

```typescript
interface FocusDetails {
  event?: Event; // Native keyboard event (if triggered by key press)
  nativeEvent?: Event; // Same as event (alternative field)
  [key: string]: any; // Any extra data passed via setFocus(key, focusDetails)
}
```

### `KeyPressDetails`

Passed to `onEnterPress` and `onArrowPress`. Contains a map of currently held keys.

```typescript
interface KeyPressDetails {
  pressedKeys: PressedKeys;
}

type PressedKeys = {
  [keyCode: string]: number; // key code → timestamp when the key was pressed
};
```

---

## `onFocus`

Called when this component gains focus.

```typescript
type FocusHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;
```

**Common use cases:**

- Scroll the viewport so the focused element is visible.
- Update external state to display a preview of the focused item.
- Animate the focused element into view.

```typescript
const { ref } = useFocusable({
  onFocus: (layout, props, details) => {
    // Scroll the parent container so this element is visible
    parentRef.current?.scrollTo({
      left: layout.x,
      behavior: 'smooth'
    });
  }
});
```

---

## `onBlur`

Called when this component loses focus.

```typescript
type BlurHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;
```

```typescript
const { ref } = useFocusable({
  onBlur: (layout, props, details) => {
    console.log('Lost focus:', props);
  }
});
```

---

## `onEnterPress`

Called when the Enter key is pressed while this component is focused.

```typescript
type EnterPressHandler<P = object> = (
  props: P,
  details: KeyPressDetails
) => void;
```

```typescript
const { ref } = useFocusable<{ id: string; title: string }>({
  extraProps: { id: 'asset-1', title: 'Movie Title' },

  onEnterPress: (props, details) => {
    console.log('Selected:', props.title);
    navigate(`/watch/${props.id}`);
  }
});
```

---

## `onEnterRelease`

Called when the Enter key is released.

```typescript
type EnterReleaseHandler<P = object> = (props: P) => void;
```

```typescript
const { ref } = useFocusable({
  onEnterRelease: (props) => {
    console.log('Enter released');
  }
});
```

---

## `onArrowPress`

Called when an arrow key is pressed. Return `true` to allow the library to navigate normally, or `false` to prevent navigation.

```typescript
type ArrowPressHandler<P = object> = (
  direction: string,
  props: P,
  details: KeyPressDetails
) => boolean;
```

The `direction` parameter is one of `'up'`, `'down'`, `'left'`, `'right'`.

**Return value:**

- `true` — proceed with spatial navigation (default behavior).
- `false` — cancel navigation; the component handles the key itself.

```typescript
const { ref } = useFocusable({
  onArrowPress: (direction, props, details) => {
    if (direction === 'left' && currentIndex === 0) {
      // At the leftmost item, prevent navigation out of the list
      return false;
    }
    return true;
  }
});
```

---

## `onArrowRelease`

Called when an arrow key is released. Use this to clean up continuous operations started in `onArrowPress` (e.g., scrubbing, scrolling, zooming).

```typescript
type ArrowReleaseHandler<P = object> = (direction: string, props: P) => void;
```

```typescript
const timerRef = useRef<NodeJS.Timer | null>(null);

const { ref, focused } = useFocusable({
  onArrowPress: (direction) => {
    if (direction === 'right' && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 100));
      }, 100);
    }
    return true;
  },

  onArrowRelease: (direction) => {
    if (direction === 'right') {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
});
```

---

## `extraProps` Pattern

The `extraProps` option passes data to all callbacks as their first argument. This is the recommended way to reference component props inside callbacks, because it avoids stale closures when props change.

```typescript
interface ItemProps {
  id: string;
  title: string;
  isNew: boolean;
}

function Item({ id, title, isNew }: ItemProps) {
  const { ref, focused } = useFocusable<ItemProps>({
    // extraProps is typed by the generic parameter P
    extraProps: { id, title, isNew },

    onEnterPress: (props) => {
      // props always has the latest value of id, title, isNew
      console.log('Selected item:', props.title, 'isNew:', props.isNew);
    },

    onFocus: (layout, props) => {
      console.log('Focused item:', props.id);
    }
  });

  return (
    <div ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      {title}
    </div>
  );
}
```

Without `extraProps`, you would need to wrap each callback in `useCallback` with the relevant dependencies to avoid stale values.

---

## Cleanup in `onArrowRelease`

Always clean up intervals and timers both in `onArrowRelease` and on unmount:

```typescript
const timerRef = useRef<NodeJS.Timer | null>(null);

useEffect(() => {
  return () => {
    // Clean up on unmount to prevent memory leaks
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, []);
```
