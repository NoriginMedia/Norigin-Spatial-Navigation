import { SpatialNavigation, ROOT_FOCUS_KEY } from '../SpatialNavigation';

export const createRootNode = () => {
  SpatialNavigation.addFocusable({
    focusKey: ROOT_FOCUS_KEY,
    node: {
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: 1920,
      offsetHeight: 1280,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: true,
    parentFocusKey: undefined,
    focusable: true,
    trackChildren: false,
    forceFocus: true,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

export const createHorizontalLayout = () => {
  createRootNode();

  SpatialNavigation.addFocusable({
    focusKey: 'child-1',
    node: {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 400,
      offsetHeight: 200,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: false,
    parentFocusKey: ROOT_FOCUS_KEY,
    focusable: true,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2',
    node: {
      offsetLeft: 600,
      offsetTop: 100,
      offsetWidth: 400,
      offsetHeight: 200,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: false,
    parentFocusKey: ROOT_FOCUS_KEY,
    focusable: true,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-3',
    node: {
      offsetLeft: 1100,
      offsetTop: 100,
      offsetWidth: 400,
      offsetHeight: 200,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: false,
    parentFocusKey: ROOT_FOCUS_KEY,
    focusable: true,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

export const createVerticalLayout = () => {
  createRootNode();

  SpatialNavigation.addFocusable({
    focusKey: 'child-1',
    node: {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 400,
      offsetHeight: 200,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        scrollLeft: 0,
        scrollTop: 0,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: false,
    parentFocusKey: ROOT_FOCUS_KEY,
    focusable: true,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2',
    node: {
      offsetLeft: 100,
      offsetTop: 600,
      offsetWidth: 400,
      offsetHeight: 200,
      parentElement: {
        offsetLeft: 0,
        offsetTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280
      } as HTMLElement,
      offsetParent: {
        offsetLeft: 0,
        offsetTop: 0,
        scrollLeft: 0,
        scrollTop: 0,
        offsetWidth: 1920,
        offsetHeight: 1280,
        nodeType: Node.ELEMENT_NODE
      } as HTMLElement
    } as unknown as HTMLElement,
    isFocusBoundary: false,
    parentFocusKey: ROOT_FOCUS_KEY,
    focusable: true,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};
