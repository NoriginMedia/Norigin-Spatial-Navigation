import {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
  useLayoutEffect
} from 'react';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import {
  SpatialNavigation,
  FocusDetails,
  KeyPressDetails,
  FocusableEventLayout
} from './SpatialNavigation';
import { useFocusContext } from './useFocusedContext';

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

export type FocusHandler<P = object> = (
  layout: FocusableEventLayout,
  props: P,
  details: FocusDetails
) => void;

export type BlurHandler<P = object> = (
  layout: FocusableEventLayout,
  props: P,
  details: FocusDetails
) => void;

export interface UseFocusableConfig<P = object> {
  focusable?: boolean;
  saveLastFocusedChild?: boolean;
  trackChildren?: boolean;
  autoRestoreFocus?: boolean;
  isFocusBoundary?: boolean;
  focusKey?: string;
  preferredChildFocusKey?: string;
  extraProps?: P;
  onEnterPress?: EnterPressHandler<P>;
  onEnterRelease?: EnterReleaseHandler<P>;
  onArrowPress?: ArrowPressHandler<P>;
  onFocus?: FocusHandler<P>;
  onBlur?: BlurHandler<P>;
}

export interface UseFocusableResult {
  ref: RefObject<any>; // <any> since we don't know which HTML tag is passed here
  focusSelf: (focusDetails?: FocusDetails) => void;
  focused: boolean;
  hasFocusedChild: boolean;
  focusKey: string;
  setFocus: (focusKey: string, focusDetails?: FocusDetails) => void;
  navigateByDirection: (direction: string, focusDetails: FocusDetails) => void;
  pause: () => void;
  resume: () => void;
  updateAllLayouts: () => void;
  getCurrentFocusKey: () => string | null;
}

const useFocusableHook = <P>({
  focusable = true,
  saveLastFocusedChild = true,
  trackChildren = false,
  autoRestoreFocus = true,
  isFocusBoundary = false,
  focusKey: propFocusKey,
  preferredChildFocusKey,
  onEnterPress = noop,
  onEnterRelease = noop,
  onArrowPress = () => true,
  onFocus = noop,
  onBlur = noop,
  extraProps = {} as P
}: UseFocusableConfig<P> = {}): UseFocusableResult => {
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

  const onFocusHandler = useCallback(
    (layout: FocusableEventLayout, details: FocusDetails) => {
      onFocus(layout, extraProps, details);
    },
    [extraProps, onFocus]
  );

  const onBlurHandler = useCallback(
    (layout: FocusableEventLayout, details: FocusDetails) => {
      onBlur(layout, extraProps, details);
    },
    [extraProps, onBlur]
  );

  const ref = useRef<HTMLElement | null>(null);

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

  useLayoutEffect(() => {
    const node = ref.current;

    SpatialNavigation.addFocusable({
      focusKey,
      node,
      parentFocusKey,
      preferredChildFocusKey,
      onEnterPress: onEnterPressHandler,
      onEnterRelease: onEnterReleaseHandler,
      onArrowPress: onArrowPressHandler,
      onFocus: onFocusHandler,
      onBlur: onBlurHandler,
      onUpdateFocus: (isFocused = false) => setFocused(isFocused),
      onUpdateHasFocusedChild: (isFocused = false) =>
        setHasFocusedChild(isFocused),
      saveLastFocusedChild,
      trackChildren,
      isFocusBoundary,
      autoRestoreFocus,
      focusable
    });

    return () => {
      SpatialNavigation.removeFocusable({
        focusKey
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    SpatialNavigation.updateFocusable(focusKey, {
      node: ref.current,
      preferredChildFocusKey,
      focusable,
      isFocusBoundary,
      onEnterPress: onEnterPressHandler,
      onEnterRelease: onEnterReleaseHandler,
      onArrowPress: onArrowPressHandler,
      onFocus: onFocusHandler,
      onBlur: onBlurHandler
    });
  }, [
    focusKey,
    preferredChildFocusKey,
    focusable,
    isFocusBoundary,
    onEnterPressHandler,
    onEnterReleaseHandler,
    onArrowPressHandler,
    onFocusHandler,
    onBlurHandler
  ]);

  return {
    ref,
    focusSelf,
    focused,
    hasFocusedChild,
    focusKey, // returns either the same focusKey as passed in, or generated one
    setFocus: SpatialNavigation.isNativeMode()
      ? noop
      : SpatialNavigation.setFocus,
    navigateByDirection: SpatialNavigation.navigateByDirection,
    pause: SpatialNavigation.pause,
    resume: SpatialNavigation.resume,
    updateAllLayouts: SpatialNavigation.updateAllLayouts,
    getCurrentFocusKey: SpatialNavigation.getCurrentFocusKey
  };
};

export const useFocusable = useFocusableHook;
