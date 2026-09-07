---
sidebar_position: 16
---

# Accessibility Labels

Modern TV platforms have their own screen reader / Text-To-Speech (TTS) engines, and native `aria-*` support varies widely between them. This library provides a platform-agnostic way to declare accessibility labels on focusable components and receive a single callback every time focus moves, so you can route the resulting string to whichever TTS engine your target platform exposes.

The library does not implement Text-To-Speech itself. It only tells you _what_ to speak; _how_ to speak it is up to you.

## Overview

Two pieces work together:

1. A global [`onUtterText`](../api-reference/SpatialNavigation.md#init-config) callback passed to `init()`. The library invokes it with a `string` every time focus lands on a component whose own or ancestor labels need to be uttered.
2. A per-component [`accessibilityLabel`](../api-reference/useFocusable.md#accessibilitylabel) string passed to `useFocusable()`. Apply it to both leaf items (buttons, cards) and container components (rows, grids, menus).

When focus moves, the library walks up the focus tree from the newly focused component, collects the labels of any ancestor regions that are being entered for the first time, appends the leaf component's own label, and joins the list with `', '`. The resulting string is passed to `onUtterText`.

## Setup

### 1. Wire the callback

Connect `onUtterText` to your platform's TTS entry point at `init()` time:

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

init({
  debug: false,
  visualDebug: false,
  onUtterText: (text) => {
    // Replace with your platform's TTS API
    platformTTS.speak(text);
  }
});
```

A few examples of what `platformTTS.speak` might look like in practice:

| Platform           | Typical entry point                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Tizen (Samsung TV) | `tizen.tvinputdevice` + custom TTS bridge, or `window.webapis.tts.speak(text)` on some models |
| webOS (LG TV)      | `webOS.service.request('luna://com.webos.service.tts', { method: 'speak', ... })`             |
| Browser dev env    | `window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))`                            |

During development, logging to the console is usually enough:

```typescript
init({
  onUtterText: (text) => {
    // eslint-disable-next-line no-console
    console.log('onUtterText', text);
  }
});
```

### 2. Label your components

Add `accessibilityLabel` to `useFocusable()` on both leaves and containers:

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
    <div ref={ref} style={{ outline: focused ? '2px solid #42fdac' : 'none' }}>
      {title}
    </div>
  );
}

function ContentRow({ title }: { title: string }) {
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

**Try it live:** navigate the assets with the arrow keys. The panel shows exactly what `onUtterText` receives — region labels are announced the first time focus enters a region, then only the leaf label while you stay inside it.

<Sandpack>
```tsx
import React, { useEffect, useState } from 'react';
import { init, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation-react';

// The library calls onUtterText with the string to speak; forward it to React.
let onUtter: ((text: string) => void) | null = null;
init({
  debug: false,
  visualDebug: false,
  onUtterText: (text) => onUtter?.(text),
});

function Asset({ title }: { title: string }) {
  const { ref, focused } = useFocusable({ accessibilityLabel: title });
  return (
    <div ref={ref} style={{
      width: 130, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 6, color: 'white', textAlign: 'center', padding: 4,
      backgroundColor: focused ? '#7150DA' : '#333',
      outline: focused ? '2px solid #42fdac' : 'none',
    }}>
      {title}
    </div>
  );
}

function ContentRow({ title, rowKey, assets }: { title: string; rowKey: string; assets: string[] }) {
  const { ref, focusKey } = useFocusable({ focusKey: rowKey, accessibilityLabel: title });
  return (
    <FocusContext.Provider value={focusKey}>
      <section ref={ref} style={{ marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 8px', color: '#8a7fb0' }}>{title}</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {assets.map((a) => <Asset key={a} title={a} />)}
        </div>
      </section>
    </FocusContext.Provider>
  );
}

function Content() {
  const { ref, focusKey } = useFocusable({ focusKey: 'CONTENT', accessibilityLabel: 'Recommended' });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>
        <ContentRow title="Movies" rowKey="ROW_MOVIES" assets={['Inception', 'Interstellar']} />
        <ContentRow title="Series" rowKey="ROW_SERIES" assets={['Breaking Bad', 'The Wire']} />
      </div>
    </FocusContext.Provider>
  );
}

export default function App() {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    onUtter = (text) => setLog((prev) => [text, ...prev].slice(0, 6));
    setFocus('CONTENT'); // initial focus, captured now that onUtter is wired up
    return () => { onUtter = null; };
  }, []);

  return (
    <div style={{ padding: 24, backgroundColor: '#221c35', minHeight: '100vh', color: 'white' }}>
      <Content />
      <p style={{ color: '#8a7fb0', margin: '8px 0' }}>
        onUtterText output (what a TTS engine would speak):
      </p>
      <pre style={{
        background: '#1a1228', color: '#c9a6ff', padding: 16,
        borderRadius: 6, minHeight: 120, margin: 0, whiteSpace: 'pre-wrap',
      }}>
        {log.length ? log.join('\n') : '(navigate to hear regions announced)'}
      </pre>
    </div>
  );
}
```
</Sandpack>

### 3. Disable native `aria-*` if needed

If your app previously used `aria-label`, `role="region"`, or similar attributes on focusable elements, the browser (and any native screen reader running over it) may also try to announce them. When routing through `onUtterText`, strip or disable those native attributes on the same elements to avoid double-speaking.

## How labels are combined

The library keeps track of which parent containers already "contain" the currently focused component (`parentsHavingFocusedChild`). When focus changes:

1. Walk up the focus tree from the new leaf, collecting every ancestor focus key.
2. Filter that chain down to just the ancestors that were **not** already parents of the previous focus — these are the "newly entered regions".
3. Order them top-down (root → leaf) so the utterance reads in natural order.
4. For each newly entered ancestor, push its `accessibilityLabel` if set.
5. Push the leaf component's `accessibilityLabel` if set.
6. If anything was collected, join with `', '` and call `onUtterText(text)`.

This matches how a screen reader treats `aria-label` on `role="region"`: the region name is announced when focus enters the region for the first time, and subsequent movements inside the same region only announce the leaf.

### Worked example

Given this focus tree:

```
Menu (label="Main Menu")
  ├── Home (label="Home")
  └── Library (label="Library")
Content (label="Recommended")
  ├── Row 1 (label="Movies")
  │     ├── Asset 1 (label="Inception")
  │     └── Asset 2 (label="Interstellar")
  └── Row 2 (label="Series")
        ├── Asset 3 (label="Breaking Bad")
        └── Asset 4 (label="The Wire")
```

Navigating `Home` → `Inception` → `Interstellar` → `Breaking Bad` produces:

| Step                            | `onUtterText` argument             | Why                                                                       |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| `Home` → `Inception`            | `"Recommended, Movies, Inception"` | Entered `Content` and `Row 1` for the first time, plus the leaf label     |
| `Inception` → `Interstellar`    | `"Interstellar"`                   | Still inside `Row 1`; no new parent region entered — only the leaf label  |
| `Interstellar` → `Breaking Bad` | `"Series, Breaking Bad"`           | Left `Row 1` and entered `Row 2`; `Content` is unchanged, so it's skipped |

### When nothing is uttered

`onUtterText` is called only when at least one label is collected. Specifically, nothing is spoken when:

- The focus key didn't actually change (e.g. `setFocus()` re-focused the same component).
- The newly focused component has no `accessibilityLabel` and no newly-entered ancestor has one either.
- `onUtterText` was not passed to `init()`.

Leaves with no label that live inside a region that _does_ have a label will still utter just the region label when focus first enters the region, which is usually what you want for container-level announcements.

## Patterns and tips

### Make labels descriptive, not generic

Prefer the concrete item over the element type. `"Play"` is more useful than `"Button"`; `"Settings"` is more useful than `"Menu item 3"`.

### Update labels reactively

`accessibilityLabel` is one of the few `useFocusable` options that _is_ reactive after mount. Passing a new value triggers an update; the next focus change on that component will use the new label. This is useful for toggles and counters:

```typescript
function Favorite({
  title,
  isFavorited
}: {
  title: string;
  isFavorited: boolean;
}) {
  const { ref, focused } = useFocusable({
    accessibilityLabel: isFavorited
      ? `Remove ${title} from favorites`
      : `Add ${title} to favorites`
  });

  return <button ref={ref}>{/* ... */}</button>;
}
```

### Consider cancelling in-flight speech

Most TTS engines queue utterances by default. During fast scrolling, that queue can grow long and lag behind the focus state. A common mitigation is to cancel the current utterance before starting the new one:

```typescript
init({
  onUtterText: (text) => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
});
```

### Throttling

If you expect fast, repeated key presses (e.g. holding the arrow key), consider using the existing [`throttle`](../api-reference/SpatialNavigation.md#init-config) init option. Throttling focus changes also throttles TTS calls, which keeps the spoken feed in sync with what the user can actually process.

## API summary

| Location                                                                                      | Purpose                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`init({ onUtterText })`](../api-reference/SpatialNavigation.md#init-config)                  | Global callback fired with the text to be uttered when focus changes. |
| [`useFocusable({ accessibilityLabel })`](../api-reference/useFocusable.md#accessibilitylabel) | Per-component label. Set on both leaf items and containers.           |

See also: [`useFocusable`](../api-reference/useFocusable.md) and [`SpatialNavigation`](../api-reference/SpatialNavigation.md).
