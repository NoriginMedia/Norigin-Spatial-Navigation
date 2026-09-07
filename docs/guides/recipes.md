---
sidebar_position: 15
---

# Recipes & Patterns

Common implementation patterns for TV and directional-navigation applications.

---

## Recipe 1: Horizontally Scrolling Content Row

A content row that automatically scrolls when a child card gains focus. This is the core pattern for Netflix-style content carousels.

**Try it live:** focus a card and press the left/right arrows — the row scrolls to keep the focused card in view.

<Sandpack alwaysOpen>
```tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
  FocusableComponentLayout,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function Card({ title, color, onFocus }: {
  title: string;
  color: string;
  onFocus: (layout: FocusableComponentLayout) => void;
}) {
  const { ref, focused } = useFocusable({ onFocus });
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 120,
        flexShrink: 0,
        backgroundColor: color,
        borderRadius: 6,
        outline: focused ? '3px solid #42fdac' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 16,
      }}
    >
      {title}
    </div>
  );
}

function ContentRow({ title, items }: {
  title: string;
  items: { title: string; color: string }[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, focusKey } = useFocusable();

  const onCardFocus = useCallback((layout: FocusableComponentLayout) => {
    scrollRef.current?.scrollTo({ left: layout.x, behavior: 'smooth' });
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'white', marginBottom: 12 }}>{title}</h2>
        <div ref={scrollRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
          <div ref={ref} style={{ display: 'flex', gap: 16, padding: 4 }}>
            {items.map((item) => (
              <Card key={item.title} title={item.title} color={item.color} onFocus={onCardFocus} />
            ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const ITEMS = [
  { title: 'Card 1', color: '#714ADD' },
  { title: 'Card 2', color: '#4e8cff' },
  { title: 'Card 3', color: '#e0518a' },
  { title: 'Card 4', color: '#3fb27f' },
  { title: 'Card 5', color: '#d98b3a' },
  { title: 'Card 6', color: '#8a5cf6' },
];

export default function App() {
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: 'ROOT' });
  useEffect(() => { focusSelf(); }, [focusSelf]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} style={{ padding: 24, backgroundColor: '#221c35', minHeight: '100vh' }}>
        <ContentRow title="Trending Now" items={ITEMS} />
      </div>
    </FocusContext.Provider>
  );
}
```
</Sandpack>

---

## Recipe 2: Sidebar Menu with Active Highlight

A sidebar that highlights when any of its items is focused, using `hasFocusedChild`.

**Try it live:** press up/down to move between items — the whole sidebar tints while it holds focus (`hasFocusedChild`).

<Sandpack alwaysOpen>
```tsx
import React, { useEffect } from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

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
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 18,
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
    focusBoundaryDirections: ['left'],
  });

  useEffect(() => { focusSelf(); }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          width: 220,
          padding: '24px 12px',
          backgroundColor: hasFocusedChild ? '#2d2050' : '#1a1228',
          transition: 'background-color 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {MENU_ITEMS.map((label) => (
          <MenuItem key={label} label={label} />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#221c35' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 32, color: '#8a7fb0' }}>Main content area</div>
    </div>
  );
}
```
</Sandpack>

---

## Recipe 3: Modal Dialog with Trapped Focus

A confirmation modal that prevents focus from reaching the content behind it.

**Try it live:** open the dialog, then try to arrow away — focus stays trapped between Confirm/Cancel, and returns to the trigger on close (`autoRestoreFocus`).

<Sandpack alwaysOpen>
```tsx
import React, { useEffect, useState } from 'react';
import { init, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function ModalButton({ label, primary, onPress }: {
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  const { ref, focused } = useFocusable({ onEnterPress: () => onPress() });
  return (
    <button
      ref={ref}
      onClick={onPress}
      style={{
        padding: '12px 32px',
        backgroundColor: focused ? (primary ? '#7150DA' : '#555') : (primary ? '#7e0ddb' : '#444'),
        color: 'white',
        border: 'none',
        borderRadius: 6,
        fontSize: 16,
        cursor: 'pointer',
        outline: focused ? '2px solid #42fdac' : 'none',
      }}
    >
      {label}
    </button>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusKey: 'CONFIRM_MODAL',
    isFocusBoundary: true,
    trackChildren: true,
    autoRestoreFocus: true,
  });

  useEffect(() => { focusSelf(); }, [focusSelf]);

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} style={{
          backgroundColor: '#222', borderRadius: 12, padding: 48,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, maxWidth: 480,
        }}>
          <p style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{message}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <ModalButton label="Confirm" primary onPress={onConfirm} />
            <ModalButton label="Cancel" onPress={onCancel} />
          </div>
        </div>
      </FocusContext.Provider>
    </div>
  );
}

function TriggerButton({ onPress }: { onPress: () => void }) {
  const { ref, focused } = useFocusable({ focusKey: 'TRIGGER', onEnterPress: () => onPress() });
  return (
    <button
      ref={ref}
      onClick={onPress}
      style={{
        padding: '12px 32px', backgroundColor: focused ? '#7150DA' : '#0044cc',
        color: 'white', border: 'none', borderRadius: 6, fontSize: 16,
        cursor: 'pointer', outline: focused ? '2px solid #42fdac' : 'none',
      }}
    >
      Delete account
    </button>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) setFocus('TRIGGER'); }, [open]);
  return (
    <div style={{ padding: 40, backgroundColor: '#221c35', minHeight: '100vh' }}>
      <TriggerButton onPress={() => setOpen(true)} />
      {open && (
        <ConfirmModal
          message="Are you sure you want to delete your account?"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
```
</Sandpack>

---

## Recipe 4: Progress Bar with Continuous Arrow Key Hold

A seek bar that advances continuously while the right arrow key is held, and stops when released.

**Try it live:** focus the bar, then hold the left/right arrow — the fill advances continuously and stops on release (`onArrowPress` / `onArrowRelease`).

<Sandpack alwaysOpen>
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function SeekBar() {
  const [percent, setPercent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ref, focused } = useFocusable({
    onArrowPress: (direction) => {
      if (direction === 'right' && timerRef.current === null) {
        timerRef.current = setInterval(() => setPercent((p) => Math.min(p + 5, 100)), 100);
      }
      if (direction === 'left' && timerRef.current === null) {
        timerRef.current = setInterval(() => setPercent((p) => Math.max(p - 5, 0)), 100);
      }
      if (direction === 'left' || direction === 'right') return false;
      return true;
    },
    onArrowRelease: (direction) => {
      if (direction === 'left' || direction === 'right') {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
  });

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: 400, height: 20, backgroundColor: '#555', borderRadius: 10,
        outline: focused ? '2px solid #42fdac' : 'none', overflow: 'hidden',
      }}
    >
      <div style={{
        width: `${percent}%`, height: '100%',
        backgroundColor: focused ? '#C64495' : '#74db',
        borderRadius: 10, transition: 'background-color 0.15s',
      }} />
    </div>
  );
}

export default function App() {
  const { ref, focusKey, focusSelf } = useFocusable({ focusKey: 'ROOT' });
  useEffect(() => { focusSelf(); }, [focusSelf]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} style={{
        padding: 60, backgroundColor: '#221c35', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center',
      }}>
        <p style={{ color: '#aaa' }}>Hold ← / → to seek</p>
        <SeekBar />
      </div>
    </FocusContext.Provider>
  );
}
```
</Sandpack>

---

## Recipe 5: Focusing a Dynamically Added Item

When a new item is added to a list, focus it immediately.

**Try it live:** navigate the items with up/down, then click **Add Item** — focus jumps to the freshly mounted row once it exists (`doesFocusableExist` + `setFocus`).

<Sandpack alwaysOpen>
```tsx
import React, { useState, useEffect } from 'react';
import { init, setFocus, doesFocusableExist } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

function ListItem({ id }: { id: string }) {
  const { ref, focused } = useFocusable({ focusKey: `item-${id}` });
  return (
    <div
      ref={ref}
      style={{
        padding: 16,
        backgroundColor: focused ? '#7150DA' : '#333',
        color: 'white',
        marginBottom: 8,
        borderRadius: 4,
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
    setPendingFocusId(newId);
  };

  useEffect(() => {
    if (pendingFocusId !== null) {
      const key = `item-${pendingFocusId}`;
      if (doesFocusableExist(key)) {
        setFocus(key);
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
        <button onClick={addItem} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>
          Add Item
        </button>
      </div>
    </FocusContext.Provider>
  );
}

export default function App() {
  useEffect(() => { setFocus('DYNAMIC_LIST'); }, []);
  return (
    <div style={{ padding: 40, backgroundColor: '#221c35', minHeight: '100vh', color: 'white' }}>
      <DynamicList />
    </div>
  );
}
```
</Sandpack>

---

## Recipe 6: Back Navigation with Focus Memory

Save focus state when navigating forward, and restore it when going back.

**Try it live:** focus a row and open the detail screen; pressing **Back** restores focus to where you left off. (The buttons are made focusable here so you can drive it with the keyboard.)

<Sandpack alwaysOpen>
```tsx
import React, { useState, useEffect } from 'react';
import { init, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

const focusHistory: string[] = [];

function Tile({ focusKey, label, autoFocus, onEnterPress }: {
  focusKey: string;
  label: string;
  autoFocus?: boolean;
  onEnterPress?: () => void;
}) {
  const { ref, focused, focusSelf } = useFocusable({ focusKey, onEnterPress });

  // Claim focus as soon as this tile mounts (e.g. the Back button on a new screen).
  useEffect(() => {
    if (autoFocus) focusSelf();
  }, [autoFocus, focusSelf]);

  return (
    <div
      ref={ref}
      onClick={onEnterPress}
      style={{
        padding: '16px 20px', marginBottom: 8, borderRadius: 6, cursor: 'pointer',
        color: 'white', backgroundColor: focused ? '#7150DA' : '#333',
        outline: focused ? '2px solid #42fdac' : 'none',
      }}
    >
      {label}
    </div>
  );
}

function Screen({ screenKey, children }: {
  screenKey: string;
  children: React.ReactNode;
}) {
  const { ref, focusKey } = useFocusable({ focusKey: screenKey });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>{children}</div>
    </FocusContext.Provider>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'detail'>('home');

  const navigateToDetail = () => {
    focusHistory.push(getCurrentFocusKey());
    setScreen('detail');
  };

  const goBack = () => {
    setScreen('home');
    const previousKey = focusHistory.pop();
    if (previousKey) {
      // Restore focus to where we were, once the home screen has re-mounted.
      setTimeout(() => setFocus(previousKey), 0);
    }
  };

  return (
    <div style={{ padding: 40, backgroundColor: '#221c35', minHeight: '100vh', color: 'white' }}>
      {screen === 'home' ? (
        // `key` forces a clean remount so focus keys register from scratch.
        <Screen key="home" screenKey="HOME_SCREEN">
          <h3 style={{ marginTop: 0 }}>Home</h3>
          <Tile focusKey="row-1" label="Row 1" autoFocus />
          <Tile focusKey="row-2" label="Row 2" />
          <Tile focusKey="row-3" label="Row 3" />
          <Tile focusKey="OPEN_DETAIL" label="Open Detail →" onEnterPress={navigateToDetail} />
        </Screen>
      ) : (
        <Screen key="detail" screenKey="DETAIL_SCREEN">
          <h3 style={{ marginTop: 0 }}>Detail</h3>
          <Tile focusKey="BACK" label="← Back" autoFocus onEnterPress={goBack} />
          <p style={{ color: '#8a7fb0' }}>Press Enter on Back — focus returns to where you were.</p>
        </Screen>
      )}
    </div>
  );
}
```
</Sandpack>

---

## Recipe 7: Vertical Scrolling Page with Multiple Rows

A vertically scrolling page that auto-scrolls when the user navigates between rows.

**Try it live:** press up/down to move between rows — the page scrolls vertically to keep the focused row in view (`onFocus` layout + `scrollTo`).

<Sandpack alwaysOpen>
```tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { init } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
  FocusableComponentLayout,
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

const ROWS = ['Recommended', 'Movies', 'Series', 'TV Channels', 'Sport', 'Clips', 'Sports', 'Continue Watching', 'News', 'Kids', 'Action', 'Drama'];

function Card({ rowScrollRef, onCardFocus, autoFocus }: {
  rowScrollRef: React.RefObject<HTMLDivElement>;
  onCardFocus: (layout: FocusableComponentLayout) => void;
  autoFocus?: boolean;
}) {
  const { ref, focused, focusSelf } = useFocusable({
    onFocus: (layout) => {
      rowScrollRef.current?.scrollTo({ left: Math.max(layout.x - 8, 0), behavior: 'smooth' });
      onCardFocus(layout);
    },
  });

  useEffect(() => { if (autoFocus) focusSelf(); }, [autoFocus, focusSelf]);

  return (
    <div ref={ref} style={{
      width: 180, height: 100, flexShrink: 0, borderRadius: 6,
      backgroundColor: '#714ADD',
      outline: focused ? '3px solid #42fdac' : 'none',
    }} />
  );
}

function ContentRow({ title, onCardFocus, firstRow }: {
  title: string;
  onCardFocus: (layout: FocusableComponentLayout) => void;
  firstRow?: boolean;
}) {
  const { ref, focusKey } = useFocusable();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ color: 'white', marginBottom: 12 }}>{title}</h2>
        <div ref={scrollRef} style={{ overflowX: 'auto' }}>
          <div ref={ref} style={{ display: 'flex', gap: 16, padding: 4 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Card
                key={i}
                rowScrollRef={scrollRef}
                onCardFocus={onCardFocus}
                autoFocus={firstRow && i === 0}
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
  const { ref, focusKey } = useFocusable({ focusKey: 'PAGE' });

  const onCardFocus = useCallback((layout: FocusableComponentLayout) => {
    const container = pageRef.current;
    const node = layout.node;
    if (!container || !node) return;

    
    const top =
      node.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      40; 

    container.scrollTo({ top, behavior: 'smooth' });
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={pageRef} style={{ overflowY: 'auto', height: '100vh', backgroundColor: '#221c35' }}>
        <div ref={ref} style={{ padding: 40 }}>
          {ROWS.map((title, idx) => (
            <ContentRow key={title} title={title} onCardFocus={onCardFocus} firstRow={idx === 0} />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

export default function App() {
  return <Page />;
}
```
</Sandpack>
