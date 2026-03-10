---
sidebar_position: 6
---

# Focus Boundaries

A focus boundary prevents focus from escaping a container when the user presses an arrow key. This is essential for modal dialogs, isolated panels, and any UI region that should trap focus within itself.

## `isFocusBoundary`

Set `isFocusBoundary: true` on a container to block focus from leaving it in all directions.

```typescript
const { ref, focusKey } = useFocusable({
  focusKey: 'MODAL',
  isFocusBoundary: true
});
```

When the user reaches the edge of the container and presses an arrow key, focus stays on the last focusable element in that direction rather than escaping to a sibling container.

## `focusBoundaryDirections`

To block only specific directions, provide an array of direction strings:

```typescript
const { ref, focusKey } = useFocusable({
  focusKey: 'SIDEBAR',
  isFocusBoundary: true,
  focusBoundaryDirections: ['left'] // block left only
});
```

Valid direction values: `'up'`, `'down'`, `'left'`, `'right'`.

Without `focusBoundaryDirections`, all directions are blocked when `isFocusBoundary: true`.

---

## Modal Dialog Example

A modal should trap focus so the user cannot accidentally navigate to content behind it.

```typescript
import React, { useEffect } from 'react';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

interface ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmButton({
  label,
  onPress
}: {
  label: string;
  onPress: () => void;
}) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onPress()
  });

  return (
    <button
      ref={ref}
      style={{
        padding: '12px 24px',
        backgroundColor: focused ? '#0066cc' : '#444',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }}
    >
      {label}
    </button>
  );
}

function Modal({ onConfirm, onCancel }: ModalProps) {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusKey: 'MODAL',
    isFocusBoundary: true, // trap focus inside the modal
    trackChildren: true
  });

  // Focus the modal when it mounts
  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
      }}
    >
      <FocusContext.Provider value={focusKey}>
        <div
          ref={ref}
          style={{
            backgroundColor: '#222',
            padding: '40px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <p style={{ color: 'white', fontSize: '20px' }}>Are you sure?</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <ConfirmButton label="Confirm" onPress={onConfirm} />
            <ConfirmButton label="Cancel" onPress={onCancel} />
          </div>
        </div>
      </FocusContext.Provider>
    </div>
  );
}
```

When the modal mounts, it calls `focusSelf()` to claim focus. Because `isFocusBoundary: true`, pressing any arrow key keeps focus inside the modal. When the modal unmounts, `autoRestoreFocus` (enabled by default) returns focus to the previously focused component.

---

## Partial Boundary Example

A sidebar that should never let focus escape to the left (useful when the sidebar is on the left edge of the screen):

```typescript
const { ref, focusKey } = useFocusable({
  focusKey: 'SIDEBAR',
  isFocusBoundary: true,
  focusBoundaryDirections: ['left']
});
```

Focus can still move right from the sidebar (into the main content area), but pressing left at the leftmost sidebar item does nothing.

---

## Releasing a Boundary Programmatically

If you need to move focus out of a bounded container programmatically (e.g., the user presses a custom "escape" key), use `setFocus` or `navigateByDirection` from outside the boundary:

```typescript
import { setFocus } from '@noriginmedia/norigin-spatial-navigation-core';

function handleEscape() {
  // Boundaries only block spatial navigation from within;
  // programmatic setFocus always works regardless of boundaries.
  setFocus('MAIN_CONTENT');
}
```

---

## Combining Boundaries with `autoRestoreFocus`

When a bounded container unmounts, `autoRestoreFocus: true` (the default) returns focus to a sensible location. This pair is ideal for modals and overlays:

```typescript
const { ref, focusKey, focusSelf } = useFocusable({
  focusKey: 'MODAL',
  isFocusBoundary: true,
  autoRestoreFocus: true // focus returns to the trigger button when modal closes
});
```
