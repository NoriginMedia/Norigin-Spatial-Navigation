import { getContext, setContext, hasContext } from 'svelte';

// ─── Context Keys ────────────────────────────────────────────

const SPATIAL_ROOT_KEY = Symbol('spatial-navigation-root');
const SPATIAL_PARENT_KEY = Symbol('spatial-navigation-parent');

// ─── Type Definitions ────────────────────────────────────────

export interface SpatialRootContext {
  /** Whether SpatialNavigation.init() has been called */
  initialized: boolean;
}

export interface SpatialParentContext {
  /** The navKey of the nearest parent SpatialNode (or null for root) */
  navKey: string | null;
}

// ─── Root Context ────────────────────────────────────────────

export function setSpatialRootContext(value: SpatialRootContext): void {
  setContext(SPATIAL_ROOT_KEY, value);
}

export function getSpatialRootContext(): SpatialRootContext {
  if (!hasContext(SPATIAL_ROOT_KEY)) {
    throw new Error(
      '[norigin-spatial-navigation] <SpatialNode> must be rendered inside <SpatialRoot>. ' +
        'Wrap your app in <SpatialRoot> to initialize the navigation system.'
    );
  }
  return getContext<SpatialRootContext>(SPATIAL_ROOT_KEY);
}

// ─── Parent Context ──────────────────────────────────────────

export function setSpatialParentContext(value: SpatialParentContext): void {
  setContext(SPATIAL_PARENT_KEY, value);
}

export function getSpatialParentContext(): SpatialParentContext {
  if (!hasContext(SPATIAL_PARENT_KEY)) {
    // If no parent context exists, we're at root level
    return { navKey: null };
  }
  return getContext<SpatialParentContext>(SPATIAL_PARENT_KEY);
}
