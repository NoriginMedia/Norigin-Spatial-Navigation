---
sidebar_position: 1
---

# Norigin Spatial Navigation

The missing piece between your app and the TV remote.

Norigin Spatial Navigation is an open-source library that handles directional focus management — arrow keys, remote controls, gamepads — across Smart TVs, set-top boxes, and browsers. It automatically calculates which element to focus next based on spatial position, so you never have to wire directional logic by hand.

## Platform Support

| Platform                                          | Support                |
| ------------------------------------------------- | ---------------------- |
| Chrome, Firefox, Safari                           | ✅ Fully supported     |
| Samsung Tizen                                     | ✅ Fully supported     |
| LG webOS                                          | ✅ Fully supported     |
| Hisense VIDAA                                     | ✅ Fully supported     |
| Vizio OS                                          | ✅ Fully supported     |
| Titan OS                                          | ✅ Fully supported     |
| Chromium, Eikoh, and WebKit-based STBs            | ✅ Fully supported     |
| Android TV · React Native via `react-native-tvos` | ⚠️ Partially supported |
| Apple TV · React Native via `react-native-tvos`   | ⚠️ Partially supported |

## Packages

| Package                                          | Description             | Use when                      |
| ------------------------------------------------ | ----------------------- | ----------------------------- |
| `@noriginmedia/norigin-spatial-navigation-react` | React hooks bindings    | Building React apps           |
| `@noriginmedia/norigin-spatial-navigation-core`  | Framework-agnostic core | Custom framework integrations |
| `@noriginmedia/norigin-spatial-navigation`       | Legacy combined package | Upgrading from v1/v2          |
