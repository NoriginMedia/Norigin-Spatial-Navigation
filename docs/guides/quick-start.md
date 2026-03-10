---
sidebar_position: 3
---

# Quick Start

This guide shows you the minimum code needed to get spatial navigation working in a React application.

## Step 1: Initialize the Service

Call `init` once at the top level of your application, before any components mount. A good place is the module body of your root file (e.g., `App.tsx` or `index.tsx`).

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

init({
  debug: false,
  visualDebug: false
});
```

## Step 2: Create a Focusable Component

Use the `useFocusable` hook to make a component navigable. Attach the returned `ref` to the DOM element you want to be focusable, and use `focused` to apply focus styles.

```typescript
import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';

function Button({ label }: { label: string }) {
  const { ref, focused } = useFocusable();

  return (
    <div
      ref={ref}
      style={{
        padding: '16px 32px',
        backgroundColor: focused ? '#0066cc' : '#333',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {label}
    </div>
  );
}
```

## Step 3: Create a Container and Set Initial Focus

Group your focusable components inside a container that uses `FocusContext.Provider`. Call `setFocus` with `ROOT_FOCUS_KEY` (or the container's `focusKey`) to boot navigation when the app mounts.

```typescript
import React, { useEffect } from 'react';
import {
  useFocusable,
  FocusContext,
  ROOT_FOCUS_KEY
} from '@noriginmedia/norigin-spatial-navigation-react';

function ButtonRow() {
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: 'BUTTON_ROW' });

  useEffect(() => {
    focusSelf();
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} style={{ display: 'flex', gap: '16px' }}>
        <Button label="Play" />
        <Button label="Pause" />
        <Button label="Stop" />
      </div>
    </FocusContext.Provider>
  );
}
```

## Step 4: Wire Up Your App

```typescript
import React from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function App() {
  return (
    <div
      style={{ padding: '40px', backgroundColor: '#111', minHeight: '100vh' }}
    >
      <ButtonRow />
    </div>
  );
}

export default App;
```

## What Happens Now

1. When `ButtonRow` mounts, `focusSelf()` routes focus to the first child `Button`.
2. Pressing the right arrow key moves focus to the next `Button`.
3. The focused `Button` renders with a blue background; unfocused ones render dark.
4. Pressing enter on a focused `Button` would trigger `onEnterPress` if you configured it.
