---
sidebar_position: 2
---

# Installation

## Recommended: React Package

For React applications, install the hooks-based package:

```bash
npm install @noriginmedia/norigin-spatial-navigation-core @noriginmedia/norigin-spatial-navigation-react
```

```bash
yarn add @noriginmedia/norigin-spatial-navigation-core @noriginmedia/norigin-spatial-navigation-react
```

**Peer dependency:** React >= 16.8.0

This package exports `useFocusable`, `FocusContext`, and all type definitions you need.

## Core Package (Framework-Agnostic)

If you need the navigation service without React bindings:

```bash
npm install @noriginmedia/norigin-spatial-navigation-core
```

This package exports the `SpatialNavigation` singleton and its types. You manage component registration yourself by calling `addFocusable` and `removeFocusable` directly.

## Legacy Combined Package

If you are upgrading from an older version of the library:

```bash
npm install @noriginmedia/norigin-spatial-navigation
```

This package re-exports everything from both `core` and `react`. It exists for backwards compatibility. New projects should use the specific packages above.

## TypeScript

All packages ship with bundled TypeScript declarations. No separate `@types/` package is needed.
