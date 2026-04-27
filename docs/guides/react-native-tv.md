---
sidebar_position: 13
---

# React Native TV

Use this guide when you build **React Native TV** apps (Android TV, Apple TV, etc.) and want the same hook-based API as the web React package, with native layout measurement and remote or D-pad input wired through a **layout adapter**.

## Install

See [Installation](./installation.md#react-native-tv) for the package name and peer dependencies.

## Initialize the service

Call **`init`** once before your UI mounts (for example in your root module), and pass **`ReactNativeLayoutAdapter`** as the **`layoutAdapter`**. You do **not** use a separate “native mode” flag: replacing the default web adapter is how TV/native setups avoid `window` key listeners and use TV-specific APIs instead.

```typescript
import { init } from '@noriginmedia/norigin-spatial-navigation-core';
import { ReactNativeLayoutAdapter } from '@noriginmedia/norigin-spatial-navigation-react-native-tvos';

init({
  layoutAdapter: ReactNativeLayoutAdapter
});
```

## Imports and hooks

Import **`useFocusable`**, **`FocusContext`**, and the rest of the React API from **`@noriginmedia/norigin-spatial-navigation-react-native-tvos`**. That package re-exports everything from `@noriginmedia/norigin-spatial-navigation-react`, so you can keep a single import path in TV code.

```typescript
import {
  ReactNativeLayoutAdapter,
  useFocusable,
  FocusContext,
  ROOT_FOCUS_KEY
} from '@noriginmedia/norigin-spatial-navigation-react-native-tvos';
import { init, setFocus } from '@noriginmedia/norigin-spatial-navigation-core';
```

## `ReactNativeLayoutAdapter` and `Platform.OS`

The package exports a symbol named **`ReactNativeLayoutAdapter`**, which is implemented as the **default export** of the internal adapter module:

- On **native** platforms (iOS, Android, tvOS, etc.), it is the **React Native TV adapter** (measurement, TV focus, remote / pan handling).
- When **`Platform.OS === 'web'`** (for example React Native for Web or a shared bundle), it resolves to **`BaseWebAdapter`** from core so browser builds do not load TV-only native code paths.

If you only ship TV native binaries, you can treat this export as the TV adapter. If you share one bundle with **web**, be aware the same import behaves like the default web adapter on web.

## Attach `ref` to native views

On the web, `useFocusable`’s **`ref`** attaches to a **DOM element**. On React Native, attach **`ref`** to a host component that supports layout measurement (and TV focus APIs where applicable)—not a DOM node. See [useFocusable](../api-reference/useFocusable.md) for the full hook API; the behavior is the same, only the element type differs.

## TypeScript: `node` and `NodeType`

By default, core types use **`HTMLElement`** for focusable **`node`** references. The React Native adapter augments **`NodeTypeOverrides`** so that, in a project that loads the adapter’s types, **`node`** matches the React Native host ref type used for measurement and TV focus. For details, see [SpatialNavigation API reference](../api-reference/SpatialNavigation.md#node-type-and-node-type-overrides) (`NodeType` / `NodeTypeOverrides`).
