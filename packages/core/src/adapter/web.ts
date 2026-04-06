import { findKey } from 'lodash-es';
import {
  type FocusableComponent,
  type SpatialNavigationService
} from '../SpatialNavigation';
import {
  type Key,
  type AddEventListenersOptions,
  type LayoutAdapter
} from './types';
import { measureLayout } from '../measureLayout';

const getKeyCode = (event: KeyboardEvent) =>
  event.keyCode || event.code || event.key;

export default class BaseWebAdapter implements LayoutAdapter {
  constructor(private service: SpatialNavigationService) {}

  private keyDownEventListener: (event: KeyboardEvent) => void;

  private keyUpEventListener: (event: KeyboardEvent) => void;

  addEventListeners({ keyDown, keyUp }: AddEventListenersOptions) {
    this.keyDownEventListener = (event: KeyboardEvent) => {
      const keyCode = getKeyCode(event);
      const key = findKey(this.service.getKeyMap(), (codeList) =>
        codeList.includes(keyCode)
      ) as Key | undefined;

      if (!key) {
        return;
      }

      if (!this.service.options.shouldUseNativeEvents) {
        event.preventDefault();
        event.stopPropagation();
      }

      keyDown?.(key, event);
    };

    this.keyUpEventListener = (event: KeyboardEvent) => {
      const keyCode = getKeyCode(event);
      const key = findKey(this.service.getKeyMap(), (codeList) =>
        codeList.includes(keyCode)
      ) as Key | undefined;

      if (!key) {
        return;
      }

      keyUp?.(key);
    };

    window.addEventListener('keyup', this.keyUpEventListener);
    window.addEventListener('keydown', this.keyDownEventListener);
  }

  removeEventListeners() {
    window.removeEventListener('keyup', this.keyUpEventListener);
    window.removeEventListener('keydown', this.keyDownEventListener);
  }

  measureLayout = async (component: FocusableComponent) => ({
    ...measureLayout(component.node),
    node: component.node
  });

  blurNode = (component: FocusableComponent) => {
    if (component.node && this.service.options.shouldFocusDOMNode) {
      component.node?.removeAttribute?.('data-focused');
    }
  };

  focusNode = (component: FocusableComponent) => {
    if (component.node && this.service.options.shouldFocusDOMNode) {
      component.node.focus(this.service.options.domNodeFocusOptions);

      component.node?.setAttribute?.('data-focused', 'true');
    }
  };
}
