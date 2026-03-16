---
sidebar_position: 10
---

# RTL Support

Norigin Spatial Navigation supports right-to-left (RTL) layouts used in languages such as Arabic and Hebrew. In RTL mode, the left and right navigation directions are swapped so that pressing the right arrow moves focus to the left in visual terms, matching the natural reading direction of the layout.

## Enabling RTL at Startup

Pass `rtl: true` to `init`:

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';

init({
  rtl: true
});
```

With RTL enabled:

- Pressing `ArrowRight` → navigates to the spatially left component
- Pressing `ArrowLeft` → navigates to the spatially right component
- `ArrowUp` and `ArrowDown` behave the same as in LTR mode

## Enabling RTL at Runtime

Use `updateRtl` to switch the layout direction without reinitializing the service. This is useful when users can switch the application language while it is running.

```typescript
import { updateRtl } from '@noriginmedia/norigin-spatial-navigation-core';

// Switch to RTL
updateRtl(true);

// Switch back to LTR
updateRtl(false);
```

## Example: Language-Driven RTL Toggle

```typescript
import React, { useEffect } from 'react';
import { init, updateRtl } from '@noriginmedia/norigin-spatial-navigation-core';

// Initialize with the default direction
init({ rtl: false });

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

function App({ language }: { language: string }) {
  const isRtl = RTL_LANGUAGES.includes(language);

  useEffect(() => {
    updateRtl(isRtl);
    // Also update the document direction for CSS
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [isRtl]);

  return <div dir={isRtl ? 'rtl' : 'ltr'}>{/* your app */}</div>;
}
```

## RTL and Focus Hierarchy

RTL mode affects only the interpretation of arrow key directions. The focus hierarchy, `FocusContext`, boundaries, and all other features work identically. Your component code does not need to change.

## RTL and Custom Key Maps

If you use `setKeyMap` with custom key codes, RTL mode still applies on top of your mapping. The library swaps the logical meaning of left and right navigation internally, regardless of which physical keys trigger them.

## Testing RTL Navigation

Enable `debug: true` to see console output showing which direction the library is interpreting each key press:

```typescript
init({ rtl: true, debug: true });
// Console output will show "navigating left" when ArrowRight is pressed
```
