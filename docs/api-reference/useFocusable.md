---
sidebar_position: 2
---

# useFocusable

`useFocusable` is the primary React hook for making a component navigable. It registers the component with the spatial navigation service, tracks focus state, and surfaces event callbacks.

## Signature

```typescript
function useFocusable<P = object, E = any>(
  config?: UseFocusableConfig<P>
): UseFocusableResult<E>;
```

The generic parameter `P` is the type of `extraProps`. The parameter `E` is the type of the element referenced by **`ref`** (defaults to `any`): on the web this is typically a DOM element type; on React Native TV it is the native view type you attach the ref to. See [React Native TV](../guides/react-native-tv.md).

---

## Configuration: `UseFocusableConfig<P>`

All options are optional.

| Option                    | Type                     | Default        | Description                                                                                                                            |
| ------------------------- | ------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `focusable`               | `boolean`                | `true`         | Whether this component can receive focus. Set to `false` to temporarily disable a component without unmounting it.                     |
| `saveLastFocusedChild`    | `boolean`                | `true`         | When focus returns to this container, restore focus to the last focused child instead of the first.                                    |
| `trackChildren`           | `boolean`                | `false`        | Update `hasFocusedChild` when any descendant gains or loses focus. Must be `true` to use `hasFocusedChild` for styling.                |
| `autoRestoreFocus`        | `boolean`                | `true`         | If this component is focused when it unmounts, automatically restore focus to the nearest other component.                             |
| `forceFocus`              | `boolean`                | `false`        | Mark this component as the preferred fallback target when focus is lost and no other candidate exists.                                 |
| `isFocusBoundary`         | `boolean`                | `false`        | Prevent focus from leaving this container in any direction. See [Focus Boundaries](../guides/focus-boundaries.md).                     |
| `focusBoundaryDirections` | `Direction[]`            | `undefined`    | Limit boundary behavior to specific directions only (e.g., `['up', 'left']`). Only used when `isFocusBoundary` is `true`.              |
| `focusKey`                | `string`                 | auto-generated | A stable, unique identifier for this component. Required for programmatic focus via `setFocus`.                                        |
| `preferredChildFocusKey`  | `string`                 | `undefined`    | Focus key of the child that should receive focus when this container is first entered.                                                 |
| `onEnterPress`            | `EnterPressHandler<P>`   | no-op          | Called when the Enter key is pressed while this component is focused.                                                                  |
| `onEnterRelease`          | `EnterReleaseHandler<P>` | no-op          | Called when the Enter key is released.                                                                                                 |
| `onArrowPress`            | `ArrowPressHandler<P>`   | `() => true`   | Called when an arrow key is pressed. Return `true` to allow default navigation, `false` to prevent it.                                 |
| `onArrowRelease`          | `ArrowReleaseHandler<P>` | no-op          | Called when an arrow key is released.                                                                                                  |
| `onFocus`                 | `FocusHandler<P>`        | no-op          | Called when this component gains focus.                                                                                                |
| `onBlur`                  | `BlurHandler<P>`         | no-op          | Called when this component loses focus.                                                                                                |
| `extraProps`              | `P`                      | `undefined`    | Arbitrary data passed as the first argument to all event callbacks. Use this to avoid closure stale-state issues.                      |
| `accessibilityLabel`      | `string`                 | `undefined`    | Text uttered by the global `onUtterText` callback when this component is focused. See [accessibilityLabel](#accessibilitylabel) below. |

---

## Result: `UseFocusableResult<E>`

| Property          | Type                                    | Description                                                                                                                                                                                                                             |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref`             | `RefObject<E>`                          | On the web, attach to the DOM element for this focusable. On React Native TV, attach to the native view the adapter measures. The library uses this ref for layout and navigation. See [React Native TV](../guides/react-native-tv.md). |
| `focused`         | `boolean`                               | `true` when this exact component is the current focus target.                                                                                                                                                                           |
| `hasFocusedChild` | `boolean`                               | `true` when any descendant of this component is focused. Only meaningful when `trackChildren: true`.                                                                                                                                    |
| `focusKey`        | `string`                                | The focus key in use (either the one you provided or the auto-generated one).                                                                                                                                                           |
| `focusSelf`       | `(focusDetails?: FocusDetails) => void` | Programmatically focus this component. Equivalent to calling `setFocus(focusKey)`.                                                                                                                                                      |

---

## Handler Type Signatures

```typescript
type EnterPressHandler<P = object> = (
  props: P,
  details: KeyPressDetails
) => void;

type EnterReleaseHandler<P = object> = (props: P) => void;

type ArrowPressHandler<P = object> = (
  direction: string,
  props: P,
  details: KeyPressDetails
) => boolean;

type ArrowReleaseHandler<P = object> = (direction: string, props: P) => void;

type FocusHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;

type BlurHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;
```

See [Event Callbacks](../guides/event-callbacks.md) for the full type definitions of `KeyPressDetails`, `FocusDetails`, and `FocusableComponentLayout`.

---

## Usage Examples

### Minimal leaf component

```typescript
function Button({ label }: { label: string }) {
  const { ref, focused } = useFocusable();

  return (
    <button ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      {label}
    </button>
  );
}
```

### Component with all callbacks

```typescript
import {
  useFocusable,
  FocusableComponentLayout,
  KeyPressDetails,
  FocusDetails
} from '@noriginmedia/norigin-spatial-navigation-react';

interface CardProps {
  id: string;
  title: string;
}

function Card({ id, title }: CardProps) {
  const { ref, focused } = useFocusable<CardProps>({
    focusKey: `card-${id}`,
    extraProps: { id, title },

    onFocus: (
      layout: FocusableComponentLayout,
      props: CardProps,
      details: FocusDetails
    ) => {
      console.log(
        'Focused card:',
        props.title,
        'at position',
        layout.x,
        layout.y
      );
    },

    onBlur: (layout: FocusableComponentLayout, props: CardProps) => {
      console.log('Blurred card:', props.title);
    },

    onEnterPress: (props: CardProps, details: KeyPressDetails) => {
      console.log('Enter pressed on:', props.title);
    },

    onEnterRelease: (props: CardProps) => {
      console.log('Enter released on:', props.title);
    },

    onArrowPress: (
      direction: string,
      props: CardProps,
      details: KeyPressDetails
    ) => {
      console.log('Arrow pressed:', direction, 'on', props.title);
      return true; // allow default navigation
    },

    onArrowRelease: (direction: string, props: CardProps) => {
      console.log('Arrow released:', direction, 'on', props.title);
    }
  });

  return (
    <div ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      {title}
    </div>
  );
}
```

### Container with child tracking

```typescript
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function Row({ title }: { title: string }) {
  const { ref, focusKey, hasFocusedChild } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div>
        <h2 style={{ color: hasFocusedChild ? 'white' : 'gray' }}>{title}</h2>
        <div ref={ref} style={{ display: 'flex', gap: '12px' }}>
          <Card id="1" title="Item 1" />
          <Card id="2" title="Item 2" />
          <Card id="3" title="Item 3" />
        </div>
      </div>
    </FocusContext.Provider>
  );
}
```

### Temporarily disabling focus

```typescript
function Button({ label, disabled }: { label: string; disabled: boolean }) {
  const { ref, focused } = useFocusable({
    focusable: !disabled // navigation skips this component when disabled
  });

  return (
    <button
      ref={ref}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {label}
    </button>
  );
}
```

### Using `focusSelf` to self-focus on mount

```typescript
import { useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';

function Modal() {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusKey: 'MODAL',
    isFocusBoundary: true
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return <div ref={ref}>{/* modal content */}</div>;
}
```

### `accessibilityLabel`

When the global `onUtterText` callback is configured on [`init()`](./SpatialNavigation.md#init-config), each focus change builds a string from the labels of any parent regions that focus has newly entered plus the label of the focused component itself. That string is then passed to your `onUtterText` callback, which typically hands it off to the platform's Text-To-Speech engine. See the [Accessibility Labels](../guides/accessibility-labels.md) guide for a full walkthrough.

Label on both leaf items and the containers that group them. Sibling focus moves inside the same parent only utter the leaf label; entering a new parent region prepends the parent's label.

```typescript
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function Asset({ title }: { title: string }) {
  const { ref, focused } = useFocusable({
    accessibilityLabel: title
  });

  return (
    <div ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      {title}
    </div>
  );
}

function Row({ title }: { title: string }) {
  const { ref, focusKey } = useFocusable({
    accessibilityLabel: title
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref}>
        <h2>{title}</h2>
        <Asset title="Inception" />
        <Asset title="Interstellar" />
      </section>
    </FocusContext.Provider>
  );
}
```

With the tree above, landing focus on `Inception` utters `"Movies, Inception"`. Moving focus to `Interstellar` only utters `"Interstellar"` (the `Row` region has not changed). Unlike most other options on this hook, `accessibilityLabel` is reactive — changing its value after mount is propagated to the navigation service and reflected on the next focus change.

---

## Notes

- The `ref` must be attached to a DOM element that has non-zero width and height when the component mounts. If the element is zero-sized, the library cannot measure its position and navigation to/from it will not work correctly.
- Config options other than `focusKey`, `focusable`, `isFocusBoundary`, `focusBoundaryDirections`, `preferredChildFocusKey`, and `accessibilityLabel` are **not** reactive after mount. Callbacks are updated via a separate effect, but structural options like `saveLastFocusedChild`, `trackChildren`, `autoRestoreFocus`, and `forceFocus` are only read at registration time.
- Use `extraProps` to pass data to callbacks instead of relying on closure variables. This avoids stale closure issues with callbacks that reference component props.
