<script lang="ts" generics="ExtraProps extends Record<string, any> = Record<string, never>">
  import type { Snippet } from 'svelte';
  import { uniqueId } from 'lodash-es';
  import { untrack } from 'svelte';
  import {
    SpatialNavigation,
    type FocusableComponentLayout,
    type FocusDetails,
    type KeyPressDetails,
    type Direction
  } from '@noriginmedia/norigin-spatial-navigation-core';
  import {
    getSpatialRootContext,
    getSpatialParentContext,
    setSpatialParentContext,
    type SpatialParentContext
  } from './context';
  import type { SpatialNodeState } from './types';

  // ─── Props ─────────────────────────────────────────────────

  type Props = {
    /** Unique key identifying this node in the navigation tree */
    navKey?: string;
    /** Whether this node can receive focus (default: true) */
    focusable?: boolean;
    /** Remember the last focused child when re-entering this container */
    saveLastFocusedChild?: boolean;
    /** Track whether any child has focus (enables hasFocusedChild) */
    trackChildren?: boolean;
    /** Auto-restore focus to this node's parent when this node unmounts */
    autoRestoreFocus?: boolean;
    /** Force focus to this container if nothing else is focused */
    forceFocus?: boolean;
    /**
     * Automatically focus this node after it registers with the navigation system.
     * Use for modals, dynamic views, or any component that should grab focus on mount.
     */
    autoFocus?: boolean;
    /** Prevent navigation from leaving this container */
    isFocusBoundary?: boolean;
    /** Directions in which navigation is blocked (when isFocusBoundary) */
    focusBoundaryDirections?: Direction[];
    /** Preferred child to focus when entering this container */
    preferredChildFocusKey?: string;
    /** Extra props passed to callbacks */
    extraProps?: ExtraProps;
    /** Accessibility label for screen reader announcement */
    accessibilityLabel?: string;

    // ─── Callbacks ─────────────────────────────────────────

    /** Called when Enter/OK is pressed while this node is focused */
    onEnterPress?: (props: ExtraProps, details: KeyPressDetails) => void;
    /** Called when Enter/OK is released */
    onEnterRelease?: (props: ExtraProps) => void;
    /** Called on arrow key press. Return false to prevent default navigation. */
    onArrowPress?: (direction: string, props: ExtraProps, details: KeyPressDetails) => boolean;
    /** Called when arrow key is released */
    onArrowRelease?: (direction: string, props: ExtraProps) => void;
    /** Called when this node gains spatial focus */
    onFocus?: (layout: FocusableComponentLayout, props: ExtraProps, details: FocusDetails) => void;
    /** Called when this node loses spatial focus */
    onBlur?: (layout: FocusableComponentLayout, props: ExtraProps, details: FocusDetails) => void;

    // ─── Bindable State ────────────────────────────────────

    /** Bindable: whether this node is currently focused */
    focused?: boolean;
    /** Bindable: whether any descendant is currently focused */
    hasFocusedChild?: boolean;

    // ─── Children ──────────────────────────────────────────

    /** Snippet children receiving SpatialNodeState */
    children?: Snippet<[SpatialNodeState]>;
  };

  let {
    navKey: navKeyProp,
    focusable = true,
    saveLastFocusedChild = true,
    trackChildren = false,
    autoRestoreFocus = true,
    forceFocus = false,
    autoFocus = false,
    isFocusBoundary = false,
    focusBoundaryDirections,
    preferredChildFocusKey,
    extraProps = {} as ExtraProps,
    accessibilityLabel,

    onEnterPress,
    onEnterRelease,
    onArrowPress,
    onArrowRelease,
    onFocus,
    onBlur,

    focused = $bindable(false),
    hasFocusedChild = $bindable(false),

    children
  }: Props = $props();

  // ─── Key Generation ────────────────────────────────────────

  const generatedKey = uniqueId('sn:focusable-item-');
  let navKey = $derived(navKeyProp ?? generatedKey);

  // ─── Context ───────────────────────────────────────────────

  const rootCtx = getSpatialRootContext();
  const parentCtx = getSpatialParentContext();

  // Provide own navKey as parent context for descendants
  const ownParentCtx = $state<SpatialParentContext>({ navKey: null });
  setSpatialParentContext(ownParentCtx);

  // Keep context in sync with navKey (handles initial + updates)
  $effect(() => {
    ownParentCtx.navKey = navKey;
  });

  // ─── Element Tracking ──────────────────────────────────────

  let element = $state<HTMLElement | null>(null);

  /**
   * Svelte action that consumers apply to their own DOM element.
   * This registers the element with the spatial navigation system.
   * Usage: <div use:spatial>...</div>
   */
  function spatial(node: HTMLElement) {
    element = node;
    node.setAttribute('data-spatial-key', navKey);

    return {
      destroy() {
        element = null;
      }
    };
  }

  // ─── Derived State ─────────────────────────────────────────

  let active = $derived(focused || hasFocusedChild);

  // ─── Imperative Methods ────────────────────────────────────

  function focusSelf(details: FocusDetails = {}) {
    SpatialNavigation.setFocus(navKey, details);
  }

  // ─── Snippet State ─────────────────────────────────────────

  let snippetState = $derived<SpatialNodeState>({
    focused,
    hasFocusedChild,
    active,
    navKey,
    focusSelf,
    spatial
  });

  // ─── Registration Effect ───────────────────────────────────
  // Only depends on: element, rootCtx.initialized, navKey, parentCtx.navKey
  // Must NOT depend on focused/hasFocusedChild or it will re-register on every focus change

  $effect(() => {
    const node = element;
    const parentKey = parentCtx.navKey ?? 'SN:ROOT';
    const key = navKey;
    const initialized = rootCtx.initialized;

    if (!initialized || !node) return;

    // Use untrack for everything that shouldn't trigger re-registration
    untrack(() => {
      SpatialNavigation.addFocusable({
        focusKey: key,
        node,
        parentFocusKey: parentKey,
        preferredChildFocusKey: preferredChildFocusKey,
        onEnterPress: (details?: KeyPressDetails) => {
          onEnterPress?.(extraProps, details!);
        },
        onEnterRelease: () => {
          onEnterRelease?.(extraProps);
        },
        onArrowPress: (direction: string, details: KeyPressDetails): boolean => {
          return onArrowPress?.(direction, extraProps, details) ?? true;
        },
        onArrowRelease: (direction: string) => {
          onArrowRelease?.(direction, extraProps);
        },
        onFocus: (layout: FocusableComponentLayout, details: FocusDetails) => {
          onFocus?.(layout, extraProps, details);
        },
        onBlur: (layout: FocusableComponentLayout, details: FocusDetails) => {
          onBlur?.(layout, extraProps, details);
        },
        onUpdateFocus: (isFocused: boolean = false) => {
          focused = isFocused;
        },
        onUpdateHasFocusedChild: (hasChild: boolean = false) => {
          hasFocusedChild = hasChild;
        },
        saveLastFocusedChild,
        trackChildren,
        isFocusBoundary,
        focusBoundaryDirections,
        autoRestoreFocus,
        forceFocus,
        focusable,
        accessibilityLabel
      });

      // Auto-focus this node after registration if requested
      if (autoFocus) {
        setTimeout(() => {
          SpatialNavigation.setFocus(key);
        }, 0);
      }
    });

    return () => {
      SpatialNavigation.removeFocusable({ focusKey: key });
    };
  });

  // ─── Update Effect (props changed but node didn't remount) ─
  // This syncs changed props to the core without re-registering

  $effect(() => {
    const node = element;
    const key = navKey;
    const initialized = rootCtx.initialized;

    if (!initialized || !node) return;

    // Read all prop dependencies so this effect reruns on prop changes
    const _deps = [
      preferredChildFocusKey, focusable, isFocusBoundary,
      focusBoundaryDirections, accessibilityLabel,
      onEnterPress, onEnterRelease, onArrowPress, onArrowRelease,
      onFocus, onBlur, extraProps
    ];

    SpatialNavigation.updateFocusable(key, {
      node,
      preferredChildFocusKey,
      focusable,
      isFocusBoundary,
      focusBoundaryDirections,
      onEnterPress: (details?: KeyPressDetails) => {
        onEnterPress?.(extraProps, details!);
      },
      onEnterRelease: () => {
        onEnterRelease?.(extraProps);
      },
      onArrowPress: (direction: string, details: KeyPressDetails): boolean => {
        return onArrowPress?.(direction, extraProps, details) ?? true;
      },
      onArrowRelease: (direction: string) => {
        onArrowRelease?.(direction, extraProps);
      },
      onFocus: (layout: FocusableComponentLayout, details: FocusDetails) => {
        onFocus?.(layout, extraProps, details);
      },
      onBlur: (layout: FocusableComponentLayout, details: FocusDetails) => {
        onBlur?.(layout, extraProps, details);
      },
      accessibilityLabel
    });
  });

  // ─── Data Attributes Effect (visual feedback) ──────────────
  // Separate effect so it doesn't interfere with registration

  $effect(() => {
    const node = element;
    if (!node) return;

    if (focused) {
      node.setAttribute('data-focused', 'true');
    } else {
      node.removeAttribute('data-focused');
    }
    if (hasFocusedChild) {
      node.setAttribute('data-has-focused-child', 'true');
    } else {
      node.removeAttribute('data-has-focused-child');
    }
  });
</script>

<!-- No wrapper element — just render children with state -->
{@render children?.(snippetState)}
