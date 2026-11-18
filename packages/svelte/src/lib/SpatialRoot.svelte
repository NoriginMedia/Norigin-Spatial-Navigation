<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    SpatialNavigation,
    ROOT_FOCUS_KEY,
    GetBoundingClientRectAdapter,
    type LayoutAdapter
  } from '@noriginmedia/norigin-spatial-navigation-core';
  import {
    setSpatialRootContext,
    setSpatialParentContext,
    type SpatialRootContext,
    type SpatialParentContext
  } from './context';

  // ─── Props ─────────────────────────────────────────────────

  type Props = {
    children?: Snippet;
    /**
     * Focus key to set initial focus on after all nodes are registered.
     * Eliminates the need for setTimeout + setFocus in consumer code.
     */
    initialFocusKey?: string;
    /** Enable console debug logging */
    debug?: boolean;
    /** Enable visual debug overlay */
    visualDebug?: boolean;
    /** Throttle key events in ms (0 = no throttle) */
    throttle?: number;
    /** Keep throttling between keypresses */
    throttleKeypresses?: boolean;
    /**
     * Layout measurement adapter. Pass a class (constructor) or a partial
     * LayoutAdapter implementation. Defaults to the core web adapter.
     * Use `GetBoundingClientRectAdapter` (re-exported) for getBoundingClientRect
     * based measurement.
     */
    layoutAdapter?:
      | (new (...args: any[]) => LayoutAdapter)
      | Partial<LayoutAdapter>;
    /**
     * @deprecated Use `layoutAdapter={GetBoundingClientRectAdapter}` instead.
     * When true (and no `layoutAdapter` is provided), the
     * `GetBoundingClientRectAdapter` is used for layout measurement.
     */
    useGetBoundingClientRect?: boolean;
    /** Focus the DOM node when spatial focus changes */
    shouldFocusDOMNode?: boolean;
    /** Options passed to element.focus() when shouldFocusDOMNode is true */
    domNodeFocusOptions?: FocusOptions;
    /** Don't preventDefault/stopPropagation on key events */
    shouldUseNativeEvents?: boolean;
    /** Enable right-to-left navigation */
    rtl?: boolean;
    /** Algorithm for calculating distances between nodes */
    distanceCalculationMethod?: 'center' | 'edges' | 'corners';
    /** Custom distance calculation function */
    customDistanceCalculationFunction?: (
      refCorners: any,
      siblingCorners: any,
      isVerticalDirection: boolean,
      distanceCalculationMethod: string
    ) => number;
    /** Accessibility callback — invoked with concatenated labels on focus change */
    onUtterText?: (text: string) => void;
    /**
     * Control whether a component is automatically focused when it is added
     * and its focus key was already set as the current focus key
     * (e.g. `setFocus` was called before the component mounted). Default `true`.
     */
    focusOnPresetKey?: boolean;
  };

  let {
    children,
    initialFocusKey,
    debug = false,
    visualDebug = false,
    throttle = 0,
    throttleKeypresses = false,
    layoutAdapter,
    useGetBoundingClientRect = false,
    shouldFocusDOMNode = false,
    domNodeFocusOptions = {},
    shouldUseNativeEvents = false,
    rtl = false,
    distanceCalculationMethod = 'corners',
    customDistanceCalculationFunction,
    onUtterText,
    focusOnPresetKey = true
  }: Props = $props();

  // ─── Context Setup ─────────────────────────────────────────

  const rootContext = $state<SpatialRootContext>({ initialized: false });
  setSpatialRootContext(rootContext);

  const parentContext = $state<SpatialParentContext>({ navKey: ROOT_FOCUS_KEY });
  setSpatialParentContext(parentContext);

  // ─── Lifecycle ─────────────────────────────────────────────

  onMount(() => {
    // Prefer the new layoutAdapter API. Fall back to the deprecated
    // useGetBoundingClientRect flag for backwards compatibility.
    const resolvedLayoutAdapter =
      layoutAdapter ?? (useGetBoundingClientRect ? GetBoundingClientRectAdapter : undefined);

    SpatialNavigation.init({
      debug,
      visualDebug,
      throttle,
      throttleKeypresses,
      layoutAdapter: resolvedLayoutAdapter,
      shouldFocusDOMNode,
      domNodeFocusOptions,
      shouldUseNativeEvents,
      rtl,
      distanceCalculationMethod,
      customDistanceCalculationFunction,
      onUtterText,
      focusOnPresetKey
    });

    rootContext.initialized = true;

    // Set initial focus after all effects have flushed (nodes registered).
    // setTimeout(0) ensures this runs after Svelte's synchronous effect batch.
    if (initialFocusKey) {
      setTimeout(() => {
        SpatialNavigation.setFocus(initialFocusKey);
      }, 0);
    }

    return () => {
      SpatialNavigation.destroy();
      rootContext.initialized = false;
    };
  });

  // ─── Reactive Config Updates ───────────────────────────────
  // Skip the first run (init already applied these values).
  // Only react to CHANGES after initialization.

  let hasInitialized = false;

  $effect(() => {
    if (!rootContext.initialized) return;
    // Read the deps so Svelte tracks them
    const _rtl = rtl;
    const _throttle = throttle;
    const _throttleKeypresses = throttleKeypresses;

    if (!hasInitialized) {
      // First run — init() already handled these values
      hasInitialized = true;
      return;
    }

    // Subsequent runs — a prop actually changed
    SpatialNavigation.updateRtl(_rtl);
    SpatialNavigation.setThrottle({ throttle: _throttle, throttleKeypresses: _throttleKeypresses });
  });
</script>

{@render children?.()}
