---
sidebar_position: 10
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

The directional pad and OK button send the standard codes (37–40 and 13), so the default key map already covers them.

Tizen delivers six keys to an app without registration: `ArrowLeft`, `ArrowUp`, `ArrowRight`, `ArrowDown`, `Enter` and `Back`. These keys cannot be registered, so do not pass them to `registerKey`. Every other remote key, including the media and colour keys, reaches the app only after it is registered with the Tizen API:

```javascript
// Tizen-specific key registration (not part of this library)
tizen.tvinputdevice.registerKeyBatch(['MediaPlayPause', 'ColorF0Red']);
```

| Key                  | `keyCode` |
| -------------------- | --------- |
| `Back`               | 10009     |
| `MediaPlayPause`     | 10252     |
| `MediaPlay`          | 415       |
| `MediaPause`         | 19        |
| `MediaStop`          | 413       |
| `MediaFastForward`   | 417       |
| `MediaRewind`        | 412       |
| `MediaTrackPrevious` | 10232     |
| `MediaTrackNext`     | 10233     |
| `ColorF0Red`         | 403       |
| `ColorF1Green`       | 404       |
| `ColorF2Yellow`      | 405       |
| `ColorF3Blue`        | 406       |

Source: Samsung's [Remote Control](https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html) guide and [TVInputDevice API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvinputdevice-api.html) reference.

---

## LG WebOS Remote

The directional pad and OK button send the standard codes (37–40 and 13), so the default key map already covers them.

| Key                      | `keyCode` |
| ------------------------ | --------- |
| Back                     | 461       |
| Red, Green, Yellow, Blue | 403–406   |
| Play                     | 415       |
| Pause                    | 19        |
| Stop                     | 413       |
| Rewind                   | 412       |
| Fast-forward             | 417       |

Source: LG's [Magic Remote](https://webostv.developer.lge.com/develop/guides/magic-remote) guide, which lists the colour keys for the MR26GB Magic Remote and the media keys for conventional remotes.

---

## Back and Media Keys

The key map has entries for `left`, `right`, `up`, `down` and `enter` only. Keys outside it, such as Back and the media keys, are not handled or prevented by the library, so listen for them yourself:

```typescript
const BACK_KEY_CODES = [10009, 461]; // Samsung Tizen, LG webOS

window.addEventListener('keydown', (event) => {
  if (BACK_KEY_CODES.includes(event.keyCode)) {
    // Close the open overlay or go to the previous screen.
  }
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
