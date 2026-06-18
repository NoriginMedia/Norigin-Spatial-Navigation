import type {
  FocusableComponentLayout,
  FocusDetails,
  KeyPressDetails,
  Direction
} from '@noriginmedia/norigin-spatial-navigation-core';

/**
 * State exposed to snippet children of SpatialNode (advanced, renderless API).
 * Includes the `spatial` action for manual DOM binding.
 */
export type SpatialNodeState = {
  /** Whether this node currently has spatial focus */
  focused: boolean;
  /** Whether any descendant of this node has spatial focus */
  hasFocusedChild: boolean;
  /** focused OR hasFocusedChild — convenience shorthand */
  active: boolean;
  /** The resolved navigation key for this node */
  navKey: string;
  /** Imperatively move spatial focus to this node */
  focusSelf: (details?: FocusDetails) => void;
  /**
   * Svelte action to apply on the consumer's own DOM element.
   * This registers the element with the spatial navigation system.
   * Usage: <div use:spatial>...</div>
   */
  spatial: (node: HTMLElement) => { destroy: () => void };
};

/**
 * State exposed to snippet children of Focusable (simple convenience API).
 * No `spatial` action — the element is managed internally.
 */
export type FocusableState = {
  /** Whether this node currently has spatial focus */
  focused: boolean;
  /** Whether any descendant of this node has spatial focus */
  hasFocusedChild: boolean;
  /** focused OR hasFocusedChild — convenience shorthand */
  active: boolean;
  /** The resolved navigation key for this node */
  navKey: string;
  /** Imperatively move spatial focus to this node */
  focusSelf: (details?: FocusDetails) => void;
};

/**
 * Callback type for Enter key press
 */
export type EnterPressHandler<P = object> = (
  props: P,
  details: KeyPressDetails
) => void;

/**
 * Callback type for Enter key release
 */
export type EnterReleaseHandler<P = object> = (props: P) => void;

/**
 * Callback type for arrow key press. Return false to prevent default navigation.
 */
export type ArrowPressHandler<P = object> = (
  direction: string,
  props: P,
  details: KeyPressDetails
) => boolean;

/**
 * Callback type for arrow key release
 */
export type ArrowReleaseHandler<P = object> = (
  direction: string,
  props: P
) => void;

/**
 * Callback type for focus gained
 */
export type FocusHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;

/**
 * Callback type for focus lost
 */
export type BlurHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;
