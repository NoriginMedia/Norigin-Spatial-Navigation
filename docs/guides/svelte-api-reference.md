---
sidebar_position: 5
---

# Svelte 5 API Reference

The Svelte 5 binding provides three components and a set of re-exported imperative functions.

---

## `<SpatialRoot>`

Initializes the spatial navigation system. Must wrap your entire app. Renders no DOM element.

### Props

| Prop                                | Type                               | Default     | Description                                                |
| ----------------------------------- | ---------------------------------- | ----------- | ---------------------------------------------------------- |
| `initialFocusKey`                   | `string`                           | `undefined` | Focus key to set initial focus on after all nodes register |
| `debug`                             | `boolean`                          | `false`     | Enable console debug logging                               |
| `visualDebug`                       | `boolean`                          | `false`     | Enable visual debug overlay                                |
| `throttle`                          | `number`                           | `0`         | Throttle key events in ms                                  |
| `throttleKeypresses`                | `boolean`                          | `false`     | Keep throttling between keypresses                         |
| `useGetBoundingClientRect`          | `boolean`                          | `false`     | Use getBoundingClientRect for layout                       |
| `shouldFocusDOMNode`                | `boolean`                          | `false`     | Call element.focus() on spatial focus                      |
| `domNodeFocusOptions`               | `FocusOptions`                     | `{}`        | Options for element.focus()                                |
| `shouldUseNativeEvents`             | `boolean`                          | `false`     | Don't preventDefault/stopPropagation                       |
| `rtl`                               | `boolean`                          | `false`     | Right-to-left navigation                                   |
| `distanceCalculationMethod`         | `'center' \| 'edges' \| 'corners'` | `'corners'` | Distance algorithm                                         |
| `customDistanceCalculationFunction` | `Function`                         | `undefined` | Custom distance function                                   |
| `onUtterText`                       | `(text: string) => void`           | `undefined` | Accessibility text callback                                |

### Example

```svelte
<SpatialRoot initialFocusKey="menu" debug={false} distanceCalculationMethod="center">
  <!-- your app -->
</SpatialRoot>
```

---

## `<SpatialNode>`

A renderless component that registers a focusable node in the navigation tree. Provides parent context automatically to all descendants.

### Props

| Prop                      | Type                               | Default        | Description                           |
| ------------------------- | ---------------------------------- | -------------- | ------------------------------------- |
| `navKey`                  | `string`                           | auto-generated | Unique navigation key                 |
| `focusable`               | `boolean`                          | `true`         | Can receive focus                     |
| `saveLastFocusedChild`    | `boolean`                          | `true`         | Remember last focused child           |
| `trackChildren`           | `boolean`                          | `false`        | Track child focus state               |
| `autoRestoreFocus`        | `boolean`                          | `true`         | Restore focus on unmount              |
| `forceFocus`              | `boolean`                          | `false`        | Force focus when nothing focused      |
| `autoFocus`               | `boolean`                          | `false`        | Focus this node after registration    |
| `isFocusBoundary`         | `boolean`                          | `false`        | Block navigation exit                 |
| `focusBoundaryDirections` | `Direction[]`                      | `undefined`    | Specific blocked directions           |
| `preferredChildFocusKey`  | `string`                           | `undefined`    | Preferred child to focus              |
| `extraProps`              | `object`                           | `{}`           | Extra props passed to callbacks       |
| `accessibilityLabel`      | `string`                           | `undefined`    | A11y label for utterance              |
| `onEnterPress`            | `(props, details) => void`         | —              | Enter key handler                     |
| `onEnterRelease`          | `(props) => void`                  | —              | Enter release handler                 |
| `onArrowPress`            | `(dir, props, details) => boolean` | —              | Arrow handler (return false to block) |
| `onArrowRelease`          | `(dir, props) => void`             | —              | Arrow release handler                 |
| `onFocus`                 | `(layout, props, details) => void` | —              | Focus gained handler                  |
| `onBlur`                  | `(layout, props, details) => void` | —              | Focus lost handler                    |

### Bindable State

| Prop              | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| `focused`         | `boolean` | Current focus state (use `bind:focused`)                |
| `hasFocusedChild` | `boolean` | Whether a child is focused (use `bind:hasFocusedChild`) |

### Snippet State (`SpatialNodeState`)

| Field             | Type                 | Description                                                  |
| ----------------- | -------------------- | ------------------------------------------------------------ |
| `focused`         | `boolean`            | Whether this node is focused                                 |
| `hasFocusedChild` | `boolean`            | Whether any descendant is focused                            |
| `active`          | `boolean`            | `focused \|\| hasFocusedChild`                               |
| `navKey`          | `string`             | Resolved navigation key                                      |
| `focusSelf`       | `(details?) => void` | Imperatively focus this node                                 |
| `spatial`         | `Action`             | Svelte action — apply to your DOM element with `use:spatial` |

### Example

```svelte
<SpatialNode navKey="sidebar" trackChildren>
  {#snippet children({ hasFocusedChild, spatial })}
    <nav use:spatial class:active={hasFocusedChild}>
      <!-- children automatically inherit "sidebar" as parent -->
    </nav>
  {/snippet}
</SpatialNode>
```

---

## `<Focusable>`

A convenience component for simple focusable elements. Renders a DOM element (default `<div>`) with the spatial action applied internally. Use for leaf nodes.

### Props

Accepts all `<SpatialNode>` props plus:

| Prop      | Type     | Default | Description                      |
| --------- | -------- | ------- | -------------------------------- |
| `as`      | `string` | `'div'` | HTML element tag to render       |
| `class`   | `string` | —       | CSS class (passed through)       |
| `style`   | `string` | —       | Inline style (passed through)    |
| `...rest` | any      | —       | All HTML attributes pass through |

### Snippet State (`FocusableState`)

| Field             | Type                 | Description                       |
| ----------------- | -------------------- | --------------------------------- |
| `focused`         | `boolean`            | Whether this node is focused      |
| `hasFocusedChild` | `boolean`            | Whether any descendant is focused |
| `active`          | `boolean`            | `focused \|\| hasFocusedChild`    |
| `navKey`          | `string`             | Resolved navigation key           |
| `focusSelf`       | `(details?) => void` | Imperatively focus this node      |

Note: Uses `content` snippet name (not `children`) to avoid internal naming conflicts.

### Example

```svelte
<Focusable navKey="play-btn" as="button" class="btn" onEnterPress={handlePlay}>
  {#snippet content({ focused })}
    <span class:focused>Play</span>
  {/snippet}
</Focusable>
```

---

## Imperative API

Re-exported from `@noriginmedia/norigin-spatial-navigation-core` for convenience:

```svelte
<script>
  import {
    setFocus,
    navigateByDirection,
    pause,
    resume,
    setKeyMap,
    updateAllLayouts,
    getCurrentFocusKey,
    doesFocusableExist
  } from '@noriginmedia/norigin-spatial-navigation-svelte';
</script>
```

See [SpatialNavigation API](./SpatialNavigation.md) for full details on these functions.
