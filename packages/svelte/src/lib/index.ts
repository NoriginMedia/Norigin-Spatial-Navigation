// ─── Components ──────────────────────────────────────────────
export { default as SpatialRoot } from './SpatialRoot.svelte';
export { default as SpatialNode } from './SpatialNode.svelte';
export { default as Focusable } from './Focusable.svelte';

// ─── Types ───────────────────────────────────────────────────
export type {
  SpatialNodeState,
  FocusableState,
  EnterPressHandler,
  EnterReleaseHandler,
  ArrowPressHandler,
  ArrowReleaseHandler,
  FocusHandler,
  BlurHandler
} from './types';

export type { SpatialRootContext, SpatialParentContext } from './context';

// ─── Re-exports from Core (convenience) ─────────────────────
export {
  SpatialNavigation,
  ROOT_FOCUS_KEY,
  init,
  destroy,
  setFocus,
  navigateByDirection,
  pause,
  resume,
  setKeyMap,
  setThrottle,
  updateAllLayouts,
  getCurrentFocusKey,
  doesFocusableExist,
  updateRtl
} from '@noriginmedia/norigin-spatial-navigation-core';

// ─── Type Re-exports from Core ──────────────────────────────
export type {
  Direction,
  FocusableComponentLayout,
  FocusDetails,
  KeyPressDetails,
  PressedKeys,
  KeyMap,
  BackwardsCompatibleKeyMap,
  SpatialNavigationServiceInit
} from '@noriginmedia/norigin-spatial-navigation-core';
