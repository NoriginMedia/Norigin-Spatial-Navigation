<script lang="ts" generics="ExtraProps extends Record<string, any> = Record<string, never>">
  import type { Snippet } from 'svelte';
  import type {
    FocusableComponentLayout,
    FocusDetails,
    KeyPressDetails,
    Direction
  } from '@noriginmedia/norigin-spatial-navigation-core';
  import SpatialNode from './SpatialNode.svelte';
  import type { FocusableState } from './types';

  // ─── Props ─────────────────────────────────────────────────

  type Props = {
    /** HTML element tag to render (default: 'div') */
    as?: string;
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
    /** Automatically focus this node after it registers */
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

    /** Snippet children receiving FocusableState */
    content?: Snippet<[FocusableState]>;

    /** Any additional HTML attributes (class, style, id, data-*, etc.) */
    [key: string]: any;
  };

  let {
    as = 'div',
    navKey,
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

    content,

    ...restProps
  }: Props = $props();
</script>

<SpatialNode
  {navKey}
  {focusable}
  {saveLastFocusedChild}
  {trackChildren}
  {autoRestoreFocus}
  {forceFocus}
  {autoFocus}
  {isFocusBoundary}
  {focusBoundaryDirections}
  {preferredChildFocusKey}
  {extraProps}
  {accessibilityLabel}
  {onEnterPress}
  {onEnterRelease}
  {onArrowPress}
  {onArrowRelease}
  {onFocus}
  {onBlur}
  bind:focused
  bind:hasFocusedChild
>
  {#snippet children(state)}
    <svelte:element
      this={as}
      use:state.spatial
      data-focused={state.focused || undefined}
      data-has-focused-child={state.hasFocusedChild || undefined}
      {...restProps}
    >
      {@render content?.({ focused: state.focused, hasFocusedChild: state.hasFocusedChild, active: state.active, navKey: state.navKey, focusSelf: state.focusSelf } as FocusableState)}
    </svelte:element>
  {/snippet}
</SpatialNode>
