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

Use `<SpatialNode>` to register any focusable node in the tree.

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

For a leaf node, apply `use:spatial` directly to the element you render:

```svelte
<!-- MenuItem.svelte -->
<script>
  import { SpatialNode } from '@noriginmedia/norigin-spatial-navigation-svelte';
  let { label } = $props();
</script>

<SpatialNode>
  {#snippet children({ focused, spatial })}
    <div use:spatial class="menu-item" class:focused>{label}</div>
  {/snippet}
</SpatialNode>
```

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

## Next Steps

- [API Reference: SpatialNode](../api-reference/SpatialNode.md)
- [Focus Hierarchy](./focus-hierarchy.md)
- [Recipes & Patterns](./recipes.md)
