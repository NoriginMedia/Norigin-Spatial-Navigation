---
sidebar_position: 9
---

# Key Mapping

By default, the library listens for standard browser arrow key events. You can remap these to any key codes or key names to support custom remote controls, gamepads, or non-standard hardware.

## Default Key Map

```
left:  [37, 'ArrowLeft']
right: [39, 'ArrowRight']
up:    [38, 'ArrowUp']
down:  [40, 'ArrowDown']
enter: [13, 'Enter']
```

## `setKeyMap(keyMap)`

Call `setKeyMap` after `init` to override the default mappings.

```typescript
import { setKeyMap } from '@noriginmedia/norigin-spatial-navigation-react';

setKeyMap({
  left: 37,
  right: 39,
  up: 38,
  down: 40,
  enter: 13
});
```

Each direction accepts:

- A single key code (number): `37`
- A single key name (string): `'ArrowLeft'`
- An array of codes/names: `[37, 'ArrowLeft']`

## Key Map Type

```typescript
type KeyMap = {
  left?: (string | number)[];
  right?: (string | number)[];
  up?: (string | number)[];
  down?: (string | number)[];
  enter?: (string | number)[];
};
```

The legacy format (a single value per direction instead of an array) is also accepted for backwards compatibility.

---

## Samsung Tizen Remote

Samsung Tizen TVs use the same key codes as standard arrow keys for the directional pad, but have additional remote-specific keys:

```typescript
import {
  init,
  setKeyMap
} from '@noriginmedia/norigin-spatial-navigation-react';

init({ debug: false, visualDebug: false });

setKeyMap({
  left: [37, 'ArrowLeft'],
  right: [39, 'ArrowRight'],
  up: [38, 'ArrowUp'],
  down: [40, 'ArrowDown'],
  enter: [13, 'Enter'] // OK / Select button on Tizen
});
```

For Tizen, you may also need to register the keys with the Tizen API:

```javascript
// Tizen-specific key registration (not part of this library)
tizen.tvinputdevice.registerKey('ArrowLeft');
tizen.tvinputdevice.registerKey('ArrowRight');
tizen.tvinputdevice.registerKey('ArrowUp');
tizen.tvinputdevice.registerKey('ArrowDown');
tizen.tvinputdevice.registerKey('Enter');
```

---

## LG WebOS Remote

LG WebOS uses the same standard key codes in most cases:

```typescript
setKeyMap({
  left: [37, 'ArrowLeft'],
  right: [39, 'ArrowRight'],
  up: [38, 'ArrowUp'],
  down: [40, 'ArrowDown'],
  enter: [13, 'Enter']
});
```

---

## Custom Remote Control

If your device uses non-standard key codes, inspect the key codes with a `keydown` listener and then configure the map:

```typescript
// Step 1: Discover key codes
window.addEventListener('keydown', (e) => {
  console.log('keyCode:', e.keyCode, 'key:', e.key, 'code:', e.code);
});

// Step 2: Apply the discovered codes
import { setKeyMap } from '@noriginmedia/norigin-spatial-navigation-react';

setKeyMap({
  left: [402], // example: custom device left key code
  right: [403], // example: custom device right key code
  up: [400], // example: custom device up key code
  down: [401], // example: custom device down key code
  enter: [13, 32] // enter or space
});
```

---

## Multiple Codes Per Direction

You can map multiple physical keys to the same navigation direction. This is useful when you want both arrow keys and WASD to navigate:

```typescript
setKeyMap({
  left: [37, 'ArrowLeft', 65, 'KeyA'], // ← or A
  right: [39, 'ArrowRight', 68, 'KeyD'], // → or D
  up: [38, 'ArrowUp', 87, 'KeyW'], // ↑ or W
  down: [40, 'ArrowDown', 83, 'KeyS'], // ↓ or S
  enter: [13, 'Enter', 32, 'Space'] // Enter or Space
});
```

---

## Key Map and `shouldUseNativeEvents`

By default, the library calls `event.preventDefault()` on matched key events to suppress default browser scrolling. If you pass `shouldUseNativeEvents: true` to `init`, `preventDefault` is not called and the browser also handles the events.

```typescript
init({
  shouldUseNativeEvents: true // browser scroll behavior is preserved
});
```
