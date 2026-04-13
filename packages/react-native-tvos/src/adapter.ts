import {
  Dimensions,
  EventSubscription,
  Keyboard,
  Platform,
  TVEventControl,
  TVEventHandler,
  HWEvent,
  UIManager
} from 'react-native';

import {
  BaseWebAdapter,
  type AddEventListenersOptions,
  type FocusableComponent,
  type FocusableComponentLayout,
  type Key,
  type LayoutAdapter,
  type SpatialNavigationService
} from '@noriginmedia/norigin-spatial-navigation-core';

type ReactNativeNode = {
  measure: (
    fn: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number
    ) => void
  ) => void;
  measureInWindow: (
    fn: (x: number, y: number, width: number, height: number) => void
  ) => void;
  requestTVFocus: () => void;
  _nativeTag?: number;
  __nativeTag: number;
  _internalFiberInstanceHandleDEV: any;
};

// Override the node type to be ReactNativeNode
declare module '@noriginmedia/norigin-spatial-navigation-core' {
  interface NodeTypeOverrides {
    node: ReactNativeNode;
  }
}

const DEFAULT_KEY_MAP: Record<string, Key> = {
  left: 'left',
  up: 'up',
  right: 'right',
  down: 'down',
  swipeLeft: 'left',
  swipeUp: 'up',
  swipeRight: 'right',
  swipeDown: 'down',
  select: 'enter',
  longLeft: 'left',
  longUp: 'up',
  longRight: 'right',
  longDown: 'down'
};

const EMPTY_LAYOUT: FocusableComponentLayout = {
  x: undefined,
  y: undefined,
  top: undefined,
  left: undefined,
  right: undefined,
  bottom: undefined,
  width: undefined,
  height: undefined,
  node: null as any
};

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

class ReactNativeLayoutAdapter implements LayoutAdapter {
  private keyMap = DEFAULT_KEY_MAP;

  private isPanning = false;

  private panOrigin = { x: 0, y: 0 };

  private panPosition = { x: 0, y: 0 };

  private currentNodeLayout?: FocusableComponentLayout;

  private eventSubscription: EventSubscription | undefined;

  constructor(private service: SpatialNavigationService) {}

  addEventListeners({ keyDown }: AddEventListenersOptions) {
    TVEventControl.enableTVPanGesture();

    this.eventSubscription = TVEventHandler.addListener((event: HWEvent) => {
      const { eventType } = event;

      if (eventType === 'pan') {
        this.panPosition = { x: event.body!.x, y: event.body!.y };
      }

      if (eventType === 'pan' && event.body?.state === 'Began') {
        this.panOrigin = { x: event.body?.x, y: event.body?.y };
        this.isPanning = true;
      }

      if (eventType === 'pan' && event.body?.state === 'Ended') {
        this.isPanning = false;
      }

      if (this.currentNodeLayout && this.isPanning) {
        const xDistance = this.panPosition.x - this.panOrigin.x;
        const yDistance = this.panPosition.y - this.panOrigin.y;

        if (
          Math.abs(xDistance) >
          Math.min(this.currentNodeLayout.width, windowWidth / 3) / 1.1
        ) {
          this.panOrigin = { ...this.panPosition };
          if (xDistance > 0) {
            keyDown?.('right', null);
          } else {
            keyDown?.('left', null);
          }
        } else if (
          Math.abs(yDistance) >
          Math.min(this.currentNodeLayout.height, windowHeight / 3) / 1.1
        ) {
          this.panOrigin = { ...this.panPosition };
          if (yDistance > 0) {
            keyDown?.('down', null);
          } else {
            keyDown?.('up', null);
          }
        }
      }

      if (this.keyMap[eventType]) {
        keyDown?.(this.keyMap[eventType], null);
      }
    });
  }

  removeEventListeners() {
    this.eventSubscription?.remove();
  }

  measureLayout(component: FocusableComponent) {
    const { node } = component;
    return new Promise<FocusableComponentLayout>((resolve) => {
      try {
        node.measure(
          (
            _1: number,
            _2: number,
            rawWidth: number,
            rawHeight: number,
            rawX: number,
            rawY: number
          ) => {
            if (typeof rawX === 'undefined') {
              // This is needed in case of androidTV
              resolve(EMPTY_LAYOUT);

              if (__DEV__ && Platform.OS === 'android') {
                node.measureInWindow((windowX) => {
                  if (typeof windowX === 'undefined') {
                    console.warn(
                      // eslint-disable-next-line max-len, no-underscore-dangle
                      `Couldn't get layout for node ${node._nativeTag}. Ensure that the view is on the hierachy by setting the prop collapsable={false}. Props:`,
                      // eslint-disable-next-line no-underscore-dangle
                      node._internalFiberInstanceHandleDEV.memoizedProps
                    );
                  }
                });
              }

              return;
            }

            // Floor the values to avoid floating point precision issues
            const x = Math.floor(rawX);
            const y = Math.floor(rawY);
            const width = Math.floor(rawWidth);
            const height = Math.floor(rawHeight);

            resolve({
              x,
              y,
              top: y,
              left: x,
              right: x + width,
              bottom: y + height,
              width,
              height,
              node
            });
          }
        );
      } catch {
        resolve(EMPTY_LAYOUT);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  blurNode(component: FocusableComponent) {
    // Nothing to do here
  }

  focusNode(component: FocusableComponent) {
    const { node } = component;
    // Sync the focus with the native focus engine when the keyboard is not visible
    if (Platform.isTV && !Keyboard.isVisible()) {
      // Try to focus the node using the exposed method
      if (node.requestTVFocus) {
        node.requestTVFocus?.();
      } else {
        // TODO: UIManager doesn't exist in the new architecture, need to find a way to do this
        // If native method is not available (aka the ref is not passed to the component), try to focus the node using a command
        // eslint-disable-next-line no-underscore-dangle
        UIManager.dispatchViewManagerCommand(
          node._nativeTag ?? node.__nativeTag,
          'requestTVFocus',
          []
        );
      }
    }

    this.measureLayout(component).then((layout) => {
      this.currentNodeLayout = { ...layout, node };
    });
  }
}

// Conditionally export the appropriate adapter based on the platform
export default (Platform.OS === 'web'
  ? BaseWebAdapter
  : ReactNativeLayoutAdapter) as new (
  service: SpatialNavigationService
) => LayoutAdapter;
