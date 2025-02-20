import {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState
} from 'react';
import {
  SpatialNavigation,
  FocusableComponentLayout,
  FocusDetails,
  KeyPressDetails,
  Direction
} from './SpatialNavigation';
import { useFocusContext } from './useFocusContext';
import { noop, uniqueId } from './utils';

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
  props: P,
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
  extraProps?: P;
}

export interface UseFocusableResult {
  ref: RefObject<any>; // <any> since we don't know which HTML tag is passed here
  focusSelf: (focusDetails?: FocusDetails) => void;
  focused: boolean;
  hasFocusedChild: boolean;
  focusKey: string;
}

const useFocusableHook = <P>({
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
  extraProps
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

  const onArrowReleaseHandler = useCallback((direction: string) => {
    onArrowRelease(direction, extraProps);
  }, [onArrowRelease, extraProps])

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

  const ref = useRef(null);

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

  useEffect(() => {
    const node = ref.current;

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
    const node = ref.current;

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
