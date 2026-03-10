import {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState
} from 'react';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import {
  SpatialNavigation,
  FocusableComponentLayout,
  FocusDetails,
  KeyPressDetails,
  PointerDetails,
  Direction
} from '@noriginmedia/norigin-spatial-navigation-core';
import { useFocusContext } from './useFocusContext';

export type EnterPressHandler<P = object> = (
  props: P,
  details: KeyPressDetails
) => void;

export type EnterReleaseHandler<P = object> = (props: P) => void;

export type ArrowPressHandler<P = object> = (
  direction: string,
  props: P,
  details: KeyPressDetails
) => boolean;

export type ArrowReleaseHandler<P = object> = (
  direction: string,
  props: P
) => void;

export type FocusHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;

export type BlurHandler<P = object> = (
  layout: FocusableComponentLayout,
  props: P,
  details: FocusDetails
) => void;

/**
 * Called when the mouse pointer enters the focusable element.
 * Only fired when `mouseSupport: true` is passed to `init()`.
 */
export type MouseEnterHandler<P = object> = (
  props: P,
  details: PointerDetails
) => void;

/**
 * Called when the mouse pointer leaves the focusable element.
 * Only fired when `mouseSupport: true` is passed to `init()`.
 */
export type MouseLeaveHandler<P = object> = (
  props: P,
  details: PointerDetails
) => void;

/**
 * Called when the focusable element is clicked.
 * Only fired when `mouseSupport: true` is passed to `init()`.
 */
export type ClickHandler<P = object> = (
  props: P,
  details: PointerDetails
) => void;

export interface UseFocusableConfig<P = object> {
  focusable?: boolean;
  saveLastFocusedChild?: boolean;
  trackChildren?: boolean;
  autoRestoreFocus?: boolean;
  forceFocus?: boolean;
  isFocusBoundary?: boolean;
  focusBoundaryDirections?: Direction[];
  focusKey?: string;
  preferredChildFocusKey?: string;
  onEnterPress?: EnterPressHandler<P>;
  onEnterRelease?: EnterReleaseHandler<P>;
  onArrowPress?: ArrowPressHandler<P>;
  onArrowRelease?: ArrowReleaseHandler<P>;
  onFocus?: FocusHandler<P>;
  onBlur?: BlurHandler<P>;
  /**
   * Called when the mouse pointer enters this focusable element.
   * Requires `mouseSupport: true` in `init()`.
   */
  onMouseEnter?: MouseEnterHandler<P>;
  /**
   * Called when the mouse pointer leaves this focusable element.
   * Requires `mouseSupport: true` in `init()`.
   */
  onMouseLeave?: MouseLeaveHandler<P>;
  /**
   * Called when this focusable element is clicked.
   * Requires `mouseSupport: true` in `init()`.
   */
  onClick?: ClickHandler<P>;
  extraProps?: P;
}

export interface UseFocusableResult<E = any> {
  ref: RefObject<E>;
  focusSelf: (focusDetails?: FocusDetails) => void;
  focused: boolean;
  hasFocusedChild: boolean;
  focusKey: string;
}

const useFocusableHook = <P, E = any>({
  focusable = true,
  saveLastFocusedChild = true,
  trackChildren = false,
  autoRestoreFocus = true,
  forceFocus = false,
  isFocusBoundary = false,
  focusBoundaryDirections,
  focusKey: propFocusKey,
  preferredChildFocusKey,
  onEnterPress = noop,
  onEnterRelease = noop,
  onArrowPress = () => true,
  onArrowRelease = noop,
  onFocus = noop,
  onBlur = noop,
  onMouseEnter = noop,
  onMouseLeave = noop,
  onClick = noop,
  extraProps
}: UseFocusableConfig<P> = {}): UseFocusableResult<E> => {
  const onEnterPressHandler = useCallback(
    (details: KeyPressDetails) => {
      onEnterPress(extraProps, details);
    },
    [onEnterPress, extraProps]
  );

  const onEnterReleaseHandler = useCallback(() => {
    onEnterRelease(extraProps);
  }, [onEnterRelease, extraProps]);

  const onArrowPressHandler = useCallback(
    (direction: string, details: KeyPressDetails) =>
      onArrowPress(direction, extraProps, details),
    [extraProps, onArrowPress]
  );

  const onArrowReleaseHandler = useCallback(
    (direction: string) => {
      onArrowRelease(direction, extraProps);
    },
    [onArrowRelease, extraProps]
  );

  const onFocusHandler = useCallback(
    (layout: FocusableComponentLayout, details: FocusDetails) => {
      onFocus(layout, extraProps, details);
    },
    [extraProps, onFocus]
  );

  const onBlurHandler = useCallback(
    (layout: FocusableComponentLayout, details: FocusDetails) => {
      onBlur(layout, extraProps, details);
    },
    [extraProps, onBlur]
  );

  const ref = useRef<E>(null);

  const [focused, setFocused] = useState(false);
  const [hasFocusedChild, setHasFocusedChild] = useState(false);

  const parentFocusKey = useFocusContext();

  /**
   * Either using the propFocusKey passed in, or generating a random one
   */
  const focusKey = useMemo(
    () => propFocusKey || uniqueId('sn:focusable-item-'),
    [propFocusKey]
  );

  const focusSelf = useCallback(
    (focusDetails: FocusDetails = {}) => {
      SpatialNavigation.setFocus(focusKey, focusDetails);
    },
    [focusKey]
  );

  /**
   * Attach per-component mouse event listeners when mouseSupport is enabled.
   * These are separate from the global handlers in SpatialNavigation so that
   * component-level callbacks (onMouseEnter / onMouseLeave / onClick) fire
   * even when a parent handles spatial focus change.
   */
  useEffect(() => {
    if (!SpatialNavigation.isMouseSupportEnabled()) {
      return undefined;
    }

    const node = ref.current as unknown as HTMLElement | null;

    if (!node) {
      return undefined;
    }

    const handleMouseEnter = (event: MouseEvent) => {
      onMouseEnter(extraProps, { event });
    };

    const handleMouseLeave = (event: MouseEvent) => {
      onMouseLeave(extraProps, { event });
    };

    const handleClick = (event: MouseEvent) => {
      onClick(extraProps, { event });
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('click', handleClick);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('click', handleClick);
    };
  }, [onMouseEnter, onMouseLeave, onClick, extraProps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const node: any = ref.current;

    SpatialNavigation.addFocusable({
      focusKey,
      node,
      parentFocusKey,
      preferredChildFocusKey,
      onEnterPress: onEnterPressHandler,
      onEnterRelease: onEnterReleaseHandler,
      onArrowPress: onArrowPressHandler,
      onArrowRelease: onArrowReleaseHandler,
      onFocus: onFocusHandler,
      onBlur: onBlurHandler,
      onUpdateFocus: (isFocused = false) => setFocused(isFocused),
      onUpdateHasFocusedChild: (isFocused = false) =>
        setHasFocusedChild(isFocused),
      saveLastFocusedChild,
      trackChildren,
      isFocusBoundary,
      focusBoundaryDirections,
      autoRestoreFocus,
      forceFocus,
      focusable
    });

    return () => {
      SpatialNavigation.removeFocusable({
        focusKey
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const node: any = ref.current;

    SpatialNavigation.updateFocusable(focusKey, {
      node,
      preferredChildFocusKey,
      focusable,
      isFocusBoundary,
      focusBoundaryDirections,
      onEnterPress: onEnterPressHandler,
      onEnterRelease: onEnterReleaseHandler,
      onArrowPress: onArrowPressHandler,
      onArrowRelease: onArrowReleaseHandler,
      onFocus: onFocusHandler,
      onBlur: onBlurHandler
    });
  }, [
    focusKey,
    preferredChildFocusKey,
    focusable,
    isFocusBoundary,
    focusBoundaryDirections,
    onEnterPressHandler,
    onEnterReleaseHandler,
    onArrowPressHandler,
    onArrowReleaseHandler,
    onFocusHandler,
    onBlurHandler
  ]);

  return {
    ref,
    focusSelf,
    focused,
    hasFocusedChild,
    focusKey // returns either the same focusKey as passed in, or generated one
  };
};

export const useFocusable = useFocusableHook;
