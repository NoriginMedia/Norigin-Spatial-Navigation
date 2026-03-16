---
sidebar_position: 4
---

# Focus Hierarchy & Context

Focusable components form a tree that mirrors your React component tree. This hierarchy determines how focus is routed when it enters a container, which child to restore when returning to a previously visited area, and how `hasFocusedChild` propagates upward.

## How Children Find Their Parent

The library uses React Context to communicate the parent's focus key to children. The parent wraps its children in `FocusContext.Provider`, passing its own `focusKey` as the value. Every child that calls `useFocusable` reads this context automatically.

```typescript
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function Row() {
  const { ref, focusKey } = useFocusable({ trackChildren: true });

  return (
    // Pass focusKey down so children register under this parent
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} style={{ display: 'flex', gap: '12px' }}>
        <Card title="Item 1" />
        <Card title="Item 2" />
        <Card title="Item 3" />
      </div>
    </FocusContext.Provider>
  );
}

function Card({ title }: { title: string }) {
  // No FocusContext.Provider needed — Card is a leaf
  const { ref, focused } = useFocusable();

  return (
    <div ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      {title}
    </div>
  );
}
```

## `trackChildren`

Set `trackChildren: true` on a container to receive `hasFocusedChild` updates. This tells the library to notify the container whenever any of its descendants gains or loses focus.

```typescript
const { ref, hasFocusedChild } = useFocusable({ trackChildren: true });

// hasFocusedChild is true when any descendant is focused
<div ref={ref} style={{ backgroundColor: hasFocusedChild ? '#4e4181' : '#362C56' }}>
```

Without `trackChildren: true`, `hasFocusedChild` is always `false`.

## `saveLastFocusedChild`

When `saveLastFocusedChild: true` (the default), a container remembers which of its children was last focused. When focus returns to the container, it is automatically routed to that remembered child instead of the first child.

```typescript
const { ref, focusKey } = useFocusable({
  saveLastFocusedChild: true // default
});
```

Set to `false` to always focus the first child (or `preferredChildFocusKey`) when entering the container.

## `preferredChildFocusKey`

Specify which child should receive focus by default when this container is first focused:

```typescript
const { ref, focusKey } = useFocusable({
  preferredChildFocusKey: 'PLAY_BUTTON'
});
```

This is overridden by `saveLastFocusedChild` after the user has navigated inside the container at least once.

## `autoRestoreFocus`

When `autoRestoreFocus: true` (the default), if the currently focused component unmounts, the library automatically restores focus to a nearby component. Set to `false` to manage focus restoration yourself.

## `forceFocus`

When `forceFocus: true`, this component becomes the default target for auto-restore focus logic if focus is lost and there is no other obvious candidate. Useful for a "home" element.

## Nested Hierarchy Example

The following example shows a page with a sidebar menu and a scrollable content area, each with their own focus subtree.

```typescript
import React, { useEffect } from 'react';
import { init, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function MenuItem({ label }: { label: string }) {
  const { ref, focused } = useFocusable();
  return (
    <div
      ref={ref}
      style={{ color: focused ? 'white' : 'gray', padding: '8px' }}
    >
      {label}
    </div>
  );
}

function Sidebar() {
  const { ref, focusKey, hasFocusedChild } = useFocusable({
    focusKey: 'SIDEBAR',
    trackChildren: true
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          width: '200px',
          backgroundColor: hasFocusedChild ? '#4e4181' : '#362c56',
          padding: '16px'
        }}
      >
        <MenuItem label="Home" />
        <MenuItem label="Movies" />
        <MenuItem label="Series" />
      </div>
    </FocusContext.Provider>
  );
}

function ContentCard({ title }: { title: string }) {
  const { ref, focused } = useFocusable();
  return (
    <div
      ref={ref}
      style={{
        width: '160px',
        height: '90px',
        backgroundColor: '#714ADD',
        outline: focused ? '3px solid white' : 'none',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}
    >
      {title}
    </div>
  );
}

function ContentArea() {
  const { ref, focusKey } = useFocusable({ focusKey: 'CONTENT' });

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{ flex: 1, display: 'flex', gap: '12px', padding: '16px' }}
      >
        <ContentCard title="Movie 1" />
        <ContentCard title="Movie 2" />
        <ContentCard title="Movie 3" />
      </div>
    </FocusContext.Provider>
  );
}

function App() {
  useEffect(() => {
    setFocus('SIDEBAR');
  }, []);

  return (
    <div
      style={{ display: 'flex', backgroundColor: '#221c35', height: '100vh' }}
    >
      <Sidebar />
      <ContentArea />
    </div>
  );
}
```

In this example:

- `Sidebar` and `ContentArea` are sibling containers.
- Arrow left/right navigates between the two containers.
- Arrow up/down navigates within the active container.
- `hasFocusedChild` highlights the active sidebar.
