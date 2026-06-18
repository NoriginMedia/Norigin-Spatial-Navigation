---
sidebar_position: 4
---

# Svelte 5 Quick Start

This guide shows you the minimum code needed to get spatial navigation working in a Svelte 5 application.

## Step 1: Wrap Your App in SpatialRoot

`SpatialRoot` initializes the navigation system and provides context to all descendant nodes.

```svelte
<!-- App.svelte -->
<script>
  import { SpatialRoot } from '@noriginmedia/norigin-spatial-navigation-svelte';
  import Menu from './Menu.svelte';
</script>

<SpatialRoot initialFocusKey="menu">
  <Menu />
</SpatialRoot>
```

The `initialFocusKey` prop tells the library which node to focus on startup.

## Step 2: Create Focusable Components

Use `<SpatialNode>` for full control, or `<Focusable>` for simple leaf nodes.

### Using `<SpatialNode>` (advanced — full control)

```svelte
<!-- Menu.svelte -->
<script>
  import { SpatialNode } from '@noriginmedia/norigin-spatial-navigation-svelte';
  import MenuItem from './MenuItem.svelte';
</script>

<SpatialNode navKey="menu" trackChildren>
  {#snippet children({ hasFocusedChild, spatial })}
    <nav use:spatial class:active={hasFocusedChild}>
      <MenuItem label="Home" />
      <MenuItem label="Settings" />
    </nav>
  {/snippet}
</SpatialNode>
```

Key points:

- `<SpatialNode>` renders **no DOM element** — you provide your own via the snippet
- Apply `use:spatial` on your element to register it with the navigation system
- Destructure `focused`, `hasFocusedChild`, `active`, `focusSelf` from the snippet state
- Parent context is **automatic** — children inherit the parent key without any Provider

### Using `<Focusable>` (simple — element rendered for you)

```svelte
<!-- MenuItem.svelte -->
<script>
  import { Focusable } from '@noriginmedia/norigin-spatial-navigation-svelte';
  let { label } = $props();
</script>

<Focusable class="menu-item">
  {#snippet content({ focused })}
    <span class:focused>{label}</span>
  {/snippet}
</Focusable>
```

`<Focusable>` renders a `<div>` (configurable via `as` prop) and handles the `use:spatial` action internally. Use it for leaf nodes that just need focus state.

## Step 3: Style Focused State

Two options for styling:

### Option A: CSS class via snippet state

```svelte
<SpatialNode>
  {#snippet children({ focused, spatial })}
    <div use:spatial class:focused>...</div>
  {/snippet}
</SpatialNode>

<style>
  .focused { border: 2px solid white; }
</style>
```

### Option B: `data-focused` attribute (automatic)

The library automatically sets `data-focused="true"` on the element when focused:

```css
[data-focused='true'] {
  border: 2px solid white;
}
```

## Step 4: Handle Events

```svelte
<SpatialNode
  navKey="play-btn"
  onEnterPress={(props, details) => console.log('Enter pressed!')}
  onFocus={(layout, props, details) => console.log('Focused!', layout)}
>
  {#snippet children({ focused, spatial })}
    <button use:spatial class:focused>Play</button>
  {/snippet}
</SpatialNode>
```

## Step 5: Programmatic Focus

```svelte
<script>
  import { setFocus } from '@noriginmedia/norigin-spatial-navigation-svelte';

  function goToSettings() {
    setFocus('settings');
  }
</script>
```

## Two-Tier API Summary

| Use Case                           | Component       | When to Use                                             |
| ---------------------------------- | --------------- | ------------------------------------------------------- |
| Leaf nodes (buttons, cards, items) | `<Focusable>`   | Simple — just need focused state                        |
| Containers (menus, rows, sections) | `<SpatialNode>` | Need `trackChildren`, `hasFocusedChild`, custom element |
| Full control (complex layouts)     | `<SpatialNode>` | Need multiple elements, custom DOM structure            |

## Next Steps

- [API Reference: SpatialNode](../api-reference/SpatialNode.md)
- [Focus Hierarchy](./focus-hierarchy.md)
- [Recipes & Patterns](./recipes.md)
