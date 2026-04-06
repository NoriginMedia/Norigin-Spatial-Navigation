import {
  type FocusableComponent,
  type FocusableComponentLayout
} from '../SpatialNavigation';

export type Key = 'left' | 'right' | 'up' | 'down' | 'enter';

export type KeyDownEventListener = (key: Key, event: Event) => void;

export type KeyUpEventListener = (key: Key) => void;

export type AddEventListenersOptions = {
  keyDown?: KeyDownEventListener;
  keyUp?: KeyUpEventListener;
};

export interface LayoutAdapter {
  addEventListeners: (options: AddEventListenersOptions) => void;
  removeEventListeners: () => void;
  measureLayout: (
    component: FocusableComponent
  ) => Promise<FocusableComponentLayout>;
  focusNode: (component: FocusableComponent) => void;
}
