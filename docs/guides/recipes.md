---
sidebar_position: 14
---

# Recipes & Patterns

Common implementation patterns for TV and directional-navigation applications.

---

## Recipe 1: Horizontally Scrolling Content Row

A content row that automatically scrolls when a child card gains focus. This is the core pattern for Netflix-style content carousels.

```typescript
import React, { useCallback, useRef } from 'react';
import {
  useFocusable,
  FocusContext,
  FocusableComponentLayout
} from '@noriginmedia/norigin-spatial-navigation-react';

interface CardProps {
  title: string;
  color: string;
  onFocus: (layout: FocusableComponentLayout) => void;
}

function Card({ title, color, onFocus }: CardProps) {
  const { ref, focused } = useFocusable({ onFocus });

  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        height: '120px',
        flexShrink: 0,
        backgroundColor: color,
        borderRadius: '6px',
        outline: focused ? '3px solid white' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px'
      }}
    >
      {title}
    </div>
  );
}

interface ContentRowProps {
  title: string;
  items: { title: string; color: string }[];
}

function ContentRow({ title, items }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey } = useFocusable();

  const onCardFocus = useCallback((layout: FocusableComponentLayout) => {
    // Scroll so the focused card is visible
    scrollRef.current?.scrollTo({
      left: layout.x,
      behavior: 'smooth'
    });
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'white', marginBottom: '12px' }}>{title}</h2>
        <div ref={scrollRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div
            ref={ref}
            style={{ display: 'flex', gap: '16px', padding: '4px' }}
          >
            {items.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                color={item.color}
                onFocus={onCardFocus}
              />
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}
```

---

## Recipe 2: Sidebar Menu with Active Highlight

A sidebar that highlights when any of its items is focused, using `hasFocusedChild`.

```typescript
import React, { useEffect } from 'react';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

const MENU_ITEMS = ['Home', 'Movies', 'Series', 'Sports', 'Settings'];

function MenuItem({ label }: { label: string }) {
  const { ref, focused } = useFocusable();

  return (
    <div
      ref={ref}
      style={{
        padding: '14px 24px',
        color: focused ? 'white' : '#aaa',
        backgroundColor: focused ? '#6040a0' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '18px'
      }}
    >
      {label}
    </div>
  );
}

function Sidebar() {
  const { ref, focusKey, focusSelf, hasFocusedChild } = useFocusable({
    focusKey: 'SIDEBAR',
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ['left']
  });

  useEffect(() => {
    focusSelf();
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          width: '220px',
          padding: '24px 12px',
          backgroundColor: hasFocusedChild ? '#2d2050' : '#1a1228',
          transition: 'background-color 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {MENU_ITEMS.map((label) => (
          <MenuItem key={label} label={label} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}
```

---

## Recipe 3: Modal Dialog with Trapped Focus

A confirmation modal that prevents focus from reaching the content behind it.

```typescript
import React, { useEffect } from 'react';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

interface ModalButtonProps {
  label: string;
  primary?: boolean;
  onPress: () => void;
}

function ModalButton({ label, primary, onPress }: ModalButtonProps) {
  const { ref, focused } = useFocusable({ onEnterPress: () => onPress() });

  return (
    <button
      ref={ref}
      onClick={onPress}
      style={{
        padding: '12px 32px',
        backgroundColor: focused
          ? primary
            ? '#0055ff'
            : '#555'
          : primary
          ? '#0044cc'
          : '#444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        outline: focused ? '2px solid white' : 'none'
      }}
    >
      {label}
    </button>
  );
}

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusKey: 'CONFIRM_MODAL',
    isFocusBoundary: true,
    trackChildren: true,
    autoRestoreFocus: true // returns focus to the trigger when modal closes
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
      }}
    >
      <FocusContext.Provider value={focusKey}>
        <div
          ref={ref}
          style={{
            backgroundColor: '#222',
            borderRadius: '12px',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            maxWidth: '480px'
          }}
        >
          <p style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <ModalButton label="Confirm" primary onPress={onConfirm} />
            <ModalButton label="Cancel" onPress={onCancel} />
          </div>
        </div>
      </FocusContext.Provider>
    </div>
  );
}
```

---

## Recipe 4: Progress Bar with Continuous Arrow Key Hold

A seek bar that advances continuously while the right arrow key is held, and stops when released.

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation-react';

function SeekBar() {
  const [percent, setPercent] = useState(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const { ref, focused } = useFocusable({
    onArrowPress: (direction) => {
      if (direction === 'right' && timerRef.current === null) {
        timerRef.current = setInterval(() => {
          setPercent((p) => Math.min(p + 5, 100));
        }, 100);
      }
      if (direction === 'left' && timerRef.current === null) {
        timerRef.current = setInterval(() => {
          setPercent((p) => Math.max(p - 5, 0));
        }, 100);
      }
      // Return false to prevent navigating away while seeking
      if (direction === 'left' || direction === 'right') return false;
      return true;
    },

    onArrowRelease: (direction) => {
      if (direction === 'left' || direction === 'right') {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '400px',
        height: '20px',
        backgroundColor: '#555',
        borderRadius: '10px',
        outline: focused ? '2px solid white' : 'none',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: '100%',
          backgroundColor: focused ? 'deepskyblue' : 'dodgerblue',
          borderRadius: '10px',
          transition: 'background-color 0.15s'
        }}
      />
    </div>
  );
}
```

---

## Recipe 5: Focusing a Dynamically Added Item

When a new item is added to a list, focus it immediately.

```typescript
import React, { useState, useEffect } from 'react';
import {
  setFocus,
  doesFocusableExist
} from '@noriginmedia/norigin-spatial-navigation-core';

import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

function ListItem({ id }: { id: string }) {
  const { ref, focused } = useFocusable({ focusKey: `item-${id}` });

  return (
    <div
      ref={ref}
      style={{
        padding: '16px',
        backgroundColor: focused ? '#4040cc' : '#333',
        color: 'white',
        marginBottom: '8px',
        borderRadius: '4px'
      }}
    >
      Item {id}
    </div>
  );
}

function DynamicList() {
  const [items, setItems] = useState<string[]>(['1', '2', '3']);
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const { ref, focusKey } = useFocusable({ focusKey: 'DYNAMIC_LIST' });

  const addItem = () => {
    const newId = String(items.length + 1);
    setItems((prev) => [...prev, newId]);
    setPendingFocusId(newId); // remember to focus after render
  };

  // Focus the new item once it has mounted
  useEffect(() => {
    if (pendingFocusId !== null) {
      const focusKey = `item-${pendingFocusId}`;
      if (doesFocusableExist(focusKey)) {
        setFocus(focusKey);
        setPendingFocusId(null);
      }
    }
  }, [items, pendingFocusId]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div>
        <div ref={ref}>
          {items.map((id) => (
            <ListItem key={id} id={id} />
          ))}
        </div>
        <button onClick={addItem} style={{ marginTop: '16px' }}>
          Add Item
        </button>
      </div>
    </FocusContext.Provider>
  );
}
```

---

## Recipe 6: Back Navigation with Focus Memory

Save focus state when navigating forward, and restore it when going back.

```typescript
import React, { useState, useEffect } from 'react';
import {
  getCurrentFocusKey,
  setFocus
} from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext
} from '@noriginmedia/norigin-spatial-navigation-react';

// Simple focus history stack
const focusHistory: string[] = [];

function Screen({
  screenKey,
  children
}: {
  screenKey: string;
  children: React.ReactNode;
}) {
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: screenKey });

  useEffect(() => {
    focusSelf();
  }, [screenKey]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>{children}</div>
    </FocusContext.Provider>
  );
}

function App() {
  const [screen, setScreen] = useState<'home' | 'detail'>('home');

  const navigateToDetail = () => {
    // Save where we are before navigating away
    focusHistory.push(getCurrentFocusKey());
    setScreen('detail');
  };

  const goBack = () => {
    setScreen('home');
    const previousKey = focusHistory.pop();
    if (previousKey) {
      // Restore focus after the previous screen re-mounts
      setTimeout(() => setFocus(previousKey), 0);
    }
  };

  if (screen === 'detail') {
    return (
      <Screen screenKey="DETAIL_SCREEN">
        <button onClick={goBack}>← Back</button>
        <p>Detail content here</p>
      </Screen>
    );
  }

  return (
    <Screen screenKey="HOME_SCREEN">
      <button onClick={navigateToDetail}>Open Detail →</button>
    </Screen>
  );
}
```

---

## Recipe 7: Vertical Scrolling Page with Multiple Rows

A vertically scrolling page that auto-scrolls when the user navigates between rows.

```typescript
import React, { useCallback, useRef, useEffect } from 'react';
import {
  useFocusable,
  FocusContext,
  FocusableComponentLayout
} from '@noriginmedia/norigin-spatial-navigation-react';

const ROWS = ['Recommended', 'Movies', 'Series', 'TV Channels', 'Sport'];

function ContentRow({
  title,
  onFocus
}: {
  title: string;
  onFocus: (layout: FocusableComponentLayout) => void;
}) {
  const { ref, focusKey } = useFocusable({ onFocus });
  const scrollRef = useRef<HTMLDivElement>(null);

  const onCardFocus = useCallback((layout: FocusableComponentLayout) => {
    scrollRef.current?.scrollTo({ left: layout.x, behavior: 'smooth' });
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '12px' }}>{title}</h2>
        <div ref={scrollRef} style={{ overflowX: 'auto' }}>
          <div ref={ref} style={{ display: 'flex', gap: '16px' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '180px',
                  height: '100px',
                  flexShrink: 0,
                  backgroundColor: '#714ADD',
                  borderRadius: '6px'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

function Page() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: 'PAGE' });

  const onRowFocus = useCallback((layout: FocusableComponentLayout) => {
    pageRef.current?.scrollTo({ top: layout.y, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    focusSelf();
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={pageRef}
        style={{
          overflowY: 'auto',
          height: '100vh',
          backgroundColor: '#221c35'
        }}
      >
        <div ref={ref} style={{ padding: '40px' }}>
          {ROWS.map((title) => (
            <ContentRow key={title} title={title} onFocus={onRowFocus} />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
```
