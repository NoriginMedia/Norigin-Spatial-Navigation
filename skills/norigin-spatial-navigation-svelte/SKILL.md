---
name: norigin-spatial-navigation-svelte
description: Use when building or modifying Svelte 5 UIs that need directional focus (arrow keys, TV remotes, gamepads) with the Norigin Spatial Navigation library. Covers `<SpatialNode>`, `<Focusable>`, `<SpatialRoot>`, `use:spatial` action, programmatic focus, and common Smart TV / set-top-box patterns.
---

# Norigin Spatial Navigation — Svelte 5

Library for arrow-key / remote-control focus management in Svelte 5 apps (Smart TVs, set-top boxes, browsers). It calculates the next focusable element based on spatial position, so you don't wire up directional logic manually.

**Full documentation:** https://github.com/NoriginMedia/Norigin-Spatial-Navigation/tree/main/docs

When you need details beyond this skill, read the relevant page directly:

- Concepts & hierarchy: `docs/guides/concepts.md`, `docs/guides/focus-hierarchy.md`
- Svelte quick start: `docs/guides/svelte-quick-start.md`
- Install: `docs/guides/installation.md`
- Svelte API (SpatialNode, Focusable, SpatialRoot): `docs/api-reference/SpatialNode.md`
- `SpatialNavigation` API (init, setFocus, pause, etc.): `docs/api-reference/SpatialNavigation.md`
- Boundaries / modals: `docs/guides/focus-boundaries.md`
- Programmatic focus: `docs/guides/programmatic-focus.md`
- Distance calculation tuning: `docs/guides/distance-calculation.md`
- Key mapping (custom remotes): `docs/guides/key-mapping.md`
- Event callbacks: `docs/guides/event-callbacks.md`
- Performance: `docs/guides/performance.md`
- Debugging: `docs/guides/debugging.md`
- Recipes (lists, grids): `docs/guides/recipes.md`
- Accessibility labels: `docs/guides/accessibility-labels.md`
- RTL: `docs/guides/rtl-support.md`

## Mental Model

Three component shapes exist:

1. **Leaf** — interactive element that receives focus. Use `<Focusable>` (simple) or `<SpatialNode>` with `use:spatial` action (full control).
2. **Container** — wraps focusable children. Use `<SpatialNode>` with `trackChildren`. Context is **automatic** — no Provider needed.
3. **Root** — app wrapper. Use `<SpatialRoot>` with configuration props.

Key difference from React: **context is automatic**. Every `<SpatialNode>` provides its `navKey` to descendants. No `FocusContext.Provider` needed.

## Initialization

Wrap your app with `<SpatialRoot>`:

```svelte
<script>
  import { SpatialRoot } from '@noriginmedia/norigin-spatial-navigation-svelte';
</script>

<SpatialRoot initialFocusKey="menu" debug={false}>
  <!-- app content -->
</SpatialRoot>
```

## Two-Tier API

### `<SpatialNode>` — Advanced (renderless, full control)

```svelte
<script>
  import { SpatialNode } from '@noriginmedia/norigin-spatial-navigation-svelte';
</script>

<SpatialNode navKey="sidebar" trackChildren>
  {#snippet children({ hasFocusedChild, spatial })}
    <nav use:spatial class:active={hasFocusedChild}>
      <!-- children auto-inherit parent context -->
    </nav>
  {/snippet}
</SpatialNode>
```

- Renders NO DOM element — consumer provides their own with `use:spatial`
- Exposes: `focused`, `hasFocusedChild`, `active`, `navKey`, `focusSelf`, `spatial`
- Use for containers, custom layouts, multi-element nodes

### `<Focusable>` — Simple (renders element for you)

```svelte
<script>
  import { Focusable } from '@noriginmedia/norigin-spatial-navigation-svelte';
</script>

<Focusable navKey="btn-1" as="button" class="btn" onEnterPress={handleClick}>
  {#snippet content({ focused })}
    <span class:focused>Click me</span>
  {/snippet}
</Focusable>
```

- Renders a `<div>` by default (configurable via `as`)
- Handles `use:spatial` internally
- Use for leaf nodes that just need focus state

## Common Props (both components)

| Prop                      | Type           | Default | Purpose                               |
| ------------------------- | -------------- | ------- | ------------------------------------- |
| `navKey`                  | `string`       | auto    | Unique identifier                     |
| `focusable`               | `boolean`      | `true`  | Can receive focus                     |
| `trackChildren`           | `boolean`      | `false` | Track descendant focus                |
| `saveLastFocusedChild`    | `boolean`      | `true`  | Remember last child                   |
| `autoRestoreFocus`        | `boolean`      | `true`  | Restore focus on unmount              |
| `forceFocus`              | `boolean`      | `false` | Fallback focus target                 |
| `autoFocus`               | `boolean`      | `false` | Focus after registration              |
| `isFocusBoundary`         | `boolean`      | `false` | Block navigation exit                 |
| `focusBoundaryDirections` | `Direction[]`  | —       | Specific blocked dirs                 |
| `preferredChildFocusKey`  | `string`       | —       | Preferred child on enter              |
| `extraProps`              | `object`       | `{}`    | Passed to callbacks                   |
| `accessibilityLabel`      | `string`       | —       | A11y utterance label                  |
| `onEnterPress`            | fn             | —       | Enter key pressed                     |
| `onEnterRelease`          | fn             | —       | Enter key released                    |
| `onArrowPress`            | fn → `boolean` | —       | Arrow pressed (return false to block) |
| `onArrowRelease`          | fn             | —       | Arrow released                        |
| `onFocus`                 | fn             | —       | Focus gained                          |
| `onBlur`                  | fn             | —       | Focus lost                            |

## Bindable State

```svelte
<SpatialNode bind:focused bind:hasFocusedChild>
```

## Imperative Functions

```svelte
<script>
  import { setFocus, navigateByDirection, pause, resume } from '@noriginmedia/norigin-spatial-navigation-svelte';

  setFocus('settings');
  navigateByDirection('right');
  pause();
  resume();
</script>
```

## Patterns

### Focus on mount (use initialFocusKey on Root)

```svelte
<SpatialRoot initialFocusKey="menu">
```

### Focus a modal on mount (use autoFocus)

```svelte
<SpatialNode navKey="modal" autoFocus isFocusBoundary>
```

### Scrolling content row

```svelte
<script>
  let scrollEl;
  function onAssetFocus(layout) {
    scrollEl?.scrollTo({ left: layout.x, behavior: 'smooth' });
  }
</script>

<SpatialNode navKey="row-1">
  {#snippet children({ spatial })}
    <div use:spatial>
      <div bind:this={scrollEl} class="scroll-container">
        {#each assets as asset}
          <SpatialNode onFocus={onAssetFocus}>
            {#snippet children({ focused, spatial: itemSpatial })}
              <div use:itemSpatial class:focused>{asset.title}</div>
            {/snippet}
          </SpatialNode>
        {/each}
      </div>
    </div>
  {/snippet}
</SpatialNode>
```

### Block navigation in a direction

```svelte
<SpatialNode isFocusBoundary focusBoundaryDirections={['up', 'left']}>
```

### Arrow key hold (progress bar)

```svelte
<script>
  let timer = null;
  let percent = $state(0);

  function handleArrowPress(dir) {
    if (dir === 'right' && !timer) {
      timer = setInterval(() => { percent = Math.min(100, percent + 5); }, 100);
    }
    return true;
  }

  function handleArrowRelease(dir) {
    if (dir === 'right') { clearInterval(timer); timer = null; }
  }
</script>

<SpatialNode onArrowPress={handleArrowPress} onArrowRelease={handleArrowRelease}>
  {#snippet children({ spatial })}
    <div use:spatial style:width="{percent}%"></div>
  {/snippet}
</SpatialNode>
```
