---
sidebar_position: 7
---

# Programmatic Focus Control

In addition to automatic directional navigation, you can move focus manually from anywhere in your application.

## Methods Available

| Method                           | Source                   | Description                                         |
| -------------------------------- | ------------------------ | --------------------------------------------------- |
| `setFocus(focusKey)`             | Named export / singleton | Move focus to any component by focus key            |
| `focusSelf()`                    | `useFocusable` result    | Focus the current component without knowing its key |
| `navigateByDirection(direction)` | Named export / singleton | Simulate an arrow key press                         |
| `getCurrentFocusKey()`           | Named export / singleton | Get the currently focused component's key           |
| `doesFocusableExist(focusKey)`   | Named export / singleton | Check if a component is mounted before focusing it  |

---

## `setFocus(focusKey, focusDetails?)`

The most direct way to move focus. You must know the target's focus key.

```typescript
import {
  setFocus,
  ROOT_FOCUS_KEY
} from '@noriginmedia/norigin-spatial-navigation-core';

// Move focus to a specific component
setFocus('PLAY_BUTTON');

// Boot navigation at app start (routes to first eligible child)
setFocus(ROOT_FOCUS_KEY);
```

### Setting Initial Focus on Mount

```typescript
import { useEffect } from 'react';
import { setFocus } from '@noriginmedia/norigin-spatial-navigation-core';

function App() {
  useEffect(() => {
    setFocus('MAIN_MENU');
  }, []);

  return <MainMenu />;
}
```

### Providing a Stable `focusKey`

For `setFocus` to work, the target component must declare a matching `focusKey`:

```typescript
function PlayButton() {
  const { ref, focused } = useFocusable({ focusKey: 'PLAY_BUTTON' });

  return (
    <button ref={ref} style={{ outline: focused ? '2px solid white' : 'none' }}>
      Play
    </button>
  );
}

// Elsewhere:
setFocus('PLAY_BUTTON');
```

### Deep Linking

When your app loads with a URL that points to a specific item, focus that item once it mounts:

```typescript
import { useEffect } from 'react';
import {
  doesFocusableExist,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

function App({ initialItemId }: { initialItemId?: string }) {
  useEffect(() => {
    if (initialItemId) {
      const focusKey = `item-${initialItemId}`;
      if (doesFocusableExist(focusKey)) {
        setFocus(focusKey);
        return;
      }
    }
    // Fallback to default focus
    setFocus('MAIN_MENU');
  }, [initialItemId]);

  return <Layout />;
}
```

---

## `focusSelf(focusDetails?)`

Returned by `useFocusable`, `focusSelf` focuses the component without requiring you to know or capture the focus key externally. It is equivalent to calling `setFocus(focusKey)` where `focusKey` is the component's own key.

```typescript
import { useEffect } from 'react';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function Menu() {
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: 'MENU' });

  // Focus this menu when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>{/* menu items */}</div>
    </FocusContext.Provider>
  );
}
```

`focusSelf` is stable (referentially equal across renders) because it is memoized with `useCallback` inside the hook.

---

## `navigateByDirection(direction, focusDetails?)`

Simulate a directional arrow key press from the current focus position. Useful for gamepad buttons, virtual remote controls, or custom navigation triggers.

```typescript
import { navigateByDirection } from '@noriginmedia/norigin-spatial-navigation-core';

// Simulate pressing right arrow
navigateByDirection('right');

// Can also be used in response to gamepad input
window.addEventListener('gamepadconnected', () => {
  setInterval(() => {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad?.buttons[14]?.pressed) navigateByDirection('left');
    if (gamepad?.buttons[15]?.pressed) navigateByDirection('right');
    if (gamepad?.buttons[12]?.pressed) navigateByDirection('up');
    if (gamepad?.buttons[13]?.pressed) navigateByDirection('down');
  }, 50);
});
```

---

## `getCurrentFocusKey()`

Returns the focus key of the currently focused component. Use this to save focus state before performing an action that might disrupt focus.

```typescript
import {
  getCurrentFocusKey,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

function openFullscreen() {
  const savedKey = getCurrentFocusKey();

  enterFullscreenMode();

  // When fullscreen exits, restore focus
  document.addEventListener(
    'fullscreenchange',
    () => {
      if (!document.fullscreenElement) {
        setFocus(savedKey);
      }
    },
    { once: true }
  );
}
```

---

## `doesFocusableExist(focusKey)`

Returns `true` if the component with the given focus key is currently mounted and registered. This is a safety check to avoid calling `setFocus` on an unmounted component.

```typescript
import {
  doesFocusableExist,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

function restoreFocus(savedKey: string) {
  if (doesFocusableExist(savedKey)) {
    setFocus(savedKey);
  } else {
    setFocus('FALLBACK_COMPONENT');
  }
}
```

---

## Focus on Conditional Render

When a component is conditionally rendered, wait until it mounts before focusing it:

```typescript
import { useState, useEffect } from 'react';
import {
  setFocus,
  doesFocusableExist
} from '@noriginmedia/norigin-spatial-navigation-core';

function Parent() {
  const [showDetails, setShowDetails] = useState(false);

  const handleOpenDetails = () => {
    setShowDetails(true);
  };

  useEffect(() => {
    if (showDetails) {
      // Component just mounted, safe to focus now
      setFocus('DETAILS_PANEL');
    }
  }, [showDetails]);

  return (
    <>
      <Button onPress={handleOpenDetails} label="Open Details" />
      {showDetails && <DetailsPanel />}
    </>
  );
}
```

---

## Saving and Restoring Focus Across Navigation

A common TV app pattern is to save focus before navigating to a new screen and restore it when returning:

```typescript
import {
  getCurrentFocusKey,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';

const focusHistory: string[] = [];

function navigateTo(screen: string) {
  focusHistory.push(getCurrentFocusKey());
  showScreen(screen);
  setFocus(`${screen}-first-item`);
}

function goBack() {
  const previousKey = focusHistory.pop();
  showPreviousScreen();
  if (previousKey) {
    setFocus(previousKey);
  }
}
```
