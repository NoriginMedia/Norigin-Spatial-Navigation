# Norigin Spatial Navigation Svelte

Svelte 5 spatial navigation components for TV apps, streaming platforms, and remote-control interfaces.

For more detailed documentation and usage examples, visit our [Developer Portal](https://devportal.noriginmedia.com/docs/Norigin-Spatial-Navigation/)

## Installation

```bash
npm install @noriginmedia/norigin-spatial-navigation-core @noriginmedia/norigin-spatial-navigation-svelte
```

**Peer dependencies:** Svelte >= 5.0.0

## Quick Start

```svelte
<script>
  import { SpatialRoot, SpatialNode } from '@noriginmedia/norigin-spatial-navigation-svelte';
</script>

<SpatialRoot initialFocusKey="btn-1">
  <SpatialNode navKey="btn-1">
    {#snippet children({ focused, spatial })}
      <button use:spatial class:focused>Button 1</button>
    {/snippet}
  </SpatialNode>

  <SpatialNode navKey="btn-2">
    {#snippet children({ focused, spatial })}
      <button use:spatial class:focused>Button 2</button>
    {/snippet}
  </SpatialNode>
</SpatialRoot>
```

## API

- **`<SpatialRoot>`** — Initializes the navigation system. Wrap your app in this.
- **`<SpatialNode>`** — Renderless component for focusable nodes. Exposes a `spatial` action.
- **`<Focusable>`** — Convenience component that renders an element with spatial navigation built-in.
- **Imperative API** — `setFocus`, `navigateByDirection`, `pause`, `resume`, etc.
